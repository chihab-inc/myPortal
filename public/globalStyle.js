import { themeDB } from './controllers/database/themeDB.js'

const primaryColor = themeDB.getTheme().colors.primaryColor
const secondaryColor = themeDB.getTheme().colors.secondaryColor
const accentColor = themeDB.getTheme().colors.accentColor
const mainBackground = themeDB.getTheme().background

let GlobalStyle = () => {
    const general = {
        borderRadiusS: '3px',
        borderRadiusM: '5px',
        borderRadiusL: '10px',
        borderRadiusXL: '100px',
        borderRadiusCircle: '50%',
        buttonOpacity: '.6',
        buttonHoverOpacity: '1',
        buttonSizeS: '20px',
        buttonSizeM: '40px',
        buttonSizeL: '60px',
        buttonSizeXL: '150px',
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
        fontSizeXL: '2.5em',
        fontFamily: '"Nanum Gothic", sans-serif',
        fontColor: '#eeeeee',
        fontColorDark: '#111111',
        mainBackground: mainBackground.type === 'image' ? `url(${mainBackground.value})` : mainBackground.value,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundColorTransparent: 'transparent',
        backgroundColorPrimary: primaryColor,
        backgroundColorSecondary: secondaryColor,
        backgroundColorPrimaryWithTransparency: `${primaryColor}99`,
        backgroundColorSecondaryWithTransparency: `${secondaryColor}99`,
        accentColor,
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
        border: `1px solid ${secondaryColor}`,
        backdropFilter: 'blur(15px)',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
        zIndexBottom: '0',
        zIndexMiddle: '1',
        zIndexTop: '2',
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
        animationRollOutLeftRight: [ { transform: 'scaleX(0.1)' }, { transform: 'scaleX(1)' } ],
    }
    
    const theme = {
        flat: {},
        macosLike: {
            backgroundColorPrimary: general.backgroundColorPrimaryWithTransparency,
            backgroundColorSecondary: general.backgroundColorSecondaryWithTransparency,
            backdropFilter: general.backdropFilter,
            border: '1px solid #888d8d40',
            padding: general.paddingS,
            boxShadow: general.boxShadow,
        },
    }[themeDB.getTheme().name || 'flat']

    const setTheme = _theme => theme = theme[_theme]

    const settings = {
        scrollSpeedHoverMax: 1,
        scrollSpeedPressMax: 4,
        scrollSpeedQuickMax: 64,
    }

    return { general, theme, settings, setTheme }
}

export { GlobalStyle }