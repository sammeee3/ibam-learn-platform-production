const { createClient } = require('@supabase/supabase-js');

// Production database
const productionSupabase = createClient(
  'https://tutrnikhomrgcpkzszvq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0'
);

// Staging database
const stagingSupabase = createClient(
  'https://yhfxxouswctucxvfetcq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnh4b3Vzd2N0dWN4dmZldGNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTQ0OTk3NCwiZXhwIjoyMDcxMDI1OTc0fQ.z4-H9xZVC-zjv4LEljpOfGXAFJdeCz1LThTD5iZCRqM'
);

async function exportProductionSchema() {
  console.log('📤 EXPORTING PRODUCTION SCHEMA');
  console.log('=' .repeat(50));

  try {
    // Get production user_profiles structure
    const { data: prodUsers } = await productionSupabase.from('user_profiles').select('*').limit(1);
    const { data: stagingUsers } = await stagingSupabase.from('user_profiles').select('*').limit(1);

    if (prodUsers.length === 0) {
      console.log('❌ No production users found to analyze schema');
      return null;
    }

    if (stagingUsers.length === 0) {
      console.log('❌ No staging users found to analyze schema');
      return null;
    }

    const productionColumns = Object.keys(prodUsers[0]).sort();
    const stagingColumns = Object.keys(stagingUsers[0]).sort();

    console.log(`\n📊 PRODUCTION SCHEMA (${productionColumns.length} columns):`);
    console.log(`📊 STAGING SCHEMA (${stagingColumns.length} columns):`);

    // Find missing columns in staging
    const missingColumns = productionColumns.filter(col => !stagingColumns.includes(col));
    const extraColumns = stagingColumns.filter(col => !productionColumns.includes(col));

    console.log(`\n🔍 SCHEMA ANALYSIS:`);
    console.log(`   Missing in staging: ${missingColumns.length} columns`);
    console.log(`   Extra in staging: ${extraColumns.length} columns`);

    console.log(`\n❌ MISSING COLUMNS IN STAGING:`);
    missingColumns.forEach(col => console.log(`   - ${col}`));

    console.log(`\n➕ EXTRA COLUMNS IN STAGING:`);
    extraColumns.forEach(col => console.log(`   - ${col}`));

    // Analyze column types from production data
    const sampleUser = prodUsers[0];
    const columnAnalysis = {};

    Object.entries(sampleUser).forEach(([key, value]) => {
      let sqlType = 'TEXT';
      
      if (value === null) {
        sqlType = 'TEXT'; // Default for null values
      } else if (typeof value === 'boolean') {
        sqlType = 'BOOLEAN';
      } else if (typeof value === 'number') {
        if (Number.isInteger(value)) {
          sqlType = 'INTEGER';
        } else {
          sqlType = 'DECIMAL(10,2)';
        }
      } else if (Array.isArray(value)) {
        sqlType = 'TEXT[]';
      } else if (typeof value === 'object') {
        sqlType = 'JSONB';
      } else if (typeof value === 'string') {
        if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
          sqlType = 'TIMESTAMPTZ';
        } else if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
          sqlType = 'DATE';
        } else {
          sqlType = 'TEXT';
        }
      }

      columnAnalysis[key] = {
        type: sqlType,
        sampleValue: value,
        isMissing: missingColumns.includes(key)
      };
    });

    return {
      productionColumns,
      stagingColumns,
      missingColumns,
      extraColumns,
      columnAnalysis,
      sampleUser
    };

  } catch (error) {
    console.log('❌ Error exporting schema:', error.message);
    return null;
  }
}

async function generateStagingUpgradeSQL(schemaData) {
  console.log('\n🔧 GENERATING STAGING UPGRADE SQL');
  console.log('-' .repeat(50));

  if (!schemaData) {
    console.log('❌ No schema data available');
    return '';
  }

  const { missingColumns, columnAnalysis } = schemaData;

  let sql = `-- STAGING SCHEMA UPGRADE: Add Production Columns\n`;
  sql += `-- Generated: ${new Date().toISOString()}\n`;
  sql += `-- Purpose: Upgrade staging user_profiles to match production schema\n\n`;

  sql += `-- Add missing columns from production\n`;
  sql += `ALTER TABLE public.user_profiles\n`;

  const alterStatements = [];

  missingColumns.forEach(column => {
    const analysis = columnAnalysis[column];
    let defaultValue = '';

    // Set appropriate defaults based on column name and type
    if (column.includes('count') || column.includes('level') || column.includes('points')) {
      defaultValue = ' DEFAULT 0';
    } else if (analysis.type === 'BOOLEAN') {
      if (column.includes('is_active') || column.includes('has_')) {
        defaultValue = ' DEFAULT true';
      } else {
        defaultValue = ' DEFAULT false';
      }
    } else if (analysis.type === 'TEXT[]' || analysis.type === 'JSONB') {
      if (analysis.type === 'TEXT[]') {
        defaultValue = " DEFAULT '{}'";
      } else {
        defaultValue = " DEFAULT '{}'";
      }
    } else if (analysis.type === 'TIMESTAMPTZ') {
      // Don't set default for timestamps
      defaultValue = '';
    } else if (analysis.type === 'TEXT') {
      // Special defaults for specific columns
      if (column === 'location_country') {
        defaultValue = " DEFAULT 'USA'";
      } else if (column === 'member_type_key') {
        defaultValue = " DEFAULT 'impact_member'";
      } else if (column === 'subscription_status') {
        defaultValue = " DEFAULT 'active'";
      } else if (column === 'primary_role_key') {
        defaultValue = " DEFAULT 'course_student'";
      } else if (column === 'subscription_tier') {
        defaultValue = " DEFAULT 'impact_member'";
      }
    }

    alterStatements.push(`ADD COLUMN IF NOT EXISTS ${column} ${analysis.type}${defaultValue}`);
  });

  sql += alterStatements.join(',\n');
  sql += ';\n\n';

  // Add indexes for important columns
  sql += `-- Create indexes for performance\n`;
  const indexColumns = [
    'member_type_key',
    'subscription_status', 
    'systeme_customer_id',
    'systemio_contact_id',
    'last_activity',
    'tier_level'
  ];

  indexColumns.forEach(column => {
    if (missingColumns.includes(column)) {
      sql += `CREATE INDEX IF NOT EXISTS idx_user_profiles_${column} ON public.user_profiles(${column});\n`;
    }
  });

  sql += '\n-- Update existing records with appropriate defaults\n';
  sql += `UPDATE public.user_profiles SET\n`;
  
  const updateStatements = [];
  missingColumns.forEach(column => {
    const analysis = columnAnalysis[column];
    
    if (column === 'member_type_key') {
      updateStatements.push(`  member_type_key = COALESCE(member_type_key, 'impact_member')`);
    } else if (column === 'subscription_status') {
      updateStatements.push(`  subscription_status = COALESCE(subscription_status, 'active')`);
    } else if (column === 'tier_level') {
      updateStatements.push(`  tier_level = COALESCE(tier_level, 1)`);
    } else if (column === 'login_count') {
      updateStatements.push(`  login_count = COALESCE(login_count, 0)`);
    } else if (column === 'current_level') {
      updateStatements.push(`  current_level = COALESCE(current_level, 1)`);
    } else if (column === 'location_country') {
      updateStatements.push(`  location_country = COALESCE(location_country, 'USA')`);
    }
  });

  if (updateStatements.length > 0) {
    sql += updateStatements.join(',\n');
    sql += '\nWHERE id IS NOT NULL;\n';
  }

  return sql;
}

async function runSchemaExportAndGeneration() {
  console.log('🚀 PRODUCTION TO STAGING SCHEMA UPGRADE');
  console.log('=' .repeat(60));

  // Export schema
  const schemaData = await exportProductionSchema();
  
  if (!schemaData) {
    console.log('❌ Schema export failed');
    return;
  }

  // Generate upgrade SQL
  const upgradeSQL = await generateStagingUpgradeSQL(schemaData);

  if (upgradeSQL) {
    // Save SQL to file
    const fs = require('fs');
    const filename = `staging-upgrade-${Date.now()}.sql`;
    fs.writeFileSync(filename, upgradeSQL);
    
    console.log(`\n💾 UPGRADE SQL SAVED TO: ${filename}`);
    console.log(`📏 SQL Length: ${upgradeSQL.length} characters`);
    console.log(`🔧 Columns to add: ${schemaData.missingColumns.length}`);

    // Show preview
    console.log('\n📋 SQL PREVIEW (first 500 chars):');
    console.log('-' .repeat(50));
    console.log(upgradeSQL.substring(0, 500) + '...');
  }

  console.log('\n✅ SCHEMA EXPORT AND SQL GENERATION COMPLETE');
  return { schemaData, upgradeSQL };
}

// Run the export
runSchemaExportAndGeneration();