import { setElementStyle, create } from '../web_utils.js'
import { max } from '../utils.js'

const ButtonGroup = props => {
    const options = props.options || {}
    const buttons = props.buttons || []

    const remove = () => {
        element.remove()
    }

    const element = create('ul')
    setElementStyle(element, {
        background: '#1f1f1f',
        borderRadius: {
            'squared': '2px',
            'rounded': '10px',
            'bubbles': '10px',
        }[options.type || 'bubbles'],
        padding: {
            'squared': '0px',
            'rounded': '0px',
            'bubbles': '2px',
        }[options.type || 'bubbles'],
        listStyleType: 'none',
        display: 'flex',
        flexDirection: ['vertical', 'v'].includes(options.orientation || 'horizontal') ? 'column' : 'row',
        position: 'relative',
        // MacOS-like effect
        /* boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', */
        // MacOS-like effect ends here
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

        const maxBorderRadius = b.style.borderRadius
            ? b.style.borderRadius
            : options.buttonWidth && options.buttonHeight
                ? options.buttonWidth.toString().includes('px') && options.buttonWidth.toString().includes('px')
                    ? max(options.buttonWidth, options.buttonHeight)
                    : '20px'
                : options.buttonWidth
                    ? max(options.buttonWidth, '20px')
                    : options.buttonHeight
                        ? max('20px', options.buttonHeight)
                        : '20px'

        const style = {
            // Take external style, then add to it pre-defined style while overwriting external style properties with pre-defined ones
            ...b.style,
            ...{
                display: 'inline-block',
                boxSizing: 'border-box',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                opacity: '.6',
            },
            ...{
                width: options.buttonWidth || '20px',
                height: options.buttonHeight || '20px',
                borderRadius: {
                    'squared': '2px',
                    'rounded': nbButtons === 1
                        ? '50%'
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
        button.addEventListener('mouseenter', e => {
            setElementStyle(button, b.hover)
        })
        button.addEventListener('mouseleave', e => {
            setElementStyle(button, style)
        })

        item.appendChild(button)
        element.appendChild(item)
    }

    return { element, remove }
}

export { ButtonGroup }