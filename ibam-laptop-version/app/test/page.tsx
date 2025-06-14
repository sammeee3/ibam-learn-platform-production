export default function TestPage() {
  return (
    <div style={{padding: '40px', fontFamily: 'Arial'}}>
      <h1>🎯 Static Test Page</h1>
      <p><strong>SUCCESS!</strong> If you see this, the redirect loop is broken!</p>
      <p>Your Next.js app is working properly.</p>
      <hr style={{margin: '20px 0'}} />
      <h2>Authentication System Status:</h2>
      <p>✅ Next.js running correctly</p>
      <p>✅ Pages can load without redirects</p>
      <p>✅ Ready to fix dashboard redirect</p>
      <hr style={{margin: '20px 0'}} />
      <p><a href="/auth/login" style={{color: 'blue'}}>Test Login Page</a></p>
      <p><a href="/dashboard" style={{color: 'blue'}}>Test Dashboard (may redirect)</a></p>
    </div>
  );
}
