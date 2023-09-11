import { create, select, setElementStyle, append, pushElement, icon, backgroundImage } from '../web_utils.js'
import { ButtonGroup } from './ButtonGroup.js'
import { FormModal } from './FormModal.js'
import { linkDB } from '../controllers/database/linkDB.js'
import { sectionDB } from '../controllers/database/sectionDB.js'
import { TextInput } from './TextInput.js'
import { SelectInput } from './SelectInput.js'
import { LinkDescription } from './LinkDescription.js'
import { LinkAnchor } from './LinkAnchor.js'

const Link = props => {
    let id = props.id
    let sectionId = props.sectionId
    let href = props.href
    let src = props.src
    let tip = props.tip
    let active = props.active
    let deleted = props.deleted
    let parent = props.parent

    const anchorHolder = []
    const descriptionHolder = []
    const buttonGroupHolder = []

    const globalStyle = props.globalStyle
    const theme = globalStyle.style.theme || {}

    // CREATING BUTTONGROUP BUTTONS INDIVIDUALLY
    // BUTTONS DISPLAYED WHEN LINK IS DELETED
    const permanentlyDeleteLinkButton = {
        icon: icon('cross', 1),
        clickHandler: () => {
            linkDB.permanentlyDeleteLinkById(id)
            // TODO - CONFIRMATION SHOULD GO HERE
            remove()
        },
    }
    const recoverLinkButton = {
        icon: icon('arrow-left', 1),
        clickHandler: () => {
            linkDB.recoverDeletedLinkById(id)
            // TODO - PARENT UPDATE
            // loadPage({ globalStyle })
        },
    }
    // BUTTONS DISPLAYED WHEN LINK IS NOT DELETED
    const deleteLinkButton = {
        icon: icon('cross', 1),
        clickHandler: () => {
            linkDB.deleteLinkById(id)
            // TODO - PARENT UPDATE
            // loadPage({ globalStyle })
        },
    }
    const disableLinkButton = {
        icon: icon('minus', 1),
        clickHandler: () => {
            linkDB.toggleLinkById(id)
            updateActive(!active)
        },
    }
    const editLinkButton = {
        icon: icon('pen', 1),
        clickHandler: () => {
            const inputFields = []

            const linkField = TextInput({
                globalStyle,
                type: 'url',
                placeholder: 'Link',
                initialValue: href,
                required: true,
            })
            inputFields.push({ inputField: linkField, propertyName: 'href' })

            const logoField = TextInput({
                globalStyle,
                type: 'url',
                placeholder: 'Logo URL',// (it can be a local file URL)',
                initialValue: src,
                required: true,
            })
            inputFields.push({ inputField: logoField, propertyName: 'src' })

            const descriptionField = TextInput({
                globalStyle,
                type: 'text',
                placeholder: 'Short description',
                initialValue: tip,
                maxLength: 32,
            })
            inputFields.push({ inputField: descriptionField, propertyName: 'tip' })

            const allSections = sectionDB.getAllSections()
            const sectionField = SelectInput({
                globalStyle,
                items: allSections.map(s => ({
                    value: s.id,
                    text: s.title,
                    selected: s.id === sectionId ? sectionId : undefined,
                    style: { background: allSections.find(ss => ss.id === s.id)?.colorAccent },
                })),
                initialValue: sectionId,
            })
            inputFields.push({ inputField: sectionField, propertyName: 'sectionId' })

            append(document.body,
                FormModal({
                    globalStyle,
                    tmpData: {
                        id,
                        sectionId,
                        href,
                        src,
                        tip,
                        active,
                        deleted,
                    },
                    submitButtonIcon: { enabled: icon('check', 1), disabled: icon('check-disabled', 1) },
                    inputFields,
                    submitHandler: temporaryData => {
                        linkDB.updateLinkPropertyById(temporaryData)
                        updateTip(linkDB.getLinkById(id).tip)
                        updateHref(linkDB.getLinkById(id).href)
                        updateSrc(linkDB.getLinkById(id).src)
                        // TODO - MANAGE CHANGING SECTION <= NEED TO USE PARENT
                        // loadPage({ globalStyle })
                    }
                })
            )
        }
    }

    let buttonGroup = ButtonGroup({
        globalStyle,
        options: { orientation: 'v', globalStyle, type: 'rounded', position: { top: '5px', left: '5px' } },
        buttons: {
            true: [
                permanentlyDeleteLinkButton,
                recoverLinkButton,
            ],
            false: [
                deleteLinkButton,
                disableLinkButton,
                active && editLinkButton,
            ],
        }[deleted],
    })

    const remove = () => {
        element.remove()
    }
    
    const updateButtonGroup = () => {}

    const updateSectionId = _sectionId => {
        sectionId = _sectionId
    }
    const updateHref = _href => {
        href = _href
        anchorHolder.forEach(a => {
            a.updateHref(href)
        })
    }
    const updateSrc = _src => {
        src = _src
        anchorHolder.forEach(a => {
            a.updateSrc(src)
        })
    }
    const updateTip = _tip => {
        tip = _tip
        descriptionHolder.forEach(d => d.updateTip(tip))
    }
    const updateActive = _active => {
        active = _active
        anchorHolder.forEach(a => {
            a.updateActive(active)
        })
    }
    const updateDeleted = _deleted => {
        deleted = _deleted
    }

    const populate = () => {
        let anchor = pushElement(anchorHolder, LinkAnchor({ globalStyle, href, src, active }))
        append(element, anchor)
        pushElement(descriptionHolder, LinkDescription({ globalStyle, tip }))
    }

    let element = create('li')
    setElementStyle(element, {
        width: '100px',
        height: '100px',
        position: 'relative',
    })
    
    // append(element, anchor)

    element.addEventListener('mouseenter', e => {
        // APPEND DESCRIPTION ONLY IF THERE IS A TIP/DESCRIPTION
        tip && append(element, ...descriptionHolder)
        append(element, buttonGroup)
    })
    element.addEventListener('mouseleave', e => {
        descriptionHolder.forEach(description => description.remove())
        buttonGroup.remove()
    })

    populate()
    
    return { element, populate, remove }
}

export { Link }
