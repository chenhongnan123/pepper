<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'400px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            $t('dashboardSetting.dialog.editDtboardSetting')
          }}
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
          <v-row
            justify="center"
            dense
          >
            <v-col cols="12">
              <v-text-field
                class="mt-1"
                clearable
                :rules="rules.number"
                :label="`${$t('dashboardSetting.table.boardCode')}*`"
                v-model="tabledataobj.boardNumber"
                :counter="20"
                disabled
              ></v-text-field>
              <v-text-field
                class="mt-1"
                clearable
                :rules="rules.name"
                :label="`${$t('dashboardSetting.table.name')}*`"
                v-model="tabledataobj.boardName"
                :counter="50"
              ></v-text-field>
              <v-text-field
                class="mt-1"
                clearable
                :rules="rules.isInter"
                :label="`${$t('dashboardSetting.table.sort')}*`"
                v-model="tabledataobj.boardSort"
                type="number"
                disabled
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="mb-1">
        <v-spacer></v-spacer>
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
  mapState,
  mapActions,
  mapMutations,
} from 'vuex';

export default {
  name: 'dashboardSettingAddDialog',
  data() {
    return {
      tabledataobj: {
        boardNumber: '',
        boardName: '',
        sort: '',
      },
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    selectedItem: {
      type: Object,
      required: true,
    },
  },
  components: {
  },
  computed: {
    ...mapState('dashboardSetting', ['dashboardSettingList']),
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
      return this.$getCommonRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('dashboardSetting', ['editDashboardSetting']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        tabledataobj,
      } = this;
      const {
        id,
        boardNumber,
        boardName,
        boardSort,
      } = tabledataobj;
      const payload = {
        id,
        boardNumber,
        boardName,
        boardSort,
      };
      const result = await this.editDashboardSetting(payload);
      if (result) {
        this.$emit('getTableList');
        this.dialog = false;
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$nextTick(() => {
          this.tabledataobj = {
            boardNumber: '',
            boardName: '',
            sort: '',
          };
        });
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      const { selectedItem } = this;
      if (!selectedItem || Object.keys(selectedItem).length === 0) {
        this.reset();
        return;
      }
      const {
        id,
        boardNumber,
        boardName,
        boardSort,
      } = selectedItem;
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          id,
          boardNumber,
          boardName,
          boardSort,
        };
      });
    },
  },
};
</script>
