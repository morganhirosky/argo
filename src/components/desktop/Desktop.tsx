"use client"

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useWindows } from '@/context/WindowContext'
import { WindowId } from '@/types/window'

import Window from '@/components/window/Window'
import DesktopIcon from './DesktopIcon'
import Taskbar from './Taskbar'
import GlitchText from '@/components/ui/GlitchText'

import ProductGrid from '@/components/shop/ProductGrid'
import ProductDetail from '@/components/shop/ProductDetail'
import CartWindow from '@/components/cart/CartWindow'
import CheckoutWindow from '@/components/checkout/CheckoutWindow'
import OrderConfirmation from '@/components/checkout/OrderConfirmation'

const WINDOW_CONFIG: Record<WindowId, { title: string; width: number; height: number; initialPosition: { x: number; y: number } }> = {
  shop_women:     { title: 'shop_women/ — argo',   width: 820, height: 680, initialPosition: { x: 80,  y: 60  } },
  shop_men:       { title: 'shop_men/ — argo',     width: 820, height: 680, initialPosition: { x: 120, y: 80  } },
  cart:           { title: 'cart.exe — argo',      width: 420, height: 480, initialPosition: { x: 320, y: 100 } },
  readme:         { title: 'readme.txt',           width: 380, height: 320, initialPosition: { x: 200, y: 120 } },
  product_detail: { title: 'product_detail',       width: 740, height: 800, initialPosition: { x: 220, y: 10  } },
  checkout:       { title: 'checkout.exe — argo',  width: 440, height: 560, initialPosition: { x: 160, y: 50  } },
  confirmation:   { title: 'order_confirm — argo', width: 420, height: 380, initialPosition: { x: 200, y: 130 } },
}

const ICON_POSITIONS = [
  { top: '12%',  left: '8%'  },   // shop_women — top left
  { top: '60%',  left: '6%'  },   // shop_men   — bottom left
  { top: '10%',  right: '7%' },   // cart       — top right
  { bottom: '8%', right: '8%' },  // readme     — bottom right
  { top: '22%', right: '12%' },   // edax — top right
  { top: '40%', left: '8%'  },    // heart
  { top: '48%', right: '7%'  },   // pissed
]

const ICONS: { id?: WindowId; label: string; icon: string; color?: string; href?: string }[] = [
  { id: 'shop_women', label: 'shop_women/', icon: '📁', color: 'var(--purple)' },
  { id: 'shop_men',   label: 'shop_men/',   icon: '📁', color: 'var(--cyan)' },
  { id: 'cart',       label: 'cart.exe',    icon: '🛒', color: 'var(--red)' },
  { id: 'readme',     label: 'readme.txt',  icon: '📄', color: 'var(--text-dim)' },
  { label: 'edax',    icon: '💾', color: '#0000FF', href: '/edax' },
  { label: 'heart',   icon: '🫀', color: '#ff3c3c', href: '/heart', hideLabel: true },
  { label: 'PISSED.avi', icon: '💣', color: '#ff6600', href: '/pissed', hideLabel: true },
]

export default function Desktop() {
  const { state, dispatch } = useWindows()
  const [orderNumber, setOrderNumber] = useState<string>('')
  const [glitching, setGlitching] = useState(false)
  const router = useRouter()

  const handleEdaxOpen = useCallback(() => {
    setGlitching(true)
    setTimeout(() => router.push('/edax'), 900)
  }, [router])

  const openWindows = Object.values(state.windows).filter((w) => w.isOpen)

  const renderContent = (id: WindowId) => {
    switch (id) {
      case 'shop_women':  return <ProductGrid category="women" />
      case 'shop_men':    return <ProductGrid category="men" />
      case 'cart':        return <CartWindow />
      case 'readme':      return <ReadmeContent />
      case 'product_detail': {
        const productId = state.windows.product_detail.meta?.productId
        return productId ? <ProductDetail productId={productId} /> : null
      }
      case 'checkout':    return <CheckoutWindow onConfirm={(n) => { setOrderNumber(n); dispatch({ type: 'OPEN_WINDOW', id: 'confirmation' }) }} />
      case 'confirmation':return <OrderConfirmation orderNumber={orderNumber} />
      default:            return null
    }
  }

  return (
    <div
      style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#ffffff' }}
    >
      {/* Centered brand heading */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        pointerEvents: 'none',
      }}>
        <GlitchText
          text="argo"
          style={{
            fontFamily: "Arial, sans-serif",
            fontWeight: 400,
            fontSize: 'clamp(48px, 10vw, 120px)',
            color: '#111111',
            letterSpacing: '0',
          }}
          interval={6000}
        />
      </div>

      {/* Desktop icons — scattered */}
      {ICONS.map((icon, i) => (
        <div key={icon.label} style={{ position: 'absolute', ...ICON_POSITIONS[i], zIndex: 2 }}>
          <DesktopIcon
            {...icon}
            onDoubleClick={icon.label === 'edax' ? handleEdaxOpen : undefined}
          />
        </div>
      ))}

      {/* Glitch overlay */}
      {glitching && <GlitchOverlay />}

      {/* Windows */}
      {openWindows.map((w) => {
        const cfg = WINDOW_CONFIG[w.id]
        const initialPosition = (w.id === 'shop_women' || w.id === 'shop_men')
          ? { x: cfg.initialPosition.x, y: Math.max(0, Math.round((window.innerHeight - 36 - cfg.height) / 2) - 14) }
          : cfg.initialPosition
        return (
          <Window
            key={w.id}
            id={w.id}
            title={cfg.title}
            initialPosition={initialPosition}
            width={cfg.width}
            height={cfg.height}
            zIndex={w.zIndex}
            isMinimized={w.isMinimized}
          >
            {renderContent(w.id)}
          </Window>
        )
      })}

      {/* Taskbar */}
      <Taskbar />
    </div>
  )
}

function GlitchOverlay() {
  return (
    <>
      <style>{`
        @keyframes ie-crash {
          0%   { opacity: 0; }
          8%   { opacity: 1; background: #c0c0c0; }
          18%  { opacity: 1; background: #000080; }
          28%  { opacity: 1; background: #c0c0c0; clip-path: inset(0 0 60% 0); }
          38%  { opacity: 1; background: #000080; clip-path: inset(30% 0 0 0); }
          50%  { opacity: 1; background: #000080; clip-path: none; }
          62%  { opacity: 1; background: #c0c0c0; clip-path: inset(50% 0 10% 0); }
          72%  { opacity: 1; background: #000080; }
          82%  { opacity: 1; background: #c0c0c0; }
          90%  { opacity: 1; background: #000080; }
          100% { opacity: 1; background: #000080; }
        }
        .glitch-overlay { animation: ie-crash 0.9s steps(1) forwards; }
        @keyframes error-text-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .glitch-error-text { animation: error-text-blink 0.15s steps(1) infinite; }
      `}</style>
      <div
        className="glitch-overlay"
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: '#000080',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div className="glitch-error-text" style={{
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: 'bold',
          letterSpacing: '0.05em',
          textAlign: 'center',
          lineHeight: 2,
        }}>
          <div>A fatal exception has occurred.</div>
          <div style={{ color: '#ffff00', fontSize: '11px', marginTop: '8px' }}>
            ERROR: edax.exe — accessing restricted process
          </div>
        </div>
      </div>
    </>
  )
}

function ReadmeContent() {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
      <div className="terminal" style={{ height: '100%' }}>
        <div style={{ marginBottom: '12px', color: 'var(--text-dim)' }}>readme.txt — argo v1.0</div>
        <div style={{ marginBottom: '8px' }}>{'>'} argo is a clothing brand.</div>
        <div style={{ marginBottom: '8px' }}>{'>'} every shirt is designed in-house.</div>
        <div style={{ marginBottom: '8px' }}>{'>'} small runs. limited quantities.</div>
        <div style={{ marginBottom: '16px' }}>{'>'} 100% cotton. unisex sizing available.</div>
        <div style={{ color: 'var(--text-dim)', fontSize: '11px' }}>
          double-click a folder to browse.<br />
          click a product to view details.<br />
          add to cart, checkout when ready.
        </div>
      </div>
    </div>
  )
}
