<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'420px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            $t('maintenanceTask.dialog.addPart')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false" color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-row
            justify="center"
            dense
          >
            <v-col cols="12">
              <selectable-bom-tree
                class="mx-3 mt-3"
                ref="selectableBomTree"
                :title="$t('maintenanceTask.table.maintenancePosition')"
                :placeholder="$t('algorithmConstruction.dialog.searchPart')"
                :height="400"
                :bomList="formatBomList(bomTreeList)"
                :isMultiple="true"
                :isErr="!!bomErrMsg"
                :isShowMaintenancePart="false"
                :isShowMainPart="false"
                itemChildren="childrenBomList"
                itemKey="bomId"
                itemText="bomName"
                alarmDisabledKey="isParent"
              />
              <div class="mx-4 error--text">{{bomErrMsg}}</div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="mt-4">
        <v-spacer></v-spacer>
        <v-btn
          color="warning"
          small
          text
          class="mr-2"
          @click="reset"
        >
          {{$t('btn.eliminate')}}
        </v-btn>
        <v-btn
          color="primary"
          small
          class="text-none"
          @click="handleSave"
        >
          {{$t('btn.save')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
  mapGetters,
} from 'vuex';

import selectableBomTree from '@/components/commonUI/SelectableBomTree.vue';

export default {
  name: 'PartAddDialog',
  data() {
    return {
      bomErrMsg: '',
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    taskId: {
      type: Number,
      required: true,
    },
  },
  components: {
    selectableBomTree,
  },
  computed: {
    ...mapState('algorithmConstruction', ['bomTreeList']),
    ...mapGetters('algorithmConstruction', ['formatBomList']),
    ...mapState('maintenanceTask', ['repairPartList']),
    dialog: {
      get() {
        return this.addDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('algorithmConstruction', ['getBomTree']),
    ...mapActions('maintenanceTask', ['addRepairPart']),
    async handleSave() {
      if (!this.$refs.selectableBomTree.selectfloder.length) {
        this.bomErrMsg = this.$t('verification.isrequired');
        return;
      }
      const ignoreList = this.$refs.selectableBomTree.selectfloder
        .filter((item) => this.repairPartList.some((p) => p.partId === item.partId));
      const selectedPart = this.$refs.selectableBomTree.selectfloder
        .filter((item) => !this.repairPartList.some((p) => p.partId === item.partId))
        .map((item) => {
          const obj = {
            taskId: this.taskId,
            partId: item.partId,
            bomId: item.bomId,
          };
          return obj;
        });
      if (selectedPart.length) {
        const result = await this.addRepairPart(selectedPart);
        if (result) {
          this.$emit('getTableList');
          this.dialog = false;
        }
      } else {
        this.dialog = false;
      }
      if (ignoreList.length) {
        this.$emit('handleIgnore', ignoreList);
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$nextTick(() => {
          this.bomErrMsg = '';
          this.$refs.selectableBomTree.selectfloder = [];
        });
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      await this.getBomTree();
      this.reset();
    },
  },
};
</script>
