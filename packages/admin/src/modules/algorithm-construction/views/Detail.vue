<template>
  <v-container
    fluid
    class="darkNoBgColor"
  >
    <portal
      to="app-header"
      v-if="pagePortalMode.algorithmConstructionDetail"
    >
      <v-btn
        class="mb-1"
        icon
        small
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{ eventName || '-' }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="refresh"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <!-- <portal
      to="page-header"
    ></portal> -->
    <!-- 标准算法 -->
    <main-component
      ref="mainComponent"
      v-if="type === '0'"
    />
    <!-- 定制算法 -->
    <detail-component
      ref="detailComponent"
      v-if="type === '1'"
    />
  </v-container>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';
import MainComponent from '@/modules/data-analysis/components/mainComponent.vue';
import DetailComponent from '../components/DetailComponent.vue';

export default {
  name: 'ProcessMonitorSpc',
  data() {
    return {
      clientheight: document.body.clientHeight,
      clientWidth: document.body.clientWidth,
    };
  },
  components: {
    MainComponent,
    DetailComponent,
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  deactivated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  // 必须放入mounted钩子函数，否则节点未生成时无法进行页面初始化加载
  mounted() {
    this.refresh();
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    refresh() {
      if (this.$refs.mainComponent) {
        this.$refs.mainComponent.init();
      }
      if (this.$refs.detailComponent) {
        this.$refs.detailComponent.init();
      }
    },
    // 返回按钮
    goBack() {
      this.$router.push({ name: 'algorithmConstruction' });
    },
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    moduleName() {
      return this.$route.name;
    },
    type() {
      return this.$route.params.type;
    },
    eventName() {
      return this.$route.params.name;
    },
  },
};
</script>
