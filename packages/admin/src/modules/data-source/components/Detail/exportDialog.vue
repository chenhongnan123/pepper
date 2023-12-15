<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="500px"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            $t('dataSource.dialog.export')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height: 220px;">
        <v-form
          ref="form"
          lazy-validation
        >
          <v-row>
            <v-col cols="12">
              <v-radio-group
                v-model="exportType"
                row
                class="mx-3 mt-0"
                dense
              >
                <v-radio
                  label="CSV"
                  value="csv"
                ></v-radio>
                <v-radio
                  label="Excel"
                  value="excel"
                ></v-radio>
              </v-radio-group>
              <DateTimeRangePicker v-model="dateFilter" class="mx-3 mt-0"/>
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
          @click="handleExport"
        >
          {{$t('btn.export')}}
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
import DateTimeRangePicker from '@/components/commonUI/DateTimeRangePicker.vue';

export default {
  name: 'exportDialog',
  data() {
    return {
      dateFilter: [],
      exportType: 'csv',
    };
  },
  props: {
    exportDialog: {
      type: Boolean,
      required: true,
    },
    dataSource: {
      type: Object,
      required: true,
    },
  },
  components: {
    DateTimeRangePicker,
  },
  computed: {
    ...mapState('helper', ['numberEmpty']),
    ...mapState('connectionConfiguration', [
      'dataTypeList',
    ]),
    dialog: {
      get() {
        return this.exportDialog;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
    rules() {
      return this.$getDataSourceRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('connectionConfiguration', [
      'addParameter',
      'updateParameter',
      'getDataTypeList',
    ]),
    ...mapActions('dataSource', [
      'excelExport',
      'eportSampleExcel',
    ]),
    async handleExport() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        dateFilter: [dateFrom, dateTo],
        exportType,
        dataSource: {
          dataSourceId,
          dataSourceNumber,
        },
      } = this;
      this.eportSampleExcel({
        dateFrom,
        dateTo,
        exportType,
        dataSourceId,
        dataSourceNumber,
      });
      this.dialog = false;
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      const time = {
        dateFrom: new Date().setHours(0, 0, 0, 0),
        dateTo: new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000,
      };
      this.dateFilter = [time.dateFrom, time.dateTo];
    },
  },
};
</script>
