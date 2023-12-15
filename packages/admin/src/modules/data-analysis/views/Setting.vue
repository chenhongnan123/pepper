<template>
  <v-container fluid>
    <settings-layout
      :items="items"
      :headerTitle="$t(`modules.${moduleName}`)"
      :moduleName="moduleName"
    >
    </settings-layout>
  </v-container>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import SettingsLayout from '@/components/layout/SettingsLayout.vue';

export default {
  name: 'spcSetting',
  data() {
    return {
      items: [
        {
          header: 'menu.general',
        },
        {
          title: 'spc.modules.datatable',
          routerName: 'dataTableSetting',
        },
        {
          title: 'spc.modules.datasource',
          routerName: 'dataSourceSetting',
        },
      ],
    };
  },
  components: {
    SettingsLayout,
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
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
  },
};
</script>
