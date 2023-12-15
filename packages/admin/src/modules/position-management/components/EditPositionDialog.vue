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
          {{ $t('positionManagement.dialog.editPosition') }}
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
      <v-card-text style="height: 380px;overflow-y: auto;">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
        <v-text-field
            clearable
            :label="`${$t('positionManagement.label.positionNumber')}*`"
            v-model="tabledataobj.postCode"
            :rules="rules.number"
            :counter="20"
          ></v-text-field>
          <v-text-field
            class="mt-3"
            clearable
            :label="`${$t('positionManagement.label.positionName')}*`"
            v-model="tabledataobj.postName"
            :rules="rules.name"
            :counter="50"
          ></v-text-field>
          <v-text-field
            class="mt-3"
            clearable
            type="number"
            :label="`${$t('positionManagement.label.sortNum')}*`"
            v-model="tabledataobj.postSort"
            :rules="rules.sort"
          ></v-text-field>
          <v-text-field
            class="mt-3"
            clearable
            :label="`${$t('positionManagement.label.remark')}`"
            v-model="tabledataobj.remark"
          ></v-text-field>
          <v-switch
            v-model="tabledataobj.active"
            class="mt-3"
            hide-details
            :label="`${$t('positionManagement.label.active')}`"
          ></v-switch>
        </v-form>
      </v-card-text>
      <v-card-actions class="mb-2">
        <v-spacer></v-spacer>
        <!-- <v-btn
          color="warning"
          small
          text
          class="mr-2"
          @click="reset"
        >{{ $t('btn.eliminate') }}</v-btn> -->
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
  name: 'EditDialog',
  data() {
    return {
      valid: true,
      tabledataobj: {},
    };
  },
  props: {
    editDialog: {
      type: Boolean,
      required: true,
    },
    selectedTableList: {
      type: Array,
      required: false,
    },
    rules: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('helper', ['currentLocale']),
    ...mapState('positionManagement', []),
    dialog: {
      get() {
        return this.editDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('positionManagement', [
      'updatePosition',
    ]),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const { tabledataobj } = this;
      const {
        postId,
        postCode,
        postName,
        postSort,
        remark,
        active,
      } = tabledataobj;
      const payload = {
        postId,
        postCode,
        postName,
        postSort: Number(postSort),
        remark,
        status: active ? '0' : '1',
      };
      const result = await this.updatePosition(payload);
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.reset();
        this.dialog = false;
        this.$emit('getTableList');
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
  watch: {
    async dialog() {
      const { selectedTableList } = this;
      if (selectedTableList.length === 0) {
        this.reset();
        return;
      }
      const {
        postId,
        postCode,
        postName,
        postSort,
        remark,
        status,
      } = selectedTableList[0];
      this.$nextTick(async () => {
        this.tabledataobj = {
          postId,
          postCode,
          postName,
          postSort,
          remark,
          active: status === '0',
        };
      });
    },
  },
};
</script>
