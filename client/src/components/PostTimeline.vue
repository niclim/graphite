<template>
  <svg width="700" height="650">
    <g style="transform: translate(10px, 10px)">
      <g>
        <circle
          v-for="point in points"
          :key="point.word"
          :r="point.r"
          :cx="point.cx"
          :cy="point.cy"
        />
      </g>
      <g
        style="transform: translate(0, 500px)"
        v-axis="xAxis"
      />
    </g>
  </svg>
</template>

<script>
import { scaleLinear, scalePoint } from 'd3-scale'
import { max } from 'd3-array'
import { axisBottom } from 'd3-axis'
import { select } from 'd3-selection'
import { timeMinute } from 'd3-time'
const secInDay = 86400
const daysInWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const getDayFromTimestamp = timestamp => (new Date(timestamp * 1000).getDay() + 6) % 7
const timestampToHr = t => {
  const hrs = Math.floor(t / (secInDay / 24))
  let min = Math.floor((t % 3600) / 60)
  if (min < 10) { min = `${min}0` }
  return `${hrs}:${min}`
}

export default {
  name: 'postTimeline',
  data () {
    return {
      setting: 'time'
    }
  },
  computed: {
    xScale () {
      return this.setting === 'days'
        ? scalePoint().domain(daysInWeek).range([0, 650])
        : scaleLinear().domain([0, secInDay]).range([0, 650])
    },
    points () {
      const maxKarma = max(this.data, d => d.score)
      const maxComments = max(this.data, d => d.numComments)
      const yScale = scaleLinear().domain([0, maxComments]).range([0, 490])
      const radiusScale = scaleLinear().domain([0, maxKarma]).range([3, 20])

      return this.data.map(d => ({
        r: radiusScale(d.score),
        cx: this.setting === 'days'
          ? this.xScale(daysInWeek[(new Date(d.timestamp * 1000).getDay())])
          : this.xScale(d.timestamp % secInDay),
        cy: 490 - yScale(d.numComments),
        id: d.id
      }))
    },
    xAxis () {
      return this.setting === 'days'
        ? axisBottom()
          .scale(this.xScale)
        : axisBottom()
          .scale(this.xScale)
          .tickFormat(timestampToHr)
          .tickValues([0, 3, 6, 9, 12, 15, 18, 21, 24].map(d => d * 3600))
    }
  },
  directives: {
    axis (el, binding) {
      select(el).call(binding.value)
    }
  },
  props: ['data']
}
</script>

<style scoped>

</style>
