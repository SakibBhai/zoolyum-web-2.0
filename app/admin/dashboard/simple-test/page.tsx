'use client'

import { useEffect } from 'react'

export default function SimpleTestPage() {
  useEffect(() => {
    sessionStorage.setItem('admin-test', 'true')
  }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
      <h1>✅ Admin Dashboard Test</h1>
      
      <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#d4edda', borderRadius: '5px' }}>
        <h2>Good News!</h2>
        <p>If you can see this page, your deployment is working!</p>
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
