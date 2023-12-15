<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'960px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            $t('roleManagement.dialog.selectUser')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false" color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-row
            justify="center"
            class="mt-3"
          >
            <v-col cols="12" >
              <base-grid
                ref="selectUserGrid"
                :elementName="elementName"
                :restoreColumn="true"
                :options="options"
                v-model="selectedTableList"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          small
          class="text-none"
          @click="handleSave"
          :disabled="selectedTableList.length === 0"
        >
          {{$t('btn.save')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
} from 'vuex';

import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import StatusMenu from './StatusMenu.vue';

export default {
  name: 'selectUserDialog',
  data() {
    return {
      elementName: 'selectUser',
      selectUserGridApi: null,
      options: {
        headers: [
          {
            field: 'no',
            headerName: 'roleManagement.table.no',
            filter: 'agTextColumnFilter',
            checkboxSelection: true,
            headerCheckboxSelection: true,
          },
          {
            field: 'userName',
            headerName: 'roleManagement.table.userAccount',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'nickName',
            headerName: 'roleManagement.table.userNickname',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'email',
            headerName: 'roleManagement.table.email',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'status',
            headerName: 'roleManagement.table.userStatus',
            filter: 'agTextColumnFilter',
            cellRendererSelector: () => ({
              component: 'StatusMenu',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'createTime',
            headerName: 'roleManagement.table.createTime',
            filter: 'agTextColumnFilter',
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: 400,
        rowHeight: 35,
      },
      selectedTableList: [],
    };
  },
  props: {
    selectUserDialog: {
      type: Boolean,
      required: true,
    },
    roleId: {
      type: Number,
    },
  },
  components: {
    BaseGrid,
    StatusMenu,
  },
  computed: {
    ...mapState('roleManagement', ['unAssginUserList']),
    dialog: {
      get() {
        return this.selectUserDialog;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('roleManagement', ['getUnAssginUserList', 'selectAuthUser']),
    async handleSave() {
      const {
        selectedTableList,
        roleId,
      } = this;
      let userIds = '';
      selectedTableList.forEach((item) => {
        userIds += userIds ? `,${item.userId}` : item.userId;
      });
      const result = await this.selectAuthUser({
        roleId,
        userIds,
      });
      if (result) {
        this.$emit('getTableList');
        this.dialog = false;
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      const {
        roleId,
      } = this;
      if (!roleId) {
        return;
      }
      await this.getUnAssginUserList(roleId);
      this.$refs.selectUserGrid.gridApi.deselectAll();
      this.options.rowData = this.unAssginUserList;
    },
  },
};
</script>
