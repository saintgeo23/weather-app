<script>
export default {
  name: 'Slider',

  props: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 255
    },
    step: {
      type: Number,
      default: 1
    },
    value: { type: Number }
  },

  computed: {
    isIE () {
      if (!window.navigator || !window.navigator.userAgent) return

      const ua = window.navigator.userAgent

      return ua.indexOf('MSIE ') >= 0
    }
  },

  watch: {
    value (newValue) {
      this.updateRange(newValue)
    }
  },

  mounted () {
    this.updateRange()
  },

  methods: {
    emitInput (event) {
      console.log('input')
      this.$emit('input', +event.target.value)
      this.updateRange()
    },

    updateRange (newValue) {
      const value = newValue === undefined ? this.$refs.input.value : newValue
      let percent = (Number(value) - this.min) / (this.max - this.min) * 100

      this.$refs.fill.style.width = `${percent}%`
    }
  }
}
</script>

<template>
  <div class="slider">
    <div class="slider__wrapper">
      <span class="slider__bg" />
      <span class="slider__fill" ref="fill" />

      <input
        class="slider__input"
        ref="input"
        type="range"
        :value="value"
        :min="min"
        :max="max"
        :step="step"
        @input="emitInput"
      >
    </div>
  </div>
</template>

<style lang="less">
@width: 100%;
@height: 40px;

@bar-height: 4px;
@border-radius: 20px;
@bar-color: transparent;
@bar-fill: #181ED9;

@cursor-size: 26px;
@cursor-color: white;
@cursor-border-size: 1px;
@cursor-border: #eaeaea;

.slider {
  position: relative;

  &__wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
    height: @height;
  }

  &__fill,
  &__bg {
    position: absolute;
    top: @height / 2 - @bar-height / 2;
    left: 0;
    box-sizing: border-box;
    display: inline-block;
    width: 100%;
    height: @bar-height;
    background: #b6b6b6;
    border-radius: @border-radius;
  }

  &__fill {
    background: @bar-fill;
  }

  &__input {
    position: absolute;
    top: 0;
    left: 0;
    -webkit-appearance: none;
    box-sizing: border-box;
    width: @width;
    height: @height;
    padding: 0;
    cursor: pointer;
    background-color: transparent !important;

    &:focus {
      outline: none;
    }

    &::-moz-focus-outer {
      border: 0;
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: @cursor-size;
      height: @cursor-size;
      margin-top: -11px;
      cursor: pointer;
      background: @cursor-color;
      border: @cursor-border-size solid @cursor-border;
      border-radius: 50%;
    }

    &::-webkit-slider-runnable-track {
      width: @width;
      height: @bar-height;
      cursor: pointer;
      background: @bar-color;
      border-radius: @border-radius;
    }

    &::-moz-range-thumb {
      width: @cursor-size;
      height: @cursor-size;
      cursor: pointer;
      background: @cursor-color;
      border-radius: 50%;
    }

    &::-moz-range-track {
      box-sizing: border-box;
      width: @width;
      height: @bar-height;
      cursor: pointer;
      background: @bar-color;
      border-radius: @border-radius;
    }

    &::-ms-thumb {
      box-sizing: border-box;
      width: @cursor-size;
      height: @cursor-size;
      margin-top: 2px;
      cursor: pointer;
      background: @cursor-color;
      border: 0;
      border-radius: 50%;
      box-shadow: 0 0 0 @cursor-border-size @cursor-border;
    }

    &:focus::-ms-thumb {
      border: 0;
    }

    &::-ms-track {
      box-sizing: border-box;
      width: @width;
      height: @bar-height;
      color: transparent;
      cursor: pointer;
      background: @bar-color;
      border-radius: @border-radius;
    }

    &::-ms-fill-lower {
      background: @bar-fill;
      border-radius: @border-radius;
    }

    &::-ms-fill-upper {
      background: @bar-color;
    }

    &::-ms-tooltip {
      display: none;
    }
  }
}

@media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
  .range {
    &__fill {
      display: none;
    }
  }
}
</style>
