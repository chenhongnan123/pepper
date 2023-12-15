<template>
  <div class="pl-4 pr-4 pt-10">
    <div class="d-flex">
      <div :style="`width: ${leftWidth}%;`">
        <machine-bom
          @getBomDetail="bomChange"
        />
      </div>
      <div :style="`width: ${100 - leftWidth}%;`">
        <machine-detail :details="machinebomdetail" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import MachineBom from '../components/lifecycle/MachineBom.vue';
import MachineDetail from '../components/lifecycle/digitalArchives/MachineDetail.vue';

export default {
  data() {
    return {
      leftWidth: 20,
      machinebomdetail: {},
    };
  },
  components: {
    MachineBom,
    MachineDetail,
  },
  computed: {
    ...mapState('digitalArchives', []),
  },
  created() {
  },
  methods: {
    ...mapMutations('helper', ['SET_THREEJSSHOW', 'SET_UNITYSHOW']),
    ...mapActions('digitalArchives', []),
    async bomChange(detail) {
      this.machinebomdetail = detail;
    },
  },
};
</script>
