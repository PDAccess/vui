<template>
  <div style="font-size: 5.5rem">
    <br /><br /><br />
    <div class="text-center">
      <a>Successful Login</a>

      <em class="fa fa-check-circle fa-4x"></em>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      qrCode: "",
      token: "",
      sendInfo: "",
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
      token: "auth/token",
    }),
  },
  created() {
    this.qrCode = this.$route.params.qrcode;
    this.token = this.token;
    this.username = this.user.username;
    this.sendInfo = this.qrCode + "=" + this.token + "=" + this.username;
    axios.post("api/qrMatch", this.sendInfo).then((response) => {});
  },
};
</script>