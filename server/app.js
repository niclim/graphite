const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const favicon = require('serve-favicon')

const apiRoute = require('./api')
const staticPath = path.join(__dirname, '/../public')
const faviconPath = path.join(staticPath, `/img/favicon.png`)

const createApp = () => {
  const app = express()
  // Middleware and setup
  app
    .use(bodyParser.json())
    .use(express.static(staticPath))
    .use(favicon(faviconPath))

  // Routes
  app
    .use('/api', apiRoute)

  app
    .get('*', (req, res) => {
      res.sendFile(`${staticPath}/index.html`)
    })

  return app
}

module.exports = createApp
