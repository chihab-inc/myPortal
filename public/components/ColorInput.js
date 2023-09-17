import { GlobalStyle } from '../globalStyle.js'
import { create, setElementStyle, append, icon, backgroundImage } from '../web_utils.js'

const ColorInput = (required=false, initialValue=null, style={}) => {
    
    const globalStyle = GlobalStyle()
    
    let callBack = () => {}

    const hasChanged = () => element.value !== initialValue

    const getValue = () => element.value

    const remove = () => element.remove()

    const focus = () => element.focus()

    const isValid = () => required ? !['', null, undefined].includes(element.value) : true

    const setCallBack = cb => callBack = cb

    const element = create('input')
    element.type = 'color'
    element.value = initialValue || '#bf616a'
    setElementStyle(element, {
        ...style,
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        appearance: 'none',
        width: globalStyle.general.inputWidth,
        height: globalStyle.general.inputHeight,
        backgroundColor: globalStyle.general.backgroundColorTransparent,
        border: globalStyle.general.noBorder,
    })

    element.addEventListener('change', () => { callBack() })

    return { element, remove, focus, isValid, hasChanged, getValue, setCallBack }
}

export { ColorInput }
