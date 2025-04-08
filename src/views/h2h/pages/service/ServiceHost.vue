<template>
  <div class="animated fadeIn" v-if="visible">
    <p-card>
      <b-row class="mt-2">
        <b-col>
          <h3>Service Host & Port Settings</h3>
          <hr />
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="4">
          <p>
            You can update service host and port but we will not see current
            host and port data, if you want see this data use must Break The
            Glass
          </p>
        </b-col>
        <b-col sm="7">
          <br />
          <div class="d-flex justify-content-center">
            <b-button
              @click="edit = true"
              v-show="edit == false"
              variant="success"
              >Update Host / Port</b-button
            >
          </div>
          <div v-if="edit" class="padd">
            <b-form-fieldset
              :horizontal="true"
              :label-cols="2"
              description="Your default PDAccess service hostname; this url using for connecting inventory"
              label="Host Name"
            >
              <b-form-input
                :disabled="locked"
                placeholder="pdaccess.com"
                type="url"
                v-model="defaultHostName"
                v-on:input="setProxySettings"
              ></b-form-input>
            </b-form-fieldset>
            <b-form-fieldset
              :horizontal="true"
              :label-cols="2"
              description="Your default PDAccess Service port"
              label="Port"
            >
              <b-form-input
                :disabled="locked"
                placeholder="80"
                type="number"
                v-model="defaultHostPort"
                v-on:input="setProxySettings"
              ></b-form-input>
            </b-form-fieldset>

            <div class="d-flex justify-content-end mt-2">
              <b-button
                :disabled="locked"
                @click="updateHostPort"
                class="mt-2"
                variant="success"
                >Update</b-button
              >
            </div>
          </div>
        </b-col>
      </b-row>
    </p-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      defaultHostName: "",
      defaultHostPort: "",
      proxyHostName: "",
      proxyHostPort: "",
      useSameSettings: "use",
      visible: false,
      locked: true,
      edit: false,
    };
  },
  methods: {
    updateHostPort() {
      let data = {
        host: this.defaultHostName,
        port: this.defaultHostPort,
        id: this.$route.params.id,
      };
      this.$http
        .put("/api/updatehostport", data)
        .then((response) => {
          this.$bvToast.toast(`Host Ip / Port updated!`, {
            title: "Service Notification",
            variant: "info",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    setProxySettings() {
      if (this.useSameSettings === "use") {
        this.proxyHostName = this.defaultHostName;
        this.proxyHostPort = this.defaultHostPort;
      } else {
        this.proxyHostName = "";
        this.proxyHostPort = "";
      }
    },
  },
  created() {
    this.$http
      .get("/api/v1/user/who")
      .then((response) => {
        this.user = response.data;
        if (this.user.role === "Admin") {
          this.locked = false;
          this.visible = true;
        } else {
          this.locked = true;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style>
.padd {
  padding-left: 175px;
}
</style>