'use client'

import { useSession } from 'next-auth/react'
import { signIn } from 'next-auth/react'

export default function TestAuthPage() {
  const { data: session, status } = useSession()

  const handleLogin = async () => {
    await signIn('credentials', {
      email: 'admin@zoolyum.com',
      password: 'admin123',
      callbackUrl: '/test-auth'
    })
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Authentication Test Page</h1>

      <div style={{ marginBottom: '20px' }}>
        <strong>Status:</strong> {status}
      </div>

      {status === 'loading' && <p>Loading...</p>}

      {status === 'authenticated' && (
        <div>
          <h2>✅ Authenticated!</h2>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
      )}

      {status === 'unauthenticated' && (
        <div>
          <h2>❌ Not Authenticated</h2>
          <button onClick={handleLogin} style={{ padding: '10px 20px' }}>
            Login with admin credentials
          </button>
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
        <h3>Test Steps:</h3>
        <ol>
          <li>Check if you see "Authenticated" above</li>
          <li>If not, click the login button</li>
          <li>You should be redirected back here with session data</li>
        </ol>
      </div>
    </div>
  )
}
