<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'800px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            $t('maintenanceTask.dialog.expertise')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false" color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-actions>
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
          {{$t('maintenanceTask.btn.showAllExpertise')}}
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
          {{$t('maintenanceTask.btn.showFilterExpertise')}}
        </v-btn>
      </v-card-actions>
      <v-card-text>
        <v-data-table
          disable-filtering
          disable-pagination
          fixed-header
          :headers="headers"
          :height="300"
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
            <!-- eslint-disable-next-line -->
            <span
              class="primary--text text-decoration-underline"
              style="cursor: pointer;"
              @click="goDetail(item.expertiseId)"
            >{{item.expertiseNumber}}</span>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions class="mt-4">
        <v-spacer></v-spacer>
        <v-btn
          color="warning"
          small
          text
          @click="dialog = false"
        >
          {{$t('btn.cancel')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapState,
  // mapMutations,
  mapActions,
} from 'vuex';

export default {
  name: 'ViewExpertKnowledgeDialog',
  data() {
    return {
      filterName: '',
      isFilterPart: true,
      expertKnowledges: [],
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    taskDetail: {
      type: Object,
    },
    taskPage: {
      type: String,
    },
  },
  components: {
  },
  computed: {
    ...mapState('expertKnowledge', ['expertKnowledgeList', 'expertKnowledgeTypeList']),
    dialog: {
      get() {
        return this.addDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    headers() {
      return [
        {
          text: this.$t('maintenanceTask.table.partName'),
          value: 'partName',
        },
        {
          text: this.$t('expertKnowledge.table.type'),
          value: 'expertiseType',
        },
        {
          text: this.$t('expertKnowledge.table.number'),
          value: 'expertiseNumber',
        },
        {
          text: this.$t('expertKnowledge.table.name'),
          value: 'expertiseName',
        },
      ];
    },
  },
  methods: {
    ...mapActions('expertKnowledge', ['getExpertKnowledgeList', 'getExpertKnowledgeTypeList']),
    goDetail(id) {
      const { taskDetail, taskPage } = this;
      this.$router.push({
        name: 'taskExpertKnowledgeDetail',
        params: {
          id,
          page: 'repairTaskDetail',
          taskId: taskDetail.id,
          taskName: taskDetail.taskName,
          taskPage,
        },
      });
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
