<template>
  <div
    class="mt-2"
    :style="`height: ${contentHeight}px;overflow: auto;width: 100%;`"
  >
    <expert-knowledge
      :height="contentHeight"
      :details="details"
    />
  </div>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
} from 'vuex';
import ExpertKnowledge from '../expertKnowledge/ExpertKnowledge.vue';

export default {
  name: 'RelateExpertKnowledge',
  data() {
    return {
      clientheight: document.body.clientHeight,
    };
  },
  components: {
    ExpertKnowledge,
  },
  props: {
    height: {
      type: Number,
    },
    details: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('digitalArchives', ['deviceDetail', 'expertKnowledgeList']),
    contentHeight() {
      return this.height - 10;
    },
  },
  methods: {
    ...mapMutations('helper', ['SET_ALERT']),
    ...mapMutations('digitalArchives', ['setExpertKnowledgeList']),
    ...mapActions('digitalArchives', ['getExpertKnowledgeList']),
  },
};
</script>

<style scoped>
  .numberclass {
    font-size: 12px;
    line-height: normal;
    color: var(--v-info-base);
    text-align: left;
  }

  .nameclass {
    color: var(--v-icon-base);
    font-size: 20px;
    text-align: left;
    line-height: normal;
  }

  .smallnameclass {
    font-size: 12px;
    line-height: normal;
    text-align: left;
    color: var(--v-icon-base);
  }

  .darkbluecard /deep/ .v-card__text{
    padding: 0;
    line-height: 76px;
  }
</style>
