<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :close-on-click="false"
    :nudge-right="0"
    transition="scale-transition"
    offset-y
    ref="menu"
    max-width="290px"
    color="#9e9e9e"
    class="v-menu"
  >
    <template #activator="{ on, attrs }">
      <v-btn outlined v-on="on" v-bind="attrs" class="text-none" height="39px">
        <v-icon  left>mdi-calendar-range-outline</v-icon>
        {{ dateRangeText }}
        <v-icon  right>mdi-chevron-down</v-icon>
      </v-btn>
    </template>
    <v-date-picker range :locale="locale" :max="today" v-model="dates" no-title scrollable>
      <v-spacer></v-spacer>
      <v-btn
        text
        class="text-none"
        min-height="39px"
        :disabled="dates.length != 2"
        @click="saveDateRange"
      >{{ $t('btn.ok') }}</v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'DateRangePicker',
  data() {
    return {
      today: new Date().toISOString().substr(0, 10),
      dates: [new Date().toISOString().substr(0, 10), new Date().toISOString().substr(0, 10)],
      menu: false,
    };
  },
  props: {
    currentDates: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapGetters('helper', ['locale']),
    dateRangeText() {
      if (!this.dates || this.dates.length !== 2) {
        return this.$t('btn.selectDateRange');
      }
      return this.dates.join(` ${this.$t('$vuetify.datePicker.to')} `);
    },
    // dates: {
    //   get() {
    //     return this.currentDates;
    //   },
    //   set(val) {
    //     this.dates = val;
    //   },
    // },
  },
  created() {
    this.dates = this.currentDates;
  },
  watch: {
    currentDates(val) {
      this.dates = val;
    },
  },
  methods: {
    saveDateRange() {
      if (this.dates && this.dates.length === 2) {
        let [start, end] = this.dates;
        const starttimestamp = new Date(start).getTime();
        const endtimestamp = new Date(end).getTime();
        let returndates = [starttimestamp, endtimestamp];
        if (endtimestamp < starttimestamp) {
          const temp = start;
          start = end;
          end = temp;
          this.dates = [start, end];
          returndates = [endtimestamp, starttimestamp];
        }
        this.$emit('getDateRange', returndates);
      }
      this.$refs.menu.save(this.dates);
    },
  },
};
</script>

<style scoped>
    .v-menu {
        height: 39px;
    }
</style>
