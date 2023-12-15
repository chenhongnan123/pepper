<template>
  <v-system-bar
    app
    dark
    window
    v-if="!isConnected"
    :color="color"
  >
    <v-spacer></v-spacer>
    <v-icon>
      {{ icon }}
    </v-icon>
    {{ text }}
    <v-spacer></v-spacer>
  </v-system-bar>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

let timer = null;
export default {
  name: 'PepperConnectionStatus',
  data() {
    return {
      icon: 'mdi-wifi-strength-alert-outline',
      text: 'Cannot connect to server',
      color: 'error',
      timeout: null,
    };
  },
  computed: {
    ...mapState('helper', ['isConnected', 'isSessionValid']),
  },
  watch: {
    isSessionValid(val) {
      if (!val) {
        clearTimeout(this.timeout);
      }
    },
  },
  methods: {
    ...mapMutations('helper', ['setIsConnected']),
    ...mapActions('helper', ['getServerTime']),
    async getConnectionStatus() {
      clearTimeout(this.timeout);
      const success = await this.getServerTime();
      if (!this.isConnected && success) {
        this.icon = 'mdi-wifi-strength-4';
        this.text = 'Connected';
        this.color = 'success';
        timer = setTimeout(() => {
          this.setIsConnected(true);
        }, 2000);
      } else {
        this.icon = 'mdi-wifi-strength-alert-outline';
        this.text = 'Cannot connect to server';
        this.color = 'error';
      }
      const timeout = success ? 60 * 1000 : 4 * 1000;
      if (navigator.onLine) {
        this.timeout = setTimeout(() => {
          this.getConnectionStatus();
        }, timeout);
      }
    },
  },
  created() {
    this.getConnectionStatus();
  },
  mounted() {
    window.addEventListener('offline', () => this.getConnectionStatus());
    window.addEventListener('online', () => this.getConnectionStatus());
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  },
};
</script>
