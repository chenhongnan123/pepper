<template>
  <v-container fluid>
    <portal to="app-header">
      {{ $t(`modules.${moduleName}`) }}
      <v-btn
        icon
        small
        class="ml-2 mb-1"
        @click="handleRefresh"
      >
        <v-icon
          v-text="'mdi-refresh'"
        />
      </v-btn>
    </portal>
    <portal to="page-header">
    </portal>
    <v-row
      class="text-center"
      no-gutters
    >
      <v-col>
        <div class="d-flex">
          <span class="text-h6 font-weight-regular">{{$t('factoryCompany.createCompany')}}</span>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            small
            :disabled="companySaveDisabled"
            @click="handleCompanySave"
          >
            {{$t('btn.save')}}
          </v-btn>
        </div>
         <v-form
          ref="companyForm"
          lazy-validation
          class="d-flex pl-4"
        >
          <v-text-field
            clearable
            :label="`${$t('factoryCompany.companyName')}`"
            class="mx-3"
            :rules="rules.name"
            v-model="companyName"
            @change="companySaveDisabled = false"
          >
          </v-text-field>
          <v-autocomplete
            clearable
            :label="`${$t('factoryCompany.industry')}`"
            class="mx-3"
            v-model="industry"
            :items="industryList"
            @change="companySaveDisabled = false"
            item-text="languageValue"
            item-value="dictCode"
          >
          </v-autocomplete>
          <v-text-field
            clearable
            :label="`${$t('factoryCompany.logo')}`"
            class="mx-3"
            @click="clickImportBtn"
          >
            <template #append>
              <img
                :src="logoPath"
                contain
                alt=""
                height="15px"
              />
            </template>
          </v-text-field>
        </v-form>
      </v-col>
    </v-row>
    <v-row
      class="text-center mt-2"
      no-gutters
    >
      <v-col>
        <div class="d-flex">
          <span class="text-h6 font-weight-regular">{{$t('factoryCompany.createFactory')}}</span>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            small
            @click="addFactoryDialog = true"
            :disabled="!companyId"
          >
            {{$t('factoryCompany.addFactory')}}
          </v-btn>
        </div>
        <v-data-table
          hide-default-header
          :height="clientheight - 360"
          :items="factoryList"
          :headers="headers"
          :items-per-page="15"
          class="ml-3 pt-2 factory-expansion-table"
          group-by="id"
          single-expand
        >
          <!-- eslint-disable-next-line -->
          <template #group.header="{group, groupBy, isOpen, toggle, items}">
            <td :colspan="headers.length-1" class="text-start text-body-1 py-4">
              <span class="mr-2">{{`${items[0].name}`}}</span>
              <span
                :class="`fi fi-${items[0].countryCode}`"
                :title="$t(`factoryCompany.countrys.${items[0].countryCode}`)"
              ></span>
            </td>
            <td class="text-end">
              <v-btn
                icon
                small
                color="primary"
                class="mr-1"
                @click="selectedFactory=items[0];addFactoryDialog = true"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                color="error"
                @click="handleDelete(items[0])"
                v-if="false"
              >
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
              |
              <v-btn
                icon
                small
                color="primary"
                @click="toggle"
              >
                <v-icon>{{isOpen? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon>
              </v-btn>
            </td>
          </template>
          <!-- eslint-disable-next-line -->
          <template #item="{ item }">
          <tr>
            <td :colspan="headers.length" class="text-start py-4 px-5">
              <v-row class="align-end">
                <v-col cols="12" sm="3">
                  <div class="subtitle--text text-subtitle-1">
                    {{ $t('factoryCompany.address') }}
                  </div>
                  <div class="text-body-2 pt-2">
                    {{
                      `${
                        $t('factoryCompany.country')
                      }: ${
                        item.countryCode
                        ? $t(`factoryCompany.countrys.${item.countryCode}`)
                        : '-'
                      }`
                    }}
                  </div>
                </v-col>
                <v-col cols="12" sm="3">
                  <div>
                    {{'&ensp;'}}
                  </div>
                  <div class="text-body-2  pt-2">
                    {{ `${$t('factoryCompany.address')}: ${item.address || '-'}` }}
                  </div>
                </v-col>
                <v-col cols="12" sm="3" >
                  <div>
                    {{'&ensp;'}}
                  </div>
                  <div class="text-body-2  pt-2">
                    {{ `${$t('factoryCompany.postalCode')}: ${item.postcode || '-'}` }}
                  </div>
                </v-col>
              </v-row>
              <v-row class="align-end">
                <v-col cols="12" sm="3">
                  <div class="subtitle--text text-subtitle-1">
                    {{ $t('factoryCompany.contacts') }}
                  </div>
                  <div class="text-body-2  pt-2">
                    {{ `${$t('factoryCompany.lastName')}: ${item.contactLastName || '-'}` }}
                  </div>
                </v-col>
                <v-col cols="12" sm="3">
                  <div>
                    {{'&ensp;'}}
                  </div>
                  <div class="text-body-2  pt-2">
                    {{ `${$t('factoryCompany.firstName')}: ${item.contactFirstName || '-'}` }}
                  </div>
                </v-col>
                <v-col cols="12" sm="3">
                  <div>
                    {{'&ensp;'}}
                  </div>
                  <div class="text-body-2  pt-2">
                    {{ `${$t('factoryCompany.email')}: ${item.contactEmail || '-'}` }}
                  </div>
                </v-col>
                <v-col cols="12" sm="3">
                  <div>
                    {{'&ensp;'}}
                  </div>
                  <div class="text-body-2  pt-2">
                    {{ `${$t('factoryCompany.telephone')}: ${item.contactPhone || '-'}` }}
                  </div>
                </v-col>
              </v-row>
              <v-row class="align-end">
                <v-col cols="12" sm="12">
                  <div class="subtitle--text text-subtitle-1">
                    {{ $t('factoryCompany.remarks') }}
                  </div>
                  <div class="text-body-2  pt-2">
                    {{ item.remark || '-' }}
                  </div>
                </v-col>
              </v-row>
            </td>
          </tr>
        </template>
        </v-data-table>
      </v-col>
    </v-row>
    <!-- eslint-disable-next-line -->
    <input
      type="file"
      accept="image/png, image/jpeg"
      ref="uploader"
      class="d-none"
      id="uploadFiles"
      @change="onFilesChanged"
    >
    <add-factory-dialog
      :addDialog="addFactoryDialog"
      :companyId="companyId"
      :selectedFactory="selectedFactory"
      :rules="rules"
      @closeDialog="selectedFactory = {};addFactoryDialog = false"
      @getTableList="init"
    />
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import AddFactoryDialog from './components/addFactoryDialog.vue';

export default {
  name: 'factoryAndCompany',
  data() {
    return {
      clientheight: document.body.clientHeight,
      companySaveDisabled: true,
      addFactoryDialog: false,
      selectedFactory: {},
      companyId: null,
      companyName: '',
      industry: null,
      logoPath: '',
      headers: [
        {
          text: '',
          value: 'id',
          groupable: true,
        },
        {
          text: '',
          value: 'detail',
          groupable: false,
        },
      ],
    };
  },
  components: {
    AddFactoryDialog,
  },
  mounted() {
    this.setPageHeader(false);
    this.setAppHeaderHeight(100);
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    this.setPageHeader(false);
    // this.setAppHeaderHeight(100);
  },
  methods: {
    ...mapMutations('helper', [
      'setPageHeader',
      'setAppHeaderHeight',
    ]),
    ...mapActions('factoryCompany', [
      'getCompany',
      'saveOrUpdateCompany',
      'getFactoryList',
      'getIndustryList',
    ]),
    async init() {
      this.companySaveDisabled = true;
      // const result = await this.$systemPost('company/getCompanyList', {}, 'mock');
      // console.log(result);
      await this.getIndustryList();
      const companyId = await this.getCompany();
      if (companyId) {
        this.companyId = companyId;
        const { name, professionId, trademarkUrl } = this.company;
        this.companyName = name;
        this.industry = professionId;
        this.logoPath = trademarkUrl;
        this.getFactoryList({ companyId });
      }
    },
    async handleCompanySave() {
      const {
        companyId,
        companyName,
        industry,
        logoPath,
      } = this;
      const payload = {
        id: companyId,
        name: companyName,
        professionId: industry,
        trademarkUrl: logoPath,
      };
      const result = await this.saveOrUpdateCompany(payload);
      if (result) {
        this.init();
      }
    },
    clickImportBtn() {
      this.$refs.uploader.click();
    },
    async onFilesChanged(event) {
      // console.log(event, 'event');
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      const extension = file.name.split('.').slice(-1).pop();
      // console.log(extension, 'extension');
      const filename = file.name;
      if (!'PNG,JPEG,JPG'.includes(extension.toUpperCase())) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'FILE_TYPE_ERROR',
        });
        return;
      }
      if (file.size > 104857600) {
        this.setAlert({
          show: true,
          type: 'error',
          message: 'FILE_SIZE_ERROR',
        });
        return;
      }
      // console.log(filename, 'filename');
      const payload = new FormData();
      payload.append('file', file);
      const result = await this.$systemFileUpload(payload, filename, extension);
      if (result) {
        this.logoPath = result.data;
        this.companySaveDisabled = false;
      }
      document.getElementById('uploadFiles').value = null;
    },
    handleDelete(item) {
      console.log(item, 'delete');
    },
    async handleRefresh() {
      if (!this.companySaveDisabled) {
        if (await this.$root.$confirm.open(
          this.$t('dialog.warning'),
          this.$t('dialog.noSaveRefresh'),
        )) {
          this.init();
        }
      } else {
        this.init();
      }
    },
  },
  computed: {
    ...mapState('helper', ['currentLocale']),
    ...mapState('factoryCompany', [
      'company',
      'factoryList',
      'industryCodeList',
    ]),
    moduleName() {
      return this.$route.name;
    },
    rules() {
      return this.$getFactoryCompanyRules();
    },
    industryList() {
      const { currentLocale, industryCodeList } = this;
      const listByLanguage = industryCodeList.filter((m) => m.type === currentLocale);
      if (listByLanguage.length) {
        const { dictVoList } = listByLanguage[0];
        return dictVoList;
      }
      return [];
    },
  },
};
</script>
