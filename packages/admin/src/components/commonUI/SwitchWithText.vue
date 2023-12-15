<template>
  <div
    class="switch-with-text"
    :style="`--switch-width:${switchWidth}px;
            --switch-color:${color || '#424242'};
            --switch-translateX:${switchWidth-23}px`"
  >
    <!-- eslint-disable-next-line -->
    <div
      class="slider round"
      :class="switchValue?'checked':''"
      @click="switchValue =!switchValue"
    >
      <span
        class="slider-text"
        :class="switchValue?'on':''"
      >{{switchText}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SwitchWithText',
  props: {
    value: {
      type: Boolean,
    },
    textList: {
      type: Array,
    },
    width: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
    },
  },
  computed: {
    switchValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('setValue', val);
      },
    },
    switchText() {
      return this.textList[this.value ? 1 : 0];
    },
    switchWidth() {
      return this.width && this.width > 48 ? this.width : 48;
    },
  },
};
</script>

<style lang="scss">
.switch-with-text {
  position: relative;
  display: inline-block;
  width: var(--switch-width);
  height: 23px;
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    -webkit-transition: .4s;
    transition: .4s;
    border: solid thin #888;
  }
  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    border: solid thin var(--switch-color);
  }
  .checked {
    background-color:  #888;
  }
  .checked:before {
    background-color: var(--switch-color) !important;
    -webkit-transform: translateX(var(--switch-translateX));
    -ms-transform: translateX(var(--switch-translateX));
    transform: translateX(var(--switch-translateX));
  }
  .round {
    border-radius: 34px;
  }
  .round:before {
    border-radius: 50%;
  }
  .slider-text{
  color: var(--switch-color);
  position: absolute;
  right: 8px;
  margin: 0 auto;
  font-size:12px;
  line-height: 22px
  }
  .on.slider-text{
    color: #fff;
    left: 8px;
  }
}

</style>
