<template>
  <div class="graph-container">
    <svg :width="outerWidth" :height="outerHeight">
      <g :transform="`translate(${padding}, ${padding})`">
        <circle
          v-for="point in points"
          :key="point.word"
          :r="point.r"
          :cx="point.cx"
          :cy="point.cy"
          @mouseover="showTooltip($event, point)"
          @mouseout="hideTooltip"
        />
      </g>
    </svg>
    <div v-if="tooltip" :style="`position: absolute; left: ${tooltip.x}px; top: ${tooltip.y}px;`" class="tooltip">
      <p>{{tooltip.text}}</p>
    </div>
  </div>
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
      const yScale = scalePow().domain([0, sortedWords[0].count]).range([0, this.height])
      const xScale = scaleLinear().domain([0, sortedWords.length]).range([0, this.width])
      return sortedWords.map((d, i) => ({
        r: 3,
        cx: xScale(i),
        cy: this.height - yScale(d.count),
        word: d.word,
        count: d.count
      }))
    },
    outerWidth () {
      return this.padding * 2 + this.width
    },
    outerHeight () {
      return this.padding * 2 + this.height
    }
  },
  methods: {
    showTooltip (e, point) {
      this.tooltip = {
        x: point.cx + this.padding + 10,
        y: point.cy + this.padding - 15,
        text: `${point.word}: ${point.count}`
      }
    },
    hideTooltip () {
      this.tooltip = null
    }
  },
  props: ['data', 'width', 'height', 'padding']
}
</script>

<style scoped>
.graph-container {
  position: relative;
}

.tooltip {
  background-color: #eee;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  border-radius: 5px;
}
</style>
