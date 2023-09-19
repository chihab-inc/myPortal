import { Main } from './components/Main.js'
import { GlobalStyle } from './globalStyle.js'
import { append, setElementStyle } from './web_utils.js'
import { ScrollOverlay } from './components/ScrollOverlay.js'

const init = () => {

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
        const scrollOverlay = ScrollOverlay(main)
        
        append(body, main)
        append(body, scrollOverlay)
    })
}

init()