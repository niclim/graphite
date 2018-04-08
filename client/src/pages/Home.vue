<template>
  <div class="page">
    <div class="reddit-container">
      <div>
        <img src="/img/reddit.png" alt="reddit logo" class="reddit-logo" />
      </div>
      <div class="form-container">
        <h1>Enter a reddit username</h1>
        <form @submit="submit">
          <at-input type="text" v-model="input" @blur="blur" />
          <at-button nativeType="submit">Lets go!</at-button>
        </form>
        <p class="error" v-if="touched && error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Input as AtInput, Button as AtButton } from 'at-ui'
import { validateRedditUser } from '../../../common/validators'

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
    submit (e) {
      e.preventDefault()
      const validationMessage = this.validate(this.input)
      if (validationMessage) {
        this.error = validationMessage
        this.touched = true
      } else {
        this.$router.push(`/results?user=${this.input}`)
      }
    },
    validate (value) {
      let message = ''
      if (!validateRedditUser(value)) { message = 'Please enter a valid reddit username (3-20 characters alphanumeric, - or _ )' }
      if (value === '') { message = 'Please enter a value' }
      return message
    },
    blur (e) {
      this.error = this.validate(this.input)
      this.touched = true
    }
  },
  watch: {
    input (newInput, oldInput) {
      this.error = this.validate(newInput)
    }
  },
  components: {
    AtInput,
    AtButton
  }
}
</script>

<style scoped>
.page {
  padding-bottom: 200px;
}

.reddit-container {
  display: flex;
  width: 700px;
}

.reddit-logo {
  width: 100px;
  height: auto;
}

.form-container {
  display: flex;
  margin: auto;
  justify-content: center;
  flex-direction: column;
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
