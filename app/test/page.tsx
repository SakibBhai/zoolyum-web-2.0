export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>🎉 Deployment Test Page</h1>
      <p>If you can see this, your deployment is working!</p>
      <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
      <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
      <p><strong>NextAuth URL:</strong> {process.env.NEXTAUTH_URL || 'Not set'}</p>
      <p><strong>Database URL:</strong> {process.env.DATABASE_URL ? 'Set ✓' : 'Not set ✗'}</p>
    </div>
  )
}
