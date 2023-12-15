<template>
  <div :style="`height: ${height}px;`">
    <v-row dense>
      <v-col style="padding: 6px;"
        cols="4"
        v-for="(item, index) in items"
        :key="`card_key_${index}`"
      >
        <v-card :height="cardHeight" @click="handleCardClick(item)">
          <div class="d-flex flex-column card-content">
            <div class="card-title-content">
              <!-- <div> -->
                <div style="display: flex;">
                  <v-icon color="primary">mdi-cog</v-icon>
                  <b class="text-hidden-overflow" :title="item.bomName">
                    {{ item.bomName || '-' }}
                  </b>
                </div>
                <div class="d-flex justify-end">
                  <v-chip label small style="color:#B2B2C0" color="#F2F2F2">
                    {{ getPartTypeList(item.partType) }}
                  </v-chip>
                </div>
              <!-- </div>
              <p class="to-part-detail d-flex">
                <button @click.stop="goPartDetail(item.partId)">
                  {{ $t('statePrediction.title.partDetail') }}
                </button>
                <v-icon dense color="primary">mdi-chevron-right</v-icon>
              </p> -->
            </div>
            <div class="health-card-content full-width">
              <div></div>
              <div class="d-flex flex-column">
                <p class="d-flex flex-column">
                  <span class="padding-tb-10 text-hidden-overflow">
                    {{ item.partNumber || '-' }}
                  </span>
                  <span class="text-hidden-overflow" :title="item.partDescription"
                    style="width:90%;">{{ item.partDescription }}</span>
                </p>
                <div class="d-flex align-center space-between">
                  <div class="d-flex flex-c">
                    <span class="font-11 text-hidden-overflow">
                      {{ $t('statePrediction.label.healthScores') }}
                    </span>
                    <span>
                      <v-icon style="margin-right:5px;"
                        x-small
                        class="text-right"
                        :style="`color: ${getColorByStatus(partHealthScore(item)).color};`"
                      >mdi-square</v-icon>
                      <span class="font-12">
                        {{ partHealthScore(item) || 0 }}
                      </span>
                    </span>
                  </div>
                  <div class="d-flex health-state"
                    :style="`background:${getColorByStatus(partHealthScore(item)).bgColor}`">
                    <v-icon small class="pr-3"
                      :style="`color:${getColorByStatus(partHealthScore(item)).color}`">
                      {{ `${getColorByStatus(partHealthScore(item)).icon}` }}
                    </v-icon>
                    <span class="text-hidden-overflow"
                      :style="`color:${getColorByStatus(partHealthScore(item)).color}`"
                      :title="getColorByStatus(partHealthScore(item)).text">
                      {{ getColorByStatus(partHealthScore(item)).text }}
                    </span>
                  </div>
                </div>
              </div>
              <v-img
                :alt="$t('statePrediction.label.equipmentPicture')"
                :height="'90%'"
                :width="'100%'"
                :src="item.partPic"
                cover class="d-flex align-self-end"
                style="border-radius: 2px;"
              ></v-img>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';

export default {
  name: 'partCard',
  components: {
  },
  data() {
    return {
      clientHeight: document.body.clientHeight,
    };
  },
  props: {
    height: {
      type: Number,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('statePrediction', ['partsList', 'partTypeList', 'deviceHealthInfo']),
    cardHeight() {
      return this.height / 2 - 9;
    },
    moduleName() {
      return this.$route.name;
    },
  },
  methods: {
    ...mapActions('statePrediction', ['getParameterList']),
    ...mapMutations('helper', [
      'setAlert',
    ]),
    handleCardClick(row) {
      this.$emit('cardClick', row);
    },
    partHealthScore(item) {
      let score = 0;
      if (this.deviceHealthInfo?.[item.bomId]) {
        score = this.deviceHealthInfo[item.bomId].partHealth;
      }
      return score;
    },
    getColorByStatus(score) {
      if (!score) score = 0;
      switch (true) {
        case this.isInRange(score, 90, 100):
          return {
            color: 'rgba(5,96,42,1)',
            text: this.$t('statePrediction.label.healthy'),
            icon: 'mdi-leaf',
            bgColor: 'rgba(76, 178, 28, 1)',
          }; // 健康
        case this.isInRange(score, 70, 90):
          return {
            color: 'rgba(74, 121, 2, 1)',
            text: this.$t('statePrediction.label.relativelyHealthy'),
            icon: 'mdi-check',
            bgColor: 'rgba(176, 203, 13, 1)',
          }; // 比较健康
        case this.isInRange(score, 50, 70):
          return {
            color: 'rgba(203, 207, 8, 1)',
            text: this.$t('statePrediction.label.subHealthy'),
            icon: 'mdi-minus',
            bgColor: 'rgba(255, 255, 0, 0.5)',
          }; // 亚健康
        case this.isInRange(score, 30, 50):
          return {
            color: 'rgba(255,152,0,1)',
            text: this.$t('statePrediction.label.earlyWarning'),
            icon: 'mdi-alert-circle-outline',
            bgColor: 'rgba(255, 152, 0, 0.5)',
          }; // 预警
        case this.isInRange(score, 0, 30):
          return {
            color: 'rgba(211, 6, 31,1)',
            text: this.$t('statePrediction.label.fault'),
            icon: 'mdi-close',
            bgColor: 'rgba(217, 0, 27, 0.5)',
          }; // 报警
        default:
          return {
            color: '#b2b2b2',
            text: this.$t('statePrediction.label.healthy'),
            icon: 'mdi-leaf',
            bgColor: '#f2f2f2',
          };
      }
    },
    // 判断数据在某一个区间
    isInRange(num, min, max) {
      return (num === 0 && min === 0) ? true : (num > min && num <= max);
    },
    // 零件对照
    getPartTypeList(params) {
      if (params) {
        const type = this.partTypeList.find((m) => m.dictValue === params);
        if (type) {
          return type.dictLabel;
        }
        return params;
      }
      return '-';
    },
    goPartDetail(id) {
      if (!id) return;
      this.$router.push({ name: 'statePartDetail', params: { id, page: this.moduleName } });
    },
  },
};
</script>

<style lang="scss" scoped>
.text-hidden-overflow{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.font-12{
  font-size: 12px;
}
.font-11{
  font-size: 11px;
}
.padding-tb-10{
  padding: 10px 0;
}
.margin-t-20{
  margin-top: 20px;
}
.card-content{
  height: 100%;
  padding: 20px;
  justify-content: space-between;
}
.card-title-content{
  // display: grid;
  // grid-template-columns: auto 30%;
  // align-items: center;
  display: flex;
  justify-content: space-between;
  & > div:first-child{
    // display: grid;
    // grid-template-columns: 8% auto auto;
    width: calc(100% - 80px);
    b{
      font-size: 16px;
      padding: 0 10px;
    }
    span{
      // justify-self: center;
      font-size: 14px;
      padding: 5px 10px;
      background: #ddd;
    }
  }
  & > div:last-child{
    width: 80px;
  }
}
.full-width{
  width: 100%;
}
.space-between{
  justify-content: space-between;
}
.health-card-content{
  display: grid;
  grid-template-columns: 8% 50% auto;
  height: 100%;
  // padding-left: 20px;
  // display: grid;
  // grid-template-columns: 55% auto;
  // gap: 15px;
  & > div{
    font-size: 14px;
    justify-content: space-between;
    p{
      color: #aaa;
    }
    & > div{
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 12px;
    }
  }
  & > div:nth-child(2){
    padding-right: 10px;
  }
  .flex-c{
    flex-direction: column;
  }
}
.health-state{
  width: 60%;
  justify-content: center;
  padding: 8px;
  background: #DDEFD4;
  border-radius: 3px;
  font-size: 13px;
}
.to-part-detail{
  margin: 0;
  cursor: pointer;
  align-items: center;
  justify-content: end;
  color: #0075C2;
  font-size: 14px;
}
</style>
