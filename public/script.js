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

const DB_NAME = 'DATA-BASE'

// GLOBALS
const modalTracker = { formModalOpen: false }

const FormModal = props => {
    const tmpData = props.tmpData || {}
    const clickHandler = props.clickHandler

    const style = props.style || {}
    const creating = props.creating
    const inputFields = props.inputFields || []


    const checkForm = () => {
        let allValid = true
        let someChanged = false
        inputFields.map(f => f.inputField).forEach(f => {
            allValid = allValid && f.isValid()
            someChanged = someChanged || f.hasChanged()
        })
        submitButton.disabled = !((!creating && allValid && someChanged) || (creating && allValid))
        setElementStyle(submitButton, submitButton.disabled ? style.submitButton.disabled : style.submitButton.enabled)
    }

    const remove = () => {
        setElementStyle(form, { animation: 'push-form-out 0.3s ease-in-out 1' })
        setElementStyle(element, { animation: 'blur-form-out 0.3s ease-in-out 1' })
        setTimeout(() => {
            inputFields.forEach(f => f.inputField.remove())
            element.remove()
        }, 300)
    }

    let element = create('div')
    setElementStyle(element, {
        background: '#0009',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        left: '0px',
        top: '0px',
        width: '100vw',
        height: '100vh',
        backdropFilter: 'blur(15px)',
        animation: 'blur-form-in 0.3s ease-in-out 1',
    })

    let form = create('div')
    form.id = 'form'
    setElementStyle(form, {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '5px',
        background: '#3338',
        minWidth: '300px',
        padding: '10px',
        borderRadius: '10px',
        boxShadow: '0 0 30px rgba(0, 0, 0, 0.6)',
        animation: 'pop-form-in 0.3s ease-in-out 1',
    })
    
    let submitButton = create('button')
    setElementStyle(submitButton, {
        ...style.submitButton || {},
        minWidth: '40px',
        height: '40px',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        border: 'none',
        boxSizing: 'border-box',
        borderRadius: '50%',
        opacity: '.6',
        cursor: 'pointer',
        transition: 'all .1s ease-in-out',
    })
    submitButton.textContent = ''
    checkForm()

    submitButton.addEventListener('mouseenter', () => {
        setElementStyle(submitButton, {
            opacity: '1',
        })
    })

    submitButton.addEventListener('mouseleave', () => {
        setElementStyle(submitButton, {
            opacity: '.6',
        })
    })

    submitButton.addEventListener('click', () => {
        inputFields.forEach(f => { tmpData[f.propertyName] = f.inputField.getValue() })
        db.createTemporary(
            'tmpData',
            tmpData,
            temporaryData => {
                clickHandler(temporaryData)
            }
        )
        remove()
    })

    element.addEventListener('mousedown', e => {
        return element !== e.target ? null : remove()
    })

    element.addEventListener('mouseenter', () => {// TODO - NEEDS TO BE ON LOAD, FIGURE OUT HOW
        inputFields[0].inputField.focus()
    })

    element.addEventListener('keyup', e => {
        e.key === 'Escape' && remove()
    })
    
    inputFields.forEach(f => {
        f.inputField.setCallBack(checkForm)
        append(form, f.inputField)
    })
    form.appendChild(submitButton)
    element.appendChild(form)

    return element// TODO - NEED TO RETURN OBJECT CONTAINING element AS A PROPERTY
}

const SectionFormModalComponent = props => {// TODO - Make this into a component that takes form fields as props
    modalTracker.formModalOpen = true

    const initialValues = {
        title: props.title,
        colorAccent: props.colorAccent,
    }

    const hasChanged = (fields, initialValues) => {
        return fields.title !== initialValues.title
        || fields.colorAccent !== initialValues.colorAccent
    }
    const formValidate = fields => {
        return (
            !['', null, undefined].includes(fields.title)
            && ![''].includes(fields.title.replaceAll(' ', ''))
        )
    }

    const hide = () => {
        if (modalTracker.formModalOpen) {
            modalTracker.formModalOpen = false
            let form = select('#form')
            form.style.animation = 'push-form-out 0.3s ease-in-out 1'
            let formContainer = select('#form-container')
            formContainer.style.animation = 'blur-form-out 0.3s ease-in-out 1'
            setTimeout(() => {
                select('#form-container')?.remove()
                document.body.style.overflow = 'auto'
            }, 300)
        }
    }

    let container = create('div')
    container.id = 'form-container'

    let form = create('div')
    form.id = 'form'

    let titleField = create('input')
    titleField.type = 'text'
    titleField.placeholder = 'Title'
    titleField.value = props.creating ? null : props.title

    let colorAccentField = create('input')
    colorAccentField.type = 'color'
    colorAccentField.value = props.creating ? '#bf616a' : props.colorAccent

    let submitButton = create('button')
    submitButton.id = props.creating ? 'add-button' : 'update-button'
    submitButton.classList.add('tool-button')
    submitButton.textContent = ''
    submitButton.disabled = !formValidate({ title: titleField.value })
    || (
        !hasChanged(
            {
                title: titleField.value,
                colorAccent: colorAccentField.value,
            },
            initialValues
        ) && !props.creating
    )

    for (const f of [titleField, colorAccentField]) {
        ['focusout', 'input'].forEach(eventName => {
            ![null, undefined].includes(f) && f.addEventListener(eventName, e => {
                submitButton.disabled = !formValidate({ title: titleField.value })
                || (
                    !hasChanged(
                        {
                            title: titleField.value,
                            colorAccent: colorAccentField.value,
                        },
                        initialValues
                    ) && !props.creating
                )
            })
        })
    }

    submitButton.addEventListener('click', e => {
        db.createTemporary(
            'sectionData',
            {
                id: props.sectionId,
                title: titleField.value,
                colorAccent: colorAccentField.value,
                extendedView: false,
            },
            temporaryData => {
                props.clickHandler(temporaryData)
            }
        )
        hide()
    })

    container.addEventListener('mousedown', e => {
        const rect = form.getBoundingClientRect()
        
        const left = rect.left
        const top = rect.top
        const right = rect.right
        const bottom = rect.bottom

        const x = e.pageX
        const y = e.pageY

        // CURSOR PLACEMENT CONDITION TO IGNORE EVENT ON CHILD ELEMENTS
        if (!(x > left && x < right) || !(y > top && y < bottom)) {
            hide()
        }
    })

    container.addEventListener('mouseenter', e => {
        titleField.focus()
    })

    /* modalTracker.formModalOpen && document.addEventListener('keyup', e => {
        e.key === 'Escape' && hide()
    }) */

    form.appendChild(titleField)
    form.appendChild(colorAccentField)
    form.appendChild(submitButton)
    container.appendChild(form)
    return container
}

const MainComponent = props => {
    let main = create('main')
    main.id = 'main'

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

                        document.body.appendChild(
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
                        document.body.style.overflow = 'hidden'
                    }
                },
            ],
        })
        const anchor = LinkAnchor({ href, src, active })
        const description = LinkDescription({ tip })
        let linkComponent = Link({ id, sectionId, href, src, tip, deleted, buttonGroup, description, anchor })
        linkWrappers.push({ sectionId, deleted, linkComponent })
    }

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
                        // RESET FORM CONTAINER TO AVOID LAGGING DUPLICATES
                        select('#form-container')?.remove()
                        document.body.appendChild(
                            SectionFormModalComponent({
                                creating: false,
                                sectionId: id,
                                title: title,
                                colorAccent: colorAccent,
                                extendedView: extendedView,
                                linkId: crypto.randomUUID(),
                                clickHandler: temporaryData => {
                                    sectionDB.updateSectionPropertyById(temporaryData)
                                    loadPage()
                                }
                            })
                        )
                        document.body.style.overflow = 'hidden'
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
                        
                        document.body.appendChild(
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
                        document.body.style.overflow = 'hidden'
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
    for (const sectionComponent of sectionComponents) {
        append(main, sectionComponent)
    }

    return main
}

const loadPage = () => {
    // RESET MAIN TO AVOID LAGGING DUPLICATES
    select('#main')?.remove()
    select('#add-data-panel')?.remove()

    const noData = !db.getFromDB(DB_NAME) || sectionDB.getSectionCount() === 0

    document.body.style.justifyContent = noData ? 'center' : 'flex-start'
    document.body.style.alignItems = noData ? 'center' : 'flex-start'
    
    const addDataPanel = AddDataPanel({
        initial: noData,
        callBack: () => {
            // RESET FORM CONTAINER TO AVOID LAGGING DUPLICATES
            select('#form-container')?.remove()
            document.body.appendChild(
                SectionFormModalComponent({
                    creating: true,
                    sectionId: crypto.randomUUID(),
                    clickHandler: temporaryData => {
                        sectionDB.createSection(temporaryData)
                        loadPage()
                    }
                })
            )
            document.body.style.overflow = 'hidden'
        }
    })

    
    if (!noData) {
        document.body.appendChild(
            MainComponent({ config: db.getFromDB(DB_NAME) })
        )
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