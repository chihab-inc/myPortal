import { create, setElementStyle, icon, animate, append } from '../web_utils.js'
import { GlobalStyle } from '../globalStyle.js'
import { ButtonGroup } from './ButtonGroup.js'

const ConfirmModal = (message, confirmCallback, cancelCallback) => {

	let closing = false

	const globalStyle = GlobalStyle()

	const remove = () => {
		animate(confirmBox, 'pop-out', globalStyle.general.transitionNormal, 1)
		animate(element, 'blur-out', globalStyle.general.transitionNormal, 1)
		setTimeout(() => {
			element.remove()
		}, 300)
	}

	const element = create('div')
	setElementStyle(element, {
		backgroundColor: globalStyle.general.backgroundColorPrimaryWithTransparency,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'fixed',
		left: '0px',
		top: '0px',
		width: '100vw',
		height: '100vh',
		backdropFilter: globalStyle.general.backdropFilter,
		zIndex: globalStyle.general.zIndexTop,
	})
	animate(element, 'blur-in', globalStyle.general.transitionNormal, 1)
    element.addEventListener('mousedown', e => {
        if (element === e.target && !closing) {
            remove()
            closing = true
        }
    })

	const confirmBox = create('div')
	setElementStyle(confirmBox, {
		display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', gap: globalStyle.general.flexGapS,
		backgroundColor: globalStyle.general.backgroundColorSecondaryWithTransparency,
		minWidth: '300px',
		padding: globalStyle.general.paddingL,
		borderRadius: globalStyle.general.borderRadiusL,
		boxShadow: globalStyle.general.boxShadow,
	})
	animate(confirmBox, 'pop-in', globalStyle.general.transitionNormal, 1)

	const messageBox = create('p')
	setElementStyle(messageBox, {
		width: '100%', height: '100%',
		display: 'flex', justifyContent: 'center', alignItems: 'center', flexShring: '0',
		color: globalStyle.general.fontColor, padding: '20px',
	})
	messageBox.textContent = message
	confirmBox.appendChild(messageBox)

    const buttons = [
        { icon: icon('check', 1), clickHandler: () => {
        	confirmCallback()
        	remove()
            closing = true
        } },
        { icon: icon('cross', 1), clickHandler: () => {
        	cancelCallback()
        	remove()
            closing = true
        } },
    ]
    const buttonGroup = ButtonGroup({ type: 'rounded' }, buttons)
    append(confirmBox, buttonGroup)

    element.appendChild(confirmBox)

    return { element, remove }
}

export { ConfirmModal }