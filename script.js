'use strict'

const LinkComponent = props => {
    let li = document.createElement('li')
    if (!props.active) {
        li.classList.add('disabled-link')
    }

    const hide = () => {
        document.getElementById('close-button')?.remove()
        document.getElementById('disable-button')?.remove()
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
            closeButtonComponent({
                x: rect.left + 5,
                y: rect.top + 5 - scrollTop,
                clickHandler: () => {
                    let config = JSON.parse(localStorage.getItem('config'))
                    config[props.sectionIndex][props.subSectionIndex].links.find(link => link.id === props.linkId).deleted = true
                    localStorage.setItem('config', JSON.stringify(config))
                    loadPage()
                }
            })
        )
        
        // APPEND DISABLE BUTTON
        li.appendChild(
            disableButtonComponent({
                x: rect.left + 5,
                y: rect.top + 25 - scrollTop,
                clickHandler: () => {
                    let config = JSON.parse(localStorage.getItem('config'))
                    config[props.sectionIndex][props.subSectionIndex].links.find(link => link.id === props.linkId).active = !config[props.sectionIndex][props.subSectionIndex].links.find(link => link.id === props.linkId).active
                    localStorage.setItem('config', JSON.stringify(config))
                    loadPage()
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

const closeButtonComponent = props => {
    let close_button = document.createElement('img')
    close_button.id = 'close-button'
    close_button.src = './icons/cross.png'
    close_button.style.left = `${props.x}px`
    close_button.style.top = `${props.y}px`

    close_button.addEventListener('click', e => {
        props.clickHandler()
    })
    
    return close_button
}

const disableButtonComponent = props => {
    let disable_button = document.createElement('img')
    disable_button.id = 'disable-button'
    disable_button.src = './icons/bar.png'
    disable_button.style.left = `${props.x}px`
    disable_button.style.top = `${props.y}px`

    disable_button.addEventListener('click', e => {
        props.clickHandler()
    })
    
    return disable_button
}

const addButtonComponent = props => {
    let add_button = document.createElement('img')
    add_button.id = 'add-button'
    add_button.src = './icons/add.png'
    add_button.style.left = `${props.x}px`
    add_button.style.top = `${props.y}px`

    add_button.addEventListener('click', e => {
        props.clickHandler()
    })
    
    return add_button
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
    const formValidate = fields => /(https?:\/\/)?([\da-z\.-]+)\.([a-z]{2,6})([\/\w\.-]*)*\/?/.test(fields.link)

    const hide = () => {
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
    container.style.height = props.height

    let form = document.createElement('div')
    form.id = 'form'

    let linkField = document.createElement('input')
    linkField.type = 'url'
    linkField.placeholder = 'Link'

    let descriptionField = document.createElement('input')
    descriptionField.type = 'text'
    descriptionField.placeholder = 'Description'

    let buttonInput = document.createElement('button')
    buttonInput.innerText = 'Add'
    buttonInput.disabled = !formValidate({ link: linkField.value })

    for (const f of [linkField]) {
        ['focusout', 'input'].forEach(eventName => {
            f.addEventListener(eventName, e => {
                buttonInput.disabled = !formValidate({ link: linkField.value })
            })
        })
    }

    buttonInput.addEventListener('click', e => {
        localStorage.setItem('newLinkData', JSON.stringify({
            id: crypto.randomUUID(),
            href: linkField.value,
            src: `https://logo.clearbit.com/${new URL(linkField.value).hostname.replace('www.', '')}`,
            tip: descriptionField.value,
            active: true,
            deleted: false,
        }))
        props.clickHandler()
        localStorage.removeItem('newLinkData')
    })

    
    container.addEventListener('click', e => {
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

    form.appendChild(linkField)
    form.appendChild(descriptionField)
    form.appendChild(buttonInput)

    container.appendChild(form)

    return container
}

const SubSectionComponent = props => {
    const hide = () => {
        document.getElementById('add-button')?.remove()
    }

    let article = document.createElement('article')
    article.classList.add(props.componentClassName)
    
    let ul = document.createElement('ul')
    ul.classList.add(props.setElementClassName)
    
    let h2Container = document.createElement('div')
    h2Container.classList.add('sub-section-title-container')

    let h2 = document.createElement('h2')
    h2.innerText = props.title

    h2Container.addEventListener('mouseenter', e => {
        hide()

        const rect = h2Container.getBoundingClientRect()
        const scrollTop = document.body.getBoundingClientRect().top

        h2Container.appendChild(
            addButtonComponent({
                x: rect.right - 20,
                y: rect.top + 10 - scrollTop,
                clickHandler: () => {
                    // RESET FORM CONTAINER TO AVOID LAGGING DUPLICATES
                    document.getElementById('form-container')?.remove()
                    const bodyHeight = document.body.getBoundingClientRect().height
                    document.body.appendChild(
                        formModalComponent({
                            height: `${bodyHeight}px`,
                            clickHandler: () => {
                                let config = JSON.parse(localStorage.getItem('config'))
                                config[props.sectionIndex][props.subSectionIndex].links.push(
                                    JSON.parse(localStorage.getItem('newLinkData'))
                                )
                                localStorage.setItem('config', JSON.stringify(config))
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
    
    return article
}

const SectionComponent = props => {
    let section = document.createElement('section')

    props.subSections.forEach(linkSet => {
        section.appendChild(linkSet)
    })

    return section
}

const MainComponent = props => {
    let main = document.createElement('main')
    main.id = 'main'

    for (const [sectionIndex, section] of props.config.entries()) {
        main.appendChild(
            SectionComponent({
                sectionIndex,
                subSections: section.map((subSection, subSectionIndex) => SubSectionComponent({
                    sectionIndex,
                    subSectionIndex,
                    componentClassName: subSection.componentClassName,
                    title: subSection.title,
                    setElementClassName: subSection.setElementClassName,
                    links: subSection.links
                        .filter(link => !link.deleted)
                        .map(link => LinkComponent({ sectionIndex, subSectionIndex, linkId: link.id, href: link.href, src: link.src, tip: link.tip, active: link.active }))
                }))
            })
        )
    }
    
    return main
}

const loadPage = () => {
    // RESET MAIN TO AVOID LAGGIND DUPLICATES
    document.getElementById('main')?.remove()
    document.getElementById('form-container')?.remove()

    document.body.appendChild(
        MainComponent({ config: JSON.parse(localStorage.getItem('config') || '[]') })
    )
}

const init = () => {
    window.addEventListener('load', e => {
        loadPage()
    })
}

init()