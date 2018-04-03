<template>
  <g>
    <path :d="path" class="hover-tip" :transform="`rotate(${rotation} ${x},${y})`"/>
    <g :transform="`translate(${contentPosition.x},${contentPosition.y})`">
      <slot>
        <text>Default hover tooltip</text>
      </slot>
    </g>
  </g>
</template>

<script>
export default {
  name: 'tooltip',
  props: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    perpLength: {
      type: Number,
      required: true
    },
    paraLength: {
      type: Number,
      required: true
    },
    direction: {
      default: 'right',
      validator (value) {
        return ['up', 'left', 'right', 'down'].includes(value)
      }
    },
    space: {
      type: Number,
      default: 10
    }
  },
  computed: {
    contentPosition () {
      let cx, cy
      const { perpLength, paraLength, direction, x, y, space } = this
      const padding = 5
      const textSize = 11
      const dv = space + perpLength / 10 + padding // dimension difference from data point
      // there is a better mathematical way to do this - but my brain isn't working
      if (direction === 'up' || direction === 'down') {
        cx = x - (paraLength / 2 - padding)
        cy = direction === 'up'
          ? y - dv
          : y + dv
      } else {
        cy = y -  (paraLength / 2 - padding)
        cx = direction === 'left'
          ? x - dv
          : x + dv
      }

      return { x: cx, y: cy + textSize }
    },
    path () {
      const { perpLength, paraLength, startingPoint } = this
      return `M ${startingPoint} l ${perpLength/10} ${paraLength/10} l 0 ${paraLength*4/10} l ${perpLength} 0 l 0 ${-paraLength} l ${-perpLength} 0 l 0 ${paraLength*4/10} l ${-perpLength/10} ${paraLength/10} z`
    },
    _direction () {
      let x, y
      switch (this.direction) {
        case 'down':
          x = 0
          y = 1
          break
        case 'up':
          x = 0
          y = -1
          break
        case 'left':
          x = -1
          y = 0
          break
        case 'right':
          x = 1
          y = 0
          break
      }
      return { x, y }
    },
    startingPoint () {
      return `${this.x + this.space * this._direction.x} ${this.y + this.space * this._direction.y}`
    },
    rotation () {
      let rotation = 0
      switch (this.direction) {
        case 'down':
          rotation = 90
          break
        case 'left':
          rotation = 180
          break
        case 'up':
          rotation = 270
          break
        case 'right':
          rotation = 0
      }
      return rotation
    }
  }
}
</script>

<style scoped>
  .hover-tip {
    fill: #eee;
  }
</style>
