<template>
  <div>
    <v-menu
      bottom
      offset-y
      z-index="9999"
      transition="slide-y-transition"
      v-model="menu"
    >
      <template #activator="{ on: menu }">
        <v-tooltip bottom>
          <template #activator="{ on: tooltip }">
            <v-btn
              icon
              v-on="{ ...tooltip, ...menu }"
            >
              <v-avatar :color="avatar?'':'primary'" size="32">
                <img
                  v-if="avatar"
                  :src="require(`@/assets/avators/${avatar}.png`)"
                  :alt="avatar"
                >
                <span v-else class="white--text text-h6">{{avatarText}}</span>
              </v-avatar>
            </v-btn>
          </template>
          <div class="text-center px-4">
            <span
              style = "border: 1px solid white !important;"
              class="rounded-xl px-5"
            >{{ role }}</span>
            <div class="mt-2">{{ account }}</div>
            <div class="font-weight-medium">{{ fullName }}</div>
            <div class="mt-1">{{ organization }}</div>
          </div>
        </v-tooltip>
      </template>
      <v-card min-width="210px" class="px-2">
        <v-list dense nav>
          <v-list-item
            @click="goToUserProfile"
          >
            <v-list-item-icon class="mr-2">
              <v-icon>mdi-account-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ $t('account.profile') }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            @click="changePasswordDialog = true"
          >
            <v-list-item-icon class="mr-2">
              <v-icon>mdi-lock-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ $t('account.passwordChange') }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            @click="toggleIsDark"
          >
            <v-list-item-icon class="mr-2">
              <v-icon v-if="isDark">mdi-white-balance-sunny</v-icon>
              <v-icon v-else>mdi-weather-night</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-if="isDark">
                {{ $t('account.lightMode') }}
              </v-list-item-title>
              <v-list-item-title v-else>
                {{ $t('account.darkMode') }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-menu
            offset-x
            offset-overflow
            nudge-left="380"
            rounded="lg"
          >
            <template #activator="{ on, attrs, value }">
              <v-list-item
                v-bind="attrs"
                v-on="on"
                dense
                :style="value?'border-left: solid 3px var(--v-primary-base);':''"
                :class="value?'rounded-l-0':''"
              >
                <v-list-item-icon class="mr-2">
                  <v-icon>mdi-earth</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $t('account.language') }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon class="mr-0">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </template>
            <v-list>
              <v-list-item
              v-for="(locale, key) in locales"
              :key="key"
              @click="handleSetLocale(locale.languageKey)"
              >
                {{ locale.languageValue }}
              </v-list-item>
            </v-list>
          </v-menu>
          <v-divider></v-divider>
          <div class="px-2 py-4">
            <v-btn
              small
              color="primary"
              block
              @click="handleLogOut"
            >
              {{ $t('menu.logOut') }}
            </v-btn>
          </div>
        </v-list>
      </v-card>
    </v-menu>
    <change-password-dialog
      :addDialog="changePasswordDialog"
      @closeDialog="changePasswordDialog = false"
    />
  </div>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
} from 'vuex';
import ChangePasswordDialog from './ChangePasswordDialog.vue';

export default {
  name: 'PepperAccount',
  data() {
    return {
      menu: false,
      changePasswordDialog: false,
    };
  },
  components: {
    ChangePasswordDialog,
  },
  computed: {
    ...mapState('helper', ['isDark', 'locales']),
    ...mapGetters('user', ['fullName', 'account', 'userType', 'organization', 'avatar', 'avatarText']),
    role() {
      const { userType } = this;
      return userType || '-';
    },
  },
  methods: {
    ...mapMutations('helper', ['setCurrentLocale', 'toggleIsDark', 'setPagePortalMode']),
    ...mapActions('user', ['updateActiveSite']),
    ...mapMutations('common', ['setMultiPageList']),
    action(actionName) {
      this[`${actionName}`]();
    },
    goToUserProfile() {
      this.$router.push({ name: 'user' });
    },
    handleSetLocale(val) {
      this.$i18n.locale = val;
      localStorage.setItem('language', val);
      this.setCurrentLocale(val);
      this.menu = false;
    },
    async handleLogOut() {
      if (await this.$root.$confirm.open(
        this.$t('dialog.logOutConfirm'),
        ' ',
        true,
      )) {
        const result = await this.$userLogOut('mock1');
        if (result) {
          // 清空多开页活跃列表
          this.setMultiPageList([]);
          // 清空头部显示
          this.setPagePortalMode({});
          this.$router.replace({ name: 'login' }, () => {});
        }
      }
    },
    async setActiveSite(id) {
      await this.updateActiveSite(id);
    },
    toggleDarkMode() {
      this.toggleIsDark();
    },
  },
};
</script>
