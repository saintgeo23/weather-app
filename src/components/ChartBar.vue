<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,

  props: {
    barData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },

  mounted () {
    const cdata = {
      labels: this.barData.labels,
      datasets: [
        {
          backgroundColor: this.barData.bgColor,
          data: this.barData.dataArray
        }
      ]
    }
    const options = {
      responsive: true,
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          position: 'bottom',
          scaleLabel: {
            display: true,
            labelString: 'Days'
          }
        }],
        yAxes: [{
          display: true,
          type: 'linear',
          position: 'left',
          ticks: {
            min: 0
          },
          scaleLabel: {
            display: true,
            labelString: 'l/m²'
          }
        }]
      }
    }

    this.renderChart(cdata, options)
  }
}
</script>
