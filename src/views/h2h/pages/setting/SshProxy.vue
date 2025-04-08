<template>
  <div class="animated fadeIn">
    <p-card :cardBody="false">
      <h5>SSH Proxy Settings</h5>
      <hr />
      <b-form-fieldset
        :horizontal="true"
        :label-cols="3"
        description="SSH Proxy port"
        label="Port"
      >
        <b-form-input
          placeholder="2222"
          type="number"
          v-model="settings.ssh_proxy_port"
        ></b-form-input>
      </b-form-fieldset>

      <h5>Ssh Secret</h5>
      <hr />
      <b-form-fieldset
        label="Secret"
        description="Ssh Secret Key"
        :label-cols="3"
        :horizontal="true"
      >
        <b-form-input type="text" v-model="settings.secret"></b-form-input>
      </b-form-fieldset>

      <b-row>
        <b-col class="d-flex justify-content-end">
          <b-button variant="success"> Save Ssh Proxy Settings </b-button>
        </b-col>
      </b-row>
    </p-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      settings: {
        listen_port: "",
        secret: "",
        accounting_port: "",
      },
    };
  },
  created() {
    this.$http
      .get("/api/v1/settings/generalSettings")
      .then((response) => {
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
  },
};
</script>