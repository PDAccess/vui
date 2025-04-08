<template>
  <div class="animated fadeIn">
    <p-card :cardBody="false">
      <div v-if="errorStatus">
        <p-error
          header="Something went wrong!"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
      </div>
      <div v-else>
        <b-row class="my-1">
          <b-col md="2">
            <h5>
              <strong>Application: {{ app.name }}</strong>
            </h5>
          </b-col>
        </b-row>
        <hr />
        <b-row class="mb-3">
          <b-col md="3"> Application ID </b-col>
          <b-col md="8">
            <h5>
              {{ app.appid }}
              <button
                v-if="copytext === app.appid"
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
                @click="copyTextArea(app.appid)"
              >
                <em class="fa fa-copy" aria-hidden="true"></em>
              </button>
            </h5>
          </b-col>
        </b-row>
        <hr />
        <b-row class="mb-3">
          <b-col md="3"> Secret </b-col>
          <b-col md="8">
            <h5>
              {{ app.secret }}
              <button
                v-if="copytext === app.secret"
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
                @click="copyTextArea(app.secret)"
              >
                <em class="fa fa-copy"></em>
              </button>
            </h5>
          </b-col>
        </b-row>
        <hr />
        <b-row class="mb-3">
          <b-col md="3"> Callback Url </b-col>
          <b-col md="8" v-if="editable">
            <b-form-input type="text" v-model="app.callback_url"></b-form-input>
          </b-col>
          <b-col md="8" v-else>
            <h5>{{ app.callback_url }}</h5>
          </b-col>
        </b-row>
        <hr />
        <b-row class="mb-3">
          <b-col md="3"> Trusted </b-col>
          <b-col md="8">
            <h5>{{ app.trusted == 1 ? "Y" : "N" }}</h5>
          </b-col>
        </b-row>
        <hr />
        <b-row class="mb-3">
          <b-col md="3"> Scopes </b-col>
          <b-col md="8">
            <h5 v-for="(scope, index) in scopes" :key="index">- {{ scope }}</h5>
          </b-col>
        </b-row>
        <hr />
        <div class="p-5 d-flex justify-content-end">
          <b-button @click.stop="cancel" variant="danger">Cancel</b-button>
        </div>
      </div>
    </p-card>
  </div>
</template>
<script>
export default {
  props: ["id"],
  data() {
    return {
      editable: false,
      errorStatus: false,
      errorResponse: "",
      scopes: [],
      copytext: "",
      app: {
        appid: "",
        name: "",
        secret: "",
        callback_url: "",
        scopes: "",
        trusted: 0,
      },
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
    cancel() {
      this.$router.push(this.$route.query.redirect || "/admin/oauth2/list");
    },
  },
  created() {
    this.$http
      .get("api/v1/oauth2/id/" + this.$route.params.id)
      .then((response) => {
        this.app = response.data;
        this.scopes = response.data.scopes.split(",");
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
      });
  },
};
</script>