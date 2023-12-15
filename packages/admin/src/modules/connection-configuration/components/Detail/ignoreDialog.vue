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
            $t('connectionConfiguration.dialog.ignore')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height: 420px;">
        <v-form
          ref="form"
          lazy-validation
        >
          <v-row>
            <v-col cols="12">
              <base-grid
                ref="ignoreGrid"
                elementName="ignoreParam"
                :restoreColumn="true"
                :options="options"
              />
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
          @click="dialog = false"
        >
          {{$t('btn.ok')}}
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
import BaseGrid from '@/components/aggrid/BaseGrid.vue';

export default {
  name: 'IgnoreParamsDialog',
  data() {
    return {
      options: {
        headers: [
          {
            field: 'no',
            maxWidth: 100,
            headerName: 'connectionConfiguration.table.number',
            filter: 'agTextColumnFilter',
            // eslint-disable-next-line
            valueGetter: (params) => params.node?.rowIndex + 1,
          },
          {
            field: 'identifierLabel',
            headerName: 'connectionConfiguration.parameterTable.identifierLabel',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'namespace',
            headerName: 'connectionConfiguration.parameterTable.namespace',
            filter: 'agTextColumnFilter',
          },
          {
            field: 'status',
            headerName: 'connectionConfiguration.parameterTable.status',
            filter: 'agTextColumnFilter',
            maxWidth: 100,
            valueGetter: (params) => {
              if (params.data.status === 0) {
                return '可读';
              }
              if (params.data.status === 2) {
                return '不可读';
              }
              return params.data.status;
            },
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: 400,
        rowHeight: 35,
      },
    };
  },
  props: {
    ignoreDialog: {
      type: Boolean,
      required: true,
    },
    ignoreList: {
      type: Array,
      required: true,
    },
  },
  components: {
    BaseGrid,
  },
  computed: {
    ...mapState('helper', ['numberEmpty']),
    ...mapState('connectionConfiguration', [
      'parameterList',
      'syncParamList',
    ]),
    dialog: {
      get() {
        return this.ignoreDialog;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('connectionConfiguration', [
      'addBatchParameter',
      'getSyncParamList',
      'getParametersById',
    ]),
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      this.options.rowData = this.ignoreList;
    },
  },
};
</script>
