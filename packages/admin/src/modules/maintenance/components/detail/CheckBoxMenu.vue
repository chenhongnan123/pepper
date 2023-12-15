<template>
  <div>
    <v-checkbox
      v-model="status"
      color="primary"
      @click="handleSwitch"
      class="mt-0"
      readonly
      :disabled="!isBtnAccess('maintenance_detail_edit')"
    ></v-checkbox>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      status: false,
    };
  },
  created() {
    const { params } = this;
    this.status = params && params.value === 'Y';
  },
  components: {},
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
  },
  methods: {
    ...mapActions('maintenance', ['updateCheckItem']),
    async handleSwitch() {
      if (!this.isBtnAccess('maintenance_detail_edit')) {
        return;
      }
      if (
        await this.$root.$confirm.open(
          this.$t('dialog.tips'),
          this.$t('maintenance.dialog.detailRequiredConfirm'),
        )
      ) {
        const {
          params: {
            that,
            data: { id },
          },
          status,
        } = this;
        const payload = {
          id,
          required: !status ? 'Y' : 'N',
        };
        const result = await this.updateCheckItem(payload);
        if (result) {
          that.getTableList();
        }
      }
    },
  },
};
</script>
