<template>
  <div>
    <template
      v-for="(item, j) in drawerItemsList"
    >
      <v-list-item
        link
        :key="`${item.name}-child-${j}`"
        target="_blank"
        :href="item.path"
        :title="iszh?item.meta.title:item.meta.titleEn"
        :color="color"
        class="pl-5"
        v-if="item.meta.openMode === '1'"
      >
        <v-list-item-icon v-if="item.meta.icon">
          <v-icon small :color="color">{{`mdi-${item.meta.icon}`}}</v-icon>
        </v-list-item-icon>
        <v-list-item-title
        >{{iszh?item.meta.title:item.meta.titleEn}}</v-list-item-title>
        <v-list-item-icon>
          <v-icon small :color="color">mdi-call-made</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-list-item
        link
        :key="`${item.name}-child-${j}`"
        :to="{ path: item.path }"
        :title="iszh?item.meta.title:item.meta.titleEn"
        :color="color"
        class="pl-5"
        :exact="true"
        v-else
      >
        <v-list-item-icon v-if="item.meta.icon">
          <v-icon small :color="color">{{`mdi-${item.meta.icon}`}}</v-icon>
        </v-list-item-icon>
        <v-list-item-title
        >{{iszh?item.meta.title:item.meta.titleEn}}</v-list-item-title>
      </v-list-item>
    </template>
  </div>
</template>

<script>

export default {
  name: 'AppList',
  props: ['header', 'drawerItems', 'isMini', 'color'],
  methods: {
  },
  computed: {
    iszh() {
      return this.$i18n.locale === 'zhHans';
    },
    drawerItemsList() {
      const items = this.drawerItems.map((item) => {
        const obj = {
          ...item,
        };
        if (item.meta.isFrame === '1' && item.meta.openMode === '1') {
          const url = this.$router.resolve({
            name: item.component,
          });
          obj.component = url.href;
        }
        return obj;
      });
      return items;
    },
  },
};
</script>
