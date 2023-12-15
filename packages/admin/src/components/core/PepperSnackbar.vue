<template>
  <v-snackbar
    v-model="snackbar"
    :color="type"
    bottom
    id="app_snackbar"
    :timeout="timeout"
    :min-width="snackbarWidth"
  >
    <div
      id="app_msg"
      v-for="(msg, n) in message"
      :key="n"
      class="d-flex"
    >
      <v-icon v-text="iconList[type]"></v-icon>
      <!-- <span class="ml-2">{{msg}}</span> -->
      <div class="ml-2 msg-box" :style="`width:${snackbarWidth-110}px`">
        {{ msg }}
      </div>
    </div>
    <template #action="{ attrs }">
      <v-btn
        icon
        v-bind="attrs"
        id="app_msg_close"
        class="text-none"
        @click="snackbar = false"
      >
        <v-icon>mdi-close-circle-outline</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'PepperSnackbar',
  data() {
    return {
      timeout: 6000,
      iconList: {
        success: 'mdi-check-circle',
        info: 'mdi-information-outline',
        warning: 'mdi-alert-outline',
        error: 'mdi-alert-octagon-outline',
      },
    };
  },
  computed: {
    ...mapState('helper', ['alert']),
    snackbar: {
      get() {
        return this.alert ? this.alert.show : null;
      },
      set(val) {
        this.setAlert({
          ...this.alert,
          show: val,
        });
      },
    },
    type() {
      return this.alert ? this.alert.type : null;
    },
    message() {
      const msg = [];
      if (this.type) {
        let { message } = this.alert;
        if (typeof message === 'string') {
          message = [message];
        }
        message.forEach((m) => {
          if (this.type && this.type.toUpperCase().trim() === 'SUCCESS') {
            msg.push(this.$t(`success.${m}`));
          } else if (this.type && this.type.toUpperCase().trim() === 'ERROR') {
            msg.push(this.$t(`error.${m}`));
          } else if (this.type && this.type.toUpperCase().trim() === 'INFO') {
            msg.push(m);
          }
        });
      }
      return msg;
    },
    snackbarWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 220;
        case 'sm': return 400;
        case 'md': return 500;
        case 'lg': return 600;
        case 'xl': return 800;
        default: return 0;
      }
    },
    test() {
      return this.$vuetify.breakpoint.name;
    },
  },
  watch: {
    snackbar(val) {
      if (!val) {
        this.setAlert({
          show: false,
          type: null,
          message: null,
        });
      }
    },
    type(val) {
      if (val && val.toUpperCase().trim() === 'ERROR') {
        const { message } = this.alert;
        if (message === 'INVALID_SESSION') {
          this.cancel();
        }
      }
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    cancel() {
      this.setAlert({
        show: false,
        type: null,
        message: null,
      });
      this.snackbar = false;
    },
  },
};
</script>
<style scoped>
.msg-box {
  word-wrap:break-word;
}
</style>
