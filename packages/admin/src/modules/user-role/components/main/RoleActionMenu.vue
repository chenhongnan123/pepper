<template>
  <div>
    <v-btn
      icon
      small
      color="primary"
      @click="goDetail"
    >
      <v-icon>mdi-import</v-icon>
    </v-btn>
  </div>
</template>

<script>

export default {
  data() {
    return {
    };
  },
  mounted() {
    // console.log(this.params);
  },
  components: {
  },
  computed: {
  },
  methods: {
    goDetail() {
      const { params } = this;
      // console.log('params', params);
      this.$router.push({ name: 'roleDetail', params: { id: params.data.id } });
    },
  },
};
</script>
