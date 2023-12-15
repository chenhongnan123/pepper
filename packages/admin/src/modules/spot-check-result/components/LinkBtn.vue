<template>
  <div
    @click.enter="handleClick"
    @keyup.enter="handleClick"
    role="button"
    tabindex="0"
    style="color: #0055c2; cursor: pointer;"
  >
    <span
        :class="'text-decoration-underline '"
    >
        {{ rowData.checkName }}
    </span>
  </div>
</template>

<script>
export default {
  computed: {
    rowData() {
      return this.params.data;
    },
  },
  methods: {
    handleClick() {
      const { checkResultId } = this.rowData;
      let { beginTime } = this.params;
      beginTime = this.$getFormatDate(beginTime, 'yyyy-MM-DD');
      this.$router.push({
        path: '/spot-check-result/detail',
        query: {
          checkResultId,
          beginTime,
        },
      });
    },
  },
};
</script>
