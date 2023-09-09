import { setElementStyle, backgroundImage, create } from '../web_utils.js'

const LinkAnchor = props => {
    const href = props.href
    const src = props.src
    const active = props.active
    const globalStyle = props.globalStyle
    const theme = globalStyle.style.theme || {}
    const callBack = props.callBack

    const remove = () => {
        image.remove()
        element.remove()
    }
    
    const element = create('a')
    element.target = '_blank'
    element.href = href
    setElementStyle(element, {
        opacity: active ? '1' : '.1',
        pointerEvents: active ? 'auto' : 'none',
        width: '100%',
        height: '100%',
        borderRadius: globalStyle.style.general.borderRadiusM,
        display: 'inline-block',
        textDecoration: 'none',
        transition: `all ${globalStyle.style.general.transitionQuick}`
    })

    const image = create('img')
    callBack(image)
    setElementStyle(image, {
        width: '100%',
        height: '100%',
        borderRadius: globalStyle.style.general.borderRadiusM,
    })
    element.appendChild(image)

    element.addEventListener('mouseenter', e => {
        setElementStyle(element, { boxShadow: globalStyle.style.general.boxShadow })
    })
    element.addEventListener('mouseleave', e => {
        setElementStyle(element, { boxShadow: 'none' })
    })

    return { element, remove }
}

export { LinkAnchor }
