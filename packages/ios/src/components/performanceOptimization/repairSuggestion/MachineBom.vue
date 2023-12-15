<template>
  <div>
    <v-card
      class="bluecard rounded-xl"
      style="background: rgba(255, 255, 255, 0.07) !important; border: none !important"
      :style="`height: ${cardHeight}px; overflow-y: hidden `"
      rounded
    >
      <v-card-text class="fill-height">
        <div class="fill-height">
          <div class="bluetabdiv mt-1 fill-height">
            <div class="bluelist mt-n2">
              <v-list :style="`height: ${cardHeight}px;overflow-y: scroll;cursor: pointer;`">
                <v-list-item-group
                  v-model="selectValue"
                  mandatory
                  color="primary"
                >
                  <v-list-item
                    v-for="(item, i) in bomList"
                    :key="`key_part_${i}`"
                    style="height: 80px"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        <span class="text-h6 font-weight-bold">{{ item.bomName }}</span>
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item.bomNumber }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-list-item-action-text>
                        <div class="d-flex flex-column align-end">
                          <span class="primary--text font-weight-bold">{{
                            $t('repairSuggestion.score')
                          }}</span>
                          <v-list-item-title class="text-h5 primary--text font-weight-bold">{{
                            item.healthScore || '-'
                          }}</v-list-item-title>
                        </div>
                      </v-list-item-action-text>
                    </v-list-item-action>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'MachineBom',
  data() {
    return {
      clientheight: document.body.clientHeight,
      selectValue: '',
      bomList: [],
    };
  },
  computed: {
    cardHeight() {
      return this.clientheight - 325;
    },
  },
  watch: {
    selectValue: {
      handler(val) {
        const activeObj = this.bomList[val];
        if (activeObj) {
          this.$emit('getBomDetail', activeObj);
        } else {
          this.$emit('getBomDetail', {});
        }
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {},
  methods: {
    ...mapActions('repairSuggestion', ['getFirstBomList', 'getDeviceBomInfo']),
    async init() {
      const bomList = await this.getFirstBomList();
      const bomHealth = await this.getDeviceBomInfo();
      this.bomList = bomList.map((_) => ({
        ..._,
        healthScore: bomHealth[_.bomId],
      }));
    },
  },
};
</script>

<style lang="scss" scoped>
.gradient-card {
  border: solid 1px transparent;
  border-radius: 16px !important;
  background-origin: border-box;
  background-clip: content-box, border-box;
  background-image: linear-gradient(#162831, #162831),
    linear-gradient(0deg, #23789a, #e5ecf1 25%, #a5c9db 26%, #23789a);
  ::v-deep .v-card {
    background-color: transparent;
    box-shadow: none;
  }
}
</style>
