<template>
  <div>
    <v-card id="viewCard" :height="height">
      <v-card-title
        dense
        style="background-color: var(--v-primary-base);"
      >
        <span
          style="color: white;"
        >
          {{ $t('dataAnalysis.modules.view') }}
        </span>
      </v-card-title>
      <v-card-text :height="height - 36">
        <div style="overflow-y: auto;height: 100%;width: 100%;">
          <v-data-table
            id="viewtable"
            :headers="headers"
            :items="list"
            item-key="id"
            class="elevation-1 mt-1"
            dense
            :search="search"
            hide-default-header
            hide-default-footer
            :custom-filter="searchFilter"
            :no-data-text="`${$t('dataAnalysis.table.nodatatext')}`"
            @click:row="selectRow"
            single-select
            :height="height - 120"
            style="width: 100%;"
            v-model="selectedRows"
            disable-pagination
          >
            <!-- 顶部插槽放搜索框 -->
            <template v-slot:top>
              <v-text-field
                v-model="search"
                dense
                flat
                style="width: 60%;"
                class="mt-4 ml-2"
                append-icon="mdi-magnify"
                :label="`${$t('dataAnalysis.btn.searchview')}`"
              ></v-text-field>
            </template>
            <!-- eslint-disable-next-line -->
            <!-- <template #item.value="{ item }">
              <div>
                <div style="display: inline-block;width: 12%;">
                  <v-icon small>mdi-chart-bell-curve-cumulative</v-icon>
                </div>
                <div
                  class="text-truncate"
                  style="display: inline-block;vertical-align: bottom;"
                >
                  {{ item.value }}
                </div>
              </div>
            </template> -->
            <!-- eslint-disable-next-line -->
            <template #item.action="{ item }">
              <v-btn
                v-if="isBtnAccess('basic:view:edit')"
                dense
                small
                icon
                @click="editView(item)"
                color="primary"
              >
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                v-if="isBtnAccess('basic:view:remove')"
                dense
                small
                icon
                @click="deleteView(item)"
                color="error"
              >
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import {
  mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';

export default {
  data() {
    return {
      search: '', // 搜索输入值
      headers: [
        {
          text: 'View Name',
          align: 'start',
          sortable: false,
          value: 'viewName',
        },
        {
          text: 'Action',
          align: 'end',
          sortable: false,
          value: 'action',
        },
      ],
      selectedRows: [], // 表格选中行数据
      editOrDel: false,
    };
  },
  props: {
    list: {
      type: Array,
      required: true,
    }, // 视图列表
    height: {
      type: Number,
      default: 250,
    }, // 视图列表高度
  },
  created() {
    this.resetSelect();
    this.clearEditDelStatus();
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('dataAnalysis', ['deleteViewById']),
    searchFilter(value, search) {
      if (search === '') {
        return true;
      }
      return value != null && search != null && typeof value === 'string'
        && value.toString().toLocaleUpperCase().indexOf(search.toLocaleUpperCase()) !== -1;
    },
    resetSelect() {
      this.selectedRows = [];
    },
    // 单击行表示选择当前行数据
    selectRow(item, row) {
      // console.log(item, row, 'selectRow');
      // 非编辑、删除状态下，选择表格行自动写入视图信息
      if (!this.editOrDel) {
        // 更改row选中状态
        row.isSelected = !row.isSelected;
        row.select(row.isSelected);
        if (row.isSelected) {
          // 选中则写入参数
          this.$emit('setViewParameters', item);
        } else {
          // 去选中时清空选项参数
          this.$emit('resetView');
        }
      }
    },
    // 编辑行按钮点击事件
    editView(item) {
      // 打开编辑状态
      this.editOrDel = true;
      this.$emit('emitEditView', item);
    },
    clearEditDelStatus() {
      this.editOrDel = false;
    },
    // 删除按钮点击事件
    async deleteView(item) {
      this.editOrDel = true;
      if (await this.$root.$confirm.open(
        this.$t('dataAnalysis.dialog.deleterecord'),
        this.$t('dataAnalysis.dialog.deleterecordconfirm'),
      )) {
        const result = await this.deleteViewById(item.id);
        if (result) {
          this.$emit('getTableList');
        }
      }
      // 清空编辑或删除状态
      this.clearEditDelStatus();
    },
  },
};
</script>
<style scoped>
  .highlight{
    background-color: var(--v-primary-base) !important;
  }

  #viewCard /deep/ .v-card__title{
    font-size: 1rem;
    line-height: 1rem;
    padding: 10px 16px 10px 16px;
  }

  .theme--light /deep/ .v-data-table__selected {
    background-color: rgba(27,31,35,.15) !important;
  }
</style>
