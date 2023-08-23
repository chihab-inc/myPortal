# myPortal
A web portal to manage an unlimited set of web links categorized into multiple sections. This should improve the work flow for users who need to use multiple web services to carry out their job. This is a sort of bookmarking, but much more fluid and much more user friendly.

## HOW TO RUN THE SERVER?
Once the repository has been cloned, head to the main node folder. Once in, run the server using the good old `node index.js` or `nodemon`. There is no need to `npm install` any dependecy. The app is pretty lightweight and all the dependecies are in the repository.

## HOW TO USE?
Once the server is running, open a browser and head to `localhost:3898`. This should bring up the app's page.

## TEMPORARY TECHNICAL LIMITATION
As of today, since the feature to create a first section manually has not been implemented yet, it is not possible, using only the UI, to populate the database. Nonetheless, to allow you to use the app still, here is a JSON object representing a first section object containing a first link:
```json
{
    "sections": [
        {
            "id": 0,
            "title": "Your first section",
            "colorAccent": "#3DCD58",
            "extendedView": false
        }
    ],
    "links": [
        {
            "id": "a941e289-93a2-4bcf-b476-c35a68a51267",
            "sectionId": 0,
            "href": "https://m.media-amazon.com/images/I/01fnVfMakPL.png",
            "src": "https://m.media-amazon.com/images/I/01fnVfMakPL.png",
            "tip": "Just an orange square",
            "active": true,
            "deleted": false
        }
    ]
}
```
We suggest you copy the JSON object above and set it as a value to a `localStorage` item that you should call `DATA-BASE` (mind the case). You can do this in 2 ways:
### Through the browser's Application tab
On a brower, on the page `localhost:3898`, open the inspector, find the 'Application' tab, then on the left side of this tab, under 'Storage', find 'Local Storage'. Extend 'Local Storage' if collapsed, then click on 'http://localhost:3898'. Now on the right side, you should see a table that has at least 2 columns: 'Key' and 'Value'. Double left-click right underneath 'Key' then type 'DATA-BASE', then double left-click right underneath 'Value' and paste the object above that was copied. Refresh the page and you should be all set.
### Alternatively, through the browser's Console
On a browser, on the page `localhost:3898`, open the inspector, then open the tab 'Console'. in the interactive console, execute the JavaScript code below:
```JavaScript
localStorage.setItem('DATA-BASE', '{"sections":[{"id":0,"title":"Your first section","colorAccent":"#3DCD58","extendedView":false}],"links":[{"id":"a941e289-93a2-4bcf-b476-c35a68a51267","sectionId":0,"href":"https://m.media-amazon.com/images/I/01fnVfMakPL.png","src":"https://m.media-amazon.com/images/I/01fnVfMakPL.png","tip":"Just an orange square","active":true,"deleted":false}]}')
```
You can obviously enrich this JSON object to add as many sections and links to use as an initial configuration.

# ENJOY!
