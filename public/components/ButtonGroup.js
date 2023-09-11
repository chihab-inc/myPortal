import { setElementStyle, create, backgroundImage } from '../web_utils.js'
import { max } from '../utils.js'

const ButtonGroup = props => {
    const options = props.options || {}
    const buttons = props.buttons || []
    const globalStyle = props.globalStyle
    const theme = globalStyle.style.theme || {}

    const remove = () => {
        element.remove()
    }

    const element = create('ul')
    setElementStyle(element, {
        backgroundColor: globalStyle.style.general.backgroundColorSecondary,
        borderRadius: {
            'squared': globalStyle.style.general.borderRadiusS,
            'rounded': globalStyle.style.general.borderRadiusL,
            'bubbles': globalStyle.style.general.borderRadiusL,
        }[options.type || 'bubbles'],
        padding: {
            'squared': globalStyle.style.general.paddingNone,
            'rounded': globalStyle.style.general.paddingNone,
            'bubbles': globalStyle.style.general.paddingXS,
        }[options.type || 'bubbles'],
        listStyleType: 'none',
        display: 'flex',
        flexDirection: ['vertical', 'v'].includes(options.orientation || 'horizontal') ? 'column' : 'row',
        position: 'relative',
    })
    options.position && setElementStyle(element, {
        position: 'absolute',
        top: options.position.top || 'auto',
        right: options.position.right || 'auto',
        bottom: options.position.bottom || 'auto',
        left: options.position.left || 'auto',
    })

    // Filter out the elements that are not a valid object (a.k.a. equal to false, null, undefined)
    const nbButtons = buttons.filter((i) => ![false, null, undefined].includes(i)).length
    for (const [idx, b] of buttons.filter((i) => ![false, null, undefined].includes(i)).entries()) {
        const item = create('li')
        setElementStyle(item, {
            display: 'inherit',
            justifyContent: 'center',
            alignItems: 'center',
        })

        const maxBorderRadius = options.buttonWidth && options.buttonHeight
            ? options.buttonWidth.toString().includes('px') && options.buttonWidth.toString().includes('px')
                ? max(options.buttonWidth, options.buttonHeight)
                : globalStyle.style.general.borderRadiusL
            : options.buttonWidth
                ? max(options.buttonWidth, globalStyle.style.general.borderRadiusL)
                : options.buttonHeight
                    ? max(globalStyle.style.general.borderRadiusL, options.buttonHeight)
                    : globalStyle.style.general.borderRadiusL

        const style = {
            // Take external style, then add to it pre-defined style while overwriting external style properties with pre-defined ones
            ...{
                display: 'inline-block',
                boxSizing: 'border-box',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                opacity: globalStyle.style.general.buttonOpacity,
                boxShadow: globalStyle.style.general.boxShadow,
                backgroundImage: backgroundImage(b.icon),
            },
            ...{
                width: options.buttonWidth || '20px',
                height: options.buttonHeight || '20px',
                borderRadius: {
                    'squared': globalStyle.style.general.borderRadiusS,
                    'rounded': nbButtons === 1
                        ? globalStyle.style.general.borderRadiusCircle
                        : idx === 0
                            ? options.orientation === 'v' ? `${maxBorderRadius} ${maxBorderRadius} 0% 0%` : `${maxBorderRadius} 0% 0% ${maxBorderRadius}`
                            : idx === nbButtons - 1
                                ? options.orientation === 'v' ? `0% 0% ${maxBorderRadius} ${maxBorderRadius}` : `0% ${maxBorderRadius} ${maxBorderRadius} 0%`
                                : '0%',
                    'bubbles': maxBorderRadius,
                }[options.type || 'bubbles'],
            },
        }
        
        const button = create('span')
        setElementStyle(button, style)

        button.addEventListener('click', b.clickHandler || (() => {}))
        button.addEventListener('mouseenter', () => {
            setElementStyle(button, { opacity: globalStyle.style.general.buttonHoverOpacity })
        })
        button.addEventListener('mouseleave', () => {
            setElementStyle(button, style)
        })

        item.appendChild(button)
        element.appendChild(item)
    }

    return { element, remove }
}

export { ButtonGroup }