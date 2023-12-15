<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'480px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            $t('productLaunch.dialog.scan')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false" color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-row
            justify="center"
            dense
          >
            <v-col cols="12" >
              <v-text-field
                class="mx-3 mt-1"
                clearable
                autofocus
                :rules="rules.isRequired"
                :label="type ? $t(`productLaunch.label.${type}`) : ''"
                v-model="scanCode"
                @keydown.enter="handleSave"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="mt-4">
        <v-spacer></v-spacer>
        <v-btn
          color="warning"
          small
          text
          class="mr-2"
          @click="reset"
        >
          {{$t('btn.eliminate')}}
        </v-btn>
        <v-btn
          color="primary"
          small
          class="text-none"
          @click="handleSave"
        >
          {{$t('btn.ok')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'scanDialog',
  data() {
    return {
      scanCode: '',
    };
  },
  props: {
    scanDialog: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String,
    },
  },
  components: {
  },
  computed: {
    dialog: {
      get() {
        return this.scanDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    rules() {
      return this.$getCommonRules();
    },
  },
  methods: {
    handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        type,
        scanCode,
      } = this;
      this.$emit('setInfo', scanCode, type);
      this.dialog = false;
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$nextTick(() => {
          this.scanCode = '';
        });
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      this.reset();
    },
  },
};
</script>
