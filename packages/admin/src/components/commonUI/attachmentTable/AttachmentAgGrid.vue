<template>
  <div>
    <base-grid
      ref="attachmentGrid"
      :elementName="elementName"
      :restoreColumn="true"
      :options="options"
    />
  </div>
</template>

<script>
import BaseGrid from '@/components/aggrid/BaseGrid.vue';
import AttachmentActionMenu from './AttachmentActionMenu.vue';

let timer = null;
export default {
  name: 'AttachmentTable',
  data() {
    return {
      elementName: 'attachmentTable',
      options: {
        headers: [
          {
            field: 'no',
            headerName: 'No.',
            filter: 'agTextColumnFilter',
            index: 0,
            // eslint-disable-next-line
            valueGetter: (params) => params.node?.rowIndex + 1,
          },
          {
            field: 'fileName',
            headerName: 'attachment.name',
            filter: 'agTextColumnFilter',
            index: 1,
          },
          {
            field: 'fileExtension',
            headerName: 'attachment.filetype',
            filter: 'agTextColumnFilter',
            index: 2,
          },
          {
            field: 'createBy',
            headerName: 'attachment.uploadby',
            filter: 'agTextColumnFilter',
            index: 3,
          },
          {
            field: 'createTime',
            headerName: 'attachment.uploadtime',
            filter: 'agTextColumnFilter',
            index: 4,
          },
          {
            field: 'action',
            headerName: 'attachment.action',
            index: 5,
            cellRendererSelector: () => ({
              component: 'AttachmentActionMenu',
              params: {
                that: this,
                // isAccessDownload: this.isAccessDownload,
                // isAccessPreview: this.isAccessPreview,
                // isAccessDelete: this.isAccessDelete,
              },
            }),
          },
        ],
        rowData: [],
        sideBar: {
          hiddenByDefault: true,
        },
        pagination: false,
        height: 100,
      },
    };
  },
  props: {
    height: {
      type: Number,
    },
    attachmentList: {
      type: Array,
      required: true,
    },
    isAccessDownload: {
      type: Boolean,
    },
    isAccessPreview: {
      type: Boolean,
    },
    isAccessDelete: {
      type: Boolean,
    },
  },
  methods: {
  },
  components: {
    BaseGrid,
    AttachmentActionMenu,
  },
  computed: {
  },
  watch: {
    height: {
      handler(val) {
        this.options.height = val;
      },
      immediate: true,
    },
    attachmentList: {
      handler(val) {
        const list = val.map((item, index) => {
          const obj = {
            ...item,
            no: index + 1,
          };
          return obj;
        });
        timer = setTimeout(() => {
          this.options.rowData = list;
        }, 500);
      },
      immediate: true,
    },
  },
  beforeDestroy() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  },
};
</script>
