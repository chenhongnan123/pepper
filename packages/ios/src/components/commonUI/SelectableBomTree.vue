<template>
  <div>
    <div
      class="d-flex align-center"
      :class="isErr ? 'error--text':''"
    >
      <span class="text-h6">
        {{ title || '-' }}
      </span>
    </div>
    <div
      class="rounded-lg px-5 py-3"
      :class="isErr ? 'error-thin-border':'blue-thin-border'"
      :style="`height: ${height}px;`"
    >
      <v-text-field
        v-model="searchVal"
        append-icon="mdi-magnify"
        hide-details
        clearable
        :label="$t('maintenanceTask.searchPart')"
        @click:clear="reset"
        dense
      ></v-text-field>
      <v-treeview
        :style="`height: ${height - 60}px;overflow-y: scroll;cursor: pointer;`"
        class="my-1"
        :open-all="openall"
        v-model="selectfloder"
        :active.sync="selectfloder"
        activatable
        :multiple-active="isMultiple"
        selectable
        selection-type="independent"
        selected-color="primary"
        return-object
        :search="searchVal"
        dense
        :items="bomList"
        :item-disabled="alarmDisabledKey || disabledKey"
        :item-children="itemChildren"
        :item-key="itemKey"
        :item-text="itemText"
        @update:active="handleActive"
      >
      </v-treeview>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectableBomTree',
  data() {
    return {
      showMaintenancePart: false,
      showMainPart: false,
      searchVal: '',
      openall: true,
      selectfloder: [],
      disabledKey: '',
    };
  },
  props: {
    title: {
      type: String,
    },
    height: {
      type: Number,
      required: true,
    },
    bomList: {
      type: Array,
      required: true,
    },
    isMultiple: {
      type: Boolean,
    },
    isErr: {
      type: Boolean,
    },
    // 子节点
    itemChildren: {
      default: 'childNodes',
    },
    itemKey: {
      default: 'componentSequenceId',
    },
    itemText: {
      default: 'productName',
    },
    // 控制 目录的disabled
    alarmDisabledKey: {
      type: String,
    },
  },
  components: {
  },
  methods: {
    reset() {
      this.openall = true;
    },
    handleActive(item) {
      console.log(item);
      this.$emit('handleActive', item);
    },
  },
};
</script>
