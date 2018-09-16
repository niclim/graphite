/* eslint-env jest */
import { mount } from '@vue/test-utils'
import { Switch as AtSwitch } from 'at-ui'
import Results from './Results'
import Loading from '../../components/Loading'
import Card from '../../components/Card'
import CardItem from '../../components/CardItem'
import { fetchRedditUserData } from '../../api'
jest.mock('../../api')

describe('Results', () => {
  let routeMock, wrapper, fetchRedditDataMock, fetchRedditPromise

  beforeEach(() => {
    routeMock = {
      query: {
        user: 'abcdef'
      }
    }
    fetchRedditPromise = Promise.resolve({
      data: {
        subreddits: [
          {
            name: 'one',
            icon_img: '',
            url: 'http://abc.com',
            comment_karma: 10,
            link_karma: 20
          },
          {
            name: 'two',
            icon_img: '',
            url: 'http://abc.com',
            comment_karma: 10,
            link_karma: 20
          }
        ],
        trophies: [
          {
            name: 'one',
            icon_40: ''
          },
          {
            name: 'two',
            icon_40: ''
          }
        ],
        comments: [
          {
            score: 1,
            ups: 1,
            downs: 0,
            controversiality: 0,
            body: 'hello test',
            linkTitle: 'test link',
            isOriginalPoster: false,
            timestamp: 1391833902,
            id: 'test_id',
            numComments: 10
          }
        ]
      }
    })
    fetchRedditDataMock = () => fetchRedditPromise
    fetchRedditUserData.mockImplementation(fetchRedditDataMock)
  })

  describe('data fetching', () => {
    test('fetches user data when mounted', async done => {
      wrapper = mount(Results, {
        mocks: {
          $route: routeMock
        }
      })
      expect(wrapper.findAll(Loading).exists()).toBe(true)

      // After all things fetches resolve
      await fetchRedditPromise

      expect(wrapper.findAll(Loading).exists()).toBe(false)
      expect(fetchRedditUserData.mock.calls.length).toBe(1)
      done()
    })
  })

  describe('date toggle', () => {
    test('can switch graph display to show over 24 hrs or over days', async done => {
      wrapper = mount(Results, {
        mocks: {
          $route: routeMock
        }
      })

      await fetchRedditPromise
      expect(wrapper.vm.postDay).toBe(true)

      wrapper.find(AtSwitch).trigger('click')

      expect(wrapper.vm.postDay).toBe(false)
      done()
    })
  })

  describe('panels', () => {
    test('subreddit panel should render subreddits a user is active in', async done => {
      wrapper = mount(Results, {
        mocks: {
          $route: routeMock
        }
      })

      await fetchRedditPromise
      const SubredditCard = wrapper
        .findAll(Card)
        .filter(c => c.attributes()['data-qa'] === 'subreddits')
        .at(0)

      expect(SubredditCard.findAll(CardItem).length).toBe(2)
      done()
    })

    test('trophies panel should render trophies a user has earned', async done => {
      wrapper = mount(Results, {
        mocks: {
          $route: routeMock
        }
      })

      await fetchRedditPromise
      const TrophiesCard = wrapper
        .findAll(Card)
        .filter(c => c.attributes()['data-qa'] === 'trophies')
        .at(0)

      // 2 trophies + bottom panel
      expect(TrophiesCard.findAll(CardItem).length).toBe(3)
      done()
    })
  })

  describe('graphs', () => {
    test('shows data points fetched from an endpoint', async done => {
      wrapper = mount(Results, {
        mocks: {
          $route: routeMock
        }
      })

      await fetchRedditPromise

      const WordFrequencyContainer = wrapper.find('[data-qa="word-frequency"]')
      const PostsVsTimeContainer = wrapper.find('[data-qa="posts-vs-time"]')
      expect(WordFrequencyContainer.findAll('circle').length).toBe(2)
      expect(PostsVsTimeContainer.findAll('circle').length).toBe(1)

      done()
    })
  })
})
