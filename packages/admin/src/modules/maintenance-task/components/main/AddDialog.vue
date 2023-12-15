<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'450px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            $t('maintenanceTask.dialog.addTempTask')
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
            <v-col cols="12" >
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :rules="rules.name"
                :label="`${$t('maintenanceTask.table.name')}*`"
                v-model="tabledataobj.taskName"
                :counter="50"
              ></v-text-field>
              <v-autocomplete
                clearable
                :rules="rules.isRequired"
                :label="`${$t('maintenanceTask.table.maintenance')}*`"
                class="mx-3 mt-1"
                v-model="tabledataobj.maintenance"
                :items="maintenances"
                item-text="schemaName"
                item-value="id"
              >
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>{{item.schemaName}}</v-list-item-title>
                    <v-list-item-subtitle>{{item.schemaDesc}}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
              <v-text-field
                class="mx-3"
                clearable
                :rules="rules.isRequired"
                style="flex:initial"
                type="datetime-local"
                :label="`${$t('maintenanceTask.table.scheduledStartDate')}*`"
                v-model="tabledataobj.planStartTime"
                :error-messages="dateCheckMsg"
              ></v-text-field>
              <v-text-field
                class="mx-3"
                clearable
                :rules="rules.isRequired"
                style="flex:initial"
                type="datetime-local"
                :label="`${$t('maintenanceTask.table.scheduledCompletionDate')}*`"
                v-model="tabledataobj.planEndTime"
                :error-messages="dateCheckMsg"
              ></v-text-field>
              <!-- <v-text-field
                class="mx-3"
                clearable
                :rules="rules.interge"
                :label="`${$t('maintenanceTask.table.advanceReminderTime')}*`"
                v-model="tabledataobj.timeoutReminderDate"
              ></v-text-field> -->
            </v-col>
            <!-- <v-col cols="6">
              <selectable-bom-tree
                class="mx-3 mt-3"
                ref="selectableBomTree"
                :title="$t('maintenanceTask.table.maintenancePosition')"
                :placeholder="$t('algorithmConstruction.dialog.searchPart')"
                :height="400"
                :bomList="formatBomList(bomTreeList)"
                :isMultiple="false"
                :isErr="!!bomErrMsg"
                :isShowMaintenancePart="false"
                :isShowMainPart="false"
                itemChildren="childrenBomList"
                itemKey="bomId"
                itemText="bomName"
                alarmDisabledKey="isParent"
              />
              <div class="mx-4 error--text">{{bomErrMsg}}</div>
            </v-col> -->
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

// import selectableBomTree from '@/components/commonUI/SelectableBomTree.vue';

export default {
  name: 'MaintenanceTaskAddDialog',
  data() {
    return {
      tabledataobj: {
      },
      dateTab: 0,
      bomErrMsg: '',
      maintenances: [],
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    // selectableBomTree,
  },
  computed: {
    ...mapState('maintenanceTask', ['maintenanceList']),
    ...mapState('algorithmConstruction', ['bomTreeList']),
    ...mapGetters('algorithmConstruction', ['formatBomList']),
    dialog: {
      get() {
        return this.addDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    rules() {
      return this.$getMaintenanceRules();
    },
    dateCheckMsg: {
      set() {
      },
      get() {
        const { planStartTime, planEndTime } = this.tabledataobj;
        if (planStartTime && planEndTime) {
          const fromdate = new Date(planStartTime);
          const todate = new Date(planEndTime);
          if (fromdate.getTime() > todate.getTime()) {
            return this.$t('error.endtimebiggerthanstarttime');
          }
        }
        return '';
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('algorithmConstruction', ['getBomTree']),
    ...mapActions('maintenance', ['getMaintenanceList']),
    ...mapActions('maintenanceTask', ['addTask', 'getMaintenanceList']),
    async handleSave() {
      if (!this.$refs.form.validate() || this.dateCheckMsg) {
        return;
      }
      // if (!this.$refs.selectableBomTree.selectfloder.length) {
      //   this.bomErrMsg = this.$t('verification.isrequired');
      //   return;
      // }
      const {
        tabledataobj,
      } = this;
      const {
        taskName,
        maintenance,
        planStartTime,
        planEndTime,
        // timeoutReminderDate,
      } = tabledataobj;
      // const maintenanceLocation = this.$refs.selectableBomTree.selectfloder[0].bomId;
      const payload = {
        taskName,
        schemaId: maintenance,
        planStartTime: this.$getFormatDate(planStartTime, 'yyyy-MM-DD HH:mm:ss'),
        planEndTime: this.$getFormatDate(planEndTime, 'yyyy-MM-DD HH:mm:ss'),
        // timeoutReminderDate,
        // maintenanceLocation,
        taskGroup: '0',
        taskType: '2',
        status: '0',
      };
      const result = await this.addTask(payload);
      if (result) {
        this.$emit('getTableList');
        this.dialog = false;
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$nextTick(() => {
          this.tabledataobj = {};
          this.bomErrMsg = '';
        });
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      await this.getMaintenanceList();
      // await this.getBomTree();
      this.maintenances = this.maintenanceList.filter((item) => item.status === '1');
      this.reset();
    },
  },
};
</script>
