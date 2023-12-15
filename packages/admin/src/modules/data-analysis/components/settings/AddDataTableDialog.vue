<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'400px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden">
      <v-row>
        <v-col :cols="12">
          <v-card-title primary-title>
            <span>
              {{
                this.selectedTableList.length > 0
                  ? $t('spc.dialog.editdatatable')
                  : $t('spc.dialog.adddatatable')
              }}
            </span>
            <v-spacer></v-spacer>
            <v-btn icon small @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" lazy-validation>
              <v-text-field
                class="mt-2"
                clearable
                :rules="rules.number"
                :label="`${$t('spc.table.tablenumber')}*`"
                :counter="20"
                v-model="tabledataobj.number"
                :disabled="!isAddNew"
              ></v-text-field>
              <v-autocomplete
                class="mt-2"
                :label="`${$t('spc.table.tablename')}*`"
                clearable
                v-model="tabledataobj.name"
                :items="tablenamelist"
                item-text="text"
                item-value="text"
                :rules="nameRules"
              >
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.text }}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
              <v-text-field
                class="mt-2"
                clearable
                :label="`${$t('spc.table.tabledescription')}*`"
                v-model="tabledataobj.description"
                :rules="rules.name"
                :counter="50"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="warning"
              small
              text
              class="mr-2"
              @click="reset"
              v-if="selectedTableList.length === 0"
            >
              {{ $t('spc.btn.reset') }}
            </v-btn>
            <v-btn
              color="primary"
              small
              class="text-none"
              @click="handleSave"
              :disabled="loading"
            >
              {{ $t('spc.btn.save') }}
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
  name: 'addDataTable',
  data() {
    return {
      tabledataobj: {
        name: '',
        number: '',
        description: '',
      },
      // loading: false,
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
    selectedTableList: {
      type: Array,
    },
    tablelist: {
      type: Array,
      required: true,
    },
  },
  created() {
    this.init();
  },
  computed: {
    ...mapState('spc', ['elements']),
    dialog: {
      get() {
        return this.addDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    isAddNew() {
      return this.selectedTableList.length === 0;
    },
    // 数据来源表的选项列表
    tablenamelist() {
      const list = this.elements.map((item) => {
        const obj = {
          text: item.value,
          value: item.key,
        };
        return obj;
      });
      return list;
    },
    nameRules() {
      return [
        // eslint-disable-next-line
        v => !!v || `${this.$t('spc.verification.isrequired')}`,
        // eslint-disable-next-line
        v => this.validateDupName() || `${this.$t('spc.verification.datatableexists')}`,
      ];
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('spc', ['getElements', 'addOrUpdateTable']),
    async init() {
      await this.getElements();
    },
    // 校验数据表名称是否重复，编辑时跳过自身name校验
    validateDupName() {
      if (this.tablelist.length > 0) {
        const namelist = [];
        for (let i = 0; i < this.tablelist.length; i += 1) {
          if (this.selectedTableList.length > 0) {
            // eslint-disable-next-line
            const { lookup_id } = this.selectedTableList[0];
            // eslint-disable-next-line
            if (this.tablelist[i].lookup_id !== lookup_id) {
              namelist.push(this.tablelist[i].lookup_code);
            }
          } else {
            namelist.push(this.tablelist[i].lookup_code);
          }
        }
        return !namelist.includes(this.tabledataobj.name);
      }
      return true;
    },
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        id,
        name,
        number,
        description,
      } = this.tabledataobj;
      const payload = {
        API_ROUTE_PATH: this.isAddNew ? 'FND.ADD' : 'FND.UPDATE',
        FND: {
          LOOKUP_ID: id,
          MEANING: number,
          LOOKUP_CODE: name,
          DESCRIPTION: description,
          enabled_flag: '1', // 是否启用
          LOOKUP_TYPE: 'SPC_DATA_SOURCE_LIST',
        },
        UNIQUE: 'LOOKUP_TYPE,MEANING', // 固定值
      };
      if (this.isAddNew) {
        delete payload.FND.LOOKUP_ID;
      }
      // console.log(payload, 'payload');
      const result = await this.addOrUpdateTable(payload);
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.$emit('getTableList');
        this.dialog = false;
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      if (this.$refs.rightform) {
        this.$refs.rightform.reset();
      }
      this.$nextTick(() => {
        this.tabledataobj = {
          name: '',
          number: '',
          description: '',
        };
      });
    },
  },
  watch: {
    dialog(dialog) {
      if (!dialog) {
        return;
      }
      const { selectedTableList } = this;
      if (selectedTableList.length === 0) {
        this.reset();
        return;
      }
      const {
        // eslint-disable-next-line
        lookup_code, // 名称
        meaning, // 编号
        description,
        // eslint-disable-next-line
        lookup_id, // id
      } = selectedTableList[0];
      this.$nextTick(() => {
        this.tabledataobj = {
          id: lookup_id,
          name: lookup_code,
          number: meaning,
          description,
        };
      });
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
  line-height: 60px;
}
</style>
