import { sectionDB } from './controllers/database/sectionDB.js'
import { db } from './controllers/database/db.js'
import { create, select, setElementStyle, append, icon, backgroundImage } from './web_utils.js'
import { Section } from './components/Section.js'
import { AddDataPanel } from './components/AddDataPanel.js'
import { TextInput } from './components/TextInput.js'
import { ColorInput } from './components/ColorInput.js'
import { FormModal } from './components/FormModal.js'
import { GlobalStyle } from './globalStyle.js'

const DB_NAME = 'DATA-BASE'

const MainComponent = () => {

    const globalStyle = GlobalStyle()

    const sections = {}

    const remove = () => element.remove()
    
    const element = create('main')
    setElementStyle(element, {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: globalStyle.style.general.flexGapM,
        padding: globalStyle.style.general.paddingXXL,
        overflow: 'auto',
    })

    const otherSectionUpdate = sectionId => {
        sections[sectionId].updateUI()
    }

    sectionDB.getAllSections().map(section => section.id).forEach(id => {
        const section = Section(id, otherSectionUpdate)
        sections[id] = section
        append(element, section)
    })

    return { element, remove }
}

const loadPage = props => {
    const globalStyle = props.globalStyle

    select('#main')?.remove()
    select('#add-data-panel')?.remove()

    const noData = !db.getDatabase(DB_NAME) || sectionDB.getSectionCount() === 0

    document.body.style.justifyContent = noData ? 'center' : 'flex-start'
    document.body.style.alignItems = noData ? 'center' : 'flex-start'
    
    const addDataPanel = AddDataPanel({
        initial: noData,
        globalStyle,
        callBack: () => {
            const inputFields = []

            const titleField = TextInput({ type: 'text', globalStyle, placeholder: 'Title', required: true })
            inputFields.push({ inputField: titleField, propertyName: 'title' })

            const colorField = ColorInput({ globalStyle, required: true })
            inputFields.push({ inputField: colorField, propertyName: 'colorAccent' })
            
            append(document.body,
                FormModal({
                    creating: false,
                    tmpData: {
                        id: crypto.randomUUID(),
                        extendedView: false,
                    },
                    globalStyle,
                    style: {
                        submitButton: {
                            enabled: { backgroundImage: backgroundImage(icon('plus')) },
                            disabled: { backgroundImage: backgroundImage(icon('plus-disabled')) },
                        }
                    },
                    inputFields,
                    clickHandler: temporaryData => {
                        sectionDB.createSection(temporaryData)
                        loadPage({ globalStyle })
                    }
                })
            )
        }
    })

    
    if (!noData) {
        const main = MainComponent({ config: db.getDatabase(DB_NAME), globalStyle })
        document.body.appendChild(main)
    }

    append(document.body, addDataPanel)
}

const init = () => {
    window.addEventListener('load', () => {
        const main = MainComponent()
        append(document.body, main)
    })
}

init()