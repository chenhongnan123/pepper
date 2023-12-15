<template>
    <v-dialog
    v-model="dialog"
    scrollable
    persistent
    max-width="100%"
    transition="dialog-transition"
    >
      <v-card
      v-if="!filePath"
      color="primary2"
      dark
      >
      <v-card-text>
        {{ $t('common.loading') }}
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        />
      </v-card-text>
      <div>
        <v-spacer />
        <v-btn
          style="float: right;"
          color="red"
          text
          class="text-none"
          @click="dialog = false"
        >
          {{ $t('common.close') }}
        </v-btn>
      </div>
    </v-card>
    <v-card
      v-else
      height="820px"
    >
      <v-card-title primary-title>
        <!-- <span>
          {{
            $t('attachment.imagePreview')
          }}
        </span> -->
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false" color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pt-5">
        <img
          style="margin: 0 auto;display: block;max-width:100%;max-height:100%"
          :src="fileUrl"
          alt="Preview image"
        >
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'ImageView',
  data() {
    return {
    };
  },
  props: {
    previewDialog: {
      type: Boolean,
      required: true,
    },
    filePath: {
      type: String,
    },
  },
  computed: {
    dialog: {
      get() {
        return this.previewDialog;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
    fileUrl() {
      if (!this.filePath) {
        return false;
      }
      if (process.env.VUE_APP_MODE === 'development') {
        return `http://47.98.238.55/${this.filePath}`;
      }
      return this.filePath;
    },
  },
  watch: {
  },
  methods: {
  },
};
</script>
