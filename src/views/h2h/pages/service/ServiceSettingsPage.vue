<template>
  <p-card class="p-4" role="tablist">
    <p-loading
      v-if="loadingRole || loadingService"
      class="my-5"
      message="Loading..."
    />
    <p-error
      v-else-if="errorStatus"
      :header="errorHeader"
      :errorResponse="errorResponse"
      @reload="$router.go()"
    />
    <template v-else>
      <div class="mb-1">
        <b-row>
          <b-col lg="10">
            <h5>Service Host & Port Settings</h5>
          </b-col>
          <b-col lg="2">
            <b-button
              @click="changeTabStatus(!hostPortTabStatus, false, false, false)"
              v-b-toggle.hostPortUpdateArea
              :variant="hostPortTabStatus ? 'danger' : 'primary'"
              style="width: 100%"
              >{{ hostPortTabStatus ? "Collapse" : "Expand" }}</b-button
            >
          </b-col>
        </b-row>
        <b-collapse
          id="hostPortUpdateArea"
          accordion="settings-accordion"
          role="tabpanel"
        >
          <b-card class="mt-3">
            <div class="animated fadeIn">
              <b-row class="my-1">
                <b-col sm="4">
                  <p>
                    You can update service host and port but we will not see
                    current host and port data, if you want see this data use
                    must Break The Glass
                  </p>
                </b-col>
                <b-col sm="8">
                  <div class="padd">
                    <b-form-fieldset
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
                    <b-form-fieldset
                      v-if="serviceType === 10"
                      description="Your default PDAccess Service path"
                      label="Path"
                    >
                      <b-form-input
                        :disabled="locked"
                        placeholder="https://website.com"
                        type="text"
                        v-model="defaultHostPath"
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
            </div>
          </b-card>
        </b-collapse>
      </div>
      <hr />
      <div class="mb-1">
        <b-row>
          <b-col lg="10">
            <h5>Service Edit</h5>
          </b-col>
          <b-col lg="2">
            <b-button
              @click="changeTabStatus(false, !editTabStatus, false, false)"
              v-b-toggle.editServiceArea
              :variant="editTabStatus ? 'danger' : 'primary'"
              style="width: 100%"
              >{{ editTabStatus ? "Collapse" : "Expand" }}</b-button
            >
          </b-col>
        </b-row>
        <b-collapse
          id="editServiceArea"
          accordion="settings-accordion"
          role="tabpanel"
        >
          <b-card class="mt-3">
            <div class="animated fadeIn">
              <b-row>
                <b-col sm="4">
                  <p>
                    You can make updates about your service by changing the name
                    and description of the specified service
                  </p>
                </b-col>
                <b-col sm="8">
                  <b-form-group
                    description="Edit Service name for Group"
                    horizontal
                  >
                    <label>Name</label>
                    <b-form-input
                      :state="
                        !$v.formdata.service_name.$dirty
                          ? null
                          : !$v.formdata.service_name.$invalid
                      "
                      placeholder
                      type="text"
                      v-model.trim="$v.formdata.service_name.$model"
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      <div v-if="!$v.formdata.service_name.required">
                        Service name is required.
                      </div>
                      <div v-if="!$v.formdata.service_name.minLength">
                        Service name must have at least
                        {{
                          $v.formdata.service_name.$params.minLength.min -
                          formdata.service_name.length
                        }}
                        more letters.
                      </div>
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="4"></b-col>
                <b-col sm="8">
                  <b-form-group
                    description="Edit Service description for Group"
                    horizontal
                  >
                    <label>Description</label>
                    <b-form-input
                      :state="
                        !$v.formdata.service_description.$dirty
                          ? null
                          : !$v.formdata.service_description.$invalid
                      "
                      placeholder
                      type="text"
                      v-model.trim="$v.formdata.service_description.$model"
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      <div v-if="!$v.formdata.service_description.required">
                        Service description is required.
                      </div>
                      <div v-if="!$v.formdata.service_description.minLength">
                        Service description must have at least
                        {{
                          $v.formdata.service_description.$params.minLength
                            .min - formdata.service_name.length
                        }}
                        more letters.
                      </div>
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="4"></b-col>
                <b-col sm="8">
                  <b-form-group
                    description="Edit Service version for Group"
                    horizontal
                  >
                    <label>Version</label>
                    <b-form-input
                      placeholder
                      type="number"
                      v-model.trim="$v.formdata.service_version.$model"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row class="mt-2">
                <b-col sm="4"></b-col>
                <b-col sm="8" class="d-flex justify-content-end">
                  <b-button
                    @click="updateService"
                    :disabled="$v.formdata.$invalid || updateStatus"
                    variant="success"
                    class="mr-2"
                    >Update Service</b-button
                  >
                  <b-button @click="clearForm" variant="primary"
                    >Clear</b-button
                  >
                </b-col>
              </b-row>
            </div>
          </b-card>
        </b-collapse>
      </div>
      <hr />
      <div class="mb-1" v-if="info.name !== 'PDA' && userRole === 'Admin'">
        <b-row>
          <b-col lg="10">
            <h5>Service Delete</h5>
          </b-col>
          <b-col lg="2">
            <b-button
              @click="changeTabStatus(false, false, !deleteTabStatus, false)"
              v-b-toggle.deleteServiceArea
              :variant="deleteTabStatus ? 'danger' : 'primary'"
              style="width: 100%"
              >{{ deleteTabStatus ? "Collapse" : "Expand" }}</b-button
            >
          </b-col>
        </b-row>
        <b-collapse
          id="deleteServiceArea"
          accordion="settings-accordion"
          role="tabpanel"
        >
          <b-card class="mt-3">
            <div class="animated fadeIn">
              <b-list-group flush>
                <b-list-group-item>
                  <b-row class="my-1">
                    <b-col sm="4">
                      <p>Are you sure delete this service?</p>
                      <p>Service name: {{ info.name }}</p>
                    </b-col>
                    <b-col sm="8">
                      <p>
                        To delete this service, you must do write the first 3
                        characters of the Service Name!
                      </p>
                      <b-form-input
                        class="mb-4"
                        type="text"
                        v-model="deleteconfirmtext"
                      ></b-form-input>
                      <b-row>
                        <b-col class="d-flex justify-content-end">
                          <b-button
                            :disabled="
                              this.deleteconfirmtext.substring(0, 3) !=
                              info.name.substring(0, 3)
                            "
                            @click.stop="deleteService()"
                            class="btn btn-danger"
                            >Delete</b-button
                          >
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                </b-list-group-item>
              </b-list-group>
            </div>
          </b-card>
        </b-collapse>
        <hr />
      </div>
      <div class="mb-1" v-if="info.name !== 'PDA' && userRole === 'Admin'">
        <b-row>
          <b-col lg="10">
            <h5>Service Video Record</h5>
          </b-col>
          <b-col lg="2">
            <b-button
              @click="changeVideoRecord"
              :variant="info.videoRecord ? 'primary' : 'danger'"
              style="width: 100%"
              >{{ info.videoRecord ? "Disable" : "Enable" }}</b-button
            >
          </b-col>
        </b-row>
        <hr />
      </div>
      <div class="mb-1">
        <b-row>
          <b-col lg="10">
            <h5>Service Maximum Session & Idle Timeout</h5>
          </b-col>
          <b-col lg="2">
            <b-button
              @click="changeTabStatus(false, false, false, !sessionTabStatus)"
              v-b-toggle.sessionTimeArea
              :variant="sessionTabStatus ? 'danger' : 'primary'"
              style="width: 100%"
              >{{ sessionTabStatus ? "Collapse" : "Expand" }}</b-button
            >
          </b-col>
        </b-row>
        <b-collapse
          id="sessionTimeArea"
          accordion="settings-accordion"
          role="tabpanel"
        >
          <b-card class="mt-3">
            <div class="animated fadeIn">
              <b-row class="my-1">
                <b-col sm="4">
                  <p>
                    You can update service session maximum time and idle
                    timeout.
                  </p>
                </b-col>
                <b-col sm="8">
                  <div class="padd">
                    <b-form-fieldset
                      description="Default maximum session time value 30 minute"
                      :label="getMaxSessionLabel(maxSessionMinute)"
                    >
                      <b-form-input
                        placeholder="pdaccess.com"
                        type="range"
                        :min="minSessionTimeLimit"
                        :max="maxSessionTimeLimit"
                        v-model="maxSessionMinute"
                      ></b-form-input>
                    </b-form-fieldset>
                    <b-form-fieldset
                      description="Default timeout value 5 minute"
                      :label="getTimeOutLabel(idleTimoutMinute)"
                    >
                      <b-form-input
                        placeholder="pdaccess.com"
                        type="range"
                        :min="minSessionIdleTimeOutLimit"
                        :max="maxSessionIdleTimeOutLimit"
                        v-model="idleTimoutMinute"
                      ></b-form-input>
                    </b-form-fieldset>

                    <div class="d-flex justify-content-end mt-2">
                      <b-button
                        :disabled="locked"
                        @click="updateServiceTimeout"
                        class="mt-2"
                        variant="success"
                        >Update</b-button
                      >
                    </div>
                  </div>
                </b-col>
              </b-row>
            </div>
          </b-card>
        </b-collapse>
        <hr />
      </div>
    </template>
  </p-card>
</template>

<script>
import { minLength, required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  props: ["id"],
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      defaultConnectionUser: false,
      defaultHostPath: "",
      proxyHostPath: "",
      hostPortTabStatus: false,
      editTabStatus: false,
      deleteTabStatus: false,
      sessionTabStatus: false,
      credentialTabStatus: false,
      defaultHostName: "",
      defaultHostPort: "",
      proxyHostName: "",
      proxyHostPort: "",
      useSameSettings: "use",
      visible: false,
      locked: true,
      edit: false,
      maxSessionTimeLimit: 1440,
      minSessionTimeLimit: 0,
      maxSessionIdleTimeOutLimit: 1440,
      minSessionIdleTimeOutLimit: 0,
      maxSessionMinute: 15,
      idleTimoutMinute: 15,
      text: `
          Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry
          richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor
          brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon
          tempor, sunt aliqua put a bird on it squid single-origin coffee nulla
          assumenda shoreditch et.
        `,
      oldServiceName: "",
      updateStatus: false,
      loadingRole: true,
      loadingService: true,
      formdata: {
        service_name: "",
        service_description: "",
        service_version: ""
      },
      userRole: "User",
      info: {
        name: "",
      },
      deleteconfirmtext: "",
      serviceTimeoutParams: {
        serviceId: this.id,
        key: "",
        value: "",
      },
      newUser: {
        username: "",
        password: "",
        key: "",
        passphrase: "",
      },
      admin: {},
      tempAdmin: {},
      users: [],
      tempUsers: [],
      connectionUsers: [],
      selectedConnectionUser: {},
      mode: "",
      serviceType: "",
      selectedPassType: "P",
      passType: "password",
      autoModeTypes: ["hour", "day", "week", "month", "year"],
      autoModeTime: 1,
      selectedAutoModeType: "day",
      field: "",
      password: "",
      key: "",
      passphrase: "",
      username: "",
      credential: "",
      selected: "",
      service: {},
      passwordType: [
        {
          text: '<em class="fa fa-key fa-1x"></em> Password',
          value: "P",
        },
        {
          text: '<em class="fa fa-certificate fa-1x"></em> Key',
          value: "K",
        },
      ],
    };
  },
  mixins: [validationMixin],
  validations() {
    if (this.selectedPassType == "P") {
      return {
        newUser: {
          username: {
            required,
          },
          password: {
            required,
          },
        },
        formdata: {
          service_name: {
            required,
            minLength: minLength(3),
          },
          service_description: {
            required,
            minLength: minLength(3),
          },
          service_version: {}
        },
      };
    } else {
      return {
        newUser: {
          username: {
            required,
          },
          key: {
            required,
          },
        },
        formdata: {
          service_name: {
            required,
            minLength: minLength(3),
          },
          service_description: {
            required,
            minLength: minLength(3),
          },
          service_version: {}
        },
      };
    }
  },
  methods: {
    changeDefaultUserSetting() {
      this.defaultConnectionUser = !this.defaultConnectionUser;
      let servicePropertyData = {
        serviceId: this.id,
        key: "use-default-connection-user",
        value: this.defaultConnectionUser,
      };
      this.$http
        .post("/api/v1/service/property/save", servicePropertyData)
        .then(() => {
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeVideoRecord() {
      this.info.videoRecord = !this.info.videoRecord;
      let status = this.info.videoRecord ? "enable/" : "disable/";
      this.$http
        .post("/api/v1/service/record/" + status + this.id)
        .then((response) => {
          this.$bvToast.toast(
            `Video Record ` + (this.info.videoRecord ? "Enabled" : "Disabled"),
            {
              title: "Service Notification",
              variant: "info",
              autoHideDelay: 5000,
            }
          );
        })
        .catch((error) => {
          console.log(error);
          this.info.videoRecord = !this.info.videoRecord;
          this.$bvToast.toast(
            `The video record could not be changed. Try again.`,
            {
              title: "Service Notification",
              variant: "danger",
              autoHideDelay: 5000,
            }
          );
        });
    },
    changeTabStatus(
      hostPortTabStatus,
      editTabStatus,
      deleteTabStatus,
      sessionTabStatus,
      credentialTabStatus
    ) {
      this.hostPortTabStatus = hostPortTabStatus;
      this.editTabStatus = editTabStatus;
      this.deleteTabStatus = deleteTabStatus;
      this.sessionTabStatus = sessionTabStatus;
      this.credentialTabStatus = credentialTabStatus;
    },
    updateHostPort() {
      let data = {
        host: this.defaultHostName,
        port: this.defaultHostPort,
        id: this.$route.params.id,
        path: this.defaultHostPath,
      };
      this.$http
        .put("/api/v1/service/host", data)
        .then(() => {
          this.$bvToast.toast(`Host Ip / Port / Path updated!`, {
            title: "Service Notification",
            variant: "info",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
          this.$bvToast.toast(`Something went wrong!`, {
            title: "Service Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
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
    setProxySettings() {
      if (this.useSameSettings === "use") {
        this.proxyHostName = this.defaultHostName;
        this.proxyHostPort = this.defaultHostPort;
        this.proxyHostPath = this.defaultHostPath;
      } else {
        this.proxyHostName = "";
        this.proxyHostPort = "";
        this.defaultHostPath = "";
      }
    },
    clearForm() {
      this.formdata.service_name = "";
      this.formdata.service_description = "";
      this.formdata.service_version = "";
    },
    updateService() {
      this.updateStatus = true;

      let formData = new FormData();
      formData.append("service_name", this.formdata.service_name);
      formData.append("service_description", this.formdata.service_description);
      formData.append("service_version", this.formdata.service_version);
      this.$http
        .put("/api/v1/service/" + this.id, formData)
        .then((response) => {
          this.$bvToast.toast(`Service successfully updated`, {
            title: "Update Success",
            variant: "info",
            autoHideDelay: 5000,
          });
          this.updateStatus = false;
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Update operation has error!";
          this.$bvToast.toast(`Error while updating the service`, {
            title: "Update Failed",
            variant: "danger",
            autoHideDelay: 5000,
          });
          this.updateStatus = false;
        });
    },
    deleteService() {
      this.$http
        .delete("api/v1/service/" + this.id)
        .then((response) => {
          if (response.status == 200) {
            this.$http
              .get("/api/v1/service/id/" + this.id)
              .then((response2) => {
                console.log("asdasdasd ", response2.data);
                if (response2.data.credantial == "auto") {
                  this.$http
                    .delete("/api/v1/auto/credential/" + this.id)
                    .then((response3) => {
                      console.log(response3);
                    })
                    .catch((error) => {
                      this.errorStatus = true;
                      this.errorResponse = error;
                      this.errorHeader = "Delete operation has error!";
                    });
                }
              })
              .catch((error) => {
                console.log(error);
                this.errorStatus = true;
                this.errorResponse = error;
                this.errorHeader = "Delete operation has error!";
              });
            this.$http
              .get("/api/v1/playbook/deleteservice/" + this.id)
              .then((response2) => {
                console.log("silindi");
              })
              .catch((error) => {
                console.log(error);
                this.errorStatus = true;
                this.errorResponse = error;
                this.errorHeader = "Delete operation has error!";
              });
            this.$bvToast.toast(`Deleted service!`, {
              title: "Service Notification",
              variant: "info",
              autoHideDelay: 5000,
            });
            this.$router.push(
              this.$route.query.redirect || "/service/nav/list"
            );
          }
        })
        .catch(function (error) {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Delete operation has error!";
        });
    },
    updateServiceTimeout() {
      this.serviceTimeoutParams.serviceId = this.id;
      this.serviceTimeoutParams.key = "maximum-session";
      this.serviceTimeoutParams.value = this.maxSessionMinute;
      this.$http
        .post("/api/v1/service/property/save", this.serviceTimeoutParams)
        .then((response) => {
          this.$bvToast.toast(`Maximum Session Time Updated!`, {
            title: "Service Notification",
            variant: "info",
            autoHideDelay: 5000,
          });
          this.serviceTimeoutParams.key = "idle-timeout";
          this.serviceTimeoutParams.value = this.idleTimoutMinute;
          this.$http
            .post("/api/v1/service/property/save", this.serviceTimeoutParams)
            .then((res) => {
              this.$bvToast.toast(`Idle Timeout Updated!`, {
                title: "Service Notification",
                variant: "info",
                autoHideDelay: 5000,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    state() {
      return this.autoModeTime >= 1;
    },
  },
  created() {
    this.$http
      .get("/api/v1/user/who")
      .then((response) => {
        this.userRole = response.data.role;
        this.user = response.data;
        if (this.user.role === "Admin") {
          this.locked = false;
          this.visible = true;
        } else {
          this.locked = true;
        }
        this.loadingRole = false;
      })
      .catch((error) => {
        console.log(error);
      });

    this.$http
      .get("/api/v1/service/id/" + this.id)
      .then((response) => {
        this.oldServiceName = response.data.name;
        this.formdata.service_name = response.data.name;
        this.formdata.service_description = response.data.description;
        this.formdata.service_version = response.data.operatingSystemVersion;
        this.info = response.data;
        this.loadingService = false;
        this.service = response.data;
        this.credential = this.service.credantial;
        this.serviceType = response.data.service_type_id;
        if (this.credential == "auto") {
          this.$http
            .get("/api/v1/auto/credential/" + this.id)
            .then((response2) => {
              let seconds = response2.data.autoCredantialTime;
              this.selectedAutoModeType = response2.data.autoCredantialTimeType;
              console.log(response2.data.autoCredantialTime);
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
            });
        } else {
          this.$http
            .get("/api/v1/settings/vaultautosettings")
            .then((response2) => {
              for (let i = 0; i < response2.data.length; i++) {
                if (
                  response2.data[i].tag === "default_password_refreshing_type"
                ) {
                  this.selectedAutoModeType = response2.data[i].value;
                }
                if (response2.data[i].tag === "default_password_refreshing") {
                  this.autoModeTime = response2.data[i].value;
                }
              }
              let seconds = this.autoModeTime;
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
        }
        this.$http
          .get(
            `/api/v1/service/property/get?serviceid=${
              this.id
            }&key=${"use-default-connection-user"}`
          )
          .then((responseDefaultConnection) => {
            let data = responseDefaultConnection.data;
            if (data.value === "true") this.defaultConnectionUser = true;
            else this.defaultConnectionUser = false;
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });

    this.$http
      .get("/api/v1/service/host/" + this.id)
      .then((responseHostPort) => {
        if (responseHostPort.status === 200) {
          this.defaultHostName = responseHostPort.data.host;
          this.defaultHostPort = responseHostPort.data.port;
          this.defaultHostPath = responseHostPort.data.path;
        }
      })
      .catch((error) => {
        console.log(error);
      });
    this.$http
      .get(
        "/api/v1/service/property/get?serviceid=" +
          this.id +
          "&key=idle-timeout"
      )
      .then((response) => {
        if (response.status == 200) {
          this.idleTimoutMinute = parseInt(response.data.value);
        }
      })
      .catch((error) => {
        this.idleTimoutMinute = 10;
        console.log(error);
      });
    this.$http
      .get(
        "/api/v1/service/property/get?serviceid=" +
          this.id +
          "&key=maximum-session"
      )
      .then((response) => {
        if (response.status == 200) {
          this.maxSessionMinute = parseInt(response.data.value);
        }
      })
      .catch((error) => {
        this.maxSessionMinute = 10;
        console.log(error);
      });
  },
};
</script>
