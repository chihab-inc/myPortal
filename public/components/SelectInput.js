import { create, setElementStyle } from '../web_utils.js'

const SelectInput = props => {
    const style = props.style || {}
    const items = props.items || []
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

    const element = create('select')
    setElementStyle(element, {
        ...style,
        height: '40px',
        minWidth: '40px',
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

    element.addEventListener('change', () => {
        callBack()
    })

    return { element, remove, focus, isValid, hasChanged, getValue, setCallBack }
}

export { SelectInput }
