'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

function ReaderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawUrl = searchParams.get('url')
  const [isHovered, setIsHovered] = useState(false)

  // Resolve the URL: if it's a relative path starting with '/', prepend the backend API URL
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5273'
  const url = rawUrl?.startsWith('/') ? `${baseUrl}${rawUrl}` : rawUrl

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#12100e', /* Dark warm theme */
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        height: '64px',
        padding: '0 24px',
        background: 'rgba(43, 33, 31, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
        zIndex: 10
      }}>
        <button 
          onClick={() => router.back()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            background: isHovered ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            padding: '8px 16px',
            color: '#f5ebe0',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            outline: 'none'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        <div style={{ flex: 1 }} />
        {url && (
          <div style={{ 
            color: 'rgba(245, 235, 224, 0.5)', 
            fontSize: '13px',
            maxWidth: '300px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontWeight: 500
          }}>
            {url}
          </div>
        )}
      </header>
      
      <main style={{ flex: 1, width: '100%', position: 'relative' }}>
        {url ? (
          <iframe 
            src={url} 
            style={{ 
              width: '100%', 
              height: '100%', 
              border: 'none',
              background: '#1a1a1a'
            }}
            title="PDF Reader"
          />
        ) : (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '100%', 
            height: '100%', 
            color: '#f5ebe0',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(245, 235, 224, 0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <path d="M14 2v6h6"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <p style={{ margin: 0, opacity: 0.7 }}>No document URL provided</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default function ReaderPage() {
  return (
    <Suspense fallback={
      <div style={{ width: '100vw', height: '100vh', background: '#12100e' }} />
    }>
      <ReaderContent />
    </Suspense>
  )
}
