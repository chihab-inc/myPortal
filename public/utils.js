const max = (a, b) => a > b ? a : b

const isDarkColor = hexColor => {
	const [r, g, b] = hexColor.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i).slice(1).map(hex => parseInt(hex, 16))
	return (r * 299 + g * 587 + b * 114) / 1000 < 155
}

export { max, isDarkColor }