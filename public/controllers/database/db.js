const db = {}

// Create and delete ephemeral data
db.createTemporary = (temporaryDataName, data, callBack) => {
    localStorage.setItem(temporaryDataName, JSON.stringify(data))
    const temporaryData = JSON.parse(localStorage.getItem(temporaryDataName))
    callBack(temporaryData)
    localStorage.removeItem(temporaryDataName)
}

export { db }