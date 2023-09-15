import { db } from '../controllers/database/db.js'
import { GlobalStyle } from '../globalStyle.js'
import { create, setElementStyle, append, animate, backgroundImage } from '../web_utils.js'

const FormModal = (tmpData={}, creating=false, inputFields=[], submitButtonIcons, submitHandler) => {
    
    const globalStyle = GlobalStyle()

    const checkForm = () => {
        let allValid = true
        let someChanged = false
        inputFields.map(f => f.inputField).forEach(f => {
            allValid = allValid && f.isValid()
            someChanged = someChanged || f.hasChanged()
        })
        submitButton.disabled = !((!creating && allValid && someChanged) || (creating && allValid))
        setElementStyle(submitButton, { backgroundImage: backgroundImage(submitButtonIcons[!submitButton.disabled]) })
        return (!creating && allValid && someChanged) || (creating && allValid)
    }

    const remove = () => {
        animate(form, 'push-form-out', globalStyle.style.general.transitionNormal, 1)
        animate(element, 'blur-form-out', globalStyle.style.general.transitionNormal, 1)
        setTimeout(() => {
            inputFields.forEach(f => f.inputField.remove())
            element.remove()
        }, 300)
    }

    const element = create('div')
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
    })
    animate(element, 'blur-form-in', globalStyle.style.general.transitionNormal, 1)

    const form = create('div')
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
    })
    animate(form, 'pop-form-in', globalStyle.style.general.transitionNormal, 1)
    
    const submitButton = create('button')
    setElementStyle(submitButton, {
        minWidth: globalStyle.style.general.buttonSizeM,
        height: globalStyle.style.general.buttonSizeM,
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

    submitButton.addEventListener('click', () => {
        inputFields.forEach(f => { tmpData[f.propertyName] = f.inputField.getValue() })
        db.createTemporary('tmpData', tmpData, temporaryData => submitHandler(temporaryData))
        remove()
    })

    element.addEventListener('mousedown', e => element !== e.target ? null : remove())

    element.addEventListener('animationend', () => inputFields[0] && inputFields[0].inputField.focus())

    element.addEventListener('keyup', e => e.key === 'Escape' && remove())
    
    inputFields.forEach(f => {
        f.inputField.setCallBack(checkForm)
        append(form, f.inputField)
    })
    form.appendChild(submitButton)
    element.appendChild(form)

    return { element, remove }
}

export { FormModal }
