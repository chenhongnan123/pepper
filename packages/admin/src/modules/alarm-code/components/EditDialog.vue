<template>
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    :max-width="cardWidth"
    :max-height="cardHeight"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden">
      <v-row>
        <v-col>
          <v-card-title primary-title>
            <span>
              {{ $t('btn.edit') }}
            </span>
            <v-spacer />
            <v-btn
              icon
              small
              @click="dialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text :style="`height: ${cardHeight - 64}`">
            <v-form
              ref="form"
              lazy-validation
            >
              <v-text-field
                v-model="tabledataobj.alarmCode"
                class="mt-3"
                dense
                clearable
                :label="`${$t('alarmCode.table.alarmCode')}*`"
                :counter="50"
                :rules="rules.name"
              />
              <v-text-field
                v-model="tabledataobj.alarmName"
                class="mt-4"
                dense
                :rules="rules.name"
                clearable
                :counter="50"
                :label="`${$t('alarmCode.table.alarmName')}*`"
              />
            </v-form>
          </v-card-text>
          <v-card-actions class="mb-2">
            <v-spacer />
            <v-btn
              color="primary"
              small
              class="text-none"
              @click="handleSave"
            >
              {{ $t('btn.save') }}
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'EditAlarmDialog',
  props: {
    editDialog: {
      type: Boolean,
      required: true,
    },
    selectedTableList: {},
  },
  data() {
    return {
      cardWidth: 500,
      cardHeight: 400,
      tabledataobj: {},
    };
  },
  computed: {
    ...mapState('helper', ['currentLocale']),
    dialog: {
      get() {
        return this.editDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    rules() {
      return this.$getOperatorRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('alarmCode', ['editAlarm']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const { tabledataobj } = this;
      const { alarmCode, alarmName, alarmCodeId } = tabledataobj;
      const payload = {
        alarmCode,
        alarmName,
        alarmCodeId,
      };
      let result = null;
      result = await this.editAlarm(payload);
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.$emit('getTableList');
        this.dialog = false;
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$nextTick(() => {
          this.tabledataobj = {};
        });
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        this.reset();
        return;
      }
      const { selectedTableList } = this;
      console.log(selectedTableList);
      const { alarmCode, alarmName, alarmCodeId } = selectedTableList[0];
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          alarmCode,
          alarmName,
          alarmCodeId,
        };
      });
    },
  },
};
</script>
