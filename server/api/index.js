const express = require('express')

const router = express.Router()

router.get('/:user', (req, res) => {
  // probably change this route as well
  // Here we will need to get an api endpoint set up for reddit and then serve the data back... although i gotta figure out what to add to this and what other requests need to be done with this....
  res.json({})
})

module.exports = router
