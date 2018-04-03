<template>
  <header>
    <div class="header-sub-container left-container">
      <p id="logo-text">
        Graphite
      </p>
    </div>
    <div class="header-sub-container right-container">
      <ul class="link-list">
        <li v-for="route in navRoutes" :key="route.name">
          <router-link :to="route.path">
            {{route.name}}
          </router-link>
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
import routes from '../router/routes'

export default {
  name: 'siteHeader',
  data () {
    return {
      routes
    }
  },
  computed: {
    navRoutes () {
      const validRoutes = ['Home']
      return routes.filter(route => validRoutes.includes(route.name))
    }
  }
}
</script>

<style scoped>
header {
  background: #eee;
  width: 100%;
  height: 60px;
  box-shadow: 0 2px 4px -1px rgba(0,0,0,0.25);
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.header-sub-container {
  display: flex;
  align-items: center;
  padding: 10px 30px;
}

.left-container {

}

.right-container {

}

ul {
  list-style-type: none;
  display: flex;
  justify-content: space-around;
}

#logo-text {
  font-size: 20px;
  font-weight: 700;
}
</style>
