<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="800px"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            $t('dataSource.dialog.editColumn')
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
          <v-row>
            <v-col cols="12">
              <div class="rounded grey-thin-border mt-3">
                <v-row class="px-2">
                  <v-spacer></v-spacer>
                  <v-col cols="4">
                    <v-text-field
                      v-model="search"
                      append-icon="mdi-magnify"
                      :label="$t('dataSource.label.search')"
                      single-line
                      hide-details
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-data-table
                  :headers="headers"
                  :items="plcParams"
                  :items-per-page="-1"
                  :search="search"
                  height="500"
                  hide-default-footer
                >
                <!-- eslint-disable-next-line -->
                <template #item.number="{item, index}">
                  {{index + 1}}
                </template>
                <!-- eslint-disable-next-line -->
                <template #item.columnName="{item}">
                  <v-text-field
                    outlined
                    clearable
                    dense
                    class="mt-2"
                    v-model="item.columnName"
                    :rules="rules.name"
                  ></v-text-field>
                </template>
                <!-- eslint-disable-next-line -->
                <template #item.action="{item}">
                  <v-btn
                    icon
                    small
                    color="error"
                    :disabled="deleteDisabled"
                    @click="handleDelete(item)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                </v-data-table>
                <!-- <v-simple-table
                  :height="400"
                  fixed-header
                  dense
                >
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">
                         {{ $t('connectionConfiguration.table.number') }}
                        </th>
                        <th class="text-left" style="min-width:200px!important">
                         {{ $t('dataSource.label.columnName') }}
                        </th>
                        <th class="text-left">
                         {{ $t('dataSource.label.action') }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, key) in plcParams"
                        :key="key"
                      >
                        <td>{{ key + 1 }}</td>
                        <td>
                          <v-text-field
                            outlined
                            clearable
                            dense
                            class="mt-2"
                            v-model="plcParams[key].columnName"
                            :rules="rules.name"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-btn
                            icon
                            small
                            color="error"
                            :disabled="deleteDisabled"
                            @click="handleDelete(item)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table> -->
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="mb-2">
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
  name: 'editColumnDialog',
  data() {
    return {
      plcParams: [],
      search: '',
      headers: [
        {
          text: this.$t('connectionConfiguration.table.number'),
          sortable: false,
          value: 'number',
        },
        {
          text: this.$t('dataSource.label.columnName'),
          sortable: false,
          value: 'columnName',
        },
        {
          text: this.$t('dataSource.label.action'),
          sortable: false,
          value: 'action',
        },
      ],
    };
  },
  props: {
    editDialog: {
      type: Boolean,
      required: true,
    },
    dataSource: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('helper', ['numberEmpty']),
    ...mapState('dataSource', [
      'dataParamList',
    ]),
    dialog: {
      get() {
        return this.editDialog;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
    rules() {
      return this.$getDataSourceRules();
    },
    deleteDisabled() {
      const { plcParams, dataSource } = this;
      return plcParams.length === 1 || dataSource.storageMode === '3';
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('dataSource', [
      'updateParameter',
      'getParameterList',
    ]),
    handleDelete(item) {
      this.plcParams = this.plcParams.filter((p) => p.paramId !== item.paramId);
    },
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        dataParamList,
        plcParams,
      } = this;
      const deleteParamList = dataParamList
        .filter((item) => plcParams.some((p) => p.paramId !== item.paramId))
        .map((item) => item.paramId);
      const payload = {
        deleteParamList,
        updateParamList: plcParams,
      };
      // console.log(payload, 'payload');
      const result = await this.updateParameter(payload);
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
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      this.$nextTick(() => {
        this.plcParams = this.dataParamList.map((item) => {
          const obj = {
            ...item,
          };
          return obj;
        });
      });
    },
  },
};
</script>
