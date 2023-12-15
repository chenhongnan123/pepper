<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="moreInfo?'800px':'400px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            isNew
            ? $t('userRole.dialog.addRole')
            : $t('userRole.dialog.editRole')
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
          >
            <v-col :cols="moreInfo?'6':'12'" >
              <v-text-field
                class="mx-3 mt-9"
                clearable
                :rules="rules.number"
                :label="`${$t('userRole.table.roleId')}*`"
                v-model="tabledataobj.roleNumber"
                :disabled="!isNew"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-3"
                clearable
                :rules="rules.name"
                :label="`${$t('userRole.table.roleName')}*`"
                v-model="tabledataobj.roleName"
              ></v-text-field>
              <v-autocomplete
                clearable
                :rules="rules.isRequired"
                :label="`${$t('userRole.table.roleType')}*`"
                class="mx-3 mt-3"
                v-model="tabledataobj.roleType"
                :items="roleTypes"
                item-text="languageValue"
                item-value="dictCode"
              >
              </v-autocomplete>
              <div class="d-flex justify-end">
                <v-btn
                  color="primary"
                  small
                  text
                  class="mr-2"
                  @click="moreInfo = !moreInfo"
                >
                  {{$t('initialAdministrator.moreInfo')}}
                  <v-icon v-if="moreInfo">mdi-menu-left</v-icon>
                  <v-icon v-else>mdi-menu-right</v-icon>
                </v-btn>
              </div>
            </v-col>
            <v-col cols="6" v-if="moreInfo">
              <div class="text-h6">{{ $t('initialAdministrator.moreInfo')}} </div>
              <v-text-field
                class="mx-3"
                clearable
                :label="`${$t('userRole.table.roleDescription')}`"
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

export default {
  name: 'RoleAddDialog',
  data() {
    return {
      tabledataobj: {
      },
      moreInfo: false,
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
    isNew: {
      type: Boolean,
    },
  },
  computed: {
    ...mapState('helper', ['currentLocale']),
    ...mapState('userRole', ['roleTypeList']),
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
      return this.$getOperatorRules();
    },
    roleTypes() {
      const { currentLocale, roleTypeList } = this;
      const listByLanguage = roleTypeList.filter((m) => m.type === currentLocale);
      if (listByLanguage.length) {
        const { dictVoList } = listByLanguage[0];
        return dictVoList;
      }
      return [];
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('userRole', ['handleRole', 'getRoleTypeList']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        isNew,
        tabledataobj,
      } = this;
      const {
        id,
        roleNumber,
        roleName,
        roleType,
        remark,
      } = tabledataobj;
      const payload = {
        roleNumber,
        roleName,
        roleType,
        remark: remark || '',
      };
      let result = null;
      if (isNew) {
        result = await this.handleRole({
          action: 'create',
          payload,
        });
      } else {
        payload.id = id;
        result = await this.handleRole({
          action: 'update',
          payload,
        });
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
          this.moreInfo = false;
        });
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      await this.getRoleTypeList();
      const {
        selectedTableList,
      } = this;
      // console.log(this.rules, 'rules');
      if (!selectedTableList.length || this.isNew) {
        this.reset();
        return;
      }
      const {
        id,
        roleNumber,
        roleName,
        roleType,
        remark,
      } = selectedTableList[0];
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          id,
          roleNumber,
          roleName,
          roleType,
          remark,
        };
      });
    },
  },
};
</script>
