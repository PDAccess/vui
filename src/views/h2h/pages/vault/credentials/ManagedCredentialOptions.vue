<template>
  <p-card class="p-4" role="tablist">
    <div class="mb-1">
      <b-row>
        <b-col lg="10">
          <h5>General Settings</h5>
        </b-col>
        <b-col lg="2">
          <b-button
            @click="changeTabStatus(!hostPortTabStatus, false, false, false, false, false)"
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
                  current host and port data, if you want see this data use must
                  Break The Glass
                </p>
              </b-col>
              <b-col sm="8">
                <div class="padd">
                  <b-form-fieldset
                    description="Your credential name"
                    label="Name"
                  >
                    <b-form-input
                      placeholder="Name"
                      v-model="credential.name"
                    ></b-form-input>
                  </b-form-fieldset>
                    <b-form-fieldset
                    description="Your credential group"
                    label="Group"
                  >
                    <p-select
                      placeholder="Credential Group"
                      :options="groups"
                      v-model="selectedGroup"
                      track-by="groupId"
                      label="groupname"
                      :disabled="true"
                    />
                  </b-form-fieldset>

                  <b-form-fieldset description="Your credential service">
                    <label center>Service</label>
                    <p-select
                      v-model="selectedService"
                      :options="services"
                      track-by="inventoryId"
                      placeholder="Credential Service"
                      :taggable="true"
                      :custom-label="customLabelServices"
                      :show-labels="false"
                      :disabled="true"
                    >
                    </p-select>
                  </b-form-fieldset>
                  <b-form-fieldset description="Credential type for manage">
                    <label center>Credential Type</label>
                    <p-select
                      v-model="credential.credentialType"
                      :options="['account', 'other']"
                      placeholder="Select Credential Type"
                      :taggable="true"
                      :show-labels="false"
                    >
                    </p-select>
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
                  <b-form-fieldset
                    description="Your credentials check status"
                    label="Check Status"
                  >
                    <label class="switch switch-3d switch-primary">
                      <input
                        checked
                        class="switch-input"
                        type="checkbox"
                        v-model="credential.checkStatus"
                      />
                      <span class="switch-slider"></span>
                    </label>
                  </b-form-fieldset>
                  <b-form-fieldset
                    description="Your credentials manage status"
                    label="Manage Status"
                  >
                    <label class="switch switch-3d switch-primary">
                      <input
                        checked
                        class="switch-input"
                        type="checkbox"
                        v-model="credential.manageStatus"
                      />
                      <span class="switch-slider"></span>
                    </label>
                  </b-form-fieldset>
                  <div class="d-flex justify-content-end mt-2">
                    <b-button
                      :disabled="!isValidForm"
                      @click="updateCredential"
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
          <h5>Password Management</h5>
        </b-col>
        <b-col lg="2">
          <b-button
            @click="changeTabStatus(false, !editTabStatus, false, false, false, false)"
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
                  You can activate the Credential password management process
                  and specify certain settings and management details.
                </p>
              </b-col>
              <b-col sm="8">
                <b-form-group
                  label="Auto Password Management"
                  description="Edit Service name for Group"
                  horizontal
                >
                  <label class="switch switch-3d switch-primary">
                    <input
                      type="checkbox"
                      class="switch-input"
                      v-model="isAutoPasswordManagement"
                    />
                    <span class="switch-slider"></span>
                  </label>
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
                <b-row>
                  <b-col md="6">
                    <b-form-group
                      id="refreshTime"
                      horizontal
                      label="Refresh Time Type"
                      label-for="refreshingTime"
                      label-text-align="left"
                      description="Input the Refreshing time"
                    >
                      <p-select
                        v-model="selectedAutoModeType"
                        placeholder="Select Type"
                        :options="autoModeTypes"
                        :show-labels="true"
                        :disabled="!isAutoPasswordManagement"
                      >
                        <template slot="singleLabel" slot-scope="prop">
                          <span class="option__title">
                            {{ prop.option }}
                          </span>
                        </template>
                      </p-select>
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <b-form-group
                      id="refreshTime"
                      horizontal
                      label="Refresh Time"
                      label-for="refreshingTime"
                      label-text-align="left"
                      description="Input the Refreshing time"
                    >
                      <b-form-input
                        type="number"
                        id="refresh-time-input"
                        aria-describedby="refresh-time-input-help refresh-time-input-feedback"
                        min="1"
                        :state="state()"
                        v-model="autoModeTime"
                        :disabled="!isAutoPasswordManagement"
                      ></b-form-input>
                      <b-form-invalid-feedback id="refresh-time-input-feedback">
                        Please enter numbers greater than 0
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col sm="4"></b-col>
              <b-col sm="8" class="d-flex justify-content-end">
                <b-button
                  @click="saveAutoPasswordManagement"
                  :disabled="autoModeTime < 1 || selectedAutoModeType == null"
                  variant="success"
                  class="mr-2"
                  >Save</b-button
                >
                <b-button @click="clearForm" variant="primary">Clear</b-button>
              </b-col>
            </b-row>
          </div>
        </b-card>
      </b-collapse>
    </div>
    <hr/>
    <div class="mb-1">
      <b-row>
        <b-col lg="10">
          <h5>Credential Management</h5>
        </b-col>
        <b-col lg="2">
          <b-button
            @click="changeTabStatus(false, false, false, false, false, !manageTabStatus)"
            v-b-toggle.editCredentialManageArea
            :variant="manageTabStatus ? 'danger' : 'primary'"
            style="width: 100%"
            >{{ manageTabStatus ? "Collapse" : "Expand" }}</b-button
          >
        </b-col>
      </b-row>
      <b-collapse
        id="editCredentialManageArea"
        accordion="settings-accordion"
        role="tabpanel"
      >
        <b-card class="mt-3">
          <div class="animated fadeIn">
            <b-row>
              <b-col sm="4">
                <p>
                  You can activate the Credential password management process
                  and specify certain settings and management details.
                </p>
              </b-col>
              <b-col sm="8">
                <b-row>
                  <b-col md="6">
                    <b-form-group
                      id="refreshTime"
                      horizontal
                      label="Refresh Time Type"
                      label-for="refreshingTime"
                      label-text-align="left"
                      description="Input the Refreshing time"
                    >
                      <p-select
                        v-model="selectedManageAutoModeType"
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
                    </b-form-group>
                  </b-col>
                  <b-col md="6">
                    <b-form-group
                      id="refreshTime"
                      horizontal
                      label="Refresh Time"
                      label-for="refreshingTime"
                      label-text-align="left"
                      description="Input the Refreshing time"
                    >
                      <b-form-input
                        type="number"
                        id="refresh-time-input"
                        aria-describedby="refresh-time-input-help refresh-time-input-feedback"
                        min="1"
                        :state="stateManage()"
                        v-model="manageAutoModeTime"
                      ></b-form-input>
                      <b-form-invalid-feedback id="refresh-time-input-feedback">
                        Please enter numbers greater than 0
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col sm="4"></b-col>
              <b-col sm="8" class="d-flex justify-content-end">
                <b-button
                  @click="saveManage"
                  :disabled="manageAutoModeTime < 1 || selectedManageAutoModeType == null"
                  variant="success"
                  class="mr-2"
                  >Save</b-button
                >
                <b-button @click="clearForm" variant="primary">Clear</b-button>
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
          <h5>Credential Delete</h5>
        </b-col>
        <b-col lg="2">
          <b-button
            @click="changeTabStatus(false, false, !deleteTabStatus, false, false, false)"
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
                    <p>Are you sure delete this credential?</p>
                    <p>Credential Name: {{ credential.name }}</p>
                  </b-col>
                  <b-col sm="8">
                    <p>
                      To delete this credential, you must do write the first 3
                      characters of the Credential Username!
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
                            !credential.name ||
                            this.deleteconfirmtext.substring(0, 3) !=
                              credential.name.substring(0, 3)
                          "
                          @click.stop="deleteCredential()"
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
  </p-card>
</template>

<script>
import { minLength, required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

import {
  CredentialsApi,
} from "@/generated/cmanager/index.ts";

export default {
  props: ["id"],
  data() {
    return {
      checkStatus: false,
      selectedLocalAccount: null,
      localAccounts: [],
      selectedGroup: null,
      groups: [],
      selectedService: null,
      services: [],
      isAutoPasswordManagement: false,
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      defaultConnectionUser: false,
      defaultHostPath: "",
      proxyHostPath: "",
      hostPortTabStatus: false,
      editTabStatus: false,
      manageTabStatus: false,
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
      selectedManageAutoModeType: "day",
      manageAutoModeTime: 1,
      field: "",
      password: "",
      key: "",
      passphrase: "",
      username: "",
      credential: {},
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
        },
      };
    }
  },
  watch: {
    selectedGroup(value) {
      this.formdata.account = null;
      this.localAccounts = [];
      this.selectedLocalAccount = null;
      if (value != null) {
        this.getConnectionUsers(value.groupId);
      }
    },
  },
  computed: {
    isValidForm() {
      return this.credential.name && this.selectedGroup && this.credential.credentialType
    }
  },
  methods: {
    customLabelServices({ name, serviceTypeLogo }) {
      return `${name} (${serviceTypeLogo})`;
    },
    saveManage() {
      let seconds;
      if (this.selectedManageAutoModeType == "hour") {
        seconds = 3600 * this.manageAutoModeTime;
      } else if (this.selectedManageAutoModeType == "day") {
        seconds = 86400 * this.manageAutoModeTime;
      } else if (this.selectedManageAutoModeType == "week") {
        seconds = 604800 * this.manageAutoModeTime;
      } else if (this.selectedManageAutoModeType == "month") {
        seconds = 2629743 * this.manageAutoModeTime;
      } else if (this.selectedManageAutoModeType == "year") {
        seconds = 31556926 * this.manageAutoModeTime;
      }
      let data = {
        autoCredentialTime: seconds,
        autoCredentialTimeType: this.selectedAutoModeType,
      };
      this.$http
        .post("/api/v1/auto/credential/manage/" + this.id, data)
        .then((response) => {
          this.$bvToast.toast(`Credential manage updated successfully`, {
            title: "Credential Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          this.errorStatus = true;
        });
    },
    getAutoTimeValue(type, seconds) {
      console.log("Time value");
      console.log(type);
      console.log(seconds);
      let value = 1;
      if (type == "hour") {
        value = seconds / 3600;
      } else if (type == "day") {
        value = seconds / 86400;
      } else if (type == "week") {
        value = seconds / 604800;
      } else if (type == "month") {
        value = seconds / 2629743;
      } else if (type == "year") {
        value = seconds / 31556926;
      }
      return value;
    },
    saveAutoPasswordManagement() {
      let seconds;
      if (this.selectedAutoModeType == "hour") {
        seconds = 3600 * this.autoModeTime;
      } else if (this.selectedAutoModeType == "day") {
        seconds = 86400 * this.autoModeTime;
      } else if (this.selectedAutoModeType == "week") {
        seconds = 604800 * this.autoModeTime;
      } else if (this.selectedAutoModeType == "month") {
        seconds = 2629743 * this.autoModeTime;
      } else if (this.selectedAutoModeType == "year") {
        seconds = 31556926 * this.autoModeTime;
      }
      let data = {
        enabled: this.isAutoPasswordManagement,
        autoCredentialTime: seconds,
        autoCredentialTimeType: this.selectedAutoModeType,
      };
      this.$http
        .post("/api/v1/auto/credential/" + this.id, data)
        .then((response) => {
          this.$bvToast.toast(`Auto Credential updated successfully`, {
            title: "Credential Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          this.errorStatus = true;
        });
    },
    deleteCredential() {
      new CredentialsApi(this.$cmanagerHttpConfig, undefined, this.$http).deleteCredential(this.id)
      .then((response) => {
        this.$router.push({ path: "/vault/nav/list" });
        })
        .catch((error) => {
          this.errorStatus = true;
        });
    },
    updateCredential() {
      if (this.selectedGroup) {
        this.credential.groupId = this.selectedGroup.groupId;
      }

      if (this.selectedService) {
        this.credential.serviceId = this.selectedService.inventoryId
      }

      new CredentialsApi(this.$cmanagerHttpConfig, undefined, this.$http).updateCredential(this.id, {credential: this.credential})
      .then((response) => {
        })
        .catch((error) => {
          this.errorStatus = true;
        });
    },
    getConnectionUsers(groupId) {
      this.$http
        .get("/api/v1/group/connection-users/" + groupId)
        .then((response) => {
          this.localAccounts = response.data;
          this.loading = false;
          this.selectedLocalAccount = this.localAccounts.filter(
            (account) => this.credential.account.id == account.id
          )[0];
        })
        .catch((error) => {
          this.errorStatus = true;
        });
    },
    getCredentialDetail() {
      this.isLoading = true;
      new CredentialsApi(this.$cmanagerHttpConfig, undefined, this.$http).getCredentialsById(this.id)
      .then((response) => {
          this.credential = response.data.credential;
          this.isLoading = false;
          this.getGroups();
          this.getServices();
        })
        .catch((error) => {
          this.errorState = true;
        });
    },
    changeDefaultUserSetting() {
      this.defaultConnectionUser = !this.defaultConnectionUser;
      let servicePropertyData = {
        serviceId: this.id,
        key: "use-default-connection-user",
        value: this.defaultConnectionUser,
      };
      this.$http
        .post("/api/service/saveproperty", servicePropertyData)
        .then(() => {
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeVideoRecord() {
      this.info.video_record = !this.info.video_record;
      let status = this.info.video_record ? "enable/" : "disable/";
      this.$http
        .post("/api/servicerecord/" + status + this.id)
        .then((response) => {
          this.$bvToast.toast(
            `Video Record ` + (this.info.video_record ? "Enabled" : "Disabled"),
            {
              title: "Service Notification",
              variant: "info",
              autoHideDelay: 5000,
            }
          );
        })
        .catch((error) => {
          console.log(error);
          this.info.video_record = !this.info.video_record;
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
      credentialTabStatus,
      manageTabStatus
    ) {
      this.hostPortTabStatus = hostPortTabStatus;
      this.editTabStatus = editTabStatus;
      this.deleteTabStatus = deleteTabStatus;
      this.sessionTabStatus = sessionTabStatus;
      this.credentialTabStatus = credentialTabStatus;
      this.manageTabStatus = manageTabStatus;
    },
    updateHostPort() {
      let data = {
        host: this.defaultHostName,
        port: this.defaultHostPort,
        id: this.$route.params.id,
        path: this.defaultHostPath,
      };
      this.$http
        .put("/api/updatehostport", data)
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
    },
    updateService() {
      this.updateStatus = true;

      let formData = new FormData();
      formData.append("service_name", this.formdata.service_name);
      formData.append("service_description", this.formdata.service_description);
      this.$http
        .put("/api/service/" + this.id, formData)
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
        .post("/api/service/saveproperty", this.serviceTimeoutParams)
        .then((response) => {
          this.$bvToast.toast(`Maximum Session Time Updated!`, {
            title: "Service Notification",
            variant: "info",
            autoHideDelay: 5000,
          });
          this.serviceTimeoutParams.key = "idle-timeout";
          this.serviceTimeoutParams.value = this.idleTimoutMinute;
          this.$http
            .post("/api/service/saveproperty", this.serviceTimeoutParams)
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
    getServices() {
      this.$http
      .get(`/api/v1/service/admin`)
      .then((response) => {
        this.services = response.data;
        this.selectedService = this.services.filter(
            (service) => this.credential.service == service.inventoryId
          )[0];
      })
      .catch((error) => {
        console.log(error);
      });
    },
    getGroups() {
      this.$http
        .get("/api/v1/group")
        .then((response) => {
          this.loading = false;
          this.groups = response.data;
          this.selectedGroup = this.groups.filter(
            (group) => this.credential.group == group.groupId
          )[0];
        })
        .catch((error) => {
          this.errorStatus = true;
        });
    },
    state() {
      return this.autoModeTime >= 1;
    },
    stateManage() {
      return this.manageAutoModeTime >= 1;
    }
  },
  created() {
    this.getCredentialDetail();
  },
};
</script>

<style>
</style>