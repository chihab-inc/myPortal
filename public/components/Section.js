import { linkDB } from '../controllers/database/linkDB.js'
import { sectionDB } from '../controllers/database/sectionDB.js'
import { GlobalStyle } from '../globalStyle.js'
import { create, setElementStyle, append, icon } from '../web_utils.js'
import { ButtonGroup } from './ButtonGroup.js'
import { ColorInput } from './ColorInput.js'
import { FormModal } from './FormModal.js'
import { Link } from './Link.js'
import { TextInput } from './TextInput.js'

const Section = (id, otherSectionUpdate) => {

    const globalStyle = GlobalStyle()

    const displayedLinks = []
    
    const updateTitle = _title => {
        sectionDB.updateTitledById(id, _title)
        updateUI('title')
    }

    const updateColorAccent = _colorAccent => {
        sectionDB.updateColorAccentdById(id, _colorAccent)
        updateUI('colorAccent')
    }

    const toggleExtendedView = () => {
        sectionDB.toggleExtendedViewById(id)
        updateUI('extendedView')
    }

    const disableExtendedView = () => {
        sectionDB.disableExtendedViewById(id)
        updateUI('extendedView')
    }

    const delete_ = () => {
        // REQUEST CONFIRMATION BEFORE PERMANENTLY DELETING LINK
        /* if (window.confirm('Sure?')) {
            sectionDB.deleteSectionById(id)
            linkDB.permanentlyDeleteLinksBySectionId(id)
            updateUI('delete')
        } */
        sectionDB.deleteSectionById(id)
        linkDB.permanentlyDeleteLinksBySectionId(id)
        updateUI('delete')
    }

    const toggleActive = () => {
        linkDB.toggleLinksBySectionId(id)
        updateUI('active')
    }

    const createLink = data => {
        linkDB.createLink(data)
        updateUI('add')
    }

    const updateButtonGroup = () => {
        let buttons = [
            {
                icon: icon('pen', 1),
                clickHandler: () => {
                    const inputFields = []

                    const titleField = TextInput('Title', 'text', true, 32, sectionDB.getTitleById(id), {})
                    inputFields.push({ inputField: titleField, propertyName: 'title' })

                    const colorField = ColorInput(true, sectionDB.getColorAccentById(id), {})
                    inputFields.push({ inputField: colorField, propertyName: 'colorAccent' })

                    append(document.body,
                        FormModal(
                            {
                                title: sectionDB.getTitleById(id),
                                colorAccent: sectionDB.getColorAccentById(id),
                            },
                            false,
                            inputFields,
                            { true: icon('check', 1), false: icon('check-disabled', 1) },
                            temporaryData => {
                                updateTitle(temporaryData.title)
                                updateColorAccent(temporaryData.colorAccent)
                            }
                        )
                    )
                },
            },
            {
                icon: icon('cross', 1),
                clickHandler: delete_,
            },
            {
                icon: icon('plus', 1),
                clickHandler: () => {
                    const inputFields = []

                    const linkField = TextInput('Link', 'url', true, 524288, null, {})
                    inputFields.push({ inputField: linkField, propertyName: 'href' })

                    const logoField = TextInput('Logo URL', 'url', true, 524288, null, {})
                    inputFields.push({ inputField: logoField, propertyName: 'src' })

                    const descriptionField = TextInput('Short Description', 'text', true, 32, null, {})
                    inputFields.push({ inputField: descriptionField, propertyName: 'tip' })
                    
                    append(document.body,
                        FormModal(
                            {
                                sectionId: id,
                                active: true,
                                deleted: false,
                            },
                            true,
                            inputFields,
                            { true: icon('plus', 1), false: icon('plus-disabled', 1) },
                            temporaryData => createLink(temporaryData)
                        )
                    )
                },
            },
        ].concat(linkDB.getLinkCountBySectionId(id) > 0 ? [
            {
                icon: icon(sectionDB.getExtendedViewById(id) ? 'hide' : 'view', 1),
                clickHandler: toggleExtendedView,
            },
            {
                icon: icon('minus', 1),
                clickHandler: toggleActive,
            },
        ] : [])
        buttonGroup = ButtonGroup({ type: 'rounded' }, buttons)
    }

    const updateLinks = () => {
        displayedLinks.forEach(l => l.remove())
        displayedLinks.length = 0// Clear array
        const links = sectionDB.getExtendedViewById(id) ? linkDB.getLinksBySectionId(id) : linkDB.getNonDeletedLinksBySectionId(id)
        links.forEach(link => append(ul, (() => {
            const l = Link(link.id, updateUI, otherSectionUpdate)
            displayedLinks.push(l)
            return l
        })()))
    }

    const updateUI = (...props) => {
        if (!props || props.length === 0) {
            props = [ 'title', 'colorAccent', 'extendedView', 'add' ]
        }
        props.forEach(prop => {
            switch (prop) {
                case 'title':
                    h2.textContent = sectionDB.getTitleById(id)
                    break
                case 'colorAccent':
                    setElementStyle(h2, { color: sectionDB.getColorAccentById(id) })
                    break
                case 'extendedView':
                    buttonGroup.remove()
                    updateButtonGroup()
                    updateLinks()
                    break
                case 'delete':
                    remove()
                    break
                case 'active':
                    displayedLinks.forEach(l => l.updateUI('active'))
                    break
                case 'add':
                    buttonGroup.remove()
                    updateButtonGroup()
                    updateLinks()
                    break
                default:
                    break
            }
        })
    }

    
    const remove = () => element.remove()

    const element = create('section')
    setElementStyle(element, {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: globalStyle.general.flexGapS,
        width: '425px',
        minWidth: '425px',
        minHeight: '20px',
    })

    const header = create('header')
    setElementStyle(header, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '20px',
        paddingRight: globalStyle.general.paddingM,
    })
    
    const h2 = create('h2')
    h2.textContent = sectionDB.getTitleById(id)
    setElementStyle(h2, {
        backgroundColor: globalStyle.general.backgroundColorSecondary,
        minWidth: '50%',
        maxWidth: '60%',
        height: '100%',
        textAlign: 'center',
        fontSize: globalStyle.general.fontSizeM,
        color: sectionDB.getColorAccentById(id),
        borderRadius: globalStyle.general.borderRadiusM,
        ...{
            backgroundColor: globalStyle.theme.backgroundColorSecondary || globalStyle.general.backgroundColorSecondary,
            border: globalStyle.theme.border || globalStyle.general.noBorder,
            backdropFilter: globalStyle.theme.backdropFilter || globalStyle.general.backdropFilter,
        },
    })
    header.appendChild(h2)
    element.appendChild(header)
    
    const ul = create('ul')
    setElementStyle(ul, {
        backgroundColor: globalStyle.general.backgroundColorSecondary,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: globalStyle.general.flexGapS,
        width: '100%',
        minHeight: '110px',
        padding: globalStyle.general.paddingM,
        listStyleType: 'none',
        borderRadius: globalStyle.general.borderRadiusM,
        ...{
            backgroundColor: globalStyle.theme.backgroundColorSecondary || globalStyle.general.backgroundColorSecondary,
            border: globalStyle.theme.border || globalStyle.general.noBorder,
            padding: globalStyle.theme.padding || globalStyle.general.paddingM,
            backdropFilter: globalStyle.theme.backdropFilter || globalStyle.general.backdropFilter,
        },
    })
    element.appendChild(ul)

    let buttonGroup
    updateButtonGroup()

    element.addEventListener('mouseenter', () => append(header, buttonGroup))

    element.addEventListener('mouseleave', () => buttonGroup.remove())

    disableExtendedView()
    updateLinks()
    
    return { element, updateUI, remove }
}

export { Section }
