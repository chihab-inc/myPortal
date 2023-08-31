import { setElementStyle } from '../web_utils.js'

const ButtonGroup = props => {
    const id = props.id
    const options = props.options || {}
    const buttons = props.buttons
    
    const remove = () => {
        document.getElementById(id).remove()
    }

    const list = document.createElement('ul')
    list.id = id
    setElementStyle(list, {
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
        position: 'absolute',
        top: '5px',
        left: '5px',
    })

    // Filter out the elements that are not a valid object (a.k.a. equal to false, null, undefined)
    const nbButtons = buttons.filter((i) => ![false, null, undefined].includes(i)).length
    for (const [idx, b] of buttons.filter((i) => ![false, null, undefined].includes(i)).entries()) {
        const item = document.createElement('li')
        setElementStyle(item, {
            display: 'inherit',
            justifyContent: 'center',
            alignItems: 'center',
        })

        const style = { ...{
            display: 'inline-block',
            boxSizing: 'border-box',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            width: '20px',
            height: '20px',
            opacity: '.6',
            borderRadius: {
                'squared': '2px',
                'rounded': nbButtons === 1
                    ? '50%'
                    : idx === 0
                        ? options.orientation === 'v' ? '50% 50% 0% 0%' : '50% 0% 0% 50%'
                        : idx === nbButtons - 1
                            ? options.orientation === 'v' ? '0% 0% 50% 50%' : '0% 50% 50% 0%'
                            : '0%',
                'bubbles': '50%',
            }[options.type || 'bubbles'],
        }, ...b.style }
        
        const button = document.createElement('span')
        setElementStyle(button, style)

        button.addEventListener('click', b.clickHandler || (() => {}))
        button.addEventListener('mouseenter', e => {
            setElementStyle(button, b.hover)
        })
        button.addEventListener('mouseleave', e => {
            setElementStyle(button, style)
        })

        item.appendChild(button)
        list.appendChild(item)
    }

    return { element: list, id, remove }
}

export { ButtonGroup }