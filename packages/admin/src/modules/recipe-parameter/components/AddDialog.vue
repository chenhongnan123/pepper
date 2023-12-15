<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'400px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden">
      <v-card-title primary-title>
        <span>
          {{ isNew ? $t('btn.add') : $t('btn.edit') }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false" color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" lazy-validation>
          <v-row justify="center" dense>
            <v-col cols="12">
              <v-text-field
                class="mx-3 mt-2"
                clearable
                :rules="rules.limit50LenStrRequire"
                :label="`${$t('recipeParameter.table.parameterTag')}*`"
                v-model="tabledataobj.parameterTag"
                :counter="50"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-autocomplete
                clearable
                :rules="rules.isRequired"
                class="mx-3 mt-2"
                :items="positionList"
                :label="`${this.$t('recipeParameter.table.tablePosition')}*`"
                v-model="tabledataobj.tablePosition"
              >
              </v-autocomplete>
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
          {{ $t('btn.eliminate') }}
        </v-btn>
        <v-btn
          color="primary"
          small
          class="text-none"
          @click="handleSave"
        >
          {{ $t('btn.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

export default {
  name: 'RecipeAddDialog',
  data() {
    return {
      tabledataobj: {},
      positionList: [],
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
    recipeType: {
      type: Number,
    },
  },
  components: {},
  computed: {
    ...mapState('recipeParameter', ['recipeTableList']),
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
      return this.$getBasicRuls();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('recipeParameter', [
      'getRecipeTableList',
      'getFileJson',
      'addParameter',
      'editParameter',
    ]),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const { isNew, tabledataobj, recipeType } = this;
      const {
        recipeParameterId,
        parameterTag,
        tablePosition,
      } = tabledataobj;
      let payload = {
        parameterTag,
        tablePosition,
        recipeType,
      };
      const match = payload.tablePosition.match(/^([a-z]+)(\d+)$/i);
      if (match) {
        payload.tablePosition = `${match[1]}:${match[2]}`;
      }
      let result = null;
      if (isNew) {
        result = await this.addParameter(payload);
      } else {
        payload = {
          ...payload,
          recipeParameterId,
        };
        result = await this.editParameter(payload);
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
      const { isNew, selectedTableList, recipeType } = this;
      const jsonFileName = recipeType === 0 ? 'fallhead' : 'sintering';
      const { rowKeys, step } = await this.getFileJson(`config/recipe-${jsonFileName}-row.json`);
      const positionList = [];
      console.log(rowKeys, step, 'json');
      // 遍历json生成表格位置
      rowKeys.forEach((item) => {
        step.forEach((_, index) => {
          if (item !== 'A' && item !== 'B') { // 排除A B
            positionList.push(item + (index + 1));
          }
        });
      });
      this.positionList = positionList;

      if (!selectedTableList.length || isNew) {
        this.reset();
        return;
      }
      const {
        recipeParameterId,
        parameterTag,
        tablePosition,
      } = selectedTableList[0];
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          recipeParameterId,
          parameterTag,
          tablePosition: tablePosition.replace(':', '').toUpperCase(),
        };
      });
    },
  },
};
</script>
