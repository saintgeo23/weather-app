<script>
import VueCharts from 'vue-chartjs'
import shortId from 'shortid'

const AVAILABLE_CHART_TYPES = ['Bar', 'Line']

export default {
  name: 'Chart',

  props: {
    chartType: {
      type: String,
      validator (value) {
        return AVAILABLE_CHART_TYPES.includes(value)
      }
    },
    chartData: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      id: null
    }
  },

  created () {
    this.generateId()
  },

  mounted () {
    this.initChart()
  }

  methods: {
    generateId () {
      this.id = `chart_${shortId.generate()}`
    },
    initChart () {
      const ctx = document.getElementById(this.id)

      const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      })
    }
  }
}
</script>

<template>
  <div class="chart">
    <canvas
      class=""
      width="100%"
      height="300"
      :id="id"
    />
  </div>
</template>
