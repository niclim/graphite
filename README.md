# graphite
Graphs word data from reddit built using Vue.js, d3 and express. See the live site [here](https://graph-ite.tk/)

## Building 

### starting a local environment

In the root directory of the project type
```
yarn install
```
This will install server dependencies and will install the frontend build dependencies in the client folder

then to run a local instance you can run the server and webpack to compile assets from the root directory of the project.
```
server:
yarn run server:dev

client/webpack:
yarn run build:dev
```

### Building for production

```
yarn install
```

Then type

```
yarn start
```

## Testing

Server code:
```
yarn run test:server
```

Client code:
```
yarn run test:client
```

Both
```
yarn run test
```

## Current features
Reads data from:
- Reddit users
  - Graphs most used words in a frequency chart
  - Graphs posts on a time scale (24 hrs or by day) with comments on thread

## Future features
- To add tests
- Add reading subreddits information
- Reddit posts analyze
  - top comments
    - are they the first level down
    - how much does the parent have
    - length of the comment
    - common-ness of the word or some other word analysis
- Integrate other platforms to read word information (twitter, yelp, etc.)
- Add "users" or common grouping to store this information
- Add in any data analysis techniques
