<template>
  <v-card class="transparent" flat>
    <portal to="app-header" v-if="pagePortalMode.userPreferences">
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
    <v-card-title class="pl-0 pb-1 text-subtitle-1">
      {{$t('user.preferences.language')}}
    </v-card-title>
    <v-divider ></v-divider>
    <v-card-text class="">
      <v-select
        id="locale"
        :items="locales"
        item-text="languageValue"
        item-value="languageKey"
        autocomplete="language"
        v-model="locale"
      ></v-select>
    </v-card-text>
    <v-card-title class="pl-0 pb-1 text-subtitle-1">
      {{$t('user.preferences.displayMode')}}
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="">
      <v-switch
        v-model="darkMode"
        :label="$t('user.preferences.darkMode')"
      ></v-switch>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import UserAvatar from '../components/UserAvatar.vue';

export default {
  name: 'userPreferences',
  components: {
    UserAvatar,
  },
  data() {
    return {
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
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapState('helper', [
      'locales',
      'avatars',
      'isDark',
      'currentLocale',
      'currentAvatar',
    ]),
    ...mapGetters('user', [
      'fullName',
    ]),
    rules() {
      return this.$getOperatorRules();
    },
    locale: {
      get() {
        this.setCurrentLocale(this.$i18n.locale);
        return this.currentLocale;
      },
      set(val) {
        this.$i18n.locale = val;
        localStorage.setItem('language', val);
        this.setCurrentLocale(val);
      },
    },
    selectedAvatar: {
      get() {
        return this.currentAvatar;
      },
      set(val) {
        this.setCurrentAvatar(val);
      },
    },
    darkMode: {
      get() {
        return this.isDark;
      },
      set() {
        this.toggleIsDark();
      },
    },
  },
  methods: {
    ...mapMutations('helper', [
      'toggleIsDark',
      'setCurrentLocale',
      'setCurrentAvatar',
    ]),
  },
};
</script>
