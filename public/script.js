import { linkDB } from './linkDB.js'
import { sectionDB } from './sectionDB.js'
import { db } from './db.js'

// GLOBALS
const modalTracker = { formModalOpen: false }

const LinkComponent = props => {
    let li = document.createElement('li')
    if (!props.active) {
        li.classList.add('disabled-link')
    }

    const hide = () => {
        document.getElementById('close-button')?.remove()
        document.getElementById('disable-button')?.remove()
        document.getElementById('edit-button')?.remove()
        document.getElementById('tooltip')?.remove()
    }
    
    li.appendChild(anchorComponent({ href: props.href, src: props.src }))
    
    li.addEventListener('mouseenter', e => {
        // RESET TO AVOID LAGGING DUPLICATES
        hide()

        const rect = li.getBoundingClientRect()
        const scrollTop = document.body.getBoundingClientRect().top
        
        // APPEND CLOSE BUTTON
        li.appendChild(
            toolButtonComponent({
                id: 'close-button',
                src: './icons/cross.png',
                x: rect.left + 5,
                y: rect.top + 5 - scrollTop,
                clickHandler: () => {
                    linkDB.deleteLinkById(props.id)
                    loadPage()
                }
            })
        )
        
        // APPEND DISABLE BUTTON
        li.appendChild(
            toolButtonComponent({
                id: 'disable-button',
                src: './icons/minus.png',
                x: rect.left + 5,
                y: rect.top + 25 - scrollTop,
                clickHandler: () => {
                    linkDB.toggleLinkById(props.id)
                    loadPage()
                }
            })
        )
        
        // APPEND EDIT BUTTON
        props.active
            && li.appendChild(
                toolButtonComponent({
                    id: 'edit-button',
                    src: './icons/pen.png',
                    x: rect.left + 5,
                    y: rect.top + 45 - scrollTop,
                    clickHandler: () => {
                        // RESET FORM CONTAINER TO AVOID LAGGING DUPLICATES
                        document.getElementById('form-container')?.remove()
                        document.body.appendChild(
                            formModalComponent({
                                creating: false,
                                sectionId: props.sectionId,
                                linkId: props.id,
                                href: props.href,
                                src: props.src,
                                tip: props.tip,
                                clickHandler: temporaryData => {
                                    linkDB.updateLinkPropertyById(temporaryData)
                                    loadPage()
                                }
                            })
                        )
                        document.body.style.overflow = 'hidden'
                    }
                })
            )
        
        // APPEND TOOLTIP ONLY IF THERE IS A TIP/DESCRIPTION
        props.tip && li.appendChild(
            tooltipComponent({
                tip: props.tip,
                x: rect.left + 5,
                y: rect.bottom - 27 - scrollTop,
            })
        )

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
            hide()
        }
    })
    
    return li
}

let anchorComponent = props => {
    let a = document.createElement('a')
    a.target = '_blank'
    a.href = props.href
    a.style.backgroundImage = `url(${props.src})`

    return a
}

const toolButtonComponent = props => {
    let button = document.createElement('img')
    button.id = props.id
    button.src = props.src
    button.style.left = `${props.x}px`
    button.style.top = `${props.y}px`

    button.addEventListener('click', e => {
        props.clickHandler()
    })
    
    return button
}

const tooltipComponent = props => {
    let tooltip = document.createElement('p')
    tooltip.id = 'tooltip'
    tooltip.textContent = props.tip
    tooltip.style.left = `${props.x}px`
    tooltip.style.top = `${props.y}px`

    return tooltip
}

const formModalComponent = props => {
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
        modalTracker.formModalOpen = false
        let form = document.getElementById('form')
        form.style.animation = 'push-form-out 0.3s ease-in-out 1'
        let formContainer = document.getElementById('form-container')
        formContainer.style.animation = 'blur-form-out 0.3s ease-in-out 1'
        setTimeout(() => {
            document.getElementById('form-container')?.remove()
            document.body.style.overflow = 'auto'
        }, 300)
    }

    let container = document.createElement('div')
    container.id = 'form-container'

    let form = document.createElement('div')
    form.id = 'form'

    let linkField = document.createElement('input')
    linkField.type = 'url'
    linkField.placeholder = 'Link'
    linkField.value = props.creating ? null : props.href
    linkField.autofocus = true

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
                sectionId: !props.creating ? parseInt(sectionSelector.value) : props.sectionId,
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

const SectionComponent = props => {
    const hide = () => {
        document.getElementById('add-button')?.remove()
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

    h2Container.addEventListener('mouseenter', e => {
        hide()

        const rect = h2Container.getBoundingClientRect()
        const scrollTop = document.body.getBoundingClientRect().top

        h2Container.appendChild(
            toolButtonComponent({
                id: 'add-button',
                src: './icons/plus.png',
                x: rect.right - 20,
                y: rect.top + 10 - scrollTop,
                clickHandler: () => {
                    // RESET FORM CONTAINER TO AVOID LAGGING DUPLICATES
                    document.getElementById('form-container')?.remove()
                    document.body.appendChild(
                        formModalComponent({
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
    })

    h2Container.addEventListener('mouseleave', e => {
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
        let linkComponent = LinkComponent({ id, sectionId, href, src, tip, active, deleted })
        linkWrappers.push({ sectionId, deleted, linkComponent })
    }

    let sectionComponents = []
    for (const section of props.config.sections) {
        const id = section.id
        const colorAccent = section.colorAccent
        const title = section.title
        sectionComponents.push(
            SectionComponent({
                id,
                colorAccent,
                title,
                links: linkWrappers
                    .filter(linkWrapper => linkWrapper.sectionId === id)
                    .filter(linkWrapper => !linkWrapper.deleted)
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
    document.getElementById('main')?.remove()

    document.body.appendChild(
        MainComponent({ config: db.getFromDB('DATA-BASE') })
    )
}

const init = () => {
    window.addEventListener('load', e => {
        loadPage()
    })
}

init()