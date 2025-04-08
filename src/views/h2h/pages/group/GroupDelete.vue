<template>
  <div class="animated fadeIn">
    <p-card v-if="userRole === 'Admin'" variant="danger">
      <div v-if="errorStatus">
        <p-error
          header="Delete operation has error!"
          :errorResponse="errorResponse"
          @reload="deleteService"
        />
      </div>
      <div v-else>
        <b-list-group flush>
          <b-list-group-item>
            <b-row class="my-1">
              <b-col sm="4">
                <h3>Group Delete</h3>
                <p>Are you sure delete this group?</p>
                <p>Group name: {{ info.groupname }}</p>
              </b-col>
              <b-col sm="8">
                <p>
                  To delete this group, you must do write the first 3 characters
                  of the Group Name!
                </p>
                <b-form-input
                  class="mb-2"
                  type="text"
                  v-model="deleteconfirmtext"
                ></b-form-input>
                <b-button
                  :disabled="
                    this.deleteconfirmtext.substring(0, 3) !==
                    info.groupname.substring(0, 3)
                  "
                  @click.stop="deleteService()"
                  class="btn btn-danger"
                  >Delete
                </b-button>
              </b-col>
            </b-row>
          </b-list-group-item>
        </b-list-group>
      </div>
    </p-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["id"],
  data() {
    return {
      errorStatus: false,
      errorResponse: "",
      userRole: "User",
      info: {
        name: "",
      },
      deleteconfirmtext: "",
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  methods: {
    deleteService() {
      this.$http
        .delete("api/v1/group/" + this.id)
        .then((response) => {
          if ((response.status = 200)) {
            this.$bvToast.toast(`Deleted group!`, {
              title: "Group Notification",
              variant: "info",
              autoHideDelay: 5000,
            });
            this.$router.push(
              this.$route.query.redirect || "/groups/nav/yourgroups"
            );
          }
        })
        .catch(function (error) {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
        });

    },
  },
  created() {
    this.userRole = this.user.role;
    this.$http
      .get("/api/v1/group/info/" + this.id)
      .then((response) => {
        this.info = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
      });
  },
};
</script>
