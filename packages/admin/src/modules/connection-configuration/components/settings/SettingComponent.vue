<template>
  <data-type-setting v-if="moduleName==='dataTypeSetting'" />
  <!-- <parameter-type-setting v-else-if="moduleName==='parameterTypeSetting'" /> -->
</template>

<script>
import DataTypeSetting from './dataTypeSetting.vue';
// import ParameterTypeSetting from './parameterTypeSetting.vue';

export default {
  name: 'SettingComponent',
  data() {
    return {
    };
  },
  components: {
    DataTypeSetting,
    // ParameterTypeSetting,
  },
  computed: {
    moduleName() {
      return this.$route.name;
    },
  },
};
</script>
