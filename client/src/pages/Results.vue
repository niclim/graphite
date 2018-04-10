<template>
  <div class="page">
    <transition name="fade" mode="out-in">
      <div v-if="loading" key="loading">
        <loading />
      </div>
      <div v-else-if="!error && data" key="main">
        <h1>Results</h1>
        <p>User: {{$route.query.user}}</p>
        <div class="information-container">
          <div class="summary">
            <card :width="cardWidth">
              <h4 slot="title">Active subreddits</h4>
              <card-item
                v-if="data.subreddits.length > 0"
                v-for="sub in data.subreddits"
                :key="sub.name"
                :icon="sub.icon_img || '/img/snoo.png'"
                :link="`https://www.reddit.com${sub.url}`"
                :text="sub.url"
              >
                <div class="card-item-info">
                  <p class="small">{{sub.comment_karma}} comment karma</p>
                  <p class="small">{{sub.link_karma}} link karma</p>
                </div>
              </card-item>
              <div v-if="data.subreddits.length === 0" class="no-results">
                No active subreddits :(
              </div>
            </card>
            <card :width="cardWidth">
              <h4 slot="title">Trophies</h4>
              <card-item
                v-if="data.trophies.length > 0"
                v-for="trophy in data.trophies"
                :key="trophy.name"
                :icon="trophy.icon_40"
                :link="null"
              >
                <p>{{trophy.name}}</p>
              </card-item>
              <card-item
                v-if="data.trophies && data.trophies.length > 0"
                :bottom="true"
                :noIcon="true"
                :itemFull="true"
              >
                <p><a href="https://www.reddit.com/wiki/awards" target="_blank">What other trophies are there?</a></p>
              </card-item>
              <div v-if="data.trophies.length === 0" class="no-results">
                No trophies :(
              </div>
            </card>
          </div>
          <div class="graphs" v-if="data.comments.length > 0">
            <div>
              <h2 class="graph-header">Word Frequency</h2>
              <p class="small">(from the top 125 posts)</p>
              <word-frequency
                v-if="graphWidth && graphHeight"
                :data="data.comments"
                :width="graphWidth"
                :height="graphHeight"
                :paddingTB="graphPaddingTB"
                :paddingLR="graphPaddingLR"
              />
            </div>
            <div>
              <h2 class="graph-header">Posts vs Time</h2>
              <p class="small">(from the top 125 posts)</p>
              <div class="toggle-time">
                <span>24 Hours</span>
                <at-switch v-model="postDay" @change="changeToggle" />
                <span>Days in the week</span>
              </div>
              <post-timeline
                v-if="graphWidth && graphHeight"
                :data="data.comments"
                :setting="postDisplay"
                :width="graphWidth"
                :height="graphHeight"
                :paddingTB="graphPaddingTB"
                :paddingLR="graphPaddingLR"
              />
            </div>
          </div>
          <div class="no-posts" v-else>
            <p>Looks like this user hasn't posted anything - nothing to see here</p>
          </div>
        </div>
      </div>
      <div v-else key="error">
        <error :message="error" />
      </div>
    </transition>
  </div>
</template>

<script>
import { fetchRedditUserData } from '../api'
import { Switch as AtSwitch, Card as AtCard } from 'at-ui'
import WordFrequency from '../components/WordFrequency'
import PostTimeline from '../components/PostTimeline'
import Loading from '../components/Loading'
import Error from '../components/Error'
import Card from '../components/Card'
import CardItem from '../components/CardItem'
import { debounce } from '../../../common/functional'

export default {
  name: 'results',
  mounted () {
    if (this.$route.query.user) {
      this.fetchResults()
    } else {
      this.error = `${this.$route.query.user} not found!`
    }
    this.resizer = debounce(this.recalculateDimesions, 100)
    window.addEventListener('resize', this.resizer)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizer)
  },
  data () {
    return {
      loading: true,
      data: null,
      error: null,
      postDay: true,
      cardWidth: this.getScreenSize() > 400 ? 350 : 300,
      graphWidth: this.getScreenSize() > 768 ? 700 : this.calculateGraphDimensions().width,
      graphHeight: this.getScreenSize() > 768 ? 500 : this.calculateGraphDimensions().height,
      graphPaddingTB: 60,
      graphPaddingLR: 100
    }
  },
  computed: {
    postDisplay () {
      return this.postDay ? 'days' : 'time'
    }
  },
  methods: {
    async fetchResults () {
      try {
        const { data } = await fetchRedditUserData(this.$route.query.user)
        this.loading = false
        if (data.error) {
          this.error = data.error
        } else {
          this.data = data
        }
      } catch (e) {
        this.loading = false
        this.error = 'Something went wrong, please try again later'
      }
    },
    changeToggle () {
      // This component doesn't handle v-model correctly?
      this.postDay = !this.postDay
    },
    getScreenSize () {
      return window.innerWidth
    },
    calculateGraphDimensions () {
      const width = window.innerWidth - 100 - 50
      return {
        width,
        height: width * (5 / 7)
      }
    },
    recalculateDimesions () {
      const innerWidth = this.getScreenSize()
      this.cardWidth = innerWidth > 400 ? 350 : 300
      const { width, height } = innerWidth > 768 ? { width: 700, height: 500 } : this.calculateGraphDimensions()
      this.graphWidth = width
      this.graphHeight = height
    }
  },
  watch: {
    $route (newRoute, oldRoute) {
      // We probably should check the route to see if only the query parameter changed
      this.loading = true
      this.fetchResults()
    }
  },
  components: {
    WordFrequency,
    PostTimeline,
    Loading,
    Error,
    AtSwitch,
    Card,
    CardItem
  }
}
</script>

<style scoped>
.page {
  padding-bottom: 200px;
  width: 100%;
}

.information-container {
  width: 100%;
  max-width: 900px;
  margin: auto;
}

.toggle-time {
  display: flex;
  justify-content: center;
  margin: 10px;
}

.no-results {
  margin: auto;
}

.toggle-time span:not(.at-switch) {
  width: 150px;
}

.summary {
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
}

.information-container {
  padding: 20px 10px;
}

.no-posts {
  padding: 30px;
}

.graphs > div {
  padding-top: 30px;
}

.graph-header {
  font-size: 30px;
}

/* Overwrite component styling */
.toggle-time > .at-switch {
  border-color: #79A1EB;
  background-color: #79A1EB;
}
</style>
