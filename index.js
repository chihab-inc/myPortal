const express = require('express')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3898

app.use(express.static(path.join(__dirname, 'public')))

app
.get('/', (req, res) => {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en" >
    <head>
      <title>My Portal${process.env.PORT ? ' (Dev)' : ''}</title>
      <meta charset="UTF-8">
      <title>My Portal</title>
      <link rel="icon" type="image/x-icon" href="./icons/favicon-32x32.png">
      <link rel="stylesheet" href="./style.css">
    </head>
    <body>
      <script src="script.js" type="module"></script>
    </body>
    </html>
  `
  res.send(htmlTemplate)
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
