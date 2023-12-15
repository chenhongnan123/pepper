<template>
  <div>
    <div class="d-flex align-center" :class="isErr ? 'error--text':''">
      <span class="text-h6">
        {{ title || '-' }}
      </span>
      <v-checkbox
        v-model="expand"
        color="primary"
        class="ml-3 mt-0"
        hide-details
        dense
        @change="handleExpand"
      >
        <template #label>
          <span class="text-subtitle-2">
            {{$t('btn.extendOrFold')}}
          </span>
        </template>
      </v-checkbox>
      <v-spacer></v-spacer>
      <v-checkbox
        v-model="selectall"
        color="primary"
        class="mt-0"
        hide-details
        dense
        @change="handleSelectall"
      >
        <template #label>
          <span class="text-subtitle-2">
            {{$t('btn.selectallOrDeselectall')}}
          </span>
        </template>
      </v-checkbox>
      <v-spacer></v-spacer>
      <!-- <v-checkbox
        v-model="treeLeaf"
        color="primary"
        class="mt-0"
        hide-details
        dense
        @change="handleTreeLeaf"
      >
        <template #label>
          <span class="text-subtitle-2">
            {{$t('btn.treeLeaf')}}
          </span>
        </template>
      </v-checkbox> -->
    </div>
    <div
      class="rounded-lg px-5 py-3"
      :class="isErr ? 'error-thin-border':'grey-thin-border'"
      :style="`height: ${height}px;`"
    >
      <v-treeview
        :style="`height: ${height - 30}px;overflow-y: scroll;cursor: pointer;`"
        class="my-1"
        :open-all="openall"
        v-model="selectfloder"
        selectable
        selection-type="leaf"
        selected-color="primary"
        return-object
        dense
        :items="treeList"
        item-children="children"
        :item-key="itemKey"
        :item-text="itemText"
        ref="dataTree"
      >
      </v-treeview>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectableDataTree',
  data() {
    return {
      expand: false,
      selectall: false,
      treeLeaf: false,
      openall: false,
      selectfloder: [],
    };
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    treeList: {
      type: Array,
      required: true,
    },
    itemKey: {
      type: String,
      required: true,
    },
    itemText: {
      type: String,
      required: true,
    },
    isMultiple: {
      type: Boolean,
    },
    isErr: {
      type: Boolean,
    },
  },
  components: {
  },
  methods: {
    handleExpand() {
      const { expand } = this;
      // console.log(this.$refs.dataTree, 'dataTree');
      this.$refs.dataTree.updateAll(expand);
    },
    handleSelectall() {
      const { selectall } = this;
      if (selectall) {
        this.selectfloder = this.getAllDataList(this.treeList);
      } else {
        this.selectfloder = [];
      }
    },
    handleTreeLeaf() {
      console.log('handleTreeLeaf');
      this.selectfloder = [];
      console.log(this.selectfloder, 'this.selectfloder');
      console.log(this.$refs.dataTree, 'this.$refs.dataTree');
      this.$refs.dataTree.updateSelected();
    },
    getAllDataList(list) {
      const dataList = [];
      list.forEach((item) => {
        const { children } = item;
        if (!children) {
          dataList.push(item);
        }
        if (children) {
          dataList.push(...this.getAllDataList(children));
        }
      });
      return dataList;
    },
    // 组件外使用这个方法获取所有选中id
    getSelectedIdList() {
      const { treeList, childIds } = this;
      return this.$getUniqueArray(this.getAllTreeIds(treeList, childIds));
    },
    // 递归获取所有选中id
    getAllTreeIds(treeList, childIds, idList = []) {
      for (let i = 0; i < treeList.length; i += 1) {
        const node = treeList[i];
        if (childIds.includes(node.id)) {
          if (node.parentIds) {
            idList.push(...node.parentIds);
          }
          idList.push(node.id);
        }
        if (node.children && node.children.length > 0) {
          const childs = node.children.map((c) => {
            const obj = {
              ...c,
              parentIds: node.parentIds ? [...node.parentIds, node.id] : [node.id],
            };
            return obj;
          });
          this.getAllTreeIds(childs, childIds, idList);
        }
      }
      return idList;
    },
  },
  computed: {
    childIds() {
      return this.selectfloder.map((item) => item.id);
    },
  },
};
</script>
