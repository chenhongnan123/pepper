<template>
  <div>
    <v-icon>{{ icon }}</v-icon>
  </div>
</template>

<script>

export default {
  data() {
    return {
      icon: '',
    };
  },
  created() {
    // console.log(this.params);
    const { params } = this;
    this.icon = params ? `mdi-${params.value}` : '';
  },
  components: {
  },
  computed: {
  },
  methods: {
  },
};
</script>
