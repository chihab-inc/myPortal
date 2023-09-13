import { create, select, setElementStyle, append, icon, backgroundImage } from '../web_utils.js'
import { GlobalStyle } from '../globalStyle.js'
import { linkDB } from '../controllers/database/linkDB.js'
import { LinkAnchor } from './LinkAnchor.js'
import { LinkDescription } from './LinkDescription.js'
import { ButtonGroup } from './ButtonGroup.js'
import { FormModal } from './FormModal.js'
import { TextInput } from './TextInput.js'
import { SelectInput } from './SelectInput.js'
import { sectionDB } from '../controllers/database/sectionDB.js'

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
                    buttonGroup.remove()
                    updateButtonGroup()
                    break
                case 'delete':
                    buttonGroup.remove()
                    remove()
                    updateButtonGroup()
                    break
                case 'permanentlyDelete':
                    remove()
                    break
                case 'recover':
                    buttonGroup.remove()
                    updateButtonGroup()
                    // TODO
                default:
                    break
            }
        })
    }

    const remove = () => element.remove()

    const updateButtonGroup = () => {
        const active = linkDB.getActiveById(id)
        const deleted = linkDB.getDeletedById(id)
        let buttons = null
        if (deleted) {
            buttons = [
                {
                    icon: icon('cross', 1),
                    clickHandler: () => {
                        linkDB.permanentlyDeleteLinkById(id)
                        // TODO - updateUI
                    },
                },
                {
                    icon: icon('arrow-left', 1),
                    clickHandler: () => {
                        linkDB.recoverDeletedLinkById(id)
                        updateUI('recover')
                    },
                },
            ]
        } else {
            const btns = [{
                icon: icon('cross', 1),
                clickHandler: () => {
                    linkDB.deleteLinkById(id)
                    updateUI('delete')
                },
            },
            {
                icon: icon('minus', 1),
                clickHandler: () => {
                    linkDB.toggleLinkById(id)
                    updateUI('active')
                },
            }]
            if (active) {
                btns.push({
                    icon: icon('pen', 1),
                    clickHandler: () => {
                        const inputFields = []

                        const link = linkDB.getLinkById(id)
    
                        const linkField = TextInput('Link', 'url', true, 524288, link.href, {})
                        inputFields.push({ inputField: linkField, propertyName: 'href' })
    
                        const logoField = TextInput('Logo URL', 'url', true, 524288, link.src, {})
                        inputFields.push({ inputField: logoField, propertyName: 'src' })
    
                        const descriptionField = TextInput('Short description', 'text', false, 32, link.tip, {})
                        inputFields.push({ inputField: descriptionField, propertyName: 'tip' })
    
                        const sectionField = SelectInput(
                            sectionDB.getAllSections().map(s => ({
                                value: s.id,
                                text: s.title,
                                selected: s.id === link.sectionId ? link.sectionId : undefined,
                                style: { background: sectionDB.getSectionById(s.id)?.colorAccent },
                            })),
                            false, link.sectionId, {}
                        )
                        inputFields.push({ inputField: sectionField, propertyName: 'sectionId' })
    
                        append(document.body,
                            FormModal(
                                {
                                    sectionId: linkDB.getSectionIdById(id),
                                    href: linkDB.getHrefById(id),
                                    src: linkDB.getSrcById(id),
                                    tip: linkDB.getTipById(id),
                                },
                                false, inputFields,
                                { true: icon('check', 1), false: icon('check-disabled', 1) },
                                temporaryData => {
                                    updateHref(temporaryData.href)
                                    updateSrc(temporaryData.src)
                                    updateTip(temporaryData.tip)
                                    updateSectionId(temporaryData.sectionid)
                                    updateUI('href', 'src', 'tip', /* 'sectionId' */)
                                },
                            )
                        )
                    }
                })
            }
            buttons = btns
        }
        buttonGroup = ButtonGroup({ orientation: 'v', globalStyle, type: 'rounded', position: { top: '5px', left: '5px' } }, buttons)
    }

    let element = create('li')
    setElementStyle(element, {
        width: '100px',
        height: '100px',
        position: 'relative',
        listStyleType: 'none',
    })
    
    const anchor = LinkAnchor(id)
    append(element, anchor)

    const description = LinkDescription(id)

    let buttonGroup = null

    element.addEventListener('mouseenter', () => {
        // APPEND DESCRIPTION ONLY IF THERE IS A TIP/DESCRIPTION
        !['', null, undefined].includes(linkDB.getTipById(id)) && append(element, description)
        updateButtonGroup()
        append(element, buttonGroup)
    })
    element.addEventListener('mouseleave', () => {
        description.remove()
        buttonGroup.remove()
        buttonGroup = null
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
