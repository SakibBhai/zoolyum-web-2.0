export default function TestNoMiddleware() {
  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
      <h1>✅ Test Page - No Middleware Block</h1>
      
      <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#d4edda', borderRadius: '5px' }}>
        <h2>Success!</h2>
        <p>If you can see this page, your deployment is working perfectly!</p>
      </div>

      <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
        <h2>Admin Access Status:</h2>
        <p>The middleware is still blocking admin routes.</p>
        <p>But public routes work fine!</p>
      </div>
    </div>
  )
}
