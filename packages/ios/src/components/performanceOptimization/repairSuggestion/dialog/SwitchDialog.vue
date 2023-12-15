<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="600px"
    transition="dialog-transition"
  >
    <div class="app-dialog pa-1">
      <v-card
        style="overflow: hidden"
        class="rounded-lg"
      >
        <div class="rectangle-1"></div>
        <div class="rectangle-2"></div>
        <div class="rectangle-3"></div>
        <div class="rectangle-4"></div>
        <div class="rectangle-5"></div>
        <v-card-title
          primary-title
          class="mt-2 pb-0"
        >
          <span class="text-h5">
            {{ this.$t('repairSuggestion.changeMaterial') }}
          </span>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="dialog = false"
          >
            <v-icon class="text-h5">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <!-- 标题分割线 -->
        <div class="d-flex align-center px-5">
          <img
            :src="require('@/assets/icons/img/dialog-circle-big-dark.svg')"
            alt=""
            class="mr-2"
          />
          <img
            :src="require('@/assets/icons/img/dialog-circle-small-dark.svg')"
            alt=""
          />
          <v-divider></v-divider>
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-1"
          />
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-1"
          />
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-1"
          />
        </div>
        <v-card-text>
          <div class="d-flex">
            <div class="text-subtitle1 icon--text">
              {{ $t('repairSuggestion.changeReason') }}
            </div>
            <v-spacer></v-spacer>
            <div class="bluebtn">
              <v-btn
                @click="handleSave"
                pilled
                dense
                small
              >
                {{ $t('common.savebtn') }}
              </v-btn>
            </div>
          </div>
          <div class="blueinput">
            <v-textarea
              class="mt-3"
              solo
              clearable
              v-model="reason"
              auto-grow
              :rows="10"
            ></v-textarea>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-dialog>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import moment from 'moment';

export default {
  name: 'SwitchDialog',
  data() {
    return {
      moment,
      reason: '',
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    machineBomDetail: {
      type: Object,
      default() {
        return {};
      },
    },
    rules: {
      type: Object,
    },
  },
  computed: {
    ...mapState('sparepart', []),
    dialog: {
      get() {
        this.reset();
        return this.addDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['SET_ALERT']),
    ...mapActions('repairSuggestion', ['addReplacePart']),
    handleSave() {
      if (!this.reason || this.reason.trim() === '') {
        this.SET_ALERT({
          type: 'error',
          message: this.$t('spareparts.changereasonempty'),
        });
        return;
      }
      const payload = [
        {
          bomId: this.machineBomDetail.bomId,
          replaceReason: this.reason,
          partId: this.machineBomDetail.partId,
        },
      ];
      const result = this.addReplacePart(payload);
      if (result) {
        this.SET_ALERT({
          type: 'success',
          message: this.$t('success.successAction'),
        });
        this.$emit('closeDialog');
        this.$emit('getTableList');
      }
    },
    reset() {
      this.$nextTick(() => {
        this.reason = '';
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-dialog {
  ::v-deep() .v-card {
    min-height: 200px;
  }
}

.bluebtn {
  ::v-deep() .v-btn {
    width: 72px;
    border-radius: 16px;
    border: 1px solid;
    background-color: rgba(50, 197, 255, 0.1);
    box-sizing: border-box;
    color: var(--v-primary-base);
    text-align: center;
    line-height: normal;
  }
}

.blueinput {
  ::v-deep() textarea {
    height: 200px;
  }
  ::v-deep() .v-input__slot {
    background-color: rgba(50, 197, 255, 0.025) !important;
  }
  ::v-deep() .v-input__control > .v-input__slot {
    border: 1px solid rgba(24, 254, 254, 0.2) !important;
  }
}
</style>
