<template>
  <div>
    <p-card :cardBody="false">
      <div v-if="errorStatus">
        <p-error
          header="List operation has error!"
          :errorResponse="errorResponse"
          @reload="saveAuthSettings"
        />
      </div>
      <div v-else>
        <h5>Sign-in Restrictions</h5>
        <hr />
        <b-form-fieldset
          label="Two-factor authentication"
          description=""
          :label-cols="3"
          :horizontal="true"
        >
          <b-form-checkbox
            id="twofactor"
            class="two-factor"
            v-model="settings.two_factor_auth"
            value="1"
            unchecked-value="0"
            plain
          >
            Require all users to setup Two-factor authentication
          </b-form-checkbox>
        </b-form-fieldset>

        <b-form-fieldset
          label="Home Page URL"
          description="We will redirect login in users to this page."
          :label-cols="3"
          :horizontal="true"
        >
          <b-form-select
            v-model="settings.home_page_url"
            :options="options"
            :label-cols="3"
            :horizontal="true"
            description="We will redirect non-logged in users to this page.(Ex: https://www.pdaccess.com)"
          ></b-form-select>
        </b-form-fieldset>
        <b-form-fieldset
          label="After Sign Out URL"
          description="We will redirect users to this page after they sign out. (Ex: https://www.pdaccess.com)"
          :label-cols="3"
          :horizontal="true"
        >
          <b-form-input
            type="url"
            v-model="settings.after_sign_out_path"
            placeholder=""
          ></b-form-input>
        </b-form-fieldset>
        <b-row>
          <b-col class="d-flex justify-content-end">
            <b-button variant="success" v-on:click="saveAuthSettings"
              >Save</b-button
            >
          </b-col>
        </b-row>
      </div>
    </p-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      errorStatus: false,
      errorResponse: "",
      settings: {
        two_factor_auth: 0,
        home_page_url: "",
        after_sign_out_path: "",
      },
      afterSignOutError: null,
      options: [
        { value: "/service/nav/list", text: "Service" },
        { value: "/groups/nav/yourgroups", text: "Groups" },
        {
          value: "/activities/nav/livesessions?sort=createddesc",
          text: "Activities",
        },
        { value: "/snippets/nav/yoursnippets", text: "Snippets" },
      ],
    };
  },
  methods: {
    saveAuthSettings() {
      if (
        this.settings.after_sign_out_path == "" ||
        this.checkUrl(this.settings.after_sign_out_path)
      ) {
        this.afterSignOutError = null;
        let data = [
          {
            tag: "two_factor_auth",
            value: this.settings.two_factor_auth,
          },
          {
            tag: "home_page_url",
            value: this.settings.home_page_url,
          },
          {
            tag: "after_sign_out_path",
            value: this.settings.after_sign_out_path,
          },
        ];

        this.$http
          .post("/api/v1/settings", data)
          .then((response) => {
          })
          .catch((error) => {
            console.log(error);
            this.errorStatus = true;
            this.errorResponse = error;
          });
      } else {
        this.afterSignOutError = "Link needs to start with http:// or https://";
        this.$bvToast.toast(
          `Please enter your after sign out url as url including http and https`,
          {
            title: "Authentication Settings Notification",
            variant: "danger",
            autoHideDelay: 5000,
          }
        );
      }
    },
    checkUrl(url) {
      return (
        url.substring(0, 7) === "http://" || url.substring(0, 8) === "https://"
      );
    },
  },
  created() {
    this.$http
      .get("/api/v1/settings/auth")
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].tag == "two_factor_auth") {
            this.settings.two_factor_auth = response.data[i].value;
          }
          if (response.data[i].tag == "home_page_url") {
            this.settings.home_page_url = response.data[i].value;
          }
          if (response.data[i].tag == "after_sign_out_path") {
            this.settings.after_sign_out_path = response.data[i].value;
          }
        }
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
      });
  },
};
</script>

<style>
.two-factor .form-check-label {
  margin-top: 3px;
}
</style>
