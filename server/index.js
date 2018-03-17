const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const router = require('./api')

const app = express()
const PORT = process.env.PORT || 3000
const staticPath = path.join(__dirname, '/../public')

// Middleware and setup
app
  .use(bodyParser.json())
  .use(express.static(staticPath))

// Routes
app
  .use('/', router)

app
  .get('*', (req, res) => {
    res.sendFile(staticPath)
  })

app.listen(PORT, () => {
  console.log(`App is listening on PORT:${PORT}`)
})
