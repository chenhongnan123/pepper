<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="60%"
    transition="dialog-transition"
  >
    <div class="app-dialog pa-1">
      <v-card class="rounded-lg" style="min-height: 600px;">
        <div
          v-for="i in 5"
          :key="i"
          :class="`rectangle-${i}`"
        ></div>
        <v-card-title primary-title>
          <span>
            {{
              $t('maintenanceTask.knowledge')
            }}
          </span>
          <v-spacer></v-spacer>
          <v-btn icon small @click="dialog = false">
            <v-icon>mdi-close</v-icon>
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
        <v-card-actions class="mt-3 mx-4">
          <v-spacer></v-spacer>
          <v-btn
            outlined
            color="primary"
            small
            class="text-none"
            @click="isFilterPart = !isFilterPart"
            v-if="isFilterPart"
          >
            <v-icon left small>mdi-school-outline</v-icon>
            {{$t('maintenanceTask.showAllExpertise')}}
          </v-btn>
          <v-btn
            outlined
            color="primary"
            small
            class="text-none"
            @click="isFilterPart = !isFilterPart"
            v-else
          >
            <v-icon left small>mdi-school-outline</v-icon>
            {{$t('maintenanceTask.showFilterExpertise')}}
          </v-btn>
        </v-card-actions>
        <v-card-text>
          <v-data-table
            disable-filtering
            disable-pagination
            fixed-header
            :headers="headers"
            :height="400"
            hide-default-footer
            item-key="id"
            :items="expertKnowledges"
            dense
          >
            <!-- eslint-disable-next-line -->
            <template #item.expertiseType="{item}">
              <!-- eslint-disable-next-line -->
              {{ getTypeName(item.expertiseType) }}
            </template>
           <!-- eslint-disable-next-line -->
            <template #item.expertiseNumber="{item}">
              <v-btn
                small
                text
                class="text-none"
                color="primary"
                @click="goDetail(item)"
              >
                {{item.expertiseNumber}}
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
      <knowledge-detail-dialog
        :knowledgeDetailDialog="knowledgeDetailDialog"
        :expertknowledge="expertknowledge"
        @closeDialog="knowledgeDetailDialog = false;expertknowledge = {};"
      />
    </div>
  </v-dialog>
</template>

<script>
import {
  mapActions,
  mapState,
} from 'vuex';
import KnowledgeDetailDialog from './KnowledgeDetailDialog.vue';

export default {
  data() {
    return {
      filterName: '',
      isFilterPart: true,
      expertKnowledges: [],
      knowledgeDetailDialog: false,
      expertknowledge: {},
    };
  },
  props: {
    knowledgeDialog: {
      type: Boolean,
      required: true,
    },
    taskDetail: {
      type: Object,
    },
  },
  components: {
    KnowledgeDetailDialog,
  },
  computed: {
    ...mapState('maintenanceTask', ['expertKnowledgeList', 'expertKnowledgeTypeList']),
    dialog: {
      get() {
        return this.knowledgeDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    iszh() {
      return this.$i18n.locale === 'zhHans';
    },
    headers() {
      return [
        {
          text: this.$t('maintenanceTask.bomName'),
          value: 'partName',
        },
        {
          text: this.$t('maintenanceTask.knowledgeType'),
          value: 'expertiseType',
        },
        {
          text: this.$t('maintenanceTask.knowledgeNumber'),
          value: 'expertiseNumber',
        },
        {
          text: this.$t('maintenanceTask.knowledgeName'),
          value: 'expertiseName',
        },
      ];
    },
  },
  methods: {
    ...mapActions('maintenanceTask', ['getExpertKnowledgeList', 'getExpertKnowledgeTypeList']),
    goDetail(item) {
      this.expertknowledge = item;
      this.knowledgeDetailDialog = true;
    },
    getTypeName(typeCode) {
      const type = this.expertKnowledgeTypeList.find((t) => t.dictValue === typeCode);
      if (type) {
        return type.dictLabel;
      }
      return typeCode || '-';
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$nextTick(() => {
          this.filterName = '';
          this.isFilterPart = true;
        });
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      await this.getExpertKnowledgeTypeList();
      await this.getExpertKnowledgeList();
      this.isFilterPart = true;
      this.expertKnowledges = this.expertKnowledgeList
        .filter((item) => item.bomId === this.taskDetail.maintenanceLocation);
      this.reset();
    },
    isFilterPart(isFilterPart) {
      if (isFilterPart) {
        this.expertKnowledges = this.expertKnowledgeList
          .filter((item) => item.bomId === this.taskDetail.maintenanceLocation);
      } else {
        this.expertKnowledges = this.expertKnowledgeList;
      }
    },
  },
};
</script>
