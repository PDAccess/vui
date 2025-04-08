<template>
  <div class="animated fadeIn">
    <p-card :cardBody="false">
      <b-row class="my-1">
        <b-col md="4">
          <p>
            You can generate a personal access token for each application you
            use that needs access to the GitLab API.
          </p>
          <p>
            You can also use personal access tokens to authenticate against Git
            over HTTP. They are the only accepted password when you have
            Two-Factor Authentication (2FA) enabled.
          </p>
        </b-col>
        <b-col md="8">
          <b-card bg-variant="light" class="mb-2" v-if="token !== null">
            <b-row>
              <b-col md="4">
                <h6>Token:</h6>
              </b-col>
              <b-col md="8">
                <h6>
                  {{ token }}
                  <button
                    v-if="copytext === token"
                    disabled
                    type="button"
                    class="btn btn-pill btn-info btn-sm"
                  >
                    Copied!
                  </button>
                  <button
                    v-else
                    v-b-tooltip.bottom
                    title="Copy"
                    type="button"
                    class="btn btn-pill btn-info btn-sm"
                    @click="copyTextArea(token)"
                  >
                    <em class="fa fa-copy"></em>
                  </button>
                </h6>
              </b-col>
            </b-row>
          </b-card>
          <strong>Add a personal access token</strong>
          <p>
            Pick a name for the application, and we'll give you a unique
            personal access token
          </p>
          <b-row class="mb-3">
            <b-col md="3">
              <label for="input-default">Name</label>
            </b-col>
            <b-col md="8">
              <b-form-input type="text" v-model="formdata.name"></b-form-input>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col md="3">
              <label for="input-default">Expire Date</label>
            </b-col>
            <b-col md="8">
              <p-date-picker
                @val="selectedDate = $event"
                :data="selectedDate"
                mode="dateTime"
                :clearBtn="true"
                :isRange="false"
                placeHolder="Select expire date/time"
              />
            </b-col>
          </b-row>
          <b-form-checkbox-group
            id="checkbox-group-2"
            name="flavour-2"
            v-model="scopes"
          >
            <b-row class="mb-3">
              <b-col md="3">Scopes</b-col>
              <b-col md="8">
                <b-form-checkbox value="api" id="checkbox-2" name="checkbox-1"
                  >api</b-form-checkbox
                >
                <small>
                  Grants complete read/write access to the API, including all
                  services and groups, actions and logs.
                </small>
              </b-col>
            </b-row>
            <b-row class="mb-3">
              <b-col md="3"></b-col>
              <b-col md="8">
                <b-form-checkbox
                  value="read_user"
                  id="checkbox-3"
                  name="checkbox-1"
                  >read_user</b-form-checkbox
                >
                <small>
                  Grants read-only access to the authenticated user's profile
                  through the /user API endpoint, which includes username,
                  public email, and full name. Also grants access to read-only
                  API endpoints under /users.
                </small>
              </b-col>
            </b-row>
            <b-row class="mb-3">
              <b-col md="3"></b-col>
              <b-col md="8">
                <b-form-checkbox value="sudo" id="checkbox-7" name="checkbox-1"
                  >sudo</b-form-checkbox
                >
                <small>
                  Grants permission to perform API actions as any user in the
                  system, when authenticated as an admin user.
                </small>
              </b-col>
            </b-row>
            <b-row class="mb-3">
              <b-col md="3"></b-col>
              <b-col md="8">
                <b-form-checkbox
                  value="profile"
                  id="checkbox-9"
                  name="checkbox-1"
                  >profile</b-form-checkbox
                >
                <small
                  >Grants read-only access to the user's profile data using
                  OpenID Connect.</small
                >
              </b-col>
            </b-row>
            <b-row class="mb-3">
              <b-col md="3"></b-col>
              <b-col md="8">
                <b-form-checkbox
                  id="checkbox-10"
                  name="checkbox-1"
                  value="email"
                  >email</b-form-checkbox
                >
                <small
                  >Grants read-only access to the user's primary email
                  address</small
                >
              </b-col>
            </b-row>
          </b-form-checkbox-group>
        </b-col>
      </b-row>
      <div class="p-5 d-flex justify-content-end">
        <b-button
          :disabled="formdata.name === ''"
          @click.stop="token = 162789127413"
          class="mr-2"
          variant="success"
          >Create personal access token</b-button
        >
      </div>
    </p-card>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      copytext: null,
      token: null,
      scopes: [],
      formdata: {
        name: "",
        callbackUrl: "",
        trusted: 0,
        scopes: "",
        date: null,
      },
      selectedDate: null,
    };
  },
  methods: {
    copyTextArea(value) {
      const el = document.createElement("textarea");
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      this.copytext = value;
      this.$bvToast.toast(`Copied: ${value}`, {
        title: "Copy Notification",
        variant: "info",
        autoHideDelay: 5000,
      });
    },
  },
};
</script>