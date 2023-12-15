<template>
  <v-card class="transparent" flat>
    <portal to="app-header" v-if="pagePortalMode.userProfile">
      <!-- <v-btn
        icon
        small
        class="mr-2 mb-1"
        @click="goBack"
        v-if="isGoBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn> -->
      {{ $t('modules.user') }}
    </portal>
    <user-avatar />
    <v-form ref="userProfile">
      <!-- <v-card-title class="pl-0 pb-1 text-subtitle-1">
        {{$t('user.profile.avatar')}}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-radio-group
          v-model="selectedAvatar"
          row
        >
          <v-radio
            v-for="(avatar, index) in avatarList"
            :key="index"
            :v-model="avatar"
          >
          <template #label>
            <v-avatar>
              <img
                :src="require(`@/assets/avators/${avatar}.png`)"
                :alt="avatar"
              >
            </v-avatar>
          </template>
          </v-radio>
        </v-radio-group>
      </v-card-text> -->
      <v-card-title class="pl-0 pb-1 text-subtitle-1">
        {{$t('user.profile.personalInfo')}}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row class="pa-0">
          <v-col cols="6">
            <v-text-field
              :label="`${$t('user.profile.account')}`"
              dense
              disabled
              class="mt-2"
              hide-details
              v-model="userData.userName"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :label="`${$t('user.profile.createTime')}`"
              dense
              disabled
              class="mt-2"
              hide-details
              v-model="userData.createTime"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :label="$t('user.profile.department')"
              dense
              disabled
              class="mt-2"
              v-model="deptName"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :label="$t('user.profile.position')"
              dense
              class="mt-2"
              disabled
              v-model="userProfile.postGroup"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-title class="pl-0 pb-1 text-subtitle-1">
        {{$t('user.profile.profile')}}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row class="pa-0">
          <v-col cols="6">
            <v-text-field
              :label="`${$t('user.profile.userName')}*`"
              dense
              class="mt-2"
              clearable
              v-model="userData.nickName"
              :rules="rules.name"
              :counter="30"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select
              dense
              class="mt-2"
              clearable
              :items="sexOptions"
              item-text="text"
              item-value="value"
              :label="`${$t('user.profile.sex')}`"
              v-model="userData.sex"
              :menu-props="{ offsetY: true, offsetYValue: 0, }"
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :label="$t('user.profile.email')"
              dense
              class="mt-2"
              :value="userData.email"
              clearable
              :rules="rules.email"
              :counter="50"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              :label="$t('user.profile.telephone')"
              dense
              class="mt-2"
              v-model="userData.phonenumber"
              clearable
              :rules="rules.phone"
              :counter="11"
            ></v-text-field>
          </v-col>
          <!-- <v-col cols="6">
            <v-text-field
              class="mt-2"
              dense
              clearable
              :label="`${$t('user.profile.dingtalkId')}`"
              v-model="userData.dingId"
              :rules="rules.len20"
              :counter="20"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              class="mt-2"
              dense
              clearable
              :label="`${$t('user.profile.wechatPublicId')}`"
              v-model="userData.wechatId"
              :rules="rules.len20"
              :counter="20"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              class="mt-2"
              dense
              clearable
              :label="`${$t('user.profile.wechatEnterpiriseId')}`"
              v-model="userData.selfWechatId"
              :rules="rules.len20"
              :counter="20"
            ></v-text-field>
          </v-col> -->
        </v-row>
      </v-card-text>
    </v-form>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        small
        color="primary"
        @click="handleUpdateProfile"
      >
        <span>{{$t('user.profile.updateArchive')}}</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
  mapGetters,
} from 'vuex';
import UserAvatar from '../components/UserAvatar.vue';
/* eslint-disable */
export default {
  name: 'userProfile',
  components: {
    UserAvatar,
  },
  data() {
    return {
      // selectedAvatar: null,
      userData: {},
    };
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  deactivated() {
    this.setPageHeader(false);
    // this.setAppHeaderHeight(100);
  },
  created() {
    this.init();
  },
  watch: {
    userProfile() {
      this.assignUser(this.userProfile);
    },
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapState('user', ['userProfile', 'sexDict', 'avatarList']),
    ...mapGetters('user', ['userType']),
    ...mapGetters('user', ['isBtnAccess']),
    rules() {
      return this.$getUserRules();
    },
    userTypeName() {
      const { userType } = this;
      return userType || '-';
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
    deptName() {
      const { userData } = this;
      return userData.dept?.deptName || '';
    },
  },
  methods: {
    ...mapActions('user', ['updateUser', 'getUserProfile', 'getSexDict']),
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    async init() {
      await this.getSexDict();
      this.refresh();
    },
    async refresh() {
      await this.getUserProfile();
      const { data } = this.userProfile;
      this.assignUser(data);
    },
    assignUser(user) {
      // this.selectedAvatar = user.avatar;
      this.userData = {
        ...this.userData,
        ...user,
      };
      this.userId = user.userId;
    },
    async handleUpdateProfile() {
      if (!this.$refs.userProfile.validate()) {
        return;
      }
      const {
        // selectedAvatar,
        userId,
        userName,
        nickName,
        email,
        phonenumber,
        sex,
      } = this.userData;
      const payload = {
        // avatar: selectedAvatar,
        userId,
        userName,
        nickName: nickName || '',
        email: email || '',
        phonenumber: phonenumber || '',
        sex: sex || '',
      };
      const updated = await this.updateUser(payload);
      if (updated) {
        this.refresh();
      }
    },
  },
};
</script>
