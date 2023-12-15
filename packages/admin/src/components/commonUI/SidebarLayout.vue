<template>
  <v-container fluid>
    <portal to="app-header">
      {{ moudleName }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="() => {
          $emit('handleRefresh');
        }"
      >
        <v-icon
          v-text="'mdi-refresh'"
        />
      </v-btn>
    </portal>
    <v-row
    no-gutters
    >
      <v-col
        cols="2"
      >
        <perfect-scrollbar
        >
          <v-list
            dense
          >
          <v-list-item-group
          v-model="item"
          class="px-2"
          style="height: calc(100vh - 134px);"
          color="primary">
            <template
              v-for="(item, index) in items"
            >
              <v-subheader
                v-if="item.subheader"
                :key="index + 'header'"
                class="text-truncate"
                v-text="$t(`${item.subheader}`)"
              />
              <v-divider
                v-else-if="item.divider"
                :key="index + 'divider'"
                class="my-2"
              />
              <v-list-item
                v-else
                link
                :key="index"
                class="text-center"
                :to="{ name: item.routerName }"
                :title="$t(`${item.title}`)"
              >
                <!-- <v-list-item-icon> -->
                  <!-- <v-icon small v-text="item.icon"></v-icon> -->
                <!-- </v-list-item-icon> -->
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon
                    small
                    v-text="item.icon"
                    class="mr-2"
                    v-if="$vuetify.breakpoint.mdAndUp">
                    </v-icon>
                    <span>{{$t(`${item.title}`)}}</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list-item-group>
          </v-list>
        </perfect-scrollbar>
      </v-col>
      <v-col
        cols="10"
        class="pa-4"
      >
        <div class="text-h5">
          {{$t(`${items[item].title}`)}}
        </div>
        <v-spacer/>
        <v-fade-transition mode="out-in">
          <router-view />
        </v-fade-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'SidebarLayout',
  props: {
    items: {
      type: Array,
      required: true,
    },
    moudleName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      item: 0,
    };
  },
  created() {
    this.$router.push({
      name: this.items[0].routerName,
    });
  },
};
</script>
