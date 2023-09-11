import { create, select, setElementStyle, append, icon, backgroundImage } from '../web_utils.js'

const AddDataPanel = props => {
    const initial = props.initial
    const style = props.style || {}
    const callBack = props.callBack
    const globalStyle = props.globalStyle
    const theme = globalStyle.style.theme || {}

    const children = []

    const remove = () => {
        children.forEach(c => c.remove())
        element.remove()
    }

    const element = create('div')
    element.id = 'add-data-panel'
    setElementStyle(element, {
        ...style,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: globalStyle.style.general.flexGapL,
        userSelect: 'none',
        position: initial ? 'static' : 'fixed',
        // top: initial ? 'auto' : '20px',
        // left: initial ? 'auto' : '20px',
        bottom: '50px',
        right: '50px',
        height: initial ? style.height || 'auto' : '60px',
        width: initial ? style.width || 'auto' : '60px',
        background: 'none',
    })

    const img = create('img')
    children.push(img)
    img.src = icon('plus')
    setElementStyle(img, {
        borderRadius: globalStyle.style.general.borderRadiusCircle,
        boxShadow: globalStyle.style.general.boxShadow,
        height: '100%',
        maxHeight: '150px',
        opacity: globalStyle.style.general.buttonOpacity,
        transition: `all ${globalStyle.style.general.transitionQuick}`,
    })
    img.addEventListener('mouseenter', () => {
        setElementStyle(img, {
            opacity: globalStyle.style.general.buttonHoverOpacity,
        })
    })
    img.addEventListener('mouseleave', () => {
        setElementStyle(img, {
            opacity: globalStyle.style.general.buttonOpacity,
        })
    })

    const span = create('span')
    children.push(span)
    span.textContent = 'Add New Section'
    setElementStyle(span, {
        textAlign: 'center',
        color: '#282c31',
        fontSize: globalStyle.style.general.fontSizeL,
        fontWeight: 'bold',
        fontFamily: globalStyle.style.general.fontFamily,
    })

    element.addEventListener('click', e => {
        callBack()
    })

    element.appendChild(img)
    initial && element.appendChild(span)

    return { element, remove }
}

export { AddDataPanel }