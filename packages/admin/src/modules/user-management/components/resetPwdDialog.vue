<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'400px'"
  >
    <v-card
      style="overflow: hidden"
    >
      <v-card-title primary-title>
        <span>
          {{ $t('userManagement.dialog.resetPwd') }}
        </span>
        <v-spacer></v-spacer>
        <v-btn
          icon
          small
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-text-field
            class="mt-1 input-group--focused"
            clearable
            type="text"
            :label="`${$t('userManagement.label.newPwd')}*`"
            v-model="password"
            :rules="rules.password"
            counter
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions class="mb-2">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          small
          class="text-none"
          @click="handleSave"
        >{{ $t('btn.save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
} from 'vuex';

export default {
  name: 'resetPwdDialog',
  data() {
    return {
      password: '',
    };
  },
  props: {
    resetDialog: {
      type: Boolean,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState('userManagement', []),
    dialog: {
      get() {
        return this.resetDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('userManagement', ['resetPwd']),
    reset() {
      this.password = '';
    },
    async handleSave() {
      // 校验密码是否填写正确
      if (!this.$refs.form.validate()) {
        return;
      }
      const { userId, password } = this;
      if (userId) {
        const payload = {
          userId,
          password,
        };
        const result = await this.resetPwd(payload);
        if (result) {
          this.setAlert({
            show: true,
            type: 'success',
            message: 'successAction',
          });
          this.dialog = false;
        }
      }
    },
  },
};
</script>
