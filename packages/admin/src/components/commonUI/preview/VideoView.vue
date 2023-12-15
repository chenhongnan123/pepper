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
      color="primary"
      dark
    >
      <v-card-text>
        {{ $t('helper.loading') }}
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
          {{ $t('btn.close') }}
        </v-btn>
      </div>
    </v-card>
    <v-card
      v-else
      height="820px"
    >
      <v-card-title primary-title>
        <span>
          {{
            $t('attachment.videoPreview')
          }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false" color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pt-5">
        <video
          width="auto"
          height="100%"
          controls
          style="margin: 0 auto;display: block;"
          :key="filePath"
        >
          <track kind="captions" />
          <source
            :src="filePath"
            type="video/mp4"
          >
        </video>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: 'VideoView',
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
  },
  watch: {
  },
  methods: {
  },
};
</script>
