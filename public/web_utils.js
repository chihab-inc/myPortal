const setElementStyle = (element, style) => {
    Object.assign(element.style, style)
}

const append = (parent, child) => {
    parent.appendChild(child.element)
}

const icon = icon => `./icons/${icon}.png`

const backgroundImage = url => `url(${url})`

export {
    setElementStyle,
    append,
    icon,
    backgroundImage,
}