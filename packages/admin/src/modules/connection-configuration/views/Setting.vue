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
import { mapMutations } from 'vuex';
import SettingsLayout from '@/components/layout/SettingsLayout.vue';

export default {
  name: 'connectionConfigurationSetting',
  data() {
    return {
    };
  },
  components: {
    SettingsLayout,
  },
  computed: {
    moduleName() {
      return this.$route.name;
    },
    // params有传参id，放入计算属性
    items() {
      return [
        {
          header: 'menu.general',
        },
        // {
        //   title: 'connectionConfiguration.parameterTypeSetting.title',
        //   routerName: 'parameterTypeSetting',
        //   params: {
        //     id: this.$route.params.id,
        //   },
        // },
        {
          title: 'connectionConfiguration.dataTypeSetting.title',
          routerName: 'dataTypeSetting',
          params: {
            id: this.$route.params.id,
          },
        },
      ];
    },
  },
  created() {
    this.init();
  },
  activated() {
  },
  deactivated() {
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
    ]),
    init() {
    },
  },
};
</script>
