<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="moreInfo?'800px':'400px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            isNew
            ? $t('initialAdministrator.addInitialAdministrator')
            : $t('initialAdministrator.editInitialAdministrator')
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
            align="center"
          >
            <v-col :cols="moreInfo?'6':'12'" >
              <v-text-field
                class="mx-3 mt-16 pt-8"
                clearable
                :rules="rules.name"
                :label="`${$t('initialAdministrator.account')}*`"
                v-model="tabledataobj.userName"
                :counter="50"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-3"
                clearable
                :append-icon="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                :type="showPassword ? 'text' : 'password'"
                :label="`${$t('initialAdministrator.password')}`"
                v-model="tabledataobj.password"
                @click:append="showPassword = !showPassword"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-3"
                clearable
                :label="`${$t('initialAdministrator.factory')}`"
                disabled
                v-model="tabledataobj.factoryName"
              ></v-text-field>
              <div class="d-flex justify-end">
                <v-btn
                  color="primary"
                  small
                  text
                  class="mr-2"
                  @click="moreInfo = !moreInfo"
                >
                  {{$t('initialAdministrator.moreInfo')}}
                  <v-icon v-if="moreInfo">mdi-menu-left</v-icon>
                  <v-icon v-else>mdi-menu-right</v-icon>
                </v-btn>
              </div>
            </v-col>
            <v-col cols="6" v-if="moreInfo">
              <div class="text-h6">{{ $t('initialAdministrator.moreInfo')}} </div>
              <div class="d-flex mx-3 mt-3">
                <v-text-field
                  class="mr-3 mt-3"
                  clearable
                  :label="`${$t('initialAdministrator.lastName')}`"
                  :counter="50"
                  :rules="rules.lastName"
                  v-model="tabledataobj.lastName"
                ></v-text-field>
                <v-text-field
                  class="ml-3 mt-3"
                  clearable
                  :label="`${$t('initialAdministrator.firstName')}`"
                  :counter="50"
                  :rules="rules.firstName"
                  v-model="tabledataobj.firstName"
                ></v-text-field>
              </div>
              <v-text-field
                class="mx-3 mt-3"
                clearable
                :label="`${$t('initialAdministrator.email')}`"
                :rules="rules.email"
                v-model="tabledataobj.email"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-3"
                clearable
                :label="`${$t('initialAdministrator.telephone')}`"
                v-model="tabledataobj.phoneNumber"
                :rules="rules.telephone"
              ></v-text-field>
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
          v-if="isNew"
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
  </v-dialog>
</template>

<script>
import {
  mapActions,
  mapMutations,
} from 'vuex';

export default {
  name: 'AdminAddDialog',
  data() {
    return {
      tabledataobj: {
      },
      moreInfo: false,
      showPassword: false,
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    factory: {
      type: Object,
    },
    isNew: {
      type: Boolean,
    },
    isFromFactory: {
      type: Boolean,
    },
  },
  computed: {
    dialog: {
      get() {
        return this.addDialog;
      },
      set() {
        this.reset();
        this.$emit('closeDialog');
      },
    },
    rules() {
      return this.$getInitialAdministratorRules();
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('initialAdministrator', ['createFactoryAdmin', 'updateFactoryAdmin']),
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        isNew,
        isFromFactory,
        tabledataobj,
      } = this;
      const {
        id,
        factoryId,
        firstName,
        lastName,
        email,
        phoneNumber,
        userName,
        password,
      } = tabledataobj;
      const payload = {
        factoryId,
        firstName,
        lastName,
        email,
        phoneNumber,
        userName,
        password,
      };
      if (isFromFactory) {
        this.$emit('getAdminPayload', payload);
        this.dialog = false;
      } else {
        let result = null;
        if (isNew) {
          result = await this.createFactoryAdmin(payload);
        } else {
          payload.id = id;
          result = await this.updateFactoryAdmin(payload);
        }
        if (result) {
          this.$emit('getTableList');
          this.dialog = false;
        }
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$nextTick(() => {
          this.tabledataobj = {};
          this.moreInfo = false;
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
        factory,
        isFromFactory,
      } = this;
      // console.log(this.rules, 'rules');
      if (!factory) {
        this.reset();
        return;
      }
      if (isFromFactory) {
        this.moreInfo = true;
      }
      const {
        id,
        adminId,
        name,
        contactFirstName,
        contactLastName,
        contactEmail,
        contactPhone,
        userName,
        password,
        firstName,
        lastName,
        email,
        phoneNumber,
      } = factory;
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...this.tabledataobj,
          id: adminId,
          factoryId: id,
          factoryName: name,
          firstName: isFromFactory ? contactFirstName : firstName,
          lastName: isFromFactory ? contactLastName : lastName,
          email: isFromFactory ? contactEmail : email,
          phoneNumber: isFromFactory ? contactPhone : phoneNumber,
          userName,
          password,
        };
      });
    },
  },
};
</script>
