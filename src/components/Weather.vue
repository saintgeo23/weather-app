<script>
import debounce from 'lodash.debounce'

import Box from './Box'
import Slider from './Slider'
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

export default {
  name: 'Weather',

  components: {
    Box,
    Slider
  },

  data () {
    return {
      pressure: PRESSURE_DEFAULT,
      temperature: TEMPERATURE_DEFAULT
    }
  },

  computed: {
    pressureSettings () {
      return PRESSURE_SETTINGS
    },
    temperatureSettings () {
      return TEMPERATURE_SETTINGS
    },
    chanceOfRain (amount) {
      const score = Math.log(amount + 1) * Math.log(this.pressure - PRESSURE_CONSTANT) * Math.log(this.temperature - TEMPERATURE_CONSTANT)
      const mean = Math.min(Math.max(score, 0), 100)
      const upperBound = Math.min(1.5 * mean, 100)
      const lowerBound = Math.max(0.5 * mean, 0)

      return [lowerBound, mean, upperBound]
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
      ApiService.getRainfallChart()
        .then(({ data }) => {
          console.log(data)
        })
        .catch(console.error)
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
}
</style>
