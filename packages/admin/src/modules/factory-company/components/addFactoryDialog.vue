<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="800px"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;" min-height="480px">
      <v-card-title primary-title>
        <span>
          {{
            selectedFactory.id
            ? $t('factoryCompany.editFactory')
            : $t('factoryCompany.createFactory')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false" color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-row
            justify="center"
          >
            <v-col cols="6">
              <v-text-field
                class="mx-3 mt-12"
                clearable
                :rules="rules.name"
                :label="`${$t('factoryCompany.factoryName')}*`"
                v-model="tabledataobj.name"
                :counter="50"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-3"
                clearable
                :label="`${$t('factoryCompany.remarks')}`"
                v-model="tabledataobj.remark"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <div class="d-flex justify-center">
                <v-btn-toggle
                  v-model="toggle_view"
                  mandatory
                  class="btn-group-tabs"
                  borderless
                  dense
                >
                  <v-btn
                    min-width="100px"
                    class="btn-tab"
                  >
                    {{ $t('factoryCompany.address') }}
                  </v-btn>
                  <v-btn
                    min-width="100px"
                  >
                    {{ $t('factoryCompany.contacts') }}
                  </v-btn>
                </v-btn-toggle>
              </div>
              <div
                v-if="!toggle_view"
              >
                <v-autocomplete
                  clearable
                  :label="`${$t('factoryCompany.country')}`"
                  class="mx-3 mt-3"
                  v-model="tabledataobj.countryCode"
                  :items="countryList"
                  item-text="name"
                  item-value="code"
                >
                  <template #item="{ item }">
                    <v-list-item-icon>
                      <span :class="`fi fi-${item.code}`"></span>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                  <template #prepend-inner>
                    <span
                      :class="`fi fi-${tabledataobj.countryCode}`" v-if="tabledataobj.countryCode"
                    >
                    </span>
                  </template>
                </v-autocomplete>
                <v-text-field
                  class="mx-3 mt-3"
                  clearable
                  :label="`${$t('factoryCompany.address')}`"
                  v-model="tabledataobj.address"
                ></v-text-field>
                <v-text-field
                  class="mx-3 mt-3"
                  clearable
                  :label="`${$t('factoryCompany.postalCode')}`"
                  v-model="tabledataobj.postcode"
                  :rules="rules.postalCode"
                  :counter="6"
                ></v-text-field>
              </div>
              <div
                v-else
              >
                <div class="d-flex mx-3">
                  <v-text-field
                    class="mr-3 mt-3"
                    clearable
                    :label="`${$t('factoryCompany.lastName')}`"
                    :counter="50"
                    :rules="rules.lastName"
                    v-model="tabledataobj.contactLastName"
                  ></v-text-field>
                  <v-text-field
                    class="ml-3 mt-3"
                    clearable
                    :label="`${$t('factoryCompany.firstName')}`"
                    :counter="50"
                    :rules="rules.firstName"
                    v-model="tabledataobj.contactFirstName"
                  ></v-text-field>
                </div>
                <v-text-field
                  class="mx-3 mt-3"
                  clearable
                  :label="`${$t('factoryCompany.email')}`"
                  :rules="rules.email"
                  v-model="tabledataobj.contactEmail"
                ></v-text-field>
                <v-text-field
                  class="mx-3 mt-3"
                  clearable
                  :label="`${$t('factoryCompany.telephone')}`"
                  v-model="tabledataobj.contactPhone"
                  :rules="rules.telephone"
                ></v-text-field>
                <div class="d-flex justify-center mt-3" v-if="!selectedFactory.id">
                  <v-badge
                    bordered
                    color="success"
                    icon="mdi-check"
                    overlap
                    :value="!!adminPayload.userName"
                  >
                    <v-tooltip right :disabled="!adminPayload.userName">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="primary"
                          small
                          v-bind="attrs"
                          v-on="on"
                          @click="addAdminDialog = true"
                        >
                          {{$t('factoryCompany.setAsInitialAdministrator')}}
                        </v-btn>
                      </template>
                      <span>{{$t('factoryCompany.initialAdministratorSet')}}</span>
                    </v-tooltip>
                  </v-badge>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="mt-4">
        <v-spacer></v-spacer>
        <v-btn
          color="warning"
          small
          text
          class="mr-2"
          @click="reset"
          v-if="!selectedFactory.id"
        >
          {{$t('btn.eliminate')}}
        </v-btn>
        <v-btn
          color="primary"
          small
          class="text-none"
          @click="handleSave"
        >
          {{$t('btn.save')}}
        </v-btn>
      </v-card-actions>
    </v-card>
    <add-admin-dialog
      :addDialog="addAdminDialog"
      :factory="tabledataobj"
      :isNew="true"
      :isFromFactory="true"
      @closeDialog="addAdminDialog = false"
      @getAdminPayload="getAdminPayload"
    />
  </v-dialog>
</template>

<script>
import {
  mapState,
  mapActions,
  mapMutations,
} from 'vuex';
import AddAdminDialog from '@/modules/initial-administrator/components/addAdminDialog.vue';

export default {
  name: 'FactoryAddDialog',
  data() {
    return {
      tabledataobj: {
      },
      toggle_view: 0,
      addAdminDialog: false,
      adminPayload: {},
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    selectedFactory: {
      type: Object,
    },
    companyId: {
      type: Number,
    },
    rules: {
      type: Object,
    },
  },
  components: {
    AddAdminDialog,
  },
  computed: {
    ...mapState('factoryCompany', [
      'countryCodeList',
    ]),
    dialog: {
      get() {
        return this.addDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    countryList() {
      const { countryCodeList } = this;
      if (!countryCodeList) { return []; }
      return countryCodeList.map((item) => {
        const obj = {
          code: item,
          name: this.$t(`factoryCompany.countrys.${item}`),
        };
        return obj;
      });
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('factoryCompany', ['createFactory', 'updateFactory']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const { companyId, tabledataobj, adminPayload } = this;
      const {
        id,
        name,
        address,
        contactFirstName,
        contactLastName,
        contactEmail,
        countryCode,
        contactPhone,
        postcode,
        remark,
      } = tabledataobj;
      const {
        userName,
        password,
      } = adminPayload;
      const payload = {
        companyId,
        name,
        address,
        contactFirstName,
        contactLastName,
        contactEmail,
        countryCode,
        contactPhone,
        postcode,
        remark,
        userName,
        password,
      };
      // console.log(payload, 'payload');
      let result = null;
      if (id) {
        payload.id = id;
        result = await this.updateFactory(payload);
      } else {
        result = await this.createFactory(payload);
      }
      if (result) {
        this.$emit('getTableList');
        this.dialog = false;
      }
    },
    getAdminPayload(payload) {
      this.adminPayload = payload;
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$nextTick(() => {
          this.tabledataobj = {};
          this.adminPayload = {};
        });
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      const {
        selectedFactory,
      } = this;
      // console.log(selectedTableList, 'selectedTableList');
      // console.log(this.rules, 'rules');
      if (!selectedFactory.id) {
        this.reset();
        return;
      }
      const {
        id,
        name,
        address,
        contactAddress,
        contactFirstName,
        contactLastName,
        contactPhone,
        contactEmail,
        countryCode,
        postcode,
        remark,
      } = selectedFactory;
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          id,
          name,
          address,
          contactAddress,
          contactFirstName,
          contactLastName,
          contactEmail,
          countryCode,
          contactPhone,
          postcode,
          remark,
        };
      });
    },
  },
};
</script>
