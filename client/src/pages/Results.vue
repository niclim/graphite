<template>
  <div class="page">
    <h1>Results</h1>
    <p>User: {{$route.query.user}}</p>
    <transition name="fade" mode="out-in">
      <div v-if="loading" key="loading">
        <loading />
      </div>
      <div v-else-if="!error && data" key="main">
        <div>
          <h2>Word Frequency</h2>
          <word-frequency :data="data.comments" />
        </div>
        <div>
          <h2>Posts vs Time</h2>
          <div class="toggle-time">
            <span>24 Hours</span>
            <at-switch v-model="postDay" @change="changeToggle" />
            <span>Days in the week</span>
          </div>
          <post-timeline :data="data.comments" :setting="postDisplay" />
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
import { Switch as AtSwitch } from 'at-ui'
import WordFrequency from '../components/WordFrequency'
import PostTimeline from '../components/PostTimeline'
import Loading from '../components/Loading'
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
    AtSwitch
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
}

.toggle-time span:not(.at-switch) {
  width: 150px;
}

/* Overwrite component styling */
.toggle-time > .at-switch {
  border-color: #79A1EB;
  background-color: #79A1EB;
}
</style>
