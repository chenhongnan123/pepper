<template>
  <div>
    <v-dialog
      persistent
      scrollable
      v-model="dialog"
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card style="overflow: hidden;">
        <v-card-title primary-title>
          <span>
            {{
              '更换零件'
            }}
          </span>
          <v-spacer></v-spacer>
          <v-btn icon small @click="dialog = false">
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
                  :title="$t('maintenanceTask.maintenancePosition')"
                  :height="400"
                  :bomList="formatBomList(bomList)"
                  :isMultiple="true"
                  :isErr="!!bomErrMsg"
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
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="warning"
            small
            text
            class="mr-2"
            @click="reset"
          >
            {{$t('common.resetbtn')}}
          </v-btn>
          <v-btn
            color="primary2"
            small
            class="text-none"
            @click="handleSave"
          >
            {{$t('common.savebtn')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <ignore-part-dialog
      :ignoreDialog="ignoreDialog"
      :ignoreList="ignoreList"
      @closeDialog="ignoreDialog = false;ignoreList = []"
    />
  </div>
</template>

<script>
import {
  mapState,
  mapActions,
  mapGetters,
} from 'vuex';

import SelectableBomTree from '@/components/commonUI/SelectableBomTree.vue';
import IgnorePartDialog from './ignorePartDialog.vue';

export default {
  name: 'PartAddDialog',
  data() {
    return {
      bomErrMsg: '',
      ignoreList: [],
      ignoreDialog: false,
    };
  },
  components: {
    SelectableBomTree,
    IgnorePartDialog,
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
  computed: {
    ...mapState('maintenanceTask', ['repairPartList', 'bomList']),
    ...mapGetters('maintenanceTask', ['formatBomList']),
    dialog: {
      get() {
        return this.addDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    iszh() {
      return this.$i18n.locale === 'zhHans';
    },
  },
  methods: {
    ...mapActions('maintenanceTask', ['getBomList', 'addRepairPart']),
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
      this.dialog = false;
      if (ignoreList.length) {
        this.ignoreList = ignoreList;
        this.ignoreDialog = true;
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
      await this.getBomList();
      this.reset();
    },
  },
};
</script>
