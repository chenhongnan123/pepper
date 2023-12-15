<template>
  <div >
    <v-chip
      label
      class="rounded mt-n1"
      :color="labelColor"
      text-color="white"
      small
    >
      {{ labelText }}
    </v-chip>
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

export default {
  name: 'labelChip',
  computed: {
    ...mapState('loginLog', ['commonStatusList']),
    field() {
      const { params } = this;
      return params.field;
    },
    // 标签文本
    labelText() {
      const { params: { data } } = this;
      const { field } = this;
      // 状态标签：成功和失败
      const { commonStatusList } = this;
      if (!commonStatusList || !commonStatusList.length) {
        return '';
      }
      // eslint-disable-next-line
      const status = commonStatusList.find((item) => Number(item.dictValue) === Number(data[field]));
      if (status) {
        return status.dictLabel;
      }
      return '';
    },
    // 标签颜色
    labelColor() {
      const { params: { data } } = this;
      const { field } = this;
      const { commonStatusList } = this;
      if (!commonStatusList || !commonStatusList.length) {
        return '';
      }
      // eslint-disable-next-line
      const status = commonStatusList.find((item) => Number(item.dictValue) === Number(data[field]));
      if (status) {
        return status.listClass;
      }
      return '';
    },
  },
  methods: {
  },
};
</script>
