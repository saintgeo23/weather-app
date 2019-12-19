<script>
import debounce from 'lodash.debounce'

import Box from './Box'
import Slider from './Slider'
import ChartBar from './ChartBar'
import ChartLine from './ChartLine'
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
const SECONDARY_COLOR = '#A9B3FC'

export default {
  name: 'Weather',

  components: {
    Box,
    Slider,
    ChartBar,
    ChartLine
  },

  data () {
    return {
      pressure: PRESSURE_DEFAULT,
      temperature: TEMPERATURE_DEFAULT,
      rainfallChartData: null,
      rainChancesChartData: null,
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
    this.isLoading = true
    this.getRainfallChart()
  },

  methods: {
    getRainfallChart () {
      ApiService.getRainfallChart()
        .then(({ data }) => {
          this.combineRainfallChartData(data[0])
          this.getChancesOfRain()
          this.isLoading = false
        })
        .catch(() => {
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
    getChancesOfRain () {
      const rainfallData = this.rainfallChartData

      if (!rainfallData) return

      const rainChancesChartData = {
        header: 'Chance of rain',
        labels: rainfallData.labels
      }

      const [lowerArray, mainArray, upperArray] = [[], [], []]

      rainfallData.dataArray.forEach((item, index) => {
        const value = this.countRainChances(item)
        // const day = index + 1
        // lowerArray.push([day, value[0].toFixed(2)])
        // mainArray.push([day, value[1].toFixed(2)])
        // upperArray.push([day, value[2].toFixed(2)])
        lowerArray.push(value[0].toFixed(2))
        mainArray.push(value[1].toFixed(2))
        upperArray.push(value[2].toFixed(2))
      })

      rainChancesChartData.linesArray = [
        {
          borderColor: SECONDARY_COLOR,
          data: lowerArray,
          label: 'Lower',
          fill: '+2'
        },
        {
          borderColor: MAIN_COLOR,
          data: mainArray,
          label: 'Mean',
          fill: false
        },
        {
          borderColor: SECONDARY_COLOR,
          data: upperArray,
          label: 'Upper',
          fill: '-2'
        }
      ]

      this.rainChancesChartData = rainChancesChartData
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

      <div class="weather__item weather__item_order_first">
        <div class="weather__stub" v-if="isLoading">Loading</div>
        <Box
          class="weather__box"
          v-else-if="rainChancesChartData"
          :header="rainChancesChartData.header"
        >
          <ChartLine :line-data="rainChancesChartData" />
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

      <div class="weather__item weather__item_order_second">
        <div class="weather__stub" v-if="isLoading">Loading</div>
        <Box
          class="weather__box"
          v-else-if="rainfallChartData"
          :header="rainfallChartData.header"
        >
          <ChartBar :bar-data="rainfallChartData" />
        </Box>
        <div class="weather__stub" v-else>No data is available</div>
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
    padding: 12px;
  }

  @media screen and (max-width: 640px) {
    &__item {
      flex: 0 0 100%;
      width: 100%;
      padding: 6px 0;
    }

    &__item_order_first {
      order: 1;
    }

    &__item_order_second {
      order: 2;
    }
  }
}
</style>
