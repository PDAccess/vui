<template>
  <div class="animated fadeIn">
    <b-card
      no-body
      v-if="info.name !== 'PDA' && userRole === 'Admin'"
      variant="danger"
    >
      <p-error
        v-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <b-list-group v-else flush>
        <b-list-group-item>
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Service Delete</h3>
              <p>Are you sure delete this service?</p>
              <p>Service name: {{ info.name }}</p>
            </b-col>
            <b-col sm="8">
              <p>
                To delete this service, you must do write the first 3 characters
                of the Service Name!
              </p>
              <b-form-input
                class="mb-4"
                type="text"
                v-model="deleteconfirmtext"
              ></b-form-input>
              <b-row>
                <b-col class="d-flex justify-content-end">
                  <b-button
                    :disabled="
                      this.deleteconfirmtext.substring(0, 3) !=
                      info.name.substring(0, 3)
                    "
                    @click.stop="deleteService()"
                    class="btn btn-danger"
                    >Delete
                  </b-button>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </div>
</template>

<script>
export default {
  props: ["id"],
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      userRole: "User",
      info: {
        name: "",
      },
      deleteconfirmtext: "",
    };
  },
  methods: {
    deleteService() {
      this.$http
        .delete("api/v1/service/" + this.id)
        .then((response) => {
          if ((response.status = 200)) {
            this.$bvToast.toast(`Deleted service!`, {
              title: "Service Notification",
              variant: "info",
              autoHideDelay: 5000,
            });
            this.$router.push(
              this.$route.query.redirect || "/service/nav/list"
            );
          }
        })
        .catch(function (error) {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
  },
  created() {
    this.$http
      .get("/api/v1/user/who")
      .then((response) => {
        this.userRole = response.data.urole;
      })
      .catch((error) => {
        console.log(error);
      });

    this.$http
      .get("/api/v1/service/id/" + this.id)
      .then((response) => {
        this.info = response.data;
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