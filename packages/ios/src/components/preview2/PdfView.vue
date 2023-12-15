<template>
  <!-- v-if="dialog === 1" -->
  <v-dialog
    v-model="dialog"
    scrollable
    persistent
    max-width="100%"
    transition="dialog-transition"
  >
    <v-card
      v-if="!filePath"
      color="primary"
      dark
      >
      <v-card-text>
        {{ $t('common.loading') }}
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        />
      </v-card-text>
      <div>
        <v-spacer />
        <v-btn
          style="float: right;"
          color="red"
          text
          class="text-none"
          @click="dialog = false"
        >
          {{ $t('common.close') }}
        </v-btn>
      </div>
    </v-card>
    <v-card v-else>
      <v-card-title primary-title>
        <!-- <span>
          {{
            $t('attachment.pdfPreview')
          }}
        </span> -->
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false" color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <div id="pdfView"></div>
    </v-card>
  </v-dialog>
</template>

<script>

import PDFObject from 'pdfobject';

let timer = null;
export default {
  name: 'PdfView',
  data() {
    return {
      page: '1',
    };
  },
  props: {
    previewDialog: {
      type: Boolean,
      required: true,
    },
    filePath: {
      type: String,
    },
    pageNum: {
      type: String,
    },
  },
  computed: {
    dialog: {
      get() {
        return this.previewDialog;
      },
      set() {
        this.$emit('closeDialog');
        timer = setTimeout(() => {
          this.reset();
        }, 500);
      },
    },
    fileUrl() {
      if (!this.filePath) {
        return false;
      }
      if (process.env.VUE_APP_MODE === 'development') {
        return `http://47.98.238.55/${this.filePath}`;
      }
      return this.filePath;
    },
  },
  beforeDestory() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  },
  methods: {
    reset() {
      const element = document.getElementById('pdfView');
      if (element?.children?.length) {
        element.children[0].remove();
      }
    },
  },
  watch: {
    dialog(dialog) {
      if (!dialog) {
        return;
      }
      // console.log(this.filePath, 'this.filePath');
      if (this.pageNum) {
        this.page = this.pageNum;
      }
      const { page } = this;
      this.$nextTick(() => {
        PDFObject.embed(this.fileUrl, '#pdfView', { page, height: '80rem' });
      });
    },
  },
};
</script>
