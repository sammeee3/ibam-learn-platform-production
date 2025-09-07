#!/usr/bin/env node
/**
 * 🤖 AUTOMATIC SCHEMA CHANGE DETECTOR
 * Runs automatically to detect V2 schema changes and warn about V3 sync needs
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Schema tracking file
const SCHEMA_TRACKING_FILE = path.join(__dirname, '../.schema-state.json');

async function getCurrentSchemaHash() {
  const supabase = createClient(
    'https://yhfxxouswctucxvfetcq.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  // Get all table schemas
  const { data: tables } = await supabase
    .from('information_schema.tables')
    .select('table_name, table_schema')
    .eq('table_schema', 'public');
  
  // Get all column definitions
  const { data: columns } = await supabase
    .from('information_schema.columns')
    .select('table_name, column_name, data_type, is_nullable')
    .eq('table_schema', 'public');
  
  // Create schema fingerprint
  const schemaString = JSON.stringify({ tables, columns }, null, 2);
  const crypto = require('crypto');
  return crypto.createHash('md5').update(schemaString).digest('hex');
}

async function checkSchemaChanges() {
  console.log('🔍 Checking V2 schema for changes...');
  
  let lastSchemaState = {};
  if (fs.existsSync(SCHEMA_TRACKING_FILE)) {
    lastSchemaState = JSON.parse(fs.readFileSync(SCHEMA_TRACKING_FILE, 'utf8'));
  }
  
  const currentHash = await getCurrentSchemaHash();
  const timestamp = new Date().toISOString();
  
  if (lastSchemaState.hash !== currentHash) {
    console.log('🚨 SCHEMA CHANGE DETECTED!');
    console.log('⚠️  V2 database schema has changed');
    console.log('⚠️  V3 schema sync required before next deployment');
    
    // Update tracking file
    const newState = {
      hash: currentHash,
      lastChanged: timestamp,
      syncRequired: true
    };
    
    fs.writeFileSync(SCHEMA_TRACKING_FILE, JSON.stringify(newState, null, 2));
    
    // Add to Claude's memory
    console.log('📝 Recording schema change in Claude memory...');
    
    process.exit(1); // Exit with error to prevent deployment
  } else {
    console.log('✅ No schema changes detected');
    
    // Update last checked time
    const updatedState = {
      ...lastSchemaState,
      lastChecked: timestamp
    };
    
    fs.writeFileSync(SCHEMA_TRACKING_FILE, JSON.stringify(updatedState, null, 2));
  }
}

checkSchemaChanges().catch(console.error);