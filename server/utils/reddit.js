const axios = require('axios')
const mock = require('./mockdata')
const { withinTime } = require('../../common/time')

const redditCache = {}

// Clears out stale cache
// eslint-disable-next-line
const interval = setInterval(() => {
  for (const key in redditCache) {
    if (!withinTime(redditCache[key].time, 1000 * 60 * 60)) {
      delete redditCache[key]
    }
  }
}, 1000 * 60 * 30) // Every 30 minutes

const getRedditComments = (user, sort = 'hot') => {
  // This needs to chain api calls because of how the reddit api is exposed
  return new Promise(async (resolve, reject) => {
    if (redditCache[user] && withinTime(redditCache[user].time, 1000 * 60 * 60)) {
      resolve(redditCache[user].data)
    }

    try {
      let i = 0
      let after = null
      let comments = []

      // Because the request need to be in series - limit to 5 so it doesn't take forever
      while (i < 5) {
        const res = await redditHelper(user, sort, after, i)
        const { data } = res.data
        comments = comments.concat(data.children)
        after = data.after
        i++
        // Stops if this is the last comment
        if (data.children.length > 25) { break }
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
        id: data.id,
        numComments: data.num_comments
      }))

      // Store data in cache
      redditCache[user] = {
        time: Date.now(),
        data: comments
      }

      resolve(comments)
    } catch (e) {
      reject(e)
    }
  })
}

const redditHelper = (user, sort, after, i) => {
  return axios({
    method: 'get',
    url: `https://www.reddit.com/user/${user}/comments.json?raw_json=1&sort=${sort}${after ? `&after=${after}` : ''}&count=${i * 25}`,
    headers: {
      'User-Agent': 'node:graphite:v-0.0.1'
    }
  })
}
const redditMockData = () => {
  return Promise.resolve(mock.data)
}

module.exports = {
  getRedditComments,
  redditMockData
}
