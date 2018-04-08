<template>
  <div :class="`card-item ${bottom ? 'bottom' : ''}`">
    <div class="card-item-icon" v-if="!noIcon">
      <a :href="link" target="_blank" v-if="link">
        <div>
          <img
            :src="icon"
            :alt="text"
            width="40"
            height="40"
          />
        </div>
        <div v-if="text">
          <p class="small">{{text}}</p>
        </div>
      </a>
      <div v-else>
        <img
          :src="icon"
          :alt="text"
          width="40"
          height="40"
        />
      </div>
      <div v-if="text">
        <p class="small">{{text}}</p>
      </div>
    </div>
    <div class="card-item-info">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cardItem',
  props: ['icon', 'link', 'text', 'noIcon', 'bottom']
}
</script>

<style scoped>
.card-item {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 10px 0;
}

.card-item.bottom {
  margin-top: auto;
}

.card-item > div {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.card-item-icon {
  width: 150px;
}

.card-item-info {
  width: 120px;
}
</style>
