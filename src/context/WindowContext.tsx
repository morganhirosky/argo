"use client"

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { WindowId, WindowState, WindowsMap } from '@/types/window'

const ALL_WINDOWS: WindowId[] = [
  'shop_women', 'shop_men', 'cart', 'readme', 'product_detail', 'checkout', 'confirmation'
]

function makeInitialState(): { windows: WindowsMap; topZ: number } {
  const windows = {} as WindowsMap
  ALL_WINDOWS.forEach((id, i) => {
    windows[id] = { id, isOpen: false, isMinimized: false, zIndex: 100 + i }
  })
  return { windows, topZ: 107 }
}

type WindowAction =
  | { type: 'OPEN_WINDOW'; id: WindowId; meta?: { productId?: string } }
  | { type: 'CLOSE_WINDOW'; id: WindowId }
  | { type: 'FOCUS_WINDOW'; id: WindowId }
  | { type: 'MINIMIZE_WINDOW'; id: WindowId }
  | { type: 'SET_PRODUCT_DETAIL'; productId: string }

function windowReducer(
  state: { windows: WindowsMap; topZ: number },
  action: WindowAction
): { windows: WindowsMap; topZ: number } {
  const newTopZ = state.topZ + 1
  switch (action.type) {
    case 'OPEN_WINDOW': {
      return {
        topZ: newTopZ,
        windows: {
          ...state.windows,
          [action.id]: {
            ...state.windows[action.id],
            isOpen: true,
            isMinimized: false,
            zIndex: newTopZ,
            meta: action.meta ?? state.windows[action.id].meta,
          },
        },
      }
    }
    case 'CLOSE_WINDOW':
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { ...state.windows[action.id], isOpen: false },
        },
      }
    case 'FOCUS_WINDOW':
      return {
        topZ: newTopZ,
        windows: {
          ...state.windows,
          [action.id]: { ...state.windows[action.id], zIndex: newTopZ, isMinimized: false },
        },
      }
    case 'MINIMIZE_WINDOW':
      return {
        ...state,
        windows: {
          ...state.windows,
          [action.id]: { ...state.windows[action.id], isMinimized: !state.windows[action.id].isMinimized },
        },
      }
    case 'SET_PRODUCT_DETAIL': {
      return {
        topZ: newTopZ,
        windows: {
          ...state.windows,
          product_detail: {
            ...state.windows.product_detail,
            isOpen: true,
            isMinimized: false,
            zIndex: newTopZ,
            meta: { productId: action.productId },
          },
        },
      }
    }
    default:
      return state
  }
}

const WindowContext = createContext<{
  state: { windows: WindowsMap; topZ: number }
  dispatch: React.Dispatch<WindowAction>
} | null>(null)

export function WindowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(windowReducer, makeInitialState())
  return (
    <WindowContext.Provider value={{ state, dispatch }}>
      {children}
    </WindowContext.Provider>
  )
}

export function useWindows() {
  const ctx = useContext(WindowContext)
  if (!ctx) throw new Error('useWindows must be used within WindowProvider')
  return ctx
}
