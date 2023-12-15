<template>
  <div
    @click.enter="handleClick"
    @keyup.enter="handleClick"
    role="button"
    tabindex="0"
    style="color: var(--v-primary-base); cursor: pointer;"
  >
    <span
      :class="'text-decoration-underline primary--text'"
    >
        {{ rowData.deviceNumber }}
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    rowData() {
      return this.params.data;
    },
    workshopId() {
      return this.params.workshopId;
    },
  },
  methods: {
    handleClick() {
      const {
        deviceId,
      } = this.rowData;
      let path = `/machine-list/detail?deviceId=${deviceId}`;
      if (this.workshopId) {
        path += `&workshopId=${this.workshopId}`;
      }
      this.$router.push({
        path,
      });
    },
  },
};
</script>
