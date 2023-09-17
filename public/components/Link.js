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

const Link = (id, parentUpdateUI, newParentUpdateUI) => {

    const globalStyle = GlobalStyle()

    const updateSectionId = _sectionId => {
        if (_sectionId !== linkDB.getSectionIdById(id)) {
            linkDB.updateSectionIdById(id, _sectionId)
            remove()
            updateUI('sectionId')
            newParentUpdateUI(_sectionId)
            // SectionWatcher[_sectionId].refreshLinks()
        }
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

    const toggleActive = () => {
        linkDB.toggleLinkById(id)
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
        // REQUEST CONFIRMATION BEFORE PERMANENTLY DELETING LINK
        /* if (window.confirm('Sure?')) {
            linkDB.permanentlyDeleteLinkById(id)
            updateUI('permanentlyDelete')
        } */
        linkDB.permanentlyDeleteLinkById(id)
        updateUI('permanentlyDelete')
    }

    const updateUI = (...props) => {
        props.forEach(prop => {
            switch (prop) {
                case 'sectionId':
                    parentUpdateUI()
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
                    updateButtonGroup()
                    parentUpdateUI()
                    break
                case 'permanentlyDelete':
                    remove()
                    break
                case 'recover':
                    buttonGroup.remove()
                    updateButtonGroup()
                    break
                default:
                    break
            }
        })
    }

    const remove = () => element.remove()

    const updateButtonGroup = () => {
        const active = linkDB.getActiveById(id)
        const deleted = linkDB.getDeletedById(id)
        let buttons = []
        if (deleted) {
            buttons = [
                {
                    icon: icon('cross', 1),
                    clickHandler: () => {
                        permanentlyDelete()
                    },
                },
                {
                    icon: icon('arrow-left', 1),
                    clickHandler: () => {
                        recover()
                    },
                },
            ]
        } else {
            const btns = [
                {
                    icon: icon('cross', 1),
                    clickHandler: () => {
                        delete_()
                    },
                },
                {
                    icon: icon('minus', 1),
                    clickHandler: () => {
                        toggleActive()
                    },
                }
            ]
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
                                false,
                                inputFields,
                                { true: icon('check', 1), false: icon('check-disabled', 1) },
                                temporaryData => {
                                    updateHref(temporaryData.href)
                                    updateSrc(temporaryData.src)
                                    updateTip(temporaryData.tip)
                                    updateSectionId(temporaryData.sectionId)
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

    let buttonGroup
    updateButtonGroup()

    element.addEventListener('mouseenter', () => {
        // APPEND DESCRIPTION ONLY IF THERE IS A TIP/DESCRIPTION
        !['', null, undefined].includes(linkDB.getTipById(id)) && append(element, description)
        append(element, buttonGroup)
    })
    element.addEventListener('mouseleave', () => {
        description.remove()
        buttonGroup.remove()
    })
    
    return { element, updateUI, remove }
}

export { Link }
