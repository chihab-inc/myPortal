'use strict'

const LinkComponent = props => {
    let li = document.createElement('li')
    if (!props.active) {
        li.classList.add('disabled-link')
    }
    let a = document.createElement('a')
    a.classList.add('tooltipped')
    let img = document.createElement('img')
    
    a.setAttribute('target', '_blank')
    a.setAttribute('href', props.href)
    a.setAttribute('tip', props.tip)
    img.setAttribute('src', props.src)

    a.addEventListener('mouseenter', e => {
        const boundingRect = a.getBoundingClientRect()

        const posX = boundingRect.right - 20
        const posY = boundingRect.top + 5

        let tooltip = document.getElementById('tooltip')
        tooltip.style.display = 'flex'
        tooltip.style.top = `${posY}px`
        tooltip.style.left = `${posX}px`
        tooltip.textContent = a.getAttribute('tip')
    })

    a.addEventListener('mouseleave', e => {
        let tooltip = document.getElementById('tooltip')
        tooltip.style.display = 'none'
        tooltip.textContent = ''
    })

    a.appendChild(img)
    li.appendChild(a)
    
    return li
}

const SubSectionComponent = props => {
    let article = document.createElement('article')
    let ul = document.createElement('ul')
    let h2 = document.createElement('h2')

    article.classList.add(props.componentClassName)
    h2.innerHTML = props.title
    ul.classList.add(props.setElementClassName)

    
    article.appendChild(h2)
    props.links.forEach(link => {
        ul.appendChild(link)
    })
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
    
    let body = document.body
    let main = document.createElement('main')
    
    let tooltip = document.createElement('p')
    tooltip.setAttribute('id', 'tooltip')


    for (const section of props.config) {
        main.appendChild(
            SectionComponent({
                subSections: section.map(subSection => SubSectionComponent({
                    componentClassName: subSection.componentClassName,
                    title: subSection.title,
                    setElementClassName: subSection.setElementClassName,
                    links: subSection.links.map(link => LinkComponent({ href: link.href, src: link.src, tip: link.tip, active: link.active }))
                }))
            })
        )
    }

    main.appendChild(tooltip)
    
    body.appendChild(main)
}

window.addEventListener('load', e => {
    MainComponent({ config: config })
})