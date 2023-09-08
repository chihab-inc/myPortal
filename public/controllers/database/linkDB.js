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

// Permanently delete link from database using its id
linkDB.permanentlyDeleteLinkById = id => {
    db.updateDB(DB_NAME, dataBase => {
        dataBase[COLLECTION_NAME] = dataBase[COLLECTION_NAME].filter(l => l.id !== id)
    })
}

// Permanently delete link instances from database using their sectionId
linkDB.permanentlyDeleteLinksBySectionId = sectionId => {
    linkDB.getLinksBySectionId(sectionId).forEach(l => {
        linkDB.permanentlyDeleteLinkById(l.id)
    })
}

// Fetch link instance from database using link id
linkDB.getLinkById = id => {
    return db.getDatabase(DB_NAME)[COLLECTION_NAME].find(l => l.id === id)
}

// Fetch link instances from database using their section id
linkDB.getLinksBySectionId = sectionId => {
    return db.getDatabase(DB_NAME)[COLLECTION_NAME].filter(l => l.sectionId === sectionId)
}

// Update link instance property with new value using link id
linkDB.updateLinkPropertyById = data => {
    db.updateDB(DB_NAME, dataBase => {
        Object.keys(data).filter(k => ![null, undefined].includes(data[k])).forEach(d => {
            dataBase[COLLECTION_NAME].find(l => l.id === data.id)[d] = data[d]
        })
    })
}

// delete link instance from database using link id
linkDB.deleteLinkById = id => {
    linkDB.updateLinkPropertyById({ id, deleted: true })
}

// delete link instance from database using link id
linkDB.recoverDeletedLinkById = id => {
    linkDB.updateLinkPropertyById({ id, deleted: false })
}

// delete link instances from database using section id
linkDB.deleteLinksBySectionId = sectionId => {
    linkDB.getLinksBySectionId(sectionId).forEach(l => {
        linkDB.deleteLinkById(l.id)
    })
}

// disable link instance using link id
linkDB.disableLinkById = id => {
    db.updateDB(DB_NAME, dataBase => {
        dataBase[COLLECTION_NAME].find(l => l.id === id).active = false
    })
}

// enable link instance using link id
linkDB.enableLinkById = id => {
    db.updateDB(DB_NAME, dataBase => {
        dataBase[COLLECTION_NAME].find(l => l.id === id).active = true
    })
}

// toggle link instance using link id
linkDB.toggleLinkById = id => {
    db.updateDB(DB_NAME, dataBase => {
        dataBase[COLLECTION_NAME].find(l => l.id === id).active = !dataBase[COLLECTION_NAME].find(l => l.id === id).active
    })
}

// disable link instances using section id
linkDB.toggleLinksBySectionId = sectionId => {
    linkDB.getLinksBySectionId(sectionId)
    .filter(l => !l.deleted)
    .some(l => l.active)
        ? linkDB.getLinksBySectionId(sectionId)
        .filter(l => !l.deleted)
        .forEach(l => {
            linkDB.disableLinkById(l.id)
        })
        : linkDB.getLinksBySectionId(sectionId)
        .filter(l => !l.deleted)
        .forEach(l => {
            linkDB.enableLinkById(l.id)
        })
}

export { linkDB }