<template>
  <div class="">
    <v-carousel
      v-if="pageList?.length"
      :value="value"
      cycle
      interval="60000"
      hide-delimiters
      :show-arrows-on-hover="true"
      :height="height"
      @change="(value) => this.$emit('input', value)"
    >
      <v-carousel-item
        v-for="(page, ind) in pageList"
        :key="`carousel_item_${ind}`"
      >
        <part-card v-on="$listeners"
          :height="height - 20"
          :items="page.items"
        />
        <div class="carousel-page pt-2">{{ ind + 1  }} / {{ pageList.length }}</div>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters,
} from 'vuex';
import PartCard from './partCard.vue';

export default {
  name: 'PartListCarousel',
  components: {
    PartCard,
  },
  data() {
    return {
      clientHeight: document.body.clientHeight,
      numberPerPage: 6, // 每页显示的卡片数量
    };
  },
  props: {
    value: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      required: true,
    },
    list: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('statePrediction', []),
    // 分页展示
    pageList() {
      const len = this.list.length;
      const pages = [];
      for (let i = 0; i < len; i += this.numberPerPage) {
        pages.push({
          page: i + 1,
          items: this.list.slice(i, i + this.numberPerPage),
        });
      }
      return pages;
    },
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
.carousel-page {
  position: absolute;
  z-index: 1;
  height: 32px;
  bottom: 0px;
  left: 0;
  right: 0;
  text-align: center;
  color: #aaa;
}
// ::v-deep .v-responsive__content {
//   position: relative;
//   // & > div {
//   //   height: 100%;
//   // }
// }
// ::v-deep .carousel-page {
//   position: absolute;
//   z-index: 100;
//   bottom: 0px;
// }
</style>
