<template>
  <svg width="700" height="500">
    <g style="transform: translate(0, 10px)">
      <circle
        v-for="point in points"
        :key="point.word"
        :r="point.r"
        :cx="point.cx"
        :cy="point.cy"
        @mouseover="showTooltip($event, point)"
        @mouseout="hideTooltip"
      />
      <tooltip
        v-if="tooltip"
        :x="tooltip.x"
        :y="tooltip.y"
        :perpLength="50"
        :paraLength="30"
      >
        <text>{{tooltip.text}}</text>
      </tooltip>
    </g>
  </svg>
</template>

<script>
import { scaleLinear, scalePow } from 'd3-scale'
import Tooltip from './Tooltip'

export default {
  name: 'wordFrequency',
  data () {
    return {
      line: '',
      tooltip: null
    }
  },
  computed: {
    sortedWords () {
      const sortedWords = {}
      this.data.forEach(comment => {
        const words = comment.body.replace(/[^a-z\s]/gi, '').toLowerCase().trim().split(/\s+/g)
        words.forEach(word => {
          if (sortedWords[word]) {
            sortedWords[word]++
          } else {
            sortedWords[word] = 1
          }
        })
      })

      // Convert this object into a sorted array
      return Object.keys(sortedWords)
        .map(key => ({ word: key, count: sortedWords[key] }))
        .sort((a, b) => b.count - a.count)
    },
    points () {
      const sortedWords = this.sortedWords
      const yScale = scalePow().domain([0, sortedWords[0].count]).range([0, 500])
      const xScale = scaleLinear().domain([0, sortedWords.length]).range([10, 700])
      return sortedWords.map((d, i) => ({
        r: 3,
        cx: xScale(i),
        cy: 500 - yScale(d.count),
        word: d.word,
        count: d.count
      }))
    }
  },
  methods: {
    showTooltip (e, point) {
      this.tooltip = {
        x: point.cx,
        y: point.cy,
        text: `${point.word}: ${point.count}`
      }
    },
    hideTooltip () {
      this.tooltip = null
    }
  },
  props: ['data'],
  components: {
    Tooltip
  }
}
</script>

<style scoped>

</style>
