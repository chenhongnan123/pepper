<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.systemSetting">
      {{ $t('modules.systemSetting') }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="init"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card
          height="77"
          class="mb-3"
          elevation="0"
          color="bg"
        >
          <div class="d-flex align-center px-4" style="height:100%">
            <span class="text-h6">
              {{$t('systemSetting.password.title')}}
            </span>
            <v-spacer></v-spacer>
            <v-btn
              small
              color="primary"
              @click="handleSave"
              v-if="isBtnAccess('system:setting:update')"
            >
              <span>{{$t('btn.save')}}</span>
            </v-btn>
          </div>
        </v-card>
        <v-card
          :height="tableHeight"
          class=""
          elevation="0"
          color="bg"
        >
          <v-row no-gutters class="pa-4">
            <v-col>
              <v-form ref="passwordSetting">
              <v-card-title class="pl-0 pb-1 text-subtitle-1">
                {{$t('systemSetting.password.password')}}
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="">
                <div class="d-flex align-center mt-2 ml-4">
                  <div class="text-subtitle-1 mt-n3">
                    {{$t('systemSetting.password.passwordLength')}}
                  </div>
                  <v-text-field
                    outlined
                    dense
                    class="mt-2 ml-4"
                    v-model="passwordLength"
                    :rules="rules.nonZeroInter"
                    :error-messages="passwordLengthCheckMsg"
                  ></v-text-field>
                </div>
                <div class="d-flex align-center mt-2 ml-4">
                  <div class="text-subtitle-1">
                    {{$t('systemSetting.password.complexity')}}
                  </div>
                  <v-radio-group
                    v-model="complexity"
                    row
                    class="ml-4"
                  >
                    <v-radio
                      v-for="(item, index) in passwordStrengthList"
                      :key="index"
                      :value="item.value"
                    >
                    <template #label>
                      <span> {{$t(`systemSetting.password.complexityList.${item.text}`)}} </span>
                    </template>
                    </v-radio>
                  </v-radio-group>
                  <span class="text-subtitle-3 error--text">
                    {{$t('systemSetting.password.tips')}}
                  </span>
                </div>
                <v-checkbox
                  v-model="isForceChangePwd"
                  class="mt-4 ml-4"
                  hide-details
                  dense
                >
                  <template #label>
                    <span class="text-subtitle-1">
                      {{$t('systemSetting.password.firstLoginCheck')}}
                    </span>
                  </template>
                </v-checkbox>
              </v-card-text>
              <v-card-title class="pl-0 pb-1 text-subtitle-1">
                {{$t('systemSetting.password.timeout')}}
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="">
                <v-row no-gutters>
                  <v-col cols="2">
                    <v-text-field
                      outlined
                      dense
                      class="mt-2 ml-4"
                      v-model="loginTimeout"
                      :rules="rules.nonZeroInter"
                    ></v-text-field>
                  </v-col>
                  <v-col class="ml-4 mt-3 text-subtitle-1">
                    <span>{{$t('systemSetting.password.min')}}</span>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-form>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="transparent" flat>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
  name: 'passwordSetting',
  components: {
  },
  data() {
    return {
      tableHeight: document.body.clientHeight - 210,
      passwordLength: null,
      passwordLengthCheckMsg: '',
      loginTimeout: null,
      complexity: null,
      isForceChangePwd: false,
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapState('systemSetting', ['passwordSetting', 'passwordStrengthList']),
    ...mapGetters('user', ['isBtnAccess']),
    rules() {
      return this.$getOperatorRules();
    },
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions('systemSetting', ['getPasswordSetting', 'updateConfig']),
    async init() {
      await this.getPasswordSetting();
      const { passwordSetting } = this;
      this.passwordLength = passwordSetting.passwordLength;
      this.loginTimeout = passwordSetting.loginTimeout;
      this.isForceChangePwd = passwordSetting.forcePasswordChange === '1';
      this.complexity = passwordSetting.complexity;
    },
    async handleSave() {
      if (!this.$refs.passwordSetting.validate()) {
        return;
      }
      const {
        passwordLength, loginTimeout, isForceChangePwd, complexity,
      } = this;
      if (Number(passwordLength) < 6) {
        this.passwordLengthCheckMsg = this.$t('verification.lengthmorethan', { num: 6 });
        return;
      }
      this.passwordLengthCheckMsg = '';
      const payload = {
        passwordLength,
        loginTimeout,
        forcePasswordChange: isForceChangePwd ? '1' : '0',
        complexity,
      };
      const updated = await this.updateConfig({ payload });
      if (updated) {
        this.init();
      }
    },
  },
};
</script>
