export default function AdminTest() {
  return (
    <div style={{padding: "40px"}}>
      <h1>Admin Test Page</h1>
      <p>SUCCESS! This should not redirect!</p>
      <p>Testing if dashboard word triggers redirects.</p>
      <a href="/test">Back to Test</a>
    </div>
  );
}
