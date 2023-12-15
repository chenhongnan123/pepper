<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'800px'"
  >
    <v-card
      style="overflow: hidden"
    >
      <v-card-title primary-title>
        <span v-if="isNew">
          {{ $t('userManagement.dialog.addUser') }}
        </span>
        <span v-else>
          {{ $t('userManagement.dialog.editUser') }}
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
      <v-card-text style="height: 400px;overflow-y: auto;">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-row>
            <v-col :cols="6">
              <v-text-field
                clearable
                :label="`${$t('userManagement.label.nickname')}*`"
                v-model="tabledataobj.nickName"
                :rules="rules.name"
                :counter="30"
              ></v-text-field>
              <v-text-field
                class="mt-1"
                clearable
                :label="`${$t('userManagement.label.phoneNumber')}`"
                v-model="tabledataobj.phonenumber"
                :rules="rules.phone"
                :counter="11"
              ></v-text-field>
              <v-text-field
                v-if="isNew"
                class="mt-1"
                clearable
                :label="`${$t('userManagement.label.userAccount')}*`"
                v-model="tabledataobj.userName"
                :rules="rules.account"
                :counter="20"
              ></v-text-field>
              <v-autocomplete
                class="mt-1"
                clearable
                :items="sexOptions"
                item-text="text"
                item-value="value"
                :label="`${$t('userManagement.label.sex')}`"
                v-model="tabledataobj.sex"
              ></v-autocomplete>
              <v-text-field
                class="mt-1"
                clearable
                :label="`${$t('userManagement.label.dingtalkId')}`"
                v-model="tabledataobj.dingId"
                :rules="rules.len20"
                :counter="20"
              ></v-text-field>
              <!-- <v-autocomplete
                class="mt-3"
                clearable
                :label="`${$t('userManagement.label.position')}`"
                :items="positionList"
                chips
                dense
                multiple
                item-text="postName"
                item-value="postId"
                v-model="tabledataobj.postIds"
              >
                <template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    close
                    @click="data.select"
                    @click:close="removePosition(data.item)"
                  >
                    {{ data.item.postName }}
                  </v-chip>
                </template>
                <template v-slot:item="{ item }">
                  <div
                    class="d-flex justify-space-between"
                    style="width:100%"
                  >
                    <v-list-item-content style="width: 100px!important;">
                      <v-list-item-title>
                        {{ item.postName }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-icon v-if="item.disabled">mdi-cancel</v-icon>
                  </div>
                </template>
              </v-autocomplete> -->
              <!-- 岗位多选改为单选 -->
              <v-autocomplete
                class="mt-2"
                clearable
                :items="positionList"
                item-text="postName"
                item-value="postId"
                :label="`${$t('userManagement.label.position')}`"
                v-model="tabledataobj.postId"
              ></v-autocomplete>
            </v-col>
            <v-col :cols="6">
              <v-text-field
                type="text"
                clearable
                :label="`${$t('userManagement.label.departmentName')}`"
                v-model="tabledataobj.deptName"
                @click="selectDeptShow = true"
                @click:clear="clearDept"
              ></v-text-field>
              <v-text-field
                class="mt-1"
                clearable
                :label="`${$t('userManagement.label.email')}`"
                v-model="tabledataobj.email"
                :rules="rules.email"
                :counter="50"
              ></v-text-field>
              <v-text-field
                v-if="isNew"
                class="mt-1 input-group--focused"
                clearable
                :type="showPwd ? 'text' : 'password'"
                autocomplete="new-password"
                :label="`${$t('userManagement.label.password')}*`"
                :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPwd = !showPwd"
                v-model="tabledataobj.password"
                :rules="rules.password"
                counter
              ></v-text-field>
              <v-text-field
                class="mt-1"
                clearable
                :label="`${$t('userManagement.label.wechatPublicId')}`"
                v-model="tabledataobj.wechatId"
                :rules="rules.len20"
                :counter="20"
              ></v-text-field>
              <v-text-field
                class="mt-1"
                clearable
                :label="`${$t('userManagement.label.wechatEnterpiriseId')}`"
                v-model="tabledataobj.selfWechatId"
                :rules="rules.len20"
                :counter="20"
              ></v-text-field>
              <v-autocomplete
                class="mt-3"
                clearable
                :label="`${$t('userManagement.label.role')}`"
                :items="roleList"
                chips
                dense
                multiple
                item-text="roleName"
                item-value="roleId"
                v-model="tabledataobj.roleIds"
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
            </v-col>
            <v-col :cols="12" class="mt-n2">
              <v-textarea
                outlined
                name="input-remark"
                :label="`${$t('userManagement.label.remark')}`"
                v-model="tabledataobj.remark"
                auto-grow
                clearable
              ></v-textarea>
            </v-col>
          </v-row>
          <v-switch
            v-model="tabledataobj.active"
            class="mt-3"
            hide-details
            :label="`${$t('userManagement.label.active')}`"
          ></v-switch>
        </v-form>
      </v-card-text>
      <v-card-actions class="mb-2">
        <v-spacer></v-spacer>
        <v-btn
          v-if="isNew"
          color="warning"
          small
          text
          class="mr-2"
          @click="reset"
        >{{ $t('btn.eliminate') }}</v-btn>
        <v-btn
          color="primary"
          small
          class="text-none"
          @click="handleSave"
        >{{ $t('btn.save') }}</v-btn>
      </v-card-actions>
    </v-card>
    <select-dept-dialog
      :selectDeptShow="selectDeptShow"
      @closeDialog="selectDeptShow = false"
      @setDept="setDept"
    />
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
} from 'vuex';
import SelectDeptDialog from './selectDeptDialog';

export default {
  name: 'addDialog',
  data() {
    return {
      valid: true,
      showPwd: false, // 默认隐藏密码
      selectDeptShow: false,
      tabledataobj: {
        nickName: '',
        deptId: '',
        deptName: '',
        phonenumber: '',
        email: '',
        userName: '',
        password: '', // 默认密码
        sex: '',
        wechatId: '',
        dingId: '',
        selfWechatId: '',
        // postIds: [],
        postId: '',
        roleIds: [],
        remark: '',
        active: true,
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
      required: true,
    },
    selectedTableList: {
      type: Array,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
  },
  components: {
    SelectDeptDialog,
  },
  computed: {
    ...mapState('helper', ['numberEmpty']),
    ...mapState('userManagement', [
      'userDetail',
      'positionList',
      'roleList',
      'initPwd',
      'sexDict',
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
    // 性别选项
    sexOptions() {
      let list = [];
      if (this.sexDict?.length) {
        list = this.sexDict.map((item) => {
          const obj = {
            text: item.dictLabel,
            value: item.dictValue,
            disabled: item.status !== '0',
          };
          return obj;
        });
      }
      return list;
    },
    // 初始密码
    initialPassword() {
      return this.initPwd || '';
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('userManagement', [
      'getUserDetail',
      'getPwdConfig',
      'getSexDict',
      'addUser',
      'editUser',
    ]),
    setDept(item) {
      // 获取选择的部门id和名称
      this.tabledataobj.deptId = item.id;
      this.tabledataobj.deptName = item.label;
    },
    // 清除部门时，id和name都要清除
    clearDept() {
      this.tabledataobj.deptId = '';
      this.tabledataobj.deptName = '';
    },
    // 移除岗位选项
    // removePosition(item) {
    //   const ids = this.tabledataobj.postIds;
    //   const index = ids.indexOf(item.postId);
    //   if (index >= 0) {
    //     this.tabledataobj.postIds.splice(index, 1);
    //   }
    // },
    // 移除角色选项
    removeRole(item) {
      // 根据id移除对应的选项
      const ids = this.tabledataobj.roleIds;
      const index = ids.indexOf(item.roleId);
      if (index >= 0) {
        this.tabledataobj.roleIds.splice(index, 1);
      }
    },
    // 点击保存按钮
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const { tabledataobj } = this;
      const {
        userId,
        nickName,
        deptId,
        phonenumber,
        email,
        userName,
        password,
        sex,
        wechatId,
        dingId,
        selfWechatId,
        // postIds,
        postId,
        roleIds,
        remark,
        active,
      } = tabledataobj;
      const payload = {
        userId,
        nickName,
        deptId: deptId || this.numberEmpty,
        phonenumber: phonenumber || '',
        email: email || '',
        userName,
        password,
        sex: sex || '',
        wechatId: wechatId || '',
        dingId: dingId || '',
        selfWechatId: selfWechatId || '',
        postIds: postId ? [postId] : [], // 未填写岗位id时传[]
        roleIds,
        remark: remark || '',
        status: active ? '0' : '1',
      };
      // console.log(payload, 'payload');
      let result = null;
      if (this.isNew) {
        // 新增接口不传userId
        delete payload.userId;
        result = await this.addUser(payload);
      } else {
        // 编辑接口不传密码
        delete payload.password;
        result = await this.editUser(payload);
      }
      if (result) {
        this.reset();
        this.dialog = false;
        this.$emit('getTableList');
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      this.$nextTick(() => {
        this.tabledataobj = {
          nickName: '',
          deptId: '',
          deptName: '',
          phonenumber: '',
          email: '',
          userName: '',
          password: this.initialPassword, // 使用系统设置中初始化密码中的值
          sex: '',
          wechatId: '',
          dingId: '',
          selfWechatId: '',
          // postIds: [],
          postId: '',
          roleIds: [],
          remark: '',
          active: true,
        };
      });
    },
  },
  watch: {
    async dialog(val) {
      // 打开弹窗
      if (val) {
        // 查询性别字典表
        await this.getSexDict();
        // 新增用户
        if (this.isNew) {
          // 查询岗位列表和角色列表
          await this.getUserDetail();
          await this.getPwdConfig();
          this.reset();
          return;
        }
        // 修改用户
        const { selectedTableList } = this;
        if (selectedTableList.length === 0) {
          this.reset();
          return;
        }
        // 获取用户id，根据id查用户详情
        const id = selectedTableList[0].userId;
        await this.getUserDetail(id);
        const {
          userId,
          nickName,
          deptId,
          deptName,
          phonenumber,
          email,
          userName,
          password,
          sex,
          wechatId,
          dingId,
          selfWechatId,
          postIds,
          roleIds,
          remark,
          status,
        } = this.userDetail;
        // 写入用户信息
        this.$nextTick(async () => {
          this.tabledataobj = {
            userId,
            nickName,
            deptId,
            deptName,
            phonenumber,
            email,
            userName,
            password,
            sex,
            wechatId,
            dingId,
            selfWechatId,
            // postIds,
            postId: (postIds?.length) ? postIds[0] : '',
            roleIds,
            remark,
            active: status === '0',
          };
        });
      }
    },
  },
};
</script>
