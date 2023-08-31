import { linkDB } from './linkDB.js'
import { sectionDB } from './sectionDB.js'
import { db } from './db.js'
import { create, select, setElementStyle, append, icon, backgroundImage } from './web_utils.js'
import { ButtonGroup } from './components/ButtonGroup.js'
import { LinkDescription } from './components/LinkDescription.js'
import { LinkAnchor } from './components/LinkAnchor.js'

const DB_NAME = 'DATA-BASE'

// GLOBALS
const modalTracker = { formModalOpen: false }

const LinkComponent = props => {
    const anchor = props.anchor
    const description = props.description
    const buttonGroup = props.buttonGroup
    let li = create('li')
    li.classList.add('link-item')
    if (!props.active) {
        li.classList.add('disabled-link')
    }

    const hide = elements => {
        elements.forEach(e => e.remove())
    }
    
    append(li, anchor)

    li.addEventListener('mouseenter', e => {
        // RESET TO AVOID LAGGING DUPLICATES
        hide([])

        const rect = li.getBoundingClientRect()
        const scrollTop = document.body.getBoundingClientRect().top
        
        // APPEND DESCRIPTION ONLY IF THERE IS A TIP/DESCRIPTION
        props.tip && append(li, description)

        append(li, props.buttonGroup)

    })
    li.addEventListener('mouseleave', e => {
        const rect = li.getBoundingClientRect()
        const scrollTop = document.body.getBoundingClientRect().top
        
        const left = rect.left
        const top = rect.top - scrollTop
        const right = rect.right
        const bottom = rect.bottom - scrollTop

        const x = e.pageX
        const y = e.pageY

        // CURSOR PLACEMENT CONDITION TO IGNORE EVENT ON CHILD ELEMENTS
        if (!(x > left && x < right) || !(y > top && y < bottom)) {
            hide([ buttonGroup, description ])
        }
    })
    
    return li
}

const ToolButtonComponent = props => {
    let button = create('img')
    button.id = props.id
    button.classList.add('tool-button')
    button.src = props.src

    button.addEventListener('click', e => {
        props.clickHandler()
    })
    
    return button
}

const LinkFormModalComponent = props => {
    modalTracker.formModalOpen = true
    
    const initialValues = {
        link: props.href,
        logo: props.src,
        description: props.tip,
        section: props.sectionId,
    }

    const hasChanged = (fields, initialValues) => {
        return fields.link !== initialValues.link
        || fields.logo !== initialValues.logo
        || fields.description !== initialValues.description
        || (!props.creating && ![null, undefined].includes(initialValues.section) && fields.section.toString() !== initialValues.section.toString())
    }

    const formValidate = fields => {
        const rgx = /^(http(s)?:\/\/)([\da-z\.-]+)\.([a-z]{2,6})([\/\w\.-]*)*\/?/
        return (rgx.test(fields.link) && rgx.test(fields.logo) && props.creating)
        || (
            (
                rgx.test(fields.link)
                && rgx.test(fields.logo)
            )
            && !props.creating
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

    let linkField = create('input')
    linkField.type = 'url'
    linkField.placeholder = 'Link'
    linkField.value = props.creating ? null : props.href

    let logoField = create('input')
    logoField.type = 'url'
    logoField.placeholder = 'Logo'
    logoField.value = props.creating ? null : props.src

    let descriptionField = create('input')
    descriptionField.type = 'text'
    descriptionField.placeholder = 'Description'
    descriptionField.value = (props.creating || ['', null, undefined].includes(props.tip)) ? null : props.tip

    let sectionSelector
    if (!props.creating) {
        sectionSelector = create('select')
        sectionDB.getAllSections().forEach(s => {
            let option = create('option')
            option.value = s.id
            option.textContent = s.title
            if (s.id === props.sectionId) {
                option.selected = true
            }
            sectionSelector.appendChild(option)
        })
    }

    let submitButton = create('button')
    submitButton.id = props.creating ? 'add-button' : 'update-button'
    submitButton.classList.add('tool-button')
    submitButton.textContent = ''
    submitButton.disabled = !formValidate({
        link: linkField.value,
        logo: logoField.value,
    }) || (
        !hasChanged(
            {
                link: linkField.value,
                logo: logoField.value,
                description: descriptionField.value,
                section: !props.creating && sectionSelector.value,
            },
            initialValues
        ) && !props.creating
    )

    for (const f of [linkField, logoField, descriptionField, sectionSelector]) {
        ['focusout', 'input'].forEach(eventName => {
            ![null, undefined].includes(f) && f.addEventListener(eventName, e => {
                submitButton.disabled = !formValidate({
                    link: linkField.value,
                    logo: logoField.value,
                }) || (!hasChanged({
                    link: linkField.value,
                    logo: logoField.value,
                    description: descriptionField.value,
                    section: !props.creating && sectionSelector.value,
                }, initialValues) && !props.creating)
            })
        })
    }

    submitButton.addEventListener('click', e => {
        db.createTemporary(
            'linkData',
            {
                id: props.linkId,
                sectionId: !props.creating ? sectionSelector.value : props.sectionId,
                href: linkField.value,
                src: logoField.value,
                tip: descriptionField.value,
                active: true,
                deleted: false,
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
        linkField.focus()
    })

    modalTracker.formModalOpen && document.addEventListener('keyup', e => {
        e.key === 'Escape' && hide()
    })

    form.appendChild(linkField)
    form.appendChild(logoField)
    form.appendChild(descriptionField)
    if (!props.creating) {
        form.appendChild(sectionSelector)
    }
    form.appendChild(submitButton)

    container.appendChild(form)

    return container
}

const SectionFormModalComponent = props => {
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

    modalTracker.formModalOpen && document.addEventListener('keyup', e => {
        e.key === 'Escape' && hide()
    })

    form.appendChild(titleField)
    form.appendChild(colorAccentField)
    form.appendChild(submitButton)
    container.appendChild(form)
    return container
}

const AddDataPanel = props => {
    const container = create('div')
    container.id = 'add-data-panel'
    !props.initial && container.classList.add('non-initial')

    const icon = create('img')
    icon.src = './icons/plus-large.png'

    const span = create('span')
    span.textContent = 'Add New Section'

    container.addEventListener('click', e => {
        props.callBack()
    })

    container.appendChild(icon)
    props.initial && container.appendChild(span)
    return container
}

const SectionComponent = props => {
    const id = props.id
    const title = props.title
    const colorAccent = props.colorAccent
    const extendedView = props.extendedView
    const links = props.links
    const buttonGroup = ButtonGroup({
        options: { type: 'rounded' },
        buttons:[
            {
                style: {
                    backgroundImage: backgroundImage(icon('pen')),
                },
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
                style: {
                    backgroundImage: backgroundImage(icon('cross')),
                },
                hover: { opacity: '1' },
                clickHandler: () => {
                    sectionDB.deleteSectionById(id)
                    linkDB.permanentlyDeleteLinksBySectionId(id)
                    loadPage()
                },
            },
            {
                style: {
                    backgroundImage: backgroundImage(icon('plus')),
                },
                hover: { opacity: '1' },
                clickHandler: () => {
                    // RESET FORM CONTAINER TO AVOID LAGGING DUPLICATES
                    select('#form-container')?.remove()
                    document.body.appendChild(
                        LinkFormModalComponent({
                            creating: true,
                            sectionId: id,
                            linkId: crypto.randomUUID(),
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
                style: {
                    backgroundImage: backgroundImage(icon(extendedView ? 'hide' : 'view')),
                },
                hover: { opacity: '1' },
                clickHandler: () => {
                    sectionDB.toggleExtendedViewById(id)
                    loadPage()
                },
            },
            {
                style: {
                    backgroundImage: backgroundImage(icon('minus')),
                },
                hover: { opacity: '1' },
                clickHandler: () => {
                    linkDB.toggleLinksBySectionId(id)
                    loadPage()
                },
            },
        ]
    })
    
    const hide = elements => {
        elements.forEach(e => e.remove())
    }

    const section = create('section')
    setElementStyle(section, {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '5px',
        width: '425px',
        minHeight: '20px',
    })

    const header = create('header')
    setElementStyle(header, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '20px',
        paddingRight: '5px',
    })
    
    const h2 = create('h2')
    h2.innerText = title
    setElementStyle(h2, {
        background: '#2a2c2c',
        minWidth: '50%',
        maxWidth: '60%',
        height: '100%',
        textAlign: 'center',
        fontSize: '1em',
        color: colorAccent,
        borderRadius: '5px',
    })
    header.appendChild(h2)
    section.appendChild(header)
    
    
    const ul = create('ul')
    setElementStyle(ul, {
        background: '#2a2c2c',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '5px',
        padding: '5px',
        listStyleType: 'none',
        borderRadius: '5px',
    })
    section.appendChild(ul)

    section.addEventListener('mouseenter', e => {
        hide([])
        append(header, buttonGroup)
    })

    section.addEventListener('mouseleave', e => {
        const rect = h2.getBoundingClientRect()
        const scrollTop = document.body.getBoundingClientRect().top
        
        const left = rect.left
        const top = rect.top - scrollTop
        const right = rect.right
        const bottom = rect.bottom - scrollTop

        const x = e.pageX
        const y = e.pageY

        // CURSOR PLACEMENT CONDITION TO IGNORE EVENT ON CHILD ELEMENTS
        if (!(x > left && x < right) || !(y > top && y < bottom)) {
            hide([ buttonGroup ])
        }
    })
    
    links.forEach(link => {
        ul.appendChild(link)
    })
    
    return section
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
            options: { orientation: 'v', type: 'rounded', absolute: true },
            buttons: deleted
            ? [
                {
                    style: {
                        backgroundImage: backgroundImage(icon('cross')),
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
                    },
                    hover: { opacity: '1' },
                    clickHandler: () => {
                        // RESET FORM CONTAINER TO AVOID LAGGING DUPLICATES
                        select('#form-container')?.remove()
                        document.body.appendChild(
                            LinkFormModalComponent({
                                creating: false,
                                sectionId: sectionId,
                                linkId: id,
                                href: href,
                                src: src,
                                tip: tip,
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
        let linkComponent = LinkComponent({ id, sectionId, href, src, tip, active, deleted, buttonGroup, description, anchor })
        linkWrappers.push({ sectionId, deleted, linkComponent })
    }

    let sectionComponents = []
    for (const section of props.config.sections) {
        const id = section.id
        const title = section.title
        const colorAccent = section.colorAccent
        const extendedView = section.extendedView
        sectionComponents.push(
            SectionComponent({
                id,
                colorAccent,
                title,
                extendedView,
                links: linkWrappers
                    .filter(linkWrapper => linkWrapper.sectionId === id)
                    .filter(linkWrapper => !linkWrapper.deleted || (linkWrapper.deleted && extendedView))
                    .map(linkWrapper => linkWrapper.linkComponent)
            })
        )
    }
    for (const sectionComponent of sectionComponents) {
        main.appendChild(sectionComponent)
    }

    return main
}

const loadPage = () => {
    // RESET MAIN TO AVOID LAGGING DUPLICATES
    select('#main')?.remove()
    select('#add-data-panel')?.remove()

    const noData = !db.getFromDB(DB_NAME) || sectionDB.getSectionCount() === 0
    
    document.body.appendChild(
        AddDataPanel({
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
    )

    if (!noData) {
        document.body.appendChild(
            MainComponent({ config: db.getFromDB(DB_NAME) })
        )
    }
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