<template>
  <v-dialog
    v-model="dialog"
    attach
    persistent
    max-width="400px"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-card-title primary-title>
        <span>
          {{ title }}
        </span>
        <v-spacer />
        <v-btn
          icon
          small
          color="primary"
          @click.native="cancel"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div v-for="(msg, key) in message" :key="key">
          {{ msg }}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-checkbox
          v-if="isLogOut"
          v-model="isPromptAgain"
          :label="$t('dialog.noPromptAgain')"
          hide-details
          dense
          class="mt-0 pt-0"
        />
        <v-spacer />
        <v-btn
          text
          color="warning"
          class="text-none"
          @click.native="cancel"
        >
          {{ $t('helper.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          class="text-none"
          @click.native="agree"
        >
          {{ $t('helper.agree') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'PepperConfirm',
  data() {
    return {
      dialog: false,
      resolve: null,
      reject: null,
      message: null,
      title: null,
      isLogOut: false,
      isPromptAgain: false,
    };
  },
  computed: {
    ...mapState('user', ['me']),
  },
  methods: {
    open(title, message, isLogOut) {
      if (isLogOut && this.me) {
        const { userId } = this.me;
        const logOutConfirm = JSON.parse(localStorage.getItem('logOutConfirmIgnore') || '[]');
        if (logOutConfirm.some((item) => item === userId)) {
          return true;
        }
      }
      this.dialog = true;
      this.title = title;
      this.message = typeof (message) === 'string' ? [message] : message;
      this.isLogOut = !!isLogOut;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree() {
      if (this.isLogOut && this.isPromptAgain && this.me) {
        const { userId } = this.me;
        const logOutConfirmIgnore = JSON.parse(localStorage.getItem('logOutConfirmIgnore') || '[]');
        logOutConfirmIgnore.push(userId);
        localStorage.setItem('logOutConfirmIgnore', JSON.stringify(logOutConfirmIgnore));
      }
      this.resolve(true);
      this.dialog = false;
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    },
  },
};
</script>
