<template>
  <div class="animated fadeIn">
    <p-card>
      <p-error
        v-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <ul v-else class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Create a User</h3>
              <p>
                Create users to use your modules and manage human resources
                effectively.
              </p>
            </b-col>
            <b-col sm="8">
              <b-row>
                <b-col>
                  <b-form-group
                    description="Add first name for User"
                    horizontal
                  >
                    <label for="inputLive">First Name</label>
                    <b-form-input
                      :state="
                        !$v.formdata.first_name.$dirty
                          ? null
                          : !$v.formdata.first_name.$invalid
                      "
                      placeholder
                      type="text"
                      v-model.trim="$v.formdata.first_name.$model"
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      <div v-if="!$v.formdata.first_name.required">
                        First name is required.
                      </div>
                      <div v-if="!$v.formdata.first_name.minLength">
                        First name must have at least
                        {{
                          $v.formdata.first_name.$params.minLength.min -
                          formdata.first_name.length
                        }}
                        more letters.
                      </div>
                      <div v-if="!$v.formdata.first_name.alpha">
                        First name cannot contain numbers/special character.
                      </div>
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"> </b-col>
            <b-col sm="8">
              <b-form-group description="Add last name for User" horizontal>
                <label for="inputLive">Last Name</label>
                <b-form-input
                  :state="
                    !$v.formdata.last_name.$dirty
                      ? null
                      : !$v.formdata.last_name.$invalid
                  "
                  placeholder
                  type="text"
                  v-model.trim="$v.formdata.last_name.$model"
                ></b-form-input>
                <b-form-invalid-feedback>
                  <div v-if="!$v.formdata.last_name.required">
                    Last name is required.
                  </div>
                  <div v-if="!$v.formdata.last_name.minLength">
                    Last name must have at least
                    {{
                      $v.formdata.last_name.$params.minLength.min -
                      formdata.last_name.length
                    }}
                    more letters.
                  </div>
                  <div v-if="!$v.formdata.last_name.alpha">
                    Last name cannot contain numbers/special character.
                  </div>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"> </b-col>
            <b-col sm="8">
              <b-form-group description="Add Username for User" horizontal>
                <label for="inputLive">Username</label>
                <b-form-input
                  :state="
                    !$v.formdata.username.$dirty
                      ? null
                      : !$v.formdata.username.$invalid
                  "
                  placeholder
                  type="text"
                  v-model.trim="$v.formdata.username.$model"
                ></b-form-input>
                <b-form-invalid-feedback>
                  <div v-if="!$v.formdata.username.required">
                    Username is required.
                  </div>
                  <div v-if="!$v.formdata.username.minLength">
                    Username must have at least
                    {{
                      $v.formdata.username.$params.minLength.min -
                      formdata.username.length
                    }}
                    more letters.
                  </div>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"> </b-col>
            <b-col sm="8">
              <b-form-group description="Add password for User" horizontal>
                <label for="inputLive">Password</label>
                <b-form-input
                  :state="
                    !$v.formdata.password.$dirty
                      ? null
                      : !$v.formdata.password.$invalid
                  "
                  placeholder
                  type="password"
                  v-model.trim="$v.formdata.password.$model"
                ></b-form-input>
                <b-form-invalid-feedback>
                  <div v-if="!$v.formdata.password.required">
                    Password is required.
                  </div>
                  <div v-if="!$v.formdata.password.minLength">
                    Password must have at least
                    {{
                      $v.formdata.password.$params.minLength.min -
                      formdata.password.length
                    }}
                    more letters.
                  </div>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"> </b-col>
            <b-col sm="8">
              <b-form-group description="Confirm password for User" horizontal>
                <label for="inputLive">Password Confirm</label>
                <b-form-input
                  :state="
                    !$v.formdata.repeatPassword.$dirty
                      ? null
                      : !$v.formdata.repeatPassword.$invalid
                  "
                  placeholder
                  type="password"
                  v-model.trim="$v.formdata.repeatPassword.$model"
                ></b-form-input>
                <b-form-invalid-feedback>
                  <div v-if="!$v.formdata.repeatPassword.required">
                    Password confirm is required.
                  </div>
                  <div v-if="!$v.formdata.repeatPassword.sameAsPassword">
                    Passwords doesn't match
                  </div>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"> </b-col>
            <b-col sm="8">
              <b-form-group description="Select a Role for User" horizontal>
                <label for="inputLive">Select Role</label>
                <p-select
                  v-model.trim="$v.formdata.role.$model"
                  track-by="value"
                  label="text"
                  :options="roles"
                  :state="
                    !$v.formdata.role.$dirty ? null : !$v.formdata.role.$invalid
                  "
                  :searchable="false"
                  :close-on-select="false"
                  :show-labels="false"
                  placeholder=""
                ></p-select>
                <b-form-invalid-feedback>
                  <div v-if="!$v.formdata.role.required">Role is required.</div>
                  <div v-if="!$v.formdata.role.alpha">
                    Role cannot contain numbers/special character.
                  </div>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="my-4">
            <b-col cols="4"> </b-col>
            <b-col cols="8" class="d-flex justify-content-end">
              <b-button
                :disabled="$v.formdata.$invalid"
                @click.stop="userCreate($event.target)"
                variant="success"
                class="mr-2"
                >Submit</b-button
              >
              <b-button @click.stop="clearform()" variant="primary"
                >Clear</b-button
              >
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

import { alpha, minLength, required, sameAs } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  props: ["id"],
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      formdata: {
        first_name: "",
        last_name: "",
        username: "",
        password: "",
        repeatPassword: "",
        role: "",
      },
      dataObject: "",
      roles: [],
    };
  },
  mixins: [validationMixin],
  validations: {
    formdata: {
      first_name: {
        required,
        alpha,
        minLength: minLength(3),
      },
      last_name: {
        required,
        alpha,
        minLength: minLength(3),
      },
      username: {
        required,
        minLength: minLength(3),
      },
      password: {
        required,
        minLength: minLength(6),
      },
      repeatPassword: {
        required,
        sameAsPassword: sameAs("password"),
      },
      role: {
        required,
      },
    },
  },
  methods: {
    userCreate() {
      let homedirectory = "/";
      let uidnumber = "1";

      let param = {
        homedirectory: homedirectory,
        uidnumber: uidnumber,
        uid: this.formdata.username,
        fullName: this.formdata.first_name + " " + this.formdata.last_name,
        gidnumber: this.formdata.role.value,
        password: this.formdata.password,
      };

      this.$http
        .put("/api/ldap/v1/user/" + this.id, param)
        .then((response) => {
          this.$bvToast.toast(`User Created!`, {
            title: "User Settings Notification",
            variant: "success",
            autoHideDelay: 5000,
          });

          this.$router.push({
            name: "User List",
            params: { id: this.id },
            query: { sort: "name" },
          });
        })
        .catch((error) => {
          console.log(error);
          this.$bvToast.toast(`This Username is already used!`, {
            title: "User Settings Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
        });
    },
    clearform() {
      this.formdata.first_name = "";
      this.formdata.last_name = "";
      this.formdata.username = "";
      this.formdata.password = "";
      this.formdata.repeatPassword = "";
      this.formdata.role = "";
    },
  },
  created() {
    this.dataObject = {
      name: this.id,
    };
    this.$http
      .post("/api/ldap/v1/role", this.dataObject)
      .then((response) => {
        this.roles = response.data.map((role) => {
          return { value: role.gidnumber, text: role.name };
        });
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
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
