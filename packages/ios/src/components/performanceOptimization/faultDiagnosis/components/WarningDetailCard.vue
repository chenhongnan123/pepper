<template>
  <div class="pr-2">
    <div class="primary--text font-weight-bold bluetitlepart_new">
      <div class="title">
        <span>{{ $t('faultDiagnosisPLCDetail.alarmDetail') }}</span>
      </div>
      <div class="cardtop">
        <div class="darkbluerectangle"></div>
        <div class="lightbluerectangle"></div>
      </div>
    </div>
    <v-card
      class="bluecard bluecard-decoration-5 rounded-xl"
      style="height: 110px"
      rounded
    >
      <v-card-text class="px-4 pt-8 pb-0">
        <v-row>
          <v-col class="info-tags" :cols="10">
            <div v-for="(info, index) in infos" :key="index" class="info-tag">
              <div
                class="text-subtitle-1 primary--text"
                style="margin-bottom: 14px;line-height: 22px;"
              >
                {{ info.label }}
              </div>
              <div style="font-size: 16px">
                {{ data[info.key] }}
              </div>
            </div>
          </v-col>
          <v-col
            :cols="2"
            style="text-align: right;"
          >
            <v-btn
              class="mr-2 mt-1"
              outlined
              color="primary"
              rounded
              @click="isShowRepairDialog = true"
            >
              {{ $t('faultDiagnosisPLCDetail.submitTask') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <SubmitRepairDialog
      :addDialog="isShowRepairDialog"
      @closeDialog="isShowRepairDialog = false"
      :alarmCodeId="alarmCodeId"
    ></SubmitRepairDialog>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';
import SubmitRepairDialog from '../SubmitRepairDialog.vue';

export default {
  name: 'WarningDetailCard',
  components: {
    SubmitRepairDialog,
  },
  data() {
    return {
      isShowRepairDialog: false,
    };
  },
  props: {
    bomId: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    ...mapState('helper', ['currentLocale']),
    alarmCodeId() {
      return this.$route.query.alarmCodeId;
    },
    infos() {
      return [{
        label: this.$t('faultDiagnosisPLCDetail.alarmTime'),
        key: 'time',
      },
      {
        label: this.$t('faultDiagnosisPLCDetail.alarmCode'),
        key: 'code',
      },
      {
        label: this.$t('faultDiagnosisPLCDetail.alarmContent'),
        key: 'content',
      },
      {
        label: this.$t('faultDiagnosisPLCDetail.lastAlarmTime'),
        key: 'lastTime',
      }];
    },
  },
};
</script>

<style lang="scss" scoped>
.info-tags {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0 8%;
}
.info-tag {
  display: inline-block;
  flex-grow: 1;
}
</style>
