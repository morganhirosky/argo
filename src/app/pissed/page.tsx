"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const SCROLL_TEXT = `A problem has been detected and ARGO has been shut down to prevent damage to your computer. PISSED.AVI caused an unexpected error. If this is the first time you've seen this stop error screen restart your computer. If this screen appears again follow these steps. Check to make sure any new hardware or software is properly installed. If this is a new installation ask your hardware or software manufacturer for any updates you might need. If problems continue disable or remove any newly installed hardware or software. Disable BIOS memory options such as caching or shadowing. If you need to use safe mode to remove or disable components restart your computer press F8 to select advanced startup options and then select safe mode. Technical information: STOP 0x0000007E (0xC0000005, 0xF86B5A89, 0xF9573B8C, 0xF9573888) Beginning dump of physical memory. Physical memory dump complete. Contact your system administrator or technical support group for further assistance. `

export default function PissedPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  return (
    <>
      <style>{`
        body { margin: 0; background: #0000AA; }

        @keyframes scroll-up {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }

        .scroll-col {
          animation: scroll-up linear infinite;
        }

        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      <div style={{
        width: '100vw',
        height: '100dvh',
        background: '#0000AA',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>

        {/* Vertical scrolling text columns */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'row',
          gap: '0',
          overflow: 'hidden',
          opacity: 0.15,
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                overflow: 'hidden',
                height: '100%',
              }}
            >
              <div
                className="scroll-col"
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '10px',
                  color: '#ffffff',
                  letterSpacing: '0.04em',
                  lineHeight: '1.6',
                  writingMode: 'horizontal-tb',
                  wordBreak: 'break-all',
                  whiteSpace: 'normal',
                  padding: '0 4px',
                  animationDuration: `${30 + (i % 4) * 8}s`,
                  animationDelay: `${-(i * 3.7)}s`,
                }}
              >
                {(SCROLL_TEXT + SCROLL_TEXT).split(' ').map((word, j) => (
                  <span key={j}>{word} </span>
                ))}
                {(SCROLL_TEXT + SCROLL_TEXT).split(' ').map((word, j) => (
                  <span key={`b${j}`}>{word} </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Scanline overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
        }} />

        {/* Moving scanline sweep */}
        <div style={{
          position: 'absolute',
          left: 0, right: 0,
          height: '120px',
          zIndex: 4,
          pointerEvents: 'none',
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.015) 50%, transparent 100%)',
          animation: 'scanline 6s linear infinite',
        }} />

        {/* Video with CSS filter to integrate it */}
        <video
          src="/PISSED.mp4"
          autoPlay
          loop
          muted
          playsInline
          onLoadedMetadata={e => { e.currentTarget.currentTime = 0 }}
          onSeeked={() => setReady(true)}
          onCanPlay={() => setReady(true)}
          style={{
            opacity: ready ? 1 : 0,
            position: 'relative',
            zIndex: 2,
            display: 'block',
            maxWidth: '80vw',
            maxHeight: '80dvh',
            width: 'auto',
            height: 'auto',
            mixBlendMode: 'normal',
          }}
        />

        {/* Back link */}
        <span
          onClick={() => router.push('/')}
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '20px',
            zIndex: 5,
            fontFamily: "'Courier New', monospace",
            fontSize: '10px',
            color: 'rgba(255,255,255,0.25)',
            cursor: 'pointer',
            letterSpacing: '0.08em',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
        >
          ← return to argo
        </span>

      </div>
    </>
  )
}
