const sectionDB = {}
const DB_NAME = 'sections'

const get = item => JSON.parse(localStorage.getItem(item))// TODO - MOVE TO WEB_UTILS
const set = (item, value) => localStorage.setItem(item, JSON.stringify(value))// TODO - MOVE TO WEB_UTILS

sectionDB.init = () => {
    if (!get(DB_NAME)) {
        set(DB_NAME, [])
    }
}

sectionDB.update = callBack => {
    let sections = get(DB_NAME)
    callBack(sections)
    set(DB_NAME, sections)
}

sectionDB.updateSectionPropertyById = (id, prop, value) => {
    sectionDB.update(sections => {
        sections.find(s => s.id === id)[prop] = value
    })
}

sectionDB.createSection = data => {
    sectionDB.update(sections => {
        sections.push(data)
    })
}

sectionDB.getSectionById = id => get(DB_NAME).find(s => s.id === id)
sectionDB.getAllSections = () => get(DB_NAME)
sectionDB.getSectionCount = () => sectionDB.getAllSections().length

sectionDB.getTitleById = id => sectionDB.getSectionById(id).title
sectionDB.updateTitledById = (id, title) => sectionDB.updateSectionPropertyById(id, 'title', title)

sectionDB.getColorAccentById = id => sectionDB.getSectionById(id).colorAccent
sectionDB.updateColorAccentdById = (id, colorAccent) => sectionDB.updateSectionPropertyById(id, 'colorAccent', colorAccent)

sectionDB.getExtendedViewById = id => sectionDB.getSectionById(id).extendedView

sectionDB.disableExtendedViewById = id => sectionDB.updateSectionPropertyById(id, 'extendedView', false)
sectionDB.toggleExtendedViewById = id => sectionDB.updateSectionPropertyById(id, 'extendedView', sectionDB.getExtendedViewById(id))

sectionDB.deleteSectionById = id => {
    db.update(sections => {
        sections = sections.filter(s => s.id !== id)
    })
}

export { sectionDB }