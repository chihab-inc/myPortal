import { setElementStyle, create } from '../web_utils.js'
import { max } from '../utils.js'

const Button = props => {
    const options = props.options || {}
    let style = props.style || {}
    const hover = props.hover || {}
    const clickHandler = props.clickHandler || (() => {})
    const globalStyle = props.globalStyle
    const theme = globalStyle.theme || {}

    const remove = () => {
        element.remove()
    }

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
            backgroundPosition: globalStyle.general.backgroundPosition,
            backgroundSize: globalStyle.general.backgroundSize,
            backgroundRepeat: globalStyle.general.backgroundRepeat,
            width: style.width || '20px',
            height: style.height || '20px',
            position: 'relative',
            borderRadius: {
                'squared': globalStyle.general.borderRadiusS,
                'rounded': maxBorderRadius,
                'bubbles': maxBorderRadius,
            }[options.type || 'bubbles'],
        },
    }

    const element = create('span')
    setElementStyle(element, style)

    element.addEventListener('click', clickHandler)
    element.addEventListener('mouseenter', () => {setElementStyle(element, hover)})
    element.addEventListener('mouseleave', () => {setElementStyle(element, style)})

    return { element, remove }
}

export { Button }
