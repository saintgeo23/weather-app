<script>
import Weather from './components/Weather'

export default {
  name: 'App',

  components: { Weather }
}
</script>

<template>
  <div id="app" class="app">
    <Weather />
  </div>
</template>

<style lang="less">
.app {
  padding: 0;
  margin: 0;
  font-family: Arial;
  list-style: none;
}
</style>
