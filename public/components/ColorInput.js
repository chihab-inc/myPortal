import { create, setElementStyle, append, icon, backgroundImage } from '../web_utils.js'

const ColorInput = props => {
    const style = props.style || {}
    const required = props.required || false
    const initialValue = props.initialValue
    const globalStyle = props.globalStyle
    const theme = globalStyle.style.theme || {}
    
    let callBack = props.callBack || (() => {})

    const hasChanged = () => element.value !== initialValue

    const getValue = () => element.value

    const remove = () => {
        element.remove()
    }

    const focus = () => {
        element.focus()
    }

    const isValid = () => required ? !['', null, undefined].includes(element.value) : true

    const setCallBack = cb => {
        callBack = cb
    }

    const element = create('input')
    element.type = 'color'
    element.value = initialValue || '#bf616a'
    setElementStyle(element, {
        ...style,
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        appearance: 'none',
        width: '48px',
        height: '48px',
        backgroundColor: globalStyle.style.general.backgroundColorTransparent,
        border: globalStyle.style.general.noBorder,
    })

    element.addEventListener('change', () => {
        callBack()
    })

    return { element, remove, focus, isValid, hasChanged, getValue, setCallBack }
}

export { ColorInput }
