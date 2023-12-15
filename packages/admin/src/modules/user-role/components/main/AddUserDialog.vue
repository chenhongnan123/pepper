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
            ? $t('userRole.dialog.addUser')
            : $t('userRole.dialog.editUser')
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
                class="mx-3 mt-14"
                clearable
                :rules="rules.isRequired"
                :label="`${$t('userRole.table.account')}*`"
                v-model="tabledataobj.userName"
                :disabled="!isNew"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-3"
                clearable
                :append-icon="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                :type="showPassword ? 'text' : 'password'"
                :rules="rules.password"
                :label="`${$t('userRole.table.password')}*`"
                v-model="tabledataobj.password"
                v-if="isNew"
                @click:append="showPassword = !showPassword"
                :error-messages="passwordCheckMsg"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-3"
                clearable
                :append-icon="showRepassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                :type="showRepassword ? 'text' : 'password'"
                :rules="rules.password"
                :label="`${$t('userRole.table.repassword')}*`"
                v-model="tabledataobj.repassword"
                v-if="isNew"
                @click:append="showRepassword = !showRepassword"
                :error-messages="passwordCheckMsg"
              ></v-text-field>
              <v-autocomplete
                clearable
                :rules="rules.isRequired"
                :label="`${$t('userRole.role')}*`"
                class="mx-3 mt-3"
                v-model="tabledataobj.roleId"
                :items="roleList"
                item-text="roleName"
                item-value="id"
                @change="handleChangeRole"
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
              <div class="d-flex mx-3 mt-3">
                <v-text-field
                  class="mr-3 mt-3"
                  clearable
                  :label="`${$t('initialAdministrator.lastName')}`"
                  :counter="50"
                  :rules="rules.lastName"
                  v-model="tabledataobj.lastName"
                ></v-text-field>
                <v-text-field
                  class="ml-3 mt-3"
                  clearable
                  :label="`${$t('initialAdministrator.firstName')}`"
                  :counter="50"
                  :rules="rules.firstName"
                  v-model="tabledataobj.firstName"
                ></v-text-field>
              </div>
              <v-autocomplete
                clearable
                :label="`${$t('userRole.table.avatar')}`"
                class="mx-3 mt-3"
                v-model="tabledataobj.avatar"
                :items="avatarList"
              >
                <template #item="{ item }">
                  <v-avatar size="60" class="my-1">
                    <img
                      :src="require(`@/assets/avators/${item}.png`)"
                      :alt="item"
                    >
                  </v-avatar>
                </template>
                <template #prepend-inner>
                  <v-avatar size="60" class="my-1" v-if="avatar">
                    <img
                      :src="require(`@/assets/avators/${avatar}.png`)"
                      :alt="avatar"
                    >
                  </v-avatar>
                </template>
              </v-autocomplete>
              <v-text-field
                class="mx-3 mt-3"
                clearable
                :label="`${$t('initialAdministrator.email')}`"
                :rules="rules.email"
                v-model="tabledataobj.email"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-3"
                clearable
                :label="`${$t('initialAdministrator.telephone')}`"
                v-model="tabledataobj.phoneNumber"
                :rules="rules.telephone"
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
  name: 'UserAddDialog',
  data() {
    return {
      tabledataobj: {
      },
      oldRole: null,
      moreInfo: false,
      showPassword: false,
      showRepassword: false,
      passwordCheckMsg: null,
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
    ...mapState('user', ['avatarList']),
    ...mapState('userRole', ['roleList']),
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
      return this.$getInitialAdministratorRules();
    },
    avatar() {
      const { tabledataobj, avatarList } = this;
      if (tabledataobj.avatar) {
        if (avatarList.some((a) => a === tabledataobj.avatar)) {
          return tabledataobj.avatar;
        }
      }
      return '';
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('userRole', ['saveUser', 'updateUser', 'getRoleList']),
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
        userName,
        password,
        repassword,
        roleId,
        firstName,
        lastName,
        avatar,
        email,
        phoneNumber,
      } = tabledataobj;
      if (password !== repassword) {
        this.passwordCheckMsg = this.$t('userRole.dialog.passwordInconsistent');
        return;
      }
      const payload = {
        roleId,
        firstName: firstName || '',
        lastName: lastName || '',
        avatar,
        email: email || '',
        phoneNumber: phoneNumber || '',
      };
      let result = null;
      if (isNew) {
        payload.userName = userName;
        payload.password = password;
        payload.repassword = repassword;
        result = await this.saveUser(payload);
      } else {
        payload.id = id;
        result = await this.updateUser(payload);
      }
      if (result) {
        this.$emit('getTableList');
        this.dialog = false;
      }
    },
    async handleChangeRole() {
      const { oldRole } = this;
      const { roleId } = this.tabledataobj;
      if (!this.isNew && oldRole !== roleId) {
        const oldRoleName = this.roleList.reduce((a, o) => {
          if (oldRole === o.id) {
            a = o.roleName;
          }
          return a;
        }, '');
        const newRoleName = this.roleList.reduce((a, o) => {
          if (roleId === o.id) {
            a = o.roleName;
          }
          return a;
        }, '');
        if (!await this.$root.$confirm.open(
          this.$t('dialog.tips'),
          this.$t('userRole.dialog.accessChangeConfirm', { from: oldRoleName, to: newRoleName }),
        )) {
          this.tabledataobj.roleId = oldRole;
        } else {
          this.oldRole = roleId;
        }
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$nextTick(() => {
          this.tabledataobj = {};
          this.moreInfo = false;
          this.passwordCheckMsg = '';
          this.showPassword = false;
          this.showRepassword = false;
        });
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      this.passwordCheckMsg = '';
      this.showPassword = false;
      this.showRepassword = false;
      await this.getRoleList();
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
        userName,
        roleId,
        firstName,
        lastName,
        avatar,
        email,
        phoneNumber,
      } = selectedTableList[0];
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          id,
          userName,
          roleId,
          firstName,
          lastName,
          avatar,
          email,
          phoneNumber,
        };
        this.oldRole = roleId;
      });
    },
  },
};
</script>
