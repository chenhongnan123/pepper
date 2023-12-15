<template>
  <div>
    <v-btn
      icon
      color="primary"
      @click="addDialog = true"
      :disabled="statusDisabled"
      v-if="isBtnAccess('basic:fault_repair:edit')"
    >
      <v-icon>mdi-square-edit-outline</v-icon>
    </v-btn>
    <add-dialog
      :addDialog="addDialog"
      :isNew="false"
      :selectedItem="selectedItem"
      @closeDialog="addDialog = false"
      @getTableList="refresh"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AddDialog from './AddDialog.vue';

export default {
  data() {
    return {
      addDialog: false,
      selectedItem: {},
    };
  },
  created() {
    // console.log(this.params);
    const { params } = this;
    this.selectedItem = params ? params.data : {};
  },
  components: {
    AddDialog,
  },
  computed: {
    ...mapGetters('user', [
      'isBtnAccess',
    ]),
    statusDisabled() {
      const { params } = this;
      return !(params && params.data.status === '0');
    },
  },
  methods: {
    async refresh() {
      this.params.that.refresh();
    },
  },
};
</script>
