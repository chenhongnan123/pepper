<template>
  <div
    class="custom-card"
    :height="height"
  >
    <v-card
      flat
      color="primary"
      class="mx-auto"
      rounded="lg"
      dark
      :height="height"
    >
      <v-card-title
        primary-title
        dark
      >
        {{ `${details.partNumber || '-'} | ${details.partName || '-'}` }}
        <v-spacer></v-spacer>
        <!-- <v-btn
          v-if="isBtnAccess('partManagement_main_edit')"
          outlined
          small
          class="mr-2"
          dark
          @click="handleSaveDetail()"
        >
          {{ $t('btn.save') }}
        </v-btn> -->
      </v-card-title>
      <v-card-text
        :style="`height: ${height - 48}px;overflow-y: auto;`"
      >
        <v-row
          class="full-width customRow mt-1"
        >
          <v-col
            cols="2"
            class="full-width"
          >
            <pic-upload
              ref="picUpload"
              :url="saveData.partPic"
              @updateUrl="updateUrl"
              :height="`${picUploadHeight}px`"
              :tips="tips"
            />
          </v-col>
          <v-col cols="10">
            <v-form ref="form" dark>
              <v-row>
                <v-col cols="4">
                  <v-text-field
                    dense
                    clearable
                    :label="`${$t('partManagement.table.partNumber')}`"
                    v-model="saveData.partNumber"
                    :rules="rules.name"
                    :disabled="!isBtnAccess('partManagement_main_edit')"
                    @blur="handleSaveDetail"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    dense
                    clearable
                    :label="`${$t('partManagement.table.partName')}`"
                    v-model="saveData.partName"
                    :rules="rules.name"
                    :disabled="!isBtnAccess('partManagement_main_edit')"
                    @blur="handleSaveDetail"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    dense
                    clearable
                    :label="`${$t('partManagement.table.partDescription')}`"
                    v-model="saveData.partDescription"
                    :disabled="!isBtnAccess('partManagement_main_edit')"
                    @blur="handleSaveDetail"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                   dense
                    clearable
                    :label="`${$t('partManagement.label.model')}`"
                    v-model="saveData.model"
                    :disabled="!isBtnAccess('partManagement_main_edit')"
                    @blur="handleSaveDetail"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    dense
                    clearable
                    v-model="saveData.supplier"
                    :label="`${$t('partManagement.label.supplier')}`"
                    :disabled="!isBtnAccess('partManagement_main_edit')"
                    @blur="handleSaveDetail"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
} from 'vuex';
import PicUpload from '@/components/commonUI/PicUpload.vue';

export default {
  name: 'PartDetail',
  data() {
    return {
      saveData: {
        partPic: '',
        partNumber: '',
        partName: '',
        partDescription: '',
        model: '',
        supplier: '',
      },
      tips: this.$t('partManagement.label.acceptTip'),
    };
  },
  components: {
    PicUpload,
  },
  props: {
    height: {
      type: Number,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('partManagement', [
      'partAnnexInfo',
    ]),
    details() {
      return this.partAnnexInfo;
    },
    picUploadHeight() {
      return this.height - 48 - 16 - 16;
    },
  },
  watch: {
    details: {
      handler(val) {
        const {
          partId,
          partPic,
          partNumber,
          partName,
          partDescription,
          model,
          supplier,
        } = val;
        this.$nextTick(async () => {
          this.saveData = {
            partId,
            partPic,
            partNumber,
            partName,
            partDescription,
            model,
            supplier,
          };
        });
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations('helper', [
      'setAlert',
    ]),
    ...mapActions('partManagement', [
      'editPart',
    ]),
    updateUrl(val) {
      this.saveData.partPic = val;
      this.handleSaveDetail();
    }, // 更新图片地址
    async handleSaveDetail() {
      await this.$getTimeout(200);
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        partId,
        partPic,
        partNumber,
        partName,
        partDescription,
        supplier,
        model,
      } = this.saveData;
      const payload = {
        partId,
        partPic,
        partNumber,
        partName,
        partDescription,
        supplier,
        model,
      };
      const result = await this.editPart(payload);
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.$emit('refresh');
      }
    },
  },
};
</script>
<style lang="scss" scoped>
  .custom-card {
    ::v-deep .v-card__title {
      padding: 8px 16px 8px 16px;
    }
    ::v-deep .v-card__text {
      padding: 0px 16px 0px 16px;
    }
    .full-width {
      width: 100%;
    }
    .customRow {
      ::v-deep .col-10 {
        padding: 12px 4px 12px 12px;
      }
    }
  }
  // 解决深色模式下，输入框聚焦颜色和背景的蓝色一样
  ::v-deep() .primary--text {
    color: #fff !important;
  }
</style>
