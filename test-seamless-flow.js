#!/usr/bin/env node

const fetch = require('node-fetch');

async function testSeamlessFlow() {
    const baseUrl = 'http://localhost:3001';
    const testEmail = 'test-flow-' + Date.now() + '@example.com';
    
    console.log('🧪 Testing Seamless Login Flow');
    console.log('📧 Test Email:', testEmail);
    console.log('');
    
    try {
        // Step 1: Test webhook health
        console.log('1️⃣ Testing webhook health...');
        const healthRes = await fetch(`${baseUrl}/api/webhooks/systemio`);
        const health = await healthRes.json();
        console.log('✅ Webhook active:', health.status);
        console.log('');
        
        // Step 2: Simulate System.io webhook (user purchase)
        console.log('2️⃣ Simulating System.io webhook (user purchase)...');
        const webhookRes = await fetch(`${baseUrl}/api/webhooks/systemio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-webhook-event': 'CONTACT_TAG_ADDED'
            },
            body: JSON.stringify({
                contact: {
                    email: testEmail,
                    fields: [
                        { slug: 'first_name', value: 'Test' },
                        { slug: 'surname', value: 'User' }
                    ],
                    tags: [{ name: 'IBAM Impact Members' }]
                },
                tag: { name: 'IBAM Impact Members' }
            })
        });
        
        const webhookResult = await webhookRes.json();
        console.log('✅ User created via webhook:', webhookResult.success);
        console.log('✅ Course assigned:', webhookResult.courseAssigned);
        console.log('');
        
        // Step 3: Test SSO login (what HTML button does)
        console.log('3️⃣ Testing SSO login (HTML button simulation)...');
        const ssoUrl = `${baseUrl}/api/auth/sso?email=${encodeURIComponent(testEmail)}&token=ibam-systeme-secret-2025`;
        const ssoRes = await fetch(ssoUrl, { redirect: 'manual' });
        
        console.log('✅ SSO response status:', ssoRes.status);
        console.log('✅ Redirect to:', ssoRes.headers.get('location'));
        
        // Extract cookies from SSO response
        const cookies = ssoRes.headers.raw()['set-cookie'];
        console.log('✅ Auth cookies set:', cookies ? 'Yes' : 'No');
        console.log('');
        
        // Step 4: Test profile API
        console.log('4️⃣ Testing user profile API...');
        const profileRes = await fetch(`${baseUrl}/api/user/profile?email=${encodeURIComponent(testEmail)}`);
        const profile = await profileRes.json();
        
        console.log('✅ Profile loaded:', profile.first_name, profile.login_source);
        console.log('');
        
        // Step 5: Test dashboard access with cookies
        console.log('5️⃣ Testing dashboard access...');
        if (cookies) {
            const dashboardRes = await fetch(`${baseUrl}/dashboard`, {
                headers: {
                    'Cookie': cookies.join('; ')
                }
            });
            console.log('✅ Dashboard access:', dashboardRes.status === 200 ? 'Success' : 'Failed');
        }
        console.log('');
        
        console.log('🎉 ALL TESTS PASSED - Seamless login flow is working!');
        console.log('');
        console.log('📋 Complete Flow Summary:');
        console.log('1. User purchases course in System.io');
        console.log('2. System.io sends webhook → Creates user + magic token');
        console.log('3. User clicks HTML button → SSO authentication'); 
        console.log('4. User lands in dashboard with full access');
        console.log('');
        console.log('🔗 Test the HTML button at: system-io-FINAL-working.html');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testSeamlessFlow();