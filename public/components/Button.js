import { setElementStyle, create } from '../web_utils.js'
import { max } from '../utils.js'

const Button = props => {
    const options = props.options || {}
    let style = props.style || {}
    const hover = props.hover || {}
    const clickHandler = props.clickHandler || (() => {})

    const maxBorderRadius = style.borderRadius
    ? style.borderRadius
    : style.width && style.height
        ? style.width.toString().includes('px') && style.width.toString().includes('px')
            ? max(style.width, style.height)
            : '20px'
        : style.width
            ? max(style.width, '20px')
            : style.height
                ? max('20px', style.height)
                : '20px'

    style = {
        ...style,
        ...{
            display: 'inline-block',
            boxSizing: 'border-box',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            width: style.width || '20px',
            height: style.height || '20px',
            position: 'relative',
            borderRadius: {
                'squared': '2px',
                'rounded': maxBorderRadius,
                'bubbles': maxBorderRadius,
            }[options.type || 'bubbles'],
        },
    }

    const element = create()
    setElementStyle(element, style)

    const remove = () => {
        element.remove()
    }

    element.addEventListener('click', clickHandler)
    element.addEventListener('mouseenter', () => {setElementStyle(element, hover)})
    element.addEventListener('mouseleave', () => {setElementStyle(element, style)})

    return { element, remove }
}

export { Button }
