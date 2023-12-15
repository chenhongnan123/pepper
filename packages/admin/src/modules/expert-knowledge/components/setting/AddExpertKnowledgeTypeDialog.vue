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
            ? $t('expertKnowledge.dialog.addExpertKnowledgeType')
            : $t('expertKnowledge.dialog.editExpertKnowledgeType')
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
            class="mx-3 mt-3"
            clearable
            :rules="rules.number"
            :label="`${$t('expertKnowledge.table.typeNumber')}*`"
            :counter="20"
            v-model="tabledataobj.dictValue"
          ></v-text-field>
          <v-text-field
            class="mx-3 mt-3"
            clearable
            :rules="rules.name"
            :label="`${$t('expertKnowledge.table.typeName')}*`"
            :counter="50"
            v-model="tabledataobj.dictLabel"
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
  name: 'ExpertKnowledgeTypeAddDialog',
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
    selectedTableList: {
      type: Array,
    },
    isNew: {
      type: Boolean,
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
      return this.$getMaintenanceRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('expertKnowledge', ['addExpertKnowledgeType', 'updateExpertKnowledgeType']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        isNew,
        tabledataobj,
      } = this;
      const {
        dictCode,
        dictValue,
        dictLabel,
      } = tabledataobj;
      const payload = {
        dictValue,
        dictLabel,
        isDefault: 'N',
        status: '0',
        dictType: 'expertise_type',
      };
      let result = null;
      if (isNew) {
        result = await this.addExpertKnowledgeType(payload);
      } else {
        payload.dictCode = dictCode;
        result = await this.updateExpertKnowledgeType(payload);
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
        return;
      }
      const {
        selectedTableList,
      } = this;
      // console.log(this.rules, 'rules');
      if (!selectedTableList.length || this.isNew) {
        this.reset();
        return;
      }
      const {
        dictCode,
        dictValue,
        dictLabel,
      } = selectedTableList[0];
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          dictCode,
          dictValue,
          dictLabel,
        };
      });
    },
  },
};
</script>
