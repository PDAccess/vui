<template>
  <p-card v-if="errorStatus">
    <p-error
      :header="errorHeader"
      :errorResponse="errorResponse"
      @reload="$router.go()"
    />
  </p-card>
  <p-card v-else>
    <b-tabs content-class="mt-2" pills>
      <b-tab active title="Web">
        <b-form-fieldset
          label="Registration Page"
          description=""
          :label-cols="3"
          :horizontal="true"
        >
          <b-form-radio-group
            id="radios2"
            v-model="settings.registration_page_visibility"
            stacked
            name="radioSubComponent"
          >
            <b-form-radio value="0">
              <em class="fa fa-lock fa-fw"></em>
              Private
              <p>Registration link does not visible on login page</p>
            </b-form-radio>
            <b-form-radio value="1"
              ><em class="fa fa-globe fa-fw"></em>
              Public
              <p>Registration link visibles on login page</p>
            </b-form-radio>
          </b-form-radio-group>
        </b-form-fieldset>

        <b-form-fieldset
          label="Logo"
          description="This logo will shown on login page. Maximum size: 200KB (Recommended resolution: 260x100)"
          :label-cols="3"
          :horizontal="true"
        >
          <p style="color: red">{{ loginAlert }}</p>
          <b-row>
            <b-col>
              <input
                type="file"
                class="form-control-file"
                v-on:change="processLoginLogo($event)"
              />
            </b-col>
            <b-col>
              <b-img
                thumbnail
                fluid
                :src="settings.login_page_logo"
                alt="Thumbnail"
              />
            </b-col>
          </b-row>
        </b-form-fieldset>
        <b-form-fieldset
          label="Navbar Logo"
          description="This logo will shown on navbar. Maximum size: 200KB (Recommended resolution: 150x85)"
          :label-cols="3"
          :horizontal="true"
        >
          <p style="color: red">{{ navbarAlert }}</p>

          <b-row>
            <b-col>
              <input
                type="file"
                class="form-control-file"
                v-on:change="processNavBarLogo($event)"
              />
            </b-col>

            <b-col>
              <b-img
                thumbnail
                fluid
                :src="settings.navbar_logo"
                alt="Thumbnail"
              />
            </b-col>
          </b-row>
        </b-form-fieldset>
        <b-form-fieldset
          label="Login Message"
          description="This message will shown on login page.Seperate your message sentences with #"
          :label-cols="3"
          :horizontal="true"
        >
          <h6>Preview Login Message</h6>
          <div
            v-html="compiledLoginMessage"
            style="min-height: 100px; background-color: #f6f6f6"
            class="mb-1"
          ></div>
          <b-form-textarea
            id="messagearea"
            v-model="settings.login_page_message"
            placeholder="#Privileged Direct Access ^500#Developed by H2HSecure Engineers# PDAccess ^800 just protects you.#PDAccess keeps your inventory accesses safe#PDAccess watches each access to your servers#Welcome to H2HSecure PDA"
            :rows="3"
            :max-rows="6"
            no-resize
          >
          </b-form-textarea>
        </b-form-fieldset>

        <b-row>
          <b-col class="d-flex justify-content-end">
            <b-button
              type="button"
              variant="success"
              @click="saveLookFeelSettings"
              >Save</b-button
            >
          </b-col>
        </b-row>
      </b-tab>
      <b-tab title="Desktop App">
        <b-form-fieldset
          label="Logo"
          description="This logo will shown on login page. Maximum size: 200KB (Recommended resolution: 260x100)"
          :label-cols="3"
          :horizontal="true"
        >
          <p style="color: red">{{ appSettings.loginAlert }}</p>
          <b-row>
            <b-col>
              <input
                type="file"
                class="form-control-file"
                v-on:change="processAppLoginLogo($event)"
              />
            </b-col>
            <b-col>
              <b-img
                thumbnail
                fluid
                :src="appSettings.login_page_logo"
                alt="Thumbnail"
              />
            </b-col>
          </b-row>
        </b-form-fieldset>
        <b-form-fieldset
          label="Login Message"
          description="This message will shown on login page.Seperate your message sentences with #"
          :label-cols="3"
          :horizontal="true"
        >
          <h6>Preview Login Message</h6>
          <div
            v-html="compiledAppLoginMessage"
            style="min-height: 100px; background-color: #f6f6f6"
            class="mb-1"
          ></div>
          <b-form-textarea
            id="messagearea"
            v-model="appSettings.login_page_message"
            placeholder="#Privileged Direct Access ^500#Developed by H2HSecure Engineers# PDAccess ^800 just protects you.#PDAccess keeps your inventory accesses safe#PDAccess watches each access to your servers#Welcome to H2HSecure PDA"
            :rows="3"
            :max-rows="6"
            no-resize
          >
          </b-form-textarea>
        </b-form-fieldset>
        <b-row>
          <b-col class="d-flex justify-content-end">
            <b-button
              type="button"
              variant="success"
              @click="saveAppLookFeelSettings"
              >Save</b-button
            >
          </b-col>
        </b-row>
      </b-tab>
      <b-tab title="Email Template">
        <b-form-fieldset
          label="Logo"
          description="This logo will shown on email template. Maximum size: 200KB (Recommended resolution: 260x100)"
          :label-cols="3"
          :horizontal="true"
        >
          <p style="color: red">{{ emailLogoAlert }}</p>
          <b-row>
            <b-col>
              <input
                type="file"
                class="form-control-file"
                v-on:change="processEmailLogo($event)"
              />
            </b-col>
            <b-col>
              <b-img
                thumbnail
                fluid
                width="260"
                :src="emailSettings.mailLogo"
                alt="Thumbnail"
              />
            </b-col>
          </b-row>
        </b-form-fieldset>
        <b-form-fieldset
          :horizontal="true"
          :label-cols="3"
          description="Company Name"
          label="Company Name"
        >
          <b-form-input
            placeholder="Company Name"
            type="text"
            v-model="emailSettings.companyName"
          ></b-form-input>
        </b-form-fieldset>
        <b-form-fieldset
          :horizontal="true"
          :label-cols="3"
          description="Company URL"
          label="Company URL"
        >
          <b-form-input
            placeholder="Company URL"
            type="text"
            v-model="emailSettings.companyUrl"
          ></b-form-input>
        </b-form-fieldset>
        <b-form-fieldset
          :horizontal="true"
          :label-cols="3"
          description="Company Address"
          label="Company Address"
        >
          <b-form-input
            placeholder="Company Address"
            type="text"
            v-model="emailSettings.companyAddress"
          ></b-form-input>
        </b-form-fieldset>
        <b-row>
          <b-col class="d-flex justify-content-end">
            <b-button
              type="button"
              variant="success"
              @click="saveEmailSettings()"
              >Save</b-button
            >
          </b-col>
        </b-row>
      </b-tab>
    </b-tabs>
  </p-card>
</template>
<script>
import marked from "marked";
export default {
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      settings: {
        registration_page_visibility: "0",
        login_page_logo: null,
        login_page_message: "",
        navbar_logo: null,
      },
      appSettings: {
        login_page_logo: null,
        login_page_message: "",
        navbarAlert: null,
        loginAlert: null,
      },
      emailSettings: {
        mailLogo: null,
        companyName: "",
        companyUrl: "",
        companyAddress: "",
      },
      acceptedImageTypes: ["image/jpeg", "image/png"],
      MAX_SIZE: 1024 * 200,
      navbarAlert: null,
      emailLogoAlert: null,
      loginAlert: null,
    };
  },
  computed: {
    compiledLoginMessage() {
      return marked(this.settings.login_page_message);
    },
    compiledAppLoginMessage() {
      return marked(this.appSettings.login_page_message);
    },
  },
  methods: {
    processLoginLogo(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (files[0].size > this.MAX_SIZE) {
        this.loginAlert = " Login page image size should be at most 200 KB";
        return;
      } else {
        if (!this.acceptedImageTypes.includes(files[0].type)) {
          this.loginAlert = "Image should be png or jpeg.";
        } else {
          this.loginAlert = null;
          if (!files.length) return;
          this.createImage(files[0], 0);
        }
      }
    },
    processAppLoginLogo(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (files[0].size > this.MAX_SIZE) {
        this.appSettings.loginAlert =
          " Login page image size should be at most 200 KB";
        return;
      } else {
        if (!this.acceptedImageTypes.includes(files[0].type)) {
          this.appSettings.loginAlert = "Image should be png or jpeg.";
        } else {
          this.loginAlert = null;
          this.appSettings.loginAlert = null;
          this.createImage(files[0], 0, 1);
        }
      }
    },
    processNavBarLogo(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (files[0].size > this.MAX_SIZE) {
        this.navbarAlert = " Navbar image size should be at most 200 KB";
        return;
      } else {
        if (!this.acceptedImageTypes.includes(files[0].type)) {
          this.navbarAlert = "Image should be png or jpeg.";
        } else {
          this.navbarAlert = null;
          if (!files.length) return;
          this.createImage(files[0], 1);
        }
      }
    },
    processEmailLogo(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (files[0].size > this.MAX_SIZE) {
        this.emailLogoAlert = " Email logo size should be at most 200 KB";
        return;
      } else {
        if (!this.acceptedImageTypes.includes(files[0].type)) {
          this.emailLogoAlert = "Image should be png or jpeg.";
        } else {
          this.emailLogoAlert = null;
          if (!files.length) return;
          this.createImage(files[0], 2);
        }
      }
    },
    createImage(file, logo, app = 0) {
      let reader = new FileReader();
      let vm = this;
      reader.onload = (e) => {
        if (logo == 0) {
          if (app == 0) {
            vm.settings.login_page_logo = e.target.result;
          } else {
            vm.appSettings.login_page_logo = e.target.result;
          }
        } else if (logo == 1) {
          vm.settings.navbar_logo = e.target.result;
        } else {
          vm.emailSettings.mailLogo = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    },
    saveEmailSettings() {
      let data = [
        {
          tag: "mail_logo",
          value: this.emailSettings.mailLogo,
        },
        {
          tag: "mail_company_name",
          value: this.emailSettings.companyName,
        },
        {
          tag: "mail_company_url",
          value: this.emailSettings.companyUrl,
        },
        {
          tag: "mail_company_address",
          value: this.emailSettings.companyAddress,
        },
      ];

      this.$http
        .post("/api/v1/settings", data)
        .then((response) => {
          this.$bvToast.toast(`All changes saved`, {
            title: "Email Settings page is updated",
            variant: "success",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Update operation has error!	!";
        });
    },
    saveLookFeelSettings() {
      let data = [
        {
          tag: "registration_page_visibility",
          value: this.settings.registration_page_visibility,
        },
        {
          tag: "login_page_logo",
          value: this.settings.login_page_logo,
        },
        {
          tag: "login_page_message",
          value: this.settings.login_page_message,
        },
        {
          tag: "navbar_logo",
          value: this.settings.navbar_logo,
        },
      ];

      this.$http
        .post("/api/v1/settings", data)
        .then((response) => {
          this.$bvToast.toast(`All changes saved`, {
            title: "Look Feel Settings page is updated",
            variant: "success",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Update operation has error!	!";
        });
    },
    saveAppLookFeelSettings() {
      let data = [
        {
          tag: "app_login_page_logo",
          value: this.appSettings.login_page_logo,
        },
        {
          tag: "app_login_page_message",
          value: this.appSettings.login_page_message,
        },
      ];

      this.$http
        .post("/api/v1/settings", data)
        .then((response) => {
          this.$bvToast.toast(`All changes saved`, {
            title: "App Look Feel Settings page is updated",
            variant: "success",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Update operation has error!	!";
        });
    },
  },
  created() {
    this.$http
      .get("/api/v1/settings/lookfeel")
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].tag == "registration_page_visibility") {
            this.settings.registration_page_visibility = response.data[i].value;
          }
          if (response.data[i].tag == "login_page_logo") {
            this.settings.login_page_logo = response.data[i].value;
          }
          if (response.data[i].tag == "login_page_message") {
            this.settings.login_page_message = response.data[i].value;
          }
          if (response.data[i].tag == "navbar_logo") {
            this.settings.navbar_logo = response.data[i].value;
          }
        }
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
    this.$http
      .get("/api/v1/settings/appLookfeel")
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].tag == "app_login_page_logo") {
            this.appSettings.login_page_logo = response.data[i].value;
          }
          if (response.data[i].tag == "app_login_page_message") {
            this.appSettings.login_page_message = response.data[i].value;
          }
        }
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
    this.$http
      .get("/api/v1/settings/mailSettings")
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].tag == "mail_logo") {
            this.emailSettings.mailLogo = response.data[i].value;
          }
          if (response.data[i].tag == "mail_company_name") {
            this.emailSettings.companyName = response.data[i].value;
          }
          if (response.data[i].tag == "mail_company_url") {
            this.emailSettings.companyUrl = response.data[i].value;
          }
          if (response.data[i].tag == "mail_company_address") {
            this.emailSettings.companyAddress = response.data[i].value;
          }
        }
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
.custom-file-control::after {
  content: "No logo selected" !important;
}

.custom-file-control::before {
  content: "Choose logo" !important;
}
</style>
