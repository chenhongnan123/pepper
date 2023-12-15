<template>
  <div>
    <div
      class="bluetitlepart ml-4"
    >
      <div class="title">{{ title }}</div>
      <div class="bgImg">
        <img
          :src="require('@/assets/icons/img/darkbluesquare.svg')"
          alt=""
        />
      </div>
      <div class="cardtop">
        <div class="darkbluerectangle"></div>
        <div class="lightbluerectangle"></div>
      </div>
    </div>
    <v-card
      class="bluecard rounded-xl"
      :style="`height: ${cardHeight}px;`"
      style="background: rgba(255, 255, 255, 0.07)!important;border: none!important;"
      rounded
    >
      <v-card-text class="fill-height">
        <div class="fill-height">
          <v-text-field
            class="mt-4 blueinput rounded-xl"
            dense
            dark
            outlined
            label=""
            hide-details
            prepend-inner-icon="mdi-magnify"
            v-model="searchVal"
          ></v-text-field>
          <div class="bluetabdiv mt-1 fill-height">
            <div>
              <v-treeview
                :open.sync="openList"
                :style="`height: ${treeHeight}px;overflow-y: scroll;cursor: pointer;`"
                class="bluetree"
                dense
                item-key="bomId"
                item-text="bomName"
                item-children="childrenBomList"
                :active.sync="activefloder"
                activatable
                return-object
                :search="searchVal"
                :items="formatBomList(bomTreeList)"
                selection-type="independent"
                item-disabled="isDisabled"
              >
                <template v-slot:label="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.bomName }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ item.bomNumber }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-treeview>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions,
} from 'vuex';

let timer = null;
export default {
  name: 'MachineBom',
  data() {
    return {
      clientheight: document.body.clientHeight,
      tabkey: 0,
      searchVal: '',
      bomTreeList: [],
      activefloder: [],
      selectValue: '',
      openList: [],
    };
  },
  computed: {
    ...mapState('digitalArchives', ['deviceDetail', 'machineBomList']),
    ...mapGetters('digitalArchives', ['formatBomList']),
    title() {
      return this.$t('digitalarchives.machinebom');
    },
    cardHeight() {
      return this.clientheight - 200;
    },
    treeHeight() {
      return this.cardHeight - 110;
    },
  },
  watch: {
    activefloder: {
      handler(val) {
        if (val.length > 0) {
          this.$emit('getBomDetail', val[0]);
        } else {
          this.$emit('getBomDetail', {});
        }
      },
      deep: true,
      immediate: false,
    },
  },
  created() {
  },
  mounted() {
    timer = setTimeout(() => {
      this.init();
    }, 100);
  },
  beforeDestroy() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  },
  methods: {
    ...mapMutations('helper', ['SET_ALERT']),
    ...mapActions('digitalArchives', [
      'getDeviceDetail',
      'getMachineBomList',
    ]),
    async init() {
      // 获取设备详情
      await this.getDeviceDetail();
      // 获取bom树
      await this.getBomTreeBean();
    },
    // 生成完整bom树
    async getBomTreeBean() {
      await this.getMachineBomList();
      if (this.deviceDetail && Object.keys(this.deviceDetail).length) {
        const {
          deviceNumber,
          deviceName,
          deviceDescription,
        } = this.deviceDetail;
        this.bomTreeList = [{
          bomId: 0,
          bomLevel: '0',
          bomParentId: null,
          bomNumber: deviceNumber,
          bomName: deviceName,
          partName: deviceName,
          partNumber: deviceNumber,
          partDescription: deviceDescription,
          childrenBomList: this.machineBomList,
        }]; // 将设备层添加到bom树结构中
      }
      this.activefloder.push(this.bomTreeList[0]);
      this.openList.push(this.bomTreeList[0]);
    },
  },
};
</script>

<style lang="scss" scoped>
  .gradient-card {
    border: solid 1px transparent;
    border-radius: 16px!important;
    background-origin: border-box;
    background-clip: content-box, border-box;
    background-image: linear-gradient(#162831, #162831),
      linear-gradient(0deg, #23789a, #e5ecf1 25%, #a5c9db 26%, #23789a);
    ::v-deep .v-card {
      background-color: transparent;
      box-shadow: none;
    }
  }
  .bluetitle {
    font-size: 20px;
    color: white;
    height: 47px;
    line-height: 47px;
    background-image: linear-gradient(90deg, #00ffff 0.44%, rgba(0, 0, 0, 0) 99.99%);
    box-sizing: border-box;
  }

</style>
