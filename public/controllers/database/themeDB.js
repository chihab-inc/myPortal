import { db } from './db.js'

const themeDB = {}
const DB_NAME = 'THEME'

db.init(DB_NAME)

themeDB.createTheme = () => {// TOTO - this overwrites the database
    db.updateDB(DB_NAME, dataBase => {
        dataBase.name = 'macosLike'
        dataBase.dark = true
    })
}

themeDB.updateThemeProperty = data => {
    db.updateDB(DB_NAME, dataBase => {
        dataBase[data.property] = data.value
    })
}

themeDB.getTheme = () => {
    return db.getDatabase(DB_NAME)
}

export { themeDB }