<template>
  <div>
    <h1>Enter a reddit username</h1>
    <form @submit="submit">
      <input type="text" v-model="input" />
      <button type="submit">Lets go!</button>
    </form>
    <p class="error" v-if="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      input: '',
      error: '',
      touched: false
    }
  },
  methods: {
    submit: function (e) {
      e.preventDefault()
      const validationMessage = this.validate(this.input)
      if (validationMessage) {
        this.error = validationMessage
        this.touched = true
      } else {
        this.$router.push(`/results?user=${this.input}`)
      }
    },
    validate: function (value) {
      let message = ''
      if (value === '') { message = 'Please enter a value' }
      return message
    }
  },
  watch: {
    input: function (newInput, oldInput) {
      this.error = this.validate(newInput)
      this.touched = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.error {
  color: #d0021b;
}
</style>
