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
        height: globalStyle.general.inputHeight,
        minWidth: globalStyle.general.inputWidth,
        borderRadius: globalStyle.general.borderRadiusS,
        border: globalStyle.general.noBorder,
        fontSize: globalStyle.general.fontSizeM,
        padding: globalStyle.general.paddingM,
        paddingLeft: globalStyle.general.paddingL,
        outline: 'none',
        backgroundColor: globalStyle.general.backgroundColorInput,
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
