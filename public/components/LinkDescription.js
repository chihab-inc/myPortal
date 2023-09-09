import { setElementStyle, create } from '../web_utils.js'

const LinkDescription = props => {
    const tip = props.tip

    const remove = () => {
        element.remove()
    }
    
    const element = create('p')
    element.textContent = tip
    setElementStyle(element, {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        background: '#333',
        color: '#fff',
        fontSize: '.6em',
        whiteSpace: 'nowrap',
        zIndex: '3',
        borderRadius: '5px',
        boxSizing: 'border-box',
        padding: '5px',
        position: 'absolute',
        bottom: '5px',
        left: '5px',
        transformOrigin: 'left',
        animation: 'roll-out 0.2s ease-in-out 1',
    })

    return { element, remove }
}

export { LinkDescription }
