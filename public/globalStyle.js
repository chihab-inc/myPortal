import { themeDB } from './controllers/database/themeDB.js'

const primaryColor = '#1C1E1E'
const secondaryColor = '#2A2C2C'

let GlobalStyle = () => {
    let theme = themeDB.getTheme()
    
    let style = {
        general: {
            borderRadiusS: '3px',
            borderRadiusM: '5px',
            borderRadiusL: '10px',
            borderRadiusCircle: '50%',
            buttonOpacity: '.6',
            buttonHoverOpacity: '1',
            buttonSizeS: '20px',
            buttonSizeM: '40px',
            buttonSizeL: '60px',
            inputHeight: '40px',
            inputWidth: '40px',
            flexGapS: '5px',
            flexGapM: '10px',
            flexGapL: '20px',
            transitionQuick: '.1s ease-in-out',
            transitionNormal: '.3s ease-in-out',
            transitionSlow: '.5s ease-in-out',
            fontSizeS: '.6em',
            fontSizeM: '1em',
            fontSizeL: '1.8em',
            fontFamily: '“Helvetica Neue”, Helvetica, Arial, sans-serif',
            fontColor: '#ffffff',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundColorTransparent: 'transparent',
            backgroundColorPrimary: primaryColor,
            backgroundColorSecondary: secondaryColor,
            backgroundColorPrimaryWithTransparency: `${primaryColor}99`,
            backgroundColorSecondaryWithTransparency: `${secondaryColor}99`,
            backgroundColorInput: '#ffffff',
            backgroundColorInputInvalid: '#ff9999',
            paddingNone: '0px',
            paddingXS: '2px',
            paddingS: '3px',
            paddingM: '5px',
            paddingL: '10px',
            paddingXL: '20px',
            paddingXXL: '100px',
            noBorder: 'none',
            backdropFilter: 'blur(15px)',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
            zIndexBottom: '0',
            zIndexMiddle: '1',
            zIndexTop: '1',
            animationBlurIn: [
                {
                    background: '#0000',
                    backdropFilter: 'blur(0px)',
                },
                {
                    background: '#0009',
                    backdropFilter: 'blur(15px)',
                },
            ],
            animationBlurOut: [
                {
                    background: '#0009',
                    backdropFilter: 'blur(15px)',
                },
                {
                    background: '#0000',
                    backdropFilter: 'blur(0px)',
                },
            ],
            animationPushIn: [
                { transform: 'scale(.5)', offset: 0 },
                { transform: 'scale(1.4)', offset: .75 },
                { transform: 'scale(1)', offset: 1 },
            ],
            animationPushOut: [
                { transform: 'scale(1)', offset: 0 },
                { transform: 'scale(1.4)', offset: .75 },
                { transform: 'scale(.5)', offset: 1 },
            ],
        },
    }
    
    style.theme = {
        flat: {},
        macosLike: {
            backgroundColorPrimary: style.general.backgroundColorPrimaryWithTransparency,
            backgroundColorSecondary: style.general.backgroundColorSecondaryWithTransparency,
            backdropFilter: style.general.backdropFilter,
            border: '1px solid #888d8d40',
            padding: style.general.paddingS,
            boxShadow: style.general.boxShadow,
        },
    }[theme.name || 'flat']

    const setTheme = theme => {
        theme = theme
        style.theme = style.theme[theme]
    }

    return { style, setTheme }
}

export { GlobalStyle }