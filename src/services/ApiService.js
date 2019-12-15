import axios from 'axios'

const RAINFALL_CHART_API = 'http://private-4945e-weather34.apiary-proxy.com/weather34/rain'

export default {
  getRainfallChart () {
    return axios.get(RAINFALL_CHART_API)
  }
}
