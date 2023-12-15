<template>
  <div>
    <v-container
      class="py-0 px-5 ma-0"
      fluid
      style="height: calc(100vh - 155px);"
    >
      <div class="mt-3">
        <v-text-field
          outlined
          solo
          filled
          rounded
          class="blueinput"
          prepend-inner-icon="mdi-magnify"
          v-model="filterText"
        ></v-text-field>
      </div>

      <v-row>
        <v-col>
          <v-btn-toggle
            filled
            mandatory
            color="primary"
          >
            <v-btn large @click="handleClickAppviewBtn">
              <v-icon>mdi-apps</v-icon>
            </v-btn>
            <v-btn large @click="handleClickListviewBtn">
              <v-icon>mdi-reorder-horizontal</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-col>

        <v-col>
          <div>
            <v-select
              solo
              filled
              rounded
              outlined
              full-width
              class="blueinput"
              :items="folderList"
              item-text="folderName"
              item-value="id"
              return-object
              v-model="selectedFolder"
            ></v-select>
        </div>
        </v-col>
      </v-row>

      <!-- card view -->
      <div class="d-flex flex-wrap justify-start align-start" v-if="showType === 'card'"
        style="overflow-y: scroll;"
        :style="`height: ${clientheight - 340}px`"
        >
        <v-card
            v-for="(file, index) in fileListFiltered"
            :key="index"
            style="
              cursor: pointer;
              border: 1px solid #9c9c9c;
              min-width: 185px;
              overflow-y: auto;
            "
            class="ma-2 art elevation-4"
            height="30%" width="19%"
            @dblclick.stop="handleView(file)"
          >
            <v-card-title
              primary-title
              class="pa-3"
            >
              <v-icon
                color="#0094FFFF"
                x-large
                :style="{ filter: `drop-shadow( 1px 1px 1px #0094FFFF)` }"
              >
                {{ getMdiFileIcon(file?.fileExtension) }}
              </v-icon>
              <v-spacer />
              <v-chip style="max-width: 60px;"
                small class="text-truncate"
                color="secondary"
              >
                {{ file.fileExtension }}
              </v-chip>
            </v-card-title>
            <v-card-text>
              <v-row class="ma-0">
                <span style="width: 90%;"
                  class="text-h6 font-weight-black text-truncate"
                  :style="{ color: '#0094FFFF' }"
                >
                  {{file.fileName}}
                </span>
                <v-spacer />
              </v-row>
              <v-row
                class="text-subtitle-2 ma-0"
                style="align-items: center;"
              >
                <span style="width: 50%;">
                  {{
                    file.createTime
                      ? file.createTime
                      : ''
                  }}
                </span>
                <v-spacer />
                <v-btn
                  text
                  class="no-uppercase"
                  @click="handleView(file)"
                >
                  <v-icon color="green">
                    mdi-eye
                  </v-icon>
                  <span>
                    {{ $t('sop.preview') }}
                  </span>
                </v-btn>
                <!-- <v-btn
                  small
                  text
                  plain
                  class="text-decoration-underline px-0"
                >
                  Download
                </v-btn> -->
                <!-- <v-btn
                  text
                  small
                >
                  <v-icon
                    color="red"
                  >
                    mdi-delete
                  </v-icon>
                </v-btn> -->
              </v-row>
            </v-card-text>
        </v-card>
      </div>

      <!-- list view -->
      <div v-if="showType === 'list'">
        <!-- :height="clientheight - 180" -->
        <!-- show-select -->
        <!-- v-model="selectFileList" -->
          <v-data-table
            fixed-header
            dense
            :items="fileListFiltered"
            :headers="headers"
            :items-per-page="-1"
            item-key="_id"
            :calculate-widths="false"
            width="100%"
            class="mx-5 noborder"
            hide-default-footer
            :height="clientheight - 350"
            >
            <!-- <template #[`body.prepend`]>
              <tr>
                <td />
                <td />
              </tr>
            </template> -->
            <!-- <template #[`body.append`]>
                <td />
                hxsaxsk
                <td />
            </template> -->
            <template #[`item.preview`]="{ item }">
              <v-btn
                icon
                @click="handleView(item)"
              >
                <v-icon
                small
                x-large
                :style="{ filter: `drop-shadow( 1px 2px 2px ${item.color})` }"
                >
                mdi-eye
              </v-icon>
            </v-btn>
            </template>
            <!-- <template #[`item.no`]="{ index }">
              <span>{{ `${index + 1}` }}</span>
            </template> -->
            <!-- <template #[`item.name`]="{ item }">
              <v-icon
                small
                class="mr-3"
                :color="item.color"
                x-large
                :style="{ filter: `drop-shadow( 1px 2px 2px ${item.color})` }"
              >
                mdi-file-document
              </v-icon>
              <span>{{ `${item.name}` }}</span>
            </template>
            <template #[`item.description`]="{ item }">
              <span>{{ iszh ? item.description_cn : item.description_en }}</span>
            </template>
            <template #[`item.modifiedby`]="{ item }">
              {{ item.modifiedby ? item.modifiedby : '' }}
            </template>
            <template #[`item.editedtime`]="{ item }">
              {{ item.editedtime ? format(Number(item.editedtime), 'yyyy-MM-dd HH:mm:ss') : '' }}
            </template>
            <template #[`item.createdby`]="{ item }">
              {{ item.createdby ? item.createdby : '' }}
            </template>
            <template #[`item.createdtime`]="{ item }">
              {{ item.createdtime ? format(Number(item.createdtime), 'yyyy-MM-dd HH:mm:ss') : '' }}
            </template>
            <template v-slot:[`item.active`]="{ item }">
              <v-simple-checkbox
                :v-model="(item.active === 1)"
                disabled
              ></v-simple-checkbox>
            </template> -->
          </v-data-table>
        </div>
      <ImageView
        :previewDialog="isShowImageView"
        :filePath="imageFilePath"
        @closeDialog="isShowImageView = false,imageFilePath = ''"
      />
      <VideoView
        :previewDialog="isShowVideoView"
        :filePath="videoFilePath"
        @closeDialog="isShowVideoView = false,videoFilePath = ''"
      />
      <PdfView
        :previewDialog="isShowPdfView"
        :filePath="pdfFilePath"
        :pageNum="pdfPageNum"
        @closeDialog="isShowPdfView = false,pdfFilePath = ''"
      />
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import ImageView from '../components/preview2/ImageView.vue';
import VideoView from '../components/preview2/VideoView.vue';
import PdfView from '../components/preview2/PdfView.vue';

export default {
  name: 'SopView',
  components: {
    ImageView,
    VideoView,
    PdfView,
  },
  data() {
    return {
      clientheight: document.body.clientHeight,
      filterText: '',
      selectedFolder: null,
      showType: 'card',
      isShowImageView: false,
      isShowPdfView: false,
      isShowVideoView: false,
      imageFilePath: '',
      pdfFilePath: '',
      pdfPageNum: '',
      videoFilePath: '',
    };
  },
  computed: {
    ...mapState('sop', ['folderList', 'fileList']),
    headers() {
      return [
        {
          text: 'NO.',
          value: 'no',
        },
        {
          text: this.$t('sop.name'),
          value: 'fileName',
          sortable: true,
        },
        {
          text: this.$t('sop.extension'),
          value: 'fileExtension',
          sortable: true,
        },
        {
          text: this.$t('sop.createdby'),
          value: 'createBy',
          sortable: true,
        },
        {
          text: this.$t('sop.createdtimestamp'),
          value: 'createTime',
          sortable: true,
        },
        {
          text: this.$t('sop.preview'),
          value: 'preview',
        },
      ];
    },
    fileListFiltered() {
      if (this.filterText) {
        // eslint-disable-next-line
        return this.fileList.filter((item) => {
          return String(item.createTime).toUpperCase().indexOf(this.filterText.toUpperCase()) >= 0
            || String(item.createBy).toUpperCase().indexOf(this.filterText.toUpperCase()) >= 0
            || String(item.fileExtension).toUpperCase().indexOf(this.filterText.toUpperCase()) >= 0
            || String(item.fileName).toUpperCase().indexOf(this.filterText.toUpperCase()) >= 0
            || String(item.no).toUpperCase().indexOf(this.filterText.toUpperCase()) >= 0;
        });
      }
      return this.fileList.filter((item) => item);
    },
  },
  watch: {
    selectedFolder: {
      async handler(newVal) {
        if (newVal.folderId) {
          await this.getFilesByFolderId(newVal.folderId);
        }
      },
    },
  },
  async created() {
    await this.GET_FOLDERLIST();
    if (this.folderList.length > 0) {
      const [fristFolder] = this.folderList;
      this.selectedFolder = fristFolder;
    }
  },
  methods: {
    ...mapMutations('sop', [
      'setPreviewType',
      'setPreviewData',
    ]),
    ...mapActions('sop', ['GET_FOLDERLIST', 'getFilesByFolderId']),
    handleClickAppviewBtn() {
      this.showType = 'card';
    },
    handleClickListviewBtn() {
      this.showType = 'list';
    },
    async handleView(file) {
      // console.log('handleView, file:', file);
      switch (file.fileExtension.toLowerCase()) {
        case 'pdf':
        case '.pdf':
          this.pdfFilePath = encodeURI(file.filePath);
          // this.pdfFilePath = `http://47.98.238.55${encodeURI(file.filePath)}`;
          // this.pdfPageNum= '';
          this.isShowPdfView = true;
          break;
        case 'img':
        case 'png':
        case 'jpg':
        case 'jpeg':
        case '.img':
        case '.png':
        case '.jpg':
        case '.jpeg':
        {
          this.imageFilePath = encodeURI(file.filePath);
          // this.imageFilePath = `http://47.98.238.55${encodeURI(file.filePath)}`;
          this.isShowImageView = true;
          break;
        }
        case 'avi':
        case 'mp4':
        case 'mov':
        case '.avi':
        case '.mp4':
        case '.mov':
        {
          this.videoFilePath = encodeURI(file.filePath);
          // this.videoFilePath = `http://47.98.238.55${encodeURI(file.filePath)}`;
          this.isShowVideoView = true;
          break;
        }
        default:
        {
          console.log('无法预览类型', file.fileExtension);
          break;
        }
      }
    },
    getMdiFileIcon(fileExtension) {
      // console.log(fileExtension, 'fileExtension');
      if (fileExtension?.toUpperCase()?.includes('JPG')
        || fileExtension?.toUpperCase()?.includes('JPEG')
        || fileExtension?.toUpperCase()?.includes('PNG')) {
        return 'mdi-image';
      }
      if (fileExtension?.toUpperCase()?.includes('MP4')
        || fileExtension?.toUpperCase()?.includes('MOV')
        || fileExtension?.toUpperCase()?.includes('AVI')) {
        return 'mdi-video';
      }
      return 'mdi-file';
    },
  },
};
</script>

<style>
.v-text-field--outlined {
  border-color: rgb(94, 255, 255) !important;
}
.btn {
  text-transform: unset !important;
}
.no-uppercase {
  text-transform: unset !important;
}
</style>
