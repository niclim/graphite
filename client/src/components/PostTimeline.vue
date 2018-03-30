<template>
  <svg width="700" height="550">
    <g style="transform: translate(0, 10px)">
      <circle
        v-for="point in points"
        :key="point.word"
        :r="point.r"
        :cx="point.cx"
        :cy="point.cy"
      />
    </g>
  </svg>
</template>

<script>
import { scaleLinear, scalePow } from 'd3-scale'
import { max } from 'd3-array'
export default {
  name: 'postTimeline',
  data () {
    return {
      points: [],
      setting: 'time'
    }
  },
  mounted () {
    this.calculatePoints()
  },
  methods: {
    calculatePoints () {
      const secInDay = 86400
      const maxKarma = max(this.data, d => d.score)
      const maxComments = max(this.data, d => d.numComments)
      const yScale = scaleLinear().domain([0, maxComments]).range([0, 490])
      const xScale = this.setting === 'days'
        ? scaleLinear().domain([1, 7]).range([0, 690])
        : scaleLinear().domain([0, secInDay]).range([0, 690])
      const radiusScale = scaleLinear().domain([0, maxKarma]).range([3, 20])

      this.points = this.data.map(d => ({
        r: radiusScale(d.score),
        cx: this.setting === 'days'
          ? xScale(new Date(d.timestamp * 1000).getDay())
          : xScale(d.timestamp % secInDay),
        cy: 490 - yScale(d.numComments),
        id: d.id
      }))
    }
  },
  watch: {
    data (newVal, oldVal) {
      this.calculatePoints()
    }
  },
  props: ['data']
}
</script>

<style scoped>

</style>
