export class logoFinder {
    
    // Create the modal
    constructor(){
        this.modal = document.createElement('div')
        this.modal.setAttribute('class', 'logoFinder')
        document.body.appendChild(this.modal)
    }

    // a function that gets the source code of google images page
    // it goes througth a proxy hosted in devcrawlers.com (to avoid CORS policy)
    // you can create your own proxy and use it
    fetchImages(token){
        this.images = []
        this.modal.style.display = "block" // show the modal
        this.modal.innerHTML = "<img class='laoding' src='https://i.pinimg.com/originals/be/ce/0c/bece0c797cb134aefb2cb836578c9249.gif'>"
        if(! token || token.trim() == ""){
            this.modal.style.display = "none" // close the model if no token provided
            return
        }
        token = token.replace(" ", "+")
        let url = "https://devcrawlers.com/proxies/google_images.php?q="+token
        fetch(url, {
            method: "GET"
        }).then(response => response.text())
        .then(data => {
            let page = new DOMParser().parseFromString(data, "text/xml")
            let images = page.querySelectorAll("img")
            let imagesUrls = []
            Array.prototype.slice.call(images).map(image => {
                if(image.alt != "Google"){
                    imagesUrls.push(image.src)
                }
            });
            this.images = [...new Set(imagesUrls)]
            this.loadImages()
        })
        .catch(err => console.log(err))
    }

    loadImages(){
        this.modal.style.display = "grid"
        this.modal.innerHTML = ""
        this.images.map(link => {
            let elem = document.createElement("div")
            elem.className = "img"
            elem.style.backgroundImage = "url('"+link+"')"
            elem.setAttribute('data-url', link)
            this.modal.appendChild(elem)
            elem.addEventListener('click', (evt) => {
                document.getElementById('logoUrl').value = evt.target.getAttribute('data-url')
                this.modal.style.display = "none" // close the modal when item selected
            })
        })
    }

}