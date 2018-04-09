<template>
  <div class="graph-container">
    <svg :width="outerWidth" :height="outerHeight">
      <g :transform="`translate(${paddingLR}, ${paddingTB})`">
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
      return axisLeft().scale(this.yScale).ticks(this.width > 400 ? 20 : 10, ",.1s")
    },
    radiusRange () {
      // ranges of width is 320 -> 700
      // we want to map this to 10 -> 20
      const r1 = (this.width - 320)/(700 - 320) * (20 - 10) + 10
      return [3, r1]
    },
    points () {
      const maxKarma = max(this.data, d => d.score)
      const radiusScale = scaleLinear().domain([0, maxKarma]).range(this.radiusRange)
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
      return this.paddingLR * 2 + this.width
    },
    outerHeight () {
      return this.paddingTB * 2 + this.height
    }
  },
  methods: {
    showTooltip (e, point) {
      const maxXPos = window.innerWidth - e.relatedTarget.getBoundingClientRect().left
      const calcX = point => point.cx + this.paddingLR + 2 * point.r + 5
      const calcXInvert = point => point.cx + this.paddingLR - 220

      // width is 200px and 10px padding (10px buffer)
      const x = maxXPos > (calcX(point) + 200 + 20)
        ? calcX(point)
        : calcXInvert(point)

      this.tooltip = {
        x,
        y: point.cy + this.paddingTB - 40,
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
      const selection = select(el).call(binding.value)
      if (window.innerWidth < 500 && binding.expression === 'xAxis') {
        selection
          .selectAll('text')
          .attr('dx', '-22px')
          .attr('dy', '6px')
          .attr('transform', 'rotate(-35)')
      } else {
        selection
          .selectAll('text')
          .attr('dx', '')
          .attr('dy', '0.71em')
          .attr('transform', '')
      }
    }
  },
  watch: {
    setting (newSetting, oldSetting) {
      // set transition target
      this.transitionTarget = newSetting === 'days' ? 1 : 0 
      requestAnimationFrame(this.calculateInterpolate)
    }
  },
  props: ['data', 'width', 'height', 'paddingTB', 'paddingLR', 'setting']
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
