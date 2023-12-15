<template>
  <div>
    <v-btn
      small
      icon
      color="success"
      @click="addDialog = true"
      v-if="isBtnAccess('basic:board:edit')"
    >
      <v-icon>mdi-square-edit-outline</v-icon>
    </v-btn>
    <add-dialog
      :addDialog="addDialog"
      :selectedItem="rowData"
      @closeDialog="addDialog = false"
      @getTableList="refresh"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AddDialog from './AddDialog.vue';

export default {
  data() {
    return {
      addDialog: false,
    };
  },
  created() {
    // console.log(this.params);
  },
  components: {
    AddDialog,
  },
  computed: {
    ...mapGetters('user', [
      'isBtnAccess',
    ]),
    // 当前行数据
    rowData() {
      const { params } = this;
      return params ? params.data : {};
    },
  },
  methods: {
    ...mapActions('dashboardSetting', []),
    // 刷新表格数据
    refresh() {
      this.params.that.refresh();
    },
  },
};
</script>
