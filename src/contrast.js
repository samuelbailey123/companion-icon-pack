/**
 * Relative luminance of a hex colour.
 * @param {string} hex `#RRGGBB`
 * @returns {number} 0..1
 */
export function luminance(hex) {
	const n = parseInt(hex.replace('#', ''), 16)
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
		.map((x) => {
			const s = x / 255
			return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
		})
		.reduce((acc, x, i) => acc + [0.2126, 0.7152, 0.0722][i] * x, 0)
}

/**
 * WCAG contrast ratio between two hex colours, 1..21.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function contrastRatio(a, b) {
	const [lighter, darker] = [luminance(a), luminance(b)].sort((p, q) => q - p)
	return (lighter + 0.05) / (darker + 0.05)
}
