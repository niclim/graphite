/* eslint-env jest */
import { mount } from '@vue/test-utils'
import Home from './Home'

describe('Home', () => {
  let wrapper, routerMock

  beforeEach(() => {
    routerMock = {
      push: jest.fn()
    }
    wrapper = mount(Home, {
      mocks: {
        $router: routerMock
      }
    })
  })

  describe('reddit username form', () => {
    test('sends a redirects to `/results?user=[username]`', () => {
      const userName = 'valid_redditname'
      const redditForm = wrapper.find('[data-testid="reddit-username"]')
      const input = redditForm.find('input')
      const form = redditForm.find('form')
      input.setValue(userName)
      form.trigger('submit')

      expect(routerMock.push.mock.calls.length).toBe(1)
      expect(routerMock.push.mock.calls[0][0]).toBe(`/results?user=${userName}`)
    })

    test('displays a validation error if not a valid reddit username', () => {
      const userName = 'invalid_!!3rfsc)%#redditname'
      const redditForm = wrapper.find('[data-testid="reddit-username"]')
      const input = redditForm.find('input')
      const form = redditForm.find('form')
      input.setValue(userName)
      form.trigger('submit')

      expect(routerMock.push.mock.calls.length).toBe(0)
      expect(redditForm.find('.error').exists()).toBe(true)
    })
  })
})
