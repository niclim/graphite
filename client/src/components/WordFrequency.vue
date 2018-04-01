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
      <text v-if="tooltip" :x="tooltip.x" :y="tooltip.y">
        {{tooltip.text}}
      </text>
    </g>
  </svg>
</template>

<script>
import { scaleLinear, scalePow } from 'd3-scale'

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
        x: point.cx + 20,
        y: point.cy + 20,
        text: `${point.word}: ${point.count}`
      }
    },
    hideTooltip () {
      this.tooltip = null
    }
  },
  props: ['data']
}
</script>

<style scoped>

</style>
