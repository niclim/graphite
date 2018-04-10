const express = require('express')
const { getRedditComments, topSubreddits, userTrophies } = require('../utils/reddit')
const { validateRedditUser } = require('../../common/validators')
const router = express.Router()

router.get('/reddit/:user', async (req, res) => {
  const { user } = req.params
  if (!validateRedditUser(user)) {
    // Send error - not a valid reddit user
    res.json({
      status: 404,
      error: 'No user found'
    })
  }
  try {
    const [ comments, subreddits, trophies ] = await Promise.all([
      getRedditComments(user, 'top'),
      topSubreddits(user),
      userTrophies(user)
    ])

    res.status(200).json({
      comments,
      subreddits,
      trophies
    })
  } catch (e) {
    if (e.response.statusText === 'Not Found') {
      res.status(200).json({
        error: 'User not found'
      })
    } else {
      res.status(404).json({
        error: 'Error retreiving data'
      })
    }
  }
})
/**
 * Route for popular subreddits and view popular words based on posts (in top or something else)
 * - Probably take a cron job or something to update the DB, doesn't need to be run often
 */

module.exports = router
