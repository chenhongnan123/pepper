<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'400px'"
  >
    <v-card
      style="overflow: hidden"
    >
      <v-card-title primary-title>
        <span>
          {{ $t('userManagement.dialog.assignRole') }}
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
      <v-card-text :style="`height: 250px;overflow-y: auto;`">
        <v-text-field
          type="text"
          :label="`${$t('userManagement.label.nickname')}`"
          v-model="userInfo.nickname"
          disabled
        ></v-text-field>
        <v-text-field
          type="text"
          :label="`${$t('userManagement.label.userAccount')}`"
          v-model="userInfo.account"
          disabled
        ></v-text-field>
        <v-autocomplete
          class="mt-2"
          clearable
          :label="`${$t('userManagement.label.role')}`"
          :items="authRoleList"
          chips
          dense
          multiple
          item-text="roleName"
          item-value="roleId"
          v-model="roleIds"
        >
          <template v-slot:selection="data">
            <v-chip
              v-bind="data.attrs"
              :input-value="data.selected"
              close
              @click="data.select"
              @click:close="removeRole(data.item)"
            >
              {{ data.item.roleName }}
            </v-chip>
          </template>
          <template v-slot:item="{ item }">
            <div
              class="d-flex justify-space-between"
              style="width:100%"
            >
              <v-list-item-content style="width: 100px!important;">
                <v-list-item-title>
                  {{ item.roleName }}
                </v-list-item-title>
              </v-list-item-content>
              <v-icon v-if="item.disabled">mdi-cancel</v-icon>
            </div>
          </template>
        </v-autocomplete>
      </v-card-text>
      <v-card-actions class="mb-2">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          small
          class="text-none"
          @click="handleSave"
        >{{ $t('btn.save') }}</v-btn>
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
  name: 'resetPwdDialog',
  data() {
    return {
      userInfo: {
        nickname: '',
        account: '',
      },
      roleIds: [],
    };
  },
  props: {
    roleDialog: {
      type: Boolean,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState('userManagement', ['authUserInfo', 'authRoleList']),
    dialog: {
      get() {
        return this.roleDialog;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('userManagement', ['getAuthRole', 'authRole']),
    // 移除角色选项
    removeRole(item) {
      // 根据id移除对应的选项
      const ids = this.roleIds;
      const index = ids.indexOf(item.roleId);
      if (index >= 0) {
        this.roleIds.splice(index, 1);
      }
    },
    reset() {
      this.roleIds = [];
      this.userInfo = {
        nickname: '',
        account: '',
      };
    },
    async handleSave() {
      const { userId, roleIds } = this;
      if (userId && roleIds) {
        const payload = {
          userId,
          roleIds: roleIds.length ? roleIds.join(',') : '',
        };
        const result = await this.authRole(payload);
        if (result) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'successAction',
          });
          this.dialog = false;
        }
      }
    },
  },
  watch: {
    async dialog(val) {
      if (val) {
        this.reset();
        if (this.userId) {
          await this.getAuthRole(this.userId);
        }
        if (Object.keys(this.authUserInfo).length) {
          const { nickName, userName, roleIds } = this.authUserInfo;
          this.userInfo = {
            ...this.userInfo,
            nickname: nickName || '',
            account: userName || '',
          };
          this.roleIds = roleIds || [];
        }
      }
    },
  },
};
</script>
