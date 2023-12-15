<template>
  <v-navigation-drawer
    app
    right
    width="400"
    temporary
    v-model="model"
  >
    <perfect-scrollbar style="height: 100%">
      <div class="mt-4 mx-2">
        <div class="text-h6">
          {{ info.eventName }}
        </div>
        <v-card
          color="primary"
          dark
          class="my-2"
        >
          <v-card-title class="px-3 py-2">
            <span>
              {{ info.operTime }}
            </span>
            <v-spacer></v-spacer>
            <v-chip
              class="ma-2"
              :color="`
                ${$vuetify.theme.dark ? 'darken-1' : 'lighten-2'}
                ${info.status ? 'error' : 'primary'}
              `"
              small
              label
            >
              {{ info.status ? 'Error' : 'Info' }}
            </v-chip>
          </v-card-title>
          <!-- 事件日志 -->
          <v-card-text v-if="moduleName === 'eventLog'">
            <v-list
              dark
              two-line
              class="pt-0"
            >
              <!-- 请求地址 -->
              <v-list-item class="px-2">
                <v-list-item-content class="py-1">
                  <v-list-item-subtitle
                    v-text="$t('eventLog.table.operUrl')"
                  ></v-list-item-subtitle>
                  <v-list-item-title
                    v-text="info.operUrl"
                    style="white-space: normal"
                  ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <!-- 消耗时间 状态 -->
              <v-list-item class="px-2">
                <v-list-item-content class="py-1">
                  <v-list-item-subtitle
                    v-text="$t('eventLog.table.costTime')"
                  ></v-list-item-subtitle>
                  <v-list-item-title
                    v-text="info.costTime"
                    style="white-space: normal"
                  ></v-list-item-title>
                </v-list-item-content>
                <v-list-item-content class="py-1">
                  <v-list-item-subtitle v-text="$t('eventLog.table.status')"></v-list-item-subtitle>
                  <v-list-item-title style="white-space: normal">
                    {{ info.status === 0 ? '正常' : '异常' }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <!-- 消息 -->
              <v-list-item
                class="px-2"
                v-if="info.businessKey"
              >
                <v-list-item-content class="py-1">
                  <v-list-item-subtitle
                    v-text="$t('eventLog.table.businessKey')"
                  ></v-list-item-subtitle>
                  <v-list-item-title
                    v-text="info.businessKey"
                    style="white-space: normal"
                  ></v-list-item-title>
                </v-list-item-content>
                <v-list-item-content class="py-1">
                  <v-list-item-subtitle
                    v-text="$t('eventLog.table.businessBody')"
                  ></v-list-item-subtitle>
                  <v-list-item-title
                    v-text="info.businessBody"
                    style="white-space: normal"
                  ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <!-- 错误信息 -->
              <v-list-item class="px-2">
                <v-list-item-content class="py-1">
                  <v-list-item-subtitle
                    v-text="$t('eventLog.table.errorMsg')"
                  ></v-list-item-subtitle>
                  <v-list-item-title
                    v-text="info.errorMsg"
                    style="white-space: normal"
                  ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
        <!-- 事件日志 -->
        <v-list>
          <v-list-group no-action>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="$t('eventLog.table.operParam')"> </v-list-item-title>
              </v-list-item-content>
            </template>
            <json-viewer
              class="mt-2"
              :value="info?.operParam"
              :expand-depth="5"
              boxed
              sort
              :expanded="false"
              :preview-mode="false"
            >
            </json-viewer>
          </v-list-group>
        </v-list>
        <v-list>
          <v-list-group no-action>
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="$t('eventLog.table.jsonResult')"> </v-list-item-title>
              </v-list-item-content>
            </template>
            <json-viewer
              class="mt-2"
              :value="info?.jsonResult"
              :expand-depth="5"
              boxed
              sort
              :expanded="false"
              :preview-mode="false"
            >
            </json-viewer>
          </v-list-group>
        </v-list>
      </div>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import JsonViewer from 'vue-json-viewer';

export default {
  name: 'MoreInfoDrawer',
  props: {
    info: {
      type: Object,
    },
    moduleName: {
      type: String,
    },
  },
  data() {
    return {};
  },
  components: {
    JsonViewer,
  },
  computed: {
    ...mapState('eventLog', ['drawer']),
    model: {
      get() {
        return this.drawer;
      },
      set(val) {
        this.setDrawer(val);
      },
    },
  },
  methods: {
    ...mapMutations('eventLog', ['setDrawer']),
  },
  watch: {
    // model(model) {
    //   if (!model) {
    //     // 关闭
    //   }
    // },
  },
};
</script>
