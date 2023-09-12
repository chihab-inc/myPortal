import { setElementStyle, create } from '../web_utils.js'
import { GlobalStyle } from '../globalStyle.js'
import { linkDB } from '../controllers/database/linkDB.js'

const LinkAnchor = id => {

    const globalStyle = GlobalStyle()

    const updateHref = () => updateUI('href')

    const updateSrc = () => updateUI('src')

    const updateActive = () => updateUI('active')

    const updateUI = (...props) => {
        props.forEach(prop => {
            switch (prop) {
                case 'href':
                    element.href = linkDB.getHrefById(id)
                    break
                case 'src':
                    image.src = linkDB.getSrcById(id)
                    break
                case 'active':
                    setElementStyle(element, linkDB.getActiveById(id) ? { opacity: '1', pointerEvents: 'all' } : { opacity: '.2', pointerEvents: 'none' })
                    break
                default:
                    break
            }
        })
    }

    const remove = () => {
        image.remove()
        element.remove()
    }
    
    const element = create('a')
    element.target = '_blank'
    element.href = linkDB.getHrefById(id)
    setElementStyle(element, {
        opacity: linkDB.getActiveById(id) ? '1' : '.1',
        pointerEvents: linkDB.getActiveById(id) ? 'auto' : 'none',
        width: '100%',
        height: '100%',
        borderRadius: globalStyle.style.general.borderRadiusM,
        display: 'inline-block',
        textDecoration: 'none',
        transition: `all ${globalStyle.style.general.transitionQuick}`
    })

    const image = create('img')
    image.src = linkDB.getSrcById(id)
    setElementStyle(image, {
        width: '100%',
        height: '100%',
        borderRadius: globalStyle.style.general.borderRadiusM,
    })
    element.appendChild(image)

    element.addEventListener('mouseenter', () => {
        setElementStyle(element, { boxShadow: globalStyle.style.general.boxShadow })
    })
    element.addEventListener('mouseleave', () => {
        setElementStyle(element, { boxShadow: 'none' })
    })

    return { element, updateHref, updateSrc, updateActive, remove }
}

export { LinkAnchor }
