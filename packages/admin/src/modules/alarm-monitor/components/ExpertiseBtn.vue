<template>
  <div class="ml-3">
    <v-btn
      width="60"
      small
      icon
      class="text-none"
      color="primary"
      @click="openDialog"
    >
      <v-icon>mdi-eye-outline</v-icon>
      <span>{{ $t('alarmMonitor.label.view') }}</span>
    </v-btn>
  </div>
</template>
<script>

export default {
  name: 'ExpertiseBtn',
  data() {
    return {
      expertiseDialog: false,
    };
  },
  methods: {
    openDialog() {
      this.params.that.openDialog(this.params.data);
    },
  },
};
</script>
