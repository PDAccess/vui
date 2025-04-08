<template>
  <div class="animated fadeIn">
    <p-card>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="6">
              <h5>Global notification settings</h5>
              <p>
                You can specify notification level per group or per project.
              </p>
              <p>
                By default, all projects and groups will use the global
                notifications setting.
              </p>
            </b-col>
            <b-col sm="6">
             
              <b-button
                @click="enableNotifications"
                v-if="user.notificationStatus == false"
                v-b-modal.modal
                variant="success"
                >Enable It</b-button
              >
              <b-button
                @click="disableNotifications"
                v-if="user.notificationStatus == true"
                v-b-modal.modal
                variant="danger"
                >Disable It</b-button
              >
            </b-col>
          </b-row>
        </li>
      </ul>
    </p-card>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  props: ["id"],
  data() {
    return {
      user: {
        notificationStatus: "",
      },
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
    responsive() {
      return screen.width < 500;
    },
  },
  methods: {
    enableNotifications() {
      this.$http
        .post("/api/v1/notification/enableuser/" + this.user.userId)
        .then((response) => {
          this.user.notificationStatus = true;
          this.$bvToast.toast(`Service notifications are enabled!`, {
            title: "Service Notification",
            variant: "success",
            solid: true,
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    disableNotifications() {
      this.$http
        .post("/api/v1/notification/disableuser/" + this.user.userId)
        .then((response) => {
          this.user.notificationStatus = false;
          this.$bvToast.toast(`Service notifications are disabled!`, {
            title: "Service Notification",
            variant: "danger",
            solid: true,
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    checkNotifications() {
      this.$http
        .post("/api/v1/notification/check/user")
        .then((response) => {
          if (response.data == "enabled") this.user.notificationStatus = true;
          else this.user.notificationStatus = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    this.checkNotifications();
  },
};
</script>
