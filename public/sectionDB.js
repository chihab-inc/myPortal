import { db } from './db.js'

const sectionDB = {}
const DB_NAME = 'DATA-BASE'
const COLLECTION_NAME = 'sections'

db.init(DB_NAME, COLLECTION_NAME)

// Insert new section instance into database
sectionDB.createSection = data => {
    db.updateDB(DB_NAME, db => {
        db[COLLECTION_NAME].push(data)
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
    db.updateDB(DB_NAME, db => {
        db[COLLECTION_NAME] = db[COLLECTION_NAME].filter(s => s.id !== id)
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