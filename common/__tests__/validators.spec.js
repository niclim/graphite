/* eslint-env jest */
const { validateRedditUser } = require('../validators')

describe('validators', () => {
  describe('validateRedditUser', () => {
    test('returns true on valid reddit users', () => {
      expect(validateRedditUser('abc')).toBe(true)
      expect(validateRedditUser('abcdefghijklmnopqrst')).toBe(true)
      expect(validateRedditUser('abc12345-_')).toBe(true)
    })

    test('returns false on invalid reddit users', () => {
      expect(validateRedditUser('ab')).toBe(false)
      expect(validateRedditUser('aasjhdgsaigdfiasugfiasugfiau')).toBe(false)
      expect(validateRedditUser('a23b!')).toBe(false)
    })
  })
})
