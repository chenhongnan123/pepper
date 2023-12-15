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
            isNew
            ? $t('roadmapManagement.dialog.add')
            : $t('roadmapManagement.dialog.edit')
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
                class="mx-3 mt-2"
                clearable
                :rules="rules.name"
                :label="`${$t('roadmapManagement.table.name')}*`"
                v-model="tabledataobj.roadmapName"
                :counter="50"
              ></v-text-field>
              <v-autocomplete
                clearable
                :rules="rules.isRequired"
                :label="`${$t('roadmapManagement.label.product')}*`"
                class="mx-3 mt-1"
                v-model="tabledataobj.productId"
                :items="productList"
                item-text="productName"
                item-value="productId"
              >
                <template #item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.productName }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.productNumber }}</v-list-item-subtitle>
                    <v-list-item-subtitle>{{ item.productDesc }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :rules="rules.isRequired"
                :label="`${$t('roadmapManagement.table.version')}*`"
                v-model="tabledataobj.roadmapVersion"
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
          v-if="isNew"
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
  mapState,
  mapActions,
  mapMutations,
} from 'vuex';

export default {
  name: 'RoadmapAddDialog',
  data() {
    return {
      tabledataobj: {
      },
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    isNew: {
      type: Boolean,
    },
    selectedTableList: {
      type: Array,
    },
  },
  components: {
  },
  computed: {
    ...mapState('roadmapManagement', [
      'productList',
    ]),
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
      return this.$getDeptRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('roadmapManagement', [
      'addRoadmap',
      'editRoadmap',
      'getProductList',
    ]),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        isNew,
        tabledataobj,
      } = this;
      const {
        roadmapId,
        productId,
        roadmapName,
        roadmapVersion,
        status,
      } = tabledataobj;
      let payload = {
        productId,
        roadmapName,
        roadmapVersion,
      };
      let result = null;
      if (isNew) {
        payload = {
          ...payload,
          status: '1',
        };
        result = await this.addRoadmap(payload);
      } else {
        payload = {
          ...payload,
          roadmapId,
          status,
        };
        result = await this.editRoadmap(payload);
      }
      if (result) {
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
        return;
      }
      await this.getProductList();
      const { selectedTableList, isNew } = this;
      if (isNew || selectedTableList.length === 0) {
        this.reset();
        return;
      }
      this.$nextTick(() => {
        this.tabledataobj = {
          ...selectedTableList[0],
        };
      });
    },
  },
};
</script>
