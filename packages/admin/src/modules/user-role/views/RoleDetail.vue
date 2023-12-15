<template>
  <v-container fluid>
    <portal to="app-header" v-if="pagePortalMode.roleDetail">
      {{ $t(`modules.${moduleName}`) }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="refresh"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <portal to="page-header">
    </portal>
    <v-row no-gutters align="center" class="mt-n4">
      <v-btn
        class="mb-1 mr-2"
        icon
        small
        @click="goBack()"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          disabled
          :label="`${$t('userRole.table.roleType')}`"
          :value="curRoleType"
          class="px-1"
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          disabled
          :label="`${$t('userRole.table.roleId')}`"
          :value="curRoleNumber"
          class="px-1"
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          disabled
          :label="`${$t('userRole.table.roleName')}`"
          :value="curRoleName"
          class="px-1"
        />
      </v-col>
      <v-col
        cols="12"
        md="2"
      >
        <v-text-field
          disabled
          :label="`${$t('userRole.table.roleDescription')}`"
          :value="curRoleDescription"
          class="px-1"
        />
      </v-col>
    </v-row>
    <div class="d-flex mb-2">
      <v-spacer></v-spacer>
      <v-btn
        small
        outlined
        class="mr-2"
        color="primary"
        @click="handleDeselectAll"
      >
        {{ $t('btn.deselectAll') }}
      </v-btn>
      <v-btn
        small
        outlined
        class="mr-2"
        color="primary"
        @click="handleSelectAll"
      >
        {{ $t('btn.selectAll') }}
      </v-btn>
      <v-btn
        small
        color="primary"
        @click="handleSave"
        v-if="isBtnAccess('userRole')"
      >
        {{ $t('btn.save') }}
      </v-btn>
    </div>
    <v-card class="transparent" flat>
      <v-card-text
        class="px-8 rounded-lg overflow-y-auto grey-thin-border"
        style="height: calc(100vh - 240px);"
      >
        <v-row style="height:100%">
          <v-col
            cols="12"
            md="3"
          >
            <v-treeview
              hoverable
              activatable
              selectable
              v-model="firstTopSelectedMenuList"
              :active.sync="firstTopActiveMenuList"
              selected-color="primary"
              :items="firstTopMenus"
              item-children="childMenuVo"
              item-text="menuName"
              item-key="id"
              :open-all="true"
              open-on-click
              :style="
                `height: calc(100vh - ${firstBottomMenus.length * 48 + 280}px);
                overflow-y: scroll;
                cursor: pointer;`
              "
            >
              <template #prepend="{ item }" >
                 <v-icon>{{item.icon}}</v-icon>
              </template>
            </v-treeview>
            <v-divider class="mb-2"></v-divider>
            <v-treeview
              hoverable
              activatable
              selectable
              v-model="firstBottomSelectedMenuList"
              :active.sync="firstBottomActiveMenuList"
              selected-color="primary"
              :items="firstBottomMenus"
              item-children="childMenuVo"
              item-text="menuName"
              item-key="id"
              :open-all="true"
              open-on-click
            >
              <template #prepend="{ item }" >
                 <v-icon>{{item.icon}}</v-icon>
              </template>
            </v-treeview>
          </v-col>
          <v-col
            cols="12"
            md="8"
          >
            <template v-for="(item, index) in secondMenus">
              <div
                :key="`subtitle-${index}`"
                v-if="item.menuType === 's' || item.menuType === 'S'"
              >
                <v-list-item class="pl-0">
                  <v-list-item-title class="subtitle--text">{{item.menuName}}</v-list-item-title>
                </v-list-item>
                <template  v-if="item.childMenuVo">
                  <v-row
                    v-for="i in Math.ceil(item.childMenuVo.length / 4)"
                    :key="`row-${i}`"
                    class="px-4"
                  >
                    <v-col
                      v-for="(child, j) in item.childMenuVo.slice((i - 1) * 4, (i - 1) * 4 + 4 * i)"
                      :key="`col-${i}-${j}`"
                      cols="12"
                      sm="4"
                      md="4"
                      class="pt-0"
                    >
                      <v-checkbox
                        v-model="secondSelectedMenuList"
                        color="primary"
                        :label="child.menuName"
                        :value="child.id"
                        hide-details
                        class="pb-1"
                        :key="item.id"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </template>
              </div>
              <div
                :key="`nosubtitle-${index}`"
                v-if="item.menuType === 'b' || item.menuType === 'B'"
              >
                <v-checkbox
                  v-model="secondSelectedMenuList"
                  color="primary"
                  :label="item.menuName"
                  :value="item.id"
                  hide-details
                  class="pb-1"
                  :key="item.id"
                ></v-checkbox>
              </div>
            </template>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
} from 'vuex';

export default {
  name: 'roleDetail',
  components: {
  },
  data() {
    return {
      firstTopSelectedMenuList: [],
      firstTopActiveMenuList: [],
      firstBottomSelectedMenuList: [],
      firstBottomActiveMenuList: [],
      secondSelectedMenuList: [],
    };
  },
  computed: {
    ...mapState('helper', [
      'currentLocale',
      'pagePortalMode',
    ]),
    ...mapState('userRole', [
      'curRole',
      'roleMenuList',
      'roleTypeList',
    ]),
    ...mapGetters('user', [
      'isBtnAccess',
    ]),
    moduleName() {
      return this.$route.name;
    },
    // 第一层上方菜单
    firstTopMenus() {
      const menuList = this.getRoleMenuByLanguage();
      return this.getFirstMenuList(menuList.filter((a) => a.visible === '0'));
    },
    // 第一层下方菜单
    firstBottomMenus() {
      const menuList = this.getRoleMenuByLanguage();
      return menuList.filter((a) => a.visible === '1').map((b) => {
        const obj = {
          ...b,
          childMenuVo: null,
        };
        return obj;
      });
    },
    // 第二层菜单
    secondMenus() {
      const menuList = this.getRoleMenuByLanguage();
      const { firstTopActiveMenuList, firstBottomActiveMenuList } = this;
      const idList = [
        ...firstTopActiveMenuList,
        ...firstBottomActiveMenuList,
      ];
      if (idList.length) {
        return this.getSecondMenuList(menuList, idList[0]);
      }
      return [];
    },
    // 第一层上方选中菜单的所有父ID
    firstTopSelectedMenuParentList() {
      const allId = [];
      const { firstTopMenus } = this;
      this.firstTopSelectedMenuList.forEach((id) => {
        allId.push(...this.getAllparentId(firstTopMenus, firstTopMenus, id));
      });
      return this.$getUniqueArray(allId);
    },
    // 第二层选中按钮的所有父子页面ID
    secondSelectedMenuParentList() {
      const allId = [];
      const menuList = this.getRoleMenuByLanguage();
      this.secondSelectedMenuList.forEach((id) => {
        const items = this.getMenuItemById(menuList, id);
        if (items.length) {
          const { parentMenuType } = items[0];
          if (parentMenuType && parentMenuType.toString().toLocaleUpperCase() === 'S') {
            allId.push(items[0].parentId);
          }
        }
      });
      return this.$getUniqueArray(allId);
    },
    curRoleId() {
      return this.$route.params.id || null;
    },
    curRoleType() {
      const { curRole, currentLocale, roleTypeList } = this;
      if (curRole.roleType) {
        const listByLanguage = roleTypeList.filter((m) => m.type === currentLocale);
        if (listByLanguage.length) {
          const { dictVoList } = listByLanguage[0];
          const curroletype = dictVoList.filter((m) => m.dictCode === curRole.roleType);
          if (curroletype.length) {
            return curroletype[0].languageValue;
          }
        }
      }
      return curRole.roleType || '-';
    },
    curRoleName() {
      return this.curRole.roleName || '-';
    },
    curRoleNumber() {
      return this.curRole.roleNumber || '-';
    },
    curRoleDescription() {
      return this.curRole.remark || '-';
    },
  },
  mounted() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  created() {
    // this.getTableList();
  },
  activated() {
    if (this.$route.params.id) {
      this.getRoleDetail(this.$route.params.id);
    }
    this.getTableList();
  },
  beforeDestroy() {
    this.setPageHeader(false);
    // this.setAppHeaderHeight(100);
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
      'setAlert',
    ]),
    ...mapActions('userRole', [
      'getRoleDetail',
      'getRoleMenuList',
      'updateRoleMenu',
    ]),
    ...mapActions('user', [
      'getMenuList',
    ]),
    refresh() {
      this.getTableList();
    },
    goBack() {
      this.$router.push({
        name: 'userRole',
      });
    },
    async getTableList() {
      if (this.$route.params.id) {
        await this.getRoleMenuList(this.$route.params.id);
        // selected初始化
        if (this.roleMenuList.length) {
          const { menuVoList } = this.roleMenuList[0];
          this.firstBottomSelectedMenuList = menuVoList.filter((a) => a.visible === '1' && a.enable).map((b) => b.id);
          this.firstTopSelectedMenuList = this.getEnableMenuId(menuVoList.filter((a) => a.visible === '0'), 'C');
          this.secondSelectedMenuList = this.getEnableMenuId(menuVoList, 'B');
        }
      }
      // console.log('init', this.roleMenuList);
    },
    async handleSave() {
      const {
        firstBottomSelectedMenuList,
        firstTopSelectedMenuList,
        secondSelectedMenuList,
        firstTopSelectedMenuParentList,
        secondSelectedMenuParentList,
        curRoleId,
      } = this;
      const menuId = [
        ...firstBottomSelectedMenuList,
        ...firstTopSelectedMenuList,
        ...secondSelectedMenuList,
        ...firstTopSelectedMenuParentList,
        ...secondSelectedMenuParentList,
      ];
      const payload = {
        menuId,
        roleId: curRoleId,
      };
      const result = await this.updateRoleMenu(payload);
      if (result) {
        this.getTableList();
        this.getMenuList();
      }
    },
    // 全选
    handleSelectAll() {
      const { secondSelectedMenuList, secondMenus } = this;
      const ids = [
        ...secondSelectedMenuList,
      ];
      secondMenus.forEach((item) => {
        if (item.menuType.toString().toLocaleUpperCase() === 'B') {
          ids.push(item.id);
        } else if (item.childMenuVo) {
          item.childMenuVo.forEach((child) => {
            if (child.menuType.toString().toLocaleUpperCase() === 'B') {
              ids.push(child.id);
            }
          });
        }
      });
      this.secondSelectedMenuList = this.$getUniqueArray(ids);
    },
    // 取消全选
    handleDeselectAll() {
      const { secondSelectedMenuList, secondMenus } = this;
      let ids = [
        ...secondSelectedMenuList,
      ];
      secondMenus.forEach((item) => {
        if (item.menuType.toString().toLocaleUpperCase() === 'B') {
          ids = ids.filter((i) => i !== item.id);
        } else if (item.childMenuVo) {
          item.childMenuVo.forEach((child) => {
            if (child.menuType.toString().toLocaleUpperCase() === 'B') {
              ids = ids.filter((i) => i !== child.id);
            }
          });
        }
      });
      this.secondSelectedMenuList = ids;
    },
    getRoleMenuByLanguage() {
      const { currentLocale, roleMenuList } = this;
      const itemsByLanguage = roleMenuList.filter((m) => m.type === currentLocale);
      if (itemsByLanguage.length) {
        const { menuVoList } = itemsByLanguage[0];
        return menuVoList || [];
      }
      return [];
    },
    // 递归获取第一层menu
    getFirstMenuList(menuList) {
      const menus = [];
      menuList.forEach((item) => {
        if (item.menuType === 'm' || item.menuType === 'M') {
          menus.push({
            ...item,
            childMenuVo: this.getFirstMenuList(item.childMenuVo),
          });
        } else if (item.menuType === 'c' || item.menuType === 'C') {
          menus.push({
            ...item,
            childMenuVo: null,
          });
        }
      });
      return menus;
    },
    // 递归获取第二层menu
    getSecondMenuList(menuList, id) {
      const menus = [];
      // console.log(menuList, 'menuList');
      menuList.forEach((item) => {
        // console.log('item.id', item.id);
        // console.log('id', id);
        if (item.childMenuVo && item.id === id) {
          item.childMenuVo.forEach((c) => {
            menus.push({
              ...c,
            });
          });
        } else if (item.childMenuVo) {
          menus.push(...this.getSecondMenuList(item.childMenuVo, id));
        }
      });
      // console.log(menus, 'menus');
      return menus;
    },
    // 递归获取所有parentid
    // list:初始列表 recurrenceList:递归列表
    // 需要在方法外做去重
    getAllparentId(list, recurrenceList, id) {
      const allIdList = [];
      recurrenceList.forEach((item) => {
        if (id === item.id) {
          if (item.parentId !== 0) {
            allIdList.push(item.parentId);
            allIdList.push(...this.getAllparentId(list, list, item.parentId));
          }
        } else if (item.childMenuVo) {
          allIdList.push(...this.getAllparentId(list, item.childMenuVo, id));
        }
      });
      return allIdList;
    },
    // 递归根据菜单类型获取enable的menuId
    getEnableMenuId(list, menuType) {
      const ids = [];
      const UpperCaseType = menuType.toString().toLocaleUpperCase();
      list.forEach((item) => {
        if (item.menuType.toString().toLocaleUpperCase() === UpperCaseType && item.enable) {
          ids.push(item.id);
        } else if (item.childMenuVo) {
          ids.push(...this.getEnableMenuId(item.childMenuVo, menuType));
        }
      });
      return ids;
    },
    // 递归根据menuId和获取对应的menu item
    getMenuItemById(list, id) {
      const items = [];
      list.forEach((item) => {
        if (item.id === id) {
          items.push(item);
        } else if (item.childMenuVo) {
          items.push(...this.getMenuItemById(item.childMenuVo, id));
        }
      });
      return items;
    },
  },
  watch: {
    firstTopActiveMenuList: {
      handler(val) {
        if (val.length) {
          this.firstBottomActiveMenuList = [];
        }
      },
      immediate: false,
    },
    firstBottomActiveMenuList: {
      handler(val) {
        if (val.length) {
          this.firstTopActiveMenuList = [];
        }
      },
      immediate: false,
    },
  },
};
</script>
