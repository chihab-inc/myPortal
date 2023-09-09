import { create, select, setElementStyle, append, icon, backgroundImage } from '../web_utils.js'
import { ButtonGroup } from './ButtonGroup.js'
import { FormModal } from './FormModal.js'
import { linkDB } from '../controllers/database/linkDB.js'
import { sectionDB } from '../controllers/database/sectionDB.js'
import { TextInput } from './TextInput.js'
import { SelectInput } from './SelectInput.js'
import { LinkDescription } from './LinkDescription.js'
import { LinkAnchor } from './LinkAnchor.js'

const Link = props => {
    const id = props.id
    const sectionId = props.sectionId
    const href = props.href
    const src = props.src
    const tip = props.tip
    const active = props.active
    const deleted = props.deleted

    // const anchor = props.anchor
    // const description = props.description
    // const buttonGroup = props.buttonGroup
    const globalStyle = props.globalStyle
    const theme = globalStyle.style.theme || {}

    const buttonGroup = ButtonGroup({
        globalStyle,
        options: { orientation: 'v', globalStyle, type: 'rounded', position: { top: '5px', left: '5px' } },
        buttons: deleted
        ? [
            {
                style: {
                    backgroundImage: backgroundImage(icon('cross', 1)),
                    boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',// TODO - THIS SHOULD COME FROM GLOBAL STYLE
                },
                hover: { opacity: '1' },// TODO - THIS SHOULD COME FROM GLOBAL STYLE
                clickHandler: () => {
                    linkDB.permanentlyDeleteLinkById(id)
                    loadPage({ globalStyle })
                },
            },
            {
                style: {
                    backgroundImage: backgroundImage(icon('arrow-left', 1)),
                    boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',// TODO - THIS SHOULD COME FROM GLOBAL STYLE
                },
                hover: { opacity: '1' },// TODO - THIS SHOULD COME FROM GLOBAL STYLE
                clickHandler: () => {
                    linkDB.recoverDeletedLinkById(id)
                    loadPage({ globalStyle })
                },
            },
        ]
        : [
            {
                style: {
                    backgroundImage: backgroundImage(icon('cross', 1)),
                    boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',// TODO - THIS SHOULD COME FROM GLOBAL STYLE
                },
                hover: { opacity: '1' },// TODO - THIS SHOULD COME FROM GLOBAL STYLE
                clickHandler: () => {
                    linkDB.deleteLinkById(id)
                    loadPage({ globalStyle })
                },
            },
            {
                style: {
                    backgroundImage: backgroundImage(icon('minus', 1)),
                    boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',// TODO - THIS SHOULD COME FROM GLOBAL STYLE
                },
                hover: { opacity: '1' },// TODO - THIS SHOULD COME FROM GLOBAL STYLE
                clickHandler: () => {
                    linkDB.toggleLinkById(id)
                    loadPage({ globalStyle })
                },
            },
            active && {
                style: {
                    backgroundImage: backgroundImage(icon('pen', 1)),
                    boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',// TODO - THIS SHOULD COME FROM GLOBAL STYLE
                },
                hover: { opacity: '1' },// TODO - THIS SHOULD COME FROM GLOBAL STYLE
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
                            creating: false,
                            tmpData: {
                                id,
                                sectionId,
                                href,
                                src,
                                tip,
                                active,
                                deleted,
                            },
                            style: {
                                submitButton: {
                                    enabled: { backgroundImage: backgroundImage(icon('check', 1)) },
                                    disabled: { backgroundImage: backgroundImage(icon('check-disabled', 1)) },
                                }
                            },
                            inputFields,
                            clickHandler: temporaryData => {
                                linkDB.updateLinkPropertyById(temporaryData)
                                // loadPage({ globalStyle })
                            }
                        })
                    )
                }
            },
        ],
    })
    const description = LinkDescription({ globalStyle, tip })
    const anchor = LinkAnchor({ globalStyle, href, src, active })

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
        append(element, buttonGroup)
    })
    element.addEventListener('mouseleave', e => {
        description.remove()
        buttonGroup.remove()
    })
    
    return { element, remove }
}

export { Link }
