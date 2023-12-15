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
    ...mapState('operationLog', ['operTypeList', 'commonStatusList']),
    field() {
      const { params } = this;
      return params.field;
    },
    // 标签文本
    labelText() {
      const { params: { data } } = this;
      const { field } = this;
      // 状态标签：成功和失败
      if (field === 'status') {
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
      }
      // 操作类型
      if (field === 'businessType') {
        return this.getOperTypeText(data[field]);
      }
      return '';
    },
    // 标签颜色
    labelColor() {
      const { params: { data } } = this;
      const { field } = this;
      if (field === 'status') {
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
      }
      if (field === 'businessType') {
        return this.getOperTypeColor(data[field]);
      }
      return '';
    },
  },
  methods: {
    // 获取操作类型文本
    getOperTypeText(businessType) {
      const { operTypeList } = this;
      if (!operTypeList || !operTypeList.length) {
        return '';
      }
      const list = operTypeList.filter((item) => Number(item.dictValue) === Number(businessType));
      if (list.length) {
        return list[0].dictLabel;
      }
      return '';
    },
    // 获取操作类型标签颜色
    getOperTypeColor(businessType) {
      const { operTypeList } = this;
      if (!operTypeList || !operTypeList.length) {
        return '';
      }
      const list = operTypeList.filter((item) => Number(item.dictValue) === Number(businessType));
      if (list.length) {
        return list[0].listClass;
      }
      return '';
    },
  },
};
</script>
