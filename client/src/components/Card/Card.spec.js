/* eslint-env jest */
import { mount } from '@vue/test-utils'
import Card from './Card'

describe('Card', () => {
  test('renders', () => {
    const wrapper = mount(Card)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
