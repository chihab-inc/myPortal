import { create, select, setElementStyle, append, icon, backgroundImage } from '../web_utils.js'

const Link = props => {
    const tip = props.tip
    const anchor = props.anchor
    const description = props.description
    const buttonGroup = props.buttonGroup
    const globalStyle = props.globalStyle
    const theme = globalStyle.style.theme || {}

    const remove = () => {
        element.remove()
    }

    let element = create('li')
    setElementStyle(element, {
        width: '100px',
        height: '100px',
        position: 'relative',
    })
    
    append(element, anchor)

    element.addEventListener('mouseenter', e => {
        // APPEND DESCRIPTION ONLY IF THERE IS A TIP/DESCRIPTION
        tip && append(element, description)
        append(element, props.buttonGroup)
    })
    element.addEventListener('mouseleave', e => {
        description.remove()
        buttonGroup.remove()
    })
    
    return { element, remove }
}

export { Link }
