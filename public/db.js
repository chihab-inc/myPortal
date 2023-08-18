const db = {}

db.createDB = dbName => {
    localStorage.setItem(dbName, JSON.stringify({}))
}

// Generic function to allow inserting a database into localStorage
db.createCollection = (dbName, collectionName) => {
    db.updateDB(dbName, dataBase => {
        dataBase[collectionName] = []
    })
}

// Generic method to allow updating a dabatase in localStorage
db.updateDB = (dbName, callBack) => {
    const dataBase = db.getFromDB(dbName)
    callBack(dataBase)
    localStorage.setItem(dbName, JSON.stringify(dataBase))
}

// Generic method to allow fetching a dabatase from localStorage
db.getFromDB = dbName => {
    return JSON.parse(localStorage.getItem(dbName))
}

// Create databases and collections if not existing
db.init = (dbName, collectionName) => {
    /*
     * If database doesn't exist then create
     * the database then create the collection
     * otherwise, just create the collection
    */
    if (!db.getFromDB(dbName)) {
        db.createDB(dbName)
        db.createCollection(dbName, collectionName)
    } else if (!db.getFromDB(dbName)[collectionName]) {
        db.createCollection(dbName, collectionName)
    }
}

export { db }