<template>
  <div class="graph-container">
    <svg :width="outerWidth" :height="outerHeight">
      <g :transform="`translate(${paddingLR}, ${paddingTB})`">
        <circle
          v-for="point in points"
          :key="point.word"
          :r="point.r"
          :cx="point.cx"
          :cy="point.cy"
          @mouseover="showTooltip($event, point)"
          @mouseout="hideTooltip"
        />
        <g :transform="`translate(0, ${height})`">
          <path :d="`M -10 0.5 l ${width + 10} 0`" style="stroke: black;"/>
          <text :transform="`translate(${width / 2 - 15}, 30)`">Words</text>
        </g>
        <g :transform="`translate(-10, 0)`">
          <g
            v-axis="yAxis"
          />
          <text :transform="`rotate(270 0 0)  translate(${-height / 2 - 50}, ${-50})`">Frequency</text>
        </g>
      </g>
    </svg>
    <div v-if="tooltip" :style="`position: absolute; ${tooltip.invert ? 'right' : 'left'}: ${tooltip.x}px; top: ${tooltip.y}px;`" class="tooltip">
      <p>{{tooltip.text}}</p>
    </div>
  </div>
</template>

<script>
import { scaleLinear, scalePow } from 'd3-scale'
import { select } from 'd3-selection'
import { axisBottom, axisLeft } from 'd3-axis'

export default {
  name: 'wordFrequency',
  data () {
    return {
      line: '',
      tooltip: null
    }
  },
  computed: {
    xScale () {
      return scaleLinear().domain([0, this.sortedWords.length]).range([0, this.width])
    },
    yScale () {
      return scalePow().domain([0, this.sortedWords[0].count]).range([this.height, 0])
    },
    xAxis () {
      return axisBottom().scale(this.xScale).ticks(0)
    },
    yAxis () {
      return axisLeft().scale(this.yScale)
    },
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
      return this.sortedWords.map((d, i) => ({
        r: 3,
        cx: this.xScale(i),
        cy: this.yScale(d.count),
        word: d.word,
        count: d.count
      }))
    },
    outerWidth () {
      return this.paddingLR * 2 + this.width
    },
    outerHeight () {
      return this.paddingTB * 2 + this.height
    }
  },
  methods: {
    showTooltip (e, point) {
      const element = e.srcElement.nearestViewportElement
      const maxXPos = window.innerWidth - element.getBoundingClientRect().left
      const calcX = point => point.cx + this.paddingLR + 10
      // width is 100px and 5px padding (5px buffer)
      const invert = maxXPos < (calcX(point) + 100 + 10)

      this.tooltip = {
        x: invert ? (window.innerWidth - point.cx) : calcX(point),
        y: point.cy + this.paddingTB - 15,
        text: `${point.word}: ${point.count}`,
        invert
      }
    },
    hideTooltip () {
      this.tooltip = null
    }
  },
  directives: {
    axis (el, binding) {
      select(el).call(binding.value)
    }
  },
  props: ['data', 'width', 'height', 'paddingLR', 'paddingTB']
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

text {
  font-weight: bold;
}
</style>
