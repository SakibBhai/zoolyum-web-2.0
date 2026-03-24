'use client'

import { useEffect } from 'react'

export default function TestNoAuthPage() {
  useEffect(() => {
    // Store that we accessed this page
    sessionStorage.setItem('test-no-auth', 'true')
  }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🎉 Test Page - No Authentication Required</h1>

      <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#d4edda', borderRadius: '5px' }}>
        <h2>✅ Good News!</h2>
        <p>If you can see this page, your deployment is working perfectly!</p>
        <p>The issue is specifically with NextAuth, not your app deployment.</p>
      </div>

      <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h2>🔍 What This Tells Us:</h2>
        <ul>
          <li>✅ Your Next.js app is deployed</li>
          <li>✅ Pages are rendering correctly</li>
          <li>✅ Routing is working</li>
          <li>❌ NextAuth authentication has issues</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
        <h2>🔧 Next Steps to Fix Authentication:</h2>
        <ol>
          <li><strong>Check /api/test-auth</strong> - Look at the JSON response</li>
          <li><strong>Check Vercel Function Logs</strong> - Look for NextAuth errors</li>
          <li><strong>Verify NEXTAUTH_SECRET</strong> - Make sure it's set correctly</li>
          <li><strong>Check middleware</strong> - See if auth() is failing</li>
        </ol>
      </div>

      <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '5px' }}>
        <h2>📊 What I Need From You:</h2>
        <p><strong>Please visit:</strong> <code>https://zoolyum-web-20.vercel.app/api/test-auth</code></p>
        <p><strong>Copy and paste the JSON response here.</strong></p>
        <p>This will show me exactly what NextAuth is seeing and help me fix the issue.</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <a href="/admin/dashboard" style={{
          padding: '10px 20px',
          backgroundColor: '#FF5001',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '5px',
          display: 'inline-block'
        }}>
          Try Accessing Dashboard →
        </a>
      </div>
    </div>
  )
}
