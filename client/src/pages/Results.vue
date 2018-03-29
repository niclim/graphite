<template>
  <div>
    <h1>Results</h1>
    <p>{{$route.query.user}}</p>
    <word-frequency v-if="data" :data="data.comments"></word-frequency>
  </div>
</template>

<script>
import { fetchRedditUserData } from '../api'
import WordFrequency from '../components/WordFrequency'
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
    fetchResults: async function () {
      const { data } = await fetchRedditUserData(this.$route.query.user)
      this.data = data
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
    WordFrequency
  }
}
</script>

<style scoped>

</style>
