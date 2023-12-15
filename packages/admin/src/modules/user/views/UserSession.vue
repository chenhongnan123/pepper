<template>
  <v-card class="transparent" flat>
    <portal to="app-header" v-if="pagePortalMode.userSession">
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
    <v-form ref="user-profile">
      <v-card-title class="pl-0 pb-1 text-subtitle-1">
        {{$t('user.session.curSession')}}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="2" class="text-subtitle-1 subtitle--text">
            {{$t('user.session.ip')}}:
          </v-col>
          <v-col class="text-subtitle-1">
            {{ userInfo.loginIp || '-' }}
          </v-col>
        </v-row>
        <!-- <v-row>
          <v-col cols="2" class="text-subtitle-1 subtitle--text">
            {{$t('user.session.container')}}
          </v-col>
          <v-col class="text-subtitle-1">
            {{ userInfo.userAgent || '-' }}
          </v-col>
        </v-row> -->
        <v-row>
          <v-col cols="2" class="text-subtitle-1 subtitle--text">
            {{$t('user.session.signedIn')}}:
          </v-col>
          <v-col class="text-subtitle-1">
            {{
              userInfo.loginDate
              ? $getFormatDate(userInfo.loginDate, 'YYYY-MM-DD HH:mm:ss')
              : '-'
             }}
          </v-col>
        </v-row>
      </v-card-text>
      <!-- <v-card-title class="pl-0 pb-1 text-subtitle-1">
        {{$t('user.session.accessRecords')}}
      </v-card-title> -->
      <!-- <v-card-text class="d-flex grey-thin-border rounded-lg py-4">
        <v-simple-table
          style="width:100%"
          fixed-header
          dense
          :height="clientheight - 640"
        >
          <template #default>
            <thead>
              <tr>
                <th class="text-left text-subtitle-1 subtitle--text" style="width:20%">
                  {{$t('user.session.ip')}}
                </th>
                <th class="text-left text-subtitle-1 subtitle--text">
                  {{$t('user.session.container')}}
                </th>
                <th class="text-left text-subtitle-1 subtitle--text">
                  {{$t('user.session.signedIn')}}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(info, key) in loginInfoList" :key="key">
                <td class="text-left text-subtitle-1" style="width:20%">{{info.ipaddr}}</td>
                <td class="text-left text-subtitle-1">{{info.userAgent}}</td>
                <td class="text-left text-subtitle-1">
                  {{$getFormatDate(info.accessTime, 'YYYY-MM-DD HH:mm:ss')}}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text> -->
    </v-form>
  </v-card>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
} from 'vuex';
import UserAvatar from '../components/UserAvatar.vue';
/* eslint-disable */
export default {
  name: 'userSession',
  components: {
    UserAvatar,
  },
  data() {
    return {
      clientheight: document.body.clientHeight,
      userInfo: {},
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
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapState('user', ['userProfile']),
  },
  methods: {
    ...mapActions('user', ['getUserProfile']),
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    async init() {
      await this.getUserProfile();
      const { data } = this.userProfile;
      this.assignUser(data);
    },
    assignUser(user) {
      this.userInfo = {
        ...this.userInfo,
        ...user,
      };
    },
  },
};
</script>
