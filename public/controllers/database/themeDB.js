const themeDB = {}
const DB_NAME = 'theme'

const get = item => JSON.parse(localStorage.getItem(item))// TODO - MOVE TO WEB_UTILS
const set = (item, value) => localStorage.setItem(item, JSON.stringify(value))// TODO - MOVE TO WEB_UTILS

themeDB.init = () => {
    if (!get(DB_NAME)) {
        set(DB_NAME, {
            name: 'flat',
            dark: true,
            colors: { primaryColor: '#1C1E1E', secondaryColor: '#2A2C2C', accentColor:'#497f99' },
            background: { type: 'color', value: '#1C1E1E' }
        })
    }
}

themeDB.update = callBack => {
    let theme = get(DB_NAME)
    callBack(theme)
    set(DB_NAME, theme)
}

themeDB.getTheme = () => get(DB_NAME)

themeDB.updateThemeProperty = (prop, value) => {
    themeDB.update(theme => {
        theme[prop] = value
    })
}

themeDB.init()

export { themeDB }