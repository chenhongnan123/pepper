<template>
  <v-dialog
    persistent
    scrollable
    v-model="dialog"
    :max-width="'400px'"
    transition="dialog-transition"
  >
    <v-card style="overflow: hidden">
      <v-card-title primary-title>
        <span>
          {{ '配方下发状态' }}
        </span>
        <v-spacer></v-spacer>
        <v-btn icon small @click="dialog = false" color="primary">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">
                  {{$t('recipeManagement.table.recipeVersion')}}
                </th>
                <th class="text-left">
                  {{$t('recipeManagement.table.recipeStatus')}}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in uploadRecipeStatus"
                :key="item.recipeVersion"
              >
                <td>{{ item.recipeVersion }}</td>
                <td>
                  <v-chip
                    label
                    class="rounded"
                    :color="statusConfig[+item.status].color"
                    text-color="white"
                    small
                  >
                  {{ statusConfig[+item.status].text }}
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
      <v-card-actions class="mt-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" small class="text-none" @click="dialog = false">
          {{ $t('btn.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      // 0: 下发中，1: 下发成功， 2: 下发失败
      statusConfig: [
        {
          text: '下发中',
          color: 'primary',
        },
        {
          text: '下发成功',
          color: 'success',
        },
        {
          text: '下发失败',
          color: 'error',
        },
      ],
    };
  },
  props: {
    recipeStatusDialog: {
      type: Boolean,
      required: true,
    },
    uploadRecipeStatus: {
      type: Array,
      required: true,
    },
  },
  computed: {
    dialog: {
      get() {
        return this.recipeStatusDialog;
      },
      set() {
        this.$emit('closeDialog');
      },
    },
  },
};
</script>
