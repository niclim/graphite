<template>
  <div class="card" :style="`${width ? `width: ${width};` : ''}`">
    <at-card :no-hover="true" :bodyStyle="{ flexGrow: 1, display: 'flex', flexDirection: 'column' }">
      <slot name="title" slot="title"></slot>
      <slot></slot>
    </at-card>
  </div>
</template>

<script>
import { Card as AtCard } from 'at-ui'

export default {
  name: 'card',
  components: {
    AtCard
  },
  props: {
    width: {
      type: Number
    }
  }
}
</script>

<style scoped>
.at-card {
  box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
