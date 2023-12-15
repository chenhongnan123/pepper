<template>
  <div
    class="custom-card"
    :height="height"
  >
    <v-card
      class="my-4"
      :height="height"
    >
      <v-card-title>
        {{ $t('partManagement.label.attachment') }}
        <v-spacer></v-spacer>
        <v-btn
          v-if="isBtnAccess('system:partFile:upload')"
          color="primary"
          small
          dense
          class="mr-2"
          @click="addDialog = true"
        >
          <v-icon small>mdi-plus</v-icon>
          {{ $t('btn.add') }}
        </v-btn>
      </v-card-title>
      <v-card-text
        :style="`overflow: auto;height: ${contentheight}px;`"
      >
        <attachment-table
          :height="contentheight"
          :attachmentList="attachmentList"
          @getTableList="refresh"
          :isAccessDownload="isBtnAccess('system:partFile:download')"
          :isAccessPreview="isBtnAccess('system:partFile:preview')"
          :isAccessDelete="isBtnAccess('system:partFile:remove')"
        />
      </v-card-text>
    </v-card>
    <add-dialog
      :addDialog="addDialog"
      @closeDialog="addDialog = false"
      @refresh="refresh"
    />
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
} from 'vuex';
import AttachmentTable from '@/components/commonUI/attachmentTable/AttachmentTable.vue';
import AddDialog from './AddDialog.vue';

export default {
  name: 'RelateDocument',
  data() {
    return {
      clientheight: document.body.clientHeight,
      document: [],
      documentList: [],
      addDialog: false,
    };
  },
  components: {
    AttachmentTable,
    AddDialog,
  },
  props: {
    height: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters('user', ['isBtnAccess']),
    ...mapState('partManagement', [
      'partAnnexInfo',
    ]),
    id() {
      return this.$route.params.id;
    },
    attachmentList() {
      return this.partAnnexInfo.filerelationShipList || [];
    },
    contentheight() {
      return this.height - 48 - 8;
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    refresh() {
      this.$emit('refresh');
    },
  },
};
</script>
<style lang="scss" scoped>
  .custom-card {
    ::v-deep .v-card__title {
      padding: 8px 16px 8px 16px;
    }
    ::v-deep .v-card__text {
      padding: 0px 16px 0px 16px;
    }
  }
</style>
