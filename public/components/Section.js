import { create, select, setElementStyle, append } from '../web_utils.js'

const Section = props => {
    const title = props.title
    const colorAccent = props.colorAccent
    const links = props.links
    const hasLinks = links.length > 0
    const buttonGroup = props.buttonGroup
    
    const remove = () => {
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
        minHeight: '20px',
    })

    const header = create('header')
    setElementStyle(header, {
        display: 'flex',
        justifyContent: hasLinks ? 'space-between' : 'flec-start',
        alignItems: 'center',
        width: '100%',
        height: '20px',
        paddingRight: '5px',
    })
    
    const h2 = create('h2')
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
        padding: '5px',
        listStyleType: 'none',
        borderRadius: '5px',
    })
    hasLinks && element.appendChild(ul)

    element.addEventListener('mouseenter', e => {
        append(header, buttonGroup)
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
