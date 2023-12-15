<template>
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    :max-width="cardWidth"
    :max-height="cardHeight"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden">
      <v-row>
        <v-col>
          <v-card-title primary-title>
            <span>
              {{
                isNew
                  ? $t('documentManagement.dialog.addFolder')
                  : $t('documentManagement.dialog.editFolder')
              }}
            </span>
            <v-spacer />
            <v-btn
              icon
              small
              @click="dialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text :style="`height: ${cardHeight - 64}`">
            <v-form
              ref="form"
              lazy-validation
            >
              <v-text-field
                v-model="tabledataobj.folderNumber"
                class="mt-3"
                dense
                clearable
                :label="`${$t('documentManagement.table.folderNumber')}*`"
                :counter="20"
                :rules="rules.number"
              />
              <v-text-field
                v-model="tabledataobj.folderName"
                class="mt-4"
                dense
                :rules="rules.name"
                clearable
                :counter="50"
                :label="`${$t('documentManagement.table.folderName')}*`"
              />
            </v-form>
          </v-card-text>
          <v-card-actions class="mb-2">
            <v-spacer />
            <v-btn
              color="warning"
              small
              text
              class="mr-2"
              @click="reset"
              v-if="isNew"
            >
              {{ $t('btn.eliminate') }}
            </v-btn>
            <v-btn
              color="primary"
              small
              class="text-none"
              @click="handleSave"
            >
              {{ $t('btn.save') }}
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'AddFolderDialog',
  props: {
    isNew: {
      type: Boolean,
      required: true,
    },
    addDialog: {
      type: Boolean,
      required: true,
    },
    selectedFolder: {},
  },
  data() {
    return {
      cardWidth: 320,
      cardHeight: 450,
      tabledataobj: {},
    };
  },
  computed: {
    ...mapState('helper', ['currentLocale']),
    dialog: {
      get() {
        return this.addDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    rules() {
      return this.$getOperatorRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('documentManagement', ['addFolder', 'editFolder']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const { tabledataobj, isNew } = this;
      const { folderId, folderName, folderNumber } = tabledataobj;

      let payload = {
        folderNumber,
        folderName,
      };
      let result = null;
      if (isNew) {
        payload = {
          ...payload,
        };
        result = await this.addFolder(payload);
      } else {
        payload = {
          ...payload,
          folderId,
        };
        result = await this.editFolder(payload);
      }
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.$emit('getTableList');
        this.dialog = false;
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$nextTick(() => {
          this.tabledataobj = {};
        });
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        this.reset();
        return;
      }
      const { isNew, selectedFolder } = this;
      if (isNew) {
        this.reset();
        return;
      }
      const { folderId, folderName, folderNumber } = selectedFolder;
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          folderId,
          folderName,
          folderNumber,
        };
      });
    },
  },
};
</script>
