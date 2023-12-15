<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'1300px'"
  >
    <v-card
      style="overflow: hidden"
      max-height="800"
    >
      <v-card-title primary-title>
        <span class="font-weight-blod ">
          {{ $t('connectionConfiguration.dialog.collectionMonitor') }}
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
      <v-card-text class="d-flex flex-nowrap overflow-x-auto pa-3" >
        <div
          v-for="(item, key) in connectionList"
          :key="key"
          style="min-width: 240px"
          class="mx-2"
        >
          <div class="pl-1">
            <span class="bodytext--text text-subtitle-1 font-weight-bold">
              {{ item.connectionName }}
            </span>
            <v-chip
              label
              x-small
              color="info"
            >{{ getConnectionTypeName(item.connectionType) }}</v-chip>
          </div>
          <div class="pl-1">
            <span class="info--text">
              {{ `${item.connectionNumber}` }}
            </span>
          </div>
          <div
            class="grey-thin-border rounded mt-2"
          >
            <div class="d-flex align-center pa-2">
              <span class="bodytext--text font-weight-blod text-subtitle-2 mr-1">
                {{$t('connectionConfiguration.table.timeout')}}
              </span>
              <v-spacer></v-spacer>
              <span class="info--text ml-1">
                {{
                  `${
                    $t('connectionConfiguration.table.timeoutName')
                  }: ${getTimeoutName(item.timeout)}`
                }}
              </span>
            </div>
            <v-divider></v-divider>
            <div
              style="height:400px"
              class="overflow-y-auto pa-2"
            >
              <template
                v-if="item.monitorValue"
              >
                <div
                  v-for="(monitor, index) in connectionList[key].monitorValue"
                  :key="`monitor-${index}`"
                  :class="`${monitor.class}--text`"
                >
                  {{ `${monitor.value}ms` }}
                </div>
              </template>
            </div>
          </div>
        </div>
      </v-card-text>
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
  name: 'monitorDialog',
  data() {
    return {
      connectionList: [],
    };
  },
  props: {
    monitorDialog: {
      type: Boolean,
      required: true,
    },
    selectedTableList: {
      type: Array,
      required: false,
    },
  },
  computed: {
    ...mapState('helper', ['currentLocale']),
    ...mapState('connectionConfiguration', ['protocalList', 'timeoutList']),
    dialog: {
      get() {
        return this.monitorDialog;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
    items() {
      if (this.protocalList?.length) {
        return this.protocalList;
      }
      return [];
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('connectionConfiguration', [
      'getMonitorValue',
    ]),
    getConnectionTypeName(value) {
      const type = this.protocalList.find((m) => m.value === value);
      if (type) {
        return type.text;
      }
      return value || '-';
    },
    getTimeoutName(value) {
      const type = this.timeoutList.find((m) => m.value === value);
      if (type) {
        return type.text;
      }
      return value || '-';
    },
    async handleMonitor() {
      if (!this.dialog) {
        return;
      }
      await this.$getTimeout(80);
      const result = await this.getMonitorValue('connectionReadTime');
      if (result) {
        this.connectionList = this.connectionList.map((item) => {
          const obj = {
            ...item,
            monitorValue: item.monitorValue || [],
          };
          if (result[item.connectionId]) {
            obj.monitorValue.unshift(
              {
                value: result[item.connectionId],
                class: result[item.connectionId] > item.timeout ? 'error' : 'info',
              },
            );
          }
          return obj;
        });
      }
      this.handleMonitor();
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) { return; }
      this.connectionList = this.selectedTableList;
      await this.handleMonitor();
    },
  },
};
</script>
