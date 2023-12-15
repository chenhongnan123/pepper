<template>
  <div class="d-flex fill-height">
    <div
      class="bgSquare"
      :style="`height: ${squareRadius}px;width: ${squareRadius + 10}px;`"
    >
      <div
        :style="`line-height: ${squareRadius}px;`"
        class="text-center scoreTitle"
      >
        {{ score || 0 }}
      </div>
    </div>
    <div
      class="d-flex flex-column px-2 mt-n1"
      style="width: 80%;"
      :style="`height: ${squareRadius + 6}px;`"
    >
      <span class="scoreTitle text-hidden-overflow font-weight-bold" :title="partName">
        {{ partName || '-' }}
      </span>
      <span class="score-subtitle text-hidden-overflow" :title="partNumber">
        {{ partNumber || '-' }}
      </span>
    </div>
    <div
      :style="`line-height: ${squareRadius}px;`"
      class="ml-auto"
    >
      <v-icon
        x-small
        class="text-right"
        :style="`color: ${statusColor};`"
      >mdi-circle</v-icon>
    </div>
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
  name: 'healthScoreSquare',
  components: {
  },
  data() {
    return {
      clientHeight: document.body.clientHeight,
    };
  },
  props: {
    score: {
      type: [Number, String],
      required: true,
    },
    squareRadius: {
      type: Number,
      required: true,
    },
    partName: {
      type: String,
      required: false,
    },
    partNumber: {
      type: String,
      required: false,
    },
    statusColor: {
      type: String,
      required: true,
      default: '#4cb21c',
    }, // 默认健康绿色
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('statePrediction', []),
  },
  created() {
  },
  methods: {
    ...mapActions('statePrediction', []),
    ...mapMutations('helper', [
      'setAlert',
    ]),
  },
};
</script>

<style lang="scss" scoped>
  .text-hidden-overflow{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .bgSquare {
    background-color:  #f2f2f2;
  }
  .scoreTitle {
    font-size: 14px;
    color: #333333;
  }
  .score-subtitle {
    font-size: 12px;
    color: #b2b2b2;
  }
</style>
