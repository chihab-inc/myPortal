import { setElementStyle, backgroundImage, create } from '../web_utils.js'

const LinkAnchor = props => {
    let href = props.href
    let src = props.src
    let active = props.active
    const globalStyle = props.globalStyle
    const theme = globalStyle.style.theme || {}

    const remove = () => {
        image.remove()
        element.remove()
    }

    const update = (_href, _src, _active) => {
        href = _href
        src = _src
        active = _active
        element.href = href
        image.src = src
        setElementStyle(element, {
            opacity: active ? '1' : '.1',
            pointerEvents: active ? 'auto' : 'none',
        })
    }

    const updateHref = _href => {
        href = _href
        element.href = href
    }

    const updateSrc = _src => {
        src = _src
        image.src = src
    }

    const updateActive = _active => {
        active = _active
        setElementStyle(element, {
            opacity: active ? '1' : '.1',
            pointerEvents: active ? 'auto' : 'none',
        })
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
    image.src = src
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

    return { element, remove, update, updateHref, updateSrc, updateActive }
}

export { LinkAnchor }
