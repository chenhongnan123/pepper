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
            $t('roleManagement.dialog.dataScope')
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
                :label="`${$t('roleManagement.table.name')}`"
                v-model="tabledataobj.roleName"
                disabled
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-1"
                :label="`${$t('roleManagement.label.roleKey')}`"
                v-model="tabledataobj.roleKey"
                disabled
              ></v-text-field>
              <v-autocomplete
                clearable
                :rules="rules.isRequired"
                :label="`${$t('roleManagement.label.dataScope')}*`"
                class="mx-3 mt-1"
                v-model="tabledataobj.dataScope"
                :items="dataScopes"
                item-text="text"
                item-value="value"
              >
              </v-autocomplete>
              <selectable-data-tree
                class="mx-3 mt-1"
                ref="selectableDataTree"
                :title="$t('roleManagement.label.dataScope')"
                :height="300"
                :treeList="deptTree"
                itemKey="id"
                itemText="label"
                :isErr="false"
                v-show="tabledataobj.dataScope === '2'"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="mt-4">
        <v-spacer></v-spacer>
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
  name: 'DataScopeDialog',
  data() {
    return {
      tabledataobj: {
      },
    };
  },
  props: {
    dataScopeDialog: {
      type: Boolean,
      required: true,
    },
    roleId: {
      type: Number,
    },
  },
  components: {
    SelectableDataTree,
  },
  computed: {
    ...mapState('roleManagement', [
      'deptTree',
      'dataScopeList',
    ]),
    dialog: {
      get() {
        return this.dataScopeDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    rules() {
      return this.$getDeptRules();
    },
    dataScopes() {
      return this.dataScopeList.map((item) => {
        const obj = {
          ...item,
          text: this.$t(`roleManagement.label.dataScopeList.${item.text}`),
        };
        return obj;
      });
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('roleManagement', [
      'getRoleById',
      'getDeptTree',
      'editDataScope',
    ]),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        tabledataobj,
      } = this;
      const deptIds = this.$refs.selectableDataTree.getSelectedIdList();
      const payload = {
        ...tabledataobj,
        deptIds,
      };
      const result = this.editDataScope(payload);
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
      const { roleId } = this;
      const checkedKeys = await this.getDeptTree(roleId);
      const role = await this.getRoleById(roleId);
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...role,
        };
        if (role.dataScope === '2') {
          this.$refs.selectableDataTree.selectfloder = checkedKeys.map((key) => {
            const obj = {
              id: key,
            };
            return obj;
          });
        }
      });
    },
  },
};
</script>
