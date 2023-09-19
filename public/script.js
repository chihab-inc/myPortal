import { Main } from './components/Main.js'
import { GlobalStyle } from './globalStyle.js'
import { append, setElementStyle } from './web_utils.js'

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

        append(body, Main())
    })
}

init()