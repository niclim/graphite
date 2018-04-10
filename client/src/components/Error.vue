<template>
  <div class="error-container">
    <h1>Oops, there was an error</h1>
    <p>{{message}}</p>
  </div>
</template>

<script>
export default {
  name: 'error',
  props: {
    message: {
      type: String,
      default: 'Something went wrong, please try again later'
    }
  }
}
</script>

<style scoped>
  .error-container {
    padding: 30px;
  }
</style>
