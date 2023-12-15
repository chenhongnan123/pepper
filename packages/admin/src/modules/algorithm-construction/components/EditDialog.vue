<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'500px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            $t('algorithmConstruction.dialog.editEvent')
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
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :label="`${$t('algorithmConstruction.table.parentBomName')}*`"
                v-model="tabledataobj.parentBomName"
                disabled
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :label="`${$t('algorithmConstruction.table.bomName')}*`"
                v-model="tabledataobj.bomName"
                disabled
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :label="`${$t('algorithmConstruction.table.name')}*`"
                v-model="tabledataobj.eventName"
                disabled
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :label="`${$t('algorithmConstruction.table.description')}`"
                v-model="tabledataobj.eventDescription"
                :counter="500"
                :rules="rules.over500"
              ></v-text-field>
              <v-radio-group
                v-model="tabledataobj.type"
                class="mx-3 mt-1"
                row
                disabled
              >
                <v-radio
                  :label="$t('algorithmConstruction.dialog.standard')"
                  :value="'0'"
                ></v-radio>
                <v-radio
                  class="ml-2"
                  :label="$t('algorithmConstruction.dialog.custom')"
                  :value="'1'"
                ></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="mb-2">
        <v-spacer></v-spacer>
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
  mapGetters,
  mapActions,
  mapMutations,
} from 'vuex';

export default {
  name: 'editDialog',
  data() {
    return {
      tabledataobj: {
      },
    };
  },
  props: {
    editDialog: {
      type: Boolean,
      required: true,
    },
    selectedTableList: {
      type: Array,
    },
  },
  components: {
  },
  computed: {
    ...mapState('algorithmConstruction', ['bomTreeList']),
    ...mapGetters('algorithmConstruction', ['formatBomList']),
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
      return this.$getMaintenanceRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert', 'setPepperLoading']),
    ...mapActions('algorithmConstruction', ['getBomTree', 'addAlgorithmModel', 'editAlgorithmModel']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        id,
        eventDescription,
      } = this.tabledataobj;
      const payload = {
        id,
        eventDescription: eventDescription || '',
      };
      const result = await this.editAlgorithmModel(payload);
      if (result) {
        this.$emit('getTableList');
        this.dialog = false;
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
      const { selectedTableList } = this;
      const {
        id,
        bomId,
        bomName,
        parentBomId,
        parentBomName,
        eventName,
        eventDescription,
        type,
      } = selectedTableList[0];
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          id,
          bomId,
          bomName,
          parentBomId,
          parentBomName,
          eventName,
          eventDescription,
          type,
        };
      });
    },
  },
};
</script>
