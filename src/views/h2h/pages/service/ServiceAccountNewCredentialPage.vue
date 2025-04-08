<template>
  <div class="animated fadeIn">
    <p-card>
      <p-error
        v-if="errorStatus"
        header="List operation has error!"
        @reload="$router.go()"
      />
      <p-loading v-else-if="loading" class="my-5" message="Loading..." />
      <ul v-else class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Create Credential</h3>
              <p>
                You can manage your credentials by creating specific
                credentials. You can also set permissions and users to restrict
                the management of your Credentials.
              </p>
            </b-col>
            <b-col sm="8">
              <div>
                <form>
                  <b-form-group description="Add Username for User" horizontal>
                    <label>Username</label>
                    <b-form-input
                      placeholder="Username"
                      type="text"
                      v-model="formdata.username"
                      disabled
                    ></b-form-input>
                  </b-form-group>
                  <b-form-fieldset
                    description="Choose a service type"
                    horizontal
                    id="pass-type"
                    label="Authentication Type"
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
                  <b-form-group
                    v-if="selectedPassType === 'P'"
                    description="Add password for User"
                    horizontal
                  >
                    <label>Password</label>
                    <b-form-input
                      placeholder="Password"
                      type="password"
                      v-model="formdata.password"
                    ></b-form-input>
                  </b-form-group>
                  <b-form-group v-else description="Add key for User">
                    <label>Key</label>
                    <b-form-textarea
                      :max-rows="8"
                      :rows="6"
                      id="textarea1"
                      v-model="formdata.key"
                      placeholder="Key"
                    ></b-form-textarea>
                  </b-form-group>
                  <template v-if="keyValues.length > 0">
                    <b-form-group>
                      <b-row>
                        <b-col cols="5">
                          <label>Key:</label>
                        </b-col>
                        <b-col cols="5">
                          <label>Value:</label>
                        </b-col>
                      </b-row>
                    </b-form-group>
                    <b-form-group>
                      <b-row :key="index" v-for="(data, index) in keyValues">
                        <b-col cols="5">
                          <b-form-input v-model="data.key" placeholder="key">
                          </b-form-input>
                        </b-col>
                        <b-col cols="6">
                          <b-form-input
                            v-model="data.value"
                            placeholder="value"
                          >
                          </b-form-input>
                        </b-col>
                        <b-col cols="1">
                          <b-button
                            @click="deleteKeyValue(data)"
                            variant="danger"
                          >
                            <em class="fa fa-trash"></em>
                          </b-button>
                        </b-col>
                      </b-row>
                    </b-form-group>
                  </template>
                  <b-form-group>
                    <b-button
                      @click="addKeyValueData"
                      style="width: 100%"
                      variant="outline-primary"
                    >
                      <em class="fa fa-plus-circle mr-2"></em>Add Key/Value Data
                    </b-button>
                  </b-form-group>
                  <b-form-group
                    v-if="id == undefined"
                    description="Add group for Credential"
                  >
                    <label center>Select Group</label>
                    <p-select
                      id="groupadd"
                      v-model="selectedGroup"
                      :options="groups"
                      track-by="groupId"
                      placeholder="Select Group"
                      label="groupname"
                      :show-labels="false"
                      :preserve-search="true"
                      :searchable="true"
                    >
                      <template slot="singleLabel" slot-scope="props">
                        <span class="option__title">
                          {{ props.option.groupname }}
                        </span>
                      </template>
                      <template slot="option" slot-scope="props">
                        <div class="option__desc">
                          <span class="option__title">
                            <div
                              class="
                                d-flex
                                justify-content-start
                                align-items-center
                              "
                            >
                              <p-profile-avatar
                                :rounded="false"
                                :size="40"
                                :username="props.option.groupname"
                              ></p-profile-avatar>
                              <span class="ml-1">{{
                                props.option.groupname
                              }}</span>
                            </div>
                          </span>
                        </div>
                      </template>
                    </p-select>
                  </b-form-group>
                  <b-form-group description="Add service for User">
                    <label center>Select Service</label>
                    <p-select
                        v-model="selectedServices"
                        :options="services"
                        track-by="inventoryId"
                        placeholder="Select Services"
                        :multiple="true"
                        :taggable="true"
                        @tag="addTag"
                        :custom-label="customLabelServices"
                        :show-labels="false"
                      >
                        <template slot="singleLabel" slot-scope="props">
                          <span class="option__title">{{
                            props.option.name
                          }}</span>
                        </template>
                        <template slot="option" slot-scope="props">
                          <div class="option__desc">
                            <span class="option__title">
                              {{ props.option.name }}
                              <span>
                                <b-badge
                                  pill
                                  :variant="
                                    badgeVariant(props.option.service_type_id)
                                  "
                                  >{{ props.option.serviceTypeLogo }}</b-badge
                                >
                              </span>
                            </span>
                          </div>
                        </template>
                      </p-select>
                  </b-form-group>
                  <b-form-group
                    description="Set check in mechanism"
                    label="Check Status"
                  >
                    <label class="switch switch-3d switch-primary">
                      <input
                        checked
                        class="switch-input"
                        type="checkbox"
                        v-model="checkStatus"
                      />
                      <span class="switch-slider"></span>
                    </label>
                  </b-form-group>
                </form>
              </div>
            </b-col>
          </b-row>
          <b-row class="my-4">
            <b-col cols="4"></b-col>
            <b-col cols="8" class="d-flex justify-content-end">
              <b-button
                :disabled="$v.formdata.$invalid || isInvalidGroup"
                variant="success"
                class="mr-2"
                @click="createAccount"
                >Create Account
              </b-button>
              <b-button variant="primary">Clear</b-button>
            </b-col>
          </b-row>
        </li>
      </ul>
    </p-card>
  </div>
</template>

<script>
import "babel-polyfill";

import { required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { mapActions, mapGetters } from "vuex";

export default {
  props: ["id"],
  computed: {
    ...mapGetters({
      userDto: "util/selectedUserPermission",
    }),
    isInvalidGroup() {
      return this.id == undefined && this.selectedGroup == null;
    },
  },
  data() {
    return {
      selectedServices: [],
      services: [],
      checkStatus: false,
      groups: [],
      selectedGroup: null,
      localAccounts: [],
      title: "From Scratch",
      description: "You can create a credential.",
      locked: false,
      credentialUser: {
        username: "",
        password: "",
        passwordConfirm: "",
      },
      isTemplate: false,
      options: [],
      users: [],
      selectedUsers: [],
      selectedServices: [],
      usersOptions: [],
      services: [],
      showPassword: false,
      errorStatus: false,
      loading: true,
      formdata: {
        username: "",
        password: "",
        key: "",
        users: [],
        account: null,
      },
      keyValues: [],
      permissions: [
        { label: "Can connection", value: "CONNECT", enable: false },
        { label: "Can see password", value: "SEE_PASSWORD", enable: false },
        {
          label: "Can change password ",
          value: "CHANGE_PASSWORD",
          enable: false,
        },
        {
          label: "Can authorize other users",
          value: "CAN_AUTHORIZE_OTHER_USERS",
          enable: false,
        },
        {
          label: "Can join sessions",
          value: "CAN_JOIN_SESSIONS",
          enable: false,
        },
        {
          label: "Can connection with request permission",
          value: "CAN_CONNECTION_WITH_REQUEST_PERMISSION",
          enable: false,
        },
        {
          label: "Can manage other users",
          value: "CAN_MANAGE_OTHER_USERS",
          enable: false,
        },
      ],
      passwordType: [
        {
          text: '<i class="fa fa-key fa-1x"></i> Password',
          value: "P",
        },
        {
          text: '<i class="fa fa-certificate fa-1x"></i> Key',
          value: "K",
        },
      ],
      selectedPassType: "P",
    };
  },
  mixins: [validationMixin],
  validations() {
    if (this.selectedPassType == "P") {
      return {
        formdata: {
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
        formdata: {
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
  watch: {
    selectedGroup(value) {
      if (value != null) {
        this.getConnectionUsers(value.groupId);
      } else {
        this.formdata.account = null;
        this.localAccounts = [];
      }
    },
  },
  methods: {
    badgeVariant(id) {
      let variant;
      switch (id) {
        case 1:
          variant = "primary";
          break;
        case 2:
          variant = "secondary";
          break;
        case 3:
          variant = "success";
          break;
        case 4:
          variant = "danger";
          break;
        case 5:
          variant = "warning";
          break;
        case 6:
          variant = "info";
          break;
        case 7:
          variant = "light";
          break;
        default:
          variant = "dark";
      }
      return variant;
    },
    customLabel({ username, serviceEntity }) {
      return `${username} - ${serviceEntity.name}`;
    },
    customLabelServices({ name, serviceTypeLogo }) {
      return `${name} (${serviceTypeLogo})`;
    },
    getConnectionUsers(groupId) {
      this.$http
        .get("/api/v1/group/connection-users/" + groupId)
        .then((response) => {
          this.localAccounts = response.data;
          this.loading = false;
        })
        .catch((error) => {
          this.errorStatus = true;
        });
    },
    addKeyValueData() {
      this.keyValues.push({
        key: "",
        value: "",
      });
    },
    deleteKeyValue(item) {
      this.keyValues.splice(this.keyValues.indexOf(item), 1);
    },
    ...mapActions({
      setSelectedUserPermission: "util/setSelectedUserPermission",
    }),
    modelIsValid() {
      return (
        this.credentialUser.username !== "" &&
        this.credentialUser.password !== "" &&
        this.credentialUser.passwordConfirm !== ""
      );
    },
    addTag(newTag) {
      let data = {
        username: newTag,
      };
      this.users.push(data);
      this.formdata.users = data;
    },
    customLabelService({ name }) {
      return `${name}`;
    },
    addTag1(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.value.push(tag);
    },
    createAccount() {

      let services = [];
      for (let i = 0; i < this.selectedServices.length; i++) {
          services.push(this.selectedServices[i].inventoryId);
      }

      let groupId = this.id == undefined ? this.selectedGroup.groupId : this.id;
      let data = {
        username: this.formdata.username,
        password: this.formdata.password,
        key: this.formdata.key,
        keyValues: this.keyValues,
        account: this.formdata.account,
        groupId: groupId,
        check: this.checkStatus,
        services: services
      };

      this.$http
        .post("/api/v1/credentials/manage", data)
        .then((response) => {
          this.$router.push({ path: "/vault/nav/list" });
        })
        .catch((error) => {
          this.errorStatus = true;
        });
    },
  },
  destroyed() {
    this.setSelectedUserPermission(null);
  },
  created() {
    this.$http.get(`/api/v1/service/admin`)
    .then(response => {
      this.services = response.data;
    }).catch(error => {
      console.log(error);
    });

    this.$http.get("/api/v1/service/account/" + this.id)
    .then(response => {
        let account = response.data;
        this.formdata.username = account.username;
        this.formdata.account = account;
        this.loading = false;
    }).catch(error => {

    })
  },
};
</script>
<style>
.tab-content {
  border: none;
}

.card-header {
  background-color: #fff;
}
</style>
