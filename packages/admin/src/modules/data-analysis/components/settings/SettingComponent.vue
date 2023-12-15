<template>
  <data-table-setting v-if="moduleName==='dataTableSetting'" />
  <data-source-setting v-else-if="moduleName==='dataSourceSetting'" />
</template>

<script>
import DataTableSetting from './dataTableSetting.vue';
import DataSourceSetting from './dataSourceSetting.vue';

export default {
  name: 'SettingComponent',
  data() {
    return {
    };
  },
  components: {
    DataTableSetting,
    DataSourceSetting,
  },
  computed: {
    moduleName() {
      return this.$route.name;
    },
  },
};
</script>
