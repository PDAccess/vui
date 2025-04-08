<template>
  <div class="animated fadeIn">
    <p-card v-if="errorStatus">
      <p-error
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
    </p-card>
    <p-card v-else :cardBody="false">
      <h5>Default LDAP Host Settings</h5>
      <hr />
      <b-form-fieldset
        label="LDAP Host"
        description="Your LDAP Host"
        :label-cols="3"
        :horizontal="true"
      >
        <b-form-input
          type="url"
          v-model="settings.ldap_host"
          placeholder="pdaccess.com"
        ></b-form-input>
      </b-form-fieldset>
      <h5>Default LDAP Proxy Settings</h5>
      <hr />
      <b-form-fieldset
        label="LDAP Proxy Port"
        description="Your LDAP Proxy Port"
        :label-cols="3"
        :horizontal="true"
      >
        <b-form-input
          type="number"
          v-model="settings.ldap_proxy_port"
          placeholder="5432"
        ></b-form-input>
      </b-form-fieldset>
      <h5>Default LDAP DN Settings</h5>
      <hr />
      <b-form-fieldset
        label="Base DN"
        description="Base DN"
        :label-cols="3"
        :horizontal="true"
      >
        <b-form-input
          type="text"
          v-model="settings.base_dn"
          placeholder="Base DN"
        ></b-form-input>
      </b-form-fieldset>
      <b-form-fieldset
        label="User DN"
        description="User DN"
        :label-cols="3"
        :horizontal="true"
      >
        <b-form-input
          type="text"
          v-model="settings.user_dn"
          placeholder="User DN"
        ></b-form-input>
      </b-form-fieldset>
      <b-form-fieldset
        label="Password"
        description="Password"
        :label-cols="3"
        :horizontal="true"
      >
        <b-form-input
          type="password"
          v-model="settings.password"
          placeholder="Password"
        ></b-form-input>
      </b-form-fieldset>
      <b-form-fieldset
        label="Group DN"
        description="Group DN"
        :label-cols="3"
        :horizontal="true"
      >
        <b-form-input
          type="text"
          v-model="settings.group_dn"
          placeholder="Group DN"
        ></b-form-input>
      </b-form-fieldset>
      <b-form-fieldset
        label="Group Filter"
        description="Group Filter"
        :label-cols="3"
        :horizontal="true"
      >
        <b-form-input
          type="text"
          v-model="settings.group_filter"
          placeholder="Group Filter"
        ></b-form-input>
      </b-form-fieldset>
      <b-row>
        <b-col class="d-flex justify-content-end">
          <b-button variant="success" v-on:click="saveSettings">
            Save LDAP Proxy Settings
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
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      settings: {
        ldap_host: "",
        ldap_proxy_port: "",
        base_dn: "",
        user_dn: "",
        password: "",
        group_dn: "",
        group_filter: "",
      },
    };
  },
  methods: {
    saveSettings() {
      let data = [
        {
          tag: "ldap_proxy_port",
          value: this.settings.ldap_proxy_port,
        },
        {
          tag: "ldap_proxy_host",
          value: this.settings.ldap_host,
        },
        {
          tag: "base_dn",
          value: this.settings.base_dn,
        },
        {
          tag: "user_dn",
          value: this.settings.user_dn,
        },
        {
          tag: "ldap_password",
          value: this.settings.password,
        },
        {
          tag: "ldap_group_dn",
          value: this.settings.group_dn,
        },
        {
          tag: "ldap_group_filter",
          value: this.settings.group_filter,
        },
      ];

      this.$http
        .post("/api/v1/settings", data)
        .then((response) => {
          this.$bvToast.toast(
            `LDAP Proxy Settings settings saved successfully`,
            {
              title: "System Settings",
              variant: "success",
              autoHideDelay: 5000,
            }
          );
          this.saveStatus = false;
        })
        .catch((error) => {
          console.log(error);
          this.saveStatus = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
  },
  created() {
    this.$http
      .get("/api/v1/settings/generalSettings")
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].tag === "ldap_proxy_port") {
            this.settings.ldap_proxy_port = response.data[i].value;
          }
          if (response.data[i].tag === "ldap_proxy_host") {
            this.settings.ldap_host = response.data[i].value;
          }
          if (response.data[i].tag === "base_dn") {
            this.settings.base_dn = response.data[i].value;
          }
          if (response.data[i].tag === "user_dn") {
            this.settings.user_dn = response.data[i].value;
          }
          if (response.data[i].tag === "ldap_password") {
            this.settings.password = response.data[i].value;
          }
          if (response.data[i].tag === "ldap_group_dn") {
            this.settings.group_dn = response.data[i].value;
          }
          if (response.data[i].tag === "ldap_group_filter") {
            this.settings.group_filter = response.data[i].value;
          }
        }
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