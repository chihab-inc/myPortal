import { GlobalStyle } from '../globalStyle.js'
import { create, select, setElementStyle } from '../web_utils.js'

const TextInput = (placeholder, type='text', required=false, maxLength=524288, initialValue=null, style={}) => {
    
    const globalStyle = GlobalStyle()

    let callBack = () => {}
    
    const remove = () => element.remove()

    const focus = () => element.focus()

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

    const setCallBack = cb => callBack = cb

    const element = create('input')
    element.type = ['email', 'password', 'search', 'tel', 'text', 'url'].includes(type) ? type : 'text'
    element.placeholder = placeholder
    initialValue && (element.value = initialValue)
    setElementStyle(element, {
        ...style,
        height: globalStyle.general.inputHeight,
        minWidth: globalStyle.general.inputWidth,
        borderRadius: globalStyle.general.borderRadiusS,
        border: globalStyle.general.noBorder,
        fontSize: globalStyle.general.fontSizeM,
        padding: globalStyle.general.fontSizeM,
        paddingLeft: globalStyle.general.paddingL,
        outline: 'none',
        backgroundColor: globalStyle.general.backgroundColorInput,
    })

    const eventNames = ['focusout', 'input']
    eventNames.forEach(eventName => {
        element.addEventListener(eventName, () => {
            setElementStyle(element, {
                backgroundColor: !isValid() ? globalStyle.general.backgroundColorInputInvalid : globalStyle.general.backgroundColorInput,
            })
            callBack()
        })
    })

    return { element, remove, focus, isValid, hasChanged, getValue, setCallBack }
}

export { TextInput }
