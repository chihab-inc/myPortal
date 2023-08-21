import { db } from './db.js'

const linkDB = {}
const DB_NAME = 'DATA-BASE'
const COLLECTION_NAME = 'links'

db.init(DB_NAME, COLLECTION_NAME)

// Insert new link instance into database
linkDB.createLink = data => {
    db.updateDB(DB_NAME, dataBase => {
        dataBase[COLLECTION_NAME].push(data)
    })
}

// Fetch link instance from database using link id
linkDB.getLinkById = id => {
    return db.getFromDB(DB_NAME)[COLLECTION_NAME].find(l => l.id === id)
}

// Fetch link instances from database using their section id
linkDB.getLinksBySectionId = sectionId => {
    return db.getFromDB(DB_NAME)[COLLECTION_NAME].filter(l => l.sectionId === sectionId)
}

// Update link instance property with new value using link id
linkDB.updateLinkPropertyById = (id, propertyName, newPropertyValue) => {
    db.updateDB(DB_NAME, dataBase => {
        dataBase[COLLECTION_NAME].find(l => l.id === id)[propertyName] = newPropertyValue
    })
}

// delete link instance from database using link id
linkDB.deleteLinkById = id => {
    linkDB.updateLinkPropertyById(id, 'deleted', true)
}

// delete link instances from database using section id
// TODO - Test this method before use
linkDB.deleteLinksBySectionId = sectionId => {
    linkDB.getLinksBySectionId(sectionId).forEach(l => {
        linkDB.deleteLinkById(l.id)
    })
}

// disable link instance using link id
linkDB.toggleLinkById = id => {
    db.updateDB(DB_NAME, dataBase => {
        dataBase[COLLECTION_NAME].find(l => l.id === id).active = !dataBase[COLLECTION_NAME].find(l => l.id === id).active
    })
}

// disable link instances using section id
linkDB.toggleLinksBySectionId = sectionId => {
    linkDB.getLinksBySectionId(sectionId).forEach(l => {
        linkDB.toggleLinkById(l.id)
    })
}

export { linkDB }