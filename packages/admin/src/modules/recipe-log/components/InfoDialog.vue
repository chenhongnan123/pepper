<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'650px'"
  >
    <v-card style="overflow: hidden">
      <v-card-title primary-title>
        <span> 手动配方日志详情 </span>
        <v-spacer></v-spacer>
        <v-btn
          icon
          small
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height: 530px; overflow-y: auto">
        <v-row class="mt-1">
          <v-col :cols="12">
            <div class="body-2">
              <span class="font-weight-bold text-h6"> {{ recipeLogObj.createTime }} </span>
            </div>
          </v-col>
          <v-col :cols="12">
            <div class="body-2">
              <span class="font-weight-bold"> 下发结果详情： </span>
              <span class="ml-2">
                {{ recipeLogObj.errorParam }}
              </span>
            </div>
          </v-col>
          <v-col :cols="12">
            <div class="body-2">
              <span class="font-weight-bold"> 写入PLC配方参数 </span>
            </div>
            <json-viewer
              class="mt-2"
              :value="recipeLogObj?.writeParam"
              :expand-depth="5"
              boxed
              sort
              :expanded="false"
              :preview-mode="false"
            >
            </json-viewer>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="mb-2">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          small
          class="text-none"
          @click="dialog = false"
          >{{ $t('btn.close') }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import JsonViewer from 'vue-json-viewer';

export default {
  name: 'InfoDialog',
  data() {
    return {
      recipeLogObj: {
        writeParam: {},
      },
    };
  },
  components: {
    JsonViewer,
  },
  props: {
    infoDialog: {
      type: Boolean,
      required: true,
    },
    recipeLogId: {
      type: Number,
    },
  },
  computed: {
    ...mapState('recipeLog', ['recipeLogInfo']),
    dialog: {
      get() {
        return this.infoDialog;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
  },
  methods: {
    ...mapActions('recipeLog', ['getRecipeLogInfo']),
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      await this.getRecipeLogInfo(this.logId);
      const { writeParam } = this.recipeLogInfo;
      this.recipeLogObj = {
        ...this.recipeLogInfo,
        writeParam: JSON.parse(writeParam),
      };
    },
  },
};
</script>

<style scoped>
::v-deep .v-list-item__subtitle {
  white-space: normal;
  word-wrap: break-word;
}
.white-space-normal {
  white-space: normal;
}
</style>
