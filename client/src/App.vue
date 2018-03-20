<template>
  <div id="app">
    <site-header />
    <router-view />
  </div>
</template>

<script>
import SiteHeader from '@/components/SiteHeader'

export default {
  name: 'App',
  components: { SiteHeader }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Open+Sans:400,700');

#app {
  font-family: 'Open Sans', 'Avenir', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
