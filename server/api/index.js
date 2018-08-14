const express = require('express')
const { getRedditUserInfo } = require('./reddit')

const router = express.Router()

router.get('/reddit/:user', getRedditUserInfo)
/**
 * Route for popular subreddits and view popular words based on posts (in top or something else)
 * - Probably take a cron job or something to update the DB, doesn't need to be run often
 */

module.exports = router
