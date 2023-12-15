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
            <span v-if="!editView">
              {{ $t('dataAnalysis.dialog.saveview')}}
            </span>
            <span v-if="editView">
              {{ $t('dataAnalysis.dialog.modifyview')}}
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
                v-model="tabledataobj.viewNumber"
                clearable
                :rules="rules.number"
                :disabled="editView"
                :counter="20"
              ></v-text-field>
              <v-text-field
                class="mt-4"
                dense
                :label="`${$t('dataAnalysis.table.viewname')}*`"
                v-model="tabledataobj.viewName"
                clearable
                :rules="rules.name"
                :counter="50"
              ></v-text-field>
              <v-text-field
                class="mt-4"
                dense
                :label="`${$t('dataAnalysis.table.viewcomments')}`"
                v-model="tabledataobj.viewDescription"
                clearable
                :rules="rules.over500"
                :counter="500"
              ></v-text-field>
            </v-form>
            <div>
              <v-text-field
                class="mt-4"
                dense
                :label="`${$t('dataAnalysis.label.datasource')}*`"
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
  name: 'saveViewDialog',
  data() {
    return {
      tabledataobj: {},
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
    editView: {
      type: Boolean,
      required: true,
    },
    viewData: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('dataAnalysis', ['viewDetail']),
    dialog: {
      get() {
        return this.saveDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('dataAnalysis', ['addView', 'updateView']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        id, // 编辑视图时包含id
        viewName,
        viewNumber,
        viewDescription,
      } = this.tabledataobj;
      const {
        dataSourceId, // 数据源表id
        currentDates,
        isrealtime,
        freshrate,
        dataquantity,
        algorithmtype,
        algorithm,
        options,
      } = this.saveparams;
      let payload = {
        viewName,
        viewNumber,
        viewDescription: viewDescription || '',
      };
      // 新增视图，传明细
      if (!this.editView) {
        payload = {
          ...payload,
          dataSourceId,
          isRealtime: isrealtime ? 1 : 0,
          beginTime: currentDates[0],
          endTime: currentDates[1],
          dataQuantity: Number(dataquantity) || 0,
          freshRate: freshrate?.value ? Number(freshrate.value) : 0,
          algorithm,
          algorithmType: algorithmtype,
          options: JSON.stringify(options),
          segment: JSON.stringify(this.saveparams),
        };
      } else {
        // 编辑视图仅传id名称编号描述
        payload = {
          ...payload,
          id,
        };
      }
      let result = null;
      if (this.editView) {
        result = await this.updateView(payload);
      } else {
        result = await this.addView(payload);
      }
      if (result) {
        this.$emit('getViewList');
        this.dialog = false;
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      this.$nextTick(() => {
        this.tabledataobj = {};
      });
    },
  },
  watch: {
    dialog(dialog) {
      if (!dialog) {
        return;
      }
      if (this.editView) {
        // 修改视图只允许修改名称、备注
        this.tabledataobj = this.viewData;
        // console.log(this.viewData, 'this.viewData');
      } else {
        this.reset();
        const {
          dataTableName,
        } = this.parameters;
        this.datatablename = dataTableName;
        this.saveparams = {
          ...this.parameters,
        }; // 封装视图详细信息
      }
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
