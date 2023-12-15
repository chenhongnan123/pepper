<template>
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    width="800"
    height="800"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden">
      <v-row>
        <v-col>
          <v-card-title primary-title>
            <span>
              {{ $t('alarmMonitor.dialog.expertise') }}
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
          <v-card-text :style="`height: 500px`">
            <div class="d-flex">
              <v-text-field
                style="flex: 0.6"
                v-model="expertiseName"
                class="mt-3"
                dense
                append-icon="mdi-magnify"
                clearable
                :label="`${$t('alarmMonitor.dialog.searchexpertisename')}`"
                @keyup.enter="getTableList({expertiseName})"
                @blur="getTableList({expertiseName})"
              />
              <v-spacer></v-spacer>
              <v-chip
                outlined
                label
                color="primary"
                @click="getTableList()"
              >
                <v-icon>mdi-school-outline</v-icon>
                <span class="pl-2">{{ this.$t('alarmMonitor.btn.viewAllExperiences') }}</span>
              </v-chip>
            </div>
            <BaseGrid
              elementName="expertiseDialog"
              :restoreColumn="true"
              :options="options"
            />
          </v-card-text>
          <v-card-actions class="mb-2">
            <v-spacer />
            <v-btn
              color="warning"
              small
              text
              class="mr-2"
              @click="dialog = false"
            >
              {{ $t('btn.cancel') }}
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import LinkBtn from '../LinkBtn.vue';

export default {
  name: 'ExpertiseDialog',
  props: ['expertiseParams'],
  components: {
    BaseGrid,
    LinkBtn,
  },
  data() {
    return {
      options: {
        headers: [
          {
            field: 'no',
            headerName: 'No.',
            filter: 'agTextColumnFilter',
            index: 0,
            // eslint-disable-next-line
            valueGetter: (params) => params.node?.rowIndex + 1,
          },
          {
            field: 'partName',
            headerName: 'alarmMonitor.table.alarmlocation',
            filter: 'agTextColumnFilter',
            index: 1,
          },
          {
            field: 'expertiseType',
            headerName: 'alarmMonitor.table.expertiseType',
            filter: 'agTextColumnFilter',
            index: 2,
            // valueGetter: (params) => {
            //   const { expertiseType } = params.data;
            //   console.log(expertiseType, 'expertiseType');
            //   if (expertiseType) {
            //     const type = this.expertiseType.find((m) => m.value === expertiseType);
            //     if (type) {
            //       return type.text;
            //     }
            //     return params.data.connectionType;
            //   }
            //   return '-';
            // },
          },
          {
            field: 'expertiseNumber',
            headerName: 'alarmMonitor.table.expertiseNumber',
            filter: 'agTextColumnFilter',
            index: 3,
            cellRendererSelector: () => ({
              component: 'LinkBtn',
              params: {
                that: this,
              },
            }),
          },
          {
            field: 'expertiseName',
            headerName: 'alarmMonitor.table.expertiseName',
            filter: 'agTextColumnFilter',
            index: 4,
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        height: 450,
        rowHeight: 35,
        rowDataId: 'expertiseId',
      },
      expertiseName: '',
      elementName: 'ExpertiseDialog',
    };
  },
  computed: {
    ...mapState('helper', ['currentLocale']),
    ...mapState('alarmMonitor', ['expertiseList']),
    dialog: {
      get() {
        return this.expertiseParams.expertiseDialog;
      },
      set() {
        this.expertiseName = '';
        this.$emit('closeDialog');
      },
    },
    rules() {
      return this.$getOperatorRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('alarmMonitor', ['getExpertiseList']),
    async getTableList(payload) {
      await this.getExpertiseList(payload);
      this.options.rowData = this.expertiseList;
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      const { noRefresh, alarmCodeId, bomId } = this.expertiseParams;
      if (noRefresh === 'y') return;
      this.getTableList({
        alarmCodeId,
        bomId,
      });
    },
  },
};
</script>
