<template>
  <div class="animated fadeIn">
    <AppModal
      ref="modal"
      label="Copy Password and Submit"
      title="Copy Password"
      variant="success"
      @confirm="createSystemUser()"
      :message="modalMessage"
      cancelButtonVariant="danger"
    ></AppModal>
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
            <b-col sm="4"></b-col>
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
                  id="password"
                  :disabled="passwordActive"
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
                  <div v-else-if="!$v.formdata.password.minLength">
                    Password must have at least
                    {{ passwordRules.minChars - formdata.password.length }}
                    more letters.
                  </div>
                  <div v-if="!$v.formdata.password.containsUppercase">
                    Please enter at least {{ passwordRules.uppercase }} upper
                    case
                  </div>
                  <div v-if="!$v.formdata.password.containsLowercase">
                    Please enter at least {{ passwordRules.lowercase }} lower
                    case
                  </div>
                  <div v-if="!$v.formdata.password.containsNumber">
                    Please enter at least {{ passwordRules.numeral }} number
                  </div>
                  <div v-if="!$v.formdata.password.containsSpecial">
                    Please enter at least
                    {{ passwordRules.specialChars }} special characters
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
                  :disabled="passwordActive"
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
              <b-form-group description="Add Phone for User" horizontal>
                <label for="inputLive">Phone</label>
                <PhoneInput
                  :phone.sync="phone"
                  :valid.sync="validPhone"
                  :clearNumber="clearNumber"
                />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"> </b-col>
            <b-col sm="8">
              <b-form-group description="Add Email for User" horizontal>
                <label for="inputLive">Email</label>
                <b-form-input
                  :state="
                    !$v.formdata.email.$dirty
                      ? null
                      : !$v.formdata.email.$invalid
                  "
                  placeholder
                  type="email"
                  v-model.trim="$v.formdata.email.$model"
                ></b-form-input>
                <b-form-invalid-feedback>
                  <div v-if="!$v.formdata.email.required">
                    Email is required.
                  </div>
                  <div v-if="!$v.formdata.email.email">
                    Please enter valid email adress.
                  </div>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"> </b-col>
            <b-col sm="8">
              <b-row>
                <b-col>
                  <b-form-group label="IP Address">
                    <p-select
                      v-model="selectedIps"
                      tag-placeholder="Add IP Address"
                      placeholder="Add IP Address"
                      :options="ipOptions"
                      :multiple="true"
                      :taggable="true"
                      @tag="addIpTag"
                      :close-on-select="false"
                    ></p-select>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"> </b-col>
            <b-col sm="8">
              <b-row>
                <b-col>
                  <b-form-group label="Role">
                    <b-form-radio-group
                      :options="options"
                      button-variant="outline-primary"
                      buttons
                      id="btnradios2"
                      name="radioBtnOutline"
                      v-model.trim="$v.formdata.urole.$model"
                    />
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="External">
                    <label class="switch switch-3d switch-primary">
                      <input
                        checked
                        class="switch-input"
                        type="checkbox"
                        v-model="externalSwitch"
                      />
                      <span class="switch-slider"></span>
                    </label>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="my-4">
            <b-col cols="4"> </b-col>
            <b-col cols="8" class="d-flex justify-content-end">
              <b-button
                :disabled="$v.formdata.$invalid"
                @click="createUser()"
                variant="success"
                class="mr-2"
                >Submit</b-button
              >
              <b-button @click.stop="clearForm()" variant="primary"
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

import Avatar from "vue-avatar";
import PhoneInput from "@/views/h2h/components/PhoneInput.vue";
import AppModal from "@/views/h2h/components/Modal";
import {
  helpers,
  email,
  minLength,
  required,
  sameAs,
} from "vuelidate/lib/validators";
const alpha = helpers.regex("alpha", /^[a-zA-Z ]*$/);

let passwordRules = {
  minChars: 8,
  uppercase: 1,
  lowercase: 1,
  specialChars: 1,
  numeral: 1,
};

import { validationMixin } from "vuelidate";

import { UserApi } from '@/generated/authws';

export default {
  components: {
    Avatar,
    PhoneInput,
    AppModal,
  },
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      selectedIps: [],
      ipOptions: [],
      autoPassword: "",
      passwordActive: false,
      modalMessage: "",
      passwordRules: {
        minChars: 4,
        numeral: 1,
        lowercase: 1,
        uppercase: 1,
        specialChars: 1,
      },
      externalSwitch: false,
      multivalue: [],
      companies: [],
      selected: "User",
      phone: {
        number: "",
        required: false,
        invalid: true,
        country: undefined,
        selected: false,
      },
      options: [
        {
          text: "User",
          value: "User",
        },
        {
          text: "Admin",
          value: "Admin",
        },
        {
          text: "System",
          value: "System",
        },
      ],
      items: [],
      userName: "",
      urole: "",
      usrname: "",
      mail: "",
      Id: "",
      modalid: "",
      formdata: {
        first_name: "",
        last_name: "",
        validPhone: false,
        email: "",
        tenantId: "",
        urole: "",
        username: "",
        external: false,
        password: "",
        repeatPassword: "",
      },
      oldPassword: "",
      oldRepeatPassword: "",
      validPhone: false,
      clearNumber: false,
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
      validPhone: {
        sameAs: sameAs(function () {
          return true;
        }),
      },
      email: {
        required,
        email,
      },
      urole: {
        required,
      },
      password: {
        required,
        containsUppercase: function (value) {
          return (
            ((value || "").match(/[A-Z]/g) || []).length >=
            passwordRules.uppercase
          );
        },
        containsLowercase: function (value) {
          return (
            ((value || "").match(/[a-z]/g) || []).length >=
            passwordRules.lowercase
          );
        },
        containsNumber: function (value) {
          return (
            ((value || "").match(/[0-9]/g) || []).length >=
            passwordRules.numeral
          );
        },
        containsSpecial: function (value) {
          return (
            ((value || "").match(/[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || [])
              .length >= passwordRules.specialChars
          );
        },
        minLength: function (value) {
          return (value || "").length >= passwordRules.minChars;
        },
      },
      username: {
        required,
        minLength: minLength(3),
      },
      repeatPassword: {
        required,
        sameAsPassword: sameAs("password"),
      },
    },
  },
  watch: {
    validPhone: function (value) {
      this.formdata.validPhone = value;
    },
    "formdata.urole": function (val, oldVal) {
      if (val === "System") {
        this.passwordActive = true;
        this.makePassword(10);
        this.oldPassword = this.formdata.password;
        this.oldRepeatPassword = this.formdata.repeatPassword;
        this.formdata.password = this.autoPassword;
        this.formdata.repeatPassword = this.autoPassword;
        this.modalMessage =
          "Please copied System User Password: " + this.formdata.password;
      } else {
        this.passwordActive = false;
      }

      if (oldVal == "System") {
        this.formdata.password = this.oldPassword;
        this.formdata.repeatPassword =this.oldRepeatPassword;
      }
    },
  },
  methods: {
    addIpTag(newTag) {
      this.ipOptions.push(newTag);
      this.selectedIps.push(newTag);
    },
    passwordCheck(value) {
      if (
        !((value || "").match(/[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || [])
          .length >= passwordRules.specialChars
      )
        return false;
      else if (
        !((value || "").match(/[0-9]/g) || []).length >= passwordRules.numeral
      )
        return false;
      else if (
        !((value || "").match(/[a-z]/g) || []).length >= passwordRules.lowercase
      )
        return false;
      else if (
        !((value || "").match(/[A-Z]/g) || []).length >= passwordRules.uppercase
      )
        return false;
      else return true;
    },
    makePassword(length) {
      let result = "";
      let characters = [
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "abcdefghijklmnopqrstuvwxyz",
        "0123456789",
        "@#$%^&*()_+\\-=[]{};':\"|,.<>/?",
      ];
      let charactersLength = characters.length;
      let j = 0;
      for (let i = 0; i < length; i++) {
        if (j >= charactersLength) j = 0;
        let c = characters[j++];
        let charLength = c.length;
        result += c.charAt(Math.floor(Math.random() * charLength));
      }
      this.autoPassword = result;
    },
    multiselectEvent() {
      this.formdata.tenantId = this.multivalue.tenantId;
    },
    createSystemUser() {
      this.$clipboard(this.autoPassword);
      this.userCreate();
    },
    createUser() {
      if (this.formdata.urole === "System") {
        this.$refs["modal"].$children[0].show();
      } else {
        this.userCreate();
      }
    },
    userCreate() {
      this.formdata.external = this.externalSwitch;

      let user = {
        firstName: this.formdata.first_name,
        lastName: this.formdata.last_name,
        phone: this.phone.number,
        email: this.formdata.email,
        role: this.formdata.urole,
        username: this.formdata.username.toLowerCase(),
        external: this.formdata.external,
        password: this.formdata.password,
        mfa: false
      };

      new UserApi(this.$authHttpConfig, undefined, this.$http).createUser(user)
        .then((response) => {
          this.$bvToast.toast(`User Created!`, {
            title: "User Settings Notification",
            variant: "success",
            autoHideDelay: 5000,
          });

          this.$router.push({ name: "User list" });
          new UserApi(this.$authHttpConfig, undefined, this.$http).searchUsers()
            .then((response2) => {
              this.items = response2.data;
            })
            .catch((error) => {
              console.log(error);
              this.errorStatus = true;
              this.errorResponse = error;
              this.errorHeader = "Create operation has error!";
            });
        })
        .catch((error) => {
          console.log(error);
          this.$bvToast.toast(error.data, {
            title: "User Settings Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
        });
    },
    clearForm() {
      this.formdata.first_name = "";
      this.formdata.last_name = "";
      this.formdata.username = "";
      this.formdata.password = "";
      this.formdata.repeatPassword = "";
      this.clearNumber = !this.clearNumber;
      this.formdata.validPhone = false;
      this.phone.number = "";
      this.phone.required = true;
      this.phone.invalid = true;
      this.formdata.email = "";
      this.multivalue = [];
      this.formdata.tenantId = "";
      this.externalSwitch = false;
      this.formdata.urole = "";
      this.selectedIps = [];
      this.ipOptions = [];
    },
  },
  created() {
    console.log(this.$v.formdata.password);
    this.$http
      .get("/api/v1/tenant/all", {})
      .then((response) => {
        this.companies = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
    this.$http
      .get("/api/v1/settings/passwordValidationRules")
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].tag === "password_min_chars") {
            passwordRules.minChars = parseInt(response.data[i].value);
          }
          if (response.data[i].tag === "password_min_numeral") {
            passwordRules.numeral = parseInt(response.data[i].value);
          }
          if (response.data[i].tag === "password_min_lowercase") {
            passwordRules.lowercase = parseInt(response.data[i].value);
          }
          if (response.data[i].tag === "password_min_uppercase") {
            passwordRules.uppercase = parseInt(response.data[i].value);
          }
          if (response.data[i].tag === "password_min_special_chars") {
            passwordRules.specialChars = parseInt(response.data[i].value);
          }
        }

        this.passwordRules = passwordRules;
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
