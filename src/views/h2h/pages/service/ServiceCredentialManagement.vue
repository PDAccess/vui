<template>
  <div class="animated fadeIn">
    <p-card v-if="errorStatus">
      <p-error
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
    </p-card>
    <p-card v-else>
      <b-list-group flush>
        <b-list-group-item :active="credential == 'transparent'">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Transparent</h3>
              <p>
                In Transparent mode PDAccess will use users login credentials
              </p>
            </b-col>
            <b-col sm="8">
              <b-form-radio-group
                v-show="credential != 'transparent'"
                id="radios2"
                v-model="selected"
                name="radioSubComponent"
              >
                <b-form-radio value="transparent"
                  >Select Transparent mode</b-form-radio
                >
              </b-form-radio-group>
            </b-col>
          </b-row>
        </b-list-group-item>

        <b-list-group-item :active="credential == 'vault'">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Vault</h3>
              <p>
                In Vault mode PDAccess will store credentials and allows to
                change it.
              </p>
            </b-col>
            <b-col sm="8">
              <b-form-radio-group
                v-show="credential != 'vault'"
                id="radios2"
                v-model="selected"
                name="radioSubComponent"
              >
                <b-form-radio value="vault">Select Vault mode</b-form-radio>
              </b-form-radio-group>

              <div class="d-flex justify-content-end mt-2">
                <b-button
                  v-show="credential == 'vault'"
                  class="mb-1"
                  variant="success"
                  @click.stop="editCredential"
                  >Edit Credentials</b-button
                >
              </div>
              <div
                class="mt-2"
                v-show="selected == 'vault'"
                style="width: -webkit-fill-available"
              >
                <b-button
                  v-b-toggle.collapse-admin
                  :variant="credential == 'vault' ? 'light' : 'primary'"
                  class="mb-1"
                  style="width: 100%"
                  ><em class="fa fa-lock mr-1" aria-hidden="true"></em>
                  {{ admin.username }}</b-button
                >
                <b-collapse id="collapse-admin">
                  <b-card>
                    <b-form-group
                      id="usernameGroup"
                      horizontal
                      label=""
                      label-for="username"
                      label-text-align="left"
                      description="We will use username to access inventory."
                    >
                      <b-form-input
                        id="123"
                        type="text"
                        disabled
                        v-model="admin.username"
                        placeholder="username"
                      ></b-form-input>
                    </b-form-group>

                    <div v-show="serviceType == 5">
                      <b-form-group
                        id="pass-type"
                        horizontal
                        label=""
                        label-for="service-type"
                        label-text-align="left"
                        description="Choose a service type"
                      >
                        <b-form-radio-group
                          id="passwordtypebutton"
                          buttons
                          button-variant="outline-info"
                          class="mb-1"
                          v-model="selectedPassType"
                          :options="passwordType"
                          name="service-meta-type"
                        />
                      </b-form-group>
                    </div>

                    <b-form-group
                      v-if="selectedPassType == 'P'"
                      id="passwordGroup"
                      horizontal
                      label=""
                      label-for="password"
                      label-text-align="left"
                      description="We will use password to access inventory for changing it"
                    >
                      <b-form-input
                        type="password"
                        v-model="admin.password"
                        placeholder="password"
                      ></b-form-input>
                    </b-form-group>

                    <b-form-group
                      v-if="selectedPassType == 'K'"
                      id="passwordGroup2"
                      horizontal
                      label="Key"
                      label-for="password"
                      label-text-align="left"
                    >
                      <b-form-textarea
                        id="textarea1"
                        v-model="admin.key"
                        :rows="6"
                        :max-rows="6"
                      >
                      </b-form-textarea>
                    </b-form-group>

                    <b-form-group
                      v-if="selectedPassType == 'K'"
                      id="passwordGroup3"
                      horizontal
                      label="Passpharasse"
                      label-for="password"
                      label-text-align="left"
                      description="The private key must be in OpenSSH format, as would be generated by the OpenSSH ssh-keygen utility."
                    >
                      <b-form-input
                        type="password"
                        v-model="admin.passphrase"
                        placeholder="passphrase"
                      ></b-form-input>
                    </b-form-group>
                  </b-card>
                </b-collapse>
                <hr />
                <div :key="index" v-for="(user, index) in users">
                  <b-row class="d-flex justify-content-between">
                    <b-col cols="11">
                      <b-button
                        @click="user.visible = !user.visible"
                        class="mb-1"
                        style="width: 100%"
                        :variant="
                          credential == 'vault'
                            ? user.visible
                              ? 'light'
                              : 'outline-light'
                            : user.visible
                            ? 'primary'
                            : 'outline-primary'
                        "
                      >
                        {{ user.username }}
                      </b-button>
                    </b-col>
                    <b-col cols="1"
                      ><b-button
                        variant="danger"
                        @click="deleteUser(index, user)"
                        ><em class="fa fa-trash" /></b-button
                    ></b-col>
                  </b-row>
                  <b-collapse v-model="user.visible" class="mb-1">
                    <b-card>
                      <b-form-group
                        id="usernameGroup"
                        horizontal
                        label=""
                        label-for="username"
                        label-text-align="left"
                        description="We will use username to access inventory."
                      >
                        <b-form-input
                          id="123"
                          type="text"
                          disabled
                          v-model="user.username"
                          placeholder="username"
                        ></b-form-input>
                      </b-form-group>

                      <div v-show="serviceType == 5">
                        <b-form-group
                          id="pass-type"
                          horizontal
                          label=""
                          label-for="service-type"
                          label-text-align="left"
                          description="Choose a service type"
                        >
                          <b-form-radio-group
                            id="passwordtypebutton"
                            buttons
                            button-variant="outline-info"
                            class="mb-1"
                            v-model="selectedPassType"
                            :options="passwordType"
                            name="service-meta-type"
                          />
                        </b-form-group>
                      </div>

                      <b-form-group
                        v-if="selectedPassType == 'P'"
                        id="passwordGroup"
                        horizontal
                        label=""
                        label-for="password"
                        label-text-align="left"
                        description="We will use password to access inventory for changing it"
                      >
                        <b-form-input
                          type="password"
                          v-model="user.password"
                          placeholder="password"
                        ></b-form-input>
                      </b-form-group>

                      <b-form-group
                        v-if="selectedPassType == 'K'"
                        id="passwordGroup2"
                        horizontal
                        label="Key"
                        label-for="password"
                        label-text-align="left"
                      >
                        <b-form-textarea
                          id="textarea1"
                          v-model="user.key"
                          :rows="6"
                          :max-rows="6"
                        >
                        </b-form-textarea>
                      </b-form-group>

                      <b-form-group
                        v-if="selectedPassType == 'K'"
                        id="passwordGroup3"
                        horizontal
                        label="Passpharasse"
                        label-for="password"
                        label-text-align="left"
                        description="The private key must be in OpenSSH format, as would be generated by the OpenSSH ssh-keygen utility."
                      >
                        <b-form-input
                          type="password"
                          v-model="user.passphrase"
                          placeholder="passphrase"
                        ></b-form-input>
                      </b-form-group>
                    </b-card>
                  </b-collapse>
                </div>
                <b-button
                  v-b-toggle.collapse-1
                  :variant="credential == 'vault' ? 'light' : 'primary'"
                  style="width: 100%"
                  ><em class="fa fa-plus-circle mr-1" aria-hidden="true"></em>
                  Add User</b-button
                >
                <b-collapse id="collapse-1" class="mt-2">
                  <b-card>
                    <b-form-fieldset
                      description="We will use username to access inventory."
                      horizontal
                      id="usernameGroup"
                      label=""
                      label-for="username"
                      label-text-align="left"
                    >
                      <b-form-input
                        :state="
                          !$v.newUser.username.$dirty
                            ? null
                            : !$v.newUser.username.$invalid
                        "
                        id="username"
                        placeholder="username"
                        type="text"
                        v-model.trim="$v.newUser.username.$model"
                      ></b-form-input>
                      <b-form-invalid-feedback>
                        <div v-if="!$v.newUser.username.required">
                          Field is required.
                        </div>
                      </b-form-invalid-feedback>
                    </b-form-fieldset>

                    <div v-show="serviceType == 5">
                      <b-form-fieldset
                        description="Choose a service type"
                        horizontal
                        id="pass-type"
                        label=""
                        label-for="service-type"
                        label-text-align="left"
                      >
                        <b-form-radio-group
                          :options="passwordType"
                          button-variant="outline-primary"
                          buttons
                          class="mb-1"
                          id="passwordtypebutton"
                          name="service-meta-type"
                          size="md"
                          v-model="selectedPassType"
                        />
                      </b-form-fieldset>
                    </div>
                    <b-form-fieldset
                      description="We will use password to access inventory for changing it"
                      horizontal
                      id="passwordGroup"
                      label=""
                      label-for="password"
                      label-text-align="left"
                      v-if="selectedPassType == 'P'"
                    >
                      <b-form-input
                        :state="
                          !$v.newUser.password.$dirty
                            ? null
                            : !$v.newUser.password.$invalid
                        "
                        :type="passType"
                        placeholder="password"
                        v-model.trim="$v.newUser.password.$model"
                      ></b-form-input>
                      <b-form-invalid-feedback>
                        <div v-if="!$v.newUser.password.required">
                          Field is required.
                        </div>
                      </b-form-invalid-feedback>
                    </b-form-fieldset>

                    <b-form-fieldset
                      horizontal
                      id="passwordGroup2"
                      label="Key"
                      label-for="password"
                      label-text-align="left"
                      v-if="selectedPassType == 'K'"
                    >
                      <b-form-textarea
                        :max-rows="8"
                        :rows="6"
                        id="textarea1"
                        v-model="$v.newUser.key.$model"
                      ></b-form-textarea>
                      <b-form-invalid-feedback>
                        <div v-if="!$v.newUser.key.required">
                          Field is required.
                        </div>
                      </b-form-invalid-feedback>
                    </b-form-fieldset>

                    <b-form-fieldset
                      description="The private key must be in OpenSSH format, as would be generated by the OpenSSH ssh-keygen utility."
                      horizontal
                      id="passwordGroup3"
                      label="Passphrase"
                      label-for="password"
                      label-text-align="left"
                      v-if="selectedPassType == 'K'"
                    >
                      <b-form-input
                        id="passphrase"
                        type="text"
                        v-model="newUser.passphrase"
                      ></b-form-input>
                    </b-form-fieldset>
                    <b-row>
                      <b-col class="d-flex justify-content-end">
                        <b-button
                          @click="addUser"
                          :disabled="$v.newUser.$invalid"
                          variant="success"
                          ><em class="fa fa-plus mr-1" />Add</b-button
                        >
                      </b-col>
                    </b-row>
                  </b-card>
                </b-collapse>
              </div>
            </b-col>
          </b-row>
        </b-list-group-item>

        <b-list-group-item :active="credential == 'auto'">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Auto</h3>
              <p>
                In Auto mode PDAccess will manage credentials
                itself(recomended).
              </p>
            </b-col>
            <b-col sm="8">
              <b-form-radio-group
                v-show="credential != 'auto'"
                id="radios2"
                v-model="selected"
                name="radioSubComponent"
              >
                <b-form-radio value="auto">Select Auto mode</b-form-radio>
              </b-form-radio-group>

              <div class="d-flex justify-content-end mt-2">
                <b-button
                  v-show="credential == 'auto'"
                  class="mb-1"
                  variant="success"
                  @click.stop="selected = 'auto'"
                  >Edit Credantial Scheculed</b-button
                >
              </div>
              <div
                v-show="selected == 'auto'"
                style="width: -webkit-fill-available"
              >
                <b-row>
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
                      ></b-form-input>
                      <b-form-invalid-feedback id="refresh-time-input-feedback">
                        Please enter numbers greater than 0
                      </b-form-invalid-feedback>
                    </b-form-group>
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
              </div>
            </b-col>
          </b-row>
        </b-list-group-item>
      </b-list-group>

      <div class="d-flex justify-content-end mt-2">
        <b-button
          v-show="selected == 'transparent'"
          :disabled="locked"
          variant="success"
          @click.stop="setMode()"
          >Save</b-button
        >
        <b-button
          v-show="!(selected == 'transparent') && selectedPassType == 'P'"
          :disabled="locked || selected == ''"
          variant="success"
          @click.stop="setMode()"
          >Save</b-button
        >
        <b-button
          v-show="!(selected == 'transparent') && selectedPassType == 'K'"
          :disabled="locked || selected == ''"
          variant="success"
          @click.stop="setMode()"
          >Save</b-button
        >
        <b-button
          class="ml-2"
          :disabled="locked || selected == ''"
          variant="danger"
          @click.stop="cancel()"
          >Cancel</b-button
        >
      </div>
    </p-card>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  props: ["id"],
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
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
      locked: true,
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
      };
    }
  },
  watch: {},
  methods: {
    getConnectionUsers() {
      this.users = [];
      this.$http
        .get("/api/v1/service/connection-users/" + this.id)
        .then((response) => {
          console.log(response.data);
          response.data.forEach((user) => {
            if (user.admin) {
              this.admin = {
                id: user.id,
                username: user.username,
                password: "",
                key: "",
                passphrase: "",
              };
            } else {
              this.users.push({
                id: user.id,
                username: user.username,
                password: "",
                key: "",
                passphrase: "",
                deletable: user.deletable,
              });
            }
          });
          this.tempAdmin = JSON.parse(JSON.stringify(this.admin));
          this.tempUsers = JSON.parse(JSON.stringify(this.users));
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteUser(index, user) {
      if (user.deletable) {
        this.users.splice(index, 1);
      } else {
        this.$bvToast.toast(
          `Please remove all assignments before deleting the ${user.username} user`,
          {
            title: "User Could Not Delete",
            variant: "danger",
            autoHideDelay: 5000,
          }
        );
      }
    },
    addUser() {
      this.users.push({
        username: this.newUser.username,
        password: this.newUser.password,
        key: this.newUser.key,
        passphrase: this.newUser.passphrase,
      });

      this.newUser = {
        username: "",
        password: "",
        key: "",
        passphrase: "",
      };
    },
    editCredential() {
      this.selected = "vault";
    },
    state() {
      return this.autoModeTime >= 1;
    },
    cancel() {
      this.selected = "";
      this.field = "";
      this.users = JSON.parse(JSON.stringify(this.tempUsers));
      this.admin = JSON.parse(JSON.stringify(this.tempAdmin));
    },
    setMode() {
      if (this.state()) {
        let o = {
          username: this.username,
          password: this.password,
          credential: this.selected,
          key: this.key,
          passphrase: this.passphrase,
        };

        this.$http
          .post("/api/changecredential/" + this.id, o)
          .then((response) => {
            console.log(this.selected);
            if (this.selected == "auto") {
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
                autoCredentialTime: seconds,
                autoCredentialTimeType: this.selectedAutoModeType,
              };
              this.$http
                .post("/api/v1/auto/credential/" + this.id, data)
                .then((response2) => {
                })
                .catch((error) => {
                  console.log("autocredantial error", error);
                  this.errorStatus = true;
                  this.errorResponse = error;
                  this.errorHeader = "Something went wrong!";
                });
            } else if (this.selected != "auto") {
              if (this.selected == "vault") {
                let addedUsers = [];
                let deletedUsers = [];
                let editUsers = [];

                this.users.forEach((user) => {
                  if (!user.id) {
                    addedUsers.push({
                      username: user.username,
                      password: user.password,
                      credential: user.selected,
                      key: user.key,
                      passphrase: user.passphrase,
                    });
                  } else if (user.password || user.key) {
                    editUsers.push({
                      id: user.id,
                      username: user.username,
                      password: user.password,
                      credential: user.selected,
                      key: user.key,
                      passphrase: user.passphrase,
                    });
                  }
                });

                this.tempUsers.forEach((tmpUser) => {
                  if (tmpUser.id) {
                    let isDeleted = true;
                    this.users.forEach((user) => {
                      if (tmpUser.id == user.id) {
                        isDeleted = false;
                        return;
                      }
                    });

                    if (isDeleted) {
                      deletedUsers.push({
                        id: tmpUser.id,
                        username: tmpUser.username,
                        password: tmpUser.password,
                        credential: tmpUser.selected,
                        key: tmpUser.key,
                        passphrase: tmpUser.passphrase,
                      });
                    }
                  }
                });

                let dataCredential = {
                  admin:
                    this.admin.password || this.admin.key ? this.admin : null,
                  add_users: addedUsers,
                  edit_users: editUsers,
                  delete_users: deletedUsers,
                };

                this.$http
                  .post(
                    "/api/service/change-credentials/" + this.id,
                    dataCredential
                  )
                  .then(() => {
                    this.getConnectionUsers();
                  })
                  .catch((error) => {
                    console.log(error);
                    this.errorStatus = true;
                    this.errorResponse = error;
                    this.errorHeader = "Something went wrong!";
                  });
              }

              this.$http
                .delete("/api/v1/auto/credential/" + this.id)
                .then((response2) => {
                  console.log(response2);
                })
                .catch((error) => {
                  console.log("autocredantial error", error);
                  this.errorStatus = true;
                  this.errorResponse = error;
                  this.errorHeader = "Something went wrong!";
                });
            }

            this.credential = this.selected;
            this.selected = "";
            this.$bvToast.toast(`Credantial settings changed successfully`, {
              title: "Credantial Notification",
              variant: "success",
              autoHideDelay: 5000,
            });
          })
          .catch((error) => {
            console.log(error);
            this.errorStatus = true;
            this.errorResponse = error;
            this.errorHeader = "Something went wrong!";
          });
      } else {
        this.$bvToast.toast(`Please enter numbers greater than 0`, {
          title: "Credantial Notification",
          variant: "error",
          autoHideDelay: 5000,
        });
      }
    },
  },
  created() {
    this.$http
      .get("/api/v1/user/who")
      .then((response) => {
        this.user = response.data;
        if (this.user.role == "Admin") {
          this.locked = false;
        } else {
          this.locked = true;
        }
      })
      .catch((error) => {
        console.log(error);
      });

    this.$http
      .get("/api/v1/service/id/" + this.id)
      .then((response) => {
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
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    this.getConnectionUsers();
  },
};
</script>
