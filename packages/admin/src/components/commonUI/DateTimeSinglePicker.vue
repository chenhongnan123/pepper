<template>
  <el-date-picker
    v-model="elvalue"
    :readonly="readonly"
    :disabled="disabled"
    :editable="editable"
    :clearable="clearable"
    :placeholder="placeholder"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
    :time-arrow-control="timeArrowControl"
    :type="type"
    :format="format"
    :align="align"
    :popper-class="popperClass"
    :picker-options="pickerOptions"
    :range-separator="rangeSeparator"
    :default-value="defaultValue"
    :default-time="defaultTime"
    :unlink-panels="unlinkPanels"
    :prefix-icon="prefixIcon"
    :clear-icon="clearIcon"
    class="selector"
    :class="classStr"
  />
</template>

<script>
import { DatePicker, Button } from 'element-ui';

export default {
  name: 'DateTimeRangePicker',
  components: {
    [DatePicker.name]: DatePicker,
    [Button.name]: DatePicker,
  },
  props: {
    value: {},
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    editable: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
    },
    startPlaceholder: {
      type: String,
    },
    endPlaceholder: {
      type: String,
    },
    timeArrowControl: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: () => 'datetimerange',
    },
    format: {
      type: String,
      default: () => 'yyyy-MM-dd HH:mm:ss',
    },
    align: {
      type: String,
      default: () => 'left',
    },
    popperClass: {
      type: String,
    },
    pickerOptions: {
      type: Object,
    },
    rangeSeparator: {
      type: String,
      default: () => '-',
    },
    defaultValue: {
      type: Array,
    },
    defaultTime: {
      type: [Array, String],
    },
    unlinkPanels: {
      type: Boolean,
      default: () => true,
    },
    prefixIcon: {
      type: String,
      default: () => 'el-icon-date',
    },
    clearIcon: {
      type: String,
      default: () => 'el-icon-circle-close',
    },
    dense: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      today: {
        iso: {
          start: new Date().setUTCHours(0, 0, 0, 0),
          end: new Date().setUTCHours(23, 59, 59, 999),
        },
        local: {
          start: new Date().setHours(0, 0, 0, 0),
          end: new Date().setHours(23, 59, 59, 999),
        },
      },
      tomorrow: {
        iso: {
          start: new Date().setUTCHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000,
          end: new Date().setUTCHours(23, 59, 59, 999) + 24 * 60 * 60 * 1000,
        },
        local: {
          start: new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000,
          end: new Date().setHours(23, 59, 59, 999) + 24 * 60 * 60 * 1000,
        },
      },
      defaultDates: new Date(new Date().setHours(0, 0, 0, 0)).toString(),
    };
  },
  computed: {
    elvalue: {
      get() {
        // 转换为本地Date对象数组
        const { value } = this;
        if (value instanceof Date) {
          return value;
        }
        if (typeof value === 'string') {
          return new Date(value).toString();
        }
        if (typeof value === 'number') {
          return new Date(value).toString();
        }
        return value || this.defaultDates;
      },
      set(val) {
        if (!val || val.length === 0) {
          // this.$emit('getDateRange', []);
          this.$emit('input', '');
          this.defaultDates = '';
          return;
        }
        const timestamp = new Date(val)?.getTime();
        this.defaultDates = timestamp;
        this.$emit('input', timestamp);
      },
    },
    classStr() {
      let classStr = '';
      if (this.dense) {
        classStr += 'dense';
      }
      return classStr;
    },
    iszh() {
      return this.$i18n.locale === 'zhHans';
    },
  },
  created() {},
  mounted() {
    this.$nextTick().then(() => {
      this.setDefaultValue();
    });
  },
  methods: {
    setDefaultValue() {
      if (
        !this.value ||
        (Array.isArray(this.value) && this.value.length === 0) ||
        (typeof this.value === 'object' && Object.keys(this.value).length === 0)
      ) {
        this.$emit('input', this.today.local.start);
        return;
      }

      if (this.value instanceof Date) {
        this.$emit('input', this.value.getTime());
        return;
      }
      if (typeof this.value === 'string') {
        this.$emit('input', new Date(this.value).getTime());
        return;
      }
      if (typeof this.value === 'number') {
        this.$emit('input', new Date(this.value).getTime());
        return;
      }
      if (Array.isArray(this.value) && this.value.length === 1) {
        this.$emit('input', new Date(this.value[0]).getTime());
        return;
      }
      if (Array.isArray(this.value) && this.value.length >= 2) {
        this.$emit('input', new Date(this.value[0]).getTime());
      }
    },
  },
};
</script>

<style scoped lang="scss">
.selector {
  border: 1px solid var(--v-primary-base);
  border-radius: 4px;
  border-color: var(--v-primary-base) !important;
  background-color: transparent !important;
  color: var(--v-primary-base) !important;

  ::v-deep .el-range-input,
  ::v-deep .el-input__icon,
  ::v-deep .el-range-separator {
    color: var(--v-primary-base) !important;
    background-color: none !important;
  }
}

.dense {
  height: 28px !important;
  background-color: transparent !important;
  color: var(--v-primary-base) !important;
  input {
    height: 28px !important;
  }
  ::v-deep .el-input__inner,
  ::v-deep .el-range-input,
  ::v-deep .el-input__icon,
  ::v-deep .el-range-separator {
    background-color: transparent !important;
    border: none !important;
    height: auto !important;
    line-height: 28px;
    color: var(--v-primary-base);
  }
}
</style>
