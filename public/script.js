import { Main } from './components/Main.js'
import { linkDB } from './controllers/database/linkDB.js'
import { sectionDB } from './controllers/database/sectionDB.js'
import { themeDB } from './controllers/database/themeDB.js'
import { GlobalStyle } from './globalStyle.js'
import { append, setElementStyle } from './web_utils.js'

const init = () => {

    sectionDB.init()
    linkDB.init()
    themeDB.init()

    const globalStyle = GlobalStyle()

    window.addEventListener('load', () => {
        const body = document.body
        setElementStyle(body, {
            height: '100vh',
            width: '100vw',
            background: globalStyle.general.mainBackground,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            fontFamily: 'Verdana, sans-serif',
        })

        const main = Main()
        append(body, main)
    })
}

init()