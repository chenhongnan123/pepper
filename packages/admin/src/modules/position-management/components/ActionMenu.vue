<template>
  <div>
    <v-btn
      small
      icon
      color="error"
      @click="handleDelete"
    >
      <v-icon>mdi-trash-can-outline</v-icon>
    </v-btn>
    <v-btn
      small
      icon
      color="success"
      @click="editDialog = true"
      v-if="isBtnAccess('positionManagement_main_edit')"
    >
      <v-icon>mdi-square-edit-outline</v-icon>
    </v-btn>
    <edit-dialog
      :editDialog="editDialog"
      @closeDialog="editDialog = false"
      @getTableList="refresh"
      :selectedTableList="selectedTableList"
      :rules="rules"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import EditDialog from './EditPositionDialog.vue';

export default {
  data() {
    return {
      editDialog: false,
    };
  },
  created() {
  },
  components: {
    EditDialog,
  },
  computed: {
    ...mapGetters('user', [
      'isBtnAccess',
    ]),
    rules() {
      return this.$getPositionRules();
    },
    postId() {
      const { params } = this;
      return params ? params.data.postId : null;
    },
    selectedTableList() {
      const { params } = this;
      return params ? [params.data] : [];
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('positionManagement', [
      'delPosition',
    ]),
    refresh() {
      this.params.that.init();
    },
    async handleDelete() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.deleterecord'),
        this.$t('dialog.deleterecordconfirm'),
      )) {
        const { postId } = this;
        const result = await this.delPosition(postId);
        if (result) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'successAction',
          });
          this.refresh();
        }
      }
    },
    handleEdit() {
      const { params } = this;
      this.parentName = params ? params.data.parentName : null;
      this.isNew = false;
      this.addDialog = true;
    },
    handleAdd() {
      const { params } = this;
      this.menuType = params ? params.data.menuType : null;
      this.parentId = params ? params.data.parentId : null;
      this.parentName = params ? params.data.parentName : null;
      this.isNew = false;
      this.addDialog = true;
    },
  },
};
</script>
