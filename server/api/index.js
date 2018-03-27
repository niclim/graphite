const express = require('express')
const axios = require('axios')

const router = express.Router()

const getRedditComments = (user, sort) => {
  // This needs to chain api calls
  return new Promise(async (resolve, reject) => {
    let i = 0
    let after = null
    let comments = []
    while (i < 5) {
      // parse comments and get after string from reddit helper
      const res = await redditHelper(user, sort, after, i)
      const childrenLength = res.data.children.length
      comments = comments.concat(res.data.children)
      after = res.data.children[childrenLength - 1].data.name
      i++
    }
  })
}

const redditHelper = (user, sort, after, i) => {
  return axios({
    method: 'get',
    url: `https://www.reddit.com/user/${user}/comments.json?raw_json=1&sort=${sort}${after ? `$after=${after}` : ''}&count=${i * 25}`,
    headers: {
      'User-Agent': '' // Set this to something useful
    }
  })
}

router.get('/:user', (req, res) => {
  /**
   * Steps: - req.params.user
   * take the top 250 posts sorted by HOT and provide analysis or something comparing to new or something
   * - This can be done every time page is hit, no need to store db information
   * - We need to hit the api then get the last comment ID - this will need to be chained api calls by adding the after query param
   * - Update the user agent in the call
   * - https://www.reddit.com/user/`${username}`/comments.json?raw_json=1&sort=new&after=t1_dkmu5ma&count=25
   *
   * OR take popular subreddits and view popular words based on posts (in top or something else)
   * - Probably take a cron job or something to update the DB, doesn't need to be run often
   */
  // Extract raw text from the response
  // Handle error

  res.json({})
})

module.exports = router
