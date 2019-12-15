<script>
export default {
  name: 'Box',

  props: {
    header: {
      type: String,
      default: ''
    },
    value: String
  }
}
</script>

<template>
  <div class="box">
    <div class="box__header">{{ header }}{{ value === undefined ? '' : `: ${value}` }}</div>

    <div class="box__wrapper">
      <slot />
    </div>
  </div>
</template>

<style lang="less">
.box {
  position: relative;
}
</style>
