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
      >
        {{ item.tabName }}
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
  },
  data() {
    return {
    };
  },
  computed: {
    currentTab: {
      get() {
        return this.tab;
      },
      set(val) {
        this.$emit('changeTab', val);
      },
    },
  },
  created() {
  },
  methods: {
    // handleChangeTab(tab) {
    //   // console.log('changeTab', tab);
    //   this.$emit('changeTab', tab);
    // },
  },
};
</script>

<style lang="scss" scoped>
  .tabLayout {
    ::v-deep .v-tabs-bar {
      height: 36px;
    }
    ::v-deep .v-tab:not(.v-tab--active):hover {
      color: var(--v-primary-base);
    }
    ::v-deep .v-tab--active {
      background-color: var(--v-primary-base);
      color: #FFFFFF;
    }
    ::v-deep .v-tabs-slider-wrapper {
      display: none;
    }
  }
</style>
