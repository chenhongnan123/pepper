<template>
  <div style="height: 100%;">
    <input
      ref="input"
      v-model="value"
      class="simple-input-editor"
      @keydown="onKeyDown($event)"
    />
  </div>
</template>

<script>
import { nextTick } from 'vue';

const KEY_BACKSPACE = 'Backspace';
const KEY_ENTER = 'Enter';
const KEY_TAB = 'Tab';

export default {
  data() {
    return {
      value: '',
      cancelBeforeStart: true,
    };
  },
  methods: {
    getValue() {
      return this.value;
    },
    isCancelBeforeStart() {
      return this.cancelBeforeStart;
    },
    setInitialState(params) {
      let startValue;
      if (params.eventKey === KEY_BACKSPACE) {
        startValue = '';
      } else if (params.charPress) {
        startValue = params.charPress;
      } else {
        startValue = params.value;
      }
      this.value = startValue;
    },
    isCancelAfterEnd() {
      return this.value > 1000000;
    },
    onKeyDown(event) {
      if (event.key === 'Escape') {
        return;
      }
      if (this.isLeftOrRight(event) || this.isBackspace(event)) {
        event.stopPropagation();
        return;
      }
      if (
        !this.finishedEditingPressed(event) &&
        !this.isKeyPressedNumeric(event)
      ) {
        if (event.preventDefault) event.preventDefault();
      }
    },
    isCharNumeric(charStr) {
      return /\d/.test(charStr);
    },
    isKeyPressedNumeric(event) {
      const charStr = event.key;
      return this.isCharNumeric(charStr);
    },
    finishedEditingPressed(event) {
      const { key } = event;
      return key === KEY_ENTER || key === KEY_TAB;
    },
    isBackspace(event) {
      return event.key === KEY_BACKSPACE;
    },
    isLeftOrRight(event) {
      return ['ArrowLeft', 'ArrowRight'].indexOf(event.key) > -1;
    },
  },
  created() {
    this.setInitialState(this.params);
    this.cancelBeforeStart =
      this.params.charPress && '1234567890'.indexOf(this.params.charPress) < 0;
  },
  mounted() {
    nextTick(() => {
      if (this.$refs.input) {
        this.$refs.input.focus();
      }
    });
  },
};
</script>

<style scoped>
  .mood {
  border-radius: 15px;
  border: 1px solid grey;
  background: #e6e6e6;
  padding: 15px;
  text-align: center;
  display: inline-block;
  outline: none;
}

.default {
  border: 1px solid transparent !important;
  padding: 4px;
}

.selected {
  border: 1px solid lightgreen !important;
  padding: 4px;
}

.simple-input-editor {
  width: 100%;
  height: 100%;
}

</style>
