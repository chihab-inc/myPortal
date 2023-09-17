import { sectionDB } from './controllers/database/sectionDB.js'
import { db } from './controllers/database/db.js'
import { create, select, setElementStyle, append, icon, backgroundImage } from './web_utils.js'
import { Section } from './components/Section.js'
import { AddDataPanel } from './components/AddDataPanel.js'
import { TextInput } from './components/TextInput.js'
import { ColorInput } from './components/ColorInput.js'
import { FormModal } from './components/FormModal.js'
import { GlobalStyle } from './globalStyle.js'
import { themeDB } from './controllers/database/themeDB.js'
import { Main } from './components/Main.js'

const DB_NAME = 'DATA-BASE'

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

    const globalStyle = GlobalStyle()

    window.addEventListener('load', () => {
        const body = document.body
        setElementStyle(body, {
            height: '100vh',
            width: '100vw',
            background: globalStyle.general.mainBackground,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            fontFamily: 'Verdana, sans-serif',
        })

        const main = Main()
        append(body, main)
    })
}

init()