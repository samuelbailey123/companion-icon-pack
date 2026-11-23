/**
 * CLI wrapper: assemble the library and write it to disk.
 *
 * All assembly logic lives in `library.js` so it can be tested without filesystem access.
 * This file is intentionally I/O only, and is excluded from coverage for that reason.
 *
 * Writes icons/svg/<name>.svg, icons/png/<name>.png (144 px, the Stream Deck key size) and
 * icons/library.companionconfig. The output is committed so anyone can download it.
 *
 * Run: npm run build
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { Canvas, loadImage } from '@napi-rs/canvas'
import { ICONS } from './variants.js'
import { buildLibrary } from './library.js'

const PNG = 144

const dist = path.resolve('icons')
await fs.mkdir(path.join(dist, 'svg'), { recursive: true })
await fs.mkdir(path.join(dist, 'png'), { recursive: true })

const { files, config } = await buildLibrary(ICONS)

for (const { name, svg } of files) {
	await fs.writeFile(path.join(dist, 'svg', `${name}.svg`), svg)

	const img = await loadImage('data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64'))
	const canvas = new Canvas(PNG, PNG)
	canvas.getContext('2d').drawImage(img, 0, 0, PNG, PNG)
	await fs.writeFile(path.join(dist, 'png', `${name}.png`), canvas.toBuffer('image/png'))
}

const out = path.join(dist, 'library.companionconfig')
await fs.writeFile(out, JSON.stringify(config))

const bytes = (await fs.stat(out)).size
console.log(
	`built ${files.length} icons across ${config.imageLibraryCollections.length} collections — ` +
		`${(bytes / 1024).toFixed(0)} KB`
)
