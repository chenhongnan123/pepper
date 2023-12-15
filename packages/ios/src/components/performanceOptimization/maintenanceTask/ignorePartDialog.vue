<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="800px"
    transition="dialog-transition"
  >
    <div class="app-dialog pa-1">
      <v-card class="rounded-lg" style="min-height: 600px;">
        <div
          v-for="i in 5"
          :key="i"
          :class="`rectangle-${i}`"
        ></div>
        <v-card-title primary-title>
          <span>
            {{
              $t('maintenanceTask.partIgnore')
            }}
          </span>
          <v-spacer></v-spacer>
          <v-btn icon small @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <!-- 标题分割线 -->
        <div class="d-flex align-center px-5">
          <img
            :src="require('@/assets/icons/img/dialog-circle-big-dark.svg')"
            alt=""
            class="mr-2"
          />
          <img
            :src="require('@/assets/icons/img/dialog-circle-small-dark.svg')"
            alt=""
          />
          <v-divider></v-divider>
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-1"
          />
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-1"
          />
          <img
            :src="require('@/assets/icons/img/dialog-diagonal-dark.svg')"
            alt=""
            class="mt-2 mr-1"
          />
        </div>
        <v-card-text style="height: 450px;">
          <v-form
            ref="form"
            lazy-validation
          >
            <v-row>
              <v-col cols="12">
                <v-data-table
                  disable-filtering
                  disable-pagination
                  fixed-header
                  :headers="headers"
                  hide-default-footer
                  :height="400"
                  item-key="id"
                  :items="ignoreList"
                  dense
                  class="mt-2"
                >
                  <!-- eslint-disable-next-line -->
                  <template #item.no="{index}">
                    {{index + 1}}
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </v-dialog>
</template>

<script>

export default {
  name: 'IgnorePartDialog',
  data() {
    return {
    };
  },
  props: {
    ignoreDialog: {
      type: Boolean,
      required: true,
    },
    ignoreList: {
      type: Array,
      required: true,
    },
  },
  components: {
  },
  computed: {
    dialog: {
      get() {
        return this.ignoreDialog;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
    headers() {
      return [
        {
          text: 'No.',
          value: 'no',
        },
        {
          text: this.$t('maintenanceTask.bomName'),
          value: 'bomName',
        },
        {
          text: this.$t('maintenanceTask.materialnumber'),
          value: 'partNumber',
        },
        {
          text: this.$t('maintenanceTask.materialname'),
          value: 'partName',
        },
        {
          text: this.$t('maintenanceTask.materialdesc'),
          value: 'partDescription',
        },
      ];
    },
  },
  methods: {
  },
  watch: {
  },
};
</script>
