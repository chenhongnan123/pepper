<template>
  <div>
    <v-btn
      small
      icon
      color="error"
      @click="handleDelete"
      :disabled="visible === '2'"
      v-if="isBtnAccess('system:menu:remove')"
    >
      <v-icon>mdi-trash-can-outline</v-icon>
    </v-btn>
    <v-btn
      small
      icon
      color="success"
      @click="handleEdit"
      v-if="isBtnAccess('system:menu:edit')"
    >
      <v-icon>mdi-square-edit-outline</v-icon>
    </v-btn>
    <v-btn
      small
      icon
      color="primary"
      @click="handleAdd"
      v-if="isBtnAccess('system:menu:add')
        && menuType !== 'F'"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <add-dialog
      :addDialog="addDialog"
      :isNew="isNew"
      :menuId="menuId"
      :menuType="isNew?childMenuType:menuType"
      :parentId="isNew?menuId:parentId"
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
      menuId: null,
      menuType: null,
      childMenuType: null,
      parentId: null,
      isNew: true,
    };
  },
  created() {
    const { params } = this;
    this.menuId = params ? params.data.menuId : null;
    this.menuType = params ? params.data.menuType : null;
    this.parentId = params ? params.data.parentId : null;
    this.visible = params ? params.data.visible : null;
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
    ...mapActions('menuManagement', [
      'deleteMenu',
    ]),
    async refresh(type) {
      this.params.that.refresh(type);
    },
    async handleDelete() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.deleterecord'),
        this.$t('dialog.deleterecordconfirm'),
      )) {
        const { menuId } = this;
        const result = await this.deleteMenu(menuId);
        if (result) {
          this.params.that.deleteRefresh(this.params.data);
        }
      }
    },
    handleEdit() {
      this.isNew = false;
      this.addDialog = true;
    },
    handleAdd() {
      console.log(this.menuType, 'this.menuType');
      this.isNew = true;
      if (this.menuType === 'B') {
        this.childMenuType = 'M';
      } else if (this.menuType === 'M') {
        this.childMenuType = 'C';
      } else if (this.menuType === 'C') {
        this.childMenuType = 'F';
      }
      this.addDialog = true;
    },
  },
};
</script>
