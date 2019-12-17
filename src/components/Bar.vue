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
    this.renderChart({
      labels: this.barData.labels,
      datasets: [
        {
          label: this.barData.header,
          backgroundColor: this.barData.bgColor,
          data: this.barData.dataArray
        }
      ],
      options: {
        scales: {
          yAxes: [{
            position: 'left',
            ticks: {
              min: 0
            },
            scaleLabel: {
              labelString: 'l/m²'
            }
          }],
          xAxes: [{
            position: 'bottom',
            scaleLabel: {
              labelString: 'Days'
            }
          }]
        }
      }
    })
  }
}
</script>
