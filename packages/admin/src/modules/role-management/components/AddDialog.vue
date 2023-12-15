<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'480px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            isNew
            ? $t('roleManagement.dialog.add')
            : $t('roleManagement.dialog.edit')
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
            <v-col cols="12" >
              <v-text-field
                class="mx-3 mt-2"
                clearable
                :rules="rules.name"
                :label="`${$t('roleManagement.table.name')}*`"
                v-model="tabledataobj.roleName"
                :counter="30"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :rules="rules.isRequired"
                :label="`${$t('roleManagement.label.roleKey')}*`"
                v-model="tabledataobj.roleKey"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :rules="rules.sort"
                :label="`${$t('roleManagement.table.sort')}*`"
                type="number"
                v-model="tabledataobj.roleSort"
              ></v-text-field>
              <div
                class="mx-3 mt-1"
              >{{ `${$t('roleManagement.label.status')}*` }}</div>
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
                  :label="$t('roleManagement.label.disable')"
                  value="1"
                ></v-radio> -->
              </v-radio-group>
              <div
                class="mx-3 mt-1"
              >{{ `${$t('roleManagement.label.tabletLogin')}` }}</div>
              <v-checkbox
                v-model="tabledataobj.tabletLogin"
                :label="systemName02[0]?.configValue"
                :value="1"
                class="mx-3 mt-0"
              ></v-checkbox>
              <selectable-data-tree
                class="mx-3 mt-1"
                ref="selectableDataTree"
                :title="$t('roleManagement.label.menuPermission')"
                :height="300"
                :treeList="menuTree"
                itemKey="id"
                itemText="label"
                :isErr="false"
              />
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :label="`${$t('roleManagement.table.remark')}`"
                v-model="tabledataobj.remark"
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
import SelectableDataTree from '@/components/commonUI/SelectableDataTree.vue';

export default {
  name: 'RoleAddDialog',
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
    selectedTableList: {
      type: Array,
    },
    systemNameList: {
      type: Array,
    },
  },
  components: {
    SelectableDataTree,
  },
  computed: {
    ...mapState('roleManagement', [
      'roleList',
      'deptTree',
      'menuTree',
      'dataScopeList',
      'statusList',
      'tabletLoginList',
    ]),

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
      return this.$getRoleRules();
    },
    systemName02() {
      // 终端的值在系统参数中设置，取'sys.index.systemname01','sys.index.systemname02'
      return this.systemNameList.filter((ele) => ['sys.index.systemname02'].indexOf(ele.configKey) > -1);
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('roleManagement', [
      'getRoleById',
      'getMenuTree',
      'addRole',
      'editRole',
      'getStatusList',
      'getTabletLoginList',
    ]),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        isNew,
        tabledataobj,
      } = this;
      const {
        roleId,
        roleName,
        roleKey,
        status,
        tabletLogin,
        roleSort,
        deptIds,
        remark,
      } = tabledataobj;
      const menuIds = this.$refs.selectableDataTree.getSelectedIdList();
      let payload = {
        roleName,
        roleKey,
        status,
        tabletLogin: tabletLogin === 1 ? tabletLogin : 0, // 不勾选默认为0
        roleSort,
        deptIds,
        menuIds,
        deptCheckStrictly: true,
        menuCheckStrictly: true,
        remark,
      };
      let result = null;
      if (isNew) {
        result = await this.addRole(payload);
      } else {
        payload = {
          ...payload,
          roleId,
        };
        result = await this.editRole(payload);
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
      await this.getStatusList();
      const { selectedTableList, isNew } = this;
      if (isNew || selectedTableList.length === 0) {
        await this.getMenuTree();
        this.reset();
        return;
      }
      const { roleId } = selectedTableList[0];
      const checkedKeys = await this.getMenuTree(roleId);
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...selectedTableList[0],
          tabletLogin: selectedTableList[0].tabletLogin === '1' ? 1 : 0, // 对后端传回的字段做兼容
        };
        this.$refs.selectableDataTree.selectfloder = checkedKeys.map((key) => {
          const obj = {
            id: key,
          };
          return obj;
        });
      });
    },
  },
};
</script>
