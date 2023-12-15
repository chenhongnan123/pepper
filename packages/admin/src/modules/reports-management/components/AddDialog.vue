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
        <!-- <span>
          {{
            isNew
            ? $t('reportsManagement.dialog.addDictType')
            : $t('reportsManagement.dialog.editDictType')
          }}
        </span> -->
        <span>{{ $t('reportsManagement.btn.saveReport') }}</span>
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
          <v-text-field
            class="mx-3 mt-1"
            clearable :counter="50"
            :rules="rules.menuName"
            :label="$t('reportsManagement.label.reportName')"
            v-model="tabledataobj.menuName"
          ></v-text-field>
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
  name: 'ParameterAddDialog',
  data() {
    return {
      tabledataobj: {
        status: 0,
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
      default: true,
    },
    selectedTableList: {
      type: Array,
    },
  },
  computed: {
    ...mapState('reportsManagement', ['getDictTypeList']),
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
      return this.$getReportRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('reportsManagement', ['addDictType', 'updateDictType']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        isNew,
        tabledataobj,
      } = this;
      const { menuName } = tabledataobj;
      let payload = { menuName };
      if (isNew) {
        payload = {
          ...payload,
        };
        this.$emit('save', payload);
      } else {
        payload = {
          ...payload,
        };
      }
      // if (result) {
      //   this.$emit('save', this.tabledataobj);
      //   this.dialog = false;
      // }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$nextTick(() => {
          this.tabledataobj = {
            status: 0,
          };
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
      const { isNew, selectedTableList } = this;
      if (!selectedTableList.length || isNew) {
        this.reset();
        return;
      }
      const {
        // reportId,
        menuName,
        // reportType,
        // status,
        // remark,
      } = selectedTableList[0];
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          // reportId,
          menuName,
          // reportType,
          // status: +status,
          // remark,
        };
      });
    },
  },
};
</script>
