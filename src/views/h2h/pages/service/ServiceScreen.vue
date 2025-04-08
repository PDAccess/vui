<template>
  <div class="cont">
    <p-loading v-if="loading" class="my-5" message="Loading..." />
  </div>
</template>

<script>
export default {
  name: "ServiceScreen",
  data() {
    return {
      isLoading: true,
    };
  },
};
</script>

<style scoped>
.cont {
  position: relative;
  height: 90vh;
}

.centered {
  position: absolute;
  top: 50%;
  right: 50%;
  left: 50%;
  bottom: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
</style>
