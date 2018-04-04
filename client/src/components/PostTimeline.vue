<template>
  <div class="graph-container">
    <svg :width="outerWidth" :height="outerHeight">
      <g :transform="`translate(${padding}, ${padding})`">
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
        </g>
        <g
          :transform="`translate(0, ${height})`"
          v-axis="xAxis"
        />
      </g>
    </svg>
    <div v-if="tooltip" :style="`position: absolute; left: ${tooltip.x}px; top: ${tooltip.y}px;`" class="tooltip">
      <div>
        <p><strong>{{setting === 'days' ? 'Day' : 'Time'}}</strong></p>
        <p>{{setting === 'days' ? tooltip.day : tooltip.time}}</p>
      </div>
      <div>
        <p><strong>Karma</strong></p>
        <p>{{tooltip.score}}</p>
      </div>
      <div>
        <p><strong>Comments</strong></p>
        <p>{{tooltip.comments}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { scaleLinear, scalePoint, scaleLog } from 'd3-scale'
import { max } from 'd3-array'
import { axisBottom } from 'd3-axis'
import { select } from 'd3-selection'
import { timeMinute } from 'd3-time'
import { secInDay, 
  daysInWeek, 
  getDayFromTimestamp,
  timestampToHr
} from '../../../common/time'

export default {
  name: 'postTimeline',
  data () {
    return {
      tooltip: null
    }
  },
  computed: {
    xScale () {
      return this.setting === 'days'
        ? scalePoint().domain(daysInWeek).range([0, this.width])
        : scaleLinear().domain([0, secInDay]).range([0, this.width])
    },
    points () {
      const maxKarma = max(this.data, d => d.score)
      const maxComments = max(this.data, d => d.numComments)
      const yScale = scaleLog().domain([1, maxComments]).range([0, this.height]).clamp(true)
      const radiusScale = scaleLinear().domain([0, maxKarma]).range([3, 20])

      return this.data.map(d => ({
        r: radiusScale(d.score),
        cx: this.setting === 'days'
          ? this.xScale(daysInWeek[(new Date(d.timestamp * 1000).getDay())])
          : this.xScale(d.timestamp % secInDay),
        cy: this.height - yScale(d.numComments),
        id: d.id,
        day: daysInWeek[(new Date(d.timestamp * 1000).getDay())],
        time: timestampToHr(d.timestamp % secInDay),
        score: d.score,
        comments: d.numComments
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
        x: point.cx + this.padding + 2 * point.r + 5,
        y: point.cy + this.padding - 40,
        time: point.time,
        day: point.day,
        score: point.score,
        comments: point.comments
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
  props: ['data', 'width', 'height', 'padding', 'setting']
}
</script>

<style scoped>
.graph-container {
  position: relative;
}

.tooltip {
  display: flex;
  flex-direction: column;
  height: 80px;
  width: 200px;
  padding: 5px;
  background-color: #eee;
  border-radius: 5px;
}

.tooltip > div {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}
</style>
