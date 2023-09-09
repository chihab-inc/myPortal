import { create, select, setElementStyle, append } from '../web_utils.js'

const Section = props => {
    const title = props.title
    const colorAccent = props.colorAccent
    const links = props.links
    const hasLinks = links.length > 0
    const buttonGroup = props.buttonGroup
    const globalStyle = props.globalStyle
    const theme = globalStyle.style.theme || {}

    // Keep track of children elements to remove
    const children = []
    
    const remove = () => {
        children.forEach(c => c.remove())
        element.remove()
    }

    const element = create('section')
    setElementStyle(element, {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: globalStyle.style.general.flexGapS,
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
        paddingRight: globalStyle.style.general.paddingM,
    })
    
    const h2 = create('h2')
    children.push(h2)
    h2.innerText = title
    setElementStyle(h2, {
        backgroundColor: globalStyle.style.general.backgroundColorSecondary,
        minWidth: '50%',
        maxWidth: '60%',
        height: '100%',
        textAlign: 'center',
        fontSize: globalStyle.style.general.fontSizeM,
        color: colorAccent,
        borderRadius: globalStyle.style.general.borderRadiusM,
        ...{
            backgroundColor: theme.backgroundColorSecondary || globalStyle.style.general.backgroundColorSecondary,
            border: theme.border || globalStyle.style.general.noBorder,
            backdropFilter: theme.backdropFilter || globalStyle.style.general.backdropFilter,
        },
    })
    header.appendChild(h2)
    element.appendChild(header)
    
    const ul = create('ul')
    children.push(ul)
    setElementStyle(ul, {
        backgroundColor: globalStyle.style.general.backgroundColorSecondary,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: globalStyle.style.general.flexGapS,
        width: '100%',
        minHeight: '110px',
        padding: globalStyle.style.general.paddingM,
        listStyleType: 'none',
        borderRadius: globalStyle.style.general.borderRadiusM,
        ...{
            backgroundColor: theme.backgroundColorSecondary || globalStyle.style.general.backgroundColorSecondary,
            border: theme.border || globalStyle.style.general.noBorder,
            padding: theme.padding || globalStyle.style.general.paddingM,
            backdropFilter: theme.backdropFilter || globalStyle.style.general.backdropFilter,
        },
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
