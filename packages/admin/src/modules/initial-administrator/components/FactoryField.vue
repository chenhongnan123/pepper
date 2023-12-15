<template>
  <div>
    <span :class="`fi fi-${country}`"></span>
    <span class="pl-2">{{params.value}}</span>
  </div>
</template>

<script>
export default {
  mounted() {
    // console.log(this.params);
  },
  computed: {
    country() {
      const { params } = this;
      return params.data.countryCode || '-';
    },
  },
};
</script>
