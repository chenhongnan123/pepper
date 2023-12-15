<template>
    <div class="warp d-flex mp-2">
        <div class="split-icon px-2 mt-n1">
        <img src="@/assets/icons/img/health/title-icon.png" alt="">
        </div>
        <p class="title-content">{{ title }}</p>
        <div class="split-line">
            <img src="@/assets/icons/img/health/title-line.png" alt="">
        </div>
    </div>
</template>

<script>

export default {
  name: 'GeneralTitle',
  props: {
    title: {
      type: String,
      default: '-',
    },
  },
  data() {
    return {

    };
  },
  components: {
  },
  computed: {
  },
  created() {
  },
  methods: {

  },
};
</script>
<style lang="scss" scoped>
.warp {
    font-size: 20px;
    position: relative;
    .split-icon {
        color: var(--v-primary-base);
        font-size: 26px;
        img {
          width: 18px;
          height: 22px;
        }
    }
    .title-content {
      height: 26px;
      line-height: 26px;
    }

    .split-line {
        position: absolute;
        top: 14px;
        left: 0px;
        width: 100%;
        img {
            width: 100%;
            height: 4px;
        }
    }
}

.warp::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 0px;
    height: 16px;
    width: 2px;
    background: var(--v-primary-base);

}
</style>
