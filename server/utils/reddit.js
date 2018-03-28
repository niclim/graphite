const axios = require('axios')

const getRedditComments = (user, sort) => {
  // This needs to chain api calls because of how the reddit api is exposed
  return new Promise(async (resolve, reject) => {
    try {
      let i = 0
      let after = null
      let comments = []
      while (i < 5) {
        // parse comments and get after string from reddit helper
        const res = await redditHelper(user, sort, after, i)
        const { data } = res.data
        const childrenLength = data.children.length
        comments = comments.concat(data.children)
        after = data.children[childrenLength - 1].data.name
        i++
      }
      // Map these comments
      // comments = comments.map(comment => ({

      // }))
      resolve(comments)
    } catch (e) {
      reject(e)
    }
  })
}

const redditHelper = (user, sort, after, i) => {
  return axios({
    method: 'get',
    url: `https://www.reddit.com/user/${user}/comments.json?raw_json=1&sort=${sort}${after ? `$after=${after}` : ''}&count=${i * 25}`,
    headers: {
      'User-Agent': 'node:graphite:v-development'
    }
  })
}

module.exports = {
  getRedditComments
}
