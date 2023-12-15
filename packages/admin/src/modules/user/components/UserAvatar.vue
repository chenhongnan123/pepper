<template>
  <div
    class="user-profile-header d-flex align-center mt-4  px-6 py-5 rounded-b-xl"
  >
    <v-avatar :color="avatar?'':'primary'" size="60">
      <img
        v-if="avatar"
        :src="require(`@/assets/avators/${avatar}.png`)"
        :alt="avatar"
      >
      <span v-else class="white--text text-h5">{{avatarText}}</span>
    </v-avatar>
    <div class="ml-4 subtitle--text text-h6">
      <div class="font-weight-medium">
        {{ fullName }}
      </div>
      <div class="text-subtitle-1">
        {{ organization }}
      </div>
    </div>
    <v-spacer></v-spacer>
    <v-chip
      outlined
      color="primary"
      class="mr-4 px-6"
    >
      {{role}}
    </v-chip>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'UserAvatar',
  components: {
    // Avatar,
  },
  computed: {
    ...mapState('user', ['me', 'avatarList']),
    ...mapGetters('user', ['fullName', 'organization', 'userType', 'avatar', 'avatarText']),
    role() {
      const { userType } = this;
      return userType || '-';
    },
  },
};
</script>
