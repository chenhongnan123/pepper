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
              {{ $t('alarmMonitor.label.editCamera') }}
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
                v-model="tabledataobj.cameraIp"
                class="mt-3"
                dense
                clearable
                :rules="rules.isRequired"
                :label="`${$t('alarmMonitor.dialog.ip')}*`"
              />
              <v-text-field
                v-model="tabledataobj.cameraPort"
                class="mt-3"
                dense
                clearable
                :rules="rules.isRequired"
                :label="`${$t('alarmMonitor.dialog.port')}*`"
              />
              <v-text-field
                v-model="tabledataobj.cameraThoroughfare"
                class="mt-4"
                dense
                clearable
                :rules="rules.isRequired"
                :label="`${$t('alarmMonitor.dialog.thoroughfare')}*`"
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
  name: 'EditCameraDialog',
  props: {
    editCameraDialog: {
      type: Boolean,
      required: true,
    },
    monitorInfo: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      cardWidth: 320,
      cardHeight: 450,
      tabledataobj: {},
    };
  },
  computed: {
    ...mapState('helper', ['currentLocale']),
    dialog: {
      get() {
        return this.editCameraDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    rules() {
      return this.$getCommonRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('alarmMonitor', ['editMonitor']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const { tabledataobj } = this;
      const {
        alarmMonitorId,
        cameraIp,
        cameraPort,
        cameraThoroughfare,
      } = tabledataobj;

      const payload = {
        alarmMonitorId,
        cameraIp,
        cameraPort,
        cameraThoroughfare,
      };
      let result = null;
      result = await this.editMonitor(payload);
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
      const { monitorInfo } = this;
      console.log(monitorInfo, 'monitorInfo');
      const {
        cameraIp,
        cameraPort,
        cameraThoroughfare,
        alarmMonitorId,
      } = monitorInfo;
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          alarmMonitorId,
          cameraIp,
          cameraPort,
          cameraThoroughfare,
        };
      });
    },
  },
};
</script>
