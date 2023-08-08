const express = require('express')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app
.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})
.get('/dev', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(3899, () => {
  console.log('Listening on port 3899')
})
