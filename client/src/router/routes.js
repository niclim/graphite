import Home from '@/pages/Home'
import Results from '@/pages/Results'
import PageNotFound from '@/pages/PageNotFound'

export default [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/results',
    name: 'Results',
    component: Results
  },
  {
    path: '*',
    name: 'PageNotFound',
    component: PageNotFound
  }
]
