<template>
  <v-dialog
    attach
    v-model="dialog"
    max-width="30%"
    @keydown.esc="cancel"
  >
    <div class="confirm-dialog pa-1">
      <v-card style="rounded-lg">
        <div
          v-for="i in 5"
          :key="i"
          :class="`rectangle-${i}`"
        ></div>
        <v-card-title primary-title class="mt-2 pb-0">
          <span class="text-h5">
            {{ title }}
          </span>
        </v-card-title>
        <!-- 标题分割线 -->
        <div class="d-flex align-center px-5">
          <img
            :src="require('@/assets/icons/img/dialog-circle-big-dark.svg')"
            alt=""
            class="mr-1"
          />
          <img
            :src="require('@/assets/icons/img/dialog-circle-small-dark.svg')"
            alt=""
          />
          <v-divider></v-divider>
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-0"
          />
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-0"
          />
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-0"
          />
        </div>
        <v-card-text class="d-flex justify-center align-center my-6">
          <span class="text-subtitle-1 font-weight-black">
            {{ message }}
          </span>
        </v-card-text>
        <v-card-actions class="mx-2">
          <v-spacer></v-spacer>
          <v-btn
            text
            class="text-button rounded-lg"
            @click.native="cancel"
            width="100"
          >
            {{$t('common.cancelbtn')}}
          </v-btn>
          <v-btn
            color="primary2"
            class="text-button rounded-lg"
            width="100"
            @click.native="agree"
          >
            {{$t('common.confirmbtn')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  data() {
    return {
      dialog: false,
      resolve: null,
      reject: null,
      message: null,
      title: null,
    };
  },
  methods: {
    open(title, message) {
      console.log('open');
      this.dialog = true;
      this.title = title;
      this.message = message;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree() {
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
