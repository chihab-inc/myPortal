import { db } from '../controllers/database/db.js'
import { create, setElementStyle, append, backgroundImage } from '../web_utils.js'

const FormModal = props => {
    const tmpData = props.tmpData || {}
    const submitHandler = props.submitHandler
    const submitButtonIcon = props.submitButtonIcon || {}
    const creating = props.creating || false
    const globalStyle = props.globalStyle
    const theme = globalStyle.style.theme || {}
    
    const inputFields = props.inputFields || []

    const checkForm = () => {
        let allValid = true
        let someChanged = false
        inputFields.map(f => f.inputField).forEach(f => {
            allValid = allValid && f.isValid()
            someChanged = someChanged || f.hasChanged()
        })
        submitButton.disabled = !((!creating && allValid && someChanged) || (creating && allValid))
        setElementStyle(submitButton, submitButton.disabled
            ? { backgroundImage: backgroundImage(submitButtonIcon.disabled) }
            : { backgroundImage: backgroundImage(submitButtonIcon.enabled) }
        )
        return ((!creating && allValid && someChanged) || (creating && allValid))
    }

    const remove = () => {
        setElementStyle(form, { animation: 'push-form-out 0.3s ease-in-out 1' })
        setElementStyle(element, { animation: 'blur-form-out 0.3s ease-in-out 1' })
        setTimeout(() => {
            inputFields.forEach(f => f.inputField.remove())
            element.remove()
        }, 300)
    }

    let element = create('div')
    setElementStyle(element, {
        backgroundColor: globalStyle.style.general.backgroundColorPrimaryWithTransparency,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        left: '0px',
        top: '0px',
        width: '100vw',
        height: '100vh',
        backdropFilter: globalStyle.style.general.backdropFilter,
        animation: 'blur-form-in 0.3s ease-in-out 1',
    })

    let form = create('div')
    form.id = 'form'
    setElementStyle(form, {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: globalStyle.style.general.flexGapS,
        backgroundColor: globalStyle.style.general.backgroundColorSecondaryWithTransparency,
        minWidth: '300px',
        padding: globalStyle.style.general.paddingL,
        borderRadius: globalStyle.style.general.borderRadiusL,
        boxShadow: globalStyle.style.general.boxShadow,
        animation: 'pop-form-in 0.3s ease-in-out 1',
    })
    
    let submitButton = create('button')
    setElementStyle(submitButton, {
        minWidth: '40px',
        height: '40px',
        backgroundPosition: globalStyle.style.general.backgroundPosition,
        backgroundSize: globalStyle.style.general.backgroundSize,
        backgroundRepeat: globalStyle.style.general.backgroundRepeat,
        border: globalStyle.style.general.noBorder,
        boxSizing: 'border-box',
        borderRadius: globalStyle.style.general.borderRadiusCircle,
        opacity: globalStyle.style.general.buttonOpacity,
        cursor: 'pointer',
        transition: `all ${globalStyle.style.general.transitionQuick}`,
    })
    submitButton.textContent = ''
    checkForm()

    submitButton.addEventListener('mouseenter', () => {
        setElementStyle(submitButton, {
            opacity: globalStyle.style.general.buttonHoverOpacity,
        })
    })

    submitButton.addEventListener('mouseleave', () => {
        setElementStyle(submitButton, {
            opacity: globalStyle.style.general.buttonOpacity,
        })
    })

    const targets = [{target: submitButton, ev: 'click', condition: e => true}, {target: element, ev: 'keyup', condition: e => e.key === 'Enter'}]
    targets.forEach(i => {
        i.target.addEventListener(i.ev, e => {
            if (i.condition(e) && checkForm()) {
                inputFields.forEach(f => { tmpData[f.propertyName] = f.inputField.getValue() })
                db.createTemporary(
                    'tmpData',
                    tmpData,
                    temporaryData => {
                        submitHandler(temporaryData)
                    }
                )
                remove()
            }
        })
    })

    element.addEventListener('mousedown', e => {
        return element !== e.target ? null : remove()
    })

    element.addEventListener('mouseenter', () => {// TODO - NEEDS TO BE ON LOAD, FIGURE OUT HOW
        inputFields[0].inputField.focus()
    })

    element.addEventListener('keyup', e => {
        e.key === 'Escape' && remove()
    })
    
    inputFields.forEach(f => {
        f.inputField.setCallBack(checkForm)
        append(form, f.inputField)
    })
    form.appendChild(submitButton)
    element.appendChild(form)

    return { element, remove }
}

export { FormModal }
