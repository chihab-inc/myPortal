import { db } from './db.js'

const sectionDB = {}
const DB_NAME = 'DATA-BASE'
const COLLECTION_NAME = 'sections'

db.init(DB_NAME, COLLECTION_NAME)

// Insert new section instance into database
sectionDB.createSection = data => {
    db.updateDB(DB_NAME, dataBase => {
        dataBase[COLLECTION_NAME].push(data)
    })
}

// Update section instance property with new value using section id
sectionDB.updateSectionPropertyById = data => {
    db.updateDB(DB_NAME, dataBase => {
        //dataBase[COLLECTION_NAME].push(data)
        Object.keys(data).filter(k => ![null, undefined].includes(data[k])).forEach(d => {
            dataBase[COLLECTION_NAME].find(s => s.id === data.id)[d] = data[d]
        })
    })
}

// Fetch section instance from database using section id
sectionDB.getSectionById = id => {
    return db.getFromDB(DB_NAME)[COLLECTION_NAME].find(s => s.id === id)
}

// Fetch all section instances from database
sectionDB.getAllSections = () => {
    return db.getFromDB(DB_NAME)[COLLECTION_NAME]
}

// Coount all section instances in database
sectionDB.getSectionCount = () => {
    return sectionDB.getAllSections().length
}

// Remove section instance from database using section id
sectionDB.deleteSectionById = id => {
    db.updateDB(DB_NAME, dataBase => {
        dataBase[COLLECTION_NAME] = dataBase[COLLECTION_NAME].filter(s => s.id !== id)
    })
}

// Toggle extended view of content
sectionDB.toggleExtendedViewById = id => {
    db.updateDB(DB_NAME, dataBase => {
        dataBase[COLLECTION_NAME].find(s => s.id === id).extendedView = !dataBase[COLLECTION_NAME].find(s => s.id === id).extendedView
    })
}

// Toggle extended view of content
sectionDB.disableExtendedViewById = id => {
    db.updateDB(DB_NAME, dataBase => {
        dataBase[COLLECTION_NAME].find(s => s.id === id).extendedView = false
    })
}

export { sectionDB }