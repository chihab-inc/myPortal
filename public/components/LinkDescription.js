import { setElementStyle, create, animate } from '../web_utils.js'
import { GlobalStyle } from '../globalStyle.js'
import { linkDB } from '../controllers/database/linkDB.js'

const LinkDescription = id => {

    const globalStyle = GlobalStyle()

    let tip = linkDB.getTipById(id)

    const updateTip = () => updateUI('tip')

    const updateUI = (...props) => {
        props.forEach(prop => {
            switch (prop) {
                case 'tip':
                    element.textContent = linkDB.getTipById(id)
                    break
                default:
                    break
            }
        })
    }

    const remove = () => element.remove()
    
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
    })
    animate(element, 'roll-out', globalStyle.style.general.transitionQuick, 1)

    return { element, updateTip, remove }
}

export { LinkDescription }
