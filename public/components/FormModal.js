import { db } from '../controllers/database/db.js'
import { GlobalStyle } from '../globalStyle.js'
import { create, setElementStyle, append, animate, backgroundImage } from '../web_utils.js'

const FormModal = (tmpData={}, creating=false, inputFields=[], submitButtonIcons, submitHandler) => {

    // Flag to only allow closing event once
    let closing = false
    
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
        animate(form, 'pop-out', globalStyle.general.transitionNormal, 1)
        animate(element, 'blur-out', globalStyle.general.transitionNormal, 1)
        setTimeout(() => {
            inputFields.forEach(f => f.inputField.remove())
            element.remove()
        }, 300)
    }

    const element = create('div')
    setElementStyle(element, {
        backgroundColor: globalStyle.general.backgroundColorPrimaryWithTransparency,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        left: '0px',
        top: '0px',
        width: '100vw',
        height: '100vh',
        backdropFilter: globalStyle.general.backdropFilter,
    })
    animate(element, 'blur-in', globalStyle.general.transitionNormal, 1)

    const form = create('div')
    setElementStyle(form, {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: globalStyle.general.flexGapS,
        backgroundColor: globalStyle.general.backgroundColorSecondaryWithTransparency,
        minWidth: '300px',
        padding: globalStyle.general.paddingL,
        borderRadius: globalStyle.general.borderRadiusL,
        boxShadow: globalStyle.general.boxShadow,
    })
    animate(form, 'pop-in', globalStyle.general.transitionNormal, 1)
    
    const submitButton = create('button')
    setElementStyle(submitButton, {
        minWidth: globalStyle.general.buttonSizeM,
        height: globalStyle.general.buttonSizeM,
        backgroundPosition: globalStyle.general.backgroundPosition,
        backgroundSize: globalStyle.general.backgroundSize,
        backgroundRepeat: globalStyle.general.backgroundRepeat,
        border: globalStyle.general.noBorder,
        boxSizing: 'border-box',
        borderRadius: globalStyle.general.borderRadiusCircle,
        opacity: globalStyle.general.buttonOpacity,
        cursor: 'pointer',
        transition: `all ${globalStyle.general.transitionQuick}`,
    })
    submitButton.textContent = ''
    checkForm()

    submitButton.addEventListener('mouseenter', () => {
        setElementStyle(submitButton, {
            opacity: globalStyle.general.buttonHoverOpacity,
        })
    })

    submitButton.addEventListener('mouseleave', () => {
        setElementStyle(submitButton, {
            opacity: globalStyle.general.buttonOpacity,
        })
    })

    submitButton.addEventListener('click', () => {
        inputFields.forEach(f => { tmpData[f.propertyName] = f.inputField.getValue() })
        db.createTemporary('tmpData', tmpData, temporaryData => submitHandler(temporaryData))
        remove()
    })
    
    element.addEventListener('mouseenter', () => inputFields[0] && inputFields[0].inputField.focus())
    
    element.addEventListener('mousedown', e => {
        if (element === e.target && !closing) {
            remove()
            closing = true
        }
    })

    element.addEventListener('keyup', e => {
        if (e.key === 'Escape' && !closing) {
            remove()
            closing = true
        }
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
