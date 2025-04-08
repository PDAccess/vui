<template>
  <div class="animated fadeIn">
    <p-card :cardBody="false">
      <h5>Default Radius Port Settings</h5>
      <hr />
      <b-form-fieldset
        label="Listen Port"
        description="Radius Listen Port"
        :label-cols="3"
        :horizontal="true"
      >
        <b-form-input
          type="number"
          v-model="settings.listen_port"
          placeholder="1111"
        ></b-form-input>
      </b-form-fieldset>
      <b-form-fieldset
        label="Accounting Port"
        description="Radius Accounting Port"
        :label-cols="3"
        :horizontal="true"
      >
        <b-form-input
          type="number"
          v-model="settings.accounting_port"
          placeholder="1111"
        ></b-form-input>
      </b-form-fieldset>
      <h5>Radius Secret</h5>
      <hr />
      <b-form-fieldset
        label="Secret"
        description="Radius Secret Key"
        :label-cols="3"
        :horizontal="true"
      >
        <b-form-input type="text" v-model="settings.secret"></b-form-input>
      </b-form-fieldset>

      <b-row>
        <b-col class="d-flex justify-content-end">
          <b-button variant="success">
            Save Radius Proxy Settings
          </b-button>
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