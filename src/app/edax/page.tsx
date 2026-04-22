"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { STORY } from './story'

interface LogLine {
  id: string
  type: 'edax' | 'user' | 'system'
  text: string
}

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

export default function EdaxPage() {
  const router = useRouter()
  const [log, setLog]                     = useState<LogLine[]>([])
  const [currentTyping, setCurrentTyping] = useState('')
  const [showDots, setShowDots]           = useState(false)
  const [showChoices, setShowChoices]     = useState(false)
  const [nodeId, setNodeId]               = useState('start')
  const [ended, setEnded]                 = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [log, currentTyping, showDots])

  useEffect(() => {
    const node = STORY.find(n => n.id === nodeId)
    if (!node) return
    let cancelled = false
    setShowChoices(false)
    setCurrentTyping('')
    setShowDots(false)

    async function deliver() {
      await sleep(300)
      for (const msg of node!.messages) {
        if (cancelled) return
        setShowDots(true)
        await sleep(Math.min(400 + msg.length * 18, 1500))
        if (cancelled) return
        setShowDots(false)
        for (let i = 1; i <= msg.length; i++) {
          if (cancelled) return
          setCurrentTyping(msg.slice(0, i))
          await sleep(14)
        }
        if (cancelled) return
        setLog(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, type: 'edax', text: msg }])
        setCurrentTyping('')
        await sleep(220)
      }
      if (cancelled) return
      if (node!.isEnd) {
        await sleep(400)
        setLog(prev => [...prev, { id: `sys-${Date.now()}`, type: 'system', text: '* * *' }])
        setEnded(true)
      } else {
        setShowChoices(true)
      }
    }

    deliver()
    return () => { cancelled = true }
  }, [nodeId])

  function handleChoice(text: string, next: string | null) {
    if (!showChoices) return
    setShowChoices(false)
    setLog(prev => [...prev, { id: `user-${Date.now()}`, type: 'user', text }])
    if (next === null) {
      setTimeout(() => {
        setLog(prev => [...prev, { id: `sys-${Date.now()}`, type: 'system', text: '* * *' }])
        setEnded(true)
      }, 300)
    } else {
      setTimeout(() => setNodeId(next), 400)
    }
  }

  const node = STORY.find(n => n.id === nodeId)

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #ffffff; }

        @keyframes cursor-blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        @keyframes dot-pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
        .e-cursor { animation: cursor-blink 0.6s steps(1) infinite; }
        .tdot { animation: dot-pulse 1.2s infinite; }
        .tdot:nth-child(2){animation-delay:0.4s}
        .tdot:nth-child(3){animation-delay:0.8s}

        ::-webkit-scrollbar { width: 16px; }
        ::-webkit-scrollbar-track { background: #c0c0c0; }
        ::-webkit-scrollbar-thumb {
          background: #c0c0c0;
          border-top: 2px solid #ffffff;
          border-left: 2px solid #ffffff;
          border-right: 2px solid #808080;
          border-bottom: 2px solid #808080;
        }

        .ie-link {
          color: #0000cc;
          text-decoration: underline;
          cursor: pointer;
          font-family: Times New Roman, serif;
          font-size: 14px;
          background: none;
          border: none;
          padding: 0;
          display: block;
          margin: 4px 0;
          text-align: left;
        }
        .ie-link:hover { color: #cc0000; }
        .ie-link:active { color: #cc0000; }

        .ie-back-link {
          color: #0000cc;
          text-decoration: underline;
          cursor: pointer;
          font-family: Arial, sans-serif;
          font-size: 11px;
          background: none;
          border: none;
          padding: 0;
        }
        .ie-back-link:hover { color: #cc0000; }
      `}</style>

      {/* IE Address bar */}
      <div style={{
        background: '#c0c0c0',
        borderBottom: '1px solid #808080',
        padding: '3px 6px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '11px',
      }}>
        <button
          className="ie-back-link"
          onClick={() => router.push('/')}
        >
          ◄ Back
        </button>
        <span style={{ color: '#444', margin: '0 4px' }}>|</span>
        <span style={{ color: '#000' }}>Address:</span>
        <div style={{
          flex: 1,
          background: '#fff',
          border: '1px solid #808080',
          borderTop: '1px solid #606060',
          borderLeft: '1px solid #606060',
          padding: '1px 6px',
          fontSize: '11px',
          color: '#000',
          fontFamily: 'Arial, sans-serif',
        }}>
          http://edax.unknown/index.htm
        </div>
        <button style={{
          background: '#c0c0c0',
          border: '1px solid',
          borderColor: '#ffffff #808080 #808080 #ffffff',
          fontSize: '10px',
          padding: '1px 8px',
          cursor: 'pointer',
          fontFamily: 'Arial, sans-serif',
        }}>
          Go
        </button>
      </div>

      {/* Page body */}
      <div style={{
        fontFamily: 'Times New Roman, serif',
        background: '#ffffff',
        minHeight: 'calc(100vh - 52px)',
        padding: 'clamp(12px, 4vw, 20px) clamp(14px, 5vw, 32px) 60px',
        maxWidth: '760px',
        boxSizing: 'border-box',
        width: '100%',
        overflowX: 'hidden',
      }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '4px' }}>
          <div>
            <div style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#000080',
              marginBottom: '2px',
            }}>
              The page cannot be displayed
            </div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#444' }}>
              HTTP 404 — edax.unknown
            </div>
          </div>

          {/* Broken image placeholder */}
          <div style={{
            width: '64px',
            height: '64px',
            border: '1px solid #c0c0c0',
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            position: 'relative',
            marginLeft: '16px',
          }}>
            <div style={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              width: '10px',
              height: '10px',
              background: '#c0c0c0',
              border: '1px solid #808080',
            }} />
            <div style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: '9px',
              color: '#808080',
              textAlign: 'center',
              lineHeight: 1.3,
            }}>
              [image<br/>error]
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #c0c0c0', margin: '10px 0 14px' }} />

        <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#222', margin: '0 0 14px', lineHeight: 1.6 }}>
          The page you are looking for is currently unavailable. The Web site might be
          experiencing technical difficulties, or you may need to adjust your browser settings.
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid #c0c0c0', margin: '0 0 14px' }} />

        <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#808080', margin: '0 0 8px' }}>
          Please try the following:
        </p>

        {/* Dialogue log — styled like error page content that's been taken over */}
        <div style={{
          border: '1px solid',
          borderColor: '#808080 #ffffff #ffffff #808080',
          background: '#ffffff',
          padding: '12px 14px',
          marginBottom: '14px',
          minHeight: '120px',
          maxHeight: 'clamp(180px, 35vh, 320px)',
          overflowY: 'auto',
          fontFamily: 'Courier New, monospace',
          fontSize: '13px',
        }}>
          {log.map(line => {
            if (line.type === 'system') return (
              <div key={line.id} style={{
                color: '#808080',
                textAlign: 'center',
                margin: '10px 0',
                fontSize: '11px',
                fontFamily: 'Arial, sans-serif',
                letterSpacing: '0.15em',
              }}>
                — {line.text} —
              </div>
            )
            if (line.type === 'user') return (
              <div key={line.id} style={{
                color: '#444444',
                margin: '6px 0 10px',
                lineHeight: '1.6',
                fontStyle: 'italic',
              }}>
                &gt; {line.text}
              </div>
            )
            return (
              <div key={line.id} style={{
                color: '#000000',
                lineHeight: '1.7',
                margin: '2px 0',
              }}>
                {line.text}
              </div>
            )
          })}

          {showDots && (
            <div style={{ color: '#000', margin: '4px 0', letterSpacing: '0.2em' }}>
              <span className="tdot">.</span>
              <span className="tdot">.</span>
              <span className="tdot">.</span>
            </div>
          )}

          {currentTyping && (
            <div style={{ color: '#000000', lineHeight: '1.7', margin: '2px 0' }}>
              {currentTyping}<span className="e-cursor">▌</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Choices as classic blue links */}
        <div style={{ marginBottom: '16px' }}>
          {showChoices && node && node.choices.map((c, i) => (
            <button
              key={i}
              className="ie-link"
              onClick={() => handleChoice(c.text, c.next)}
            >
              • {c.text}
            </button>
          ))}

          {ended && (
            <button
              className="ie-link"
              onClick={() => router.push('/')}
            >
              ← Return to previous page
            </button>
          )}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #c0c0c0', margin: '0 0 12px' }} />

        <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#808080', lineHeight: 1.8 }}>
          <div>Technical Information (for support personnel)</div>
          <div style={{ marginLeft: '16px', color: '#555' }}>
            • Error Type: 404 Not Found<br />
            • URL: http://edax.unknown/index.htm<br />
            • Server: unknown<br />
            • Date: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* IE Status bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#c0c0c0',
        borderTop: '1px solid #808080',
        padding: '2px 8px',
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: 'Arial, sans-serif',
        fontSize: '11px',
        color: '#000',
      }}>
        <span>Error on page.</span>
        <span>🌐 Internet zone</span>
      </div>
    </>
  )
}
