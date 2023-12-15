<template>
  <!-- eslint-disable -->
  <div class="alert-wrapper">
    <div v-if="!netErorr">
      <div v-if="errorTotalList.length">
      <div
        class="paramter font-weight-medium"
        @click="changParamter"
        v-if="!alert "
      >{{$t('error.systemerror')}}</div>
      <div class="rectangle" v-if="alert" style="backgroundColor:#d9001b">
        <div class="left px-6 py-6">
          <div class="bell ml-2">
            <v-badge color="red" overlap bottom>
              <span slot="badge">{{ errorTotalList.length }}</span>
              <v-icon color="#ffffff">mdi-bell-outline</v-icon>
            </v-badge>
          </div>
        </div>
        <div class="vertical-line"></div>
        <div class="center">
          <div class="d-flex">
            <div class="ml-2 font-weight-medium" style="font-size: 14px;">{{$t('error.systemerror')}}</div>
            <v-spacer></v-spacer>
            <div class="ml-2 ">
              <v-btn
                color="#ffffff"
                x-small
                outlined
                @click="abnormalDialog = true"
              >{{$t('btn.information')}}</v-btn>
            </div>
          </div>
          <div class="carouse">
            <v-carousel hide-delimiters height="120" :show-arrows="false" v-model="currentSlide">
              <v-carousel-item v-for="(item,k) in errorTotalList" :key="k">
                <div
                  class="warp mt-1"
                >{{item}}</div>
              </v-carousel-item>
            </v-carousel>
            <v-btn icon small color="#ffffff" :disabled="currentSlide === 0" @click="currentSlide--">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <span
              style="color: #ffffff;font-size: 12px;"
            >{{ `${currentSlide + 1}/${errorTotalList.length} `}}</span>
            <v-btn icon small color="#ffffff" @click="currentSlide++">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </div>
        <div class="vertical-line ml-2"></div>

        <div class="right">
          <div class="arrowbtn">
            <v-btn icon color="#ffffff" class="mt-6" @click="alert=false">
            <v-icon>mdi-arrow-up-drop-circle-outline</v-icon>
           </v-btn>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div
        class="exactness font-weight-medium"
        v-if="!successalert"
        @click="changeSuccessAlert"
      >{{$t('success.noabnormalities')}}</div>
      <div class="rectangle" v-if="successalert" style="backgroundColor:#37c102">
        <div class="left px-6 py-6">
          <div class="bell ml-2">
            <v-badge color="red" overlap>
              <span slot="badge">{{ errorTotalList.length }}</span>
              <v-icon large color="#ffffff">mdi-bell</v-icon>
            </v-badge>
          </div>
        </div>
        <div class="vertical-line"></div>
        <div class="center">
          <div class="d-flex">
            <div class="ml-2 mt-2 font-weight-medium">{{$t('success.noabnormalities')}}</div>
            <v-spacer></v-spacer>
            <div class="ml-2 mt-2"></div>
          </div>
        </div>
        <div class="vertical-line ml-2"></div>

        <div class="right">
          <div class="arrowbtn">
            <v-btn icon color="#ffffff" class="" @click="successalert=false">
            <v-icon>mdi-arrow-up-drop-circle-outline</v-icon>
          </v-btn>
          </div>
        </div>
      </div>
    </div>
    </div>
      <div v-else>
        <div>
      <div
        class="paramter font-weight-medium"
        @click="changParamter"
        v-if="!alert "
      >{{$t('error.networkanomaly')}}</div>
      <div class="rectangle" v-if="alert" style="backgroundColor:#d9001b">
        <div class="left px-6 py-6">
          <div class="bell ml-2">
            <v-badge color="red" overlap bottom>
              <span slot="badge">{{1}}</span>
              <v-icon color="#ffffff">mdi-bell-outline</v-icon>
            </v-badge>
          </div>
        </div>
        <div class="vertical-line"></div>
        <div class="center">
          <div class="d-flex">
            <div class="ml-2 font-weight-medium" style="font-size: 14px;">{{$t('error.parametervalueisabnormal')}}</div>
            <v-spacer></v-spacer>
            <div class="ml-2 ">
              <v-btn
                color="#ffffff"
                x-small
                outlined
                @click="abnormalDialog = true"
              >{{$t('btn.information')}}</v-btn>
            </div>
          </div>
          <div class="carouse ">
              {{ '服务器断开' }}
          </div>
        </div>
        <div class="vertical-line ml-2"></div>

        <div class="right">
          <div class="arrowbtn">
            <v-btn icon color="#ffffff" class="mt-6" @click="alert=false">
            <v-icon>mdi-arrow-up-drop-circle-outline</v-icon>
           </v-btn>
          </div>
        </div>
      </div>
    </div>      
  </div>
    <abnormal-dialog :abnormalDialog="abnormalDialog" @closeDialog="abnormalDialog = false" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AbnormalDialog from './AbnormalDialog.vue';

export default {
  name: 'paramter-alter',
  data() {
    return {
      alert: false,
      successalert: false,
      currentSlide: 0,
      abnormalDialog: false,
    };
  },
  components: {
    AbnormalDialog,
  },
  methods: {
    changParamter() {
      this.alert = true;
    },
    changeSuccessAlert() {
      this.successalert = true;
    },
    currentSlidePlus() {},
  },
  computed: {
    ...mapState('message', ['errorlist', 'errorTotalList']),
    ...mapState('helper', ['isDark', 'netErorr']),
  },
};
</script>

<style  scoped>
.carouse {
  width: 49vh;
  height: 1px;
  position: absolute;
  top: 16px;
}
.alert-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 700px;
  z-index: 9999;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.paramter {
  width: 70vh;
  height: 20px;
  padding: 2px 2px 2px;
  color: #ffffff;
  text-align: center;
  line-height: normal;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  background-color: #d9001b;
  font-size: 1.2vh;
}
.exactness {
  width: 70vh;
  height: 20px;
  padding: 2px 2px 2px;
  color: #ffffff;
  text-align: center;
  line-height: normal;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  background-color: #37c102;
  font-size: 1.2vh;
}
.warp {
  color: #ffffff;
  font-size: 12px;
  position: absolute;
  top: 1px;
  text-align: left
  }
  .bell{
    position: absolute;
    top: 50px;
  }
.rectangle {
  width: 80vh;
  height: 163px;
  color: #ffffff;
  text-align: center;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  display: flex;
  flex-direction: row;
}
.rectangle .left {
  position: relative;
  width: 100px;
}
.rectangle .left .notice {
  position: absolute;
  left: 55px;
  top: 43px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  line-height: 18px;
}
.rectangle .center {
  height: 100%;
  flex: 1;
}

.rectangle .right {
  width: 100px;
  position: relative;
}
.arrowbtn{
  position: absolute;
  left: 26px;
  bottom: 53px;
}
.vertical-line {
  position: relative;
  height: 100%;
}
.vertical-line::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 80%;
  background-color: rgba(255, 255, 255, 0.5);
  opacity: 0.5;
}
</style>
