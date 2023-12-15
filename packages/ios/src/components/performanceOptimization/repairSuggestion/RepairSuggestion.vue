<template>
  <div>
    <check-point
      :height="topHeight"
      style="position: relative; z-index: 2"
    />
    <div class="d-flex">
      <div
        :style="`width: ${leftWidth}%;`"
        class="mt-3"
      >
        <machine-bom @getBomDetail="bomChange" />
      </div>
      <div :style="`width: ${100 - leftWidth}%;`">
        <spare-part-list :details="machinebomdetail" :w="`${100 - leftWidth}`" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import CheckPoint from '../faultDiagnosis/CheckPoint.vue';
import MachineBom from './MachineBom.vue';
import SparePartList from './SparePartList.vue';

export default {
  name: 'RepairSuggestion',
  data() {
    return {
      clientheight: document.body.clientHeight,
      machinebomdetail: null,
      leftWidth: 20,
    };
  },
  components: {
    CheckPoint,
    MachineBom,
    SparePartList,
  },
  created() {
    this.init();
  },
  computed: {
    topHeight() {
      return (this.clientheight - 210) * 0.16;
    },
    iszh() {
      return this.$i18n.locale === 'zhHans';
    },
    routename() {
      return this.$route.name;
    },
  },
  methods: {
    ...mapActions('repairSuggestion', ['getPartTypeList']),
    init() {
      this.getPartTypeList('part_type');
    },
    bomChange(detail) {
      this.machinebomdetail = detail;
    },
  },
};
</script>
