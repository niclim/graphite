const express = require('express')
const { getRedditComments } = require('../utils/reddit')

const router = express.Router()

router.get('/:user', async (req, res) => {
  // Check whether we have a valid username
  try {
    const comments = await getRedditComments(req.params.user, 'hot')
    res.json({
      comments
    })
  } catch (e) {
    // send 404 or error
    res.json({

    })
  }
})
/**
 * Route for popular subreddits and view popular words based on posts (in top or something else)
 * - Probably take a cron job or something to update the DB, doesn't need to be run often
 */

module.exports = router
