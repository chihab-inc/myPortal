import { create, select, setElementStyle } from '../web_utils.js'

const TextInput = props => {
    const style = props.style || {}
    const type = props.type || 'text'
    const placeholder = props.placeholder
    const required = props.required || false
    const maxLength = props.maxLength || 524288
    const initialValue = props.initialValue
    let callBack = props.callBack || (() => {})
    
    const remove = () => {
        element.remove()
    }

    const focus = () => {
        element.focus()
    }

    const isValid = () => {
        const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/
        const urlRegex = /^(http(s)?:\/\/)([\da-z\.-]+)\.([a-z]{2,6})([\/\w\.-]*)*\/?/
        return element.value.length < maxLength
        ? type === 'email'
            ? required
                ? !['', null, undefined].includes(element.value)
                    ? emailRegex.test(element.value)
                    : false
                : emailRegex.test(element.value) || ['', null, undefined].includes(element.value)
            : type === 'url'
                ? required
                    ? !['', null, undefined].includes(element.value)
                        ? urlRegex.test(element.value)
                        : false
                    : urlRegex.test(element.value) || ['', null, undefined].includes(element.value)
                : ['password', 'search', 'tel', 'text'].includes(type)
                    ? required
                        ? !['', null, undefined].includes(element.value)
                        : true
                    : false
        : false
    }

    const hasChanged = () => element.value !== initialValue

    const getValue = () => element.value

    const setCallBack = cb => {
        callBack = cb
    }

    const element = create('input')
    element.type = ['email', 'password', 'search', 'tel', 'text', 'url'].includes(type) ? type : 'text'
    element.placeholder = placeholder
    initialValue && (element.value = initialValue)
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

    const eventNames = ['focusout', 'input']
    eventNames.forEach(eventName => {
        element.addEventListener(eventName, () => {
            setElementStyle(element, {
                background: !isValid() ? '#f99' : '#fff',
            })
            callBack()
        })
    })

    return { element, remove, focus, isValid, hasChanged, getValue, setCallBack }
}

export { TextInput }
