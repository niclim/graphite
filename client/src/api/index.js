import axios from 'axios'

const baseUrls = {
  reddit: '/api/reddit/'
}

export const fetchRedditUserData = (user) => axios.get(`${baseUrls.reddit}${user}`)
