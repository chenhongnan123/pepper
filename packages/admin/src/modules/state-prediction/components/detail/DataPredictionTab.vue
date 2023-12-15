<template>
  <div
    :style="`height: ${height}px;`"
    class="tab-container"
  >
    <v-tabs background-color="transparent"
      center-active
      show-arrows
      class="pa-0 pt-1"
      v-model="tab"
      :key="`tab_key_${tab}`"
    >
      <v-tab
        v-for="(item, index) in items"
        :key="`tab_list_${index}`"
      >
        <span
          style="font-size: 16px;"
          class="mr-4"
        >{{ item.name }}
        </span>
        <span>{{ item.number }}</span>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="(item, index) in items"
        :key="`tab_content_${index}`"
        >
        <div
          v-if="index === 0"
          :style="`height: ${contentHeight}px;`"
        >
          <data-prediction-list
            :height="contentHeight"
          />
        </div>
        <div
          v-else
          :style="`height: ${contentHeight}px;`"
        >
          <maintenance-task-list
            :height="contentHeight"
          />
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';
import moment from 'moment';
import DataPredictionList from './DataPredictionList.vue';
import MaintenanceTaskList from './MaintenanceTaskList.vue';

export default {
  name: 'DataPredictionTab',
  components: {
    DataPredictionList,
    MaintenanceTaskList,
  },
  data() {
    return {
      moment,
      clientHeight: document.body.clientHeight,
      clientWidth: document.body.clientWidth,
      tab: 0,
    };
  },
  props: {
    height: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('statePrediction', ['algorithmModelList', 'maintenanceTaskList']),
    bomId() {
      return Number(this.$route.params.id) || 0;
    },
    contentHeight() {
      return this.height - 100;
    },
    modelLength() {
      return this.algorithmModelList?.length || 0;
    },
    inprogressTaskList() {
      const { maintenanceTaskList } = this;
      return maintenanceTaskList.filter((i) => i.status === '0'
        || i.status === '2' || i.status === '3');
    },
    taskLength() {
      return this.inprogressTaskList?.length || 0;
    },
    items() {
      return [
        {
          name: this.$t('statePrediction.title.dataMonitor'),
          number: this.modelLength,
        },
        {
          name: this.$t('statePrediction.title.maintenanceTask'),
          number: this.taskLength,
        },
      ];
    },
  },
  created() {
    // this.init();
  },
  mounted() {
  },
  methods: {
    ...mapActions('statePrediction', [
      'getAlgorithmModelList',
      'getMaintenanceTaskList',
      'getTaskStatusList',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    async init() {
      await this.getTaskStatusList();
      if (this.bomId) {
        await this.getAlgorithmModelList(this.bomId);
        await this.getMaintenanceTaskList(this.bomId);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  .tab-container{
    ::v-deep() .v-tabs, ::v-deep() .v-tabs-bar {
      background: transparent;
    }
  }
</style>
