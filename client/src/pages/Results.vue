<template>
  <div class="page-container">
    <h1>Results</h1>
    <p>{{$route.query.user}}</p>
    <word-frequency v-if="data" :data="data.comments"></word-frequency>
    <post-timeline v-if="data" :data="data.comments"></post-timeline>
  </div>
</template>

<script>
import { fetchRedditUserData } from '../api'
import WordFrequency from '../components/WordFrequency'
import PostTimeline from '../components/PostTimeline'
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
      error: null
    }
  },
  methods: {
    async fetchResults () {
      const { data } = await fetchRedditUserData(this.$route.query.user)
      this.data = data
      console.log(data)
      this.loading = false
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
    PostTimeline
  }
}
</script>

<style scoped>
  .page-container {
    padding-bottom: 150px;
  }
</style>
