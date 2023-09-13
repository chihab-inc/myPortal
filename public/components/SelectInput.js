import { GlobalStyle } from '../globalStyle.js'
import { create, setElementStyle } from '../web_utils.js'

const SelectInput = (items=[], required=false, initialValue=null, style={}) => {

    const globalStyle = GlobalStyle()

    let callBack = () => {}
    
    const remove = () => element.remove()

    const focus = () => element.focus()
    
    const isValid = () => required ? !['', null, undefined].includes(element.value) : true

    const hasChanged = () => element.value !== initialValue

    const getValue = () => element.value

    const setCallBack = cb => callBack = cb

    const element = create('select')
    setElementStyle(element, {
        ...style,
        height: globalStyle.style.general.inputHeight,
        minWidth: globalStyle.style.general.inputWidth,
        borderRadius: globalStyle.style.general.borderRadiusS,
        border: globalStyle.style.general.noBorder,
        fontSize: globalStyle.style.general.fontSizeM,
        padding: globalStyle.style.general.paddingM,
        paddingLeft: globalStyle.style.general.paddingL,
        outline: 'none',
        backgroundColor: globalStyle.style.general.backgroundColorInput,
    })

    items.forEach(item => {
        const option = create('option')
        option.value = item.value
        option.innerText = item.text
        option.selected = !['', null, undefined].includes(item.selected) ? item.selected : item.value === initialValue
        setElementStyle(option, item.style || {})
        element.appendChild(option)
    })

    element.addEventListener('change', () => { callBack() })

    return { element, remove, focus, isValid, hasChanged, getValue, setCallBack }
}

export { SelectInput }
