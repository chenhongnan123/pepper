<template>
  <v-form
    ref="form"
    lazy-validation
    :style="`height: ${height}px;`"
  >
    <v-row
      id="testsContent"
      class="pt-4 ml-1 tabcontent"
      :style="`height: ${height-10}px;`"
    >
      <v-col
        :cols="6"
        v-for="(item, index) in testList"
        :key="index"
      >
        <div
          class="ml-2"
          style="display: inline-block;width: 8%;"
        >
          <v-checkbox
            dense
            hide-details
            v-model="tests[item.name].checked"
          ></v-checkbox>
        </div>
        <div
          style="display: inline-block; width: 82%;"
        >
          <v-text-field
            dense
            outlined
            type="number"
            v-model="tests[item.name].value"
            :label="`${$t(`dataAnalysis.options.${item.name}`, { num: 'N', num2: 'N+1' })}`"
            :rules="tests[item.name].checked ? getRulesByName(item.name) : []"
          ></v-text-field>
        </div>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  props: {
    // 传参：tests选项卡参数配置，包含显隐和必填、非必填信息
    checkparamters: {
      type: Object,
      required: true,
    },
    // 传参：包含tests选项卡参数默认值
    defaultParams: {
      type: Object,
      required: true,
    },
    // 要进行设置的tests选项卡参数(用于视图数据赋值)
    setparams: {
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
  data() {
    return {
      // 存放当前选项卡参数信息
      tests: {},
      // 全部校验选项列表
      deafulttestlist: [
        {
          name: 'onepoint',
          checked: true,
          value: 3,
        },
        {
          name: 'npointsall',
          checked: false,
          value: 6,
        },
        {
          name: 'npointssameside',
          checked: false,
          value: 9,
        },
        {
          name: 'npointsupdown',
          checked: false,
          value: 14,
        },
        {
          name: 'pointsbiggerthan2',
          checked: false,
          value: 2,
        },
        {
          name: 'npoints1',
          checked: false,
          value: 15,
        },
        {
          name: 'pointsbiggerthan1',
          checked: false,
          value: 4,
        },
        {
          name: 'npointsbiggerthan1',
          checked: false,
          value: 8,
        },
      ],
    };
  },
  computed: {
    ...mapState('dataAnalysis', ['selectedItems']),
    algorithm() {
      return this.selectedItems.algorithm;
    },
    algorithmtype() {
      return this.selectedItems.algorithmtype;
    },
    // 根据配置不同算法展示不同的校验项
    testList() {
      const check = this.checkparamters;
      const checkobj = {};
      // eslint-disable-next-line
      for (let key in check) {
        if (check[key].show) {
          checkobj[key] = check[key];
        }
      }
      const keys = Object.keys(checkobj);
      const list = this.deafulttestlist.filter((item) => keys.includes(item.name));
      return list;
    },
  },
  watch: {
    // 监听选项卡参数变化，同步写入缓存
    tests: {
      handler(val) {
        this.testsSet(val);
      },
      deep: true,
      immediate: true,
    },
    // 根据视图传递参数给选项赋值，若无选中视图则显示默认参数
    setparams: {
      handler(val) {
        const arr = Object.keys(val);
        if (arr.length !== 0) {
          this.tests = {
            ...val,
          };
        } else {
          this.setDefaultParams();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.testsSet(this.tests);
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('dataAnalysis', ['setTests']),
    checkform() {
      if (!this.$refs.form.validate()) {
        return false;
      }
      return true;
    },
    // 设置选项卡为默认参数，并写入缓存
    setDefaultParams() {
      this.tests = {};
      // 深拷贝，以防影响原默认参数defaultParams
      // eslint-disable-next-line
      for (let i in this.defaultParams) {
        this.tests[i] = {
          ...this.defaultParams[i],
        };
      }
      this.setTests(this.tests);
    },
    // 根据校验将显示的参数项写入缓存
    testsSet(val) {
      const check = this.checkparamters;
      // console.log(check, 'check');
      const result = {};
      // eslint-disable-next-line
      for (let i in val) {
        if (check[i] && check[i].show) {
          result[i] = val[i];
        }
      }
      this.setTests(result);
    },
    // 不同校验项，值校验不同
    getRulesByName(name) {
      if (name) {
        return this.rules[name];
      }
      return this.rules.isrequired;
    },
  },
};
</script>
<style scoped>
  .tabcontent{
    overflow-y: scroll;
    width: 100%;
  }
  #testsContent /deep/ .col-6{
    padding: 4px 0 0 0 !important;
  }
</style>
