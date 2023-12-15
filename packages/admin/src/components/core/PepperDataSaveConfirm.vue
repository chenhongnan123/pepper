<template>
  <v-dialog
    v-model="dialog"
    attach
    persistent
    max-width="800px"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-card-title primary-title>
        <span>
          {{ title }}
        </span>
        <v-spacer />
        <v-btn
          icon
          small
          color="primary"
          @click.native="cancel"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :height="300"
          fixed-header
          dense
          :loading="loading"
          :items="dataList"
          :headers="headers"
          :items-per-page="-1"
          :calculate-widths="false"
          width="100%"
          class="px-5 noborder"
          disable-sort
        >
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-checkbox
          v-if="isLogOut"
          v-model="isPromptAgain"
          :label="$t('dialog.noPromptAgain')"
          hide-details
          dense
          class="mt-0 pt-0"
        />
        <v-spacer />
        <v-btn
          text
          color="warning"
          class="text-none"
          @click.native="cancel"
        >
          {{ $t('helper.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          class="text-none"
          @click.native="agree"
        >
          {{ $t('helper.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'PepperDataSaveConfirm',
  data() {
    return {
      loading: false,
      dialog: false,
      resolve: null,
      reject: null,
      title: null,
      headers: [],
      dataList: [],
      isLogOut: false,
    };
  },
  computed: {
  },
  methods: {
    open(title, headers, datalist) {
      this.dialog = true;
      this.title = title;
      this.headers = headers;
      this.dataList = datalist;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree() {
      this.resolve(true);
      this.dialog = false;
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    },
  },
};
</script>
