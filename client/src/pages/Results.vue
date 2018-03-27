<template>
  <div>
    <h1>Results</h1>
    <p>{{this.$route.query.user}}</p>
  </div>
</template>

<script>
import axios from 'axios'
// This needs to handle error routing and stuff
export default {
  name: 'results',
  mounted: function() {
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
    fetchResults: async function() {
      // pull this out into an apis file
      const data = await axios.get(`/api/${this.$route.query.user}`)
      this.data = data
      this.loading = false
    }
  },
  watch: {
    $route: function (newRoute, oldRoute) {
      // We probably should check the route to see if only the query parameter changed
      this.loading = true
      this.fetchResults()
    }
  }
}
</script>

<style scoped>

</style>
