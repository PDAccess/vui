<template>
  <div class="avatar-loading-wrapper">
    <avatar
      :rounded="false"
      :size="32"
      username=""
      backgroundColor="#adadad"
      color="#fff"
    ></avatar>
    <div class="ml-2 loading-area"></div>
  </div>
</template>

<script>
import Avatar from "vue-avatar";

export default {
  components: {
    Avatar,
  },
};
</script>

<style scoped>
.avatar-loading-wrapper {
    display: flex;
    align-items: center;
    width: 100%
}
.loading-area {
  width: 40%;
  background-color: rgb(173, 173, 173);
  height: 15px;
  border-radius: 5px;
}
</style>
