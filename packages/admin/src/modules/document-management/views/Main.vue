<template>
  <v-container
    fluid
    class="darkNoBgColor"
  >
    <portal
      to="app-header"
      v-if="pagePortalMode.documentManagement"
    >
      {{ $t(`modules.${moduleName}`) }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="refresh"
      >
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </portal>
    <v-row
      dense
      class="ml-2"
    >
      <v-col cols="2">
        <v-card
          :height="clientHeight - 120"
          elevation="0"
          color="bg"
          class="mr-1"
        >
          <div class="text-h6 px-2 pt-2 d-flex align-center">
            {{ $t('documentManagement.label.folder') }}
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="handleDeleteFolder"
              v-if="
                (selectedItem || selectedItem === 0) &&
                this.folderList.length > 0 &&
                isBtnAccess('system:folder:remove')
              "
            >
              <v-icon color="error"> mdi-delete </v-icon>
            </v-btn>
            <v-btn
              icon
              @click="(isNew = false), (addFolderDialog = true)"
              v-if="
                (selectedItem || selectedItem === 0) &&
                this.folderList.length > 0 &&
                isBtnAccess('system:folder:edit')
              "
            >
              <v-icon color="green"> mdi-pencil </v-icon>
            </v-btn>
            <v-btn
              icon
              @click="(isNew = true), (addFolderDialog = true)"
              v-if="isBtnAccess('system:folder:add')"
            >
              <v-icon color="primary"> mdi-plus-thick </v-icon>
            </v-btn>
          </div>
          <div class="d-flex px-4">
            <v-text-field
              v-model="searchVal"
              append-icon="mdi-magnify"
              hide-details
              clearable
              :label="$t('documentManagement.label.searchfolder')"
            ></v-text-field>
          </div>
          <div
            class="overflow-y-auto"
            :style="`height: ${listHeight}px;`"
          >
            <v-list
              nav
              dense
            >
              <v-list-item-group
                v-model="selectedItem"
                color="primary"
              >
                <v-list-item
                  v-for="(item, i) in filteredFolders"
                  :key="i"
                >
                  <v-tooltip bottom>
                    <template #activator="{ on, attrs }">
                      <v-list-item-icon>
                        <v-icon>mdi-folder</v-icon>
                      </v-list-item-icon>

                      <v-list-item-content
                        v-bind="attrs"
                        v-on="on"
                      >
                        {{ item.folderName }}
                      </v-list-item-content>
                    </template>
                    <div>
                      <span>{{ $t('documentManagement.label.name') }}:
                        {{ item.folderName }}</span>
                      <br />
                      <span>
                        {{ $t('documentManagement.label.number') }}:
                        {{ item.folderNumber }}</span>
                    </div>
                  </v-tooltip>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </div>
        </v-card>
      </v-col>
      <v-col cols="10">
        <v-card
          height="77"
          class="mb-3"
          elevation="0"
          color="bg"
        >
          <div
            class="d-flex align-center px-4"
            style="height: 100%"
          >
            <v-spacer></v-spacer>
            <v-btn
              small
              class="text-none"
              color="primary"
              @click="addAnnexDialog = true"
              v-if="
                (selectedItem || selectedItem === 0) &&
                this.folderList.length > 0 &&
                isBtnAccess('system:documentFile:upload')
              "
            >
              <v-icon
                left
                small
                >mdi-plus</v-icon
              >
              {{ $t('documentManagement.btn.addAttachment') }}
            </v-btn>
          </div>
        </v-card>
        <v-card
          :height="tableHeight"
          class=""
          elevation="0"
          color="bg"
        >
          <v-row
            no-gutters
            class="pa-4"
          >
            <v-col>
              <AttachmentAgGrid
                class="mt-1"
                :attachment-list="relationShipList"
                :height="tableHeight - 20"
                @getTableList="refresh"
                :isAccessDownload="isBtnAccess('system:documentFile:download')"
                :isAccessPreview="isBtnAccess('system:documentFile:preview')"
                :isAccessDelete="isBtnAccess('system:documentFile:remove')"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <add-folder-dialog
      :add-dialog="addFolderDialog"
      :isNew="isNew"
      :selectedFolder="folderList[selectedItem]"
      @closeDialog="addFolderDialog = false"
      @getTableList="init()"
    />
    <add-annex-dialog
      :add-dialog="addAnnexDialog"
      :activefloder="folderList[selectedItem]"
      @closeDialog="addAnnexDialog = false"
      @getTableList="refresh"
    />
  </v-container>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
} from 'vuex';
import AttachmentAgGrid from '@/components/commonUI/attachmentTable/AttachmentAgGrid.vue';
import AddFolderDialog from '../components/AddFolderDialog.vue';
import AddAnnexDialog from '../components/AddAnnexDialog.vue';

export default {
  name: 'documentManagement',
  data() {
    return {
      elementName: 'documentManagement',
      clientHeight: document.body.clientHeight,
      activefloder: [], // 选中的文件夹
      searchVal: '',
      tableHeight: document.body.clientHeight - 210,
      listHeight: document.body.clientHeight - 220,
      isNew: true,
      addFolderDialog: false,
      addAnnexDialog: false,
      folderId: null,
      selectedItem: 0,
    };
  },
  components: {
    AttachmentAgGrid,
    AddFolderDialog,
    AddAnnexDialog,
  },
  activated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  deactivated() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  created() {
    this.init();
  },
  methods: {
    ...mapMutations('helper', ['setPageHeader', 'setAppHeaderHeight', 'setAlert']),
    ...mapMutations('documentManagement', ['setRelationShipList']),
    ...mapActions('documentManagement', ['getFolderList', 'getRelationShipList', 'deleteFolder']),
    async init() {
      await this.getFolderList(); // 获取文件夹列表
      const folderId = this.folderList[0]?.folderId;
      // 获取附件列表
      if (folderId) {
        this.getRelationShipList({
          module: 'folder',
          outsideId: folderId,
        });
      }
    },
    async refresh() {
      const { selectedItem } = this;
      const { folderId } = this.folderList[selectedItem];
      // if (selectedItem) {
      this.getRelationShipList({
        module: 'folder',
        outsideId: folderId,
      });
      // }
    },
    async handleDeleteFolder() {
      if (
        await this.$root.$confirm.open(
          this.$t('dialog.deleterecord'),
          this.$t('dialog.deleterecordconfirm'),
        )
      ) {
        const { folderId } = this.folderList[this.selectedItem];
        const result = await this.deleteFolder(folderId);
        if (result) {
          this.init();
        }
      }
    },
  },
  computed: {
    ...mapState('documentManagement', ['folderList', 'relationShipList']),
    ...mapState('helper', ['pagePortalMode']),
    ...mapGetters('user', ['isBtnAccess']),
    moduleName() {
      return this.$route.name;
    },
    filteredFolders() {
      if (!this?.searchVal) {
        return this.folderList;
      }
      // 不区分大小写
      return this.folderList.filter(
        (item) => item?.folderName?.toLowerCase()?.indexOf(this?.searchVal?.toLowerCase()) > -1,
      );
    },
  },
  watch: {
    selectedItem: {
      handler(newVal) {
        if (newVal >= 0) {
          const { folderId } = this.folderList[newVal];
          this.getRelationShipList({
            module: 'folder',
            outsideId: folderId,
          });
        } else {
          this.setRelationShipList([]);
        }
      },
      deep: true,
      // immediate: true,
    },
  },
};
</script>
<style scoped>
.v-btn--icon.v-size--default {
  width: 28px;
  font-weight: normal;
}
::v-deep() .v-list-item__icon:first-child {
  margin-right: 20px;
}
</style>
