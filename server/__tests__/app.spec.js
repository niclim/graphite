/* eslint-env jest */
const request = require('supertest')
const createApp = require('../app')
jest.mock('../utils/reddit')

// would be good to split this out into multiple files later lol
describe('app', () => {
  let app, server
  beforeAll((done) => {
    app = createApp()
    server = app.listen((err) => {
      if (err) { return done(err) }
      done()
    })
  })

  afterAll(() => {
    server.close()
  })

  describe('reddit api routes', () => {
    describe('/reddit/:user', () => {
      test('returns a users comments, subreddits, and trophies', done => {
        request(app)
          .get('/api/reddit/abcd')
          .set('content-type', 'application/json')
          .expect(200, (err, res) => {
            if (err) { return done(err) }
            expect(JSON.parse(res.text)).toMatchObject({
              comments: [],
              subreddits: [],
              trophies: []
            })
            done()
          })
      })

      test('returns a 404 if user is not found', async done => {
        request(app)
          .get('/api/reddit/cd')
          .set('content-type', 'application/json')
          .expect(404, (err, res) => {
            if (err) { return done(err) }
            done()
          })
      })
    })
  })
})
