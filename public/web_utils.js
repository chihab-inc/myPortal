
const create = type => document.createElement(type)

const select = (selector, from=document) => from.querySelector(selector)

const setElementStyle = (element, style) => {
    Object.assign(element.style, style)
}

const append = (parent, child) => {
    parent.appendChild(child.element)
}

const animate = (element, animationName, animationTime, repetitions) => {
    setElementStyle(element, {
        animation: `${animationName} ${animationTime} ${repetitions}`
    })
}

const transition = (element, propertyName, transitionTime) => {
    setElementStyle(element, {
        transition: `${propertyName} ${transitionTime}`
    })
}

const icon = (icon, level=0) => {
    let prefix = ''
    for (let i = 0; i < level; i++) {
        prefix += '../'
    }
    return `./${prefix}icons/${icon}.png`
}

const backgroundImage = url => `url(${url})`

export {
    create,
    select,
    setElementStyle,
    append,
    icon,
    backgroundImage,
    animate,
    transition,
}