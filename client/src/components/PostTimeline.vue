<template>
  <div class="graph-container">
    <svg :width="outerWidth" :height="outerHeight">
      <g :transform="`translate(${padding}, ${padding})`">
        <g>
          <circle
            v-for="point in interpolatedPoints"
            :key="point.word"
            :r="point.r"
            :cx="point.cx"
            :cy="point.cy"
            @mouseover="showTooltip($event, point)"
            @mouseout="hideTooltip"
          />
        </g>
        <g :transform="`translate(0, ${height})`">
          <g
            v-axis="xAxis"
          />
          <text :transform="`translate(${width / 2 - 15}, 50)`">{{setting === 'days' ? 'Day (PST)' : 'Time (PST)'}}</text>
        </g>
        <g :transform="`translate(-10, 0)`">
          <g
            v-axis="yAxis"
          />
          <text :transform="`rotate(270 0 0)  translate(${-height / 2 - 50}, ${-50})`">Number of comments</text>
        </g>
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
import { axisBottom, axisLeft } from 'd3-axis'
import { select } from 'd3-selection'
import { timeMinute } from 'd3-time'
import { format } from 'd3-format'
import { interpolateObject } from 'd3-interpolate'
import { secInDay, 
  daysInWeek, 
  getDayFromTimestamp,
  timestampToHr
} from '../../../common/time'

export default {
  name: 'postTimeline',
  data () {
    return {
      tooltip: null,
      interpolate: 1, // starts at days
      transitionTarget: 1,
      transitionTime: 200,
      transitionStart: null
    }
  },
  // https://github.com/d3/d3-interpolate - use interpolations to create
  // use x and y to calculate based on interpolated value
  // variable to store current position
  computed: {
    dayXScale () {
      return scalePoint().domain(daysInWeek).range([0, this.width])
    },
    timeXScale () {
      return scaleLinear().domain([0, secInDay]).range([0, this.width])
    },
    yScale () {
      const maxComments = max(this.data, d => d.numComments)
      return scaleLog().domain([1, maxComments]).range([this.height, 0]).clamp(true)
    },
    xAxis () {
      return this.setting === 'days'
        ? this.dayXAxis
        : this.timeXAxis
    },
    dayXAxis () {
      return axisBottom().scale(this.dayXScale)
    },
    timeXAxis () {
      return axisBottom()
        .scale(this.timeXScale)
        .tickFormat(timestampToHr)
        .tickValues([0, 3, 6, 9, 12, 15, 18, 21, 24].map(d => d * 3600))
    },
    yAxis () {
      return axisLeft().scale(this.yScale).ticks(20, ",.1s")
    },
    points () {
      const maxKarma = max(this.data, d => d.score)
      const radiusScale = scaleLinear().domain([0, maxKarma]).range([3, 20])
      const points = this.data.map(d => ({
        r: radiusScale(d.score),
        timestamp: d.timestamp,
        cy: this.yScale(d.numComments),
        id: d.id,
        day: daysInWeek[(new Date(d.timestamp * 1000).getDay())],
        time: timestampToHr(d.timestamp % secInDay),
        score: d.score,
        comments: d.numComments
      }))

      return {
        days: points.map(d => ({
          ...d,
          cx: this.dayXScale(daysInWeek[(new Date(d.timestamp * 1000).getDay())])
        })),
        time: points.map(d => ({
          ...d,
          cx: this.timeXScale(d.timestamp % secInDay)
        }))
      }
      
    },
    interpolatedPoints () {
      return interpolateObject(this.points.time, this.points.days)(this.interpolate)
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
    },
    calculateInterpolate (timestamp) {
      // Assume that the transitions dont start until other transitions are completed
      if (!this.transitionStart) {
        this.transitionStart = timestamp
      }
      const progress = (timestamp - this.transitionStart) / this.transitionTime
      this.interpolate = 1 - (this.setting === 'days'
        ? Math.max(this.transitionTarget - progress, 0)
        : Math.min(progress, 1))

      if (progress < 1) {
        requestAnimationFrame(this.calculateInterpolate)
      } else {
        this.transitionStart = null
      }
    }
  },
  directives: {
    axis (el, binding) {
      select(el).call(binding.value)
    }
  },
  watch: {
    setting (newSetting, oldSetting) {
      // set transition target
      this.transitionTarget = newSetting === 'days' ? 1 : 0 
      requestAnimationFrame(this.calculateInterpolate)
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

text {
  font-weight: bold;
}
</style>
