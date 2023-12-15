<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <div
          class="d-flex justify-space-between"
        >
          <span
            v-bind="attrs"
            v-on="on"
          >
            {{ rowData[field] }}
          </span>
        </div>
      </template>
      <div style="width: 100%;">
        {{ rowData[field] }}
      </div>
    </v-tooltip>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  components: {
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    rowData() {
      return this.params.data;
    },
    field() {
      return this.params.field;
    },
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
</style>
