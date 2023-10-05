import { setElementStyle, create, backgroundImage } from '../web_utils.js'
import { GlobalStyle } from '../globalStyle.js'
import { max } from '../utils.js'

const ButtonGroup = (options={}, buttons=[]) => {
    
    const globalStyle = GlobalStyle()

    const remove = () => element.remove()

    const element = create('ul')
    setElementStyle(element, {
        backgroundColor: globalStyle.general.backgroundColorSecondary,
        borderRadius: {
            'squared': globalStyle.general.borderRadiusS,
            'rounded': globalStyle.general.borderRadiusL,
            'bubbles': globalStyle.general.borderRadiusL,
        }[options.type || 'bubbles'],
        padding: globalStyle.general.paddingNone,
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

    // FILTER OUT THE ELEMENTS THAT ARE NOT A VALID OBJECT (A.K.A. EQUAL TO FALSE, NULL, UNDEFINED)
    const nbButtons = buttons.filter((i) => ![false, null, undefined].includes(i)).length
    for (const [idx, b] of buttons.filter((i) => ![false, null, undefined].includes(i)).entries()) {
        const item = create('li')
        setElementStyle(item, {
            display: 'inherit',
            justifyContent: 'center',
            alignItems: 'center',
            listStyleType: 'none',
        })

        const maxBorderRadius = 
            options.buttonWidth && options.buttonHeight
            ? options.buttonWidth.toString().includes('px') && options.buttonWidth.toString().includes('px')
                ? max(options.buttonWidth, options.buttonHeight)
                : globalStyle.general.borderRadiusL
            : options.buttonWidth
                ? max(options.buttonWidth, globalStyle.general.borderRadiusL)
                : options.buttonHeight
                    ? max(globalStyle.general.borderRadiusL, options.buttonHeight)
                    : globalStyle.general.borderRadiusL

        const style = {
            ...{
                display: 'inline-block',
                boxSizing: 'border-box',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                opacity: globalStyle.general.buttonOpacity,
                boxShadow: globalStyle.general.boxShadow,
                backgroundImage: backgroundImage(b.icon),
            },
            ...{
                width: options.buttonWidth || '20px',
                height: options.buttonHeight || '20px',
                borderRadius: {
                    'squared': globalStyle.general.borderRadiusS,
                    'rounded': nbButtons === 1
                        ? globalStyle.general.borderRadiusCircle
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
            setElementStyle(button, { opacity: globalStyle.general.buttonHoverOpacity })
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