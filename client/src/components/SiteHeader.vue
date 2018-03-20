<template>
  <div>
    <ul class="link-list">
      <li v-for="route in routes" :key="route.name">
        {{route.name}}
      </li>
    </ul>
  </div>
</template>

<script>
import routes from '../router/routes'

export default {
  name: 'siteHeader',
  data () {
    return {
      routes
    }
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
  display: flex;
  justify-content: space-around;
}

li {

}
</style>
