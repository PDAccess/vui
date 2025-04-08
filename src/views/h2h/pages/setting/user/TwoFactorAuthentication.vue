<template>
  <div class="animated fadeIn">
    <p-card>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="5">
              <p>
                Increase your account's security by enabling Two-Factor
                Authentication (2FA).
              </p>
            </b-col>
            <b-col>
              <span style="font-size: 16px">
                <b-badge
                  v-if="
                    user2faVerification.qrVerification ||
                    user2faVerification.smsVerification ||
                    user2faVerification.emailVerification
                  "
                  href="#"
                  variant="success"
                  >MFA is currently enabled</b-badge
                >
                <b-badge v-else href="#" variant="danger"
                  >There is currently no active 2FA.</b-badge
                >
              </span>
            </b-col>
          </b-row>
        </li>
        <p-loading v-if="mfaLoading" class="my-5" gif-height="50" />
        <div v-else center class="mt-1">
          <li class="list-group-item ml-4">
            <div class="my-1">
              <b-row>
                <b-col lg="4">
                  <h5>
                    Google Authenticator
                    <span style="font-size: 14px">
                      <b-badge
                        v-if="user2faVerification.qrVerification === true"
                        variant="success"
                      >
                        On
                      </b-badge>
                      <b-badge v-else> Unset </b-badge>
                    </span>
                  </h5>
                  <p>
                    Use a mobile authentication app to get a verification code
                    to enter every time you log in to PDA.
                  </p>
                </b-col>
                <b-col class="mt-4" lg="2"> </b-col>
                <b-col lg="4">
                  <b-button
                    class="mt-4"
                    v-if="user2faVerification.qrVerification === false"
                    @click="crateQrCode()"
                    v-b-toggle.collapseQrCodeEnable
                  >
                    Enable
                  </b-button>
                  <b-button
                    class="mt-4"
                    v-else
                    v-b-modal.qrRemoveModal
                    variant="danger"
                  >
                    Remove
                  </b-button>
                </b-col>
              </b-row>
              <b-collapse id="collapseQrCodeEnable" ref="collapseQrCodeEnable">
                <p-card class="mt-3" :cardBody="false">
                  <div class="animated fadeIn">
                    <p-loading
                      v-if="qrLoading"
                      class="my-5"
                      message="Loading..."
                    />
                    <b-row v-else class="my-1">
                      <b-col md="4">
                        <p>
                          Open the authentication app on your mobile device to
                          link it to your PDA account. When the app prompts you,
                          scan the following QR code with your camera.
                        </p>
                      </b-col>
                      <b-col md="4">
                        <div
                          class="d-flex justify-content-start align-items-start"
                        >
                          <qrcode
                            :cls="qrCls"
                            :size="200"
                            :value="qrText"
                            style="margin-left: 40px"
                          ></qrcode>
                        </div>
                      </b-col>
                      <b-col
                        md="4"
                        class="d-flex justify-content-start align-items-center"
                      >
                        <div class="padd">
                          <b-form-group
                            label="Google Authenticator Code"
                            label-for="googleQrCode"
                          >
                            <b-form-input
                              id="googleQrCode"
                              v-model="googleQrVerificationCode"
                              required
                            ></b-form-input>
                            <p class="text-danger">{{ qrFailedMessage }}</p>
                          </b-form-group>
                          <div class="d-flex justify-content-end mt-2">
                            <b-button
                              v-if="
                                !user2faVerification.qrVerification &&
                                !qrVerificationLoading
                              "
                              @click="
                                VerifyQrCode(), (qrVerificationLoading = true)
                              "
                              class="mt-2"
                              variant="success"
                              >Verify</b-button
                            >
                            <b-button v-else disabled> Wait </b-button>
                          </div>
                        </div>
                      </b-col>
                    </b-row>
                  </div>
                </p-card>
              </b-collapse>
              <b-modal
                id="qrRemoveModal"
                title="Remove Sms"
                ref="qrRemoveModal"
              >
                <strong
                  >Are you sure you want to deactivate Qr
                  Authentication?</strong
                >

                <template #modal-footer="{ cancel }">
                  <b-button size="sm" variant="danger" @click="qrRemove()">
                    Approve
                  </b-button>
                  <b-button size="sm" variant="success" @click="cancel()">
                    Cancel
                  </b-button>
                </template>
              </b-modal>
            </div>
          </li>
          <li class="list-group-item ml-4">
            <b-row class="my-1">
              <b-col sm="4">
                <h5>
                  Phone Number Verification
                  <span style="font-size: 14px">
                    <b-badge
                      v-if="user2faVerification.smsVerification === true"
                      variant="success"
                    >
                      On
                    </b-badge>
                    <b-badge v-else> Unset </b-badge>
                  </span>
                </h5>
                <p>
                  Use your mobile phone to receive a text message with an
                  authentication code to enter when you log in to PDA.
                </p>
              </b-col>
              <b-col class="mt-4" sm="2"> </b-col>
              <b-col sm="4">
                <b-button
                  class="mt-4"
                  v-if="user2faVerification.smsVerification === false"
                  v-b-toggle.collapsePhoneEnable
                >
                  Enable
                </b-button>
                <template v-else>
                  <b-button
                    class="ml-1 mt-4"
                    variant="danger"
                    v-b-modal.smsRemoveModal
                  >
                    Remove
                  </b-button>
                </template>
              </b-col>
            </b-row>
            <b-collapse
              id="collapsePhoneEnable"
              v-if="user2faVerification.smsVerification === false"
              ref="collapsePhoneEnable"
            >
              <p-card class="mt-3" :cardBody="false">
                <div class="animated fadeIn">
                  <b-row class="my-1">
                    <b-col sm="4">
                      <p>
                        Verify your mobile phone number and receive a text
                        message with a confirmation code.
                      </p>
                    </b-col>
                    <b-col sm="3">
                      <div class="d-flex justify-content-end align-items-end">
                        <p>Phone Number: {{ this.user.phone }}</p>
                      </div>
                      <div class="d-flex justify-content-end align-items-end">
                        <b-link href="/user/account"> Change Number </b-link>
                      </div>

                      <div
                        class="d-flex justify-content-end align-items-end mt-1"
                      >
                        <b-link
                          v-if="!smsSendCheck"
                          @click="smsVerificationSend()"
                        >
                          Send Sms
                        </b-link>
                      </div>
                    </b-col>
                    <b-col v-if="smsSendCheck" sm="4" class="ml-2">
                      <div>
                        <b-form-group style="width: 100%">
                          <b-form-input
                            id="phoneNumberVerificationCode"
                            v-model="phoneNumberVerificationCode"
                            placeholder="Sms Code"
                            required
                          ></b-form-input>
                          <p class="text-danger">{{ smsFailedMessage }}</p>
                        </b-form-group>
                      </div>
                      <div
                        :class="
                          countDownSec !== 90
                            ? 'col-md-6'
                            : 'col-md-6 text-white'
                        "
                      >
                        {{ countDownSec + " second left." }}

                        <b-link
                          v-if="countDownSec == 0"
                          class="justify-content-end"
                          @click="smsVerificationSend()"
                        >
                          Resend Sms
                        </b-link>
                      </div>

                      <div class="d-flex justify-content-end mt-2">
                        <b-button
                          v-if="!smsVerificationLoading"
                          @click="
                            VerifySmsCode(), (smsVerificationLoading = true)
                          "
                          class="mt-2"
                          variant="success"
                          >Verify</b-button
                        >
                        <b-button v-else disabled> Wait </b-button>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </p-card>
            </b-collapse>
            <b-modal
              id="smsRemoveModal"
              title="Remove Sms"
              ref="smsRemoveModal"
            >
              <strong
                >Are you sure you want to deactivate Sms Verification?</strong
              >

              <template #modal-footer="{ cancel }">
                <b-button size="sm" variant="danger" @click="smsRemove()">
                  Approve
                </b-button>
                <b-button size="sm" variant="success" @click="cancel()">
                  Cancel
                </b-button>
              </template>
            </b-modal>
          </li>
          <li class="list-group-item ml-4">
            <b-row class="my-1">
              <b-col sm="4">
                <h5>
                  Email Address Verification
                  <span style="font-size: 14px">
                    <b-badge
                      v-if="user2faVerification.emailVerification === true"
                      variant="success"
                    >
                      On
                    </b-badge>
                    <b-badge v-else> Unset </b-badge>
                  </span>
                </h5>
                <p>
                  Use an email address to get a verification code to enter every
                  time you log into PDA.
                </p>
              </b-col>
              <b-col class="mt-4" sm="2"> </b-col>
              <b-col sm="4">
                <b-button
                  class="mt-4"
                  v-if="user2faVerification.emailVerification === false"
                  v-b-toggle.collapseMailEnable
                >
                  Enable
                </b-button>
                <template v-else>
                  <b-button
                    class="ml-1 mt-4"
                    variant="danger"
                    v-b-modal.emailRemoveModal
                  >
                    Remove
                  </b-button>
                </template>
              </b-col>
            </b-row>
            <b-collapse
              id="collapseMailEnable"
              v-if="user2faVerification.emailVerification === false"
              ref="collapseMailEnable"
            >
              <p-card class="mt-3" :cardBody="false">
                <div class="animated fadeIn">
                  <b-row class="my-1">
                    <b-col sm="4">
                      Verify your email address and receive a email with a
                      confirmation code.
                    </b-col>
                    <b-col sm="3">
                      <div class="d-flex justify-content-end align-items-end">
                        <p>Mail Adress: {{ this.user.email }}</p>
                      </div>

                      <div class="d-flex justify-content-end align-items-end">
                        <b-link href="/user/account"> Change Email </b-link>
                      </div>

                      <div
                        class="d-flex justify-content-end align-items-end mt-1"
                      >
                        <b-link @click="emailVerificationSend()">
                          Send Mail
                        </b-link>
                      </div>
                    </b-col>

                    <b-col v-if="emailSendCheck" sm="4" class="ml-2">
                      <div>
                        <b-form-group style="width: 100%">
                          <b-form-input
                            id="emailVerificationCode"
                            v-model="emailVerificationCode"
                            placeholder="Email Code"
                            required
                          ></b-form-input>
                          <p class="text-danger">{{ emailFailedMessage }}</p>
                        </b-form-group>
                      </div>
                      <div :class="countDownSec !== 90 ? 'null' : 'text-white'">
                        {{ countDownSec + " second left." }}

                        <b-link
                          v-if="countDownSec == 0"
                          class="justify-content-end"
                          @click="emailVerificationSend()"
                        >
                          Resend Mail
                        </b-link>
                      </div>

                      <div class="d-flex justify-content-end mt-2">
                        <b-button
                          v-if="!emailVerificationLoading"
                          @click="
                            VerifyEmailCode(), (emailVerificationLoading = true)
                          "
                          class="mt-2"
                          variant="success"
                          >Verify</b-button
                        >
                        <b-button v-else disabled> Wait </b-button>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </p-card>
            </b-collapse>
            <b-modal
              id="emailRemoveModal"
              title="Remove Email Verificaiton"
              ref="emailRemoveModal"
            >
              <strong
                >Are you sure you want to deactivate Email Verification?</strong
              >

              <template #modal-footer="{ cancel }">
                <b-button size="sm" variant="danger" @click="emailRemove()">
                  Approve
                </b-button>
                <b-button size="sm" variant="success" @click="cancel()">
                  Cancel
                </b-button>
              </template>
            </b-modal>
          </li>
        </div>
      </ul>
    </p-card>
  </div>
</template>
<script>
import Qrcode from "v-qrcode";

import { MfaApi } from '@/generated/authws';

export default {
  props: ["id"],
  components: {
    Qrcode,
  },
  data() {
    return {
      smsSendCheck: false,
      emailSendCheck: false,
      qrCodeNextCheck: false,
      changeNumberCheck: false,
      changeEmailCheck: false,
      countDownSec: 90,
      countDownSecEmail: 90,
      updateEmailAddress: "",
      interval: null,
      qrCls: "qrcode",
      qrText: "",
      username: "",
      user: {},
      loading: true,
      qrLoading: true,
      mfaLoading: true,
      qrVerificationLoading: false,
      smsVerificationLoading: false,
      emailVerificationLoading: false,
      qrFailedMessage: "",
      emailFailedMessage: "",
      smsFailedMessage: "",
      modal: {
        status: "",
        title: "",
        variant: "",
        cancelButtonVariant: "",
      },
      user2faVerification: {
        qrVerification: "",
        emailVerification: "",
        smsVerification: "",
      },
      googleQrVerificationCode: "",
      emailVerificationCode: "",
      phoneNumberVerificationCode: "",
      secretKey: "",
    };
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  watch: {
    validPhone: function (value) {
      this.formdata.validPhone = value;
    },
  },
  methods: {
    startCountdown() {
      this.interval = setInterval(this.countdown, 1000);
    },
    countdown() {
      if (this.countDownSec == 0) {
        this.reCodeState = true;
        clearInterval(this.interval);
      } else {
        this.countDownSec--;
      }
    },
    crateQrCode() {
      new MfaApi(this.$authHttpConfig, undefined, this.$http).mfaCheck({type: "google_authenticator"})
        .then((response) => {
              this.qrLoading = false;
              this.secretKey = response.data.secret;
              console.log("secret key: ", this.secretKey)
              this.qrText =
                "otpauth://totp/PDAccess:" +
                this.username +
                "?secret=" +
                this.secretKey +
                "&issuer=PDAccess";
              console.log(`mfa url: ${this.qrText}`);
        })
        .catch((error) => {
          console.log(error);
          this.qrLoading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    VerifyQrCode() {
      new MfaApi(this.$authHttpConfig, undefined, this.$http).mfaEnable({
          type: "google_authenticator",
          code: this.googleQrVerificationCode,
        })
        .then((response2) => {
          console.log(response2.data);
          this.googleQrVerificationCode = "";
          this.$refs.collapseQrCodeEnable.toggle();
          this.mfaStatus();
          this.qrVerificationLoading = false;
          this.$bvToast.toast(`Google Authenticator Enable`, {
            title: "Google Authenticator Enable",
            variant: "success",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
          this.googleQrVerificationCode = "";
          this.qrVerificationLoading = false;
          this.qrFailedMessage = "Code is wrong!";
        });
    },

    VerifySmsCode() {
      new MfaApi(this.$authHttpConfig, undefined, this.$http).mfaEnable({
        type: "sms",
          code: this.phoneNumberVerificationCode,
        })
        .then((response) => {
          console.log(response.data);
          this.phoneNumberVerificationCode = "";
          this.$refs.collapsePhoneEnable.toggle();
          this.mfaStatus();
          this.smsVerificationLoading = false;
          this.$bvToast.toast(`Sms Verification Enable`, {
            title: "Sms Verification Enable",
            variant: "success",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
          this.phoneNumberVerificationCode = "";
          this.smsVerificationLoading = false;
          this.smsFailedMessage = "Code is wrong!";
        });
    },
    VerifyEmailCode() {
      new MfaApi(this.$authHttpConfig, undefined, this.$http).mfaEnable({
        type: "email",
          code: this.emailVerificationCode,
        })
        .then((response) => {
          console.log(response.data);
          this.emailVerificationCode = "";
          this.$refs.collapseMailEnable.toggle();
          this.mfaStatus();
          this.emailVerificationLoading = false;
          this.$bvToast.toast(`Email Verification Enable`, {
            title: "Email Verification Enable",
            variant: "success",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
          this.emailVerificationLoading = false;
          this.emailFailedMessage = "Code is wrong!";
          this.emailVerificationCode = "";
        });
    },
    smsRemove() {
      new MfaApi(this.$authHttpConfig, undefined, this.$http).mfaDisable({ type: "sms" })
        .then((response) => {
          console.log(response.data);
          this.smsSendCheck = false;
          this.$refs.smsRemoveModal.hide();
          this.mfaStatus();
          this.$bvToast.toast(`Phone verification disabled`, {
            title: "Phone Verification Disabled",
            variant: "danger",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    emailRemove() {
      new MfaApi(this.$authHttpConfig, undefined, this.$http).mfaDisable({ type: "email" })
        .then((response) => {
          console.log(response.data);
          this.emailSendCheck = false;
          this.$refs.emailRemoveModal.hide();
          this.mfaStatus();
          this.$bvToast.toast(`Email verification disabled`, {
            title: "Email Verification Disabled",
            variant: "danger",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    qrRemove() {
      new MfaApi(this.$authHttpConfig, undefined, this.$http).mfaDisable({ type: "google_authenticator" })
        .then((response) => {
          console.log(response.data);
          this.emailSendCheck = false;
          this.$refs.qrRemoveModal.hide();
          this.mfaStatus();
          this.$bvToast.toast(`Google Authenticator Disable`, {
            title: "Google Authenticator Disable",
            variant: "danger",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    smsVerificationSend() {
      new MfaApi(this.$authHttpConfig, undefined, this.$http).mfaCheck({ type: "sms" })
        .then((response2) => {
          console.log(response2.data);
          this.smsSendCheck = true;
          this.startCountdown();
          if (this.countDownSec == 0) {
            this.countDownSec = 90;
            this.$bvToast.toast(`Sms Verification Send`, {
              title: "Resend Sms",
              variant: "success",
              autoHideDelay: 5000,
            });
          } else {
            this.$bvToast.toast(`Sms Verification Send`, {
              title: "Sms Send",
              variant: "success",
              autoHideDelay: 5000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    emailVerificationSend() {
      new MfaApi(this.$authHttpConfig, undefined, this.$http).mfaCheck({ type: "email" })
        .then((response2) => {
          console.log(response2.data);
          this.emailSendCheck = true;
          this.startCountdown();
          if (this.countDownSec == 0) {
            this.countDownSec = 90;
            this.$bvToast.toast(`Email Verification Send`, {
              title: "Resend email",
              variant: "success",
              autoHideDelay: 5000,
            });
          } else {
            this.$bvToast.toast(`Email Verification Send`, {
              title: "Email Send",
              variant: "success",
              autoHideDelay: 5000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeTwoAuth(status) {
      this.loading = true;
      this.$http
        .post("api/v1/user/changetwofactorauth/" + status)
        .then((response) => {
          if (response.status == 200) {
            if (status == 1) {
              this.$bvToast.toast(`Two-Factor Authentication is enabled`, {
                title: "User Settings Notification",
                variant: "success",
                autoHideDelay: 5000,
              });
            } else {
              this.$bvToast.toast(`Two-Factor Authentication is disabled`, {
                title: "User Settings Notification",
                variant: "danger",
                autoHideDelay: 5000,
              });
            }

            this.user.twofactorauth = status;
            this.loading = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeTwoFacStatusModal(status) {
      this.modal.status = status;
      if (status == 1) {
        this.modal.variant = "success";
        this.modal.message = "Are you sure you want to activate 2FA?";
        this.modal.title = "2FA Change enable";
        this.modal.cancelButtonVariant = "danger";
      } else {
        this.modal.variant = "danger";
        this.modal.message = "Are you sure you want to deactivate 2FA?";
        this.modal.title = "2FA Change disable";
        this.modal.cancelButtonVariant = "success";
      }
    },
    mfaStatus() {
      new MfaApi(this.$authHttpConfig, undefined, this.$http).mfaStatus()
        .then((response) => {
          this.user2faVerification.qrVerification =
            response.data.google_authenticator;
          this.user2faVerification.smsVerification = response.data.sms;
          this.user2faVerification.emailVerification = response.data.email;
          this.mfaLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.user2faVerification.qrVerification = false;
          this.user2faVerification.smsVerification = false;
          this.user2faVerification.emailVerification = false;
          this.mfaLoading = false;
        });
    },
  },
  created() {
    this.loading = true;
    this.$http
      .get("/api/v1/user/who")
      .then((response) => {
        this.loading = false;
        this.username = response.data.username;
        this.user = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    this.mfaStatus();
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>

<style scoped>
.card {
  border: none;
  border-left: 0px solid #e5e5e5;
  border-top: 1px solid #e5e5e5;
  border-radius: 0px;
}
</style>