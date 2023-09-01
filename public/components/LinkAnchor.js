import { setElementStyle, backgroundImage, create } from '../web_utils.js'

const LinkAnchor = props => {
    const href = props.href
    const bgImage = props.src
    const active = props.active

    const remove = () => {
        element.remove()
    }
    
    const element = create('a')
    element.target = '_blank'
    element.href = href
    setElementStyle(element, {
        background: '#ffffff',
        backgroundImage: backgroundImage(bgImage),
        backgroundSize: '100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: active ? '1' : '.1',
        pointerEvents: active ? 'auto' : 'none',
        width: '100%',
        height: '100%',
        borderRadius: '5px',
        display: 'inline-block',
        textDecoration: 'none',
        transition: 'all 0.1s ease-in'
    })

    element.addEventListener('mouseenter', e => {
        setElementStyle(element, { boxShadow: '0 4px 8px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.24)' })
    })
    element.addEventListener('mouseleave', e => {
        setElementStyle(element, { boxShadow: 'none' })
    })

    return { element, remove }
}

export { LinkAnchor }
