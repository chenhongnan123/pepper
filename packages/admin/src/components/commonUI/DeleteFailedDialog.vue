<!-- 删除失败弹窗，返回的code是`201`，代表有数据没有删除，对没有删除的数据弹窗表格展示删除失败的条目 -->
<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'800px'"
    :max-height="'600px'"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title class="headline lighten-2">
        {{ $t('dialog.deleterecordfailed') }}
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="deleteFailedList"
          :items-per-page="-1"
          hide-default-footer
          class="elevation-0"
        >
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="dialog = false">
          {{ $t('btn.ok') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'DeleteFailedDialog',
  data() {
    return {
    };
  },
  props: {
    isShowDialog: {
      type: Boolean,
      required: true,
    },
    deleteFailedList: {
      type: Array,
      required: true,
    },
  },
  computed: {
    dialog: {
      get() {
        return this.isShowDialog;
      },
      set() {
        this.$emit('getTableList');
        this.$emit('closeDialog');
      },
    },
    headers() {
      return [
        {
          text: this.$t('dialog.name'),
          value: 'name',
        },
        {
          text: this.$t('dialog.number'),
          value: 'number',
        },
        {
          text: this.$t('dialog.reason'),
          value: 'reason',
        },
      ];
    },
  },
  methods: {
  },
};
</script>
