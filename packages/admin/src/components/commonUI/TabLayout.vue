<template>
  <div
    class="tabLayout"
    style="width: 100%"
  >
    <v-tabs
      center-active
      show-arrows
      class="pa-0"
      v-model="currentTab"
      :key="`tab_key_${tab}`"
    >
      <v-tab
        v-for="(item, index) in items"
        :key="`tab_list_${index}`"
        :disabled="item.disabled"
        class="rounded-b-0"
      >
        <span
          style="font-size: 16px"
        >{{ item.tabName }}
        </span>
      </v-tab>
    </v-tabs>
  </div>
</template>

<script>

export default {
  name: 'TabLayout',
  props: {
    items: {
      type: Array,
      required: true,
    },
    tab: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
    };
  },
  computed: {
    currentTab: {
      get() {
        return this.tab || this.value;
      },
      set(val) {
        this.$emit('changeTab', val);
        this.$emit('input', val);
      },
    },
  },
  created() {
  },
  methods: {
    handleChangeTab(tab) {
      this.$emit('changeTab', tab);
    },
  },
};
</script>

<style lang="scss" scoped>
  .tabLayout {
    ::v-deep .v-tabs-bar {
      height: 36px;
      background-color: var(--v-bg-base);
    }
    ::v-deep .v-tab:not(.v-tab--active):hover {
      color: var(--v-primary-base);
    }
    ::v-deep .v-tab--active {
      border-bottom: 2px solid var(--v-primary-base);
      background-color: rgba(0, 117, 194, 0.1);
      // border: 1px solid red;
      // background-color: var(--v-primary-base);
      // color: #FFFFFF;
    }
    ::v-deep .v-tabs-slider-wrapper {
      display: none;
    }
  }
</style>
