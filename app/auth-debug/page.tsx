import { auth } from '@/lib/next-auth'

export default async function AuthDebugPage() {
  let session = null
  let error = null

  try {
    session = await auth()
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error'
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🔍 Authentication Debug Page</h1>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h2>Environment Variables:</h2>
        <ul>
          <li>NEXTAUTH_URL: {process.env.NEXTAUTH_URL ? '✅ Set' : '❌ Missing'}</li>
          <li>NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing'}</li>
          <li>DATABASE_URL: {process.env.DATABASE_URL ? '✅ Set' : '❌ Missing'}</li>
          <li>NODE_ENV: {process.env.NODE_ENV || 'Not set'}</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h2>NextAuth Session:</h2>
        {error ? (
          <div style={{ color: 'red' }}>
            <strong>Error:</strong> {error}
          </div>
        ) : session ? (
          <div>
            <p>✅ Session found</p>
            <pre>{JSON.stringify(session, null, 2)}</pre>
          </div>
        ) : (
          <p>❌ No session (not logged in)</p>
        )}
      </div>

      <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '5px' }}>
        <h2>Next Steps:</h2>
        <p><strong>If you see this page:</strong> Your app is deployed correctly!</p>
        <p><strong>If environment variables are set:</strong> NextAuth is configured</p>
        <p><strong>If there's no error above:</strong> NextAuth is working</p>

        <div style={{ marginTop: '20px' }}>
          <a href="/admin/login" style={{
            padding: '10px 20px',
            backgroundColor: '#FF5001',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            display: 'inline-block'
          }}>
            Go to Admin Login →
          </a>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
        <h2>Common Issues:</h2>
        <ul>
          <li><strong>Middleware blocking:</strong> Check browser console for errors</li>
          <li><strong>Wrong NEXTAUTH_URL:</strong> Must match your deployed domain exactly</li>
          <li><strong>Session not persisting:</strong> Check browser cookies</li>
        </ul>
      </div>
    </div>
  )
}
