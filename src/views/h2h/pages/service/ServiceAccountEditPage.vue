<template>
  <div class="animated fadeIn">
    <p-card>
      <div v-if="errorStatus">
        <p-error
          header="Something went wrong!"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
      </div>
      <div v-else-if="errorStatusEdit">
        <p-error
          header="Edit operation has error!"
          :errorResponse="errorResponse"
          @reload="editAccount"
        />
      </div>
      <ul v-else class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Edit a Account</h3>
              <p>
                You can edit a local account to use on the respective service.
              </p>
            </b-col>
            <b-col sm="8">
              <b-tabs pills card>
                <b-tab title="Credential">
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

                  <b-form-group
                    v-if="selectedPassType === 'P'"
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
                  <b-row class="my-4">
                    <b-col cols="4"></b-col>
                    <b-col cols="8" class="d-flex justify-content-end">
                      <b-button
                        :disabled="$v.formdata.$invalid"
                        variant="success"
                        class="mr-2"
                        @click="editAccount"
                        >Edit Account</b-button
                      >
                      <b-button variant="primary">Clear</b-button>
                    </b-col>
                  </b-row>
                </b-tab>
                <b-tab title="Assignment">
                  <b-form-group
                    description="Select the users to whom the alarm will be sent"
                    horizontal
                  >
                    <label for="inputLive">Users</label>
                    <p-select
                      :options="users"
                      label="username"
                      placeholder="Select Users"
                      v-model.trim="formdata.users"
                      :multiple="true"
                      :custom-label="customLabel"
                      track-by="userId"
                      :close-on-select="false"
                    >
                      <template slot="singleLabel" slot-scope="props">
                        <span class="option__title">{{
                          props.option.username
                        }}</span>
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
                                :profileUsername="props.option.username"
                                :username="
                                  props.option.first_name +
                                  ' ' +
                                  props.option.last_name
                                "
                                :size="30"
                                :imageWidth="'30px'"
                                :imageHeight="'auto'"
                              />
                            </div>
                          </span>
                        </div>
                      </template>
                    </p-select>
                    <b-form-invalid-feedback>
                      <div v-if="!$v.formdata.users.required">
                        Users is required.
                      </div>
                    </b-form-invalid-feedback>
                  </b-form-group>
                  <b-row class="my-4">
                    <b-col cols="4"></b-col>
                    <b-col cols="8" class="d-flex justify-content-end">
                      <b-button
                        :disabled="$v.formdata.$invalid"
                        variant="success"
                        class="mr-2"
                        @click="editAccount"
                        >Edit Account</b-button
                      >
                      <b-button variant="primary">Clear</b-button>
                    </b-col>
                  </b-row>
                </b-tab>
              </b-tabs>
            </b-col>
          </b-row>
        </li>
      </ul>
    </p-card>
  </div>
</template>

<script>
//internet explorer için polyfill gerekli yoksa hata veriyor
import "babel-polyfill";

import { required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  props: ["id", "accountId"],
  components: {},
  data() {
    return {
      errorStatus: false,
      errorStatusEdit: false,
      errorResponse: "",
      user: {
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
          text: '<i class="fa fa-key fa-1x"></i> Password',
          value: "P",
        },
        {
          text: '<i class="fa fa-certificate fa-1x"></i> Key',
          value: "K",
        },
      ],
      options: [],
      formdata: {
        users: [],
      },
    };
  },
  mixins: [validationMixin],
  validations: {
    formdata: {
      users: {
        required,
      },
    },
  },
  methods: {
    addTag(newTag) {
      let data = {
        username: newTag,
        first_name: "userone",
        last_name: "baba",
      };
      this.users.push(data);
      this.formdata.users.push(data);
    },
    customLabel({ first_name, last_name, username }) {
      return `${first_name} ${last_name} (${username})`;
    },
    editAccount() {
      let data = {
        users: this.formdata.users,
      };

      this.$http
        .post("/api/v1/service/service/account/assign/" + this.accountId, data)
        .then((response) => {
          this.$bvToast.toast(`Updated local account members`, {
            title: "Service Account Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.$router.push({
            name: "Local Accounts",
            params: { id: this.id },
          });
        })
        .catch((error) => {
          this.errorStatusEdit = true;
          this.errorResponse = error;
          this.$bvToast.toast(`Something went wrong!`, {
            title: "Service Account Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
          console.log(error);
        });
    },
    /*
    addRegexField() {
      if (
        this.regexFields.length == 0 ||
        this.regexFields[this.regexFields.length - 1].regex != ""
      ) {
        this.regexFields.push({
          command: "SELECT",
          regex: "",
        });
      }
    },
    deleteEmailfield(index) {
      if (index > -1) this.regexFields.splice(index, 1);
    },
    */
  },
  created() {
    this.$http
      .get("/api/v1/service/members/" + this.id)
      .then((response) => {
        response.data.forEach((element) => {
          this.users.push(element.user);
        });
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
      });

    this.$http
      .get("/api/v1/service/service/account/assign/" + this.accountId)
      .then((response) => {
        this.formdata.users = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
      });
  },
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
  .fade-leave-to

    /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
