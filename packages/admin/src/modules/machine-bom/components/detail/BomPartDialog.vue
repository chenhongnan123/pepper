<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'400px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title>
        <span>
          {{
            isAddNew
            ? $t('machineBom.dialog.addBom')
            : $t('machineBom.dialog.editBom')
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
            :rules="rules.name"
            :label="`${$t('machineBom.table.bomName')}*`"
            v-model="tabledataobj.bomName"
            :counter="50"
          ></v-text-field>
          <v-autocomplete
            class="mt-3"
            dense
            clearable
            :label="`${$t('machineBom.dialog.productName')}*`"
            :items="partList"
            item-text="partName"
            item-value="partId"
            v-model="tabledataobj.part"
            :rules="rules.isRequired"
            :filter="handlePartFilter"
            return-object
          >
            <template v-slot:item="{ item }">
            <div
              class="d-flex justify-space-between custom-autocomplete"
              style="width:100%"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.partName }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.partNumber }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ item.partDescription }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-icon v-if="item.disabled">mdi-cancel</v-icon>
            </div>
            </template>
          </v-autocomplete>
          <v-text-field
            class="mt-3"
            clearable
            dense
            :rules="rules.isInter"
            type="number"
            :label="`${$t('machineBom.dialog.productNumber')}*`"
            v-model="tabledataobj.partQty"
          ></v-text-field>
          <!-- <v-text-field
            class="mt-3"
            clearable
            dense
            :label="`${$t('machineBom.dialog.positionNum')}`"
            v-model="tabledataobj.positionNumber"
            :rules="rules.over10"
            :counter="10"
          ></v-text-field> -->
          <v-text-field
            class="mt-3"
            clearable
            dense
            :label="`${$t('machineBom.dialog.elecSymbol')}`"
            v-model="tabledataobj.electricSymbol"
            :counter="10"
            :rules="rules.over10"
          ></v-text-field>
          <div>
            <v-select
              class="mt-3"
              :items="lifeTypeList"
              :label="`${$t('machineBom.dialog.lifeType')}*`"
              v-model="tabledataobj.sparePartLifeType"
              item-text="text"
              item-value="value"
              :rules="rules.isRequired"
              :disabled="sparePartLifeTypeDisabled"
            ></v-select>
            <v-text-field
              v-if="tabledataobj.sparePartLifeType == '1' || tabledataobj.sparePartLifeType == '2'"
              class="mt-3"
              clearable
              dense
              :rules="rules.isInter"
              type="number"
              :label="`${$t('machineBom.dialog.restLife')}*`"
              v-model="tabledataobj.sparePartLife"
            ></v-text-field>
            <v-autocomplete
              v-if="tabledataobj.sparePartLifeType == '1' || tabledataobj.sparePartLifeType == '2'"
              class="mt-3"
              dense
              clearable
              :label="`${$t('machineBom.dialog.countParameter')}*`"
              :items="parameterList"
              item-text="parameterName"
              item-value="parameterId"
              v-model="tabledataobj.countParameter"
              :rules="rules.isRequired"
            >
              <template v-slot:item="{ item }">
              <div
                class="d-flex justify-space-between custom-autocomplete"
                style="width:100%"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.parameterName }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ item.parameterNumber }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    {{ item.parameterDescription }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    {{ item.connectionName }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-icon v-if="item.disabled">mdi-cancel</v-icon>
              </div>
              </template>
            </v-autocomplete>
            <v-text-field
              v-if="tabledataobj.sparePartLifeType == '1' || tabledataobj.sparePartLifeType == '2'"
              class="mt-3"
              clearable
              dense
              :rules="rules.isPercent"
              type="number"
              :label="`${$t('machineBom.dialog.warnPercent')}*`"
              v-model="tabledataobj.warningRatio"
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
          :disabled="loading"
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
import moment from 'moment';

let timer = null;
export default {
  name: 'productLineDialog',
  data() {
    return {
      tabledataobj: {
      },
      moment,
      lifeTypeList: [
        {
          text: '无',
          value: '0',
        },
        {
          text: '计次',
          value: '1',
        },
        {
          text: '计时',
          value: '2',
        },
      ],
      loading: false,
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    isAddNew: {
      type: Boolean,
      required: true,
    },
    selectedBom: {
      type: Object,
      required: true,
    },
    selectedtablelist: {
      type: Array,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('machineBom', ['partList', 'parameterList']),
    dialog: {
      get() {
        return this.addDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    sparePartLifeTypeDisabled() {
      const { isAddNew, selectedtablelist } = this;
      if (selectedtablelist.length) {
        const { sparePartLifeType } = selectedtablelist[0];
        return !isAddNew && (sparePartLifeType === '1' || sparePartLifeType === '2');
      }
      return false;
    },
  },
  beforeDestroy() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('machineBom', [
      'getPartList',
      'getParameterList',
      'addBom',
      'editBom',
    ]),
    async getParts() {
      await this.getPartList();
    },
    async getParamters() {
      await this.getParameterList();
    },
    handlePartFilter(item, queryText, itemText) {
      // console.log(queryText, 'queryText');
      const { partDescription, partNumber } = item;
      return itemText.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1 ||
        (partDescription
          && partDescription.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1) ||
        (partNumber
          && partNumber.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1);
    },
    async handleSave() {
      this.loading = true;
      if (!this.$refs.form.validate()) {
        this.loading = false;
        return;
      }
      const {
        isAddNew,
        tabledataobj,
        selectedBom,
      } = this;
      const {
        bomId,
        bomLevel,
        bomName,
        countParameter,
        electricSymbol,
        partQty,
        // positionNumber,
        sparePartLife,
        sparePartLifeType,
        warningRatio,
        part,
      } = tabledataobj;
      const {
        partId,
        partName,
        partNumber,
        partType,
      } = part;
      let result = null;
      const payload = {
        bomParentId: selectedBom.bomId, // 新增零件，绑定的父件id
        bomId, // 修改零件对应的bomid
        bomLevel: bomLevel || '2',
        bomName,
        bomNumber: partNumber,
        partId,
        partName,
        partNumber,
        partType,
        partQty,
        countParameter,
        electricSymbol,
        // positionNumber,
        sparePartLife,
        sparePartLifeType,
        warningRatio,
      };
      if (isAddNew) {
        delete payload.bomId;
        result = await this.addBom(payload);
      } else {
        delete payload.bomParentId;
        result = await this.editBom(payload);
      }
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        timer = setTimeout(() => {
          this.$emit('getTableList');
        }, 100);
        this.dialog = false;
      }
      this.loading = false;
    },
    reset() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.reset();
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
      await this.getParts();
      await this.getParamters();
      if (!this.isAddNew) {
        const {
          bomId,
          bomLevel,
          bomName,
          countParameter,
          electricSymbol,
          partDescription,
          partId,
          partName,
          partNumber,
          partQty,
          partType,
          // positionNumber,
          sparePartLife,
          sparePartLifeType,
          warningRatio,
        } = this.selectedtablelist[0];
        this.$nextTick(async () => {
          this.tabledataobj = {
            ...this.tabledataobj,
            bomId,
            bomLevel,
            bomName,
            countParameter,
            electricSymbol,
            partQty,
            // positionNumber,
            sparePartLife,
            sparePartLifeType,
            warningRatio,
            part: {
              partDescription,
              partId,
              partName,
              partNumber,
              partType,
            },
          };
        });
      }
    },
  },
};
</script>
