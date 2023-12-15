<template>
  <v-responsive :max-width="250">
    <v-checkbox
      class="ml-2"
      dense
      hide-details
      :disabled="disabled"
      v-model="value"
      @change="handleChangeValue"
    ></v-checkbox>
  </v-responsive>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

export default {
  props: {
    tableitem: {
      type: Object,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      loading: false,
      value: '',
    };
  },
  watch: {
    tableitem: {
      handler(tableitem) {
        this.value = tableitem[this.tag];
      },
      immediate: true,
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('spc', ['updateRecordById']),
    async handleChangeValue(value) {
      this.loading = true;
      const payload = {
        [this.tag]: value ? 1 : 0,
      };
      const result = await this.updateRecordById({
        elementName: this.tableitem.elementName,
        id: this.tableitem.id,
        payload,
      });
      this.loading = false;
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
      }
      this.$emit('getTableList');
    },
  },
};
</script>
