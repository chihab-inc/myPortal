import { create, select, setElementStyle, append } from '../web_utils.js'

const Section = props => {
    const title = props.title
    const colorAccent = props.colorAccent
    const links = props.links
    const hasLinks = links.length > 0
    const buttonGroup = props.buttonGroup

    // Keep track of children elements to remove
    const children = []
    
    const remove = () => {
        children.forEach(c => c.remove())
        element.remove()
    }

    const element = create('element')
    setElementStyle(element, {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '5px',
        width: '425px',
        minWidth: '425px',
        minHeight: '20px',
    })

    const header = create('header')
    children.push(header)
    setElementStyle(header, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '20px',
        paddingRight: '5px',
    })
    
    const h2 = create('h2')
    children.push(h2)
    h2.innerText = title
    setElementStyle(h2, {
        background: '#2a2c2c',
        // background: '#2a2c2c80',
        // backdropFilter: 'blur(15px)',
        minWidth: '50%',
        maxWidth: '60%',
        height: '100%',
        textAlign: 'center',
        fontSize: '1em',
        color: colorAccent,
        borderRadius: '5px',
    })
    header.appendChild(h2)
    element.appendChild(header)
    
    const ul = create('ul')
    children.push(ul)
    setElementStyle(ul, {
        background: '#2a2c2c',
        // background: '#2a2c2c80',
        // backdropFilter: 'blur(15px)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: '5px',
        width: '100%',
        minHeight: '110px',
        padding: '5px',
        listStyleType: 'none',
        borderRadius: '5px',
    })
    element.appendChild(ul)

    element.addEventListener('mouseenter', e => {
        append(header, buttonGroup)
        children.push(buttonGroup)
    })

    element.addEventListener('mouseleave', e => {
        buttonGroup.remove()
    })
    
    links.forEach(link => {
        append(ul, link)
    })
    
    return { element, remove }
}

export { Section }
