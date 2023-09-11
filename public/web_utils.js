
const create = type => document.createElement(type)

const select = (selector, from=document) => from.querySelector(selector)

const setElementStyle = (element, style) => {
    Object.assign(element.style, style)
}

const append = (parent, ...children) => {
    children.forEach(child => {
        parent.appendChild(child.element)
    })
}

const pushElement = (array, element) => {
    array.push(element)
    return element
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
    pushElement,
    icon,
    backgroundImage,
}