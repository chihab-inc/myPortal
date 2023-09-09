import { linkDB } from './linkDB.js'
import { sectionDB } from './sectionDB.js'
import { db } from './db.js'
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

const DB_NAME = 'DATA-BASE'

const MainComponent = props => {
    let main = create('main')
    main.id = 'main'

    // CREATE LINK ELEMENTS
    let linkWrappers = []
    for (const link of props.config.links) {
        const id = link.id
        const sectionId = link.sectionId
        const href = link.href
        const src = link.src
        const tip = link.tip
        const active = link.active
        const deleted = link.deleted
        const buttonGroup = ButtonGroup({
            options: { orientation: 'v', type: 'rounded', position: { top: '5px', left: '5px' } },
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
                        loadPage()
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
                        loadPage()
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
                        loadPage()
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
                        loadPage()
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
                            type: 'url',
                            placeholder: 'Link',
                            initialValue: href,
                            required: true,
                        })
                        inputFields.push({ inputField: linkField, propertyName: 'href' })

                        const logoField = TextInput({
                            type: 'url',
                            placeholder: 'Logo URL',// (it can be a local file URL)',
                            initialValue: src,
                            required: true,
                        })
                        inputFields.push({ inputField: logoField, propertyName: 'src' })

                        const descriptionField = TextInput({
                            type: 'text',
                            placeholder: 'Short description',
                            initialValue: tip,
                            maxLength: 32,
                        })
                        inputFields.push({ inputField: descriptionField, propertyName: 'tip' })

                        const allSections = sectionDB.getAllSections()
                        const sectionField = SelectInput({
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
                                    loadPage()
                                }
                            })
                        )
                    }
                },
            ],
        })
        const anchor = LinkAnchor({ href, src, active })
        const description = LinkDescription({ tip })
        let linkComponent = Link({ id, sectionId, href, src, tip, deleted, buttonGroup, description, anchor })
        linkWrappers.push({ sectionId, deleted, linkComponent })
    }

    // CREATE SECTION ELEMENTS AND ADD LINK ELEMENTS
    let sectionComponents = []
    for (const section of props.config.sections) {
        const id = section.id
        const title = section.title
        const colorAccent = section.colorAccent
        const extendedView = section.extendedView
        const buttonGroup = ButtonGroup({
            options: { type: 'rounded' },
            buttons: [
                {
                    style: { backgroundImage: backgroundImage(icon('pen')) },
                    hover: { opacity: '1' },
                    clickHandler: () => {
                        const inputFields = []

                        const titleField = TextInput({
                            type: 'text',
                            placeholder: 'Title',
                            initialValue: title,
                            required: true,
                        })
                        inputFields.push({ inputField: titleField, propertyName: 'title' })

                        const colorField = ColorInput({
                            initialValue: colorAccent,
                            required: true,
                        })
                        inputFields.push({ inputField: colorField, propertyName: 'colorAccent' })

                        append(document.body,
                            FormModal({
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
                                    loadPage()
                                }
                            })
                        )
                    },
                },
                {
                    style: { backgroundImage: backgroundImage(icon('cross')) },
                    hover: { opacity: '1' },
                    clickHandler: () => {
                        sectionDB.deleteSectionById(id)
                        linkDB.permanentlyDeleteLinksBySectionId(id)
                        loadPage()
                    },
                },
                {
                    style: { backgroundImage: backgroundImage(icon('plus')) },
                    hover: { opacity: '1' },
                    clickHandler: () => {
                        const inputFields = []

                        const linkField = TextInput({ type: 'url', placeholder: 'Link', required: true })
                        inputFields.push({ inputField: linkField, propertyName: 'href' })

                        const logoField = TextInput({ type: 'url', placeholder: 'Logo URL',/* (it can be a local file URL)', */ required: true })
                        inputFields.push({ inputField: logoField, propertyName: 'src' })

                        const descriptionField = TextInput({ type: 'text', placeholder: 'Short description', maxLength: 32 })
                        inputFields.push({ inputField: descriptionField, propertyName: 'tip' })
                        
                        append(document.body,
                            FormModal({
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
                                    loadPage()
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
                        loadPage()
                    },
                },
                {
                    style: { backgroundImage: backgroundImage(icon('minus')) },
                    hover: { opacity: '1' },
                    clickHandler: () => {
                        linkDB.toggleLinksBySectionId(id)
                        loadPage()
                    },
                },
            ]
        })
        sectionComponents.push(
            Section({
                id,
                colorAccent,
                title,
                extendedView,
                buttonGroup,
                links: linkWrappers
                    .filter(linkWrapper => linkWrapper.sectionId === id)
                    .filter(linkWrapper => !linkWrapper.deleted || (linkWrapper.deleted && extendedView))
                    .map(linkWrapper => linkWrapper.linkComponent)
            })
        )
    }

    // ADD EATCH SECTION ELEMENT TO MAIN
    for (const sectionComponent of sectionComponents) {
        append(main, sectionComponent)
    }

    return main
}

const loadPage = () => {
    select('#main')?.remove()
    select('#add-data-panel')?.remove()

    const noData = !db.getFromDB(DB_NAME) || sectionDB.getSectionCount() === 0

    document.body.style.justifyContent = noData ? 'center' : 'flex-start'
    document.body.style.alignItems = noData ? 'center' : 'flex-start'
    
    const addDataPanel = AddDataPanel({
        initial: noData,
        callBack: () => {
            const inputFields = []

            const titleField = TextInput({ type: 'text', placeholder: 'Title', required: true })
            inputFields.push({ inputField: titleField, propertyName: 'title' })

            const colorField = ColorInput({ required: true })
            inputFields.push({ inputField: colorField, propertyName: 'colorAccent' })
            
            append(document.body,
                FormModal({
                    creating: false,
                    tmpData: {
                        id: crypto.randomUUID(),
                        extendedView: false,
                    },
                    style: {
                        submitButton: {
                            enabled: { backgroundImage: backgroundImage(icon('plus')) },
                            disabled: { backgroundImage: backgroundImage(icon('plus-disabled')) },
                        }
                    },
                    inputFields,
                    clickHandler: temporaryData => {
                        sectionDB.createSection(temporaryData)
                        loadPage()
                    }
                })
            )
        }
    })

    
    if (!noData) {
        const main = MainComponent({ config: db.getFromDB(DB_NAME) })
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
    window.addEventListener('load', e => {
        // RESET DISPLAY SETTINGS WHEN WHOLE DOM LOADS/RELOADS
        resetDisplaySettings()
        loadPage()
    })
}

init()