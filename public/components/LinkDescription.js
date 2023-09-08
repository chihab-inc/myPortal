import { setElementStyle, create } from '../web_utils.js'

const LinkDescription = props => {
    const tip = props.tip
    const globalStyle = props.globalStyle
    const theme = globalStyle.style.theme || {}

    const remove = () => {
        element.remove()
    }
    
    const element = create('p')
    element.textContent = tip
    setElementStyle(element, {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: globalStyle.style.general.backgroundColorSecondary,
        color: globalStyle.style.general.fontColor,
        fontSize: globalStyle.style.general.fontSizeS,
        whiteSpace: 'nowrap',
        zIndex: globalStyle.style.general.zIndexMiddle,
        borderRadius: globalStyle.style.general.borderRadiusM,
        boxSizing: 'border-box',
        padding: globalStyle.style.general.paddingM,
        position: 'absolute',
        bottom: '5px',
        left: '5px',
        transformOrigin: 'left',
        animation: 'roll-out 0.2s ease-in-out 1',
    })

    return { element, remove }
}

export { LinkDescription }
