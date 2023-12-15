<template>
  <div>
    <template v-if="isnew">
      <v-btn
        icon
        small
        color="primary"
        class="mr-1"
        @click="addAdminDialog = true"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <template v-else>
      <v-btn
        icon
        small
        color="primary"
        class="mr-1"
        @click="addAdminDialog = true"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
    <add-admin-dialog
      :addDialog="addAdminDialog"
      :factory="params.data"
      :isNew="isnew"
      @closeDialog="addAdminDialog = false"
      @getTableList="getTableList"
    />
  </div>
</template>

<script>
import AddAdminDialog from './addAdminDialog.vue';

export default {
  data() {
    return {
      addAdminDialog: false,
    };
  },
  mounted() {
    // console.log(this.params);
  },
  components: {
    AddAdminDialog,
  },
  computed: {
    isnew() {
      const { params } = this;
      return !params.data.userName;
    },
  },
  methods: {
    getTableList() {
      const { params } = this;
      params.that.init();
    },
  },
};
</script>
