<template>
  <v-navigation-drawer v-model="drawerShow" app temporary right width="500px" hide-overlay>
    <v-card :style="`height:${clientheight}px;overflow-y: auto;`">
      <v-card-title primary-title>
        {{ $t('processDashboard.label.event') }}
      </v-card-title>
      <v-card-text :style="`height:${clientheight - 64}px;`">
        <v-card color="primary" class="mb-2">
          <v-card-title
            primary-title
            style="color: white"
            :class="`${eventObj.level === '1' ? 'errorClass' : 'infoClass'}`"
          >
            <span>
              <!-- eslint-disable-next-line -->
              {{ `${$t('processDashboard.label.createdTime')}: ${eventObj.createTime || '-'}` }}
            </span>
            <v-spacer></v-spacer>
            <v-chip small class="mr-2">
              <!-- eslint-disable-next-line -->
              {{
                `${
                  eventObj.level === '1'
                    ? $t('processDashboard.label.error')
                    : $t('processDashboard.label.info')
                }`
              }}
            </v-chip>
          </v-card-title>
          <v-card-text class="pb-4">
            <v-row dense class="alignLeft mx-4">
              <v-col :cols="4">
                <div class="info-label">
                  {{ $t('processDashboard.label.productLine') }}
                </div>
                <div class="info-text">
                  {{ eventObj.productionLineName || '-' }}
                </div>
              </v-col>
              <v-col :cols="4">
                <div class="info-label">
                  {{ $t('processDashboard.label.machine') }}
                </div>
                <div class="info-text">
                  {{ eventObj.machineName || '-' }}
                </div>
              </v-col>
              <v-col :cols="4">
                <div class="info-label">
                  {{ $t('processDashboard.label.event') }}
                </div>
                <div class="info-text">
                  {{ getEventNameByCode(eventObj.event) || '-' }}
                </div>
              </v-col>
              <v-col :cols="12">
                <div class="info-label">
                  {{ $t('processDashboard.label.content') }}
                </div>
                <div class="info-text">
                  {{ eventObj.content || '-' }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <div class="mt-2">
          <v-list v-if="eventObj.downloadParameters?.length" :key="`${eventObj.id}_download`">
            <v-list-group no-action>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $t('processDashboard.label.downloadParameter') }}
                  </v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-group
                v-for="(item, key) in eventObj.downloadParameters"
                :key="key"
                no-action
                sub-group
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.name }}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list-item v-for="(tag, k) in Object.keys(item)" :key="`download_${k}`">
                  <v-list-item-subtitle>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">{{ `${tag} : ${item[tag]}` }}</span>
                      </template>
                      <span>
                    {{ `${tag} : ${item[tag]}` }}
                      </span>
                    </v-tooltip>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list-group>
            </v-list-group>
          </v-list>
          <v-list v-if="eventObj.uploadParameters?.length" :key="`${eventObj.id}_upload`">
            <v-list-group no-action>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $t('processDashboard.label.uploadParameter') }}
                  </v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-group
                v-for="(item, ind) in eventObj.uploadParameters"
                :key="ind"
                no-action
                sub-group
              >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.name }}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list-item v-for="(tag, k) in Object.keys(item.data)" :key="`upload_${k}`">
                  <v-list-item-subtitle>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">{{ `${tag} : ${item.data[tag]}` }}</span>
                      </template>
                      <span>
                    {{ `${tag} : ${item.data[tag]}` }}
                      </span>
                    </v-tooltip>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list-group>
            </v-list-group>
          </v-list>
        </div>
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'LogEventDrawer',
  data() {
    return {
      clientheight: document.body.clientHeight,
    };
  },
  props: {},
  created() {
    this.init();
  },
  deactivated() {
    this.setEventDrawerShow(false);
    this.setEventDetail({});
  },
  methods: {
    ...mapMutations('processDashboard', ['setEventDrawerShow', 'setEventDetail']),
    ...mapActions('processDashboard', ['getEventList']),
    async init() {
      await this.getEventList();
    },
    getEventNameByCode(code) {
      const event = this.eventList.find((item) => item.numberCode === code);
      return event ? event.eventValue : '';
    },
    formatMapList(map) {
      const result = [];
      Object.getOwnPropertyNames(map).forEach((key) => {
        result.push({
          name: key,
          data: map[key],
        });
      });
      return result;
    },
  },
  computed: {
    ...mapState('processDashboard', ['eventDrawerShow', 'eventDetail', 'eventList']),
    drawerShow: {
      get() {
        return this.eventDrawerShow;
      },
      set(val) {
        this.setEventDrawerShow(val);
      },
    },
    eventObj() {
      const obj = this.eventDetail;
      const result = {
        ...obj,
      };
      Object.getOwnPropertyNames(obj).forEach((key) => {
        if (key === 'uploadParam' && obj[key]) {
          result.uploadParameters = this.formatMapList(JSON.parse(obj[key]));
        }
        if (key === 'downloadParam' && obj[key]) {
          result.downloadParameters = JSON.parse(obj[key]);
        }
      });
      return result;
    },
  },
};
</script>

<style scoped>
.titleClass {
  font-size: 20px;
  font-weight: bold;
}

.errorClass /deep/ .v-chip {
  border-color: var(--v-error-base);
  background-color: var(--v-error-base);
  color: white;
  border-radius: 6px;
}

.infoClass /deep/ .v-chip {
  border: 1px solid white;
  border-radius: 6px;
  color: white;
  background: transparent;
}

.alignLeft {
  text-align: left;
}

.info-label {
  font-size: 14px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.54);
}

.info-text {
  font-size: 18px;
  font-weight: bold;
  color: white;
}
</style>
