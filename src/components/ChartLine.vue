<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,

  props: {
    lineData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },

  data () {
    return {
      options: {
        responsive: true,
        animation: {
          duration: 300,
          easing: 'linear'
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
              min: 0,
              max: 100
            },
            scaleLabel: {
              display: true,
              labelString: '%'
            }
          }]
        }
      }
    }
  },

  computed: {
    cdata () {
      return {
        labels: this.lineData.labels,
        datasets: this.lineData.linesArray
      }
    }
  },

  watch: {
    lineData () {
      this.renderChart(this.cdata, this.options)
    }
  },

  mounted () {
    this.renderChart(this.cdata, this.options)
  }
}
</script>
