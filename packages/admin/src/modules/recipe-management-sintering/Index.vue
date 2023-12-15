<template>
  <div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'recipeManagementSintering',
  created() {
    console.log('index2 created');
  },
  activated() {
    console.log('index2 activated');
  },
};
</script>
