<template>
  <div>
    <b-button> </b-button>
    <div>
      <qrcode
        :cls="qrCls"
        :size="300"
        :value="qrText"
        style="margin-left: 40px"
      ></qrcode>
    </div>
  </div>
</template>




<script>
import Qrcode from "v-qrcode";
import { mapGetters } from "vuex";

export default {
  name: "QR",
  components: {
    Qrcode,
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
      token: "auth/token",
    }),
  },
  data() {
    return {
      qrCls: "qrcode",
      qrText: "",
      token: "",
      sendToken: "pdaccess.com/qrregistry/",
    };
  },
  created() {
    this.sendToken += this.token;
    this.sendToken += "=";
    this.sendToken += this.user.username;
    this.qrText = this.sendToken;
  },
};
</script>