<template>
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
        {{ $t('helper.loading') }}
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
          {{ $t('btn.close') }}
        </v-btn>
      </div>
    </v-card>
    <v-card v-else>
      <v-card-title primary-title>
        <span>
          {{
            $t('attachment.pdfPreview')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false" color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <span>{{`${currentPage}/${pageCount}`}}</span>
        <v-spacer></v-spacer>
      </v-card-actions>
      <v-card-text style="height:80%" v-show="pageCount">
        <div class="d-flex align-center justify-center" style="height:100%">
          <v-btn icon color="primary" @click.stop="prePage" large>
            <v-icon>mdi-arrow-left-drop-circle-outline</v-icon>
          </v-btn>
          <div style="width:90%;height:100%;" class="overflow-y-auto">
            <pdf
              :src="src"
              :page="currentPage"
              @num-pages="pageCount=$event"
              @page-loaded="currentPage=$event"
              @loaded="loadPdfHandler"
            ></pdf>
          </div>
          <v-btn icon color="primary" @click.stop="nextPage" large>
            <v-icon>mdi-arrow-right-drop-circle-outline</v-icon>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

// import PDFObject from 'pdfobject';
import pdf from 'vue-pdf';

let timer = null;
export default {
  name: 'PdfView',
  data() {
    return {
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      pdfh5: null,
      src: '',
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
  components: {
    pdf,
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
  },
  beforeDestroy() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  },
  methods: {
    reset() {
      // const element = document.getElementById('pdfView');
      // if (element.children.length) {
      //   element.children[0].remove();
      // }
    },
    loadPdfHandler() {
      this.currentPage = this.pageNum || 1; // 加载的时候先加载第一页
    },
    // 切换上一页
    prePage() {
      let p = this.currentPage;
      p = p > 1 ? p - 1 : this.pageCount;
      this.currentPage = p;
    },
    // 切换下一页
    nextPage() {
      let p = this.currentPage;
      p = p < this.pageCount ? p + 1 : 1;
      this.currentPage = p;
    },
  },
  watch: {
    dialog(dialog) {
      if (!dialog) {
        return;
      }
      // this.src = pdf.createLoadingTask('http://bms.kojet.com.cn:8091/MesTest/RuhApi_prod/Upload/uploadfile/c260fc56-5aaf-42ab-a6f7-eed0a901e515.pdf');
      this.src = pdf.createLoadingTask(this.filePath);
    },
  },
};
</script>
