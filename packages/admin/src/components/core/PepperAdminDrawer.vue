<template>
  <v-navigation-drawer
    app
    floating
    :color="$vuetify.theme.dark ? 'rgb(46 46 47)' : '#f9fafc'"
    v-model="drawer"
    :mini-variant="isMini"
    class="rounded-l-0 rounded-xl"
  >
    <v-list
      shaped
      class="py-1"
    >
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
          <img
            :src="require(`@/assets/logo/${logoName}.png`)"
            contain
            :alt="altText"
            :height="logoSize"
          />
        </v-list-item-title>
        <v-list-item-action v-if="!isMini">
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
      <v-list-item dense>
        <v-list-item-icon class="mr-3">
          <v-icon
            v-text="'mdi-account-tie-outline'"
            class="ml-auto"
          ></v-icon>
        </v-list-item-icon>
        <v-list-item-subtitle>
          {{$t('menu.SAP')}}
        </v-list-item-subtitle>
      </v-list-item>
      <v-list-item dense>
        <v-list-item-icon class="mr-3" v-if="isMini">
          <v-menu
            offset-x
            :close-on-content-click="false"
            :nudge-right="16"
          >
              <template #activator="{ on, attrs }">
                <v-icon
                  v-text="'mdi-magnify'"
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                ></v-icon>
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
                :style="`background-color:${$vuetify.theme.dark ? 'rgb(46 46 47)' : '#f9fafc'}`"
              >
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title v-text="$t(`modules.${item.title}`)"></v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
          </v-menu>
        </v-list-item-icon>
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
            append-icon="mdi-chevron-double-right"
            @click:append="goToJump"
            :items="filterItems"
            item-text="name"
            return-object
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title v-text="$t(`modules.${item.title}`)"></v-list-item-title>
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
      :style="`height: calc(100% - ${150}px);`"
    >
      <v-list
        nav
        dense
        :expand="true"
      >
        <template v-for="(item, index) in drawerItemsbyGroup">
          <v-list-group
            v-if="item.children"
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
                    <span>{{$t(`modules.${item.header}`)}}</span>
                  </v-tooltip>
                </template>
                <v-list
                  nav
                  dense
                >
                  <app-list
                    :header="item.header"
                    :drawerItems="item.children"
                    :isMini="isMini"
                  />
                </v-list>
              </v-menu>
            </template>
            <template #activator>
              <v-list-item-content>
                <v-list-item-title v-text="$t(`modules.${item.header}`)">
                </v-list-item-title>
              </v-list-item-content>
            </template>
            <app-list
              :header="item.header"
              :drawerItems="item.children"
              :isMini="isMini"
            />
          </v-list-group>
        </template>
      </v-list>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<script>
import AppList from './AdminAppList.vue';

export default {
  name: 'PepperAdminDrawer',
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
      primaryLogo: {
        name: 'logo',
        size: '17px',
      },
    };
  },
  computed: {
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
    drawerItemsbyGroup() {
      const items = this.items.map((item) => {
        const obj = {
          ...item,
          active: !!item.children,
        };
        return obj;
      });
      return items;
    },
    filterItems() {
      const { items } = this;
      let filterItems = [];
      items.forEach((item) => {
        if (item.children) {
          const childmenu = item.children.map((c) => {
            const obj = {
              ...c,
              name: this.$t(`modules.${c.title}`),
            };
            return obj;
          });
          filterItems = [
            ...filterItems,
            ...childmenu,
          ];
        }
      });
      return filterItems;
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
      const { jumpTo, iszh } = this;
      if (jumpTo) {
        const {
          to,
          title,
          external,
          http,
        } = jumpTo;
        if (to === 'reports') {
          this.$router.push({ name: to, query: { id: title } });
        } else if (external) {
          window.open(`${window.location.host}/${iszh ? `${to}?lang=zhHans` : to}`);
        } else if (http) {
          window.open(`${window.location.host}/${to}`);
        } else {
          this.$router.push({ name: title });
        }
      }
    },
  },
};
</script>
