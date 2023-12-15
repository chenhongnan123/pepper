<template>
  <div>
    <h1>DateTimeRangePicker 带时间的日期选择器 <i>demo</i></h1>
    <attachment-table
      :height="400"
      :attachmentList="attachmentList"
      :isAccessDownload="true"
      :isAccessPreview="true"
      :isAccessDelete="false"
    />
    <div>navigator.userAgent: {{navigator}}</div>
    <div>navigator: {{platform}}</div>
    <div>navigator.platform: {{agentType}}</div>
  </div>
</template>

<script>
import AttachmentTable from '@/components/commonUI/attachmentTable/AttachmentTable.vue';

export default {
  name: 'HaHa',
  components: {
    AttachmentTable,
  },
  data() {
    return {
      attachmentList: [
        {
          fileName: '111',
          fileExtension: '.pdf',
          uploadPath: './example5.pdf',
        },
        {
          fileName: '999',
          fileExtension: '.pdf',
          uploadPath: './example6.pdf',
        },
        {
          fileName: '30',
          fileExtension: '.pdf',
          uploadPath: './example7.pdf',
        },
      ],
    };
  },
  watch: {
  },
  methods: {
  },
  computed: {
    navigator() {
      return navigator.userAgent;
    },
    platform() {
      return navigator.platform;
    },
    agentType() {
      const { userAgent } = navigator;
      // android端
      const isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1;
      // ios端
      const isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      if (isAndroid) {
        return 'android';
      }
      if (isiOS) {
        return 'ios';
      }
      return 'pc';
    },
  },
};
</script>
