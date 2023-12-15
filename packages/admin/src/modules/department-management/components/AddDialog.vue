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
            ? $t('departmentManagement.dialog.addDept')
            : $t('departmentManagement.dialog.editDept')
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
                class="mx-3 mt-1"
                :label="`${$t('departmentManagement.label.parent')}*`"
                :items="departmentList"
                item-text="deptName"
                item-value="deptId"
                v-model="tabledataobj.parentId"
                disabled
                v-if="tabledataobj.parentId !== 0"
              ></v-autocomplete>
              <div class="mx-3 mt-1">{{ `${$t('departmentManagement.label.type')}*` }}</div>
              <v-radio-group
                v-model="tabledataobj.type"
                row
                class="mx-3 mt-0"
                disabled
                dense
              >
                <v-radio
                  v-for="(type, key) in deptTypeList"
                  :key="`depttype${key}`"
                  :label="$t(`departmentManagement.label.${type.text}`)"
                  :value="type.value"
                ></v-radio>
              </v-radio-group>
              <v-text-field
                class="mx-3 mt-2"
                clearable
                :rules="rules.number"
                :label="`${$t('departmentManagement.table.number')}*`"
                v-model="tabledataobj.deptCode"
                :counter="20"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-2"
                clearable
                :rules="rules.name"
                :label="`${$t('departmentManagement.table.name')}*`"
                v-model="tabledataobj.deptName"
                :counter="30"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :rules="rules.sort"
                :label="`${$t('departmentManagement.table.sort')}*`"
                v-model="tabledataobj.orderNum"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :rules="rules.leader"
                :label="`${$t('departmentManagement.table.leader')}`"
                v-model="tabledataobj.leader"
                :counter="20"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :rules="rules.phone"
                :label="`${$t('departmentManagement.label.phone')}`"
                v-model="tabledataobj.phone"
                :counter="11"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :rules="rules.email"
                :label="`${$t('departmentManagement.label.email')}`"
                v-model="tabledataobj.email"
                :counter="50"
              ></v-text-field>
              <div
                class="mx-3 mt-1"
              >{{ `${$t('departmentManagement.label.status')}*` }}</div>
              <v-radio-group
                v-model="tabledataobj.status"
                row
                class="mx-3 mt-0"
                mandatory
                :rules="rules.isRequired"
              >
                <v-radio
                  v-for="(status, key) in statusList"
                  :key="key"
                  :label="status.dictLabel"
                  :value="status.dictValue"
                ></v-radio>
                <!-- <v-radio
                  :label="$t('departmentManagement.label.disable')"
                  value="1"
                ></v-radio> -->
              </v-radio-group>
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
  name: 'DeptAddDialog',
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
    isNew: {
      type: Boolean,
    },
    parentId: {
      type: Number,
    },
    deptId: {
      type: Number,
    },
    type: {
      type: String,
    },
  },
  components: {
  },
  computed: {
    ...mapState('departmentManagement', ['deptTypeList', 'departmentList', 'statusList']),
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
      return this.$getDeptRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('departmentManagement', ['getDeptById', 'addDept', 'editDept', 'getStatusList']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        isNew,
        parentId,
        tabledataobj,
      } = this;
      const {
        deptId,
        type,
        deptCode,
        deptName,
        email,
        leader,
        orderNum,
        phone,
        status,
      } = tabledataobj;
      let payload = {
        type,
        deptCode,
        deptName,
        email,
        leader,
        orderNum,
        phone,
        status,
      };
      let result = null;
      if (isNew) {
        payload = {
          ...payload,
          parentId,
        };
        result = await this.addDept(payload);
      } else {
        payload = {
          ...payload,
          parentId: tabledataobj.parentId,
          deptId,
        };
        result = await this.editDept(payload);
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
        this.tabledataobj = {
          type: this.type,
          parentId: this.parentId,
        };
      });
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      await this.getStatusList();
      const { deptId, isNew } = this;
      if (isNew) {
        this.reset();
        return;
      }
      const dept = await this.getDeptById(deptId);
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...dept,
        };
      });
    },
  },
};
</script>
