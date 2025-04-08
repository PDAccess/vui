<template>
  <div class="animated fadeIn">
    <p-card :cardBody="false" v-if="loading" style="height: 100vh">
      <p-loading class="my-5" message="Loading..." />
    </p-card>
    <p-card v-else-if="errorStatus">
      <p-error
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
    </p-card>
    <p-card v-else>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Vault</h3>
              <p>
                Stores critical information in the system, here you see the
                status of the vault.
              </p>
            </b-col>
            <b-col sm="8">
              <p v-if="!sealed">
                Status:
                <strong>
                  <span style="color: green">Unseal</span>
                </strong>
              </p>
              <p v-else>
                status:
                <strong>
                  <span style="color: red">Selaled</span>
                </strong>
              </p>
              <p>
                Key total: <strong>{{ total }}</strong>
              </p>
              <p>
                Key minimum: <strong>{{ minimum }}</strong>
              </p>
            </b-col>
          </b-row>
        </li>
        <li class="list-group-item">
          <h3>Vault Default Settings</h3>
          <hr />
          <b-form-fieldset
            :horizontal="true"
            :label-cols="3"
            description="Your default inventory Auto Vault password length"
            label="Default Pasword Length"
          >
            <b-form-input
              type="number"
              v-model="settings.default_password_length"
            ></b-form-input>
          </b-form-fieldset>
          <b-form-fieldset
            :horizontal="true"
            :label-cols="3"
            description="Your default inventory Auto Vault password chars"
            label="Default Pasword Chars"
          >
            <b-form-input
              type="text"
              v-model="settings.default_password_chars"
            ></b-form-input>
          </b-form-fieldset>
          <b-form-fieldset
            :horizontal="true"
            :label-cols="3"
            description="Your default inventory Auto Vault password length"
            label="Default Refreshing"
          >
            <b-row>
              <b-col md="6">
                <label center>Refresh Time</label>
                <p-select
                  v-model="autoModeTime"
                  placeholder="Select time"
                  :options="times"
                  :show-labels="true"
                >
                  <template slot="singleLabel" slot-scope="prop">
                    <span class="option__title">
                      {{ prop.option }}
                    </span>
                  </template>
                </p-select>
              </b-col>
              <b-col md="6">
                <label center>Refresh Time Type</label>
                <p-select
                  v-model="selectedAutoModeType"
                  placeholder="Select Type"
                  :options="autoModeTypes"
                  :show-labels="true"
                >
                  <template slot="singleLabel" slot-scope="prop">
                    <span class="option__title">
                      {{ prop.option }}
                    </span>
                  </template>
                </p-select>
              </b-col>
            </b-row>
          </b-form-fieldset>
          <b-row>
            <b-col class="d-flex justify-content-end">
              <b-button v-on:click="saveSettings" variant="success">
                Save Settings
              </b-button>
            </b-col>
          </b-row>
        </li>
        <li class="list-group-item">
          <h3>Vault Check Out Settings</h3>
          <hr />
          <b-form-fieldset
            :horizontal="true"
            :label-cols="3"
            description="Specify the reset time for the check out process"
            label="Reset time for check out"
          >
            <b-form-input type="number" v-model="checkTime"></b-form-input>
          </b-form-fieldset>
          <b-row>
            <b-col class="d-flex justify-content-end">
              <b-button
                :disabled="!checkTime"
                v-on:click="saveCheckSettings"
                variant="success"
              >
                Save Settings
              </b-button>
            </b-col>
          </b-row>
        </li>
      </ul>
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
      total: 0,
      minimum: 0,
      sealed: false,
      userRole: "",
      autoModeTypes: ["hour", "day", "week", "month", "year"],
      times: [],
      autoModeTime: 1,
      selectedAutoModeType: "day",
      credential: "",
      settings: {
        default_password_length: 16,
        default_password_chars:
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
        default_password_refreshing: 86400,
      },
      checkTime: "",
      loading: true,
    };
  },
  methods: {
    saveSettings() {
      if (this.selectedAutoModeType == "hour") {
        this.settings.default_password_refreshing = 3600 * this.autoModeTime;
      } else if (this.selectedAutoModeType == "day") {
        this.settings.default_password_refreshing = 86400 * this.autoModeTime;
      } else if (this.selectedAutoModeType == "week") {
        this.settings.default_password_refreshing = 604800 * this.autoModeTime;
      } else if (this.selectedAutoModeType == "month") {
        this.settings.default_password_refreshing = 2629743 * this.autoModeTime;
      } else if (this.selectedAutoModeType == "year") {
        this.settings.default_password_refreshing =
          31556926 * this.autoModeTime;
      }
      let data = [
        {
          tag: "default_password_length",
          value: this.settings.default_password_length,
        },
        {
          tag: "default_password_chars",
          value: this.settings.default_password_chars,
        },
        {
          tag: "default_password_refreshing",
          value: this.settings.default_password_refreshing,
        },
        {
          tag: "default_password_refreshing_type",
          value: this.selectedAutoModeType,
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
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Update operation has error!";
        });
    },
    saveCheckSettings() {
      let data = [
        {
          tag: "break_check_out_time",
          value: this.checkTime,
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
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Update operation has error!";
        });
    },
  },
  created() {
    for (let i = 1; i < 101; i++) {
      this.times.push(i);
    }
    this.$http
      .get("/api/v1/user/who")
      .then((response) => {
        this.userRole = response.data.role;
      })
      .catch((error) => {
        console.log(error);
      });
    this.$http
      .get("/api/v1/vault/status")
      .then((response) => {
        this.total = response.data.n;
        this.minimum = response.data.t;
        this.sealed = response.data.sealed;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
    this.$http
      .get("/api/v1/settings/vaultautosettings")
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].tag === "default_password_length") {
            this.settings.default_password_length = response.data[i].value;
          }
          if (response.data[i].tag === "default_password_chars") {
            this.settings.default_password_chars = response.data[i].value;
          }
          if (response.data[i].tag === "default_password_refreshing_type") {
            this.selectedAutoModeType = response.data[i].value;
          }
          if (response.data[i].tag === "default_password_refreshing") {
            this.settings.default_password_refreshing = response.data[i].value;
          }
          if (response.data[i].tag === "break_check_out_time") {
            this.checkTime = response.data[i].value;
          }
        }
        let seconds = this.settings.default_password_refreshing;
        if (this.selectedAutoModeType === "hour") {
          this.autoModeTime = seconds / 3600;
        } else if (this.selectedAutoModeType === "day") {
          this.autoModeTime = seconds / 86400;
        } else if (this.selectedAutoModeType === "week") {
          this.autoModeTime = seconds / 604800;
        } else if (this.selectedAutoModeType === "month") {
          this.autoModeTime = seconds / 2629743;
        } else if (this.selectedAutoModeType === "year") {
          this.autoModeTime = seconds / 31556926;
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
