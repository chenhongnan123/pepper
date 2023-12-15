<template>
  <div>{{ typeLabel }}</div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'TypeBtn',
  data() {
    return {
      type: '',
    };
  },
  computed: {
    ...mapState('maintenance', ['maintenanceTypeList']),
    itemType() {
      return this.params.data.itemType;
    },
    typeLabel() {
      const { itemType, maintenanceTypeList } = this;
      // eslint-disable-next-line eqeqeq
      const type = maintenanceTypeList.filter((item) => item.dictValue == itemType);
      return type[0].dictLabel;
    },
  },
};
</script>
