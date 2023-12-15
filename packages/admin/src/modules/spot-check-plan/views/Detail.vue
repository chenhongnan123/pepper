<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.spotCheckPlanDetail">
      <v-btn
        icon
        small
        class="mr-2 mb-1"
        @click="goBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      {{ $t(`modules.${moduleName}`)  }}
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
            <v-spacer></v-spacer>
            <v-btn
              outlined
              small
              class="text-none mr-2"
              color="error"
              :disabled="selectedTableList.length === 0"
              @click="handleDelete"
              v-if="isBtnAccess('basic:check:remove')"
            >
              <v-icon left small>mdi-delete</v-icon>
              {{ $t('btn.delete') }}
            </v-btn>
            <v-btn
              :disabled="selectedTableList.length !== 1"
              outlined
              small
              class="text-none mr-2"
              color="warning"
              @click="isNew = false; addDialog = true"
              v-if="isBtnAccess('basic:check:edit')"
            >
              <v-icon left small>mdi-pencil</v-icon>
              {{ $t('btn.edit') }}
            </v-btn>
            <v-btn
              small
              class="text-none"
              color="primary"
              @click="isNew = true; addDialog = true"
              v-if="isBtnAccess('basic:check:add')"
            >
              <v-icon left small>mdi-plus</v-icon>
              {{ $t('btn.add') }}
            </v-btn>
          </div>
        </v-card>
        <v-card
          :height="tableHeight"
          class=""
          elevation="0"
          color="bg"
        >
          <v-row no-gutters class="pa-4">
            <v-col>
              <base-grid
                ref="spotCheckDetailGrid"
                :elementName="elementName"
                :restoreColumn="true"
                :options="options"
                v-model="selectedTableList"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <add-dialog
      :addDialog="addDialog"
      :isNew="isNew"
      :selectedTableList="selectedTableList"
      :checkId="checkId"
      @closeDialog="addDialog = false"
      @getTableList="refresh"
    />
  </v-container>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import AddDialog from '../components/detail/AddDialog.vue';

export default {
  name: 'spotCheckPlanDetail',
  components: {
    BaseGrid,
    AddDialog,
  },
  data() {
    return {
      elementName: 'spotCheckPlanDetail',
      tableHeight: document.body.clientHeight - 210,
      checkDetailHeaders: [
        'no',
        'checkDetailName',
        'parameterTag',
        'upperLimit',
        'lowerLimit',
        'updateBy',
        'updateTime',
      ],
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        rowDataId: 'checkDetailId', // 传递对象的唯一标识符
        height: document.body.clientHeight - 240,
        rowHeight: 35,
        pagination: true,
      },
      selectedTableList: [],
      addDialog: false,
      isNew: true,
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('spotCheckPlan', [
      'spotCheckDetailList',
    ]),
    moduleName() {
      return this.$route.name;
    },
    checkId() {
      return +this.$route.params.checkId;
    },
  },
  created() {
    this.getTableList();
    this.initTableHeaders();
  },
  methods: {
    ...mapActions('spotCheckPlan', [
      'getSpotCheckDetailList',
      'deleteSpotCheckDetail',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    refresh() {
      this.getTableList();
    },
    goBack() {
      this.$router.push({ name: 'spotCheckPlan' });
    },
    async getTableList() {
      this.selectedTableList = [];
      await this.getSpotCheckDetailList(this.checkId);
      this.options.rowData = this.spotCheckDetailList;
    },
    async handleDelete() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.deleterecord'),
        this.$t('dialog.deleterecordconfirm'),
      )) {
        const idList = [];
        this.selectedTableList.forEach((item) => {
          idList.push(item.checkDetailId);
        });
        const result = await this.deleteSpotCheckDetail(idList);
        if (result) {
          this.refresh();
        }
      }
    },
    initTableHeaders() {
      let headers = [];
      headers = this.checkDetailHeaders.map((item, index) => {
        const obj = {
          field: item,
          headerName: this.$t(`spotCheckPlan.table.${item}`),
          index,
          filter: 'agTextColumnFilter',
          checkboxSelection: index === 0,
          headerCheckboxSelection: index === 0,
        };
        if (item === 'no') {
          obj.valueGetter = 'node.rowIndex + 1';
        }
        return obj;
      });
      this.options.headers = headers;
    },
  },
};
</script>
