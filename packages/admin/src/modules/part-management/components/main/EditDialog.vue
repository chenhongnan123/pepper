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
      <v-card-title primary-title>
        <span>
          {{ $t('partManagement.label.editPart') }}
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
        <v-form
          ref="form"
          lazy-validation
        >
          <pic-upload
            ref="picUpload"
            :url="tabledataobj.partPic"
            @updateUrl="updateUrl"
            :width="`${cardWidth - 48}px`"
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
            :counter="50"
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
            :rules="rules.limit50"
            :counter="50"
          ></v-text-field>
          <v-text-field
            class="mt-3"
            dense
            clearable
            :label="`${$t('partManagement.label.supplier')}`"
            v-model="tabledataobj.supplier"
            :rules="rules.over500"
            counter="500"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions class="mb-2">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          small
          class="text-none"
          @click="handleSave"
        >
          {{$t('btn.save')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
} from 'vuex';
import PicUpload from '@/components/commonUI/PicUpload.vue';

export default {
  name: 'editDialog',
  data() {
    return {
      cardWidth: 400,
      cardHeight: 450,
      tips: this.$t('partManagement.label.acceptTip'),
      tabledataobj: {
        partNumber: '',
        partName: '',
        partDescription: '',
        partType: '',
        model: '',
        supplier: '',
        partId: '',
      },
    };
  },
  components: {
    PicUpload,
  },
  props: {
    editDialog: {
      type: Boolean,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
    selectedtablelist: {
      type: Array,
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
        return this.editDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
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
    ...mapActions('partManagement', ['editPart', 'getItemTypes']),
    updateUrl(val) {
      this.tabledataobj.partPic = val;
    }, // 更新图片地址
    async getItemList() {
      await this.getItemTypes();
    },
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        tabledataobj,
      } = this;
      const {
        partId,
        partPic,
        partNumber,
        partName,
        partDescription,
        partType,
        model,
        supplier,
      } = tabledataobj;
      const payload = {
        partId,
        partPic,
        partNumber,
        partName,
        partDescription,
        partType,
        model,
        supplier,
      };
      const result = await this.editPart(payload);
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
            partId: '',
            partNumber: '',
            partName: '',
            partDescription: '',
            partType: '',
            model: '',
            supplier: '',
          };
          if (this.$refs.picUpload) {
            this.$refs.picUpload.clearPic();
          } // 清空上传图片
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
      if (this.selectedtablelist.length > 0) {
        const {
          partId,
          partPic,
          partNumber,
          partName,
          partDescription,
          partType,
          model,
          supplier,
          itemCategory,
        } = this.selectedtablelist[0]; // 只支持单条编辑
        this.$nextTick(async () => {
          this.tabledataobj = {
            partId,
            partPic,
            partNumber,
            partName,
            partDescription,
            partType: String(partType),
            model,
            supplier,
            itemCategory,
          };
        });
      }
    },
  },
};
</script>
