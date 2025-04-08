<template>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import pkce from '@/views/h2h/util/authz';

export default {
  name: "Authcallback",
  methods: {
    ...mapActions({
      loadData: "auth/loadData",
    }),
  },
  created() {
    const url = window.location.href;
    pkce.exchangeForAccessToken(url).then((resp) => { 
      let data = {}
      data.token = resp.access_token;
      data.refresh = resp.refresh_token;
      console.log("token came:" + data)
      console.log(resp)

      this.loadData(data).then(() => {
              this.$router.push("/activities");
            })
            .catch((error) => {
              console.log(error)
            })
    }).catch(error => {
      console.log(error)
    })

  //   pkce.refreshAccessToken(refreshToken).then((resp) => {
  //   const accessToken = resp.access_token;
  //   const refreshToken = resp.refresh_token;
  //   // Do stuff with the access & refresh token.
  // });
  }
};
</script>
<style>
</style>
