const axios = require('axios')
const mock = require('./mockdata')
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
        comments = comments.concat(data.children)
        after = data.after
        i++
      }

      comments = comments.map(({ data }) => ({
        score: data.score,
        ups: data.ups,
        downs: data.downs,
        controversiality: data.controversiality,
        body: data.body,
        linkTitle: data.link_title,
        isOriginalPoster: data.link_author === data.author,
        timestamp: data.created_utc,
        id: data.id
      }))

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
      'User-Agent': 'node:graphite:v-0.0.1'
    }
  })
}
const redditMockData = () => {
  return Promise.resolve(mock.data.map((data, i) => ({ ...data, id: i })))
}

module.exports = {
  getRedditComments,
  redditMockData
}
