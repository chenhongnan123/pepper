<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.onlineUser">
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
            <v-spacer></v-spacer>
            <v-btn
              outlined
              small
              class="text-none mr-2"
              color="error"
              :disabled="selectedTableList.length === 0"
              v-if="isBtnAccess('monitor:online:batchLogout')"
              @click="handleDelete"
            >
              <v-icon left small>mdi-delete</v-icon>
              {{ $t('onlineUser.btn.refund') }}
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
                ref="dictManagementGrid"
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

export default {
  name: 'onlineUser',
  components: {
    BaseGrid,
  },
  data() {
    return {
      elementName: 'onlineUser',
      tableHeight: document.body.clientHeight - 210,
      onlineUserHeaders: [
        'no',
        'tokenId',
        'userName',
        'ipaddr',
        'browser',
        'loginLocation',
        // 'os',
        'loginTime',
        // 'action',
      ],
      options: {
        headers: [],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        rowDataId: 'tokenId', // 传递对象的唯一标识符
        height: document.body.clientHeight - 240,
        rowHeight: 35,
        pagination: true,
      },
      selectedTableList: [],
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('onlineUser', [
      'onlineList',
    ]),
    moduleName() {
      return this.$route.name;
    },
  },
  created() {
    this.getTableList();
    this.initTableHeaders();
  },
  methods: {
    ...mapActions('onlineUser', [
      'getOnlineList',
      'refundUser',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    refresh() {
      this.getTableList();
      this.selectedTableList = [];
    },
    async getTableList() {
      await this.getOnlineList();
      this.options.rowData = this.onlineList;
    },
    async handleDelete() {
      if (await this.$root.$confirm.open(
        this.$t('onlineUser.dialog.refundtip'),
        this.$t('onlineUser.dialog.refund'),
      )) {
        const tokenIds = [];
        this.selectedTableList.forEach((item) => {
          tokenIds.push(item.tokenId);
        });
        const result = await this.refundUser(tokenIds);
        if (result) {
          this.refresh();
        }
      }
    },
    initTableHeaders() {
      let headers = [];
      headers = this.onlineUserHeaders.map((item, index) => {
        const obj = {
          field: item,
          headerName: this.$t(`onlineUser.table.${item}`),
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
