<template>
  <div>
    <v-btn
      color="primary"
      x-small
      style="background-color: transparent;"
      outlined
      @click="detailClickHandler"
    >
      {{$t('btn.information')}}
    </v-btn>
  </div>
</template>

<script>
import {
  mapActions,
  mapMutations,
} from 'vuex';

export default {
  name: 'actionBtn',
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('alarmRecords', [
      'setAlarmRecordDrawerShow',
      'setAlarmRecordDetail',
    ]),
    ...mapActions('alarmRecords', ['getAlarmRecordDetail']),
    async detailClickHandler() {
      const { id } = this.infoObj;
      const payload = {
        id,
      };
      const result = await this.getAlarmRecordDetail(payload);
      if (result) {
        this.setDetail(result);
      }
    },
    setDetail(detailObj) {
      this.setAlarmRecordDetail(detailObj);
      this.setAlarmRecordDrawerShow(true);
    },
  },
  computed: {
    infoObj() {
      return this.params.data;
    },
  },
};
</script>

<style>
</style>
