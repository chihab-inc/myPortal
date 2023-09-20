const db = {}
const SECTION_DB = 'sections'
const LINK_DB = 'links'
const THEME_DB = 'theme'

// Create and delete ephemeral data
db.createTemporary = (temporaryDataName, data, callBack) => {
    localStorage.setItem(temporaryDataName, JSON.stringify(data))
    const temporaryData = JSON.parse(localStorage.getItem(temporaryDataName))
    callBack(temporaryData)
    localStorage.removeItem(temporaryDataName)
}

db.exportDB = () => {
    const dbString = JSON.stringify({
        sections: JSON.parse(localStorage.getItem(SECTION_DB)),
        links: JSON.parse(localStorage.getItem(LINK_DB)),
        theme: JSON.parse(localStorage.getItem(THEME_DB))
    }, null, 2)
    const blob = new Blob([dbString], ['text/javascript'])
    const url = URL.createObjectURL(blob)
    const fileName = `myPortal-export-${Math.floor(Date.now() / 100)}.json`
    const a = document.createElement('a')
    a.download = fileName
    a.href = url
    a.click()
}

db.importDB = dbString => {
    const dbObject = JSON.parse(dbString)
    const dbs = {}
    dbs[SECTION_DB] = dbObject.sections
    dbs[LINK_DB] = dbObject.links
    dbs[THEME_DB] = dbObject.theme
    Object.keys(dbs).forEach(d => localStorage.setItem(d, JSON.stringify(dbs[d])))
}



export { db }