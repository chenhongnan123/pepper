<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="400px"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title>
        <span>
          {{
            !isAddNew
            ? $t('machineBom.dialog.editBomFirst')
            : $t('machineBom.dialog.addBomFirst')
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
        <v-text-field
            class="mt-3"
            clearable
            :rules="rules.number"
            :label="`${$t('machineBom.label.layoutNumber')}*`"
            v-model="tabledataobj.bomNumber"
            :counter="20"
          ></v-text-field>
          <v-text-field
            class="mt-3"
            clearable
            :rules="rules.name"
            :label="`${$t('machineBom.label.layoutName')}*`"
            v-model="tabledataobj.bomName"
            :counter="50"
          ></v-text-field>
          <div class="d-flex justify-start align-center">
            <span>
              {{$t('machineBom.label.hasCamera')}}
            </span>
            <v-switch
              v-model="tabledataobj.camera"
              class="ml-4 mt-1"
              hide-details
              dense
            ></v-switch>
          </div>
          <div v-if="tabledataobj.camera" class="mt-4">
            <div class="text-h5" style="color: #404040;font-weight: 500;">
              {{$t('machineBom.label.cameraParameter')}}
            </div>
            <v-text-field
              class="mt-3"
              clearable
              :rules="rules.ip"
              :label="`${$t('machineBom.label.cameraIp')}*`"
              v-model="tabledataobj.cameraIp"
              hint="Hint: 127.168.1.1"
            ></v-text-field>
            <v-text-field
              class="mt-3"
              clearable
              :rules="rules.port"
              :label="`${$t('machineBom.label.cameraPort')}*`"
              v-model="tabledataobj.cameraPort"
            ></v-text-field>
            <v-text-field
              class="mt-3"
              clearable
              :rules="rules.thoroughfare"
              :label="`${$t('machineBom.label.cameraThoroughfare')}*`"
              v-model="tabledataobj.cameraThoroughfare"
            ></v-text-field>
            <v-text-field
              class="mt-3"
              clearable
              :rules="rules.isRequired"
              :label="`${$t('machineBom.label.cameraAccount')}*`"
              v-model="tabledataobj.cameraAccount"
            ></v-text-field>
            <v-text-field
              class="mt-3"
              clearable
              :rules="rules.isRequired"
              :label="`${$t('machineBom.label.cameraPassword')}*`"
              v-model="tabledataobj.cameraPassword"
            ></v-text-field>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions class="mb-2">
        <v-spacer></v-spacer>
        <v-btn
          color="warning"
          small
          text
          class="mr-2"
          @click="reset"
          v-if="isAddNew"
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
} from 'vuex';

export default {
  name: 'AddFolder',
  data() {
    return {
      tabledataobj: {
      },
    };
  },
  props: {
    addFolderDialog: {
      type: Boolean,
      required: true,
    },
    isAddNew: {
      type: Boolean,
      required: true,
    },
    activefloder: {
      type: Array,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('machineBom', ['mainDevice']),
    dialog: {
      get() {
        return this.addFolderDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    deviceCode() {
      return this.$route.params.id || '';
    },
    deviceId() {
      console.log(this.mainDevice.inventoryItemId, 'this.mainDevice.inventoryItemId');
      return this.mainDevice.inventoryItemId || '';
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('machineBom', [
      'addBom',
      'editBom',
    ]),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        bomId,
        bomName,
        bomNumber,
        bomLevel,
        camera,
        cameraAccount,
        cameraIp,
        cameraPassword,
        cameraPort,
        cameraThoroughfare,
        countParameter,
      } = this.tabledataobj;
      if (this.isAddNew) {
        // 新增部件
        const payload = {
          bomName,
          bomNumber,
          bomLevel: '1',
          camera: camera ? '1' : '0',
          cameraAccount,
          cameraIp,
          cameraPassword,
          cameraPort,
          cameraThoroughfare,
          countParameter,
        };
        const result = await this.addBom(payload);
        if (result) {
          this.$emit('getFolderList');
          this.dialog = false;
        }
      } else {
        const editPayload = {
          bomId,
          bomName,
          bomNumber,
          bomLevel: bomLevel || '1',
          camera: camera ? '1' : '0',
          cameraAccount,
          cameraIp,
          cameraPassword,
          cameraPort,
          cameraThoroughfare,
          countParameter,
        };
        const editResult = await this.editBom(editPayload);
        if (editResult) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'successAction',
          });
          this.$emit('getFolderList');
          this.dialog = false;
        }
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$nextTick(() => {
          this.tabledataobj = {
          };
        });
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      const {
        activefloder,
      } = this;
      if (this.isAddNew) {
        this.reset();
        return;
      }
      if (activefloder.length) {
        const {
          bomId,
          bomName,
          bomNumber,
          bomLevel,
          camera,
          cameraAccount,
          cameraIp,
          cameraPassword,
          cameraPort,
          cameraThoroughfare,
          countParameter,
        } = activefloder[0];
        this.$nextTick(async () => {
          this.tabledataobj = {
            ...this.tabledataobj,
            bomId,
            bomName,
            bomNumber,
            bomLevel,
            camera: camera === '1',
            cameraAccount,
            cameraIp,
            cameraPassword,
            cameraPort,
            cameraThoroughfare,
            countParameter,
          };
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
