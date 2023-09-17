import { sectionDB } from "../controllers/database/sectionDB.js"
import { GlobalStyle } from "../globalStyle.js"
import { append, create, setElementStyle } from "../web_utils.js"
import { Section } from "./Section.js"

const Main = () => {

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
        gap: globalStyle.general.flexGapM,
        padding: globalStyle.general.paddingXXL,
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

export { Main }
