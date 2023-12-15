<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.roleManagement">
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
          height="98"
          class="mb-3 py-2 px-4"
          elevation="0"
          color="bg"
        >
          <v-row no-gutters>
            <v-col>
              <div class="text-h6 font-weight-medium">
                {{$t('roadmapManagement.label.roadmapInfo')}}
              </div>
            </v-col>
          </v-row>
          <v-row no-gutters class="mt-1">
            <v-col cols="4">
              <div class="text-caption subtitle--text">{{$t('roadmapManagement.label.name')}}</div>
              <div class="text-subtitle-2 mt-1">{{curRoadmap.roadmapName || '-'}}</div>
            </v-col>
            <v-col cols="4">
              <div class="text-caption subtitle--text">
                {{$t('roadmapManagement.label.version')}}
              </div>
              <div class="text-subtitle-2 mt-1">{{curRoadmap.roadmapVersion || '-'}}</div>
            </v-col>
            <v-col cols="4">
              <div class="text-caption subtitle--text">
                {{$t('roadmapManagement.label.product')}}
              </div>
              <div class="text-subtitle-2 mt-1">{{curRoadmap.productName || '-'}}</div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="2">
        <v-card
          :height="tableHeight"
          class="py-2 px-4"
          elevation="0"
          color="bg"
        >
          <v-row no-gutters>
            <v-col>
              <div class="text-h6 font-weight-medium">
                {{$t('roadmapManagement.label.process')}}
              </div>
            </v-col>
          </v-row>
           <v-text-field
            class="mt-1"
            clearable
            :placeholder="`${$t('roadmapManagement.label.searchProcess')}`"
            v-model="searchProcess"
            append-icon="mdi-magnify"
            dense
            hide-details
          ></v-text-field>
          <perfect-scrollbar
            :style="`height: ${tableHeight - 66}px;`"
            class="py-2"
          >
            <v-list-item
              v-for="(item, j) in filterProcessList"
              :key="`${item.processId}-${j}`"
              class="my-2 drag-item"
              :style="`--dragbg-color:${primaryColor10}`"
              dense
              draggable="true"
              @dragstart="drag(item, 1)"
            >
              <v-list-item-icon>
                <v-icon color="primary">mdi-drag</v-icon>
              </v-list-item-icon>
              <v-list-item-subtitle
                class="primary--text"
              >{{item.processName}}</v-list-item-subtitle>
            </v-list-item>
          </perfect-scrollbar>
        </v-card>
      </v-col>
      <v-col cols="10" class="pl-2">
        <v-card
          :height="tableHeight"
          class="py-2 px-4"
          elevation="0"
          color="bg"
          @dragover="allowDrop"
          @drop="drop"
        >
          <div class="d-flex">
            <v-spacer></v-spacer>
            <v-btn
              small
              class="text-none mr-2"
              color="error"
              @click="handleDelete"
              :disabled="selectedList === 0"
              v-if="isBtnAccess('basic:roadmap:remove')"
            >
              <v-icon left small>mdi-delete</v-icon>
              {{ $t('btn.delete') }}
            </v-btn>
            <v-btn
              small
              outlined
              class="text-none"
              color="primary"
              @click="handleSave"
              v-if="isBtnAccess('basic:roadmap:add')"
            >
              <v-icon left small>mdi-content-save-outline</v-icon>
              {{ $t('btn.save') }}
            </v-btn>
          </div>
          <div
            :style="`height: ${tableHeight - 44}px;`"
            class="py-2 drag-area overflow-y-auto"
          >
            <draggable v-model="roadmapDetailList" animation="300">
              <div
                v-for="(item, key) in roadmapDetailList"
                :key="`${item.processId}-${key}`"
                class="d-flex align-center mb-14"
                @dragstart="drag(item, 2)"
              >
                <v-checkbox
                  v-model="selectedList"
                  color="primary"
                  :value="item.processId"
                  hide-details
                  class="mt-0 ml-4"
                  :key="item.processId"
                ></v-checkbox>
                <div
                  class="ml-4 primary--text drag-index d-flex align-center justify-center"
                  :style="`--dragbg-color:${primaryColor10}`"
                >
                  <span>{{key + 1}}</span>
                </div>
                <v-list-item
                  class="my-2 drag-item ml-8"
                  dense
                  :style="`--dragbg-color:${primaryColor10}`"
                >
                  <v-list-item-icon>
                    <v-icon color="primary">mdi-drag</v-icon>
                  </v-list-item-icon>
                  <v-list-item-subtitle
                    class="primary--text"
                  >{{item.processName}}</v-list-item-subtitle>
                </v-list-item>
              </div>
            </draggable>
            <template v-if="roadmapDetailList.length">
              <div
                v-for="i in roadmapDetailList.length - 1"
                :key="`line-${i}`"
                class="drag-bg-line"
                :style="`--dragline-top:${70 + 114 * (i - 1)}px`"
              ></div>
            </template>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import draggable from 'vuedraggable';
import Color from 'color';

export default {
  name: 'roadmapDetail',
  components: {
    draggable,
  },
  data() {
    return {
      tableHeight: document.body.clientHeight - 240,
      searchProcess: '',
      curRoadmap: {},
      selectedList: [],
      roadmapDetailList: [],
      dragItem: null,
      dragType: 1, // 1是左拖右复制，2是右边拖拽排序
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapState('roadmapManagement', [
      'processList',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
    curRoadmapId() {
      return Number(this.$route.params.id) || null;
    },
    // 父页面名称
    pageName() {
      return this.$route.params.page;
    },
    filterProcessList() {
      const { searchProcess, processList } = this;
      return processList.filter((item) => item.processName.indexOf(searchProcess) > -1);
    },
    primaryColor10() {
      let primaryColor = '';
      if (this.$vuetify.theme.isDark) {
        primaryColor = this.$vuetify.theme.themes.dark.primary;
      } else {
        primaryColor = this.$vuetify.theme.themes.light.primary;
      }
      if (!primaryColor) {
        return 'rgba(0, 85, 194, 0.1)';
      }
      const { color } = Color(primaryColor).rgb();
      return `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.1)`;
    },
  },
  activated() {
  },
  created() {
    this.getTableList();
  },
  deactivated() {
  },
  methods: {
    ...mapActions('roadmapManagement', [
      'getRoadmapDetailList',
      'getProcessList',
      'getRoadmapById',
      'updateRoadmapDetail',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    refresh() {
      this.getTableList();
    },
    async getTableList() {
      await this.getProcessList();
      this.curRoadmap = await this.getRoadmapById(this.curRoadmapId);
      this.roadmapDetailList = await this.getRoadmapDetailList(this.curRoadmapId);
      this.selectedList = [];
    },
    async handleDelete() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.tips'),
        this.$t('dialog.deleterecordconfirm'),
      )) {
        const { roadmapDetailList, selectedList } = this;
        const list = roadmapDetailList
          .filter((item) => !selectedList.some((subitem) => subitem === item.processId));
        this.roadmapDetailList = list;
        this.selectedList = [];
      }
    },
    async handleSave() {
      const { roadmapDetailList, curRoadmapId } = this;
      const payload = {
        roadmapId: curRoadmapId,
        payload: this.reOrderList(roadmapDetailList),
      };
      const result = await this.updateRoadmapDetail(payload);
      if (result) {
        this.refresh();
      }
    },
    reOrderList(list) {
      return list.map((item, index) => {
        const obj = {
          ...item,
          processSort: index + 1,
        };
        return obj;
      });
    },
    goBack() {
      this.$router.push({ name: this.pageName });
    },
    allowDrop(ev) {
      ev.preventDefault();
    },
    drop() {
      // console.log(ev);
      const {
        dragItem, roadmapDetailList, curRoadmapId, dragType,
      } = this;
      if (dragItem && dragType === 1) {
        if (roadmapDetailList.some((item) => item.processId === dragItem.processId)) {
          this.$root.$confirm.open(
            this.$t('dialog.tips'),
            this.$t('roadmapManagement.dialog.processRepetition', { name: dragItem.processName }),
          );
        } else {
          const item = {
            processId: dragItem.processId,
            processName: dragItem.processName,
            processSort: roadmapDetailList.length + 1,
            roadmapId: curRoadmapId,
          };
          this.roadmapDetailList.push(item);
        }
      }
    },
    drag(item, type) {
      this.dragItem = item;
      this.dragType = type;
    },
  },
};
</script>
