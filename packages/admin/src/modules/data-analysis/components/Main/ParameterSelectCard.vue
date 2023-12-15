<template>
  <div>
    <v-card id="optionsCard" :style="`height: ${height}px;`">
      <v-card-title
        dense
        style="background-color: var(--v-primary-base);"
      >
        <span style="color: white;">
          {{ $t('dataAnalysis.modules.options') }}
        </span>
      </v-card-title>
      <!-- 仅当有已选算法时展示选项页签 -->
      <v-card-text
        v-if="algorithmselected"
        :style="`height: ${height - 36}px;`"
      >
        <tab-initial
          :variatelist="columns"
          :parameter="parameter"
          :optionparams="optionparams"
          :defaultParams="defaultParams"
          :height="height - 72"
          :rules="rules"
        />
      </v-card-text>
      <v-card-text
        v-else
        :style="`height: ${height - 36}px;`"
      >
        <v-row
          class="fill-height"
          align-content="center"
          justify="center"
        >
          <v-col
            :cols="12"
            class="text-subtitle-1 text-center"
          >
            <div>
              {{ $t('dataAnalysis.dialog.selectalgorithm') }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import TabInitial from './TabInitial.vue';

export default {
  data() {
    return {
      algorithmselected: false,
    };
  },
  components: {
    TabInitial,
  },
  props: {
    // 传参：选项卡各项参数配置，包含显隐和必填、非必填信息
    parameter: {
      type: Object,
      required: true,
    },
    // 传参：源数据表中全部数据列/标签列
    columns: {
      type: Array,
      required: true,
    },
    // 要进行设置的选项卡全部参数(用于视图数据赋值)
    optionparams: {
      type: Object,
      required: true,
    },
    // 传参：包含选项卡全部参数默认值
    defaultParams: {
      type: Object,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState('dataAnalysis', ['selectedItems', 'clearTabs']),
    algorithm() {
      return this.selectedItems.algorithm;
    },
    algorithmtype() {
      return this.selectedItems.algorithmtype;
    },
  },
  watch: {
    algorithm(val) {
      if (val) {
        const arr = Object.keys(this.algorithm);
        this.algorithmselected = (arr.length !== 0);
      } else {
        this.algorithmselected = false;
      }
    },
    clearTabs(val) {
      if (val) {
        this.algorithmselected = false;
      } else {
        this.algorithmselected = true;
      }
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('dataAnalysis', ['setClearTabs']),
  },
};
</script>
<style scoped>
  #optionsCard /deep/ .v-card__title{
    font-size: 1rem;
    line-height: 1rem;
    padding: 10px 16px 10px 16px;
  }

</style>
