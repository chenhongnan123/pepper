<template>
  <v-dialog persistent scrollable v-model="dialog" :max-width="'1000px'">
    <v-card style="overflow: hidden" max-height="800">
      <v-card-title primary-title>
        <span>
          {{
          $t('error.systemexceptionprompt')
          }}
        </span>
        <v-chip color="error" class="ml-3">{{netErorr? 1 : errorTotalList.length }}</v-chip>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height: 800px;">
        <div :class="isDark?'darktitle mt-3' :'title mt-3'">
          {{$t('abnormaldialog.communicationerror')}}</div>
        <div
          v-for="(item, index) in errorlist.connectionErrorVoList"
          :key="index"
          class="square mt-2"
          :class="isDark?'darksquare mt-2' :'square mt-2'"
        >{{item}}</div>
        <div :class="isDark?'darktitle mt-3' :'title mt-3'">
          {{$t('abnormaldialog.abnormalsystemcalibration')}}</div>
        <div
          v-for="(item, index) in errorlist.parameterCheckErrorList"
          :key="index"
          class="square mt-2"
          :class="isDark?'darksquare mt-2' :'square mt-2'"
        >{{item}}</div>
        <div :class="isDark?'darktitle mt-3' :'title mt-3'">
          {{$t('abnormaldialog.abnormalpost')}}
        </div>
        <div
          v-for="(item, index) in errorlist.postList"
          :key="index"
          :class="isDark?'darksquare mt-3' :'square mt-2'"
        >{{item}}</div>
        <div :class="isDark?'darktitle mt-3' :'title mt-3'">
          {{$t('abnormaldialog.networkanomaly')}}
        </div>
        <div
          v-if="netErorr"
          :class="isDark?'darksquare mt-3' :'square mt-2'"
        >{{'服务器错误'}}</div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import BaseGrid from '@/components/aggrid/BaseGrid.vue';

export default {
  name: 'plc-configurationparameter',
  data() {
    return {
      curmachine: null,
      curConnection: null,
      selectedList: [],
    };
  },
  methods: {
    ...mapActions('parameterVerification', [
      'getMachinesByLine',
      'getMachineConnectionList',
      'getConnectionParameterList',
      'createParameterCheck',
    ]),
  },
  props: {
    abnormalDialog: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapState('message', ['errorlist', 'errorTotalList']),
    ...mapState('helper', ['isDark', 'netErorr']),
    dialog: {
      get() {
        return this.abnormalDialog;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
  },
  components: {
    BaseGrid,
  },
  watch: {},
};
</script>

<style scoped>
.title {
  box-sizing: border-box;
  font-weight: 700;
  height: 30px;
  font-size: 1rem !important;
  color: black;
  text-align: left;
  line-height: normal;
}
.darktitle {
  box-sizing: border-box;
  font-weight: 700;
  height: 30px;
  font-size: 1rem !important;
  color: ffffff;
  text-align: left;
  line-height: normal;
}
.square {
  width: 950px;
  height: 70px;
  padding: 2px 2px 2px 2px;
  border-radius: 8px;
  font-size: 14px;
  color:black;
  border: 1px solid #d7d7d7;
  box-sizing: border-box;
}
.darksquare {
  width: 950px;
  height: 70px;
  padding: 2px 2px 2px 2px;
  border-radius: 8px;
  font-size: 14px;
  color:azure;
  border: 1px solid #d7d7d7;
  box-sizing: border-box;
}
</style>
