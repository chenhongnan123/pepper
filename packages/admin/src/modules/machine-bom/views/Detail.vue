<template>
  <v-container
    fluid
    class="darkNoBgColor"
  >
    <portal
      to="app-header"
      v-if="pagePortalMode.machineBomDetail"
    >
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{ $t(`modules.${moduleName}`) }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="refresh"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card
          height="77"
          class="mb-3"
          elevation="0"
          color="bg"
        >
          <div class="d-flex align-center px-4" style="height:100%">
            <div class="d-flex flex-column">
              <span
                class="text-body-2 info--text"
              >
                {{ $t('machineBom.label.deviceName') }}
              </span>
              <span style="font-size: 18px; color: var(--v-primary-base)">
                {{ deviceName || '-' }}
              </span>
            </div>
            <v-spacer></v-spacer>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="2" >
        <v-card
          :height="tableHeight"
          elevation="0"
          color="bg"
          class="py-4"
        >
          <div
            class="d-flex px-4"
            style="width: 100%;"
          >
            <span
              class="text-h6 "
            >
              {{$t('machineBom.title.machineBom')}}
            </span>
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                  <div class="d-flex justify-space-between">
                    <v-btn
                      v-if="isBtnAccess('basic:bom:removeAndCheck')"
                      v-bind="attrs"
                      v-on="on"
                      color="red"
                      icon
                      small
                      @click="handleDeleteBom"
                      :disabled="isDeleteDisbled"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </template>
                <div>{{ $t('btn.delete') }}</div>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                  <div class="d-flex justify-space-between">
                    <v-btn
                      v-if="isBtnAccess('basic:bom:edit')"
                      v-bind="attrs"
                      v-on="on"
                      color="success"
                      icon
                      small
                      @click="isAddNew = false,addFolderDialog = true"
                      :disabled="isEditDiasbled"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </div>
                </template>
                <div>{{ $t('btn.edit') }}</div>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                  <div class="d-flex justify-space-between">
                    <v-btn
                      v-if="isBtnAccess('basic:bom:add')"
                      v-bind="attrs"
                      v-on="on"
                      color="primary"
                      icon
                      small
                      @click="isAddNew = true,addFolderDialog = true"
                      :disabled="isAddDiabled"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </div>
                </template>
                <div>{{ $t('btn.add') }}</div>
            </v-tooltip>
          </div>
          <div class="d-flex px-4 ">
            <v-text-field
              v-model="searchVal"
              append-icon="mdi-magnify"
              hide-details
              clearable
              :label="$t('machineBom.label.searchComponent')"
            ></v-text-field>
          </div>
          <v-treeview
            :open-all="openall"
            class="px-4 mt-2"
            :style="`height: ${tableHeight - 120}px;overflow-y: scroll;cursor: pointer;`"
            dense
            item-key="bomId"
            item-text="bomName"
            :active.sync="activefloder"
            activatable
            return-object
            :search="searchVal"
            :items="machineBomList"
            @update:active="handleActive"
          >
            <template v-slot:label="{ item }">
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      class="d-flex justify-space-between"
                    >
                      <span
                        v-bind="attrs"
                        v-on="on"
                        class="text-truncate"
                      >
                        {{ item.bomName || item.bomNumber }}
                      </span>
                    </div>
                  </template>
                  <div>
                    {{ `${$t('machineBom.label.bomName')}: ` }}
                    {{ item.bomName}}
                  </div>
                  <div>
                    {{ `${$t('machineBom.label.bomCode')}:` }}
                    {{ item.bomNumber}}
                  </div>
                  <div v-if="item.camera === '1'">
                    {{ `${$t('machineBom.label.cameraIp')}:` }}
                    {{ item.cameraIp}}
                  </div>
                  <div v-if="item.camera === '1'">
                    {{ `${$t('machineBom.label.cameraThoroughfare')}:` }}
                    {{ item.cameraThoroughfare}}
                  </div>
                  <div v-if="item.camera === '1'">
                    {{ `${$t('machineBom.label.cameraPort')}:` }}
                    {{ item.cameraPort}}
                  </div>
                </v-tooltip>
            </template>
          </v-treeview>
        </v-card>
      </v-col>
      <v-col cols="10" class="pl-3">
        <part-list
          ref="partlist"
          @refresh="refreshTableList"
          :rules="rules"
          :activefloder="activefloder"
        />
      </v-col>
    </v-row>
    <add-folder
      :addFolderDialog="addFolderDialog"
      :isAddNew="isAddNew"
      :activefloder="activefloder"
      @closeDialog="addFolderDialog = false"
      @getFolderList="init"
      :rules="rules"
    />
    <DeleteFailedDialog
      :isShowDialog="isShowDeleteFailedDialog"
      @closeDialog="isShowDeleteFailedDialog = false"
      :deleteFailedList="deleteFailedList"
      @getTableList="getTableList"
    />
  </v-container>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapGetters,
  mapActions,
} from 'vuex';
import DeleteFailedDialog from '@/components/commonUI/DeleteFailedDialog.vue';
import PartList from '../components/detail/PartList.vue';
import AddFolder from '../components/detail/AddFolder.vue';

let timer = null;
export default {
  name: 'machineBomDetail',
  data() {
    return {
      tableHeight: document.body.clientHeight - 210,
      leftWidth: 265,
      isMousedown: false,
      searchVal: '',
      activefloder: [], // 选中的部件
      addFolderDialog: false, // 新增or编辑首层bom
      isAddNew: false,
      openall: false,
      isShowDeleteFailedDialog: false,
      deleteFailedList: [],
      isInit: false,
    };
  },
  components: {
    DeleteFailedDialog,
    PartList,
    AddFolder,
  },
  created() {
    this.init();
  },
  activated() {
    if (this.isInit) {
      this.refreshTableList();
    }
  },
  deactivated() {
  },
  beforeDestroy() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    ...mapMutations('machineBom', [
      'setBomDetailList',
    ]),
    ...mapActions('machineBom', [
      'getDeviceMainItem',
      'getPartTypeList',
      'getMachineBomList',
      'getBomTableList',
      'deleteBom',
      'deletePart',
    ]),
    async init() {
      if (this.$refs.partlist) {
        this.$refs.partlist.resetSelect();
      }
      await this.getBomList();
      await this.getPartTypeList();
      this.isInit = true;
    },
    refresh() {
      this.init();
    },
    async refreshTableList() {
      // this.handleActive(this.activefloder);
      await this.getCurrentBomList();
    },
    goBack() {
      this.$router.push({
        name: 'machineBom',
      });
    },
    async getBomList() {
      const result = await this.getMachineBomList();
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        if (this.machineBomList?.length) {
          this.activefloder.push(this.machineBomList[0]);
          // this.handleActive(this.activefloder);
          this.openall = true; // 展开所有节点
        } else {
          this.activefloder = [];
        }
      }
    },
    async getCurrentBomList() {
      const result = await this.getMachineBomList();
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.handleActive(this.activefloder);
        this.openall = true; // 展开所有节点
      }
    },
    async getTableList(bomParentId) {
      const result = await this.getBomTableList(bomParentId);
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
      }
    },
    handleActive(item) {
      console.log(item, 'item');
      if (item.length > 0) {
        const { bomId } = item[0];
        this.getTableList(bomId);
        // 重置选中
        if (this.$refs.partlist) {
          this.$refs.partlist.resetSelect();
        }
      } else {
        this.setBomDetailList([]);
      }
    },
    async handleDeleteBom() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.deleterecord'),
        this.$t('dialog.deleterecordconfirm'),
      )) {
        const { activefloder } = this;
        if (activefloder.length === 0) {
          return;
        }
        const bomIds = activefloder[0].bomId;
        const result = await this.deleteBom(bomIds);
        if (result && result.code === 201) {
          this.isShowDeleteFailedDialog = true;
          this.deleteFailedList = result.data;
          return;
        }
        if (result) {
          console.log(result, 'result');
          const ids = result.data;
          if (ids && ids.length) {
            this.setAlert({
              show: true,
              type: 'error',
              message: 'BomDeleteError',
            });
          } else {
            this.setAlert({
              show: true,
              type: 'success',
              message: 'successAction',
            });
            timer = setTimeout(() => {
              this.getBomList();
            }, 100);
          }
        }
      }
    },
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('machineBom', [
      'machineBomList',
      'bomDetailList',
    ]),
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    rules() {
      return this.$getMachineRules();
    },
    contentHeight() {
      return this.clientheight - 160;
    },
    moduleName() {
      return this.$route.name;
    },
    deviceCode() {
      return this.$route.params.id;
    },
    deviceName() {
      return this.$route.params.name;
    },
    isAddDiabled() {
      // if (this.activefloder.length) {
      //   if (this.activefloder[0]) {
      //     return false;
      //   }
      // }
      // return true;
      return false; // 增加按钮保持高亮
    },
    isEditDiasbled() {
      if (this.activefloder.length) {
        if (this.activefloder[0]) {
          return this.activefloder[0].bomLevel === 0;
        }
      }
      return this.activefloder.length === 0;
    },
    isDeleteDisbled() {
      // if (this.activefloder.length) {
      //   if (this.activefloder[0]) {
      //     return this.bomDetailList
      //       ? this.bomDetailList.length > 0 : false;
      //   }
      // }
      // return true;
      return !this.activefloder.length;
    },
  },
};
</script>
