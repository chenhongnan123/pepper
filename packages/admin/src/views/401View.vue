<template>
  <v-main>
    <v-container fill-height>
      <v-row
        align="center"
        justify="center"
        :no-gutters="$vuetify.breakpoint.smAndDown"
        class="pt-12"
      >
        <v-col cols="12" md="6" lg="5" xl="4" class="text-center">
          <v-card flat class="transparent">
            <div class="display-2">
              {{ $t('forbidden.title') }}
            </div>
            <div class="display-1 my-12">
              {{ $t('forbidden.subTitle1') }}
              <span class="primary--text font-weight-medium">
                {{ $t('forbidden.subTitle2') }}
              </span>
              {{ $t('forbidden.subTitle3') }}
            </div>
            <v-btn
              block
              rounded
              id="goBackHome"
              color="primary"
              class="text-none"
              @click="goToHome"
            >
              {{ $t('forbidden.goHome') }}
            </v-btn>
          </v-card>
        </v-col>
        <v-col v-if="$vuetify.breakpoint.mdAndUp" md="6" xl="5">
          <v-img
            :src="require(`../assets/imgs/${welcomeIllustration}.svg`)"
            contain
          />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  components: {
  },
  computed: {
    welcomeIllustration() {
      return this.$vuetify.theme.dark
        ? 'forbidden-dark'
        : 'forbidden-light';
    },
  },
  methods: {
    ...mapMutations('common', ['setMultiPageList']),
    goToHome() {
      this.setMultiPageList([]);
      this.$router.replace({ path: '/' });
    },
  },
};
</script>
