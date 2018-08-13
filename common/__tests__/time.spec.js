/* eslint-env jest */
const { getDayFromTimestamp, timestampToHr, withinTime } = require('../time')

describe('time utilities', () => {
  describe('getDayFromTimestamp', () => {
    test('returns the correct day from a timestamp', () => {
      expect(getDayFromTimestamp(1534120618)).toBe(6)
    })
  })

  describe('timestampToHr', () => {
    test('returns the correct 24 hr time from a timestamp', () => {
      expect(timestampToHr(70618)).toBe('19:36')
    })
  })

  // need to mock the current date implementation
  describe('withinTime', () => {
    let spy
    beforeEach(() => {
      spy = jest.spyOn(Date, 'now')
      Date.now.mockImplementation(() => 1534120618)
    })

    afterEach(() => {
      spy.mockReset()
    })

    test('returns true if a timestamp is within the specified time', () => {
      expect(withinTime(1534120518, 10000)).toBe(true)
    })

    test('returns false if a timestamp is outside the specified time', () => {
      expect(withinTime(1534020618, 10000)).toBe(false)
    })
  })
})
