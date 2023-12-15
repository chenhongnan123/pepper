<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="800px"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden">
      <v-row>
        <v-col :cols="6">
          <v-card-title primary-title>
            <span>
              {{
                this.selectedTableList.length > 0
                  ? $t('spc.dialog.editdatasource')
                  : $t('spc.dialog.adddatasource')
              }}
            </span>
          </v-card-title>
          <v-card-text :max-height="'320px'">
            <v-form ref="leftform" lazy-validation>
              <v-autocomplete
                class="mt-4"
                dense
                :label="`${$t('spc.table.tablename')}*`"
                clearable
                v-model="tabledataobj.tablename"
                :items="tablelist"
                item-text="text"
                item-value="value"
                :rules="rules.isrequired"
                @change="nameChange"
              >
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.text }}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
              <v-text-field
                class="mt-4"
                dense
                :label="`${$t('spc.table.tablenumber')}*`"
                v-model="tabledataobj.tablenumber"
                disabled
              ></v-text-field>
              <!-- <v-text-field
                class="mt-4"
                dense
                :label="`${$t('spc.table.tabledescription')}*`"
                v-model="tabledataobj.tabledescription"
                disabled
              ></v-text-field> -->
            </v-form>
            <v-switch
              class="mt-4"
              :label="tabledataobj.active ? $t('spc.table.active') : $t('spc.table.inactive')"
              v-model="tabledataobj.active"
              hide-details
              style="width: 100px;"
            ></v-switch>
          </v-card-text>
        </v-col>
        <v-col :cols="6">
          <v-card-title primary-title>
            <span>
              {{ $t('spc.dialog.tablecolumn') }}
            </span>
            <v-spacer></v-spacer>
            <v-btn
              icon
              small
              @click="dialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text style="height: 320px; overflow: auto;">
            <v-form ref="rightform" lazy-validation>
                <div
                  :key="index"
                  v-for="(data, index) in tabledataobj.columns"
                >
                  <div class="selectContainer">
                    <span class="no mr-2">
                      {{ index + 1}}.
                    </span>
                    <v-text-field
                      clearable
                      :rules="rules.number"
                      :label="`${$t('spc.table.columnnumber')}*`"
                      :counter="20" v-model="data.number"
                      :disabled="selectedTableList.length > 0"
                    ></v-text-field>
                    <span
                      v-if="selectedTableList.length === 0"
                      class="addBtns"
                    >
                      <v-btn
                        :id="`add-${index}`"
                        icon
                        small
                        class="mx-2"
                        @click="addColumn"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                      <v-btn
                        :id="`remove-${index}`"
                        icon
                        small
                        class="pa-0"
                        @click="removeColumn(index)"
                        :disabled="tabledataobj.columns.length === 1">
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>
                    </span>
                  </div>
                  <v-select
                    dense
                    class="mt-3"
                    :label="`${$t('spc.table.columnname')}*`"
                    v-model="data.name"
                    :items="columnlist"
                    :disabled="loading"
                    item-text="text"
                    item-value="value"
                    :rules="rules.isrequired"
                  ></v-select>
                  <v-text-field
                    dense
                    class="mt-3"
                    clearable
                    :label="`${$t('spc.table.columndescription')}*`"
                    v-model="data.description"
                    :rules="rules.isrequired"
                    :disabled="loading"
                  ></v-text-field>
                  <v-select
                    dense
                    class="mt-4"
                    :label="`${$t('spc.table.type')}*`"
                    v-model="data.type"
                    :items="columntypelist"
                    item-text="name"
                    item-value="value"
                    :rules="rules.isrequired"
                    :disabled="loading"
                  ></v-select>
                  <v-divider
                    v-if="(index+1)!=tabledataobj.columns.length" class="mb-4 mt-4"
                  ></v-divider>
                </div>
                </v-form>
          </v-card-text>
          <v-card-actions class="mt-4 mb-2">
            <v-spacer></v-spacer>
            <v-btn
              color="warning"
              small
              text
              class="mr-2"
              @click="reset"
              v-if="selectedTableList.length === 0"
            >
              {{ $t('spc.btn.reset') }}
            </v-btn>
            <v-btn
              color="primary"
              small
              class="text-none"
              @click="handleSave"
              :disabled="loading"
            >
              {{ $t('spc.btn.save') }}
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
} from 'vuex';

export default {
  name: 'addDataSource',
  data() {
    return {
      tabledataobj: {
        tablename: '',
        tablenumber: '',
        columns: [{
          name: '',
          number: '',
          description: '',
          type: 1,
        }],
        active: 1,
      },
      loading: false,
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
    selectedTableList: {
      type: Array,
    },
    columntypelist: {
      type: Array,
    },
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState('spc', ['elements', 'dataTableList']),
    dialog: {
      get() {
        return this.addDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    tablelist() {
      const list = this.dataTableList.map((item) => {
        const obj = {
          text: item.description, // 数据表描述
          value: item.lookup_code, // 数据表名称
          id: item.lookup_id, // 数据表id
          number: item.meaning, // 数据表编号
          status: item.enabled_flag, // 数据表状态1启用0禁用
        };
        return obj;
      });
      return list;
    },
    columnlist() {
      const { tablename } = this.tabledataobj;
      const taglist = this.elements.filter((item) => item.element.elementName === tablename);
      if (taglist.length > 0) {
        const { tags } = taglist[0];
        const list = tags.map((item) => {
          const obj = {
            text: item.tagDescription,
            value: item.tagName,
          };
          return obj;
        });
        return list;
      }
      return [];
    },
    // 是否选择表格名称
    tableselected() {
      return this.tabledataobj.name && this.tabledataobj.name !== '';
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('spc', ['getElements', 'getDataTableList', 'postRecord', 'postBulkRecords', 'updateRecordById']),
    async init() {
      this.loading = true;
      await this.getElements();
      await this.getDataTableList();
      this.loading = false;
    },
    nameChange() {
      const id = this.tabledataobj.tableid;
      const list = this.tablelist.filter((item) => item.value === id);
      if (list.length > 0) {
        this.tabledataobj.tablename = list[0].name;
        this.tabledataobj.tablenumber = list[0].number;
        this.tabledataobj.tabledescription = list[0].text;
      } else {
        this.tabledataobj.tablename = '';
        this.tabledataobj.tablenumber = '';
        this.tabledataobj.tabledescription = '';
      }
    },
    addColumn() {
      this.tabledataobj.columns.push({
        name: '',
        number: '',
        description: '',
        type: 1,
      });
    },
    removeColumn(index) {
      this.tabledataobj.columns.splice(index, 1);
    },
    checkFormValid() {
      if (!this.$refs.leftform.validate()
      || (this.$refs.rightform && !this.$refs.rightform.validate())) {
        return false;
      }
      return true;
    },
    async handleSave() {
      if (!this.checkFormValid()) {
        return;
      }
      const {
        tableid,
        tablenumber,
        columns,
        active,
      } = this.tabledataobj;
      const payload = columns.map((item) => {
        const obj = {
          name: item.name,
          number: item.number,
          description: item.description,
          tablenumber,
          tableid,
          type: item.type,
          active: active ? 1 : 0,
          systemlock: 0,
        };
        return obj;
      });
      let editpayload = {};
      if (this.selectedTableList.length > 0) {
        [editpayload] = payload;
        editpayload.id = this.selectedTableList[0].id;
        // console.log(editpayload, 'editpayload');
      }
      // console.log(payload, 'payload');
      this.loading = true;
      let result = null;
      if (this.selectedTableList.length > 0) {
        result = await this.updateRecordById({
          elementName: 'spcdatasource',
          id: this.selectedTableList[0].id,
          payload: editpayload,
        });
        this.loading = false;
      } else {
        result = await this.postBulkRecords({
          elementName: 'spcdatasource',
          payload,
        });
        this.loading = false;
      }
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.$emit('getTableList');
        this.dialog = false;
      }
    },
    reset() {
      if (this.$refs.leftform) {
        this.$refs.leftform.reset();
      }
      if (this.$refs.rightform) {
        this.$refs.rightform.reset();
      }
      this.$nextTick(() => {
        this.tabledataobj = {
          tableid: '',
          tablename: '',
          tablenumber: '',
          tabledescription: '',
          columns: [{
            name: '',
            number: '',
            description: '',
            type: 1,
          }],
          active: 1,
        };
      });
    },
  },
  watch: {
    dialog(dialog) {
      if (!dialog) {
        return;
      }
      const { selectedTableList } = this;
      if (selectedTableList.length === 0) {
        this.reset();
        return;
      }
      const {
        name,
        number,
        description,
        type,
        tableid,
        tablenumber,
        tablename,
        tabledescription,
        active,
      } = selectedTableList[0];
      this.$nextTick(() => {
        this.tabledataobj = {
          tableid,
          tablenumber,
          tablename,
          tabledescription,
          columns: [{
            name,
            number,
            description,
            type,
          }],
          active: active ? 1 : 0,
        };
      });
    },
  },
};
</script>
<style scoped>
.selectContainer {
  display: flex;
  width: 100%;
}
.no{
  line-height: 64px;
  font-size: 20px;
}
.addBtns{
  line-height: 64px;
}
</style>
