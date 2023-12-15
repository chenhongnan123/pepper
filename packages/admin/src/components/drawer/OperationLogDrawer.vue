<template>
  <v-navigation-drawer
    v-model="drawerShow"
    app
    temporary
    right
    width="500px"
    hide-overlay
  >
    <v-card
      :style="`height:${clientheight}px;overflow-y: hidden;`"
    >
      <v-card-title>
        <div>
          {{ $t('operationLog.module.operationLogDetail') }}
        </div>
      </v-card-title>
      <v-card-text
        :style="`height:${height}px;overflow-y: auto;`"
        class="customListGroup"
      >
        <json-viewer
          :value="recordObj"
          :expand-depth=5
          boxed
          sort
          :expanded="true"
          :preview-mode="false"
        >
        </json-viewer>
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import JsonViewer from 'vue-json-viewer';

export default {
  name: 'OperationLogDrawer',
  data() {
    return {
      clientheight: document.body.clientHeight,
      // host: window.location.host,
    };
  },
  deactivated() {
    this.setOperationLogDrawerShow(false);
    this.setOperationLogDetail({});
  },
  components: {
    JsonViewer,
  },
  methods: {
    ...mapMutations('operationLog', [
      'setOperationLogDrawerShow',
      'setOperationLogDetail',
    ]),
  },
  computed: {
    ...mapState('operationLog', ['operationLogDrawerShow', 'operationLogDetail']),
    drawerShow: {
      get() {
        return this.operationLogDrawerShow;
      },
      set(val) {
        this.setOperationLogDrawerShow(val);
      },
    },
    height() {
      return this.clientheight - 40;
    },
    recordObj() {
      if (this.operationLogDetail?.content) {
        return JSON.parse(this.operationLogDetail.content);
      }
      return {};
    },
  },
};
</script>

<style lang="scss" scoped>
  .customListGroup {
    ::v-deep .v-list-item {
      min-height: 26px;
    }
    ::v-deep .v-list-item__icon {
      margin: 0;
    }
    ::v-deep .v-list-item__content {
      padding: 0;
    }
  }
</style>
