<template>
  <v-navigation-drawer
    app
    floating
    :color="$vuetify.theme.dark ? 'rgb(46 46 47)' : '#f3f3f3'"
    v-model="drawer"
    :mini-variant="isMini"
    class="rounded-l-0 rounded-xl"
    width="265"
  >
    <v-list class="py-0" dense>
      <v-list-item dense>
        <v-list-item-action v-if="isMini && !$vuetify.breakpoint.mdAndDown">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                icon
                class="mr-auto"
                small
                @click="toggleExpand"
              >
                <v-icon
                  v-text="'mdi-menu-right'"
                  size="36px"
                ></v-icon>
              </v-btn>
            </template>
            <span>{{$t('menu.extend')}}</span>
          </v-tooltip>
        </v-list-item-action>
        <v-list-item-title v-if="!$vuetify.breakpoint.mdAndDown">
          <!-- <img
            :src="require(`@/assets/logo/${logoName}.png`)"
            contain
            :alt="altText"
            :height="logoSize"
          /> -->
          <div class="d-flex align-center">
            <img
              :src="require(`@/assets/imgs/logo-${isDark?'dark':'light'}.png`)"
              contain
              :alt="altText"
              :height="logoSize"
            />
          </div>
        </v-list-item-title>
        <v-list-item-action v-if="!isMini" class="ml-0">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                icon
                class="ml-auto"
                small
                @click="toggleExpand"
              >
                <v-icon
                  v-text="'mdi-menu-left'"
                  size="36px"
                ></v-icon>
              </v-btn>
            </template>
            <span>{{$t('menu.shrink')}}</span>
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>
      <v-list-item dense class="py-0">
        <v-list-item-icon class="mr-3">
          <v-icon
            class="ml-auto"
          >mdi-desktop-classic</v-icon>
        </v-list-item-icon>
        <v-list-item-subtitle>
          {{ `${$t('title')} ${version}` }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
    <v-list v-if="isMini">
      <v-list-item dense>
        <v-list-item-icon class="mr-3" >
          <v-menu
            offset-x
            :close-on-content-click="false"
            :nudge-right="16"
          >
              <template #activator="{ on: menu }">
                <v-tooltip bottom>
                  <template #activator="{ on: tooltip }">
                    <v-icon
                      v-on="{ ...tooltip, ...menu }"
                      color="primary"
                    >mdi-magnify</v-icon>
                  </template>
                  <span>{{$t('menu.jump')}}</span>
                </v-tooltip>
              </template>
              <v-autocomplete
                clearable
                prepend-inner-icon="mdi-magnify"
                dense
                hide-details
                filled
                class="rounded-lg"
                :placeholder="$t('menu.jumpTo')"
                v-model="jumpTo"
                append-icon="mdi-chevron-double-right"
                @click:append="goToJump"
                :items="filterItems"
                item-text="name"
                return-object
                :style="`background-color:${$vuetify.theme.dark ? 'rgb(46 46 47)' : '#f3f3f3'}`"
              >
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{item.menuName}}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
          </v-menu>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
    <v-divider
      v-if="isMini"
    ></v-divider>
    <v-list-item v-if="isMini">
      <v-list-item-icon>
        <v-badge
          bottom
          overlap
          color="primary"
          :content="selectedAppList.length"
          bordered
          :value="selectedAppList.length"
        >
          <v-menu
            offset-x
            :close-on-content-click="false"
            :nudge-right="16"
          >
            <template #activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                >mdi-menu</v-icon>
            </template>
            <v-list class="px-2" nav>
              <v-list-item-group
                color="primary"
                multiple
                no-action
                v-model="selectedAppList"
              >
                <v-list-item
                  v-for="(item, key) in itemList"
                  :key="key"
                  class="my-2"
                  dense
                >
                  <v-list-item-icon class="mx-1">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          v-bind="attrs"
                          v-on="on"
                        >{{item.icon}}</v-icon>
                      </template>
                      <span>{{item.menuName}}</span>
                    </v-tooltip>
                  </v-list-item-icon>
                  <v-list-item-content></v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </v-badge>
      </v-list-item-icon>
    </v-list-item>
    <v-row
      no-gutters
      style="flex-wrap: nowrap;"
      :class="isMini?'pr-0':'pr-1'"
      :style="`height: calc(100% - ${isMini? 210 : 100}px);`"
    >
      <v-col  class="flex-grow-0 flex-shrink-1">
        <v-navigation-drawer
          floating
          mini-variant
          mini-variant-width="56"
          permanent
          :color="$vuetify.theme.dark ? 'rgb(46 46 47)' : '#f3f3f3'"
          v-if="!isMini"
        >
          <v-list-item>
            <v-list-item-icon>
              <v-badge
                bottom
                overlap
                color="primary"
                :content="selectedAppList.length"
                bordered
                :value="selectedAppList.length"
              >
                <v-icon>mdi-menu</v-icon>
              </v-badge>
            </v-list-item-icon>
          </v-list-item>
          <v-divider></v-divider>
          <v-list class="px-2" nav>
            <v-list-item-group
              color="primary"
              multiple
              no-action
              v-model="selectedAppList"
            >
              <v-list-item
                v-for="(item, key) in itemList"
                :key="key"
                class="my-2"
                dense
              >
                <v-list-item-icon>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                      >{{item.icon}}</v-icon>
                    </template>
                    <span>{{item.menuName}}</span>
                  </v-tooltip>
                </v-list-item-icon>
                <v-list-item-content></v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>
      </v-col>
      <v-col :cols="isMini?'12':'10'" :class="isMini?'':'ml-n2'">
        <v-list dense v-if="!isMini">
          <v-list-item>
            <v-list-item-subtitle>
              <v-autocomplete
                clearable
                prepend-inner-icon="mdi-magnify"
                dense
                hide-details
                filled
                class="rounded-lg"
                :placeholder="$t('menu.jumpTo')"
                v-model="jumpTo"
                :items="filterItems"
                item-text="name"
                return-object
              >
                <template #append>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        icon
                        class="ml-auto"
                        small
                        @click="goToJump"
                      >
                        <v-icon
                          size="20px"
                        >mdi-chevron-double-right</v-icon>
                      </v-btn>
                    </template>
                    <span>{{$t('menu.jump')}}</span>
                  </v-tooltip>
                </template>
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.menuName }}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <v-divider
          v-if="isMini"
        ></v-divider>
        <perfect-scrollbar
          :style="`height: calc(100vh - ${
            isMini? 210 + 56 * fixedItemList.length : 160 + 56 * fixedItemList.length
          }px);`"
        >
          <v-list
            nav
            dense
            :expand="true"
          >
            <template v-for="(item, index) in drawerItemsbyGroup">
              <v-list-group
                v-if="item.childMenuVo"
                :key="index"
                :value="item.active"
                no-action
                :prepend-icon="item.icon"
                color="primary"
                :class="!isMini?'menu-group':''"
              >
                <template #prependIcon>
                  <v-menu
                    offset-x
                    :nudge-right="16"
                    v-if="isMini"
                  >
                    <template #activator="{ on: menu, value }">
                      <v-tooltip bottom>
                        <template #activator="{ on: tooltip }">
                          <v-icon
                            v-text="item.icon"
                            v-on="{ ...tooltip, ...menu }"
                            :color="isMini?value?'primary':'rgba(0, 0, 0, 0.54)':''"
                          ></v-icon>
                        </template>
                        <span>{{ item.menuName }}</span>
                      </v-tooltip>
                    </template>
                    <v-list
                      nav
                      dense
                    >
                      <app-list
                        :header="item.menuName"
                        :drawerItems="item.childMenuVo"
                        :isMini="isMini"
                      />
                    </v-list>
                  </v-menu>
                  <v-icon
                    v-else
                  >{{item.icon}}</v-icon>
                </template>
                <template #activator>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ item.menuName }}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
                <app-list
                  :header="item.menuName"
                  :drawerItems="item.childMenuVo"
                  :isMini="isMini"
                />
              </v-list-group>
            </template>
          </v-list>
        </perfect-scrollbar>
        <v-divider v-if="fixedItemList.length"></v-divider>
        <v-list nav dense>
          <v-list-item
            v-for="(item, j) in fixedItemList"
            :key="`${item.component}-child-${j}`"
            :to="{ name: item.component }"
            color="primary"
          >
            <v-list-item-icon>
              <v-icon>{{item.icon}}</v-icon>
            </v-list-item-icon>
            <v-list-item-title
            >{{item.menuName}}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>

<script>
import {
  mapState,
} from 'vuex';
import AppList from './AppList.vue';

export default {
  name: 'PepperDrawer',
  components: {
    AppList,
  },
  props: {
    showDrawer: {
      default: null,
    },
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      expandOnHover: false,
      miniVariant: false,
      jumpTo: null,
      selectedAppList: [],
      activeMenuId: null,
      primaryLogo: {
        name: 'logo',
        size: '26px',
      },
    };
  },
  computed: {
    ...mapState('helper', ['version', 'refreshRouteName', 'isDark']),
    logoName() {
      return this.$vuetify.theme.dark
        ? `${this.primaryLogo.name}-dark`
        : `${this.primaryLogo.name}-dark`;
    },
    iszh() {
      return this.$i18n.locale === 'zhHans';
    },
    logoSize() {
      return this.primaryLogo.size;
    },
    altText() {
      return `${this.primaryLogo.name} logo`;
    },
    isMobile() {
      return this.$vuetify.breakpoint.xsOnly;
    },
    isMini() {
      return this.miniVariant || this.$vuetify.breakpoint.mdAndDown;
    },
    drawer: {
      get() {
        return this.showDrawer;
      },
      set(val) {
        this.$emit('set-drawer', val);
      },
    },
    // 上半部菜单
    itemList() {
      const { items } = this;
      return items.filter((i) => i.visible === '0');
    },
    // 底部菜单
    fixedItemList() {
      const { items } = this;
      return items.filter((i) => i.visible === '1');
    },
    // 左侧多选选中的菜单
    drawerItemsbyGroup() {
      const { selectedAppList, items, activeMenuId } = this;
      const itemList = items.filter((i) => i.visible === '0');
      let menus = [];
      itemList.forEach((item, index) => {
        if (selectedAppList.some((a) => a === index)) {
          const menulist = item.childMenuVo.map((m) => {
            const obj = {
              ...m,
            };
            if (activeMenuId && m.id === activeMenuId) {
              obj.active = true;
            }
            return obj;
          });
          menus = [
            ...menus,
            ...menulist,
          ];
        }
      });
      if (!activeMenuId && menus.length) {
        menus[0].active = true;
      }
      return menus;
    },
    filterItems() {
      const { items } = this;
      let filterItems = [];
      items.forEach((item) => {
        const { childMenuVo } = item;
        if (childMenuVo) {
          childMenuVo.forEach((child) => {
            if (child.childMenuVo) {
              const childmenu = child.childMenuVo.map((c) => {
                const obj = {
                  ...c,
                  name: c.menuName,
                };
                return obj;
              });
              filterItems = [
                ...filterItems,
                ...childmenu,
              ];
            }
          });
        }
      });
      return filterItems.filter((m) => m.menuType === 'C');
    },
    scrollbarHeight() {
      // 64 - height of toolbar
      let totalHeight = 64;
      if (this.adminItems && this.adminItems.length) {
        // 40 - height of one admin item
        // 16 - list padding
        totalHeight += (40 * this.adminItems.length + 16 + 16 + 1);
      }
      return totalHeight;
    },
  },
  created() {
    const selectedAppList = localStorage.getItem('admin_selectedAppList');
    this.selectedAppList = JSON.parse(selectedAppList || '[]');
  },
  watch: {
    items(items) {
      const { refreshRouteName } = this;
      const itemList = items.filter((i) => i.visible === '0');
      for (let i = 0; i < itemList.length; i += 1) {
        const { childMenuVo } = itemList[i];
        if (childMenuVo) {
          childMenuVo.forEach((child) => {
            if (child.childMenuVo && child.childMenuVo
              .some((c) => c.component === refreshRouteName)
            ) {
              this.activeMenuId = child.id;
            }
          });
        }
        if (this.activeMenuId) {
          break;
        }
      }
      if (!this.activeMenuId) {
        if (refreshRouteName !== 'PepperHome') {
          this.activeMenuId = -1;
        }
      }
    },
    selectedAppList(selectedAppList) {
      localStorage.setItem('admin_selectedAppList', JSON.stringify(selectedAppList));
    },
  },
  methods: {
    toggleExpand() {
      this.miniVariant = !this.miniVariant;
    },
    setActiveApp(item) {
      this.setActiveAppId(item.id);
      localStorage.setItem('appId', item.id);
    },
    goToJump() {
      const { jumpTo } = this;
      if (jumpTo) {
        const {
          component,
        } = jumpTo;
        this.$router.push({ name: component });
      }
    },
  },
};
</script>
