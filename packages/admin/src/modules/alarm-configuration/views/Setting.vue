<template>
  <v-container fluid>
    <settings-layout
      :items="items"
      :headerTitle="$t(`modules.${moduleName}`)"
      :isGoBack="true"
      @goBack="goBack"
    >
    </settings-layout>
  </v-container>
</template>

<script>
import { mapMutations } from 'vuex';
import SettingsLayout from '@/components/layout/SettingsLayout.vue';

export default {
  name: 'alarmConfigurationSetting',
  data() {
    return {
      items: [
        {
          header: 'menu.general',
        },
        {
          title: 'alarmConfiguration.alarmTypeSetting.title',
          routerName: 'alarmTypeSetting',
        },
      ],
    };
  },
  components: {
    SettingsLayout,
  },
  computed: {
    moduleName() {
      return this.$route.name;
    },
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  deactivated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
    ]),
    goBack() {
      this.$router.push({
        name: 'alarmConfiguration',
      });
    },
  },
};
</script>
