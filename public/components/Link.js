import { create, select, setElementStyle, append, icon, backgroundImage } from '../web_utils.js'
import { GlobalStyle } from '../globalStyle.js'
import { linkDB } from '../controllers/database/linkDB.js'
import { LinkAnchor } from './LinkAnchor.js'
import { LinkDescription } from './LinkDescription.js'

const Link = id => {

    const globalStyle = GlobalStyle()

    const updateSectionId = _sectionId => {
        linkDB.updateSectionIdById(id, _sectionId)
        remove()
        // SectionWatcher[_sectionId].refreshLinks()
    }
    
    const updateHref = _href => {
        linkDB.updateHrefById(id, _href)
        updateUI('href')
    }

    const updateSrc = _src => {
        linkDB.updateSrcById(id, _src)
        updateUI('src')
    }

    const updateTip = _tip => {
        linkDB.updateTipById(id, _tip)
        updateUI('tip')
    }

    const disable = () => {
        linkDB.disableLinkById(id)
        updateUI('active')
    }

    const enable = () => {
        linkDB.enableLinkById(id)
        updateUI('active')
    }

    const delete_ = () => {
        linkDB.deleteLinkById(id)
        updateUI('delete')
    }

    const recover = () => {
        linkDB.recoverDeletedLinkById(id)
        updateUI('recover')
    }

    const permanentlyDelete = () => {
        linkDB.permanentlyDeleteLinkById(id)
        updateUI('permanentlyDelete')
    }

    const updateUI = (...props) => {
        props.forEach(prop => {
            switch (prop) {
                case 'sectionId':
                    // TODO
                    break
                case 'href':
                    anchor.updateHref()
                    break
                case 'src':
                    anchor.updateSrc()
                    break
                case 'tip':
                    description.updateTip()
                    break
                case 'active':
                    anchor.updateActive()
                    break
                case 'delete':
                    remove()
                    break
                case 'permanentlyDelete':
                    remove()
                    break
                case 'recover':
                    // TODO
                default:
                    break
            }
        })
    }

    const remove = () => element.remove()

    let element = create('li')
    setElementStyle(element, {
        width: '100px',
        height: '100px',
        position: 'relative',
    })
    
    const anchor = LinkAnchor(id)
    append(element, anchor)

    const description = LinkDescription(id)

    element.addEventListener('mouseenter', () => {
        // APPEND DESCRIPTION ONLY IF THERE IS A TIP/DESCRIPTION
        !['', null, undefined].includes(linkDB.getTipById) && append(element, description)
        // append(element, props.buttonGroup)
    })
    element.addEventListener('mouseleave', () => {
        description.remove()
        // buttonGroup.remove()
    })

    element.addEventListener('keyup', e => {
        e.key === 'a' && updateHref('https://google.com/')
        e.key === 'z' && updateSrc('https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png')
        e.key === 'e' && updateTip('Google')
        e.key === 'r' && disable()
        e.key === 't' && enable()
        e.key === 'y' && delete_()
        e.key === 'u' && permanentlyDelete()
    })
    
    return { element, remove }
}

export { Link }
