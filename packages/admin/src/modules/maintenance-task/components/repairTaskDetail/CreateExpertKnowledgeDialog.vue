<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'420px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            $t('maintenanceTask.dialog.createExpertise')
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
            <v-col cols="12">
              <v-autocomplete
                clearable
                :rules="rules.isRequired"
                :label="`${$t('expertKnowledge.table.type')}*`"
                class="mx-3 mt-1"
                v-model="tabledataobj.expertiseType"
                :items="expertKnowledgeTypes"
                item-text="dictLabel"
                item-value="dictValue"
              >
              </v-autocomplete>
               <v-text-field
                class="mx-3 mt-1"
                clearable
                :rules="rules.name"
                :label="`${$t('expertKnowledge.table.number')}*`"
                v-model="tabledataobj.expertiseNumber"
                :counter="50"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :rules="rules.name"
                :label="`${$t('expertKnowledge.table.name')}*`"
                v-model="tabledataobj.expertiseName"
                :counter="50"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :rules="rules.over500"
                :label="`${$t('expertKnowledge.table.description')}`"
                v-model="tabledataobj.expertiseDescription"
                :counter="500"
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
  name: 'CreateExpertKnowledgeDialog',
  data() {
    return {
      expertKnowledgeTypes: [],
      tabledataobj: {
      },
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    taskId: {
      type: Number,
    },
  },
  components: {
  },
  computed: {
    ...mapState('expertKnowledge', ['expertKnowledgeTypeList']),
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
    ...mapActions('expertKnowledge', ['getExpertKnowledgeTypeList']),
    ...mapActions('maintenanceTask', ['createExpertise']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const { taskId, tabledataobj } = this;
      const {
        expertiseType,
        expertiseNumber,
        expertiseName,
        expertiseDescription,
      } = tabledataobj;
      const payload = {
        taskId,
        expertiseType,
        expertiseNumber,
        expertiseName,
        expertiseDescription,
      };
      console.log(payload);
      const result = await this.createExpertise(payload);
      if (result) {
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
      await this.getExpertKnowledgeTypeList();
      this.expertKnowledgeTypes = this.expertKnowledgeTypeList.filter((item) => item.status === '0');
      this.reset();
    },
  },
};
</script>
