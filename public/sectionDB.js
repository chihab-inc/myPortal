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

// Remove section instance from database using section id
sectionDB.deleteSectionById = id => {
    db.updateDB(DB_NAME, db => {
        db[COLLECTION_NAME] = db[COLLECTION_NAME].filter(s => s.id !== id)
    })
}

export { sectionDB }