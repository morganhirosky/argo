import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import FormData from 'form-data'
import sharp from 'sharp'

// ── Config ──────────────────────────────────────────
const API_KEY   = process.argv[2]
const INPUT_DIR = process.argv[3]
const OUT_DIR   = path.resolve('public/products')
const SIZE      = 800  // output px (square)
// ────────────────────────────────────────────────────

if (!API_KEY || !INPUT_DIR) {
  console.error('Usage: node scripts/process-images.mjs <API_KEY> <input-folder>')
  process.exit(1)
}

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

const files = fs.readdirSync(INPUT_DIR).filter(f =>
  /\.(jpe?g|png|webp)$/i.test(f)
)

if (files.length === 0) {
  console.error('No images found in', INPUT_DIR)
  process.exit(1)
}

console.log(`Found ${files.length} images. Processing...\n`)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

for (const file of files) {
  const inputPath = path.join(INPUT_DIR, file)
  const name      = path.parse(file).name          // e.g. "w001"
  const outPath   = path.join(OUT_DIR, `${name}.png`)

  // Skip already processed files
  if (fs.existsSync(outPath)) {
    console.log(`  ${file} → already done, skipping`)
    continue
  }

  process.stdout.write(`  ${file} → `)

  try {
    // 1. Remove background via remove.bg
    const form = new FormData()
    form.append('image_file', fs.createReadStream(inputPath))
    form.append('size', 'auto')

    const res = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': API_KEY, ...form.getHeaders() },
      body: form,
    })

    if (!res.ok) {
      const err = await res.text()
      console.log(`FAILED (${res.status}: ${err})`)
      continue
    }

    const buffer = Buffer.from(await res.arrayBuffer())

    // 2. Resize to SIZE×SIZE, contain within square, transparent background
    await sharp(buffer)
      .resize(SIZE, SIZE, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(outPath)

    console.log(`✓ saved to public/products/${name}.png`)
    await sleep(20000)
  } catch (err) {
    console.log(`ERROR: ${err.message}`)
    await sleep(20000)
  }
}

console.log('\nDone.')
