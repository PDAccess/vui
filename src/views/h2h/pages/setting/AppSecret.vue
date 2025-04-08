<template>
  <div>
    <p-card v-if="loading" style="height: 100vh">
      <p-loading class="my-5" message="Loading..." />
    </p-card>
    <p-card v-else-if="errorStatus">
      <p-error
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
    </p-card>

    <p-card v-else :cardBody="false">
      <h5>Tacacs Secret Settings</h5>
      <hr />
      <b-form-fieldset
        :horizontal="true"
        :label-cols="3"
        description="Setting secret for Tacacs application"
        label="Tacacs Secret"
      >
        <b-form-input
          placeholder="*******"
          type="text"
          v-model="settings.default_system_host_name"
        ></b-form-input>
      </b-form-fieldset>
      <b-row>
        <b-col class="d-flex justify-content-end">
          <b-button
            v-on:click="saveSettings"
            variant="success"
            :disabled="saveStatus"
          >
            Save Settings
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
      saveStatus: false,
      sendTestMailStatus: false,
      loading: true,
      settings: {
        ssh_proxy_port: "",
        ldap_proxy_port: "",
        default_system_host_name: "",
        default_system_host_port: "",
        default_system_proxy_name: "",
        default_system_proxy_port: "",
        mail_host: "",
        mail_port: "",
        mail_address: "",
        mail_password: "",
        mail_smtp: "null",
        mail_auth: "false",
        mail_auth_type: "LOGIN",
        mail_ssl_ttls: "none",
        max_session_minute: "",
        idle_timeout: "",
        default_connection_user: false,
        add_all_admin_to_groups: false,
        add_external_admin_to_groups: false,
        no_login_to_device_from_admin_users: false
      },
      passwordRules: {
        minChars: 8,
        numeral: 1,
        lowercase: 1,
        uppercase: 1,
        specialChars: 1,
      },
      tempMaxSession: 0,
      tempIdleTimeout: 0,
      minSessionTimeLimit: 0,
      maxSessionTimeLimit: 1440,
      minSessionIdleTimeOutLimit: 0,
      maxSessionIdleTimeOutLimit: 1440,
    };
  },
  methods: {
    sendTestMail() {
      this.sendTestMailStatus = true;

      let ssl = "false";
      let ttls = "false";

      if (this.settings.mail_ssl_ttls === "ssl") {
        ssl = "true";
      } else if (this.settings.mail_ssl_ttls === "starttls") {
        ttls = "true";
      }

      if (this.settings.mail_auth === "false") {
        this.settings.mail_auth_type = "null";
      }

      let data = {
        host: this.settings.mail_host,
        port: this.settings.mail_port,
        email: this.settings.mail_address,
        password: this.settings.mail_password,
        smtp: this.settings.mail_smtp,
        auth: this.settings.mail_auth,
        auth_type: this.settings.mail_auth_type,
        starttls: ttls,
        ssl: ssl,
      };
      this.$http
        .post("/api/v1/settings/mail", data)
        .then((response) => {
          this.$bvToast.toast(`Successfully connected to the mail server`, {
            title: "Test Mail Status",
            variant: "primary",
            autoHideDelay: 5000,
          });
          this.sendTestMailStatus = false;
        })
        .catch((error) => {
          this.$bvToast.toast(`Could not connect to mail server`, {
            title: "Test Mail",
            variant: "danger",
            autoHideDelay: 5000,
          });
          this.sendTestMailStatus = false;
        });
    },
    getMaxSessionLabel(term) {
      let lbl = "Maximum Session Time " + term + " minute";
      return term == 0 ? "Max Session Time Unlimited" : lbl;
    },
    getTimeOutLabel(term) {
      let lbl = "Idle Timeout " + term + " minute";
      return term == 0 ? "Idle timeout unlimited" : lbl;
    },
    saveSettings() {
      this.saveStatus = true;
      this.settings.max_session_minute = this.tempMaxSession.toString();
      this.settings.idle_timeout = this.tempIdleTimeout.toString();
      let ssl = "false";
      let ttls = "false";

      if (this.settings.mail_ssl_ttls === "ssl") {
        ssl = "true";
      } else if (this.settings.mail_ssl_ttls === "starttls") {
        ttls = "true";
      }

      if (this.settings.mail_auth === "false") {
        this.settings.mail_auth_type = "null";
      }

      let data = [
        {
          tag: "default_system_host_name",
          value: this.settings.default_system_host_name,
        },
        {
          tag: "default_system_host_port",
          value: this.settings.default_system_host_port,
        },
        {
          tag: "default_system_proxy_name",
          value: this.settings.default_system_proxy_name,
        },
        {
          tag: "default_system_proxy_port",
          value: this.settings.default_system_proxy_port,
        },
        {
          tag: "mail_host",
          value: this.settings.mail_host,
        },
        {
          tag: "mail_port",
          value: this.settings.mail_port,
        },
        {
          tag: "mail_address",
          value: this.settings.mail_address,
        },
        {
          tag: "mail_password",
          value: this.settings.mail_password,
        },
        {
          tag: "mail_smtp",
          value: this.settings.mail_smtp,
        },
        {
          tag: "mail_auth",
          value: this.settings.mail_auth,
        },
        {
          tag: "mail_auth_type",
          value: this.settings.mail_auth_type,
        },
        {
          tag: "mail_starttls",
          value: ttls,
        },
        {
          tag: "mail_ssl",
          value: ssl,
        },
        {
          tag: "ssh_port",
          value: this.settings.ssh_proxy_port,
        },
        {
          tag: "ldap_port",
          value: this.settings.ldap_proxy_port,
        },
        {
          tag: "max_session_minute",
          value: this.settings.max_session_minute,
        },
        {
          tag: "idle_timeout",
          value: this.settings.idle_timeout,
        },
        {
          tag: "password_min_chars",
          value: this.passwordRules.minChars,
        },
        {
          tag: "password_min_numeral",
          value: this.passwordRules.numeral,
        },
        {
          tag: "password_min_lowercase",
          value: this.passwordRules.lowercase,
        },
        {
          tag: "password_min_uppercase",
          value: this.passwordRules.uppercase,
        },
        {
          tag: "password_min_special_chars",
          value: this.passwordRules.specialChars,
        },
        {
          tag: "default_connection_user",
          value: this.settings.default_connection_user,
        },
        {
          tag: "add_all_admin_to_groups",
          value: this.settings.add_all_admin_to_groups,
        },
        {
          tag: "add_external_admin_to_groups",
          value: this.settings.add_external_admin_to_groups,
        },
        {
          tag: "no_login_to_device_from_admin_users",
          value: this.settings.no_login_to_device_from_admin_users,
        },
      ];

      this.$http
        .post("/api/v1/settings", data)
        .then((response) => {
          this.$bvToast.toast(`System settings saved successfully`, {
            title: "System Settings",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.saveStatus = false;
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Save operation has error!";
          this.saveStatus = false;
          this.$bvToast.toast(
            `System settings saved failed, \nPlease make sure you have entered the appropriate values.`,
            {
              title: "System Settings",
              variant: "danger",
              autoHideDelay: 5000,
            }
          );
        });
    },
  },
  created() {
    this.$http
      .get("/api/v1/settings/generalSettings")
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].tag === "default_system_host_name") {
            this.settings.default_system_host_name = response.data[i].value;
          }
          if (response.data[i].tag === "default_system_host_port") {
            this.settings.default_system_host_port = response.data[i].value;
          }
          if (response.data[i].tag === "default_system_proxy_name") {
            this.settings.default_system_proxy_name = response.data[i].value;
          }
          if (response.data[i].tag === "default_system_proxy_port") {
            this.settings.default_system_proxy_port = response.data[i].value;
          }
          if (response.data[i].tag === "mail_host") {
            this.settings.mail_host = response.data[i].value;
          }
          if (response.data[i].tag === "mail_port") {
            this.settings.mail_port = response.data[i].value;
          }
          if (response.data[i].tag === "mail_address") {
            this.settings.mail_address = response.data[i].value;
          }
          if (response.data[i].tag === "mail_password") {
            this.settings.mail_password = response.data[i].value;
          }
          if (response.data[i].tag === "mail_smtp") {
            this.settings.mail_smtp = response.data[i].value;
          }
          if (response.data[i].tag === "mail_auth") {
            this.settings.mail_auth = response.data[i].value;
          }
          if (response.data[i].tag === "mail_auth_type") {
            this.settings.mail_auth_type = response.data[i].value;
          }
          if (response.data[i].tag === "mail_starttls") {
            if (response.data[i].value === "true") {
              this.settings.mail_ssl_ttls = "starttls";
            }
          }
          if (response.data[i].tag === "mail_ssl") {
            if (response.data[i].value === "true") {
              this.settings.mail_ssl_ttls = "ssl";
            }
          }
          if (response.data[i].tag === "ssh_port") {
            this.settings.ssh_proxy_port = response.data[i].value;
          }
          if (response.data[i].tag === "ldap_port") {
            this.settings.ldap_proxy_port = response.data[i].value;
          }
          if (response.data[i].tag === "idle_timeout") {
            this.settings.idle_timeout = response.data[i].value;
            this.tempIdleTimeout = parseInt(response.data[i].value);
          }
          if (response.data[i].tag === "max_session_minute") {
            this.settings.max_session_minute = response.data[i].value;
            this.tempMaxSession = parseInt(response.data[i].value);
          }
          if (response.data[i].tag === "default_connection_user") {
            if (response.data[i].value === "false")
              this.settings.default_connection_user = false;
            else this.settings.default_connection_user = true;
          }
          if (response.data[i].tag === "add_all_admin_to_groups") {
            this.settings.add_all_admin_to_groups = (response.data[i].value === "true")
          }
          if (response.data[i].tag === "add_external_admin_to_groups") {
            this.settings.add_external_admin_to_groups = (response.data[i].value === "true")
          }
          if (response.data[i].tag === "no_login_to_device_from_admin_users") {
            this.settings.no_login_to_device_from_admin_users = (response.data[i].value === "true")
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

    this.$http
      .get("/api/v1/settings/passwordValidationRules")
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          switch (response.data[i].tag) {
            case "password_min_chars":
              this.passwordRules.minChars = parseInt(response.data[i].value);
              break;
            case "password_min_numeral":
              this.passwordRules.numeral = parseInt(response.data[i].value);
              break;
            case "password_min_lowercase":
              this.passwordRules.lowercase = parseInt(response.data[i].value);
              break;
            case "password_min_uppercase":
              this.passwordRules.uppercase = parseInt(response.data[i].value);
              break;
            case "password_min_special_chars":
              this.passwordRules.specialChars = parseInt(
                response.data[i].value
              );
              break;
            default:
              break;
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
