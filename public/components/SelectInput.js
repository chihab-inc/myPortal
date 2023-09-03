import { create, setElementStyle } from '../web_utils.js'

const SelectInput = props => {
    const style = props.style || {}
    const items = props.items || []
    const required = props.required || false
    const initialValue = props.initialValue
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
        borderRadius: '4px',
        border: 'none',
        fontSize: '1em',
        padding: '5px',
        paddingLeft: '10px',
        outline: 'none',
        background: '#fff',
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
