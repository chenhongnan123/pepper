<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="400px"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden">
      <v-row>
        <v-col :cols="12">
          <v-card-title primary-title>
            <span>
              {{ $t('dataAnalysis.dialog.saveview')}}
            </span>
            <v-spacer></v-spacer>
            <v-btn
              icon
              small
              @click="dialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text :max-height="'320px'">
            <v-form ref="form" lazy-validation>
              <v-text-field
                class="mt-4"
                dense
                :label="`${$t('dataAnalysis.table.viewnumber')}*`"
                v-model="tabledataobj.key"
                clearable
                :rules="rules.number"
                :disabled="editView"
                :counter="20"
              ></v-text-field>
              <v-text-field
                class="mt-4"
                dense
                :label="`${$t('dataAnalysis.table.viewname')}*`"
                v-model="tabledataobj.value"
                clearable
                :rules="rules.name"
                :counter="50"
              ></v-text-field>
              <v-text-field
                class="mt-4"
                dense
                :label="`${$t('dataAnalysis.table.viewcomments')}`"
                v-model="tabledataobj.desc"
                clearable
              ></v-text-field>
            </v-form>
            <div>
              <!-- <v-text-field
                class="mt-4"
                dense
                :label="`${$t('dataAnalysis.label.datasource')}*`"
                v-model="datasourcename"
                disabled
                v-if="datasourcename"
              ></v-text-field> -->
              <v-text-field
                class="mt-4"
                dense
                :label="`${$t('dataAnalysis.label.datatable')}*`"
                v-model="datatablename"
                disabled
                v-if="datatablename"
              ></v-text-field>
            </div>
          </v-card-text>
          <v-card-actions class="mt-4 mb-2">
            <v-spacer></v-spacer>
            <v-btn
              v-if="!editView"
              color="warning"
              small
              text
              class="mr-2"
              @click="reset"
            >
              {{ $t('dataAnalysis.btn.reset') }}
            </v-btn>
            <v-btn
              color="primary"
              small
              class="text-none"
              @click="handleSave"
            >
              {{ $t('dataAnalysis.btn.save') }}
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
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
  name: 'SaveMonitorView',
  data() {
    return {
      tabledataobj: {
        key: '',
        value: '',
        desc: '',
      },
      // datasourcename: null,
      datatablename: null,
      saveparams: {}, // 存放视图详细信息
    };
  },
  props: {
    saveDialog: {
      type: Boolean,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
    parameters: {
      type: Object,
    },
    viewData: {
      type: Object,
      required: true,
    },
    processId: {
      type: Number,
      required: false,
    },
  },
  computed: {
    ...mapState('dataAnalysis', ['elements', 'dataTableList']),
    dialog: {
      get() {
        return this.saveDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    // 是否为编辑状态
    editView() {
      // console.log(Object.keys(this.viewData), 'viewData');
      return Object.keys(this.viewData).length > 0;
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('dataAnalysis', ['addUpdateView', 'editProcessControl']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        id, // 编辑视图时包含id
        key,
        value,
        desc,
      } = this.tabledataobj;
      const payload = {
        API_ROUTE_PATH: this.editView ? 'FND.UPDATE' : 'FND.ADD',
        FND: {
          LOOKUP_ID: id,
          MEANING: key,
          LOOKUP_CODE: value,
          DESCRIPTION: desc,
          segment1: JSON.stringify(this.saveparams), // 转换成string后存储
          segment2: this.datatablename || '', // 数据表名
          segment3: this.saveparams.algorithmText || '', // 算法名称
          segment4: 'monitor_spc_view',
          enabled_flag: '1',
          LOOKUP_TYPE: 'SPC_VIEW_LIST',
        },
        UNIQUE: 'LOOKUP_TYPE,MEANING',
      };
      // 新增视图时不需要传递LOOKUP_ID
      if (!this.editView) {
        delete payload.FND.LOOKUP_ID;
      }
      const result = await this.addUpdateView(payload);
      if (result) {
        // 保存视图编号至过程监测表
        if (this.processId) {
          const payload2 = {
            proControlId: this.processId,
            paramsCode: this.saveparams.datatable || '',
            paramsName: this.datatablename || '',
            spcModel: this.saveparams.algorithmText || '',
            lookupKey: key, // 视图编号
            lookupValue: value, // 视图名称
          };
          await this.editProcessControl(payload2);
        }
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.$emit('refresh');
        this.dialog = false;
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      this.$nextTick(() => {
        this.tabledataobj = {
          key: '',
          value: '',
          desc: '',
        };
      });
    },
  },
  watch: {
    dialog(dialog) {
      if (!dialog) {
        this.reset();
        return;
      }
      if (this.editView) {
        const {
          id,
          key,
          value,
          desc,
        } = this.viewData;
        this.tabledataobj = {
          id,
          key,
          value,
          desc,
        };
      }
      const {
        datatable,
        dataTableName,
        paramCode,
        currentDates,
        isrealtime,
        freshrate,
        dataquantity,
        algorithmtype,
        algorithm,
        algorithmText,
        options,
        payload,
      } = this.parameters;
      this.datatablename = dataTableName;
      this.saveparams = {
        datatable,
        dataTableName,
        paramCode,
        currentDates,
        isrealtime,
        freshrate,
        dataquantity,
        algorithmtype,
        algorithm,
        algorithmText,
        options,
        payload,
      }; // 封装视图详细信息
    },
  },
};
</script>
<style scoped>
.selectContainer {
  display: flex;
  width: 100%;
}

.no{
  line-height: 64px;
  font-size: 20px;
}

.addBtns{
  line-height: 64px;
}

</style>
