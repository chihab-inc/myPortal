import { create, select, setElementStyle, append, icon, backgroundImage } from '../web_utils.js'

const AddDataPanel = props => {
    const initial = props.initial
    const style = props.style || {}

    const children = []

    const remove = () => {
        children.forEach(c => c.remove())
        element.remove()
    }

    const element = create('div')
    setElementStyle(element, {
        ...style,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        userSelect: 'none',
        position: initial ? 'static' : 'fixed',
        top: initial ? 'auto' : '20px',
        left: initial ? 'auto' : '20px',
        height: initial ? style.height || 'auto' : '60px',
        width: initial ? style.width || 'auto' : '60px',
        borderRadius: initial ? 'none' : '50%',
        background: initial ? 'none' : '#2a2c2c',
    })

    const img = create('img')
    children.push(img)
    img.src = icon('plus')
    setElementStyle(img, {
        borderRadius: '50%',
        height: '100%',
        maxHeight: '150px',
        opacity: '.6',
        transition: 'all 0.1s ease-in-out',
    })
    img.addEventListener('mouseenter', () => {
        setElementStyle(img, {
            opacity: '1',
        })
    })
    img.addEventListener('mouseleave', () => {
        setElementStyle(img, {
            opacity: '.6',
        })
    })

    const span = create('span')
    children.push(span)
    span.textContent = 'Add New Section'
    setElementStyle(span, {
        textAlign: 'center',
        color: '#282c31',
        fontSize: '30px',
        fontWeight: 'bold',
        fontFamily: '“Helvetica Neue”, Helvetica, Arial, sans-serif',
    })

    element.addEventListener('click', e => {
        props.callBack()
    })

    element.appendChild(img)
    initial && element.appendChild(span)

    return { element, remove }
}

export { AddDataPanel }