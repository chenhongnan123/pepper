<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    max-width="600px"
    transition="dialog-transition"
  >
    <v-card>
      <v-card-title primary-title>
        <span>{{ $t('dataAnalysis.dialog.tip')}}</span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text :max-height="'200px'">
        <div>
          <v-list
            dense
            height="200"
            outlined
            style="overflow-y: auto;"
          >
            <template v-for="(item, index) in list">
              <!-- 不要同时使用index作为key，可以变化一下 -->
              <v-divider
                v-if="index!==0"
                :key="`divider${index}`"
                :inset="item.inset"
              ></v-divider>
              <v-list-item :key="index">
                {{ item }}
              </v-list-item>
            </template>
          </v-list>
        </div>
      </v-card-text>
      <v-card-actions class="mt-4 mb-2">
        <v-spacer></v-spacer>
          <v-btn
            color="primary"
            small
            class="text-none"
            @click="dialog = false"
          >
            {{ $t('dataAnalysis.btn.close') }}
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
  name: 'ErrorDialog',
  data() {
    return {
    };
  },
  props: {
    errorDialog: {
      type: Boolean,
      required: true,
    },
    list: {
      type: Array,
      required: true,
    }, // 错误信息列表
  },
  computed: {
    dialog: {
      get() {
        return this.errorDialog;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
  },
  methods: {
    ...mapMutations('helper', ['setAlert']),
    ...mapActions('dataAnalysis', []),
  },
};
</script>
