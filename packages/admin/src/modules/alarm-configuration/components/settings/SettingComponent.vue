<template>
  <alarm-type-setting v-if="moduleName==='alarmTypeSetting'" />
</template>

<script>
import AlarmTypeSetting from './alarmTypeSetting.vue';

export default {
  name: 'SettingComponent',
  data() {
    return {
    };
  },
  components: {
    AlarmTypeSetting,
  },
  computed: {
    moduleName() {
      return this.$route.name;
    },
  },
};
</script>
