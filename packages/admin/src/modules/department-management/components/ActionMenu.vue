<template>
  <div>
    <v-btn
      small
      icon
      color="error"
      @click="handleDelete"
      v-if="isBtnAccess('system:dept:remove')"
    >
      <v-icon>mdi-trash-can-outline</v-icon>
    </v-btn>
    <v-btn
      small
      icon
      color="success"
      @click="handleEdit"
      v-if="isBtnAccess('system:dept:edit')"
    >
      <v-icon>mdi-square-edit-outline</v-icon>
    </v-btn>
    <v-btn
      small
      icon
      color="primary"
      @click="handleAdd"
      v-if="isBtnAccess('system:dept:add')"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <add-dialog
      :addDialog="addDialog"
      :isNew="isNew"
      :deptId="deptId"
      :type="isNew?childType:type"
      :parentId="isNew?deptId:parentId"
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
      deptId: null,
      type: null,
      childType: null,
      parentId: null,
      isNew: true,
    };
  },
  created() {
    // console.log(this.params);
    const { params } = this;
    this.deptId = params ? params.data.deptId : null;
    this.type = params ? params.data.type : null;
    this.parentId = params ? params.data.parentId : null;
  },
  components: {
    AddDialog,
  },
  computed: {
    ...mapGetters('user', [
      'isBtnAccess',
    ]),
  },
  methods: {
    ...mapActions('departmentManagement', [
      'deleteDept',
    ]),
    async refresh() {
      this.params.that.refresh();
    },
    async handleDelete() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.deleterecord'),
        this.$t('dialog.deleterecordconfirm'),
      )) {
        const { deptId } = this;
        const result = await this.deleteDept(deptId);
        if (result) {
          this.params.that.refresh();
        }
      }
    },
    handleEdit() {
      this.isNew = false;
      this.addDialog = true;
    },
    handleAdd() {
      this.isNew = true;
      if (this.type === '0') {
        this.childType = '1';
      } else if (this.type === '1') {
        this.childType = '2';
      } else if (this.type === '2') {
        this.childType = '2';
      }
      this.addDialog = true;
    },
  },
};
</script>
