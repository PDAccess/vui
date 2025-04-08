<template>
  <div class="animated fadeIn">
    <p-card>
      <div v-if="errorStatus">
        <p-error
          :header="errorHeader"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
      </div>
      <div v-else-if="errorStatusCreate">
        <p-error
          :header="errorHeader"
          :errorResponse="errorResponse"
          @reload="createAccount"
        />
      </div>
      <ul v-else class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Create a Account</h3>
              <p>
                You can create a local account to use on the respective service.
              </p>
            </b-col>
            <b-col sm="8">
              <b-form-group
                description="Select the users to whom the alarm will be sent"
                horizontal
              >
                <label>Users</label>
                <p-select
                  :options="users"
                  label="username"
                  placeholder="Select Users"
                  v-model.trim="formdata.users"
                  :multiple="false"
                  :custom-label="customLabel"
                  track-by="username"
                  :close-on-select="true"
                  :taggable="true"
                  @tag="addTag"
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
                          <span class="ml-1">{{ props.option.username }}</span>
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
            </b-col>
          </b-row>
          <b-row class="my-4">
            <b-col cols="4"></b-col>
            <b-col cols="8" class="d-flex justify-content-end">
              <b-button
                :disabled="$v.formdata.$invalid"
                variant="success"
                class="mr-2"
                @click="createAccount"
                >Create Account</b-button
              >
              <b-button variant="primary">Clear</b-button>
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
  props: ["id"],
  components: {},
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      errorStatusCreate: false,
      options: [],
      users: [],
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
      };
      this.users.push(data);
      this.formdata.users = data;
    },
    customLabel({ first_name, last_name, username }) {
      return `${first_name} ${last_name} (${username})`;
    },
    createAccount() {
      let data = new FormData();
      data.append("username", this.formdata.users.username);

      let username = this.formdata.users.username;

      this.$http
        .post(
          "/api/v1/service/connection-users/" +
            this.id +
            "?username=" +
            username
        )
        .then((response) => {
          this.$bvToast.toast(`Created Account`, {
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
          console.log(error.status);
          if (error.status === 409) {
            this.$bvToast.toast(`Account already registered`, {
              title: "Service Account Notification",
              variant: "warning",
              autoHideDelay: 5000,
            });
          } else {
            this.errorStatusCreate = true;
            this.errorResponse = error;
            this.errorHeader = "Create operation has error!";
          }
          console.log(error);
          this.errorStatusCreate = true;
          this.errorResponse = error;
          this.errorHeader = "Create operation has error!";
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
      .get("/api/v1/service/connection-users/" + this.id)
      .then((response) => {
        console.log(response.data);
        this.users = response.data;
        this.loading = false;
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
