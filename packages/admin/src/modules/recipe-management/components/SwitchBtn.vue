<template>
  <v-responsive :max-width="250" class="custom-switch">
    <v-switch
      v-model="value"
      class="ml-4 mt-1"
      hide-details
      readonly
      dense
      @click="handleChangeValue"
      ></v-switch>
  </v-responsive>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

export default {
  name: 'SwitchBtn',
  data() {
    return {
      value: false,
    };
  },
  computed: {
    curRowinfo() {
      return this.params.data;
    },
    field() {
      return this.params.field;
    },
    init() {
      return this.params.init;
    },
    changeStatus() {
      return this.params.changeStatus;
    },
  },
  watch: {
    curRowinfo: {
      handler() {
        this.value = Number(this.curRowinfo[this.field]) === 0;
      },
      immediate: true,
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('recipeManagement', ['getBasicList']),
    async handleChangeValue() {
      const recipeVersion = await this.vertifyHasExistingActivedDevice();
      if (!this.value && recipeVersion) {
        if (
          !(await this.$root.$confirm.open(
            this.$t('dialog.changerecord'),
            `当前设备现启用配方为 ${recipeVersion}，是否将其关闭并启用 ${this.curRowinfo.recipeVersion}`,
          ))
        ) {
          return;
        }
      } else if (
        !(await this.$root.$confirm.open(
          this.$t('dialog.changerecord'),
          this.$t('dialog.activechangeconfirm'),
        ))
      ) {
        return;
      }
      this.value = !this.value;
      const payload = {
        ...this.curRowinfo,
        [this.field]: this.value ? 0 : 1,
      };
      const result = await this.changeStatus(payload);
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
      }
      this.init();
    },
    async vertifyHasExistingActivedDevice() {
      const {
        recipeType,
        deviceId,
      } = this.curRowinfo;
      const payload = {
        elementName: 'recipe',
        query: `&recipeType=${recipeType}&deviceId=${deviceId}&status=0`,
        disableAlert: true,
      };
      const recipeList = await this.getBasicList(payload);
      if (recipeList && recipeList.length > 0) {
        return recipeList[0].recipeVersion;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
  .custom-switch {
    ::v-deep .v-input--selection-controls {
      margin-top: -2px!important;
    }
  }
</style>
