<template>
  <div>
    <v-btn
      small
      text
      color="primary"
      @click="handleEdit"
      class="pl-0"
      v-if="isBtnAccess('system:source:edit')"
    >
      <v-icon>mdi-clipboard-edit-outline</v-icon>
      {{$t('dataSource.label.showSourceRule')}}
    </v-btn>
    <add-dialog
      :addDialog="addDialog"
      :isNew="false"
      :selecteditem="selecteditem"
      @closeDialog="addDialog = false"
      @getTableList="refresh"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AddDialog from './addDialog.vue';

export default {
  data() {
    return {
      addDialog: false,
      selecteditem: null,
    };
  },
  created() {
    // console.log(this.params);
    const { params } = this;
    this.selecteditem = params ? params.data : null;
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
    async refresh() {
      this.params.that.refresh();
    },
    handleEdit() {
      this.addDialog = true;
    },
  },
};
</script>
