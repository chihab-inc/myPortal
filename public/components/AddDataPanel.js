import { sectionDB } from '../controllers/database/sectionDB.js'
import { GlobalStyle } from '../globalStyle.js'
import { create, setElementStyle, append, icon, backgroundImage, transition } from '../web_utils.js'
import { ColorInput } from './ColorInput.js'
import { FormModal } from './FormModal.js'
import { TextInput } from './TextInput.js'

const AddDataPanel = parentUpdateUI => {

    const globalStyle = GlobalStyle()

    let initial = sectionDB.getSectionCount() === 0

    const remove = () => element.remove()

    const createSection = data => {
        sectionDB.createSection(data)
        parentUpdateUI()
        updateUI()
    }

    const updateUI = () => {
        image.remove()
        text?.remove()

        updateElement()
        updateImage()

        element.appendChild(image)
        sectionDB.getSectionCount() === 0 && element.appendChild(text)
    }

    const updateElement = () => {
        initial = sectionDB.getSectionCount() === 0
        setElementStyle(element, {
            top: initial ? '0px' : 'auto',
            left: initial ? '0px' : 'auto',
            bottom: initial ? '0px' : '20px',
            right: initial ? '0px' : '20px',
            height: initial ? 'auto' : globalStyle.general.buttonSizeL,
            width: initial ? 'auto' : globalStyle.general.buttonSizeL,
        })
    }

    const updateImage = () => {
        initial = sectionDB.getSectionCount() === 0
        setElementStyle(image, {
            height: initial ? globalStyle.general.buttonSizeXL : '100%',
            width: initial ? globalStyle.general.buttonSizeXL : '100%',
        })
    }

    const element = create('div')
    element.id = 'add-data-panel'
    setElementStyle(element, {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: globalStyle.general.flexGapL,
        userSelect: 'none',
        position: 'fixed',
        background: 'none',
    })

    const image = create('img')
    image.src = icon('plus', 1)
    setElementStyle(image, {
        borderRadius: globalStyle.general.borderRadiusCircle,
        boxShadow: globalStyle.general.boxShadow,
        opacity: globalStyle.general.buttonOpacity,
    })
    transition(image, 'all', globalStyle.general.transitionQuick)
    
    image.addEventListener('mouseenter', () => {
        setElementStyle(image, {
            opacity: globalStyle.general.buttonHoverOpacity,
        })
    })

    image.addEventListener('mouseleave', () => {
        setElementStyle(image, {
            opacity: globalStyle.general.buttonOpacity,
        })
    })

    const text = create('span')
    text.textContent = 'Add New Section'
    setElementStyle(text, {
        textAlign: 'center',
        color: globalStyle.general.backgroundColorSecondary,
        fontSize: globalStyle.general.fontSizeL,
        fontWeight: 'bold',
        fontFamily: globalStyle.general.fontFamily,
    })

    element.addEventListener('click', () => {
        const inputFields = []

        const titleField = TextInput('Title', 'text',true, 32, null, {})
        inputFields.push({ inputField: titleField, propertyName: 'title' })

        const colorField = ColorInput(true, null, {})
        inputFields.push({ inputField: colorField, propertyName: 'colorAccent' })

        append(document.body,
            FormModal(
                {}, true, inputFields,
                { true: icon('plus', 1), false: icon('plus-disabled', 1) },
                temporaryData => createSection(temporaryData),
            )
        )
    })

    updateUI()

    return { element, updateUI, remove }
}

export { AddDataPanel }