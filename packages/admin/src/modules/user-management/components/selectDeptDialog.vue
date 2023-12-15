<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'400px'"
  >
    <v-card
      style="overflow: hidden"
    >
      <v-card-title primary-title>
        <span>
          {{ $t('userManagement.dialog.selectDepartment') }}
        </span>
        <v-spacer></v-spacer>
        <v-btn
          icon
          small
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height: 500px;overflow-y: auto;">
        <div>
          <v-text-field
            v-model="searchVal"
            append-icon="mdi-magnify"
            hide-details
            clearable
            :label="$t('userManagement.label.search')"
            @click:clear="getDeptTree"
          ></v-text-field>
        </div>
        <v-treeview
          v-if="openall"
          :open-all="openall"
          class="mt-2 px-4"
          style="height: 480px;overflow-y: scroll;cursor: pointer;"
          dense
          item-key="id"
          item-text="label"
          :active.sync="activefloder"
          activatable
          return-object
          :search="searchVal"
          :items="deptTree"
        >
        </v-treeview>
      </v-card-text>
      <v-card-actions class="mb-2">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          small
          class="text-none"
          @click="handleSave"
        >{{ $t('btn.save') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
} from 'vuex';

export default {
  name: 'selectDeptDialog',
  data() {
    return {
      openall: false,
      activefloder: [], // 选中的部门
      searchVal: '',
    };
  },
  props: {
    selectDeptShow: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapState('userManagement', ['deptTree']),
    dialog: {
      get() {
        return this.selectDeptShow;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('userManagement', ['getDeptTree']),
    async handleSave() {
      if (this.activefloder.length === 0) {
        this.dialog = false;
        return;
      }
      const selectItem = this.activefloder[0];
      this.dialog = false;
      // 将选中的部门信息传给父组件
      this.$emit('setDept', selectItem);
    },
  },
  watch: {
    async dialog(val) {
      if (val) {
        await this.getDeptTree();
        if (this.deptTree?.length) {
          this.openall = true; // 展开所有节点
        }
        this.activefloder = [];
      }
    },
  },
};
</script>
