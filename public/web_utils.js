
const create = type => document.createElement(type)

const select = (selector, from=document) => from.querySelector(selector)

const setElementStyle = (element, style) => {
    Object.assign(element.style, style)
}

const append = (parent, child) => {
    parent.appendChild(child.element)
}

const icon = icon => `./icons/${icon}.png`

const backgroundImage = url => `url(${url})`

export {
    create,
    select,
    setElementStyle,
    append,
    icon,
    backgroundImage,
}