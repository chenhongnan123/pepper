<template>
  <!-- 日期单选组件 -->
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    color="var(--v-primary-base)"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        outlined
        v-on="on"
        v-bind="attrs"
        class="text-none"
        height="39px"
      >
        <v-icon left>mdi-calendar-range-outline</v-icon>
        {{ dateValue }}
        <v-icon right>mdi-chevron-down</v-icon>
      </v-btn>
    </template>
    <v-date-picker
      no-title
      scrollable
      :locale="locale"
      :max="today"
      v-model="dateValue"
    >
      <v-spacer></v-spacer>
      <v-btn
        text
        color="primary"
        @click="menu = false"
      >
        {{ $t('btn.cancel') }}
      </v-btn>
      <v-btn
        text
        color="primary"
        @click="selectBeginTime(dateValue)"
      >
      {{ $t('btn.ok') }}
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>
<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
  data: () => ({
    menu: false,
    today: new Date().toISOString().slice(0, 10),
    dateValue: new Date().toISOString().slice(0, 10),
  }),
  props: {
    beginTime: {
      required: true, // Date 或者 时间字符串(2023-12-12)
    },
  },
  computed: {
    ...mapGetters('helper', ['locale']),
  },
  created() {
    this.dateValue = moment(new Date(this.beginTime)).format('yyyy-MM-DD');
  },
  watch: {
    beginTime(val) {
      this.dateValue = moment(new Date(val)).format('yyyy-MM-DD');
    },
  },
  methods: {
    selectBeginTime(val) {
      this.$emit('input', val);
      this.menu = false;
    },
  },
};
</script>
