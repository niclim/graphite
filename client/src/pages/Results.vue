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
            <card :width="350">
              <h4 slot="title">Active subreddits</h4>
              <div class="card-content" v-if="data.subreddits.length > 0">
                <card-item
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
              </div>  
              <div v-else>
                No active subreddits :(
              </div>
            </card>
            <card :width="350">
              <h4 slot="title">Trophies</h4>
              <div class="card-content" v-if="data.trophies && data.trophies.length > 0">
                <card-item
                  v-for="trophy in data.trophies"
                  :key="trophy.name"
                  :icon="trophy.icon_40"
                  :link="null"
                >
                  <p>{{trophy.name}}</p>
                </card-item>
                <card-item :bottom="true" :noIcon="true">
                  <p>Link to thing</p>
                </card-item>
              </div>
              <div v-else>
                No trophies :(
              </div>
            </card>
          </div>
          <div class="graphs">
            <div>
              <h2 class="graph-header">Word Frequency</h2>
              <p class="small">(from the top 125 posts)</p>
              <word-frequency
                :data="data.comments"
                :width="700"
                :height="500"
                :paddingTB="50"
                :paddingLR="100"
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
                :data="data.comments"
                :setting="postDisplay"
                :width="700"
                :height="450"
                :paddingTB="60"
                :paddingLR="100"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-else key="error">
        place error component here
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
import Card from '../components/Card'
import CardItem from '../components/CardItem'
// This needs to handle error routing and stuff
export default {
  name: 'results',
  mounted () {
    if (this.$route.query.user) {
      this.fetchResults()
    } else {
      this.error = 'No user found'
    }
  },
  data () {
    return {
      loading: true,
      data: null,
      error: null,
      postDay: true
    }
  },
  computed: {
    postDisplay () {
      return this.postDay ? 'days' : 'time'
    }
  },
  methods: {
    async fetchResults () {
      const { data } = await fetchRedditUserData(this.$route.query.user)
      this.data = data

      this.loading = false
    },
    changeToggle () {
      // This component doesn't handle v-model correctly?
      this.postDay = !this.postDay
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
    AtSwitch,
    Card,
    CardItem
  }
}
</script>

<style scoped>
.page {
  padding-bottom: 200px;
}

.toggle-time {
  display: flex;
  justify-content: center;
  margin: 10px;
}

.toggle-time span:not(.at-switch) {
  width: 150px;
}

.summary {
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.information-container {
  padding: 20px 10px;
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

.card-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>
