import { GlobalStyle } from '../globalStyle.js'
import { setElementStyle, append, create, transition } from '../web_utils.js'

const ScrollOverlay = scrollTarget => {

	const globalStyle = GlobalStyle()

	const colorBackGroundBasic = '#aeaeae'
	const colorBackGroundIdle = `${colorBackGroundBasic}33`
	const colorBackGroundHover = `${colorBackGroundBasic}66`
	const colorBackGroundPress = `${colorBackGroundBasic}aa`
	const border = `1px solid ${colorBackGroundBasic}55`

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
		height: '250px',
		pointerEvents: 'none',
		position: 'fixed', top: 'calc((100% - 250px) / 2)', left: '0',
		zIndex: globalStyle.general.zIndexMiddle,
	})

	const left = create('div')
	left.textContent = '<'
	setElementStyle(left, {
		width: globalStyle.general.buttonSizeS,
		position: 'absolute', top: '0', left: '0', bottom: '0',
		background: colorBackGroundIdle,
		cursor: 'pointer', pointerEvents: 'auto',
		display: 'flex', justifyContent: 'center', alignItems: 'center',
		color: colorBackGroundBasic, fontWeight: 'bold',
		border,
		borderRadius: `0px ${globalStyle.general.borderRadiusXL} ${globalStyle.general.borderRadiusXL} 0px`,
	})
	transition(left, ['background', 'font-size', 'width'], [globalStyle.general.transitionNormal, globalStyle.general.transitionQuick, globalStyle.general.transitionQuick])


	left.addEventListener('mouseover', () => {
		setElementStyle(left, {
			background: colorBackGroundHover,
			fontSize: globalStyle.general.fontSizeL,
			width: globalStyle.general.buttonSizeL,
		})
		hoverScrollIndex = setInterval(() => {
			hoverScrollSpeed = Math.min(maxHoverScrollSpeed, hoverScrollSpeed + hoverScrollSpeedIncrement)
			return scrollTarget.scrollLeft(hoverScrollSpeed)
		}, 1)
	})


	left.addEventListener('mouseleave', () => {
		setElementStyle(left, {
			background: colorBackGroundIdle,
			fontSize: globalStyle.general.fontSizeM,
			width: globalStyle.general.buttonSizeS,
		})
		clearInterval(hoverScrollIndex)
		hoverScrollSpeed = 0
		clearInterval(pressScrollIndex)
		pressScrollSpeed = 0
	})


	left.addEventListener('mousedown', () => {
		setElementStyle(left, {
			background: colorBackGroundPress,
			fontSize: globalStyle.general.fontSizeXL,
		})
		pressScrollIndex = setInterval(() => {
			pressScrollSpeed = Math.min(maxPressScrollSpeed, pressScrollSpeed + pressScrollSpeedIncrement)
			return scrollTarget.scrollLeft(pressScrollSpeed)
		}, 1)
	})


	left.addEventListener('mouseup', () => {
		setElementStyle(left, {
			background: colorBackGroundHover,
			fontSize: globalStyle.general.fontSizeL,
		})
		clearInterval(pressScrollIndex)
		pressScrollSpeed = 0
	})

	const right = create('div')
	right.textContent = '>'
	setElementStyle(right, {
		width: globalStyle.general.buttonSizeS,
		position: 'absolute', top: '0', right: '0', bottom: '0',
		background: colorBackGroundIdle,
		cursor: 'pointer', pointerEvents: 'auto',
		display: 'flex', justifyContent: 'center', alignItems: 'center',
		color: colorBackGroundBasic, fontWeight: 'bold',
		border,
		borderRadius: `${globalStyle.general.borderRadiusXL} 0px 0px ${globalStyle.general.borderRadiusXL}`,
	})
	transition(right, ['background', 'font-size', 'width'], [globalStyle.general.transitionNormal, globalStyle.general.transitionQuick, globalStyle.general.transitionQuick])


	right.addEventListener('mouseover', () => {
		setElementStyle(right, {
			background: colorBackGroundHover,
			fontSize: globalStyle.general.fontSizeL,
			width: globalStyle.general.buttonSizeL,
		})
		hoverScrollIndex = setInterval(() => {
			hoverScrollSpeed = Math.min(maxHoverScrollSpeed, hoverScrollSpeed + hoverScrollSpeedIncrement)
			return scrollTarget.scrollRight(hoverScrollSpeed)
		}, 1)
	})


	right.addEventListener('mouseleave', () => {
		setElementStyle(right, {
			background: colorBackGroundIdle,
			fontSize: globalStyle.general.fontSizeM,
			width: globalStyle.general.buttonSizeS,
		})
		clearInterval(hoverScrollIndex)
		hoverScrollSpeed = 0
		clearInterval(pressScrollIndex)
		pressScrollSpeed = 0
	})


	right.addEventListener('mousedown', () => {
		setElementStyle(right, {
			background: colorBackGroundPress,
			fontSize: globalStyle.general.fontSizeXL,
		})
		pressScrollIndex = setInterval(() => {
			pressScrollSpeed = Math.min(maxPressScrollSpeed, pressScrollSpeed + pressScrollSpeedIncrement)
			return scrollTarget.scrollRight(pressScrollSpeed)
		}, 1)
	})


	right.addEventListener('mouseup', () => {
		setElementStyle(right, {
			background: colorBackGroundHover,
			fontSize: globalStyle.general.fontSizeL,
		})
		clearInterval(pressScrollIndex)
		pressScrollSpeed = 0
	})

	append(element, { element: left })
	append(element, { element: right })

	return { element, remove }
}

export { ScrollOverlay }
