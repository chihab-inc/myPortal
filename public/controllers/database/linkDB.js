const linkDB = {}
const DB_NAME = 'links'

const get = item => JSON.parse(localStorage.getItem(item))// TODO - MOVE TO WEB_UTILS
const set = (item, value) => localStorage.setItem(item, JSON.stringify(value))// TODO - MOVE TO WEB_UTILS

linkDB.init = () => {
    if (!get(DB_NAME)) {
        set(DB_NAME, [])
    }
}

linkDB.update = callBack => set(DB_NAME, callBack(get(DB_NAME)))

linkDB.updateLinkPropertyById = (id, prop, value) => {
    linkDB.update(links => {
        links.find(l => l.id === id)[prop] = value
        return links
    })
}

linkDB.createLink = data => {
    linkDB.update(links => {
        links.push(data)
        return links
    })
}

linkDB.getLinkById = id => get(DB_NAME).find(l => l.id === id)
linkDB.getLinksBySectionId = sectionId => get(DB_NAME).filter(l => l.sectionId === sectionId)

linkDB.getSectionIdById = id => linkDB.getLinkById(id).sectionId
linkDB.updateSectionIdById = (id, sectionId) => linkDB.updateLinkPropertyById(id, 'sectionId', sectionId)

linkDB.getHrefById = id => linkDB.getLinkById(id).href
linkDB.updateHrefById = (id, href) => linkDB.updateLinkPropertyById(id, 'href', href)

linkDB.getSrcById = id => linkDB.getLinkById(id).src
linkDB.updateSrcById = (id, src) => linkDB.updateLinkPropertyById(id, 'src', src)

linkDB.getTipById = id => linkDB.getLinkById(id).tip
linkDB.updateTipById = (id, tip) => linkDB.updateLinkPropertyById(id, 'tip', tip)

linkDB.getActiveById = id => linkDB.getLinkById(id).active
linkDB.disableLinkById = id => linkDB.updateLinkPropertyById(id, 'active', false)
linkDB.enableLinkById = id => linkDB.updateLinkPropertyById(id, 'active', true)
linkDB.toggleLinkById = id => linkDB.updateLinkPropertyById(id, 'active', !linkDB.getActiveById(id))
linkDB.toggleLinksBySectionId = sectionId => {
    linkDB.getLinksBySectionId(sectionId)
    .filter(l => !l.deleted)
    .some(l => l.active)
        ? linkDB.getLinksBySectionId(sectionId)
            .filter(l => !l.deleted)
            .forEach(l => {
                linkDB.disableLinkById(l.id)
            })
        : linkDB.getLinksBySectionId(sectionId)
            .filter(l => !l.deleted)
            .forEach(l => {
                linkDB.enableLinkById(l.id)
            })
}

linkDB.getDeletedById = id => linkDB.getLinkById(id).deleted
linkDB.deleteLinkById = id => linkDB.updateLinkPropertyById(id, 'deleted', true)
linkDB.recoverDeletedLinkById = id => linkDB.updateLinkPropertyById(id, 'deleted', false)
linkDB.deleteLinksBySectionId = sectionId => {
    linkDB.getLinksBySectionId(sectionId).forEach(l => {
        linkDB.deleteLinkById(l.id)
    })
}

linkDB.permanentlyDeleteLinkById = id => {
    linkDB.update(links => {
        links = links.filter(l => l.id !== id)
        console.log(links.length)
        return links
    })
}
linkDB.permanentlyDeleteLinksBySectionId = sectionId => {
    linkDB.getLinksBySectionId(sectionId).forEach(l => {
        linkDB.permanentlyDeleteLinkById(l.id)
    })
}

export { linkDB }