<template>
  <p-card v-if="errorStatus">
    <p-error
      :header="errorHeader"
      :errorResponse="errorResponse"
      @reload="$router.go()"
    />
  </p-card>
  <div
    v-else
    :style="{ 'background-image': 'url(' + 'img/loginwall.jpg ' + ')' }"
    id="background"
  >
    <b-row display="md" mobile>
      <b-col cols="12" md="3">
        <b-card class="login-area" id="card" style="border-radius: 0">
          <div style="margin-top: 5rem; margin-bottom: 2rem">
            <p-loading v-if="imageLoading" class="my-5" message="Loading..." />
            <img
              v-else-if="imageUrl"
              :style="imageStyle"
              :src="imageUrl || baseSrc"
              alt="Pda2"
              style="display: block; margin: auto"
            />
          </div>
          <div v-html="compiledLoginMessage" class="text-center"></div>

          <div v-if="loginType === 'userpass'">
            <!-- <b-form-select style="margin-right: 10px" v-model="selected">
              <optgroup label="Login Type">
                <option value="standart">Standart</option>
                <option value="LDAP">LDAP</option>
              </optgroup>
            </b-form-select> -->
            <!-- <div class="text-center">
              <b-button
                squared
                @click="selected = 'standart'"
                variant="outline-info"
                :pressed="selected == 'standart'"
              >
                <em class="icon-user" /> Local User</b-button
              >
              &nbsp;&nbsp;&nbsp;
              <b-button
                squared
                @click="selected = 'LDAP'"
                variant="outline-info"
                :pressed="selected == 'LDAP'"
              >
                <em class="fa fa-sitemap" /> LDAP (AD)</b-button
              >
            </div> -->
            <div v-if="selected === 'standart'">
              <b-input-group class="mb-3 mt-3">
                <b-input-group-prepend>
                  <b-input-group-text>
                    <em class="icon-user"></em>
                  </b-input-group-text>
                </b-input-group-prepend>
                <b-form-input
                  class="form-control"
                  :state="
                    !$v.formdata.username.$dirty
                      ? null
                      : !$v.formdata.username.$invalid
                  "
                  placeholder="Username"
                  type="text"
                  autocomplete="username email"
                  v-model.trim="$v.formdata.username.$model"
                  @keyup.enter="loginEnterKey"
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
              </b-input-group>
              <b-input-group class="mb-3">
                <b-input-group-prepend>
                  <b-input-group-text>
                    <em class="icon-lock"></em>
                  </b-input-group-text>
                </b-input-group-prepend>
                <b-form-input
                  class="form-control"
                  autocomplete="current-password"
                  :state="
                    !$v.formdata.password.$dirty
                      ? null
                      : !$v.formdata.password.$invalid
                  "
                  placeholder="Password"
                  type="password"
                  v-model.trim="$v.formdata.password.$model"
                  @keyup.enter="loginEnterKey"
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
              </b-input-group>
              <b-row align-h="center">
                <b-col>
                  <b-button
                    variant="success"
                    @click.stop="login"
                    :disabled="loginStatus || $v.formdata.$invalid"
                  >
                    <b-spinner v-if="loginStatus" small type="grow">
                    </b-spinner>
                    Login
                  </b-button>
                </b-col>
                <div class="col-6 text-right">
                  <b-button
                    @click.stop="forgetbutton"
                    variant="link"
                    class="pr-1"
                    >Forget password?</b-button
                  >
                </div>
              </b-row>
            </div>
            <div v-if="selected === 'LDAP'">
              <b-input-group class="mb-3 mt-3">
                <b-input-group-prepend>
                  <b-input-group-text>
                    <em class="icon-user"></em>
                  </b-input-group-text>
                </b-input-group-prepend>
                <b-form-input
                  class="form-control"
                  :state="
                    !$v.LdapFormdata.username.$dirty
                      ? null
                      : !$v.LdapFormdata.username.$invalid
                  "
                  placeholder="LDAP username"
                  type="text"
                  autocomplete="username email"
                  v-model.trim="$v.LdapFormdata.username.$model"
                  @keyup.enter="loginLdapEnterKey"
                ></b-form-input>
                <b-form-invalid-feedback>
                  <div v-if="!$v.LdapFormdata.username.required">
                    Username is required.
                  </div>
                  <div v-if="!$v.LdapFormdata.username.minLength">
                    Username must have at least
                    {{
                      $v.LdapFormdata.username.$params.minLength.min -
                      LdapFormdata.username.length
                    }}
                    more letters.
                  </div>
                </b-form-invalid-feedback>
              </b-input-group>
              <b-input-group class="mb-3">
                <b-input-group-prepend>
                  <b-input-group-text>
                    <em class="icon-lock"></em>
                  </b-input-group-text>
                </b-input-group-prepend>
                <b-form-input
                  class="form-control"
                  autocomplete="current-password"
                  :state="
                    !$v.LdapFormdata.password.$dirty
                      ? null
                      : !$v.LdapFormdata.password.$invalid
                  "
                  placeholder="Password"
                  type="password"
                  v-model.trim="$v.LdapFormdata.password.$model"
                  @keyup.enter="loginLdapEnterKey"
                ></b-form-input>
                <b-form-invalid-feedback>
                  <div v-if="!$v.LdapFormdata.password.required">
                    Password is required.
                  </div>
                  <div v-if="!$v.LdapFormdata.password.minLength">
                    Password must have at least
                    {{
                      $v.LdapFormdata.password.$params.minLength.min -
                      LdapFormdata.password.length
                    }}
                    more letters.
                  </div>
                </b-form-invalid-feedback>
              </b-input-group>
              <b-row align-h="center">
                <b-col>
                  <b-button
                    :disabled="LdapLoginStatus || $v.LdapFormdata.$invalid"
                    @click.stop="ldapLogin"
                    variant="success"
                  >
                    <b-spinner v-if="LdapLoginStatus" small type="grow">
                    </b-spinner>
                    Login
                  </b-button>
                </b-col>
              </b-row>
            </div>
          </div>
          <div class="mt-2" v-else-if="loginType === 'forgetpass'">
            <b-input-group class="mb-3">
              <b-input-group-prepend>
                <b-input-group-text>
                  <em class="icon-user"></em>
                </b-input-group-text>
              </b-input-group-prepend>
              <b-form-input
                class="form-control"
                :state="
                  !$v.forgetFormdata.email.$dirty
                    ? null
                    : !$v.forgetFormdata.email.$invalid
                "
                placeholder="E-mail"
                type="text"
                v-model.trim="$v.forgetFormdata.email.$model"
                @keyup.enter="passwordResetEnterKey"
              />
              <b-form-invalid-feedback>
                <div v-if="!$v.forgetFormdata.email.required">
                  Email is required.
                </div>
                <div v-if="!$v.forgetFormdata.email.email">
                  Please enter valid email adress.
                </div>
              </b-form-invalid-feedback>
            </b-input-group>
            <b-row align-h="center">
              <b-col cols="5">
                <b-button
                  @click.stop="resetPassword"
                  variant="primary"
                  :disabled="$v.forgetFormdata.$invalid || resetPasswordStatus"
                >
                  <b-spinner v-if="resetPasswordStatus" small type="grow">
                  </b-spinner>
                  Submit
                </b-button>
              </b-col>
              <div class="col-6 text-right pr-0">
                <b-link @click.stop="forgetcancelbutton" class="pr-1"
                  >Cancel</b-link
                >
              </div>
            </b-row>
          </div>
          <div class="mt-2" v-else-if="loginType === 'MFA'">
            <b-input-group class="mb-3">
              <b-input-group-prepend>
                <b-input-group-text>
                  <em class="icon-lock"></em>
                </b-input-group-text>
              </b-input-group-prepend>
              <b-form-input
                class="form-control"
                placeholder="MFA Code"
                type="text"
                v-model="mfacode"
                @keyup.enter="mfaLoginEnterKey"
              />
            </b-input-group>
            <h6 class="text-center">{{ timeleft }} seconds remaining</h6>
            <b-row align-h="center">
              <b-col cols="5">
                <b-button
                  variant="primary"
                  @click="mfaAuth"
                  :disabled="mfaAuthStatus || !mfacode"
                >
                  <b-spinner v-if="mfaAuthStatus" small type="grow">
                  </b-spinner>
                  Submit
                </b-button>
              </b-col>
              <div class="col-6 text-right">
                <b-link @click.stop="forgetcancelbutton" class="pr-1"
                  >Cancel</b-link
                >
              </div>
            </b-row>
          </div>
        </b-card>
      </b-col>
      <b-col class="d-md-down-none" cols="9" display="lg"></b-col>
    </b-row>
  </div>
</template>

<script>
import Qrcode from "v-qrcode";
import axios from "axios";
import marked from "marked";
import { mapActions, mapGetters } from "vuex";
import { minLength, required, email } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  name: "Login",
  components: {
    Qrcode,
  },
  data() {
    return {
      sealed: false,
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      timer: "",
      timeleft: 180,
      timeLeftQR: 180,
      mfacode: null,
      selected: "standart",
      authSession: {
        ip_address: "",
        user_agent: "",
        username: "",
      },
      loginType: "userpass",
      text: "",
      loginStatus: false,
      LdapLoginStatus: false,
      formdata: {
        username: "",
        password: "",
      },
      LdapFormdata: {
        username: "",
        password: "",
        loginType: "ldap",
      },
      forgetFormdata: {
        email: "",
      },
      mfaAuthStatus: false,
      resetPasswordStatus: false,
      downloadTimer: null,
      imageUrl: "",
      imageLoading: false,
      baseSrc: null,
      loginPageMessage: null,
    };
  },
  mixins: [validationMixin],
  validations: {
    formdata: {
      username: {
        required,
        minLength: minLength(3),
      },
      password: {
        required,
        minLength: minLength(6),
      },
    },
    LdapFormdata: {
      username: {
        required,
        minLength: minLength(3),
      },
      password: {
        required,
        minLength: minLength(6),
      },
    },
    forgetFormdata: {
      email: {
        required,
        email,
      },
    },
  },
  methods: {
    ...mapActions({
      loadData: "auth/loadData",
      loginWithStore: "auth/login",
      ldapLoginWithStore: "auth/ldapLogin",
      getUrls: "util/getUrls",
      logOutWithStore: "auth/logOut",
      mfaCheckWithStore: "auth/mfaCheck",
    }),
    loginEnterKey: function () {
      if (!this.$v.formdata.$invalid) {
        this.login();
      }
    },
    loginLdapEnterKey: function () {
      if (!this.$v.LdapFormdata.$invalid) {
        this.ldapLogin();
      }
    },
    mfaLoginEnterKey: function () {
      if (this.mfacode) {
        this.mfaAuth();
      }
    },
    ldapLogin() {
      this.LdapLoginStatus = true;
      this.ldapLoginWithStore(this.LdapFormdata)
        .then((res) => {
          if (res) {
            this.LdapLoginStatus = false;
            this.loginType = "MFA";
            console.log("before destroy", this.loginType === "MFA");
            this.countdown();
            this.$bvToast.toast(`MFA Code sent your email!`, {
              title: "Login Notification",
              variant: "info",
              autoHideDelay: 5000,
            });
          } else {
            this.authSession.username = res;
            this.$router.push(this.$route.query.redirect || this.homePage);
            }
        })
        .catch((err) => {
            this.$bvToast.toast(err, {
              title: "Login Notification",
              variant: "danger",
              autoHideDelay: 5000,
            });
          this.LdapLoginStatus = false;
        });
    },
    mfaAuth() {
      this.mfaAuthStatus = true;
      let data = {
        username: this.formdata.username,
        code: this.mfacode,
      };
      axios
        .post("/api/v1/mfa/auth", data)
        .then((response) => {
          this.loginType = null;
          this.loadData(response.data)
            .then(() => {
              this.$router.push(this.$route.query.redirect || this.homePage);
            })
            .catch((error) => {
              this.mfaAuthStatus = false;
              this.$bvToast.toast(`MFA Code is wrong!`, {
                title: "Login Notification",
                variant: "danger",
                autoHideDelay: 5000,
              });
              this.mfaAuthStatus = false;
              console.log(error);
            });
        })
        .catch((error) => {
          this.mfaAuthStatus = false;
          this.$bvToast.toast(`MFA Code is wrong!`, {
            title: "Login Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
          this.mfaAuthStatus = false;
          console.log(error);
        });
    },
    login() {
      this.loginStatus = true;
      this.loginWithStore(this.formdata)
        .then((res) => {
          if (res) {
            this.loginStatus = false;
            this.loginType = "MFA";
            console.log("before destroy", this.loginType === "MFA");
            this.countdown();
            this.$bvToast.toast(`MFA Code sent your email!`, {
              title: "Login Notification",
              variant: "info",
              autoHideDelay: 5000,
            });
          } else {
            this.$router.push(this.$route.query.redirect || this.homePage);
          }
        })
        .catch((err) => {
          this.$bvToast.toast(err, {
              title: "Login Notification",
              variant: "danger",
              autoHideDelay: 5000,
            });
          this.loginStatus = false;
        });
      console.log("before destroy", this.loginType === "MFA");
    },
    forgetbutton() {
      this.loginType = "forgetpass";
    },
    forgetcancelbutton() {
      this.mfacode = "";
      this.logOutWithStore();
      this.loginType = "userpass";
      clearInterval(this.timer);
      clearInterval(this.downloadTimer);
    },
    countdown() {
      this.timeleft = 180;
      let vm = this;
      this.downloadTimer = setInterval(function () {
        vm.timeleft -= 1;
        if (vm.timeleft <= 0) {
          vm.loginType = "userpass";
          clearInterval(vm.downloadTimer);
        }
      }, 1000);
    },
    resetPassword() {
      this.resetPasswordStatus = true;

      let dataParams = {
        email: this.forgetFormdata.email,
      };

      axios
        .post("/api/v1/user/user/resetPassword", null, { params: dataParams })
        .then((response) => {
          this.resetPasswordStatus = false;
          if (response.status === 200) {
            this.$bvToast.toast(
              `Your password reset request has been received.`,
              {
                title: "Reset Password Notification",
                variant: "info",
                autoHideDelay: 5000,
              }
            );
          } else if (response.status === 204) {
            this.$bvToast.toast(
              `Your password reset request is pending approval.`,
              {
                title: "Reset Password Notification",
                variant: "info",
                autoHideDelay: 5000,
              }
            );
          }
        })
        .catch((error) => {
          this.resetPasswordStatus = false;
          if (error.response.status === 500) {
            this.errorStatus = true;
            this.errorResponse = error;
            this.errorHeader = "Something went wrong!";
          } else if (error.response.status === 404) {
            this.$bvToast.toast(
              `The user of the entered e-mail was not found!`,
              {
                title: "Reset Password Notification",
                variant: "danger",
                autoHideDelay: 5000,
              }
            );
          }
        });
    },
    passwordResetEnterKey() {
      if (!this.$v.forgetFormdata.$invalid) {
        this.resetPassword();
      }
    },
  },
  props: {
    imageWidth: String,
    imageHeight: String,
  },
  created() {
    this.selected = this.lastLogin;
    if (this.baseSrc === null) {
      this.imageLoading = true;
      axios
        .get("/api/v1/tag/login-page-image")
        .then((response) => {
          this.imageUrl =
            response.data === ""
              ? require("@/assets/img/pda2.png")
              : response.data;
          this.imageLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.imageLoading = false;
          if (error.status === 500) {
            console.log("error");
            this.imageLoading = false;
            this.errorStatus = true;
            this.errorResponse = error;
            this.errorHeader = "Something went wrong!";
          }
          this.baseSrc = require("@/assets/img/pda2.png");
        });
    }
    axios
      .get("/api/v1/tag/login-page-message")
      .then((response) => {
        this.loginPageMessage = response.data;
      })
      .catch((error) => {
        console.log(error);
        if (error.status === 500) {
          console.log("error");
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        }
      });
    this.getUrls();
    axios
      .post("/api/v1/vault/status")
      .then((response) => {
        this.sealed = response.data.sealed;
        if (this.sealed) {
          this.$router.push(this.$route.query.redirect || "/seal");
        }
      }).catch(error => {
          if (error.response != null) {
            switch (error.response.status) {
              case 400:
                this.$router.push(this.$route.query.redirect || "/vaultinit");
                break;
              case 503:
                this.$router.push(this.$route.query.redirect || "/vaulterror");
                break;
              default:
                break;
            }
          }
      })
  },
  computed: {
    ...mapGetters({
      authUser: "auth/user",
      homePage: "util/homePageUrl",
      lastLogin: "auth/lastLogin",
    }),
    imageStyle() {
      return {
        width: this.imageWidth,
        height: this.imageHeight,
      };
    },
    imageLoadingStyle() {
      return {
        height: 75 + "px",
        width: 75 + "px",
      };
    },
    compiledLoginMessage() {
      return marked(this.loginPageMessage != null ? this.loginPageMessage : "");
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.downloadTimer);
  },
  destroyed() {
    if (this.loginType === "MFA") {
      this.logOutWithStore();
    }
  },
};
</script>
<style>
#card {
  position: fixed;
  height: 100%;
  width: 400px;
}

#background {
  background-size: cover;
  background-position: center center;
  position: fixed;
  height: 100%;
  width: 100%;
}

#infotext {
  text-align: right;
}

#typetext {
  text-align: center;
  margin-top: 15rem;
  font-style: oblique;
}

@media only screen and (max-width: 768px) {
  .login-area {
    width: 100% !important;
  }
}
</style>
