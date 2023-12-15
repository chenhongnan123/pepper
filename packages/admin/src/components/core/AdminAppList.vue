<template>
  <div>
    <template
      v-for="(item, j) in drawerItems"
    >
      <v-list-item
        exact
        :key="`${header}-child-${j}`"
        v-if="item.to === 'reports'"
        :title="$t(`modules.${item.title}`)"
        :to="{ name: item.to, query: { id: item.title } }"
        color="primary"
        class="pl-5"
      >
        <v-list-item-icon>
          <v-icon v-text="item.icon" small></v-icon>
        </v-list-item-icon>
        <v-list-item-title
          v-text="$t(`modules.${item.title}`)"
        ></v-list-item-title>
      </v-list-item>
      <v-list-item
        link
        :key="`${header}-child-${j}`"
        v-else-if="item.external"
        target="_blank"
        :href="iszh ? `${item.to}?lang=zhHans` : item.to"
        :title="
          item.to.toLowerCase().includes('custom')
            ? item.description
            : $t(`modules.${item.title}`)
        "
        color="primary"
        class="pl-5"
      >
        <v-list-item-icon>
          <v-icon v-text="item.icon" small></v-icon>
        </v-list-item-icon>
        <v-list-item-title
          v-text="
            item.to.toLowerCase().includes('custom')
              ? item.description
              : $t(`modules.${item.title}`)
          "
        ></v-list-item-title>
        <v-list-item-action v-if="item.external">
          <v-icon small class="mb-1">mdi-open-in-new</v-icon>
        </v-list-item-action>
      </v-list-item>
      <v-list-item
        link
        :key="`${item.header}-child-${j}`"
        v-else-if="item.http"
        target="_blank"
        :href="item.to"
        :title="item.description"
        color="primary"
        class="pl-5"
      >
        <v-list-item-icon>
          <v-icon v-text="item.icon" small></v-icon>
        </v-list-item-icon>
        <v-list-item-title v-text="item.description"></v-list-item-title>
        <v-list-item-action>
          <v-icon small class="mb-1">mdi-open-in-new</v-icon>
        </v-list-item-action>
      </v-list-item>
      <v-list-item
        link
        v-else
        :key="`${item.header}-child-${j}`"
        :to="{ name: item.title }"
        :title="$t(`modules.${item.title}`)"
        color="primary"
        class="pl-5"
      >
        <v-list-item-icon>
          <v-icon v-text="item.icon" small></v-icon>
        </v-list-item-icon>
        <v-list-item-title
          v-text="$t(`modules.${item.title}`)"
        ></v-list-item-title>
      </v-list-item>
    </template>
  </div>
</template>

<script>

export default {
  name: 'AppList',
  props: ['header', 'drawerItems', 'isMini'],
  methods: {
  },
  computed: {
    iszh() {
      return this.$i18n.locale === 'zhHans';
    },
    drawerItemsbyGroup() {
      const items = this.drawerItems.map((item) => {
        const obj = {
          ...item,
          active: !!item.children,
        };
        return obj;
      });
      return items;
    },
  },
};
</script>
