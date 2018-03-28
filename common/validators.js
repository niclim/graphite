// Valid reddit user is alphanumeric and - _ between 3 and 20 characters
const validateRedditUser = (user) => /^([a-z0-9]|-|_){3,20}$/i.test(user)

module.exports = {
  validateRedditUser
}
