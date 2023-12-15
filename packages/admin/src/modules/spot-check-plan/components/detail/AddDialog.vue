<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'400px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            isNew
            ? $t('btn.add')
            : $t('btn.edit')
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
          <v-text-field
            class="mx-3 mt-1"
            clearable
            :rules="rules.limit50LenStrRequire"
            :label="`${$t('spotCheckPlan.table.checkDetailName')}*`"
            v-model="tabledataobj.checkDetailName"
            counter="50"
          ></v-text-field>
          <v-text-field
            class="mx-3 mt-1"
            clearable
            :rules="rules.limit50LenStrRequire"
            :label="`${$t('spotCheckPlan.table.parameterTag')}*`"
            v-model="tabledataobj.parameterTag"
            counter="50"
          ></v-text-field>
          <v-text-field
            class="mx-3 mt-1"
            clearable
            :rules="rules.lowerAndUpperlimit"
            :label="`${$t('spotCheckPlan.table.upperLimit')}*`"
            v-model="tabledataobj.upperLimit"
          ></v-text-field>
          <v-text-field
            class="mx-3 mt-1"
            clearable
            :rules="rules.lowerAndUpperlimit"
            :label="`${$t('spotCheckPlan.table.lowerLimit')}*`"
            v-model="tabledataobj.lowerLimit"
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
  mapActions,
  mapMutations,
} from 'vuex';

export default {
  name: 'spotCheckDetailAddDialog',
  data() {
    return {
      tabledataobj: {},
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
    checkId: {
      type: Number,
    },
  },
  computed: {
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
      return this.$getSpotCheckRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('spotCheckPlan', [
      'addSpotCheckDetail',
      'updateSpotCheckDetail',
    ]),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        isNew,
        tabledataobj,
        checkId,
      } = this;

      const {
        checkDetailId,
        checkDetailName,
        lowerLimit,
        parameterTag,
        upperLimit,
      } = tabledataobj;
      if (+lowerLimit > +upperLimit) {
        this.setAlert({
          show: true,
          type: 'error',
          message: this.$t('spotCheckPlan.message.error'),
        });
        return;
      }
      let payload = {
        checkId,
        checkDetailName,
        lowerLimit,
        parameterTag,
        upperLimit,
      };
      let result = null;
      if (isNew) {
        payload = {
          ...payload,
        };
        result = await this.addSpotCheckDetail(payload);
      } else {
        payload = {
          ...payload,
          checkDetailId,
        };
        result = await this.updateSpotCheckDetail(payload);
      }
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
        this.reset();
        return;
      }
      const { isNew, selectedTableList } = this;
      if (!selectedTableList.length || isNew) {
        this.reset();
        return;
      }
      const {
        checkDetailId,
        checkDetailName,
        lowerLimit,
        parameterTag,
        upperLimit,
      } = selectedTableList[0];
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          checkDetailId,
          checkDetailName,
          lowerLimit,
          parameterTag,
          upperLimit,
        };
      });
    },
  },
};
</script>
