<template>
  <div class="loading-container">
    <h1>Loading{{ellipsis}}</h1>
    <div class="loading-icon">
      <circle8 size="100" />
    </div>
  </div>
</template>

<script>
import { Circle8 } from 'vue-loading-spinner'

export default {
  name: 'loading',
  data () {
    return {
      ellipsis: ''
    }
  },
  mounted () {
    this.interval = window.setInterval(() => {
      this.ellipsis = this.ellipsis === '...'
        ? ''
        : this.ellipsis + '.'
    }, 400)
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  components: {
    Circle8
  }
}
</script>

<style scoped>
  .loading-container {
    padding: 30px;
  }

  .loading-icon {
    margin: 50px 0;
  }
</style>
