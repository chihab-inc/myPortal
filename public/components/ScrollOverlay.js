import { GlobalStyle } from '../globalStyle.js'
import { setElementStyle, append, create, transition } from '../web_utils.js'

const ScrollOverlay = scrollTarget => {

	const globalStyle = GlobalStyle()

	const colorBackGroundBasic = '#aeaeae'
	const colorBackGroundIdle = `${colorBackGroundBasic}33`
	const colorBackGroundHover = `${colorBackGroundBasic}66`
	const colorBackGroundPress = `${colorBackGroundBasic}aa`
	const colorBorder = `${colorBackGroundBasic}55`

	const remove = () => element.remove()

	let hoverScrollIndex
	const maxHoverScrollSpeed = 2
	const hoverScrollSpeedIncrement = .02
	let hoverScrollSpeed = 0

	let pressScrollIndex
	const maxPressScrollSpeed = 8
	const pressScrollSpeedIncrement = .1
	let pressScrollSpeed = 0

	// CHANGE ALL STYLES TO DEPEND ON GlobalStyle
	const element = create('div')
	setElementStyle(element, {
		width: '100%',
		minHeight: '150px',
		pointerEvents: 'none',
		position: 'fixed', top: '300px', left: '0', bottom: '300px',
		zIndex: globalStyle.general.zIndexMiddle,
	})

	const left = create('div')
	left.textContent = '<'
	setElementStyle(left, {
		width: '20px',
		position: 'absolute', top: '0', left: '0', bottom: '0',
		background: colorBackGroundIdle,
		cursor: 'pointer', pointerEvents: 'auto',
		display: 'flex', justifyContent: 'center', alignItems: 'center',
		color: colorBackGroundBasic, fontWeight: 'bold', fontFamily: globalStyle.general.iconFontFamily,
		border: `1px solid ${colorBorder}`,
		borderRadius: '0px 100px 100px 0px',
	})
	transition(left, ['background', 'font-size', 'width'], [globalStyle.general.transitionNormal, globalStyle.general.transitionQuick, globalStyle.general.transitionQuick])


	left.addEventListener('mouseover', () => {
		setElementStyle(left, {
			background: colorBackGroundHover,
			fontSize: '1.9em',
			width: '80px',
		})
		hoverScrollIndex = setInterval(() => {
			hoverScrollSpeed = Math.min(maxHoverScrollSpeed, hoverScrollSpeed + hoverScrollSpeedIncrement)
			return scrollTarget.scrollLeft(hoverScrollSpeed)
		}, 1)
	})


	left.addEventListener('mouseleave', () => {
		setElementStyle(left, {
			background: colorBackGroundIdle,
			fontSize: '1em',
			width: '20px',
		})
		clearInterval(hoverScrollIndex)
		hoverScrollSpeed = 0
		clearInterval(pressScrollIndex)
		pressScrollSpeed = 0
	})


	left.addEventListener('mousedown', () => {
		setElementStyle(left, {
			background: colorBackGroundPress,
			fontSize: '2.5em',
		})
		pressScrollIndex = setInterval(() => {
			pressScrollSpeed = Math.min(maxPressScrollSpeed, pressScrollSpeed + pressScrollSpeedIncrement)
			return scrollTarget.scrollLeft(pressScrollSpeed)
		}, 1)
	})


	left.addEventListener('mouseup', () => {
		setElementStyle(left, {
			background: colorBackGroundHover,
			fontSize: '1.9em',
		})
		clearInterval(pressScrollIndex)
		pressScrollSpeed = 0
	})

	const right = create('div')
	right.textContent = '>'
	setElementStyle(right, {
		width: '20px',
		position: 'absolute', top: '0', right: '0', bottom: '0',
		background: colorBackGroundIdle,
		cursor: 'pointer', pointerEvents: 'auto',
		display: 'flex', justifyContent: 'center', alignItems: 'center',
		color: colorBackGroundBasic, fontWeight: 'bold', fontFamily: globalStyle.general.iconFontFamily,
		border: `1px solid ${colorBorder}`,
		borderRadius: '100px 0px 0px 100px',
	})
	transition(right, ['background', 'font-size', 'width'], [globalStyle.general.transitionNormal, globalStyle.general.transitionQuick, globalStyle.general.transitionQuick])


	right.addEventListener('mouseover', () => {
		setElementStyle(right, {
			background: colorBackGroundHover,
			fontSize: '1.9em',
			width: '80px',
		})
		hoverScrollIndex = setInterval(() => {
			hoverScrollSpeed = Math.min(maxHoverScrollSpeed, hoverScrollSpeed + hoverScrollSpeedIncrement)
			return scrollTarget.scrollRight(hoverScrollSpeed)
		}, 1)
	})


	right.addEventListener('mouseleave', () => {
		setElementStyle(right, {
			background: colorBackGroundIdle,
			fontSize: '1em',
			width: '20px',
		})
		clearInterval(hoverScrollIndex)
		hoverScrollSpeed = 0
		clearInterval(pressScrollIndex)
		pressScrollSpeed = 0
	})


	right.addEventListener('mousedown', () => {
		setElementStyle(right, {
			background: colorBackGroundPress,
			fontSize: '2.5em',
		})
		pressScrollIndex = setInterval(() => {
			pressScrollSpeed = Math.min(maxPressScrollSpeed, pressScrollSpeed + pressScrollSpeedIncrement)
			return scrollTarget.scrollRight(pressScrollSpeed)
		}, 1)
	})


	right.addEventListener('mouseup', () => {
		setElementStyle(right, {
			background: colorBackGroundHover,
			fontSize: '1.9em',
		})
		clearInterval(pressScrollIndex)
		pressScrollSpeed = 0
	})

	append(element, { element: left })
	append(element, { element: right })

	return { element, remove }
}

export { ScrollOverlay }
