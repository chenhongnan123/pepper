<template>
  <div class="darkNoBgColor">
    <portal
      to="page-header"
      v-if="pagePortalMode.partManagementDetail
      || pagePortalMode.bomPartDetail
      || pagePortalMode.planBomPartDetail
      || pagePortalMode.errorRepairPartDetail"
    >
      <div class="subtitleHeader">
        <v-btn
          class="mb-1"
          icon
          small
          @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span class="ml-2">{{ partName }}</span>
      </div>
    </portal>
    <div>
      <part-detail
        ref="partdetail"
        :rules="rules"
        :height="cardHeight"
        @refresh="refresh()"
      />
      <relate-document
        ref="relatedocument"
        :height="relateDocumentHeight"
        @refresh="refresh()"
      />
      <!-- <task-list
        ref="tasklist"
        :height="cardHeight"
        @refresh="getMaintenanceTaskList"
      /> -->
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
} from 'vuex';
import PartDetail from './PartDetail.vue';
import RelateDocument from './RelateDocument.vue';
import TaskList from './TaskList.vue';

export default {
  name: 'partManagementDetailComponent',
  data() {
    return {
      elementName: 'partManagementDetailComponent',
      // 这里使用document.body.clientHeight的话，clientheight每次进来都会高一点
      clientheight: window.innerHeight,
      // clientheight: document.body.clientHeight,
    };
  },
  components: {
    PartDetail,
    RelateDocument,
    TaskList,
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('partManagement', [
      'partAnnexInfo',
    ]),
    ...mapState('helper', [
      'pagePortalMode',
      'mainProduct',
    ]),
    // 模块名称
    moduleName() {
      return this.$route.name;
    },
    // 零件id
    partId() {
      return this.$route.params.id;
    },
    // 父页面名称
    pageName() {
      return this.$route.params.page;
    },
    // 权限按钮参数前缀
    btnAccessCodePrefix() {
      return `${this.pageName === 'partManagement' ? 'partmanagementdetail' : 'machinebomdetail'}`;
    },
    rules() {
      return this.$getPartRules();
    },
    // 零件详情
    part() {
      return this.partDetail || {};
    },
    // 零件名称
    partName() {
      return (this.part?.productName) ? this.part.productName : '';
    },
    cardHeight() {
      return (this.clientheight - 150 - 50 - 40) / 3;
    },
    relateDocumentHeight() {
      return this.clientheight - 380;
    },
    machineId() {
      return this.$route.params.machineId;
    },
    machineName() {
      return this.$route.params.machineName;
    },
  },
  activated() {
    this.setPageHeader(true);
    this.setAppHeaderHeight(120);
    // 每次进入详情页根据id查询零件详情/附件列表/任务列表
    if (this.pageName === 'machineBomDetail') {
      this.init();
    }
  },
  mounted() {
    if (this.pageName === 'partManagement') {
      this.init();
    }
  },
  deactivated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    ...mapActions('partManagement', [
      'getPartAnnexInfo',
      'getFileList',
      'getTaskList',
    ]),
    async init() {
      this.getPartAnnexInfo(this.partId);
    },
    refresh() {
      this.init();
    },
    goBack() {
      if (this.pageName === 'partManagement') {
        this.$router.push({ name: 'partManagement' });
      } else if (this.pageName === 'machineBomDetail') {
        const { machineId, machineName } = this;
        this.$router.push({ path: `/machine-bom/detail/${machineId}/${machineName}` });
      } else if (this.pageName === 'maintenancePlan') {
        this.$router.push({ name: 'maintenancePlan' });
      } else if (this.pageName === 'errorRepair') {
        this.$router.push({ name: 'errorRepair' });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
