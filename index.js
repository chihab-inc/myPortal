const express = require('express')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORTS || 3899

app.use(express.static(path.join(__dirname, 'public')))

app
.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
