<template>
  <div :style="`height: ${height}px;`">
    <div class="blackTabDiv mt-2">
      <v-row
        class="fill-height"
        align-content="center"
        justify="center"
      >
        <v-col :cols="12">
          <div
            class="px-4"
            style="width: 100%;"
          >
            <v-tabs
              color="primary"
              v-model="tabkey"
              show-arrows
              centered
              class="blackTabs"
            >
              <v-tab
                v-for="(item,index) in items"
                :key="index"
              >
                {{ item.name }}
              </v-tab>
            </v-tabs>
          </div>
        </v-col>
      </v-row>
      <v-tabs-items v-model="tabkey">
        <v-tab-item
          v-for="(item,index) in items"
          :key="index"
        >
          <v-row v-if="tabkey === 0">
            <v-col :cols="12" align="center">
              <relate-document
                :height="contentHeight"
                :details="details"
              />
            </v-col>
          </v-row>
          <v-row v-if="tabkey === 1">
            <v-col :cols="12" align="center">
              <relate-task
                :height="contentHeight"
                :details="details"
              />
            </v-col>
          </v-row>
          <v-row v-if="tabkey === 2">
            <v-col :cols="12" align="center">
              <relate-expert-knowledge
                :height="contentHeight"
                :details="details"
              />
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import RelateDocument from './RelateDocument.vue';
import RelateTask from './RelateTask.vue';
import RelateExpertKnowledge from './RelateExpertKnowledge.vue';

export default {
  name: 'MachineRelate',
  data() {
    return {
      clientheight: document.body.clientHeight,
      tabkey: 0,
    };
  },
  props: {
    height: {
      type: Number,
      required: true,
    },
    details: {
      type: Object,
      required: true,
    },
  },
  components: {
    RelateDocument,
    RelateTask,
    RelateExpertKnowledge,
  },
  computed: {
    ...mapState('digitalArchives', ['materialDetail']),
    items() {
      const list = [
        {
          name: this.$t('digitalarchives.document'),
        },
        {
          name: this.$t('digitalarchives.task'),
        },
        {
          name: this.$t('digitalarchives.expertKnowledge'),
        },
      ];
      return list;
    },
    contentHeight() {
      return this.height - 32 - 16;
    },
  },
  watch: {
  },
  methods: {
    ...mapMutations('helper', ['SET_ALERT']),
    ...mapActions('digitalArchives', []),
  },
};
</script>
