<template>
  <div id="pepperMultiPage" style="width: 100%;">
    <v-tabs
      v-model="currentpage"
      hide-slider
      center-active
      show-arrows
      @change="tabChange"
      background-color="transparent"
      color="subtitle"
    >
      <v-tab
        v-for="(item, index) in tablist"
        :key="`tab${index}`"
      >
      <v-icon
        size="medium"
        class="mr-1"
      >{{ `mdi-${getPageIcon(item.routename)}` }}</v-icon>
      {{ getPageTitle(item.routename) }}
      <!-- 仅剩一个页签时不允许关闭 -->
      <v-icon
        size="medium"
        class="ml-1"
        v-if="tablist.length > 1 && currentpage === index"
        @click="closeTab(item)"
      >mdi-close-circle</v-icon>
      </v-tab>
    </v-tabs>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'PepperMultiPage',
  data() {
    return {
      currentpage: 0,
    };
  },
  components: {
  },
  watch: {
    $route: {
      handler(route) {
        const pagelist = this.multiPageList.concat();
        const rootname = route.meta.rootRouterName;
        // 设置选中的页签，根据路由名称或者父路由名称匹配
        this.currentpage = pagelist.findIndex((item) => item.routename === route.name
          || item.routename === rootname);
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    ...mapState('common', ['multiPageList', 'excludePageList']),
    ...mapState('helper', ['currentLocale', 'pagePortalMode']),
    ...mapState('user', ['menuList']),
    tablist() {
      return this.multiPageList;
    },
    menuTreeList() {
      // const { currentLocale, menuList } = this;
      // const itemsByLanguage = menuList.filter((m) => m.type === currentLocale);
      // if (itemsByLanguage.length) {
      //   const { menuVoList } = itemsByLanguage[0];
      //   return menuVoList || [];
      // }
      // return [];
      return this.menuList;
    },
    iszh() {
      return this.$i18n.locale === 'zhHans';
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapMutations('common', ['setMultiPageList', 'setExcludePageList']),
    getMenuDataByRouteName(list, name) {
      for (let i = 0; i < list.length; i += 1) {
        if (list[i].component === name) {
          return {
            title: list[i].meta.title,
            titleEn: list[i].meta.titleEn,
            icon: list[i].meta.icon,
          };
        }
        if (list[i].children && list[i].children.length) {
          const obj = this.getMenuDataByRouteName(list[i].children, name);
          if (obj) {
            return obj;
          }
        }
      }
      return null;
    },
    getPageTitle(routename) {
      if (routename === 'user') {
        return this.$t('modules.user');
      }
      if (routename.includes('reportsManagement')) {
        return this.$t('modules.reportsManagement');
      }
      const pageData = this.getMenuDataByRouteName(this.menuTreeList, routename);
      // console.log(this.menuTreeList, 'this.menuTreeList');
      // console.log(pageData, 'pageData');
      const title = this.iszh ? pageData?.title : pageData?.titleEn;
      return title || routename;
    },
    getPageIcon(routename) {
      if (routename === 'user') {
        return 'mdi-account';
      }
      const pageData = this.getMenuDataByRouteName(this.menuTreeList, routename);
      return pageData?.icon || '';
    },
    // 页签变化监听事件
    tabChange(index) {
      if (index || index === 0) {
        const { routename, path } = this.tablist[index];
        const rootname = this.$route.meta.rootRouterName;
        const currentname = this.$route.name;
        if (routename !== rootname && routename !== currentname) {
          this.$router.push({
            path,
            params: this.$route.params,
          }); // 使用path跳转，保留子路由配置
        }
      }
    },
    // 关闭页签点击事件
    closeTab(item) {
      const tabindex = this.multiPageList.findIndex((it) => it.routename === item.routename);
      // 先更新活跃列表，后更改当前页签
      const list = this.multiPageList.filter((it) => it.routename !== item.routename);
      this.setMultiPageList(list);
      // 关闭当前页签则当前页变更为第一个页签
      if (tabindex === this.currentpage) {
        this.currentpage = 0;
        // 手动触发页签变化监听函数
        this.tabChange(this.currentpage);
      }
    },
  },
};
</script>

<style scoped>
  #pepperMultiPage /deep/ .v-tabs-bar {
    height: 32px;
  }

  #pepperMultiPage /deep/ .v-tab {
    clip-path: polygon( 8% 0%, 92% 0%, 100% 100%, 0% 100%);
    border-radius: 0px;
    margin-left: 0px;
    margin-right: 0px;
  }

  #pepperMultiPage /deep/ .v-tab--active {
    background-color: var(--v-tag1-base);
  }

  #pepperMultiPage /deep/ .v-tab--active.v-tab:not(:focus)::before {
    opacity: 0;
  }

  #pepperMultiPage /deep/ .v-tab:not(.v-tab--active) {
    background-color: var(--v-tag2-base);
  }
</style>
