<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'480px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            $t('progressDetail.dialog.edit')
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
                :rules="rules.interge"
                :label="`${$t('progressDetail.table.priority')}`"
                v-model="tabledataobj.priority"
              ></v-text-field>
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
          v-if="isNew"
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
  name: 'progressEditDialog',
  data() {
    return {
      tabledataobj: {
      },
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    isNew: {
      type: Boolean,
    },
    selectedTableList: {
      type: Array,
    },
  },
  components: {
  },
  computed: {
    ...mapState('progressDetail', [
    ]),
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
      return this.$getProgressRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('progressDetail', [
      'updateProgress',
    ]),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        tabledataobj,
      } = this;
      const payload = {
        ...tabledataobj,
      };
      const result = await this.updateProgress(payload);
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
        });
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      const { selectedTableList, isNew } = this;
      if (isNew || selectedTableList.length === 0) {
        this.reset();
        return;
      }
      this.$nextTick(() => {
        this.tabledataobj = {
          ...selectedTableList[0],
        };
      });
    },
  },
};
</script>
