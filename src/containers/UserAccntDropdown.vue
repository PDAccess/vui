<template>
  <AppHeaderDropdown no-caret right>
    <template slot="header">
      <b-button class="btn btn-ghost-secondary" :class="{ active: isUser }">
        <p-profile-avatar :id="user.id" :profileUsername="user !== null ? user.username : ''" :username="avatarinfo"
          :size="30" :imageWidth="'auto'" :imageHeight="'30px'" :username-show="false" />
      </b-button>
    </template>
    <template slot="dropdown">
      <b-dropdown-header class="text-center font-weight-bold user-info" tag="div">
        <strong>{{ user !== null ? user.username : "" }}</strong>
        <template v-if="user.status">
          <hr />
          <strong>
            {{ user !== null ? user.status : "" }}
          </strong>
        </template>
      </b-dropdown-header>
      <b-dropdown-item @click="userDetailPage()"><em class="fa fa-user" /> Profile</b-dropdown-item>
      <b-dropdown-item to="/user/settings"><em class="fa fa-cog" /> Settings</b-dropdown-item>
      <b-dropdown-item @click.stop="Logout"><em class="fa fa-lock" /> Logout</b-dropdown-item>
    </template>
  </AppHeaderDropdown>
</template>

<script>
import { HeaderDropdown as AppHeaderDropdown } from "@coreui/vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "UserAccntDropdown",
  components: {
    AppHeaderDropdown,
  },
  data: () => {
    return {
      avatarinfo: "",
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
      url: "util/logOutUrl",
    }),
    isUser() {
      return this.$route.path.startsWith("/user");
    },
  },
  methods: {
    ...mapActions({
      logOutWithStore: "auth/logOut",
    }),
    getUser() {
      if (this.user === null) {
        return { username: "", status: "" };
      }
      return this.user;
    },
    userDetailPage() {
      this.$router.push({
        name: "User Detail",
        params: { id: this.user.id },
      });
    },
    Logout() {
      this.$http
        .post("/oauth/logout/default")
        .then(() => {
          this.logOutWithStore();
          this.url === ""
            ? this.$router.push("/login")
            : window.location.replace(this.url);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    this.avatarinfo = this.user.firstName + " " + this.user.lastName;
  },
};
</script>

<style>
.user-info>div {
  white-space: normal;
}
</style>
