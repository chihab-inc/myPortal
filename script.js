'use strict'

const SPRINT_NUMBER = 14.2

if (!localStorage.getItem('config')) {
    localStorage.setItem(
        'config',
        JSON.stringify(
            [
                [// Section
                    {// SubSection
                        componentClassName: 'client-company',
                        title: 'Schneider Electric',
                        setElementClassName: 'services',
                        links: [
                            {// Link
                                href: 'https://confluence.se.com/display/PAR/EDE+SAP+API+Documentation',
                                src: 'https://seeklogo.com/images/C/confluence-logo-D9B07137C2-seeklogo.com.png',
                                tip: 'Confluence SAP Connector',
                                active: false,
                                deleted: false,
                            },
                            {
                                href: `https://dev.azure.com/IIoT-Solutions/IIoT%20Solutions/_sprints/taskboard/Edge/IIoT%20Solutions/IIoT%20Solutions%20Program/PI%2014/Sprint%201${SPRINT_NUMBER}`,
                                src: 'http://code.benco.io/icon-collection/azure-icons/Backlog.svg',
                                tip: `EDE Sprint number ${SPRINT_NUMBER}`,
                                active: false,
                                deleted: false,
                            },
                            {
                                href: 'https://dev.azure.com/IIoT-Solutions/IIoT%20Solutions/_git/EdgeCore',
                                src: 'http://code.benco.io/icon-collection/azure-icons/TFS-VC-Repository.svg',
                                tip: 'EdgeCore Repository',
                                active: false,
                                deleted: false,
                            },
                            {
                                href: 'https://dev.azure.com/IIoT-Solutions/IIoT%20Solutions/_git/Connect-Collect-Web',
                                src: 'http://code.benco.io/icon-collection/azure-icons/TFS-VC-Repository.svg',
                                tip: 'Connect Collect Web Repository',
                                active: false,
                                deleted: false,
                            },
                            {
                                href: 'https://se.iobeya.com/s/download/resources/client-html-plugin/4.18.6.117164939/public/#/en-US/room/6080e8dd-1b85-40eb-a067-19a28f1e9998',
                                src: 'https://www.iobeya.com/wp-content/uploads/2022/07/cropped-cropped-favico-1.png',
                                tip: 'IObeya',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://confluence.se.com/display/ECA',
                                src: 'https://seeklogo.com/images/C/confluence-logo-D9B07137C2-seeklogo.com.png',
                                tip: 'Confluence Edge Compute Apps',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://jira.se.com/secure/RapidBoard.jspa?rapidView=11549&projectKey=IECA&quickFilter=60348',
                                src: 'https://cdn.icon-icons.com/icons2/2429/PNG/512/jira_logo_icon_147274.png',
                                tip: 'Jira IIOT Edge Compute Apps',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://dev.azure.com/IIoT-Solutions/IIoT%20Solutions/_git/cbm-api',
                                src: 'http://code.benco.io/icon-collection/azure-icons/TFS-VC-Repository.svg',
                                tip: 'CBM API Repository',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://dev.azure.com/IIoT-Solutions/IIoT%20Solutions/_git/cbm-ui',
                                src: 'http://code.benco.io/icon-collection/azure-icons/TFS-VC-Repository.svg',
                                tip: 'CBM UI Repository',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://schneiderelectric.sharepoint.com/sites/SP-GLB-INDB-PSO/SitePages/PSO-Training.aspx?xsdata=MDV8MDF8fDU5NWQxNDczMzQzNTRhNDE5YzhlMDhkYWM3YWUyNGQ5fDZlNTFlMWFkYzU0YjRiMzliNTk4MGZmZTlhZTY4ZmVmfDB8MHw2MzgwNDE4NDc5ODI4MjQ1OTB8VW5rbm93bnxWR1ZoYlhOVFpXTjFjbWwwZVZObGNuWnBZMlY4ZXlKV0lqb2lNQzR3TGpBd01EQWlMQ0pRSWpvaVYybHVNeklpTENKQlRpSTZJazkwYUdWeUlpd2lWMVFpT2pFeGZRPT18MXxNVFkyT0RVNE56azVOekE1TWpzeE5qWTROVGczT1RrM01Ea3lPekU1T2pjMk1USTFNR0U1TnpkbVpqUTNaamM1WVRoaE1UQXdNbU13Wmpka05EZGtRSFJvY21WaFpDNTJNZz09fDI2ZmEzYTUxZDRlOTQ3NDI5YzhlMDhkYWM3YWUyNGQ5fGY5YjhhMzE0MzUxNDQyNjhiN2I4NmQzN2RkMGM3MGE5&sdata=RVF4SlNCdllqTkVIdkgyay80cHJ2QTV1b2V4dGxQbW03b3ZvcFN5VG9SST0%3D&ovuser=6e51e1ad-c54b-4b39-b598-0ffe9ae68fef%2CSESA684684%40se.com&OR=Teams-HL&CT=1668595303265&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiIyNy8yMjEwMjgwNzIwMCIsIkhhc0ZlZGVyYXRlZFVzZXIiOmZhbHNlfQ%3D%3D',
                                src: 'https://images.vexels.com/media/users/3/148083/isolated/lists/94cb6a418a107a1c8b2c170a857d53c3-training-square-icon.png',
                                tip: '=S= Training',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://schneiderelectric.sharepoint.com/:x:/r/sites/IIoT2.0EdgeAppsProgramGroup-PI1-AssetPerformanceAPPs/_layouts/15/Doc.aspx?sourcedoc=%7B79C5EBB6-5201-42A2-8FB1-03E7614A598A%7D&file=planning_travail_conges_absences.xlsx&action=default&mobileredirect=true',
                                src: 'https://www.transparentpng.com/download/holidays/beach-holidays-png-transparent-25.png',
                                tip: 'Sharepoint Holiday File',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://schneider.service-now.com/supportatschneider',
                                src: 'https://w1.pngwing.com/pngs/483/167/png-transparent-call-logo-customer-service-technical-support-purchasing-service-quality-business-call-centre-selfservice.png',
                                tip: '=S= Service Now',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://pages.github.schneider-electric.com/quartzds/se-icons/',
                                src: 'https://bs-uploads.toptal.io/blackfish-uploads/components/skill_page/content/logo_file/logo/195467/ui-07d394a42504c33be153ae94c14f36cf-24b9a12e4e385375647fd19e9b5ebc2d.png',
                                tip: '=S= Icon Library',
                                active: true,
                                deleted: false,
                            },
                        ]
                    },
                    {
                        componentClassName: 'service-company',
                        title: 'AVISTO',
                        setElementClassName: 'services',
                        links: [
                            {
                                href: 'https://outlook.office.com/mail/',
                                src: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Circle-icons-mail.svg',
                                tip: 'Outlook',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://portail.advans-group.com/CegidPortal/Home/Index/A004_AVISTO',
                                src: 'https://www.elsys-design.com/wp-content/uploads/2019/04/picto-elsys-design-600px.jpg',
                                tip: 'Advance Group Portal',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://secure.digiposte.fr',
                                src: 'https://www.index-education.com/contenu/img/commun/logo-digiposte.png',
                                tip: 'Digiposte',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://assure.generation.fr/adherent',
                                src: 'https://www.generation.fr/portail-generation-drupal-prd/s3fs-public/uploads/images/logo_blanc_picto.png',
                                tip: 'Mutuelle Generation',
                                active: true,
                                deleted: false,
                            },
                        ]
                    }
                ],
                [
                    {
                        componentClassName: 'client-company',
                        title: 'Productivity',
                        setElementClassName: 'services',
                        links: [
                            {
                                href: 'https://github.com/chihab-inc/myPortal',
                                src: 'https://w7.pngwing.com/pngs/914/758/png-transparent-github-social-media-computer-icons-logo-android-github-logo-computer-wallpaper-banner-thumbnail.png',
                                tip: 'GitHub - MyPortal',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://go.dev',
                                src: 'https://go.dev/blog/go-brand/Go-Logo/PNG/Go-Logo_LightBlue.png',
                                tip: 'Go Lang Online Editor',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://qtext.io/7813',
                                src: 'https://qtext.io/static/favicon/512x512.png',
                                tip: 'QText - Shared Text Editor',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://jsoncrack.com/editor',
                                src: 'https://cdn-1.webcatalog.io/catalog/json-crack/json-crack-icon-filled-256.png?v=1669863995747',
                                tip: 'Visialize JSON',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://www.scrumpoker-online.org/',
                                src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Logo_vote.svg/1200px-Logo_vote.svg.png',
                                tip: 'Scrum Pocker',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://vectr.com/design',
                                src: 'https://blog.gitnux.com/wp-content/uploads/2023/03/vectr-logo.png',
                                tip: 'Vectr',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://www.photopea.com/',
                                src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Photopea_logo.svg/2048px-Photopea_logo.svg.png',
                                tip: 'PhotoPea',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://www.regextester.com/',
                                src: 'https://user-images.githubusercontent.com/5418178/175823761-ee7996b9-57be-4abf-be93-0ad25e7f37f0.png',
                                tip: 'Regex Tester',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://app.runwayml.com/',
                                src: 'https://runwayml.com/images/logo-square.png',
                                tip: 'Online Video Editor (RotoScope)',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://online-video-cutter.com/crop-video',
                                src: 'https://store-images.s-microsoft.com/image/apps.26533.80453411-e24b-40aa-a3b3-ea06a80e5798.34add786-e76f-411d-a93b-5ffd28c9d579.c7b9e9f7-4528-4a12-bbb2-50bca47a9229',
                                tip: 'Online Video Editor (Crop, Cut)',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://cloudconvert.com/mp4-to-gif',
                                src: 'https://pbs.twimg.com/profile_images/1488073274991030274/_WcKbgdj_400x400.jpg',
                                tip: 'Online Video Converter (..., GIF)',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://ezgif.com/resize/',
                                src: 'https://cdn-1.webcatalog.io/catalog/ezgif/ezgif-icon-filled-256.png?v=1675597555306',
                                tip: 'GIF editor',
                                active: true,
                                deleted: false,
                            },
                            {
                                href: 'https://codepen.io/pen/',
                                src: 'https://cdn-icons-png.flaticon.com/512/1626/1626319.png',
                                tip: 'CodePen',
                                active: true,
                                deleted: false,
                            },
                        ]
                    }
                ]
            ]
        )
    )
}

const LinkComponent = props => {
    let li = document.createElement('li')
    if (!props.active) {
        li.classList.add('disabled-link')
    }

    const hide = () => {
        document.getElementById('close-button')?.remove()
        document.getElementById('tooltip')?.remove()
    }
    
    li.appendChild(anchorComponent({ href: props.href, src: props.src }))
    
    li.addEventListener('mouseenter', e => {
        // RESET TO AVOID LAGGIND DUPLICATES
        hide()

        const rect = li.getBoundingClientRect()
        
        // APPEND CLOSE BUTTON
        li.appendChild(
            closeButtonComponent({
                x: rect.left + 5,
                y: rect.top + 5,
                clickHandler: () => {
                    let config = JSON.parse(localStorage.getItem('config'))
                    config[props.sectionIndex][props.subSectionIndex].links[props.linkIndex].deleted = true
                    localStorage.setItem('config', JSON.stringify(config))
                    loadMainComponent()
                }
            })
        )
        
        // APPEND TOOLTIP
        li.appendChild(
            tooltipComponent({
                tip: props.tip,
                x: rect.left + 5,
                y: rect.bottom - 27,
            })
        )

    })
    li.addEventListener('mouseleave', e => {
        const rect = li.getBoundingClientRect()
        
        const left = rect.left
        const top = rect.top
        const right = rect.right
        const bottom = rect.bottom

        const x = e.pageX
        const y = e.pageY

        // CURSOR PLACEMENT CONDITION TO IGNORE EVENT ON CHILD ELEMENTS
        if (!(x > left && x < right) || !(y > top && y < bottom)) {
            hide()
        }
    })
    
    return li
}

let anchorComponent = props => {
    let a = document.createElement('a')
    a.setAttribute('target', '_blank')
    a.setAttribute('href', props.href)
    a.style.backgroundImage = `url(${props.src})`

    return a
}

const closeButtonComponent = props => {
    let close_button = document.createElement('img')
    close_button.id = 'close-button'
    close_button.src = './icons/cross.png'
    close_button.style.left = `${props.x}px`
    close_button.style.top = `${props.y}px`

    close_button.addEventListener('click', e => {
        props.clickHandler()
    })
    
    return close_button
}

const tooltipComponent = props => {
    let tooltip = document.createElement('p')
    tooltip.id = 'tooltip'
    tooltip.textContent = props.tip
    tooltip.style.left = `${props.x}px`
    tooltip.style.top = `${props.y}px`

    return tooltip
}

const SubSectionComponent = props => {
    let article = document.createElement('article')
    let ul = document.createElement('ul')
    let h2 = document.createElement('h2')

    article.classList.add(props.componentClassName)
    h2.innerHTML = props.title
    ul.classList.add(props.setElementClassName)

    
    article.appendChild(h2)
    props.links.forEach(link => {
        ul.appendChild(link)
    })
    article.appendChild(ul)
    
    return article
}

const SectionComponent = props => {
    let section = document.createElement('section')

    props.subSections.forEach(linkSet => {
        section.appendChild(linkSet)
    })

    return section
}

const MainComponent = props => {
    let main = document.createElement('main')
    main.id = 'main'

    for (const [sectionIndex, section] of props.config.entries()) {
        main.appendChild(
            SectionComponent({
                subSections: section.map((subSection, subSectionIndex) => SubSectionComponent({
                    subSectionIndex,
                    componentClassName: subSection.componentClassName,
                    title: subSection.title,
                    setElementClassName: subSection.setElementClassName,
                    links: subSection.links
                        .filter(link => !link.deleted)
                        .map((link, linkIndex) => LinkComponent({ sectionIndex, subSectionIndex, linkIndex, href: link.href, src: link.src, tip: link.tip, active: link.active }))
                }))
            })
        )
    }
    
    return main
}

const loadMainComponent = () => {
    // RESET MAIN TO AVOID LAGGIND DUPLICATES
    document.getElementById('main')?.remove()

    document.body.appendChild(
        MainComponent({ config: JSON.parse(localStorage.getItem('config')) })
    )
}

window.addEventListener('load', e => {
    loadMainComponent()
})