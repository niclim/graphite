/* eslint-env jest */
import { mount } from '@vue/test-utils'
import Results from './Results'
import { fetchRedditUserData } from '../../api'
jest.mock('../../api')

describe('Results', () => {
  let routeMock, wrapper, fetchRedditDataMock

  beforeEach(() => {
    routeMock = {
      query: {
        user: 'abcdef'
      }
    }
    wrapper = mount(Results, {
      mocks: {
        route: routeMock
      }
    })
    fetchRedditDataMock = () => Promise.resolve({
      data: {
        subreddits: [],
        trophies: [],
        comments: []
      }
    })
    fetchRedditUserData.mockImplementation(fetchRedditDataMock)
  })

  describe('data fetching', () => {
    test('fetches user data when mounted', () => {
      // expect(fetchRedditDataMock.calls).toBe(1)
    })
  })

  describe('date toggle', () => {

  })

  describe('graphs', () => {
    
  })
})
