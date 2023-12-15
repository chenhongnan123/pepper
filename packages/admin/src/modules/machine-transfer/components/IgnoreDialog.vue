<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    width="600"
    transition="dialog-transition"
  >
    <v-card height="302">
      <v-card-title primary-title>
        <span>
          {{$t('machineTransfer.dialog.ignorerecord')}}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text style="height: 300px;">
        <v-data-table
          class="ma-4"
          fixed-header
          dense
          :items="items"
          :headers="headers"
          height="200"
          hide-default-footer
          item-key="no"
          :calculate-widths="false"
          width="100%"
        >
          <!-- eslint-disable-next-line -->
          <template #item.no="{index}">
            {{index + 1}}
          </template>
      </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          small
          class="text-none"
          @click="dialog = false"
        >
          {{$t('btn.ok')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  props: {
    ignoreDialog: {
      type: Boolean,
      required: true,
    },
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {
    dialog: {
      get() {
        return this.ignoreDialog;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
  },
  methods: {
  },
};
</script>
