<template>
  <div>
   <v-avatar :color="avatar?'':'primary'" size="40" class="my-1">
      <img
        v-if="avatar"
        :src="require(`@/assets/avators/${avatar}.png`)"
        :alt="avatar"
      >
      <span v-else class="white--text text-h6">{{avatarText}}</span>
    </v-avatar>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
    };
  },
  mounted() {
    // console.log(this.params);
  },
  components: {
  },
  computed: {
    ...mapState('user', ['avatarList']),
    avatar() {
      const { params, avatarList } = this;
      if (params) {
        if (avatarList.some((a) => a === params.value)) {
          return params.value;
        }
      }
      return '';
    },
    avatarText() {
      const { params } = this;
      return params && params.data.firstName ? params.data.firstName.slice(0, 2) : '-';
    },
  },
  methods: {
  },
};
</script>
