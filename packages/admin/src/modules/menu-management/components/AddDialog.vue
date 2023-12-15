<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'900px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden;">
      <v-card-title primary-title>
        <span>
          {{
            isNew
            ? $t('menuManagement.dialog.addMenu')
            : $t('menuManagement.dialog.editMenu')
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
            dense
          >
            <v-col cols="6" >
              <v-text-field
                class="mx-3 mt-1"
                :label="`${$t('menuManagement.label.parent')}*`"
                v-model="mainMenu"
                disabled
                v-if="tabledataobj.parentId === 0"
              ></v-text-field>
              <v-autocomplete
                class="mx-3 mt-1"
                :label="`${$t('menuManagement.label.parent')}*`"
                :items="peerMenuList"
                :item-text="iszh?'menuName':'menuNameEn'"
                item-value="menuId"
                v-model="tabledataobj.parentId"
                :disabled="menuType === 'F'"
                v-else
              ></v-autocomplete>
              <div class="mx-3 mt-1">{{ `${$t('menuManagement.label.type')}*` }}</div>
              <v-radio-group
                v-model="tabledataobj.menuType"
                row
                class="mx-3 mt-0"
                disabled
                dense
              >
                <v-radio
                  v-for="(type, key) in menuTypeList"
                  :key="`menutype${key}`"
                  :label="$t(`menuManagement.label.${type.text}`)"
                  :value="type.value"
                ></v-radio>
              </v-radio-group>
              <v-text-field
                class="mx-3 mt-2"
                clearable
                :rules="rules.name"
                :label="`${$t('menuManagement.table.nameCn')}*`"
                v-model="tabledataobj.menuName"
                :counter="50"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-2"
                clearable
                :rules="rules.name"
                :label="`${$t('menuManagement.table.nameEn')}*`"
                v-model="tabledataobj.menuNameEn"
                :counter="50"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :rules="tabledataobj.isFrame === '1' ? rules.isRequired : []"
                :label="
                  `${$t('menuManagement.table.component')}${tabledataobj.isFrame === '1'?'*':''}`
                "
                v-model="tabledataobj.component"
                v-if="tabledataobj.menuType === 'C'"
                :disabled="false && !isNew"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :rules="rules.isRequired"
                :label="`${$t('menuManagement.table.path')}*`"
                v-model="tabledataobj.path"
                v-if="tabledataobj.menuType === 'C'"
                :disabled="false && !isNew"
              ></v-text-field>
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :label="`${$t('menuManagement.table.permission')}`"
                v-model="tabledataobj.perms"
                v-if="tabledataobj.menuType === 'C' || tabledataobj.menuType === 'F'"
                :disabled="!isNew"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                class="mx-3 mt-1"
                clearable
                :rules="rules.interge"
                :label="`${$t('menuManagement.table.sort')}*`"
                v-model="tabledataobj.orderNum"
              ></v-text-field>
              <div
                class="mx-3 mt-1"
                v-if="tabledataobj.menuType === 'B'
                  ||tabledataobj.menuType === 'C'
                  || tabledataobj.menuType === 'M'
                "
              >{{ `${$t('menuManagement.table.icon')}` }}</div>
              <v-autocomplete
                class="mx-3 mt-0"
                dense
                clearable
                outlined
                v-model="tabledataobj.icon"
                :items="iconList"
                item-text="dictLabel"
                item-value="dictValue"
                v-if="tabledataobj.menuType === 'B'
                  ||tabledataobj.menuType === 'C'
                  || tabledataobj.menuType === 'M'
                "
              >
                <template #prepend-inner>
                  <v-icon
                    v-if="tabledataobj.icon"
                  >
                    {{`mdi-${tabledataobj.icon}`}}
                  </v-icon>
                </template>
                <template #item="{ item }">
                  <v-list-item-icon>
                    <v-icon>{{`mdi-${item.dictValue}`}}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.dictLabel }}</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
              <div
                class="mx-3 mt-1"
                v-if="tabledataobj.menuType === 'B'
                  ||tabledataobj.menuType === 'C'
                  || tabledataobj.menuType === 'M'
                "
              >{{ `${$t('menuManagement.label.status')}*` }}</div>
              <v-radio-group
                v-model="tabledataobj.visible"
                row
                class="mx-3 mt-0"
                mandatory
                :rules="rules.isRequired"
                v-if="tabledataobj.menuType === 'B'
                  ||tabledataobj.menuType === 'C'
                  || tabledataobj.menuType === 'M'
                "
                :disabled="tabledataobj.visible === '2'"
              >
                <v-radio
                  v-for="(status, key) in visibleList"
                  :key="key"
                  :label="status.dictLabel"
                  :value="status.dictValue"
                ></v-radio>
              </v-radio-group>
              <div
                class="mx-3 mt-1"
                v-if="tabledataobj.menuType === 'C'"
              >{{ `${$t('menuManagement.label.isRefresh')}*` }}</div>
              <v-radio-group
                v-model="tabledataobj.isRefresh"
                row
                class="mx-3 mt-0"
                mandatory
                :rules="rules.isRequired"
                v-if="tabledataobj.menuType === 'C'"
              >
                <v-radio
                  :label="$t('menuManagement.label.yes')"
                  value="0"
                ></v-radio>
                <v-radio
                  :label="$t('menuManagement.label.no')"
                  value="1"
                ></v-radio>
              </v-radio-group>
              <div
                class="mx-3 mt-1"
                v-if="tabledataobj.menuType === 'C'"
              >{{ `${$t('menuManagement.label.isOutLink')}*` }}</div>
              <v-radio-group
                v-model="tabledataobj.isFrame"
                row
                class="mx-3 mt-0"
                mandatory
                :rules="rules.isRequired"
                v-if="tabledataobj.menuType === 'C'"
                @change="getOpenMode"
              >
                <v-radio
                  :label="$t('menuManagement.label.yes')"
                  value="0"
                ></v-radio>
                <v-radio
                  :label="$t('menuManagement.label.no')"
                  value="1"
                ></v-radio>
              </v-radio-group>
              <v-autocomplete
                clearable
                :rules="rules.isRequired"
                :label="`${$t('menuManagement.label.openMode')}*`"
                class="mx-3 mt-1"
                v-model="tabledataobj.openMode"
                :items="openModeList"
                item-text="text"
                item-value="value"
                v-if="tabledataobj.menuType === 'C'"
                :disabled="tabledataobj.isFrame==='0'"
              >
              </v-autocomplete>
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
  mapState,
  mapActions,
  mapMutations,
} from 'vuex';

export default {
  name: 'MenuAddDialog',
  data() {
    return {
      tabledataobj: {
      },
      mainMenu: '',
      peerMenuList: [], // 所有上一级菜单的平级目录
    };
  },
  props: {
    addDialog: {
      type: Boolean,
      required: true,
    },
    isNew: {
      type: Boolean,
    },
    parentId: {
      type: Number,
    },
    menuId: {
      type: Number,
    },
    menuType: {
      type: String,
    },
  },
  components: {
  },
  computed: {
    ...mapState('menuManagement', ['menuTypeList', 'iconList', 'menuList', 'visibleList']),
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
      return this.$getMaintenanceRules();
    },
    iszh() {
      return this.$i18n.locale === 'zhHans';
    },
    openModeList() {
      return [
        {
          text: this.$t('menuManagement.label.inOpen'),
          value: '0',
        },
        {
          text: this.$t('menuManagement.label.outOpen'),
          value: '1',
        },
      ];
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('menuManagement', [
      'getParentMenuList',
      'getMenuById',
      'getIconList',
      'getVisibleList',
      'addMenu',
      'editMenu',
    ]),
    getOpenMode() {
      const { isFrame } = this.tabledataobj;
      if (isFrame === '0') {
        this.tabledataobj = {
          ...this.tabledataobj,
          openMode: '1',
        };
      } else {
        this.tabledataobj = {
          ...this.tabledataobj,
          openMode: '0',
        };
      }
    },
    async handleSave() {
      if (!this.$refs.form.validate()) {
        return;
      }
      const {
        isNew,
        parentId,
        tabledataobj,
      } = this;
      const {
        menuId,
        menuType,
        menuName,
        menuNameEn,
        icon,
        component,
        path,
        perms,
        orderNum,
        visible,
        isRefresh,
        isFrame,
        openMode,
      } = tabledataobj;
      let payload = {
        menuType,
        menuName,
        menuNameEn,
        component,
        icon,
        perms,
        orderNum,
        visible,
        isRefresh,
        isFrame,
        openMode,
        path,
        status: 0,
      };
      let result = null;
      if (isNew) {
        payload = {
          ...payload,
          parentId,
        };
        result = await this.addMenu(payload);
      } else {
        payload = {
          ...payload,
          parentId: tabledataobj.parentId,
          menuId,
        };
        result = await this.editMenu(payload);
      }
      if (result) {
        if (isNew) {
          this.$emit('getTableList');
        } else {
          this.$emit('getTableList', 1);
        }
        this.dialog = false;
      }
    },
    reset() {
      if (this.$refs.form) {
        this.$refs.form.reset();
        this.$nextTick(() => {
          this.tabledataobj = {
            menuType: this.menuType,
            parentId: this.parentId,
            isFrame: '1',
            openMode: '0',
          };
          this.mainMenu = this.$t('menuManagement.label.mainMenu');
        });
      }
    },
  },
  watch: {
    async dialog(dialog) {
      if (!dialog) {
        return;
      }
      await this.getIconList();
      await this.getVisibleList();
      const { menuId, isNew } = this;
      let curMenuType = null;
      let menu = null;
      if (isNew) {
        curMenuType = this.menuType;
      } else {
        menu = await this.getMenuById(menuId);
        curMenuType = menu.menuType;
      }
      let parentMenuType = null;
      if (curMenuType === 'C') {
        parentMenuType = 'M';
      } else if (curMenuType === 'M') {
        parentMenuType = 'B';
      }
      // 获取所有上级的平级目录
      const peerMenuList = await this.getParentMenuList({
        menuType: parentMenuType,
      });
      this.peerMenuList = peerMenuList;
      if (isNew) {
        this.reset();
        return;
      }
      this.$nextTick(async () => {
        this.tabledataobj = {
          ...menu,
        };
      });
    },
  },
};
</script>
