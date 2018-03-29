const express = require('express')
const { getRedditComments, redditMockData } = require('../utils/reddit')
const { validateRedditUser } = require('../../common/validators')
const router = express.Router()

router.get('/reddit/:user', async (req, res) => {
  const { user } = req.params
  if (!validateRedditUser(user)) {
    // Send error - not a valid reddit user
    res.json({

    })
  }
  try {
    // const comments = await getRedditComments(user, 'hot')
    const comments = await redditMockData()

    res.json({
      comments
    })
  } catch (e) {
    // send error no valid user
    res.json({

    })
  }
})
/**
 * Route for popular subreddits and view popular words based on posts (in top or something else)
 * - Probably take a cron job or something to update the DB, doesn't need to be run often
 */

module.exports = router
