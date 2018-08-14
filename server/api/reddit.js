const { getRedditComments, topSubreddits, userTrophies } = require('../utils/reddit')
const { validateRedditUser } = require('../../common/validators')

const getRedditUserInfo = async (req, res) => {
  const { user } = req.params
  if (!validateRedditUser(user)) {
    // Send error - not a valid reddit user
    return res.status(404).json({
      error: 'Not a valid reddit username'
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
    if (e.response && e.response.statusText === 'Not Found') {
      res.status(404).json({
        error: 'User not found'
      })
    } else {
      res.status(500).json({
        error: 'Error retreiving data'
      })
    }
  }
}

module.exports = {
  getRedditUserInfo
}
