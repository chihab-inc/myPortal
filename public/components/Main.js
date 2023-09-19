import { sectionDB } from "../controllers/database/sectionDB.js"
import { GlobalStyle } from "../globalStyle.js"
import { append, create, setElementStyle } from "../web_utils.js"
import { AddDataPanel } from "./AddDataPanel.js"
import { Section } from "./Section.js"

const Main = () => {

    const globalStyle = GlobalStyle()

    const sections = {}

    const remove = () => element.remove()
    
    const scrollLeft = speed => element.scrollLeft -= speed
    const scrollRight = speed => element.scrollLeft += speed
    
    const element = create('main')
    setElementStyle(element, {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: globalStyle.general.flexGapM,
        padding: globalStyle.general.paddingXXL,
        overflowY: 'auto',
        overflowX: 'hidden',
    })

    const otherSectionUpdate = sectionId => {
        sections[sectionId].updateUI()
    }

    const updateSections = () => {
        Object.values(sections).forEach(section => section.remove())
        sectionDB.getAllSections().map(section => section.id).forEach(id => {
            const section = Section(id, updateUI, otherSectionUpdate)
            sections[id] = section
            append(element, section)
        })
    }

    const updateAddDataPanel = () => {
        addDataPanel.remove()
        addDataPanel = AddDataPanel(updateUI)
        append(element, addDataPanel)
    }

    const updateUI = () => {
        updateSections()
        updateAddDataPanel()
    }

    let addDataPanel = AddDataPanel(updateUI)

    updateUI()

    return { element, scrollLeft, scrollRight, remove }
}

export { Main }
