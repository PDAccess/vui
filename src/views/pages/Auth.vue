<template>
</template>
<script>
import pkce from '@/views/h2h/util/authz';

export default {
  name: "Auth",
  created() {
    window.location.replace(pkce.authorizeUrl());
  },
};
</script>
<style>
</style>
