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
      <h5>Default System Host Settings</h5>
      <hr />
      <b-form-fieldset
        :horizontal="true"
        :label-cols="3"
        description="Your default PDAccess hostname;this url using for connecting inventory"
        label="Host Name"
      >
        <b-form-input
          placeholder="app.pdaccess.com"
          type="text"
          v-model="settings.default_system_host_name"
        ></b-form-input>
      </b-form-fieldset>
      <b-form-fieldset
        :horizontal="true"
        :label-cols="3"
        description="Your default PDAccess port"
        label="Port"
      >
        <b-form-input
          placeholder="80"
          type="number"
          v-model="settings.default_system_host_port"
        ></b-form-input>
      </b-form-fieldset>
      <h5>Default Service Connection User Settings</h5>
      <hr />
      <b-form-fieldset
        :horizontal="true"
        :label-cols="3"
        description="Should users default to admin user when they don't have a connection user assigned to them?"
        label="Use Default Connection User"
      >
        <label class="switch switch-3d switch-primary">
          <input
            checked
            class="switch-input"
            type="checkbox"
            v-model="settings.default_connection_user"
          />
          <span class="switch-slider"></span>
        </label>
      </b-form-fieldset>
      <h5>Maximum Session Minute & Idle Timeout</h5>
      <hr />
      <b-form-fieldset
        :horizontal="true"
        :label-cols="3"
        description="Default maximum session time value unlimited"
        :label="getMaxSessionLabel(tempMaxSession)"
      >
        <b-form-input
          type="range"
          :min="minSessionTimeLimit"
          :max="maxSessionTimeLimit"
          v-model="tempMaxSession"
        ></b-form-input>
      </b-form-fieldset>
      <b-form-fieldset
        :horizontal="true"
        :label-cols="3"
        description="Default timeout value unlimited"
        :label="getTimeOutLabel(tempIdleTimeout)"
      >
        <b-form-input
          placeholder="pdaccess.com"
          type="range"
          :min="minSessionIdleTimeOutLimit"
          :max="maxSessionIdleTimeOutLimit"
          v-model="tempIdleTimeout"
        ></b-form-input>
      </b-form-fieldset>
      <h5>LDAP Proxy Settings</h5>
      <hr />
      <b-form-fieldset
        :horizontal="true"
        :label-cols="3"
        description="LDAP Proxy port"
        label="Port"
      >
        <b-form-input
          placeholder="80"
          type="number"
          v-model="settings.ldap_proxy_port"
        ></b-form-input>
      </b-form-fieldset>
      <h5>Default Mail Settings</h5>
      <hr />
      <b-form-fieldset
        :horizontal="true"
        :label-cols="3"
        description="Mail transport protocol"
        label="SMTP"
      >
        <b-form-checkbox
          id="checkbox-1"
          name="checkbox-1"
          unchecked-value="null"
          v-model="settings.mail_smtp"
          value="smtp"
        >
        </b-form-checkbox>
      </b-form-fieldset>
      <div v-if="settings.mail_smtp === 'smtp'">
        <b-form-fieldset
          :horizontal="true"
          :label-cols="3"
          description="Your default Mail hostname; this url using for sending mail"
          label="Mail Host Name"
        >
          <b-form-input
            placeholder="mail.pdaccess.com"
            type="text"
            v-model="settings.mail_host"
          ></b-form-input>
        </b-form-fieldset>
        <b-form-fieldset
          :horizontal="true"
          :label-cols="3"
          description="Your default Mail port"
          label="Mail Port"
        >
          <b-form-input
            placeholder="587"
            type="number"
            v-model="settings.mail_port"
          ></b-form-input>
        </b-form-fieldset>
        <b-form-fieldset
          :horizontal="true"
          :label-cols="3"
          description="Sender email adress"
          label="Mail Address"
        >
          <b-form-input
            placeholder="mail@mail.com"
            type="email"
            v-model="settings.mail_address"
          ></b-form-input>
        </b-form-fieldset>
        <b-form-fieldset
          :horizontal="true"
          :label-cols="3"
          description="Sender email password"
          label="Mail Password"
        >
          <b-form-input
            type="password"
            v-model="settings.mail_password"
          ></b-form-input>
        </b-form-fieldset>
        <b-form-fieldset
          :horizontal="true"
          :label-cols="3"
          description="SMTP authentication"
          label="Authentication"
        >
          <b-form-checkbox
            id="checkbox-2"
            name="checkbox-2"
            unchecked-value="false"
            v-model="settings.mail_auth"
            value="true"
          >
          </b-form-checkbox>
        </b-form-fieldset>
        <b-form-fieldset
          :horizontal="true"
          :label-cols="3"
          description="SMTP authentication type"
          label="Authentication Type"
          v-if="settings.mail_auth === 'true'"
        >
          <b-form-select v-model="settings.mail_auth_type">
            <optgroup label="Auth Type">
              <option value="LOGIN">Login</option>
              <option value="PLAIN">Plain</option>
              <option value="DIGEST-MD5">Digest-MD5</option>
              <option value="NTLM">NTLM</option>
            </optgroup>
          </b-form-select>
        </b-form-fieldset>
        <b-form-fieldset
          :horizontal="true"
          :label-cols="3"
          description="SMTP SSL / TTLS"
          label="SSL / TTLS"
        >
          <b-form-select v-model="settings.mail_ssl_ttls">
            <optgroup label="SSL/TTLS">
              <option value="none">None</option>
              <option value="ssl">SSL</option>
              <option value="starttls">Start-TTLS</option>
            </optgroup>
          </b-form-select>
        </b-form-fieldset>
        <b-form-fieldset
          :horizontal="true"
          :label-cols="3"
          description="Sender email password"
          label="Test Mail"
        >
          <b-button
            v-on:click="sendTestMail"
            variant="outline-primary"
            style="width: 100%"
            :disabled="sendTestMailStatus"
          >
            Send Test Mail
          </b-button>
        </b-form-fieldset>
      </div>
      <div>
        <h5>Password Rules</h5>
        <hr />
        <b-form-fieldset
          :horizontal="true"
          :label-cols="3"
          description="Must be a number between 1 and 256. For better security, we recommended a number between 8 and 256."
          label="Minimum Characters"
        >
          <b-form-input
            placeholder="8"
            type="number"
            min="1"
            max="256"
            id="password-min-chars"
            aria-describedby="password-min-chars-feedback"
            :state="passwordRules.minChars > 0 && passwordRules.minChars < 257"
            v-model="passwordRules.minChars"
          ></b-form-input>
          <b-form-invalid-feedback id="password-min-chars-feedback">
            Please enter greater than 0 or less than 257
          </b-form-invalid-feedback>
        </b-form-fieldset>
        <b-form-fieldset
          :horizontal="true"
          :label-cols="3"
          description="Minimum number of digits required."
          label="Numeral"
        >
          <b-form-input
            placeholder="1"
            type="number"
            min="0"
            id="password-min-numeral"
            aria-describedby="password-min-numeral-feedback"
            :state="passwordRules.numeral > -1"
            v-model="passwordRules.numeral"
          ></b-form-input>
          <b-form-invalid-feedback id="password-min-numeral-feedback">
            Please enter greater than -1
          </b-form-invalid-feedback>
        </b-form-fieldset>
        <b-form-fieldset
          :horizontal="true"
          :label-cols="3"
          description="Minimum number of lowercase letters required."
          label="Lowercase"
        >
          <b-form-input
            placeholder="1"
            type="number"
            min="0"
            id="password-min-lowercase"
            aria-describedby="password-min-lowercase-feedback"
            :state="passwordRules.lowercase > -1"
            v-model="passwordRules.lowercase"
          ></b-form-input>
          <b-form-invalid-feedback id="password-min-lowercase-feedback">
            Please enter greater than -1
          </b-form-invalid-feedback>
        </b-form-fieldset>
        <b-form-fieldset
          :horizontal="true"
          :label-cols="3"
          description="Minimum number of lowercase letters  required."
          label="Uppercase"
        >
          <b-form-input
            placeholder="1"
            type="number"
            min="0"
            id="password-min-uppercase"
            aria-describedby="password-min-uppercase-feedback"
            :state="passwordRules.uppercase > -1"
            v-model="passwordRules.uppercase"
          ></b-form-input>
          <b-form-invalid-feedback id="password-min-uppercase-feedback">
            Please enter greater than -1
          </b-form-invalid-feedback>
        </b-form-fieldset>
        <b-form-fieldset
          :horizontal="true"
          :label-cols="3"
          description="Minimum number of printable ASCII characters required."
          label="Special Character"
        >
          <b-form-input
            placeholder="1"
            type="number"
            min="0"
            id="password-min-specialChars"
            aria-describedby="password-min-specialChars-feedback"
            :state="passwordRules.specialChars > -1"
            v-model="passwordRules.specialChars"
          ></b-form-input>
          <b-form-invalid-feedback id="password-min-specialChars-feedback">
            Please enter greater than -1
          </b-form-invalid-feedback>
        </b-form-fieldset>
      </div>
      <div>
        <h5>Group Settings</h5>
        <hr />
        <b-form-fieldset
          :horizontal="true"
          :label-cols="3"
          description="All admins are added as members to the group created at any time of group creation"
          label="Add All Admin To Groups"
        >
          <label class="switch switch-3d switch-primary">
            <input
              checked
              class="switch-input"
              type="checkbox"
              v-model="settings.add_all_admin_to_groups"
            />
            <span class="switch-slider"></span>
          </label>
        </b-form-fieldset>
        <b-form-fieldset
          v-if="settings.add_all_admin_to_groups"
          :horizontal="true"
          :label-cols="3"
          description="Only external admins are added as members to the group created at any time of group creation"
          label="Add External Admin To Groups"
        >
          <label class="switch switch-3d switch-primary">
            <input
              checked
              class="switch-input"
              type="checkbox"
              v-model="settings.add_external_admin_to_groups"
            />
            <span class="switch-slider"></span>
          </label>
        </b-form-fieldset>
        <b-form-fieldset
          :horizontal="true"
          :label-cols="3"
          description="Prevents devices from connecting with Admin users"
          label="No Login To Device From Admin Users"
        >
          <label class="switch switch-3d switch-primary">
            <input
              checked
              class="switch-input"
              type="checkbox"
              v-model="settings.no_login_to_device_from_admin_users"
            />
            <span class="switch-slider"></span>
          </label>
        </b-form-fieldset>
      </div>
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
