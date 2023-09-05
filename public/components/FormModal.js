import { db } from '../db.js'
import { create, setElementStyle, append } from '../web_utils.js'

const FormModal = props => {
    const tmpData = props.tmpData || {}
    const clickHandler = props.clickHandler

    const style = props.style || {}
    const creating = props.creating
    const inputFields = props.inputFields || []


    const checkForm = () => {
        let allValid = true
        let someChanged = false
        inputFields.map(f => f.inputField).forEach(f => {
            allValid = allValid && f.isValid()
            someChanged = someChanged || f.hasChanged()
        })
        submitButton.disabled = !((!creating && allValid && someChanged) || (creating && allValid))
        setElementStyle(submitButton, submitButton.disabled ? style.submitButton.disabled : style.submitButton.enabled)
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
        background: '#0009',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        left: '0px',
        top: '0px',
        width: '100vw',
        height: '100vh',
        backdropFilter: 'blur(15px)',
        animation: 'blur-form-in 0.3s ease-in-out 1',
    })

    let form = create('div')
    form.id = 'form'
    setElementStyle(form, {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '5px',
        background: '#3338',
        minWidth: '300px',
        padding: '10px',
        borderRadius: '10px',
        boxShadow: '0 0 30px rgba(0, 0, 0, 0.6)',
        animation: 'pop-form-in 0.3s ease-in-out 1',
    })
    
    let submitButton = create('button')
    setElementStyle(submitButton, {
        ...style.submitButton || {},
        minWidth: '40px',
        height: '40px',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        border: 'none',
        boxSizing: 'border-box',
        borderRadius: '50%',
        opacity: '.6',
        cursor: 'pointer',
        transition: 'all .1s ease-in-out',
    })
    submitButton.textContent = ''
    checkForm()

    submitButton.addEventListener('mouseenter', () => {
        setElementStyle(submitButton, {
            opacity: '1',
        })
    })

    submitButton.addEventListener('mouseleave', () => {
        setElementStyle(submitButton, {
            opacity: '.6',
        })
    })

    submitButton.addEventListener('click', () => {
        inputFields.forEach(f => {
            f.promise
            ? f.inputField.getValue().then(r => {
                tmpData[f.propertyName] = r
            }).catch(e => {
                tmpData[f.propertyName] = e
            })
            : tmpData[f.propertyName] = f.inputField.getValue()
        })
        db.createTemporary(
            'tmpData',
            tmpData,
            temporaryData => {
                clickHandler(temporaryData)
            }
        )
        remove()
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
