<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'900px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            isNew
            ? $t('expertKnowledge.dialog.addExpertKnowledge')
            : $t('expertKnowledge.dialog.editExpertKnowledge')
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
            <v-col cols="6" >
              <v-autocomplete
                clearable
                :rules="rules.isRequired"
                :label="`${$t('expertKnowledge.table.type')}*`"
                class="mx-3 mt-1"
                v-model="tabledataobj.expertiseType"
                :items="expertKnowledgeTypes"
                item-text="dictLabel"
                item-value="key"
              >
              </v-autocomplete>
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :rules="rules.number"
                :label="`${$t('expertKnowledge.table.number')}*`"
                v-model="tabledataobj.expertiseNumber"
                :counter="20"
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
                :label="`${$t('expertKnowledge.table.description')}`"
                v-model="tabledataobj.expertiseDescription"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <selectable-bom-tree
                :title="$t('expertKnowledge.table.errorPosition')"
                class="mx-3 mt-3"
                ref="selectableBomTree"
                :placeholder="$t('algorithmConstruction.dialog.searchPart')"
                :height="400"
                :bomList="formatBomList(bomTreeList)"
                :isMultiple="false"
                :isErr="!!bomErrMsg"
                :isShowMaintenancePart="false"
                :isShowMainPart="false"
                itemChildren="childrenBomList"
                itemKey="bomId"
                itemText="bomName"
                alarmDisabledKey="isParent"
              />
              <div class="mx-4 error--text">{{bomErrMsg}}</div>
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
  mapGetters,
} from 'vuex';

import selectableBomTree from '@/components/commonUI/SelectableBomTree.vue';

export default {
  name: 'ExpertKnowledgeAddDialog',
  data() {
    return {
      tabledataobj: {
      },
      bomErrMsg: '',
      expertKnowledgeTypes: [],
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
    selectableBomTree,
  },
  computed: {
    ...mapState('algorithmConstruction', ['bomTreeList']),
    ...mapState('expertKnowledge', ['expertKnowledgeTypeList']),
    ...mapGetters('algorithmConstruction', ['formatBomList']),
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
    ...mapActions('algorithmConstruction', ['getBomTree']),
    ...mapActions('expertKnowledge', ['getExpertKnowledgeTypeList', 'addExpertKnowledge', 'updateExpertKnowledge']),
    async handleSave() {
      if (!this.$refs.selectableBomTree.selectfloder.length) {
        this.bomErrMsg = this.$t('verification.isrequired');
        return;
      }
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        isNew,
        tabledataobj,
      } = this;
      const {
        expertiseId,
        expertiseName,
        expertiseNumber,
        expertiseDescription,
        expertiseType,
      } = tabledataobj;
      const { bomId } = this.$refs.selectableBomTree.selectfloder[0];
      const payload = {
        expertiseName,
        expertiseNumber,
        expertiseDescription,
        expertiseType,
        bomId,
      };
      let result = null;
      if (isNew) {
        result = await this.addExpertKnowledge(payload);
      } else {
        payload.expertiseId = expertiseId;
        result = await this.updateExpertKnowledge(payload);
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
          this.bomErrMsg = '';
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
      await this.getBomTree();
      this.expertKnowledgeTypes = this.expertKnowledgeTypeList.filter((item) => item.status === '0');
      const {
        selectedTableList,
      } = this;
      if (!selectedTableList.length || this.isNew) {
        this.reset();
        return;
      }
      const {
        expertiseId,
        expertiseName,
        expertiseNumber,
        expertiseDescription,
        expertiseType,
      } = selectedTableList[0];
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          expertiseId,
          expertiseName,
          expertiseNumber,
          expertiseDescription,
          expertiseType,
        };
      });
      if (selectedTableList[0].bomId) {
        this.$refs.selectableBomTree.selectfloder = [
          {
            bomId: selectedTableList[0].bomId,
          },
        ];
      }
    },
  },
};
</script>
