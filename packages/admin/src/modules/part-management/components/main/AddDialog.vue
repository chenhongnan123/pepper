<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="cardWidth"
    :max-height="cardHeight"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-row>
        <v-col :cols="5">
          <v-card-title primary-title>
            <span>
              {{ $t('partManagement.label.addPart') }}
            </span>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-text :style="`height: ${cardHeight - 64}`">
            <v-form
              ref="form"
              lazy-validation
            >
              <pic-upload
                ref="picUpload"
                :url="tabledataobj.partPic"
                @updateUrl="updateUrl"
                :width="`${leftWidth}px`"
                :height="`${cardHeight - 64 - 264}px`"
                :tips="tips"
              />
              <v-text-field
                class="mt-4"
                dense
                clearable
                :rules="rules.name"
                :label="`${$t('partManagement.table.partNumber')}*`"
                v-model="tabledataobj.partNumber"
                counter="50"
              ></v-text-field>
              <v-text-field
                class="mt-3"
                dense
                clearable
                :rules="rules.name"
                :label="`${$t('partManagement.table.partName')}*`"
                v-model="tabledataobj.partName"
                :counter="50"
              ></v-text-field>
              <v-text-field
                class="mt-3"
                dense
                clearable
                :label="`${$t('partManagement.table.partDescription')}`"
                v-model="tabledataobj.partDescription"
                :counter="500"
                :rules="rules.over500"
              ></v-text-field>
              <v-autocomplete
                class="mt-3"
                clearable
                :items="itemTypeList"
                :rules="rules.isRequired"
                item-text="dictLabel"
                item-value="dictValue"
                :label="`${$t('partManagement.table.partType')}*`"
                v-model="tabledataobj.partType"
              >
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.dictLabel }}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
              <v-text-field
                class="mt-3"
                dense
                clearable
                :label="`${$t('partManagement.label.model')}`"
                v-model="tabledataobj.model"
                :counter="50"
                :rules="rules.limit50"
              ></v-text-field>
              <v-text-field
                class="mt-3"
                dense
                clearable
                :label="`${$t('partManagement.label.supplier')}`"
                v-model="tabledataobj.supplier"
                :counter="500"
                :rules="rules.over500"
              ></v-text-field>
            </v-form>
          </v-card-text>
        </v-col>
        <v-divider
          vertical
        ></v-divider>
        <v-col :cols="7">
          <v-card-title primary-title>
            <span>
              {{ $t('partManagement.label.attachment') }}
            </span>
            <v-spacer></v-spacer>
            <v-btn
              icon
              small
              @click="dialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text :style="`height: ${cardHeight - 64}`">
            <file-upload
              ref="fileUpload"
              :multiple="true"
              :width="`${rightWidth}px`"
              :height="`${cardHeight}px`"
            />
          </v-card-text>
          <v-card-actions class="mb-2">
            <v-spacer></v-spacer>
            <v-btn
              color="warning"
              small
              text
              class="mr-2"
              @click="reset"
            >
              {{$t('btn.eliminate')}}
            </v-btn>
            <v-btn
              color="primary"
              small
              class="text-none"
              @click="handleSave"
            >
              {{$t('btn.save')}}
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
} from 'vuex';
import FileUpload from '@/components/commonUI/FileUpload.vue';
import PicUpload from '@/components/commonUI/PicUpload.vue';

export default {
  name: 'addDialog',
  data() {
    return {
      cardWidth: 800,
      cardHeight: 450,
      tips: this.$t('partManagement.label.acceptTip'),
      tabledataobj: {
        partPic: '',
        partNumber: '',
        partName: '',
        partDescription: '',
        partType: '',
        model: '',
        supplier: '',
      },
    };
  },
  components: {
    FileUpload,
    PicUpload,
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('helper', ['currentLocale']),
    ...mapState('partManagement', [
      'itemTypeList',
    ]),
    dialog: {
      get() {
        return this.addDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    leftWidth() {
      return (this.cardWidth / 12) * 5 - 48;
    },
    rightWidth() {
      return (this.cardWidth / 12) * 7 - 48;
    },
    itemTypes() {
      const { currentLocale, itemTypeList } = this;
      const listByLanguage = itemTypeList.filter((m) => m.type === currentLocale);
      if (listByLanguage.length) {
        const { dictVoList } = listByLanguage[0];
        return dictVoList;
      }
      return [];
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('partManagement', ['addPartOrAnnex', 'getItemTypes']),

    updateUrl(val) {
      this.tabledataobj.partPic = val;
    }, // 更新图片地址
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        tabledataobj,
      } = this;
      const {
        partPic,
        partNumber,
        partName,
        partDescription,
        partType,
        model,
        supplier,
      } = tabledataobj;
      let fileList = [];
      if (this.$refs.fileUpload) {
        if (this.$refs.fileUpload.fileList?.length) {
          fileList = this.$refs.fileUpload.fileList.map((file) => file.fileId);
        }
      } // 封装上传附件列表
      const payload = {
        partPic,
        partNumber,
        partName,
        partDescription,
        partType,
        model,
        supplier,
        fileList,
        module: 'partManagementDetail',
      };
      const result = await this.addPartOrAnnex(payload);
      if (result) {
        this.setAlert({
          show: true,
          type: 'success',
          message: 'successAction',
        });
        this.$emit('getTableList');
        this.dialog = false;
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$nextTick(() => {
          this.tabledataobj = {
            partPic: '',
            partNumber: '',
            productName: '',
            description: '',
            itemTypeCode: '',
            productSpec: '',
            supplier: '',
          };
          if (this.$refs.picUpload) {
            this.$refs.picUpload.clearPic();
          } // 清空上传图片
          if (this.$refs.fileUpload) {
            this.$refs.fileUpload.clear();
          } // 清空上传附件列表
        });
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      await this.getItemTypes();
    },
  },
};
</script>
