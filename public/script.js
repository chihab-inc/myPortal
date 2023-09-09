import { linkDB } from './controllers/database/linkDB.js'
import { sectionDB } from './controllers/database/sectionDB.js'
import { themeDB } from './controllers/database/themeDB.js'
import { db } from './controllers/database/db.js'
import { create, select, setElementStyle, append, icon, backgroundImage } from './web_utils.js'
import { ButtonGroup } from './components/ButtonGroup.js'
import { Button } from './components/Button.js'
import { LinkDescription } from './components/LinkDescription.js'
import { LinkAnchor } from './components/LinkAnchor.js'
import { Link } from './components/Link.js'
import { Section } from './components/Section.js'
import { AddDataPanel } from './components/AddDataPanel.js'
import { TextInput } from './components/TextInput.js'
import { SelectInput } from './components/SelectInput.js'
import { ColorInput } from './components/ColorInput.js'
import { FormModal } from './components/FormModal.js'
import { globalStyle as global_style } from './globalStyle.js'

const DB_NAME = 'DATA-BASE'

const MainComponent = props => {
    const globalStyle = props.globalStyle
    
    let main = create('main')
    main.id = 'main'

    // CREATE LINK ELEMENTS
    const linkWrappers = []
    for (const link of props.config.links) {
        const id = link.id
        const sectionId = link.sectionId
        const href = link.href
        const src = link.src
        const tip = link.tip
        const active = link.active
        const deleted = link.deleted
        const buttonGroup = ButtonGroup({
            globalStyle,
            options: { orientation: 'v', globalStyle, type: 'rounded', position: { top: '5px', left: '5px' } },
            buttons: deleted
            ? [
                {
                    style: {
                        backgroundImage: backgroundImage(icon('cross')),
                        boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
                    },
                    hover: { opacity: '1' },
                    clickHandler: () => {
                        linkDB.permanentlyDeleteLinkById(id)
                        loadPage({ globalStyle })
                    },
                },
                {
                    style: {
                        backgroundImage: backgroundImage(icon('arrow-left')),
                        boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
                    },
                    hover: { opacity: '1' },
                    clickHandler: () => {
                        linkDB.recoverDeletedLinkById(id)
                        loadPage({ globalStyle })
                    },
                },
            ]
            : [
                {
                    style: {
                        backgroundImage: backgroundImage(icon('cross')),
                        boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
                    },
                    hover: { opacity: '1' },
                    clickHandler: () => {
                        linkDB.deleteLinkById(id)
                        loadPage({ globalStyle })
                    },
                },
                {
                    style: {
                        backgroundImage: backgroundImage(icon('minus')),
                        boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
                    },
                    hover: { opacity: '1' },
                    clickHandler: () => {
                        linkDB.toggleLinkById(id)
                        loadPage({ globalStyle })
                    },
                },
                active && {
                    style: {
                        backgroundImage: backgroundImage(icon('pen')),
                        boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px',
                    },
                    hover: { opacity: '1' },
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
                                        enabled: { backgroundImage: backgroundImage(icon('check')) },
                                        disabled: { backgroundImage: backgroundImage(icon('check-disabled')) },
                                    }
                                },
                                inputFields,
                                clickHandler: temporaryData => {
                                    linkDB.updateLinkPropertyById(temporaryData)
                                    loadPage({ globalStyle })
                                }
                            })
                        )
                    }
                },
            ],
        })
        // CONVERT IMAGE INTO BASE 64 AND STORE IT IN DATABASE FOR FASTER LOADING
        const srcB64 = (image) => {
            image.crossOrigin = 'anonymous'
            if (linkDB.getLinkById(id).srcB64) {
                image.src = linkDB.getLinkById(id).srcB64
            } else {
                image.src = src
                image.addEventListener('load', () => {
                    const w = image.naturalWidth
                    const h = image.naturalHeight
                    
                    const canvas = document.createElement('canvas')
                    canvas.setAttribute('width', `${w}px`)
                    canvas.setAttribute('height', `${h}px`)
                    
                    const ctx = canvas.getContext('2d')
                    ctx.drawImage(image, 0, 0)
        
                    linkDB.updateLinkPropertyById({id, srcB64: canvas.toDataURL('image/png')})
                })
            }
        }
        const anchor = LinkAnchor({ globalStyle, href, src, callBack: srcB64, active })
        const description = LinkDescription({ globalStyle, tip })
        const linkComponent = Link({ globalStyle, id, sectionId, href, src, tip, deleted, buttonGroup, description, anchor })
        linkWrappers.push({ sectionId, deleted, linkComponent })
    }

    // CREATE SECTION ELEMENTS AND ADD LINK ELEMENTS
    const sectionComponents = []
    for (const section of props.config.sections) {
        const id = section.id
        const title = section.title
        const colorAccent = section.colorAccent
        const extendedView = section.extendedView
        const buttonGroup = ButtonGroup({
            globalStyle,
            options: { type: 'rounded' },
            buttons: [
                {
                    style: { backgroundImage: backgroundImage(icon('pen')) },
                    hover: { opacity: '1' },
                    clickHandler: () => {
                        const inputFields = []

                        const titleField = TextInput({
                            globalStyle,
                            type: 'text',
                            placeholder: 'Title',
                            initialValue: title,
                            required: true,
                        })
                        inputFields.push({ inputField: titleField, propertyName: 'title' })

                        const colorField = ColorInput({
                            globalStyle,
                            initialValue: colorAccent,
                            required: true,
                        })
                        inputFields.push({ inputField: colorField, propertyName: 'colorAccent' })

                        append(document.body,
                            FormModal({
                                globalStyle,
                                creating: false,
                                tmpData: {
                                    id,
                                    title,
                                    colorAccent,
                                    extendedView,
                                },
                                style: {
                                    submitButton: {
                                        enabled: { backgroundImage: backgroundImage(icon('check')) },
                                        disabled: { backgroundImage: backgroundImage(icon('check-disabled')) },
                                    }
                                },
                                inputFields,
                                clickHandler: temporaryData => {
                                    sectionDB.updateSectionPropertyById(temporaryData)
                                    loadPage({ globalStyle })
                                }
                            })
                        )
                    },
                },
                {
                    style: { backgroundImage: backgroundImage(icon('cross')) },
                    hover: { opacity: '1' },
                    clickHandler: () => {
                        /* // ANCHOR - CONFIRMATION
                        if (confirm(`Delete section "${title}" and every link contained in it?`)) {
                        } */
                        sectionDB.deleteSectionById(id)
                        linkDB.permanentlyDeleteLinksBySectionId(id)
                        loadPage({ globalStyle })
                    },
                },
                {
                    style: { backgroundImage: backgroundImage(icon('plus')) },
                    hover: { opacity: '1' },
                    clickHandler: () => {
                        const inputFields = []

                        const linkField = TextInput({ globalStyle, type: 'url', placeholder: 'Link', required: true })
                        inputFields.push({ inputField: linkField, propertyName: 'href' })

                        const logoField = TextInput({ globalStyle, type: 'url', placeholder: 'Logo URL',/* (it can be a local file URL)', */ required: true })
                        inputFields.push({ inputField: logoField, propertyName: 'src' })

                        const descriptionField = TextInput({ globalStyle, type: 'text', placeholder: 'Short description', maxLength: 32 })
                        inputFields.push({ inputField: descriptionField, propertyName: 'tip' })
                        
                        append(document.body,
                            FormModal({
                                globalStyle,
                                creating: true,
                                tmpData: {
                                    id: crypto.randomUUID(),
                                    sectionId: id,
                                    active: true,
                                    deleted: false,
                                },
                                style: {
                                    submitButton: {
                                        enabled: { backgroundImage: backgroundImage(icon('plus')) },
                                        disabled: { backgroundImage: backgroundImage(icon('plus-disabled')) },
                                    }
                                },
                                inputFields,
                                clickHandler: temporaryData => {
                                    linkDB.createLink(temporaryData)
                                    loadPage({ globalStyle })
                                }
                            })
                        )
                    },
                },
                {
                    style: { backgroundImage: backgroundImage(icon(extendedView ? 'hide' : 'view')) },
                    hover: { opacity: '1' },
                    clickHandler: () => {
                        sectionDB.toggleExtendedViewById(id)
                        loadPage({ globalStyle })
                    },
                },
                {
                    style: { backgroundImage: backgroundImage(icon('minus')) },
                    hover: { opacity: '1' },
                    clickHandler: () => {
                        linkDB.toggleLinksBySectionId(id)
                        loadPage({ globalStyle })
                    },
                },
            ]
        })
        sectionComponents.push(
            Section({
                globalStyle,
                id,
                colorAccent,
                title,
                extendedView,
                buttonGroup,
                links: linkWrappers
                    .filter(linkWrapper => linkWrapper.sectionId === id)
                    .filter(linkWrapper => !linkWrapper.deleted || (linkWrapper.deleted && extendedView))
                    .map(linkWrapper => linkWrapper.linkComponent),
            })
        )
    }

    // ADD EATCH SECTION ELEMENT TO MAIN
    for (const sectionComponent of sectionComponents) {
        append(main, sectionComponent)
    }

    return main
}

const loadPage = props => {
    const globalStyle = props.globalStyle

    select('#main')?.remove()
    select('#add-data-panel')?.remove()

    const noData = !db.getDatabase(DB_NAME) || sectionDB.getSectionCount() === 0

    document.body.style.justifyContent = noData ? 'center' : 'flex-start'
    document.body.style.alignItems = noData ? 'center' : 'flex-start'
    
    const addDataPanel = AddDataPanel({
        initial: noData,
        globalStyle,
        callBack: () => {
            const inputFields = []

            const titleField = TextInput({ type: 'text', globalStyle, placeholder: 'Title', required: true })
            inputFields.push({ inputField: titleField, propertyName: 'title' })

            const colorField = ColorInput({ globalStyle, required: true })
            inputFields.push({ inputField: colorField, propertyName: 'colorAccent' })
            
            append(document.body,
                FormModal({
                    creating: false,
                    tmpData: {
                        id: crypto.randomUUID(),
                        extendedView: false,
                    },
                    globalStyle,
                    style: {
                        submitButton: {
                            enabled: { backgroundImage: backgroundImage(icon('plus')) },
                            disabled: { backgroundImage: backgroundImage(icon('plus-disabled')) },
                        }
                    },
                    inputFields,
                    clickHandler: temporaryData => {
                        sectionDB.createSection(temporaryData)
                        loadPage({ globalStyle })
                    }
                })
            )
        }
    })

    
    if (!noData) {
        const main = MainComponent({ config: db.getDatabase(DB_NAME), globalStyle })
        document.body.appendChild(main)
    }

    append(document.body, addDataPanel)
}

const resetDisplaySettings = () => {
    sectionDB.getAllSections().forEach(s => {
        sectionDB.disableExtendedViewById(s.id)
    })
}

const init = () => {
    window.addEventListener('load', () => {
        if (!themeDB.getTheme() || Object.keys(themeDB.getTheme()).length === 0) {
            themeDB.createTheme()
        }
        const globalStyle = global_style({ theme: themeDB.getTheme() })
        // RESET DISPLAY SETTINGS WHEN WHOLE DOM LOADS/RELOADS
        resetDisplaySettings()
        loadPage({ globalStyle })
    })
}

init()