<!-- eslint-disable no-unreachable -->
<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'900px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden">
      <v-card-title primary-title>
        <span>
          {{
            isNew
              ? $t('maintenance.dialog.addMaintenanceDetail')
              : $t('maintenance.dialog.editMaintenanceDetail')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn
          icon
          small
          @click="dialog = false"
          color="primary"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-row justify="center">
            <v-col cols="6">
              <v-text-field
                class="mx-3"
                clearable
                :rules="rules.name"
                :label="`${$t('maintenance.table.checkItem')}*`"
                v-model="tabledataobj.checkItem"
              ></v-text-field>
              <v-textarea
                class="mx-3 mt-3 "
                clearable
                outlined
                :label="`${$t('maintenance.table.checkItemDescription')}`"
                v-model="tabledataobj.checkItemDesc"
                rows="8"
                height="200"
                counter="500"
                :rules="rules.over500"
              ></v-textarea>
              <v-radio-group
                v-model="tabledataobj.itemType"
                row
                class="mx-3 mt-3"
                :rules="rules.isRequired"
              >
                <v-radio
                  :label="$t('maintenance.label.qualitative')"
                  value="0"
                ></v-radio>
                <v-radio
                  :label="$t('maintenance.label.quantify')"
                  value="1"
                  class="ml-16"
                ></v-radio>
              </v-radio-group>
              <v-text-field
                class="mx-3 mt-3"
                clearable
                :rules="rules.limit"
                :label="`${$t('maintenance.label.upperLimit')}*`"
                v-model="tabledataobj.theoreticalUpperLimit"
                v-if="tabledataobj.itemType === '1'"
                :error-messages="limitErrMsg"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-3"
                clearable
                :rules="rules.limit"
                :label="`${$t('maintenance.label.lowerLimit')}*`"
                v-model="tabledataobj.theoreticalLowerBound"
                v-if="tabledataobj.itemType === '1'"
                :error-messages="limitErrMsg"
              ></v-text-field>
              <v-checkbox
                v-model="tabledataobj.required"
                color="primary"
                class="mx-3 mt-3"
                :label="`${$t('maintenance.label.isRequired')}`"
              ></v-checkbox>
            </v-col>
            <v-col cols="6">
              <selectable-bom-tree
                class="mx-3 mt-4"
                ref="selectableBomTree"
                :title="$t('maintenance.table.relatedBom')"
                :height="545"
                :bomList="formatBomList(bomTreeList)"
                :isMultiple="true"
                :isShowMaintenancePart="false"
                :isShowMainPart="false"
                bomErrMsg=""
                itemChildren="childrenBomList"
                itemKey="bomId"
                itemText="bomName"
                placeholder="maintenance.label.searchPart"
                alarmDisabledKey="isParent"
              />
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
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import selectableBomTree from '@/components/commonUI/SelectableBomTree.vue';

export default {
  name: 'MaintenanceDetailAddDialog',
  data() {
    return {
      tabledataobj: {},
      limitErrMsg: '',
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
    maintenanceId: {
      type: String,
    },
    isNew: {
      type: Boolean,
    },
  },
  components: {
    selectableBomTree,
  },
  computed: {
    ...mapState('maintenance', ['bomList']),
    ...mapState('algorithmConstruction', ['bomTreeList']),
    ...mapGetters('algorithmConstruction', ['formatBomList']),
    dialog: {
      get() {
        return this.addDialog;
      },
      set() {
        this.reset();
        this.setBomList([]);
        this.$emit('closeDialog');
      },
    },
    rules() {
      return this.$getMaintenanceRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('maintenance', ['setBomList']),
    ...mapActions('maintenance', ['addCheckItem', 'updateCheckItem', 'getBomList']),
    ...mapActions('algorithmConstruction', ['getBomTree']),
    async handleSave() {
      // console.log(this.$refs.selectableBomTree.selectfloder, 'refs');
      if (!this.$refs.form.validate()) {
        return;
      }
      const { isNew, tabledataobj, maintenanceId } = this;
      const {
        checkItem,
        checkItemDesc,
        itemType,
        theoreticalLowerBound,
        theoreticalUpperLimit,
        required,
        id,
      } = tabledataobj;
      const associateBom = this.$refs.selectableBomTree.selectfloder.map((item) => item.bomId);
      if (Number(theoreticalUpperLimit) < Number(theoreticalLowerBound)) {
        this.limitErrMsg = this.$t('verification.upperthanlower');
        return;
      }
      this.limitErrMsg = '';
      let payload = {
        checkItem,
        checkItemDesc: checkItemDesc || '',
        itemType,
        theoreticalUpperLimit: itemType === '1' ? theoreticalUpperLimit : 0,
        theoreticalLowerBound: itemType === '1' ? theoreticalLowerBound : 0,
        required: required ? 'Y' : 'N',
        associateBom,
        schemaId: maintenanceId,
      };
      let result = null;
      if (isNew) {
        payload = {
          ...payload,
        };
        result = await this.addCheckItem(payload);
      } else {
        payload = {
          ...payload,
          id,
        };
        result = await this.updateCheckItem(payload);
      }
      if (result) {
        this.$emit('getTableList');
        this.dialog = false;
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      this.$nextTick(() => {
        this.tabledataobj = {};
        this.limitErrMsg = '';
        this.$refs.selectableBomTree.selectfloder = [];
      });
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      await this.getBomTree();
      const { selectedTableList } = this;
      // console.log(this.rules, 'rules');
      if (!selectedTableList.length || this.isNew) {
        this.reset();
        return;
      }
      const {
        id,
        checkItem,
        checkItemDesc,
        itemType,
        theoreticalLowerBound,
        theoreticalUpperLimit,
        required,
      } = selectedTableList[0];
      console.log(selectedTableList[0], 'selectedTableList');
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          id,
          checkItem,
          checkItemDesc,
          itemType,
          theoreticalLowerBound,
          theoreticalUpperLimit,
          // eslint-disable-next-line no-unneeded-ternary
          required: required === 'Y' ? true : false,
        };
      });
      if (selectedTableList[0].associateBom) {
        this.$refs.selectableBomTree.selectfloder = selectedTableList[0].associateBom.map(
          (bomId) => {
            const obj = {
              bomId,
            };
            return obj;
          },
        );
      }
    },
  },
};
</script>
