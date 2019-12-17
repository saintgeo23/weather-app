<script>
import debounce from 'lodash.debounce'

import Box from './Box'
import Slider from './Slider'
import Bar from './Bar'
import ApiService from '../services/ApiService'

const PRESSURE_SETTINGS = {
  min: 970,
  max: 1030,
  step: 1
}
const TEMPERATURE_SETTINGS = {
  min: 10,
  max: 35,
  step: 1
}

const PRESSURE_DEFAULT = 1010
const PRESSURE_CONSTANT = 929
const TEMPERATURE_DEFAULT = 15
const TEMPERATURE_CONSTANT = 9

const DEBOUNCE_DELAY = 200

const MAIN_COLOR = '#181ED9'

export default {
  name: 'Weather',

  components: {
    Box,
    Slider,
    Bar
  },

  data () {
    return {
      pressure: PRESSURE_DEFAULT,
      temperature: TEMPERATURE_DEFAULT,
      rainfallChartData: null,
      isLoading: false
    }
  },

  computed: {
    pressureSettings () {
      return PRESSURE_SETTINGS
    },
    temperatureSettings () {
      return TEMPERATURE_SETTINGS
    }
  },

  watch: {
    pressure: debounce(function () {
      this.getRainfallChart()
    }, DEBOUNCE_DELAY),
    temperature: debounce(function () {
      this.getRainfallChart()
    }, DEBOUNCE_DELAY)
  },

  beforeMount () {
    this.getRainfallChart()
  },

  methods: {
    getRainfallChart () {
      this.isLoading = true

      ApiService.getRainfallChart()
        .then(({ data }) => {
          this.combineRainfallChartData(data[0])
          this.getChanceOfRain()
          this.isLoading = false
        })
        .catch((err) => {
          console.error(err)
          this.isLoading = false
        })
    },
    combineRainfallChartData (data) {
      if (!data) return

      const arr = data.days || []

      const labels = arr.map(item => item.day)
      const dataArray = arr.map(item => item.amount)

      const rainfallChartData = {
        header: data.request || '',
        bgColor: MAIN_COLOR,
        labels,
        dataArray
      }

      this.rainfallChartData = rainfallChartData
    },
    getChanceOfRain () {
      this.countRainChances()
    },
    countRainChances (amount = 0) {
      const score = Math.log(amount + 1) * Math.log(this.pressure - PRESSURE_CONSTANT) * Math.log(this.temperature - TEMPERATURE_CONSTANT)
      const mean = Math.min(Math.max(score, 0), 100)
      const upperBound = Math.min(1.5 * mean, 100)
      const lowerBound = Math.max(0.5 * mean, 0)

      return [lowerBound, mean, upperBound]
    }
  }
}
</script>

<template>
  <div class="weather">
    <div class="weather__container">
      <div class="weather__item">
        <Box
          class="weather__box"
          header="Pressure, hPa"
          :value="`${pressure}`"
        >
          <Slider
            class="weather__slider"
            v-bind="pressureSettings"
            v-model="pressure"
          />
        </Box>
      </div>

      <div class="weather__item">
        <div class="weather__stub" v-if="isLoading">Loading</div>
        <Box
          class="weather__box"
          v-else-if="rainfallChartData"
          :header="rainfallChartData.header"
        >
          <Bar :bar-data="rainfallChartData" />
        </Box>
        <div class="weather__stub" v-else>No data is available</div>
      </div>

      <div class="weather__item">
        <Box
          class="weather__box"
          header="Temperature, °С"
          :value="`${temperature}`"
        >
          <Slider
            class="weather__slider"
            v-bind="temperatureSettings"
            v-model="temperature"
          />
        </Box>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.weather {
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  overflow: hidden;

  &__container {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
  }

  &__item {
    box-sizing: border-box;
    flex: 0 0 50%;
    width: 50%;
    max-height: 200px;
    padding: 12px;
  }
}
</style>
