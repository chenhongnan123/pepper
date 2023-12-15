<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.productLaunch">
      {{ $t(`modules.${moduleName}`) }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="refresh"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <v-row no-gutters>
      <v-col cols="12">
        <v-card
          :height="tableHeight * 0.7"
          class="mb-3"
          elevation="0"
          color="bg"
        >
          <v-card-title>
            <span>{{ $t('productLaunch.label.productInfo') }}</span>
          </v-card-title>
          <div class="pl-8 pr-4 overflow-y-auto" :style="`height:${tableHeight * 0.7 - 80}px`">
            <template
              v-for="(tag, k) in Object.keys(productInfo)"
            >
              <div class="text-subtitle-2 info--text" :key="`label-${k}`">
                {{ $t(`productLaunch.label.${tag}`) }}
              </div>
              <v-list-item
                class="mt-2 mb-4 scan-item"
                :style="`--dragbg-color:${primaryColor10}`"
                :key="`scan-${k}`"
                @click="type = tag;scanDialog = true;"
              >
                <v-list-item-title
                  class="primary--text text-center text-subtitle-1"
                >{{ productInfo[tag] || '-' }}</v-list-item-title>
                <v-list-item-icon class="my-3">
                  <v-icon color="primary">mdi-line-scan</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </template>
          </div>
        </v-card>
        <v-card
          :height="tableHeight * 0.3"
          class=""
          elevation="0"
          color="bg"
        >
          <v-card-title>
            <span>{{ $t('productLaunch.label.position') }}</span>
          </v-card-title>
          <div class="pl-8 pr-4 overflow-y-auto" :style="`height:${tableHeight * 0.3 - 128}px`">
            <div class="text-subtitle-2 info--text">
              {{ $t('productLaunch.label.deviceNumber') }}
            </div>
            <v-list-item
              class="mt-2 mb-4 scan-item"
              :style="`--dragbg-color:${primaryColor10}`"
              @click="type = 'deviceNumber';scanDialog = true;"
            >
              <v-list-item-title
                class="primary--text text-center text-subtitle-1"
              >{{ deviceNumber || '-' }}</v-list-item-title>
              <v-list-item-icon class="my-3">
                <v-icon color="primary">mdi-line-scan</v-icon>
              </v-list-item-icon>
            </v-list-item>
          </div>
          <v-card-actions class="px-4">
            <v-spacer></v-spacer>
            <v-btn
              small
              :min-width="75"
              class="text-none"
              color="primary"
              v-if="isBtnAccess('basic:progress:rack ')"
              @click="handleLaunch"
            >
              {{ $t('productLaunch.btn.launch') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <scan-dialog
      :scanDialog="scanDialog"
      :type="type"
      @closeDialog="scanDialog = false"
      @setInfo="setInfo"
    />
  </v-container>
</template>

<script>
import {
  mapState, mapActions, mapMutations, mapGetters,
} from 'vuex';
import Color from 'color';
import ScanDialog from '../components/ScanDialog.vue';

export default {
  name: 'productLaunch',
  components: {
    ScanDialog,
  },
  data() {
    return {
      elementName: 'productLaunch',
      tableHeight: document.body.clientHeight - 130,
      productInfo: {
        dispatchNumber: '',
        lightRodNumber: '',
        coreNumber: '',
        handleNumber: '',
        productNumber: '',
      },
      deviceNumber: '',
      scanDialog: false,
      type: '',
    };
  },
  computed: {
    ...mapState('helper', [
      'pagePortalMode',
    ]),
    ...mapState('productLaunch', [
    ]),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
    primaryColor10() {
      let primaryColor = '';
      if (this.$vuetify.theme.isDark) {
        primaryColor = this.$vuetify.theme.themes.dark.primary;
      } else {
        primaryColor = this.$vuetify.theme.themes.light.primary;
      }
      if (!primaryColor) {
        return 'rgba(0, 85, 194, 0.1)';
      }
      const { color } = Color(primaryColor).rgb();
      return `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.1)`;
    },
  },
  activated() {
  },
  created() {
  },
  deactivated() {
  },
  methods: {
    ...mapActions('productLaunch', [
      'getProductInfo',
      'productLaunch',
    ]),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    refresh() {
      this.productInfo = {
        dispatchNumber: '',
        lightRodNumber: '',
        coreNumber: '',
        handleNumber: '',
        productNumber: '',
      };
      this.deviceNumber = '';
    },
    async setInfo(scanCode, type) {
      if (type === 'deviceNumber') {
        this.deviceNumber = scanCode;
      } else if (type === 'dispatchNumber') {
        this.productInfo[type] = scanCode;
        const productInfo = await this.getProductInfo(scanCode);
        if (!productInfo.dispatchNumber) { return; }
        const {
          lightRodNumber,
          coreNumber,
          handleNumber,
          productNumber,
        } = productInfo;
        this.productInfo.lightRodNumber = lightRodNumber || '';
        this.productInfo.coreNumber = coreNumber || '';
        this.productInfo.handleNumber = handleNumber || '';
        this.productInfo.productNumber = productNumber || '';
      } else {
        this.productInfo[type] = scanCode;
      }
    },
    async handleLaunch() {
      const { deviceNumber, productInfo } = this;
      const {
        dispatchNumber,
        lightRodNumber,
        coreNumber,
        handleNumber,
        productNumber,
      } = productInfo;
      const payload = {
        dispatchNumber,
        deviceNumber,
        lightRodNumber,
        coreNumber,
        handleNumber,
        productNumber,
      };
      const result = await this.productLaunch(payload);
      if (result) {
        this.refresh();
      }
    },
  },
};
</script>
