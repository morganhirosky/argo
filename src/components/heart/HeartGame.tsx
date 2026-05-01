"use client"

import React, { useReducer, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// ─── Pixel Art Engine ─────────────────────────────────────────────────────────
interface Rect { x: number; y: number; w?: number; h?: number; color: string }

function PixelArt({ rects, bg, cols, rows, scale, style }: {
  rects: Rect[]; bg: string; cols: number; rows: number; scale?: number; style?: React.CSSProperties
}) {
  const W = cols * (scale ?? 1), H = rows * (scale ?? 1)
  return (
    <svg
      {...(scale !== undefined ? { width: W, height: H } : {})}
      viewBox={`0 0 ${cols} ${rows}`}
      style={{ imageRendering: 'pixelated', display: 'block', shapeRendering: 'crispEdges', ...style }}
    >
      <rect x={0} y={0} width={cols} height={rows} fill={bg} />
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w ?? 1} height={r.h ?? 1} fill={r.color} />
      ))}
    </svg>
  )
}

// ─── Palette ──────────────────────────────────────────────────────────────────
const P = {
  sky:    '#1a0000', star:   '#ffcccc', stone:  '#776655', stone2: '#4a3322',
  stone3: '#2a1a10', shadow: '#060000', ground: '#1a0800', ground2:'#0e0400',
  fire:   '#ff6600', fire2:  '#ffaa00', wood:   '#663322', wood2:  '#441a0a',
  iron:   '#3a2a22', void:   '#020000', red:    '#cc1100', red2:   '#880800',
  gold:   '#ffaa00', gold2:  '#aa6600', purple: '#220088', white:  '#ffddcc',
  silver: '#998877', chain:  '#776655', gloom:  '#0a0000', indoor: '#0e0000',
  flesh:  '#aa8866', flesh2: '#cc9977', blue:   '#0055cc', blue2:  '#2277ee',
}

// ─── Scene Art (20 × 14 at 8×) ───────────────────────────────────────────────
const SCENES_ART: Record<string, { bg: string; rects: Rect[] }> = {
  GATEHOUSE: {
    bg: P.sky,
    rects: [
      // stars
      {x:2,y:1,color:P.star},{x:9,y:0,color:P.star},{x:17,y:1,color:P.star},{x:14,y:2,color:P.star},
      // left wall
      {x:0,y:3,w:5,h:11,color:P.stone2},{x:0,y:3,w:1,h:11,color:P.stone},
      // right wall
      {x:15,y:3,w:5,h:11,color:P.stone2},{x:19,y:3,w:1,h:11,color:P.stone},
      // battlements
      {x:0,y:2,w:2,color:P.stone2},{x:3,y:2,w:2,color:P.stone2},
      {x:15,y:2,w:2,color:P.stone2},{x:18,y:2,w:2,color:P.stone2},
      // arch pillars
      {x:5,y:4,w:2,h:10,color:P.stone3},{x:13,y:4,w:2,h:10,color:P.stone3},
      // arch opening (pointed gothic)
      {x:7,y:6,w:6,h:8,color:P.shadow},{x:7,y:5,w:6,color:P.shadow},
      {x:8,y:4,w:4,color:P.shadow},{x:9,y:3,w:2,color:P.shadow},
      // torches
      {x:4,y:6,color:P.fire2},{x:4,y:7,color:P.fire},
      {x:15,y:6,color:P.fire2},{x:15,y:7,color:P.fire},
      // ground
      {x:0,y:12,w:20,h:2,color:P.ground},{x:6,y:12,w:8,h:2,color:P.ground2},
    ],
  },
  IRON_GATE: {
    bg: P.indoor,
    rects: [
      {x:0,y:0,w:3,h:14,color:P.stone2},{x:0,y:0,w:1,h:14,color:P.stone},
      {x:17,y:0,w:3,h:14,color:P.stone2},{x:19,y:0,w:1,h:14,color:P.stone},
      // bars
      ...[4,6,8,10,12,14,16].map(x => ({x,y:0,w:1,h:12,color:P.iron})),
      ...[4,6,8,10,12,14,16].map(x => ({x,y:0,w:1,h:3,color:P.silver})),
      // horizontal rails
      {x:3,y:3,w:14,h:1,color:P.stone3},{x:3,y:8,w:14,h:1,color:P.stone3},
      // lock
      {x:9,y:5,w:2,h:2,color:P.gold},{x:10,y:6,w:1,color:P.gold2},
      // ground
      {x:0,y:12,w:20,h:2,color:P.ground},{x:3,y:12,w:14,h:2,color:P.ground2},
    ],
  },
  OUTER_BAILEY: {
    bg: P.gloom,
    rects: [
      {x:0,y:0,w:20,h:2,color:P.stone2},{x:0,y:2,w:20,color:P.stone3},
      {x:0,y:0,w:3,h:14,color:P.stone3},{x:0,y:0,w:1,h:14,color:P.stone2},
      {x:17,y:0,w:3,h:14,color:P.stone3},{x:19,y:0,w:1,h:14,color:P.stone2},
      // torches
      {x:3,y:3,color:P.fire2},{x:3,y:4,color:P.fire},{x:3,y:5,color:P.fire},
      {x:2,y:4,color:P.fire},{x:4,y:4,color:P.fire},
      {x:16,y:3,color:P.fire2},{x:16,y:4,color:P.fire},{x:16,y:5,color:P.fire},
      {x:15,y:4,color:P.fire},{x:17,y:4,color:P.fire},
      // floor
      {x:0,y:11,w:20,h:3,color:P.stone3},{x:0,y:12,w:20,h:2,color:P.stone2},
      {x:7,y:11,color:P.shadow},{x:12,y:12,color:P.shadow},
      // deep corridor
      {x:7,y:3,w:6,h:8,color:P.void},
      {x:8,y:4,w:4,h:7,color:'#02010a'},{x:9,y:5,w:2,h:6,color:'#050215'},
    ],
  },
  DRAWBRIDGE: {
    bg: P.void,
    rects: [
      // abyss sides
      {x:0,y:0,w:4,h:14,color:P.shadow},{x:16,y:0,w:4,h:14,color:P.shadow},
      // far gate
      {x:4,y:0,w:12,h:4,color:P.stone3},{x:6,y:0,w:8,h:6,color:P.stone3},
      {x:8,y:2,w:4,h:4,color:P.void},
      // bridge planks
      {x:4,y:7,w:12,h:4,color:P.wood},
      {x:4,y:7,w:12,color:P.wood2},{x:4,y:9,w:12,color:P.wood2},{x:4,y:11,w:12,color:P.wood2},
      // rails
      {x:4,y:6,w:12,color:P.wood2},{x:4,y:11,w:12,color:P.wood2},
      // chains
      {x:4,y:6,color:P.silver},{x:5,y:5,color:P.silver},{x:6,y:4,color:P.silver},{x:7,y:3,color:P.silver},
      {x:15,y:6,color:P.silver},{x:14,y:5,color:P.silver},{x:13,y:4,color:P.silver},{x:12,y:3,color:P.silver},
      // void below
      {x:4,y:11,w:12,h:3,color:P.void},
    ],
  },
  GREAT_HALL: {
    bg: P.gloom,
    rects: [
      {x:0,y:0,w:20,h:2,color:P.stone2},
      // chandelier
      {x:9,y:0,w:2,color:P.gold},{x:8,y:1,color:P.fire},{x:9,y:1,color:P.fire2},{x:10,y:1,color:P.fire2},{x:11,y:1,color:P.fire},
      // pillars
      {x:2,y:2,w:2,h:9,color:P.stone2},{x:2,y:2,w:1,h:9,color:P.stone},
      {x:1,y:2,color:P.stone2},{x:4,y:2,color:P.stone2},{x:1,y:10,color:P.gold2},{x:4,y:10,color:P.gold2},
      {x:16,y:2,w:2,h:9,color:P.stone2},{x:17,y:2,w:1,h:9,color:P.stone},
      {x:15,y:2,color:P.stone2},{x:18,y:2,color:P.stone2},{x:15,y:10,color:P.gold2},{x:18,y:10,color:P.gold2},
      // banners
      {x:1,y:3,w:2,h:5,color:P.red},{x:1,y:7,w:2,color:P.red2},
      {x:17,y:3,w:2,h:5,color:P.red},{x:17,y:7,w:2,color:P.red2},
      // throne
      {x:8,y:8,w:4,h:4,color:P.stone3},{x:9,y:6,w:2,h:2,color:P.stone2},
      {x:9,y:5,w:2,color:P.gold2},{x:9,y:6,color:P.red2},{x:10,y:6,color:P.red2},
      // floor
      {x:0,y:11,w:20,h:3,color:P.stone2},
      ...Array.from({length:10},(_,i)=>({x:i*2,y:11,color:P.stone3})),
      ...Array.from({length:10},(_,i)=>({x:i*2+1,y:12,color:P.stone3})),
    ],
  },
  HIDDEN_PASSAGE: {
    bg: P.shadow,
    rects: [
      {x:0,y:0,w:5,h:14,color:P.stone3},{x:0,y:0,w:1,h:14,color:P.stone2},
      {x:15,y:0,w:5,h:14,color:P.stone3},{x:19,y:0,w:1,h:14,color:P.stone2},
      {x:5,y:0,w:10,h:2,color:P.stone2},{x:5,y:12,w:10,h:2,color:P.stone2},
      {x:5,y:2,w:10,h:10,color:P.shadow},
      {x:8,y:3,w:4,h:9,color:'#060210'},{x:9,y:4,w:2,h:8,color:'#090318'},
      // cracks
      {x:3,y:4,color:P.shadow},{x:3,y:5,color:P.shadow},{x:2,y:5,color:P.shadow},
      {x:16,y:7,color:P.shadow},{x:17,y:8,color:P.shadow},
      {x:1,y:9,w:2,color:'#1a3322'},{x:18,y:6,color:'#1a3322'},
    ],
  },
  INNER_SANCTUM: {
    bg: P.gloom,
    rects: [
      {x:0,y:0,w:20,h:2,color:P.stone3},
      {x:8,y:0,w:4,h:2,color:P.stone2},{x:9,y:0,w:2,h:2,color:P.gold2},
      // pillars
      {x:1,y:2,w:3,h:10,color:P.stone2},{x:1,y:2,w:1,h:10,color:P.stone},
      {x:0,y:2,w:5,color:P.gold2},{x:0,y:11,w:5,color:P.gold2},
      {x:16,y:2,w:3,h:10,color:P.stone2},{x:18,y:2,w:1,h:10,color:P.stone},
      {x:15,y:2,w:5,color:P.gold2},{x:15,y:11,w:5,color:P.gold2},
      // banners
      {x:0,y:3,w:2,h:7,color:P.red},{x:18,y:3,w:2,h:7,color:P.red},
      // throne
      {x:7,y:7,w:6,h:5,color:P.stone2},{x:8,y:5,w:4,h:2,color:P.stone},
      {x:9,y:4,w:2,color:P.gold},{x:9,y:5,w:2,color:P.gold2},
      {x:9,y:7,color:P.white},{x:10,y:7,color:P.white},
      {x:9,y:8,color:P.red2},{x:10,y:8,color:P.red2},
      // floor
      {x:0,y:12,w:20,h:2,color:P.stone2},
      ...Array.from({length:10},(_,i)=>({x:i*2,y:12,color:P.stone3})),
      ...Array.from({length:10},(_,i)=>({x:i*2+1,y:13,color:P.stone3})),
    ],
  },
  DARK_TOWER: {
    bg: '#0d0418',
    rects: [
      {x:0,y:0,w:20,h:4,color:'#170620'},{x:2,y:0,w:5,h:3,color:'#1f082a'},{x:12,y:1,w:6,h:2,color:'#1f082a'},
      // lightning
      {x:11,y:1,color:P.fire2},{x:10,y:2,color:P.fire2},{x:11,y:3,color:P.fire2},{x:10,y:4,color:P.fire},
      // tower walls
      {x:3,y:3,w:4,h:11,color:P.stone2},{x:3,y:3,w:1,h:11,color:P.stone},
      {x:13,y:3,w:4,h:11,color:P.stone2},{x:16,y:3,w:1,h:11,color:P.stone},
      // battlements
      {x:3,y:2,w:1,h:2,color:P.stone2},{x:5,y:2,w:2,color:P.stone2},
      {x:13,y:2,w:2,color:P.stone2},{x:16,y:2,w:1,h:2,color:P.stone2},
      // interior darkness
      {x:7,y:3,w:6,h:11,color:P.shadow},
      // ominous eye
      {x:8,y:5,w:4,h:3,color:'#110022'},
      {x:9,y:6,w:2,color:P.red},{x:9,y:5,w:2,color:'#330011'},{x:9,y:7,w:2,color:'#330011'},
      {x:8,y:6,color:P.red2},{x:11,y:6,color:P.red2},
      // arrow slits
      {x:6,y:8,color:P.void},{x:7,y:8,color:P.void},{x:12,y:8,color:P.void},{x:13,y:8,color:P.void},
      // ground
      {x:0,y:12,w:20,h:2,color:P.ground},{x:6,y:12,w:8,h:2,color:P.ground2},
    ],
  },
}

// ─── Enemy Art (12 × 16 at 8×) ───────────────────────────────────────────────
const ENEMIES_ART: Record<string, { bg: string; rects: Rect[] }> = {
  IRON_KNIGHT: {
    bg: P.gloom,
    rects: [
      // helmet
      {x:3,y:1,w:6,h:4,color:P.chain},{x:3,y:1,w:1,h:4,color:P.silver},{x:8,y:1,w:1,h:4,color:P.stone2},
      // visor
      {x:4,y:3,w:4,color:P.red2},{x:4,y:3,w:1,color:P.red},
      // plume
      {x:5,y:0,w:2,color:P.red},
      // pauldrons
      {x:1,y:5,w:3,h:2,color:P.silver},{x:1,y:5,w:1,h:2,color:P.white},
      {x:8,y:5,w:3,h:2,color:P.silver},{x:10,y:5,w:1,h:2,color:P.stone2},
      // body chainmail
      {x:3,y:7,w:6,h:5,color:P.chain},{x:3,y:7,w:1,h:5,color:P.silver},{x:8,y:7,w:1,h:5,color:P.stone3},
      // chain dots
      ...[7,9,11].flatMap(y=>[3,5,7].map(x=>({x,y,color:P.stone3}))),
      // belt
      {x:3,y:12,w:6,color:P.gold2},{x:5,y:12,w:2,color:P.gold},
      // legs
      {x:3,y:13,w:3,h:3,color:P.silver},{x:6,y:13,w:3,h:3,color:P.silver},
      {x:3,y:13,w:1,h:3,color:P.white},
      // sword
      {x:10,y:3,w:1,h:7,color:P.silver},{x:10,y:4,w:2,color:P.gold},{x:10,y:10,color:P.wood},{x:10,y:11,color:P.wood},
      // shield
      {x:0,y:7,w:2,h:5,color:P.iron},{x:0,y:7,w:1,h:5,color:P.silver},{x:0,y:9,color:P.red},
      // shadow
      {x:2,y:15,w:8,color:'#080208'},
    ],
  },
  STONE_GOLEM: {
    bg: P.gloom,
    rects: [
      // body
      {x:2,y:2,w:8,h:9,color:'#556677'},{x:2,y:2,w:1,h:9,color:P.stone},{x:9,y:2,w:1,h:9,color:P.stone3},
      // texture
      {x:3,y:3,w:2,color:P.stone3},{x:7,y:4,w:2,color:P.stone3},{x:3,y:7,color:P.stone3},{x:8,y:6,w:2,color:P.stone3},
      {x:4,y:9,w:3,color:P.stone3},{x:2,y:5,color:P.stone2},
      // cracks
      {x:5,y:3,color:P.shadow},{x:5,y:4,color:P.shadow},{x:6,y:5,color:P.shadow},{x:8,y:7,color:P.shadow},
      // eyes
      {x:3,y:4,w:2,h:2,color:'#553300'},{x:3,y:5,w:2,color:P.fire},{x:3,y:4,w:1,color:P.fire2},{x:4,y:4,color:P.fire2},
      {x:7,y:4,w:2,h:2,color:'#553300'},{x:7,y:5,w:2,color:P.fire},{x:7,y:4,w:1,color:P.fire2},{x:8,y:4,color:P.fire2},
      // mouth
      {x:4,y:8,w:4,color:P.shadow},
      // arms
      {x:0,y:5,w:2,h:5,color:'#4a5a6a'},{x:10,y:5,w:2,h:5,color:'#4a5a6a'},
      // fists
      {x:0,y:9,w:3,h:3,color:P.stone},{x:9,y:9,w:3,h:3,color:P.stone},
      // legs
      {x:3,y:11,w:2,h:4,color:'#556677'},{x:7,y:11,w:2,h:4,color:'#556677'},
      {x:2,y:14,w:8,color:'#0a0810'},
    ],
  },
  CHAOS_WRAITH: {
    bg: '#080010',
    rects: [
      // outer aura
      {x:2,y:1,w:8,h:13,color:'#110033'},{x:3,y:1,w:6,h:11,color:'#1a0044'},
      // body
      {x:4,y:2,w:4,h:9,color:P.blue},{x:5,y:2,w:2,h:7,color:P.blue2},
      // wispy edges
      ...[3,6,9].map(y=>({x:3,y,color:'#2211aa'})),
      ...[4,7,10].map(y=>({x:8,y,color:'#2211aa'})),
      {x:4,y:1,color:'#3322bb'},{x:7,y:1,color:'#3322bb'},
      {x:5,y:11,color:'#2211aa'},{x:6,y:12,color:'#1100aa'},{x:7,y:11,color:'#1100aa'},
      // eyes
      {x:4,y:4,w:2,h:2,color:P.void},{x:6,y:4,w:2,h:2,color:P.void},
      {x:4,y:5,color:P.purple},{x:7,y:5,color:P.purple},
      // mouth
      {x:5,y:7,w:2,color:'#220055'},
      // tail/wisps
      {x:4,y:12,w:4,h:2,color:'#1a0044'},{x:5,y:13,w:2,color:'#110033'},
      // glow highlight
      {x:6,y:2,color:P.white},{x:5,y:3,color:'#aabbff'},
    ],
  },
  DARK_SOVEREIGN: {
    bg: P.gloom,
    rects: [
      // crown
      {x:4,y:0,w:4,h:1,color:P.gold},{x:4,y:1,w:4,h:1,color:P.gold2},
      {x:3,y:1,color:P.gold},{x:8,y:1,color:P.gold},
      {x:4,y:0,color:P.red},{x:6,y:0,color:P.red2},{x:8,y:0,color:P.red},
      // head
      {x:3,y:2,w:6,h:4,color:P.flesh},{x:3,y:2,w:1,h:4,color:P.flesh2},{x:8,y:2,w:1,h:4,color:'#665544'},
      // eyes
      {x:4,y:3,w:2,color:P.red},{x:4,y:3,w:1,color:'#ff4455'},
      {x:6,y:3,w:2,color:P.red},{x:6,y:3,w:1,color:'#ff4455'},
      {x:5,y:4,color:'#776655'},
      {x:4,y:5,w:4,color:'#443322'},
      // robe
      {x:1,y:5,w:10,h:11,color:'#0d0015'},{x:1,y:5,w:1,h:11,color:'#1a0025'},{x:10,y:5,w:1,h:11,color:'#06000c'},
      // robe folds
      ...[7,9,11,13].map(y=>({x:3,y,color:'#1a0025'})),
      ...[8,10,12].map(y=>({x:8,y,color:'#06000c'})),
      // hands
      {x:0,y:9,w:2,h:3,color:'#221122'},{x:10,y:9,w:2,h:3,color:'#221122'},
      // orb
      {x:0,y:8,color:P.purple},{x:0,y:9,color:'#5522aa'},
      // aura
      ...[6,10,14].flatMap(y=>[{x:1,y,color:'#2a0044'},{x:10,y,color:'#2a0044'}]),
      // shadow
      {x:2,y:15,w:8,color:'#080308'},
    ],
  },
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = 'title' | 'explore' | 'combat' | 'victory' | 'gameover'
type ItemId = 'BLOOD_TONIC' | 'SACRED_ELIXIR' | 'BATTLE_FURY'
type EnemyId = 'IRON_KNIGHT' | 'STONE_GOLEM' | 'CHAOS_WRAITH' | 'DARK_SOVEREIGN'

interface LiveEnemy {
  id: EnemyId; name: string; currentHp: number; maxHp: number
  atk: number; amorReward: number; loot: ItemId | null
}
interface GameState {
  phase: Phase; scene: string; hp: number; maxHp: number; amor: number
  inventory: ItemId[]; log: string[]; enemy: LiveEnemy | null; postCombatScene: string
}
type Action =
  | { type: 'START' } | { type: 'CHOOSE'; idx: number }
  | { type: 'COMBAT'; move: 'attack' | 'special' | 'item' | 'flee' } | { type: 'RESTART' }

// ─── Game Data ────────────────────────────────────────────────────────────────
const ITEMS: Record<ItemId, { name: string; hpRestore?: number; dmgBonus?: number }> = {
  BLOOD_TONIC:   { name: 'BLOOD TONIC',   hpRestore: 25 },
  SACRED_ELIXIR: { name: 'SACRED ELIXIR', hpRestore: 40 },
  BATTLE_FURY:   { name: 'BATTLE FURY',   dmgBonus:  45 },
}

const ENEMY_DATA: Record<EnemyId, Omit<LiveEnemy, 'currentHp'>> = {
  IRON_KNIGHT:    { id:'IRON_KNIGHT',    name:'IRON KNIGHT',    maxHp:45, atk:10, amorReward:20, loot:'BLOOD_TONIC'   },
  STONE_GOLEM:    { id:'STONE_GOLEM',    name:'STONE GOLEM',    maxHp:60, atk:15, amorReward:25, loot:'SACRED_ELIXIR' },
  CHAOS_WRAITH:   { id:'CHAOS_WRAITH',   name:'CHAOS WRAITH',   maxHp:50, atk:18, amorReward:30, loot:'BATTLE_FURY'   },
  DARK_SOVEREIGN: { id:'DARK_SOVEREIGN', name:'DARK SOVEREIGN', maxHp:80, atk:22, amorReward:0,  loot:null            },
}

interface Choice {
  label: string; lines?: string[]; nextScene?: string
  hpDelta?: number; addItem?: ItemId
  startCombat?: EnemyId; postCombatScene?: string
}
interface Scene { title: string; lines: string[]; choices: Choice[]; art: string }

const SCENES: Record<string, Scene> = {
  GATEHOUSE: {
    title: '⚔  THE GATEHOUSE',
    art: 'GATEHOUSE',
    lines: ['You stand before the Scarlet Keep.','The portcullis is raised. Torches flicker.','Something stirs beyond the arch.'],
    choices: [
      { label: 'SEARCH THE COURTYARD', lines:['You find a bloodied vial lodged in the stonework.'], addItem:'BLOOD_TONIC', nextScene:'GATEHOUSE_SEARCHED' },
      { label: 'PASS THROUGH THE ARCH', nextScene:'IRON_GATE' },
    ],
  },
  GATEHOUSE_SEARCHED: {
    title: '⚔  THE GATEHOUSE',
    art: 'GATEHOUSE',
    lines: ['The courtyard holds nothing more.','The iron gate waits ahead.'],
    choices: [{ label: 'APPROACH THE IRON GATE', nextScene:'IRON_GATE' }],
  },
  IRON_GATE: {
    title: '⚔  THE IRON GATE',
    art: 'IRON_GATE',
    lines: ['A portcullis bars the passage.','The iron is ancient. The lock, heavier.','You could force it or find the mechanism.'],
    choices: [
      { label: 'FORCE THE GATE', lines:['The iron bites back.'], hpDelta:-15, nextScene:'OUTER_BAILEY' },
      { label: 'FIND THE MECHANISM', lines:['You locate the release. The gate groans open.'], nextScene:'OUTER_BAILEY' },
    ],
  },
  OUTER_BAILEY: {
    title: '⚔  THE OUTER BAILEY',
    art: 'OUTER_BAILEY',
    lines: ['The outer courtyard. Cold. Dark.','Torchlight casts no warmth here.','A figure in iron steps from the shadow.','⚔  IRON KNIGHT  blocks the passage.'],
    choices: [{ label: 'DRAW YOUR WEAPON', startCombat:'IRON_KNIGHT', postCombatScene:'DRAWBRIDGE' }],
  },
  DRAWBRIDGE: {
    title: '⚔  THE DRAWBRIDGE',
    art: 'DRAWBRIDGE',
    lines: ['A drawbridge spans an abyss.','Below: nothing. Only dark.','The far gate stands open.'],
    choices: [
      { label: 'SEARCH THE PLANKS', lines:['Between the boards, a sealed vial.'], addItem:'SACRED_ELIXIR', nextScene:'DRAWBRIDGE_SEARCHED' },
      { label: 'CROSS', nextScene:'GREAT_HALL' },
    ],
  },
  DRAWBRIDGE_SEARCHED: {
    title: '⚔  THE DRAWBRIDGE',
    art: 'DRAWBRIDGE',
    lines: ['Nothing more beneath the planks.','The great hall lies ahead.'],
    choices: [{ label: 'CROSS', nextScene:'GREAT_HALL' }],
  },
  GREAT_HALL: {
    title: '⚔  THE GREAT HALL',
    art: 'GREAT_HALL',
    lines: ['Twin pillars. Crimson banners. Dead air.','An empty throne at the far end.','Something vast and still fills the aisle.','⚔  STONE GOLEM  awakens.'],
    choices: [{ label: 'FIGHT', startCombat:'STONE_GOLEM', postCombatScene:'HIDDEN_PASSAGE' }],
  },
  HIDDEN_PASSAGE: {
    title: '⚔  THE HIDDEN PASSAGE',
    art: 'HIDDEN_PASSAGE',
    lines: ['A narrow passage cut through old stone.','The darkness ahead is absolute.','You are tired.'],
    choices: [
      { label: 'REST IN THE DARK  (+25 HP)', lines:['You press your back to the stone. Breathe.'], hpDelta:25, nextScene:'INNER_SANCTUM' },
      { label: 'PRESS ON', nextScene:'INNER_SANCTUM' },
    ],
  },
  INNER_SANCTUM: {
    title: '⚔  THE INNER SANCTUM',
    art: 'INNER_SANCTUM',
    lines: ['Ornate. Ancient. Wrong.','The walls hum with something broken.','An irregular pulse fills the air.','⚔  CHAOS WRAITH  manifests.'],
    choices: [{ label: 'FACE IT', startCombat:'CHAOS_WRAITH', postCombatScene:'DARK_TOWER' }],
  },
  DARK_TOWER: {
    title: '⚔  THE DARK TOWER',
    art: 'DARK_TOWER',
    lines: ['The tower. Storm above. Lightning below.','An eye watches from the stone face.','The one who rules this keep awaits.','⚔  DARK SOVEREIGN  descends.'],
    choices: [{ label: 'STAND YOUR GROUND', startCombat:'DARK_SOVEREIGN', postCombatScene:'__VICTORY__' }],
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const clamp = (v:number,min:number,max:number) => Math.min(max,Math.max(min,v))
const rand  = (min:number,max:number) => Math.floor(Math.random()*(max-min+1))+min
const push  = (log:string[],...lines:string[]):string[] => [...log,...lines].slice(-40)

function enterScene(log:string[], id:string):string[] {
  const s = SCENES[id]; if(!s) return log
  return push(log, '', `— ${s.title} —`, ...s.lines)
}

function hpBar(cur:number,max:number,len=10):string {
  const f = Math.round((cur/max)*len)
  return '█'.repeat(f)+'░'.repeat(len-f)
}

// ─── Initial State + Reducer ──────────────────────────────────────────────────
const INIT: GameState = {
  phase:'title', scene:'GATEHOUSE', hp:100, maxHp:100, amor:0,
  inventory:[], log:[], enemy:null, postCombatScene:'',
}

function reducer(state:GameState, action:Action):GameState {
  switch(action.type) {

    case 'START': return {
      ...INIT, phase:'explore',
      log: enterScene(push([],'⚔  SCARLET KEEP  ⚔','','You are THE WANDERER.','The keep holds something that must be destroyed.','Find it. End it. Escape.'), 'GATEHOUSE'),
    }

    case 'RESTART': return { ...INIT }

    case 'CHOOSE': {
      const s = SCENES[state.scene]; const c = s?.choices[action.idx]; if(!c) return state
      let log = push(state.log, `> ${c.label}`)
      if(c.lines) log = push(log,...c.lines)
      let hp = state.hp, amor = state.amor, inv = [...state.inventory]
      // mechanism bonus amor
      if(c.label.startsWith('FIND THE MECHANISM')) amor += 10
      if(c.hpDelta) {
        hp = clamp(hp+c.hpDelta,0,state.maxHp)
        log = push(log, c.hpDelta<0
          ? `  ${Math.abs(c.hpDelta)} damage.  [${hp}/${state.maxHp} HP]`
          : `  Restored ${c.hpDelta} HP.  [${hp}/${state.maxHp} HP]`)
      }
      if(c.addItem) { inv.push(c.addItem); log=push(log,`  Found: ${ITEMS[c.addItem].name}`) }
      if(hp<=0) return {...state,hp:0,amor,inventory:inv,log:push(log,'','> you fall.','> THE WANDERER has perished.'),phase:'gameover',enemy:null}
      if(c.startCombat) {
        const e = ENEMY_DATA[c.startCombat]; const enemy:LiveEnemy={...e,currentHp:e.maxHp}
        return {...state,hp,amor,inventory:inv,
          log:push(log,'',`  ⚔  ${enemy.name}`,`  HP  ${hpBar(enemy.currentHp,enemy.maxHp)}  [${enemy.currentHp}/${enemy.maxHp}]`),
          phase:'combat',enemy,postCombatScene:c.postCombatScene||''}
      }
      const next=c.nextScene||state.scene
      return {...state,scene:next,hp,amor,inventory:inv,log:enterScene(log,next),phase:'explore'}
    }

    case 'COMBAT': {
      if(!state.enemy||state.phase!=='combat') return state
      let log=[...state.log],hp=state.hp,amor=state.amor,ehp=state.enemy.currentHp,inv=[...state.inventory]
      switch(action.move){
        case 'attack': { const d=rand(15,28); ehp-=d; log=push(log,`> STRIKE — ${d} dmg`); break }
        case 'special': {
          if(amor<30) return {...state,log:push(log,'> Not enough AMOR. (need 30)')}
          amor-=30; ehp-=45; log=push(log,'> BLOOD RAGE — 45 dmg!  [-30 AMOR]'); break
        }
        case 'item': {
          const hi=inv.findIndex(i=>ITEMS[i].hpRestore); const di=inv.findIndex(i=>ITEMS[i].dmgBonus)
          if(hi!==-1){ const it=inv[hi]; const h=ITEMS[it].hpRestore!; hp=clamp(hp+h,0,state.maxHp); inv.splice(hi,1); log=push(log,`> ${ITEMS[it].name}  +${h} HP  [${hp}/${state.maxHp}]`) }
          else if(di!==-1){ const it=inv[di]; const d=ITEMS[it].dmgBonus!; ehp-=d; inv.splice(di,1); log=push(log,`> ${ITEMS[it].name}  ${d} dmg!`) }
          else return {...state,log:push(log,'> No usable items.')}
          break
        }
        case 'flee': {
          if(Math.random()>0.4) return {...state,hp,amor,inventory:inv,log:push(log,'> You flee into the dark.'),phase:'explore',enemy:null}
          log=push(log,'> Retreat failed.'); break
        }
      }
      if(ehp<=0){
        log=push(log,'',`  ⚔  ${state.enemy.name} falls.`)
        amor+=state.enemy.amorReward
        if(state.enemy.amorReward>0) log=push(log,`  +${state.enemy.amorReward} AMOR`)
        if(state.enemy.loot){ inv.push(state.enemy.loot); log=push(log,`  Received: ${ITEMS[state.enemy.loot].name}`) }
        if(state.postCombatScene==='__VICTORY__')
          return {...state,hp,amor,inventory:inv,enemy:null,phase:'victory',
            log:push(log,'','⚔  ⚔  ⚔  ⚔  ⚔','','THE DARK SOVEREIGN crumbles.','The keep goes silent.','You climb out through the tower.','You emerge into grey light.','','it is over.  THE WANDERER endures.')}
        const next=state.postCombatScene
        return {...state,scene:next,hp,amor,inventory:inv,log:enterScene(log,next),phase:'explore',enemy:null}
      }
      const ed=Math.max(1,state.enemy.atk+rand(-3,3)); hp=clamp(hp-ed,0,state.maxHp)
      log=push(log,`  ${state.enemy.name} — ${ed} dmg  [${hp}/${state.maxHp} HP]`)
      if(hp<=0) return {...state,hp:0,amor,inventory:inv,
        log:push(log,'','> you fall.','> THE WANDERER has perished.'),phase:'gameover',
        enemy:{...state.enemy,currentHp:Math.max(0,ehp)}}
      return {...state,hp,amor,inventory:inv,log,enemy:{...state.enemy,currentHp:Math.max(0,ehp)}}
    }

    default: return state
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
const BTN: React.CSSProperties = {
  background:'transparent', border:'1px solid #cc2233', color:'#cc2233',
  fontFamily:"'Dico','Courier New',monospace", fontSize:'11px',
  letterSpacing:'0.2em', padding:'8px 20px', cursor:'pointer',
}

export default function HeartGame() {
  const [state, dispatch] = useReducer(reducer, INIT)
  const router = useRouter()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.push('/')
      if (state.phase === 'title' && (e.key === 'Enter' || e.key === ' ')) dispatch({ type: 'START' })
      if (state.phase === 'explore') { const n = parseInt(e.key) - 1; if (n >= 0) dispatch({ type: 'CHOOSE', idx: n }) }
      if (state.phase === 'combat') {
        if (e.key === '1') dispatch({ type: 'COMBAT', move: 'attack' })
        if (e.key === '2') dispatch({ type: 'COMBAT', move: 'special' })
        if (e.key === '3') dispatch({ type: 'COMBAT', move: 'item' })
        if (e.key === '4') dispatch({ type: 'COMBAT', move: 'flee' })
      }
      if ((state.phase === 'victory' || state.phase === 'gameover') && e.key === 'Enter') dispatch({ type: 'RESTART' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state.phase, state.scene, router])

  const font  = "'Dico','Courier New',monospace"
  const scene = SCENES[state.scene]

  const artKey  = state.phase === 'combat' ? state.enemy!.id : scene?.art
  const isEnemy = state.phase === 'combat'
  const artData = isEnemy ? ENEMIES_ART[artKey ?? ''] : SCENES_ART[artKey ?? '']
  const cols    = isEnemy ? 12 : 20
  const rows    = isEnemy ? 16 : 14

  // Last few meaningful log lines for the bottom strip
  const recentLog = state.log.slice(-6)

  const fillArt = (data: { bg: string; rects: Rect[] }, c: number, r: number) => (
    <PixelArt
      rects={data.rects} bg={data.bg} cols={c} rows={r}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  )

  return (
    <div style={{ width: '100vw', height: '100dvh', display: 'flex', flexDirection: 'column', background: '#ffb6c1', fontFamily: font, overflow: 'hidden' }}>
      <style>{`@keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}`}</style>

      {/* ── TITLE ── */}
      {state.phase === 'title' && (<>
        {/* Art fills majority */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {fillArt(SCENES_ART.GATEHOUSE, 20, 14)}
          {/* Title overlay */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px 28px', pointerEvents: 'none' }}>
            <div>
              <div style={{ fontSize: 'clamp(24px,5vw,56px)', letterSpacing: '0.12em', color: '#cc1100', lineHeight: 1.1 }}>SCARLET KEEP</div>
              <div style={{ fontSize: '10px', color: '#880000', letterSpacing: '0.2em', marginTop: '6px' }}>a medieval dungeon</div>
            </div>
            <div style={{ fontSize: '11px', color: '#550000', lineHeight: 2, letterSpacing: '0.05em' }}>
              <div>you are  THE WANDERER</div>
              <div>the keep must fall</div>
              <div>descend. destroy. escape.</div>
            </div>
          </div>
        </div>
        {/* Bottom strip */}
        <div style={{ flexShrink: 0, background: '#060003', borderTop: '2px solid #330010', padding: '14px 24px 18px' }}>
          <button onClick={() => dispatch({ type: 'START' })} style={{ ...BTN, animation: 'blink 1.2s steps(1) infinite' }}>
            PRESS ENTER TO BEGIN
          </button>
          <div style={{ marginTop: '10px', fontSize: '9px', color: '#330011', letterSpacing: '0.1em' }}>ESC — exit</div>
        </div>
      </>)}

      {/* ── GAME ── */}
      {(state.phase === 'explore' || state.phase === 'combat') && (<>
        {/* Art fills majority */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {artData && fillArt(artData, cols, rows)}
          {/* Scene / enemy label */}
          <div style={{ position: 'absolute', top: '10px', left: '14px', fontSize: '10px', color: '#cc2233', letterSpacing: '0.15em', textShadow: '0 0 8px #000' }}>
            {state.phase === 'combat' && state.enemy ? `⚔  ${state.enemy.name}` : scene?.title}
          </div>
        </div>

        {/* Bottom strip */}
        <div style={{ flexShrink: 0, background: '#060003', borderTop: '2px solid #330010', padding: '8px 18px 12px' }}>
          {/* HUD */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '6px', fontSize: '10px', letterSpacing: '0.1em' }}>
            <span>
              <span style={{ color: '#aa5566' }}>HP </span>
              <span style={{ color: '#cc2233' }}>{hpBar(state.hp, state.maxHp, 10)}</span>
              <span style={{ color: '#aa5566' }}> {state.hp}/{state.maxHp}</span>
            </span>
            <span>
              <span style={{ color: '#aa5566' }}>AMOR </span>
              <span style={{ color: '#4499ff' }}>{state.amor}</span>
            </span>
            {state.phase === 'combat' && state.enemy && (
              <span>
                <span style={{ color: '#aa5566' }}>{state.enemy.name} </span>
                <span style={{ color: '#cc2233' }}>{hpBar(state.enemy.currentHp, state.enemy.maxHp, 8)}</span>
                <span style={{ color: '#aa5566' }}> {state.enemy.currentHp}/{state.enemy.maxHp}</span>
              </span>
            )}
            {state.inventory.length > 0 && (
              <span style={{ color: '#aa5566' }}>INV: {state.inventory.map(i => ITEMS[i].name).join(' · ')}</span>
            )}
          </div>

          {/* Recent log */}
          <div style={{ fontSize: '11px', lineHeight: 1.8, marginBottom: '6px', minHeight: '42px' }}>
            {recentLog.map((line, i) => (
              <div key={i} style={{
                color: line.startsWith('—') ? '#cc2233'
                  : line.startsWith('>') ? '#ff99aa'
                  : line.startsWith('  ⚔') || line.startsWith('⚔') ? '#ff5555'
                  : '#cc8899',
                letterSpacing: line.startsWith('—') ? '0.08em' : '0.01em',
              }}>{line || '\u00A0'}</div>
            ))}
          </div>

          {/* Choices */}
          <div style={{ borderTop: '1px solid #440011', paddingTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '0 24px' }}>
            {state.phase === 'explore' && scene?.choices.map((c, i) => (
              <button key={i} onClick={() => dispatch({ type: 'CHOOSE', idx: i })}
                style={{ background: 'transparent', border: 'none', color: '#ffccdd', fontFamily: font, fontSize: '11px', letterSpacing: '0.06em', cursor: 'pointer', padding: '2px 0' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#ffccdd')}>
                [{i + 1}] {c.label}
              </button>
            ))}
            {state.phase === 'combat' && ([
              { move: 'attack'  as const, label: 'STRIKE (15–28)' },
              { move: 'special' as const, label: 'BLOOD RAGE (45 dmg)' },
              { move: 'item'    as const, label: 'USE ITEM' },
              { move: 'flee'    as const, label: 'FLEE (60%)' },
            ]).map(({ move, label }, i) => (
              <button key={move} onClick={() => dispatch({ type: 'COMBAT', move })}
                style={{ background: 'transparent', border: 'none', color: '#ffccdd', fontFamily: font, fontSize: '11px', letterSpacing: '0.06em', cursor: 'pointer', padding: '2px 0',
                  opacity: (move === 'special' && state.amor < 30) || (move === 'item' && state.inventory.length === 0) ? 0.3 : 1 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#ffccdd')}>
                [{i + 1}] {label}
              </button>
            ))}
          </div>
        </div>
      </>)}

      {/* ── VICTORY ── */}
      {state.phase === 'victory' && (<>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {fillArt(SCENES_ART.DARK_TOWER, 20, 14)}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(18px,4vw,36px)', color: '#cc2233', letterSpacing: '0.15em', textShadow: '0 0 12px #000' }}>THE WANDERER ENDURES</div>
            <div style={{ fontSize: '11px', color: '#880000', letterSpacing: '0.2em', marginTop: '8px', textShadow: '0 0 8px #000' }}>the keep is silent</div>
          </div>
        </div>
        <div style={{ flexShrink: 0, background: '#060003', borderTop: '2px solid #330010', padding: '14px 24px 18px' }}>
          <div style={{ fontSize: '11px', color: '#550000', lineHeight: 2, marginBottom: '10px' }}>
            final HP: {state.hp}/{state.maxHp}  ·  AMOR: <span style={{ color: '#4499ff' }}>{state.amor}</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => dispatch({ type: 'RESTART' })} style={BTN}>PLAY AGAIN</button>
            <button onClick={() => router.push('/')} style={BTN}>RETURN</button>
          </div>
        </div>
      </>)}

      {/* ── GAME OVER ── */}
      {state.phase === 'gameover' && (<>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {fillArt(SCENES_ART.DARK_TOWER, 20, 14)}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(18px,4vw,36px)', color: '#cc2233', letterSpacing: '0.15em', textShadow: '0 0 12px #000' }}>THE WANDERER HAS PERISHED</div>
            <div style={{ fontSize: '11px', color: '#880000', letterSpacing: '0.2em', marginTop: '8px', textShadow: '0 0 8px #000' }}>the keep endures</div>
          </div>
        </div>
        <div style={{ flexShrink: 0, background: '#060003', borderTop: '2px solid #330010', padding: '14px 24px 18px' }}>
          <div style={{ fontSize: '11px', color: '#550000', lineHeight: 2, marginBottom: '10px' }}>
            fell at: {SCENES[state.scene]?.title ?? state.scene}
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => dispatch({ type: 'RESTART' })} style={BTN}>TRY AGAIN</button>
            <button onClick={() => router.push('/')} style={BTN}>RETURN</button>
          </div>
        </div>
      </>)}

      <div style={{ position: 'fixed', bottom: '8px', right: '12px', fontSize: '9px', color: '#880000', letterSpacing: '0.1em', zIndex: 20, pointerEvents: 'none' }}>ESC — exit</div>
    </div>
  )
}
