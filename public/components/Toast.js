import { create, setElementStyle, append, icon, animate } from '../web_utils.js'
import { GlobalStyle } from '../globalStyle.js'
import { ButtonGroup } from './ButtonGroup.js'
import { isDarkColor } from '../utils.js'

const Toast = (message, _callBack=() => {}, _iconName='cross') => {

	const iconName = ![null, undefined].includes(_iconName) ? _iconName : 'cross'
	const callBack = ![null, undefined].includes(_callBack) ? _callBack : () => {}

	const globalStyle = GlobalStyle()

	let closing = false

	const remove = () => {
		animate(toast, 'pop-out', globalStyle.general.transitionNormal, 1)
		setTimeout(() => {
			element.remove()
		}, 300)
	}

	const display = parent => {
		parent.appendChild(element)
		let index
		let percentage = 0
		index = setInterval(() => {
			percentage++
			setElementStyle(loadingBar, { right: `${100 - percentage}%` })
			if (percentage === 100) {
				callBack()
				if (!closing) {
					setElementStyle(loadingBar, { borderRadius: globalStyle.general.borderRadiusM })
		            remove()
		            closing = true
	        	}
			}
			return percentage
		}, 50)
	}

	const element = create('div')
	setElementStyle(element, {
		position: 'fixed',
		left: '0',
		right: '0',
		bottom: '30px',
		height: '20px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	})
	animate(element, 'pop-in', globalStyle.general.transitionNormal, 1)

	const toast = create('div')
	setElementStyle(toast, {
		backgroundColor: globalStyle.general.backgroundColorSecondary,
		borderRadius: globalStyle.general.borderRadiusM,
		position: 'fixed',
		transform: 'translateX(0%)',// INFO - KEEP THIS FOR FIXED PLACEMENT OF CHILDREN
		zIndex: globalStyle.general.zIndexMiddle,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: '5px',
		padding: globalStyle.general.paddingM,
		fontFamily: globalStyle.general.fontFamily,
	})

	const loadingBar = create('div')
	setElementStyle(loadingBar, {
		position: 'fixed',
		left: '0',
		top: '0',
		bottom: '0',
		padding: globalStyle.general.paddingXS,
		right: '100%',
		zIndex: globalStyle.general.zIndexTop,
		overflow: 'hidden',
		borderRadius: `${globalStyle.general.borderRadiusM} 0 0 ${globalStyle.general.borderRadiusM}`,
		backgroundColor: globalStyle.general.accentColor,
	})

	const loadingBarText = create('p')
	loadingBarText.textContent = message
	setElementStyle(loadingBarText, {
		color: isDarkColor(globalStyle.general.backgroundColorSecondary) ? globalStyle.general.fontColor : globalStyle.general.fontColorDark,
		zIndex: globalStyle.general.zIndexTop,
		height: '100%',
		whiteSpace: 'nowrap',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexShrink: '0',
		position: 'absolute',
		left: '0',
		top: '0',
		padding: globalStyle.general.borderRadiusM,
	})
	loadingBar.appendChild(loadingBarText)

	const toastMessageDark = create('p')
	toastMessageDark.textContent = message
	setElementStyle(toastMessageDark, { color: isDarkColor(globalStyle.general.accentColor) ? `${globalStyle.general.fontColor}50` : `${globalStyle.general.fontColorDark}90` })

	const buttons = [
        { icon: icon(iconName, 1), clickHandler: () => {
        	callBack()
        	if (!closing) {
	            remove()
	            closing = true
        	}
        } },
    ]
    const buttonGroup = ButtonGroup({}, buttons)
    setElementStyle(buttonGroup.element, { zIndex: globalStyle.general.zIndexTop })

	toast.appendChild(toastMessageDark)
	toast.appendChild(loadingBar)
	append(toast, buttonGroup)
	element.appendChild(toast)

	return { element, display }
}

export { Toast }