import { linkDB } from './linkDB.js'
import { sectionDB } from './sectionDB.js'
import { db } from './db.js'
import { setElementStyle, append, icon, backgroundImage } from './web_utils.js'
import { ButtonGroup } from './components/ButtonGroup.js'

const DB_NAME = 'DATA-BASE'

// GLOBALS
const modalTracker = { formModalOpen: false }

const LinkComponent = props => {
    let li = document.createElement('li')
    li.classList.add('link-item')
    if (!props.active) {
        li.classList.add('disabled-link')
    }

    const hide = removers => {
        document.querySelector('.services li #description')?.remove()
        removers.forEach(r => { r() })
    }
    
    li.appendChild(AnchorComponent({ href: props.href, src: props.src }))

    li.addEventListener('mouseenter', e => {
        // RESET TO AVOID LAGGING DUPLICATES
        hide([])

        const rect = li.getBoundingClientRect()
        const scrollTop = document.body.getBoundingClientRect().top
        
        // APPEND DESCRIPTION ONLY IF THERE IS A TIP/DESCRIPTION
        props.tip && li.appendChild(
            DescriptionComponent({
                tip: props.tip,
                x: rect.left + 5,
                y: rect.bottom - 27 - scrollTop,
            })
        )

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
            hide([ props.buttonGroup.remove ])
        }
    })
    
    return li
}

let AnchorComponent = props => {
    let a = document.createElement('a')
    a.classList.add('link-anchor')
    a.target = '_blank'
    a.href = props.href
    a.style.backgroundImage = `url(${props.src})`

    return a
}

const ToolButtonComponent = props => {
    let button = document.createElement('img')
    button.id = props.id
    button.classList.add('tool-button')
    button.src = props.src

    button.addEventListener('click', e => {
        props.clickHandler()
    })
    
    return button
}

const DescriptionComponent = props => {
    let description = document.createElement('p')
    description.id = 'description'
    description.textContent = props.tip
    // description.style.left = `${props.x}px`
    // description.style.top = `${props.y}px`

    return description
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
            let form = document.querySelector('#form')
            form.style.animation = 'push-form-out 0.3s ease-in-out 1'
            let formContainer = document.querySelector('#form-container')
            formContainer.style.animation = 'blur-form-out 0.3s ease-in-out 1'
            setTimeout(() => {
                document.querySelector('#form-container')?.remove()
                document.body.style.overflow = 'auto'
            }, 300)
        }
    }

    let container = document.createElement('div')
    container.id = 'form-container'

    let form = document.createElement('div')
    form.id = 'form'

    let linkField = document.createElement('input')
    linkField.type = 'url'
    linkField.placeholder = 'Link'
    linkField.value = props.creating ? null : props.href

    let logoField = document.createElement('input')
    logoField.type = 'url'
    logoField.placeholder = 'Logo'
    logoField.value = props.creating ? null : props.src

    let descriptionField = document.createElement('input')
    descriptionField.type = 'text'
    descriptionField.placeholder = 'Description'
    descriptionField.value = (props.creating || ['', null, undefined].includes(props.tip)) ? null : props.tip

    let sectionSelector
    if (!props.creating) {
        sectionSelector = document.createElement('select')
        sectionDB.getAllSections().forEach(s => {
            let option = document.createElement('option')
            option.value = s.id
            option.textContent = s.title
            if (s.id === props.sectionId) {
                option.selected = true
            }
            sectionSelector.appendChild(option)
        })
    }

    let submitButton = document.createElement('button')
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
            let form = document.querySelector('#form')
            form.style.animation = 'push-form-out 0.3s ease-in-out 1'
            let formContainer = document.querySelector('#form-container')
            formContainer.style.animation = 'blur-form-out 0.3s ease-in-out 1'
            setTimeout(() => {
                document.querySelector('#form-container')?.remove()
                document.body.style.overflow = 'auto'
            }, 300)
        }
    }

    let container = document.createElement('div')
    container.id = 'form-container'

    let form = document.createElement('div')
    form.id = 'form'

    let titleField = document.createElement('input')
    titleField.type = 'text'
    titleField.placeholder = 'Title'
    titleField.value = props.creating ? null : props.title

    let colorAccentField = document.createElement('input')
    colorAccentField.type = 'color'
    colorAccentField.value = props.creating ? '#bf616a' : props.colorAccent

    let submitButton = document.createElement('button')
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
    const container = document.createElement('div')
    container.id = 'add-data-panel'
    !props.initial && container.classList.add('non-initial')

    const icon = document.createElement('img')
    icon.src = './icons/plus-large.png'

    const span = document.createElement('span')
    span.textContent = 'Add New Section'

    container.addEventListener('click', e => {
        props.callBack()
    })

    container.appendChild(icon)
    props.initial && container.appendChild(span)
    return container
}

const SectionComponent = props => {
    const hide = () => {
        document.querySelector('.sub-section-title-container span #edit-button')?.remove()
        document.querySelector('.sub-section-title-container span #delete-button')?.remove()
        document.querySelector('.sub-section-title-container span #add-button')?.remove()
        document.querySelector('.sub-section-title-container span #view-button')?.remove()
        document.querySelector('.sub-section-title-container span #section-disable-button')?.remove()
    }

    let section = document.createElement('section')

    let article = document.createElement('article')
    article.style.color = props.colorAccent
    
    let ul = document.createElement('ul')
    ul.classList.add('services')
    
    let h2Container = document.createElement('div')
    h2Container.classList.add('sub-section-title-container')

    let h2 = document.createElement('h2')
    h2.innerText = props.title

    let buttonContainer = document.createElement('span')

    article.addEventListener('mouseenter', e => {
        hide()

        const rect = h2Container.getBoundingClientRect()
        const scrollTop = document.body.getBoundingClientRect().top

        // APPEND EDIT BUTTON
        buttonContainer.appendChild(
            ToolButtonComponent({
                id: 'edit-button',
                src: './icons/pen.png',
                clickHandler: () => {
                    // RESET FORM CONTAINER TO AVOID LAGGING DUPLICATES
                    document.querySelector('#form-container')?.remove()
                    document.body.appendChild(
                        SectionFormModalComponent({
                            creating: false,
                            sectionId: props.id,
                            title: props.title,
                            colorAccent: props.colorAccent,
                            extendedView: props.extendedView,
                            linkId: crypto.randomUUID(),
                            clickHandler: temporaryData => {
                                sectionDB.updateSectionPropertyById(temporaryData)
                                loadPage()
                            }
                        })
                    )
                    document.body.style.overflow = 'hidden'
                }
            })
        )

        // APPEND DELETE BUTTON
        buttonContainer.appendChild(
            ToolButtonComponent({
                id: 'delete-button',
                src: './icons/cross.png',
                clickHandler: () => {
                    sectionDB.deleteSectionById(props.id)
                    linkDB.permanentlyDeleteLinksBySectionId(props.id)
                    loadPage()
                }
            })
        )

        // APPEND ADD BUTTON
        buttonContainer.appendChild(
            ToolButtonComponent({
                id: 'add-button',
                src: './icons/plus.png',
                clickHandler: () => {
                    // RESET FORM CONTAINER TO AVOID LAGGING DUPLICATES
                    document.querySelector('#form-container')?.remove()
                    document.body.appendChild(
                        LinkFormModalComponent({
                            creating: true,
                            sectionId: props.id,
                            linkId: crypto.randomUUID(),
                            clickHandler: temporaryData => {
                                linkDB.createLink(temporaryData)
                                loadPage()
                            }
                        })
                    )
                    document.body.style.overflow = 'hidden'
                }
            })
        )

        // APPEND VIEW BUTTON
        buttonContainer.appendChild(
            ToolButtonComponent({
                id: 'view-button',
                src: props.extendedView ? './icons/hide.png' : './icons/view.png',
                clickHandler: () => {
                    sectionDB.toggleExtendedViewById(props.id)
                    loadPage()
                }
            })
        )

        // APPEND DISABLE BUTTON
        buttonContainer.appendChild(
            ToolButtonComponent({
                id: 'section-disable-button',
                src: './icons/minus.png',
                clickHandler: () => {
                    linkDB.toggleLinksBySectionId(props.id)
                    loadPage()
                }
            })
        )
    })

    article.addEventListener('mouseleave', e => {
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
            hide()
        }
    })
    
    props.links.forEach(link => {
        ul.appendChild(link)
    })
    
    h2Container.appendChild(h2)
    h2Container.appendChild(buttonContainer)
    article.appendChild(h2Container)
    article.appendChild(ul)
    section.appendChild(article)
    
    return section
}

const MainComponent = props => {
    let main = document.createElement('main')
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
            id: 'link-button-group',
            options: { orientation: 'v', type: 'rounded' },
            buttons: [
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
                        document.querySelector('#form-container')?.remove()
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
        const buttonGroupDeleted = ButtonGroup({
            id: 'link-button-group',
            options: { orientation: 'v', type: 'rounded' },
            buttons: [
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
            ],
        })
        let linkComponent = LinkComponent({ id, sectionId, href, src, tip, active, deleted, buttonGroup: deleted ? buttonGroupDeleted : buttonGroup })
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
    document.querySelector('#main')?.remove()
    document.querySelector('#add-data-panel')?.remove()

    const noData = !db.getFromDB(DB_NAME) || sectionDB.getSectionCount() === 0
    
    document.body.appendChild(
        AddDataPanel({
            initial: noData,
            callBack: () => {
                // RESET FORM CONTAINER TO AVOID LAGGING DUPLICATES
                document.querySelector('#form-container')?.remove()
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