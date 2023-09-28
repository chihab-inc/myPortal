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

	let quickScrolling = false

	let hoverScrollIndex
	const maxHoverScrollSpeed = globalStyle.settings.scrollSpeedHoverMax

	let pressScrollIndex
	const maxPressScrollSpeed = globalStyle.settings.scrollSpeedPressMax

	let quickScrollIndex = 0
	const maxQuickScrollSpeed = globalStyle.settings.scrollSpeedQuickMax

	const scroll = (scrollDirection, maxScrollSpeed, style) => {
		let scrollIndex
		if (!quickScrolling) {
			let scrollSpeed = 0
			setElementStyle(scrollDirection === 'left' ? left : right, style)
			scrollIndex = setInterval(() => {
				scrollSpeed = Math.min(maxScrollSpeed, scrollSpeed + .1)
				return scrollDirection === 'left' ? scrollTarget.scrollLeft(scrollSpeed) : scrollTarget.scrollRight(scrollSpeed)
			}, 1)
		}
		return scrollIndex
	}

	const quickScroll = scrollDirection => {
		quickScrolling = true
		let scrollIndex
		let scrollSpeed = 0
		scrollIndex = setInterval(() => {
			quickScrolling = scrollDirection === 'left' ? scrollTarget.getScrollLeft() > 0 : scrollTarget.getScrollLeft() + scrollTarget.getClientWidth() < scrollTarget.getScrollWidth()
			if (quickScrolling) {
				left.textContent = scrollDirection === 'left' ? '<<' : left.textContent
				right.textContent = scrollDirection === 'right' ? '>>' : right.textContent
				scrollSpeed = Math.min(maxQuickScrollSpeed, scrollSpeed + 1)
				return scrollDirection === 'left' ? scrollTarget.scrollLeft(scrollSpeed) : scrollTarget.scrollRight(scrollSpeed)
			} else {
				left.textContent = scrollDirection === 'left' ? '<' : left.textContent
				right.textContent = scrollDirection === 'right' ? '>' : right.textContent
				clearInterval(scrollIndex)
				scrollSpeed = 0
			}
		}, .1)
		return scrollIndex
	}

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

	left.addEventListener('mouseenter', () => {
		quickScrolling = false
		left.textContent = '<'
		right.textContent = '>'
		clearInterval(quickScrollIndex)
		hoverScrollIndex = scroll(
			'left', maxHoverScrollSpeed, { background: colorBackGroundHover, fontSize: globalStyle.general.fontSizeL, width: globalStyle.general.buttonSizeL }
		)
	})

	left.addEventListener('mousedown', () => pressScrollIndex = scroll(
		'left', maxPressScrollSpeed, { background: colorBackGroundPress, fontSize: globalStyle.general.fontSizeXL })
	)

	left.addEventListener('mouseleave', () => {
		setElementStyle(left, {
			background: colorBackGroundIdle,
			fontSize: globalStyle.general.fontSizeM,
			width: globalStyle.general.buttonSizeS,
		})
		clearInterval(hoverScrollIndex)
		clearInterval(pressScrollIndex)
	})

	left.addEventListener('dblclick', () => quickScrollIndex = quickScroll('left'))

	left.addEventListener('mouseup', () => {
		if (!quickScrolling) {
			setElementStyle(left, {
				background: colorBackGroundHover,
				fontSize: globalStyle.general.fontSizeL,
			})
			clearInterval(pressScrollIndex)
		}
	})

	right.addEventListener('mouseenter', () => {
		quickScrolling = false
		left.textContent = '<'
		right.textContent = '>'
		clearInterval(quickScrollIndex)
		hoverScrollIndex = scroll(
			'right', maxHoverScrollSpeed, { background: colorBackGroundHover, fontSize: globalStyle.general.fontSizeL, width: globalStyle.general.buttonSizeL }
		)
	})

	right.addEventListener('mousedown', () => pressScrollIndex = scroll(
		'right', maxPressScrollSpeed, { background: colorBackGroundPress, fontSize: globalStyle.general.fontSizeXL })
	)

	right.addEventListener('mouseleave', () => {
		setElementStyle(right, {
			background: colorBackGroundIdle,
			fontSize: globalStyle.general.fontSizeM,
			width: globalStyle.general.buttonSizeS,
		})
		clearInterval(hoverScrollIndex)
		clearInterval(pressScrollIndex)
	})

	right.addEventListener('dblclick', () => quickScrollIndex = quickScroll('right'))

	right.addEventListener('mouseup', () => {
		if (!quickScrolling) {
			setElementStyle(right, {
				background: colorBackGroundHover,
				fontSize: globalStyle.general.fontSizeL,
			})
			clearInterval(pressScrollIndex)
		}
	})

	append(element, { element: left })
	append(element, { element: right })

	return { element, remove }
}

export { ScrollOverlay }
