<template>
  <svg width="700" height="500">
    <g>
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
      points: [],
      tooltip: null
    }
  },
  mounted () {
    this.calculatePoints()
  },
  methods: {
    calculatePoints () {
      const sortedWords = this.countWords()
      const yScale = scalePow().domain([0, sortedWords[0].count]).range([0, 500])
      const xScale = scaleLinear().domain([0, sortedWords.length]).range([10, 700])
      this.points = sortedWords.map((d, i) => ({
        r: 3,
        cx: xScale(i),
        cy: 510 - yScale(d.count),
        word: d.word,
        count: d.count
      }))
    },
    countWords () {
      // Count words and store in an object
      const wordCount = {}
      this.data.forEach(comment => {
        const words = comment.body.replace(/[^a-z\s]/gi, '').toLowerCase().trim().split(/\s+/g)
        words.forEach(word => {
          if (wordCount[word]) {
            wordCount[word]++
          } else {
            wordCount[word] = 1
          }
        })
      })

      // Convert this object into a sorted array
      return Object.keys(wordCount)
        .map(key => ({ word: key, count: wordCount[key] }))
        .sort((a, b) => b.count - a.count)
    },
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
