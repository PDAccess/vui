<template>
  <div class="animated fadeIn">
    <p-card :cardBody="false">
      <div v-if="errorStatus">
        <p-error
          :header="errorHeader"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
      </div>
      <div v-else>
      <b-row class="my-1">
        <b-col md="2">
          <h5><strong>New Applications</strong></h5>
        </b-col>
        <b-col md="10">
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
              <label for="input-default">Callback URL</label>
            </b-col>
            <b-col md="8">
              <b-form-textarea
                placeholder="Enter vaild http url for callback operations..."
                rows="3"
                max-rows="6"
                type="text"
                v-model="formdata.callback_url"
              >
              </b-form-textarea>
            </b-col>
          </b-row>
          <b-row class="mb-3">
            <b-col md="3"> Trusted </b-col>
            <b-col md="8">
              <b-form-checkbox
                :unchecked-value="0"
                :value="1"
                id="checkbox-1"
                name="checkbox-3"
                v-model="formdata.trusted"
              >
              </b-form-checkbox>
              <small
                >Trusted applications are automatically authorized on
                PDAccess</small
              >
            </b-col>
          </b-row>
          <b-form-checkbox-group
            id="checkbox-group-2"
            name="flavour-2"
            v-model="scopes"
          >
            <b-row class="mb-3">
              <b-col md="3"> Scopes </b-col>
              <b-col md="8">
                <b-form-checkbox value="api" id="checkbox-2" name="checkbox-1">
                  api
                </b-form-checkbox>
                <small
                  >Grants complete read/write access to the API, including all
                  services and groups, actions and logs.</small
                >
              </b-col>
            </b-row>
            <b-row class="mb-3">
              <b-col md="3"> </b-col>
              <b-col md="8">
                <b-form-checkbox
                  value="read_user"
                  id="checkbox-3"
                  name="checkbox-1"
                >
                  read_user
                </b-form-checkbox>
                <small
                  >Grants read-only access to the authenticated user's profile
                  through the /user API endpoint, which includes username,
                  public email, and full name. Also grants access to read-only
                  API endpoints under /users.</small
                >
              </b-col>
            </b-row>
            <b-row class="mb-3">
              <b-col md="3"> </b-col>
              <b-col md="8">
                <b-form-checkbox value="sudo" id="checkbox-7" name="checkbox-1">
                  sudo
                </b-form-checkbox>
                <small
                  >Grants permission to perform API actions as any user in the
                  system, when authenticated as an admin user.</small
                >
              </b-col>
            </b-row>
            <b-row class="mb-3">
              <b-col md="3"> </b-col>
              <b-col md="8">
                <b-form-checkbox
                  value="profile"
                  id="checkbox-9"
                  name="checkbox-1"
                >
                  profile
                </b-form-checkbox>
                <small
                  >Grants read-only access to the user's profile data using
                  OpenID Connect.</small
                >
              </b-col>
            </b-row>
            <b-row class="mb-3">
              <b-col md="3"> </b-col>
              <b-col md="8">
                <b-form-checkbox
                  id="checkbox-10"
                  name="checkbox-1"
                  value="email"
                >
                  email
                </b-form-checkbox>
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
          :disabled="formdata.name === '' || formdata.callback_url === ''"
          @click.stop="submit"
          class="mr-2"
          variant="success"
          >Submit
        </b-button>
        <b-button @click.stop="cancel" variant="danger">Cancel</b-button>
      </div>
      </div>
    </p-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      scopes: [],
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      formdata: {
        name: "",
        callback_url: "",
        trusted: 0,
        scopes: "",
      },
    };
  },
  methods: {
    submit() {
      this.formdata.scopes = this.scopes.join();
      this.$http
        .post("api/v1/oauth2", this.formdata)
        .then((response) => {
          this.$bvToast.toast(`Edited Oauth2 application!`, {
            title: "Oauth2 Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          console.log(response);
          this.$router.push(this.$route.query.redirect || "/admin/oauth2/list");
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorHeader = "Edit operation has error!";
          this.errorResponse = error;
        });
    },
    cancel() {
      this.$router.push(this.$route.query.redirect || "/admin/oauth2/list");
    },
  },
  created() {
    this.$http
      .get("api/v1/oauth2/id/" + this.$route.params.id)
      .then((response) => {
        this.formdata = response.data;
        this.scopes = response.data.scopes.split(",");
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorHeader = "Something went wrong!";
        this.errorResponse = error;
      });
  },
};
</script>
