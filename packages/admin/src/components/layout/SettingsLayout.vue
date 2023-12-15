<template>
  <v-container
    fluid
    style="height:100%"
  >
    <!-- <template v-if="!$vuetify.breakpoint.smAndDown"> -->
    <template>
      <portal to="page-header">
      </portal>
      <v-row>
        <v-col
          cols="3"
          md="3"
          xl="2"
        >
         <v-card
            :height="tableHeight"
            class="px-4 pt-4"
            elevation="0"
            color="bg"
          >
            <perfect-scrollbar>
              <v-list
                dense
                nav
                :disabled="disableList"
                class="pa-0 transparent"
                style="max-height: calc(100vh - 104px)"
              >
                <template v-for="(item, index) in items">
                  <v-subheader
                    :key="index"
                    v-if="item.header"
                    class="text-uppercase"
                    v-text="$t(`${item.header}`)"
                  ></v-subheader>
                  <v-divider
                    :key="index"
                    v-else-if="item.divider"
                    class="my-2"
                  ></v-divider>
                  <v-list-item
                    link
                    v-else
                    :key="index"
                    color="primary"
                    :to="{ name: item.routerName, params: item.params }"
                  >
                    <v-list-item-icon class="mr-2">
                      <v-icon>{{item.icon}}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title v-text="$t(`${item.title}`)"></v-list-item-title>
                  </v-list-item>
                </template>
              </v-list>
            </perfect-scrollbar>
          </v-card>
        </v-col>
        <v-col cols="9" md="9" xl="10">
          <v-card
            height="77"
            class="mb-3"
            elevation="0"
            color="bg"
          >
            <div class="d-flex align-center px-4" style="height:100%">
              {{ $t(`${selectedTitle}`) }}
              <portal-target name="settings-header-left"></portal-target>
              <v-spacer></v-spacer>
              <portal-target name="settings-header"></portal-target>
            </div>
          </v-card>
          <v-card
            :height="tableHeight - 77 - 12"
            class="pa-4"
            elevation="0"
            color="bg"
          >
            <v-fade-transition mode="out-in">
              <router-view :key="$route.fullPath" />
            </v-fade-transition>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <!-- 暂时不考虑小屏时的情况 -->
    <!-- <template v-else>
      <portal to="app-header" v-if="id">
        {{ $t(`${selectedTitle}`) }}
        <portal-target name="settings-header" slim />
      </portal>
      <portal to="app-header" v-else>
        {{ headerTitle }}
      </portal>
      <portal to="page-header">
      </portal>
      <v-row no-gutters>
        <v-col cols="12" v-if="showList">
          <slot name="settingsCard"></slot>
          <v-list class="pa-0 transparent">
            <template v-for="(item, index) in items">
              <v-subheader
                :key="index"
                v-if="item.header"
                class="text-uppercase"
                v-text="$t(`${item.header}`)"
              ></v-subheader>
              <v-divider
                :key="index"
                v-else-if="item.divider"
              ></v-divider>
              <v-list-item
                link
                v-else
                :key="index"
                color="primary"
                :to="{ params: { id: item.to } }"
              >
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-title v-text="$t(`${item.title}`)"></v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-col>
        <v-col cols="12" v-else>
          <v-card
            flat
            class="transparent"
          >
            <v-card-text>
              <v-fade-transition mode="out-in">
                <slot />
              </v-fade-transition>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template> -->
  </v-container>
</template>

<script>
export default {
  name: 'SettingsLayout',
  props: {
    items: {
      type: Array,
      required: true,
    },
    disableList: {
      type: Boolean,
      default: false,
    },
    isBorder: {
      type: Boolean,
      default: false,
    },
    isGoBack: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      routes: [],
      // moduleName: '',
      tableHeight: document.body.clientHeight - 133,
    };
  },
  // 路由重定向需要在每次进入页面时执行，不能只在created中执行一次
  // 否则会导致缓存页面无法再次重定向到指定页面
  activated() {
    this.redirect();
  },
  computed: {
    // showList() {
    //   return this.id === undefined;
    // },
    selectedTitle() {
      let title = '';
      const item = this.routes.find((r) => r.routerName === this.$route.name);
      if (item) {
        ({ title } = item);
      }
      return title;
    },
    // moduleName() {
    //   return this.$route.name;
    // },
  },
  watch: {
    // eslint-disable-next-line
    '$vuetify.breakpoint.name'() {
      this.redirect();
    },
  },
  methods: {
    redirect() {
      this.routes = this.items.filter((item) => item.routerName);
      const { rootRouterName } = this.$route.meta;
      if (!rootRouterName) {
        this.$router.push({
          name: this.routes[0].routerName,
          params: this.routes[0].params,
        });
      }
      // 暂时不考虑小屏时的情况
      // if (this.id === undefined && !this.$vuetify.breakpoint.smAndDown) {
      //   if (this.items && this.items.length) {
      //     this.$router.push({ params: { id: to[0] } });
      //   }
      // } else if (this.id && !this.$vuetify.breakpoint.smAndDown) {
      //   const validId = to.includes(this.id);
      //   if (!validId) {
      //     const invalidPath = this.$route.fullPath;
      //     this.$router.push({ name: '404', params: { 0: invalidPath } });
      //   }
      // }
    },
    goBack() {
      this.$emit('goBack');
    },
  },
};
</script>
