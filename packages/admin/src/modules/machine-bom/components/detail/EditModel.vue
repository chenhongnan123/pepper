<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="400px"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title>
        <span>
          {{$t('machineBom.dialog.relateModel')}}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-text-field
            class="mt-3"
            clearable
            :rules="rules.isRequired"
            :label="`${$t('machineBom.label.modelid')}*`"
            v-model="tabledataobj.modelId"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
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
          {{$t('btn.save')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapActions,
  mapMutations,
} from 'vuex';

export default {
  data() {
    return {
      tabledataobj: {},
    };
  },
  props: {
    editmodeldialog: {
      type: Boolean,
      required: true,
    },
    folder: {
      type: Object,
    },
    rules: {
      type: Object,
    },
  },
  computed: {
    dialog: {
      get() {
        return this.editmodeldialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
  },
  watch: {
    dialog(dialog) {
      if (dialog) {
        const {
          productId,
          productCode,
          modelId,
        } = this.folder;
        this.tabledataobj = {
          productId,
          productCode,
          modelId,
        };
      } else {
        this.reset();
      }
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('machineBom', ['editPart']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        productId,
        productCode,
        modelId,
      } = this.tabledataobj;
      const payload = {
        id: productId,
        productCode,
        modelId,
      };
      const results = await this.editPart(payload);
      if (results) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.$emit('getFolderList');
        this.dialog = false;
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
      }
      this.$nextTick(() => {
        this.tabledataobj = {};
      });
    },
  },
};
</script>
