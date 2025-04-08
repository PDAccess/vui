<template>
  <div class="app">
    <AppHeader fixed>
      <b-link :to="homePageUrl" class="d-md-down-none ml-2 mr-2">
        <div v-if="imageLoading" class="loadingImage">
          <p-loading :gif-height="25" />
        </div>
        <img v-else :src="imageUrl || baseSrc" height="25" alt="PDA Logo" />
      </b-link>

      <b-link to="/activities" class="d-lg-none ml-left ml-2" display="md" mobile>
        <div v-if="imageLoading" class="loadingImage">
          <p-loading :gif-height="25" />
        </div>
        <img
          v-else
          :src="imageUrl || baseSrc"
          height="25"
          alt="PDA Logo Text"
        />
      </b-link>

      <b-navbar-nav class="font-weight-bold d-lg-none" mobile>
        <services-dropdown class="ml-0 m-margin-none" />
        <groups-dropdown class="ml-0 m-margin-none" />

        <vault-dropdown class="ml-0" />

        <!-- <more-dropdown class="ml-0" /> -->

        <template v-if="userRole == 'Admin'">
          <span style="color: white">&#124;</span>
          <b-button
            v-b-tooltip.bottom
            title="Administration"
            type="link"
            to="/admin"
            class="btn btn-ghost-light"
            ><em class="icon-wrench"></em
          ></b-button>
          &nbsp;
        </template>
      </b-navbar-nav>

      <b-navbar-nav class="font-weight-bold d-none d-lg-block">
        <services-dropdown class="ml-1" />
        <groups-dropdown class="ml-1" />

        <!-- <b-button
          type="link"
          to="/activities/nav/livesessions?sort=createddesc"
          :class="{ active: isActivities }"
          class="btn btn-ghost-light font-weight-bold ml-1"
        >
           <em class="icon-layers"></em>
          <span class="d-sm-down-none"> Activities</span>
        </b-button> -->
        <!-- 
        <b-button
          type="link"
          class="btn btn-ghost-light font-weight-bold ml-1"
          to="/vault/nav/list"
        >
          <em class="fa fa-id-card" />
          <span class="d-sm-down-none"> Vault</span>
        </b-button> -->

        <vault-dropdown class="ml-1" />

        <!-- <more-dropdown class="ml-1" /> -->

        <template v-if="userRole === 'Admin'">
          <span style="color: white">&#124;</span>
          <b-button
            v-b-tooltip.bottom
            title="Administration"
            type="button"
            to="/admin"
            class="btn btn-ghost-light"
            ><em class="icon-wrench"></em
          ></b-button>
        </template>
        &nbsp;
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-button
          v-b-tooltip.bottom
          title="Snippets"
          type="button"
          to="/snippets"
          class="btn btn-ghost-info"
          ><em class="fa fa-window-maximize"></em>
          </b-button
        >
        <b-button
          v-b-tooltip.bottom
          title="Current Alarms"
          type="button"
          to="/alarms"
          class="btn btn-ghost-danger"
          ><em class="fa fa-bell"></em>
          <b-badge>{{ currentAlarmCount }}</b-badge></b-button
        >

        <b-button
          v-b-tooltip.bottom
          title="Download"
          type="button"
          to="/download"
          class="btn btn-ghost-success"
          ><em class="fa fa-download"></em
        ></b-button>

        <b-dropdown right variant="ghost-light" class="user-account-dropdown">
          <template #button-content>
            <em class="fa fa-question-circle"></em>
          </template>
          <b-dropdown-item to="/help/helpIndex">Help</b-dropdown-item>
          <b-dropdown-item href="https://pdaccess.com/contacts"
            >Support</b-dropdown-item
          >
          <b-dropdown-item to="">Keyboard Shortcuts</b-dropdown-item>
          <b-dropdown-item to="/about">About</b-dropdown-item>
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item href="https://pdaccess.com/contacts"
            >Submit Feedback</b-dropdown-item
          >
        </b-dropdown>

        <UserAccntDropdown class="user-account-dropdown" />
      </b-navbar-nav>
    </AppHeader>
    <div class="app-body">
      <router-view name="sidebar"></router-view>
      <main class="main">
        <div v-for="item in messages" :key="item.id">
          <b-alert
            dismissible
            fade
            show
            :style="style(item.backgroundColor, item.fontColor, item.fontsize)"
            class="message-preview"
            ><em
              class="fa fa-bullhorn"
              style="width: inherit; padding: 0px 5px"
            ></em
            ><span v-html="item.message"></span>
          </b-alert>
        </div>
        <div class="content-wrapper">
          <div class="container-fluid">
            <Breadcrumb :list="list" />
            <div
              :class="{ 'd-lg-none': responsive, 'd-md-down': !responsive }"
              :display="responsive ? 'md' : 'lg'"
              :mobile="responsive"
            >
              <router-view></router-view>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import navuser from "@/router/_navuser";
import navadmin from "@/router/_navadmin";
import administration from "@/router/_administration";
import {
  Header as AppHeader,
  SidebarToggler,
  Sidebar as AppSidebar,
  SidebarFooter,
  SidebarForm,
  SidebarHeader,
  SidebarMinimizer,
  SidebarNav,
  Aside as AppAside,
  AsideToggler,
  Footer as TheFooter,
} from "@coreui/vue";
import UserAccntDropdown from "./UserAccntDropdown";
import ServicesDropdown from "./ServicesDropdown";
import GroupsDropdown from "./GroupsDropdown";
import AutomationDropdown from "./AutomationDropdown";
import Breadcrumb from "@/views/h2h/components/Breadcrumb";
import { mapGetters } from "vuex";
import MoreDropdown from "./MoreDropdown";
import VaultDropdown from "./VaultDropdown";

export default {
  name: "DefaultContainer",
  components: {
    MoreDropdown,
    AsideToggler,
    AppHeader,
    AppSidebar,
    AppAside,
    TheFooter,
    Breadcrumb,
    SidebarForm,
    SidebarFooter,
    SidebarToggler,
    SidebarHeader,
    SidebarNav,
    SidebarMinimizer,
    UserAccntDropdown,
    ServicesDropdown,
    GroupsDropdown,
    AutomationDropdown,
    VaultDropdown,
  },
  data() {
    return {
      currentAlarmCount: 0,
      administrationStatus: false,
      settingsStatus: false,
      navuser: navuser.items,
      navadmin: navadmin.items,
      administration: administration.items,
      messages: [],
      userRole: "",
      ws: null,
      isLoading: false,
      isConnected: false,
      conn: "",
      connectionString: [],
      navbarLogo: null,
      baseSrc: null,
      imageLoading: false,
      imageUrl: null,
    };
  },
  computed: {
    isActivities() {
      return this.$route.path.startsWith("/activities");
    },
    responsive() {
      return screen.width < 500;
    },
    list() {
      return this.$route.matched.filter(
        (route) => this.$route.params.name || route.name || route.meta.label
      );
    },
    ...mapGetters({
      user: "auth/user",
      token: "auth/token",
      homePageUrl: "util/homePageUrl",
    }),
  },
  beforeDestroy() {
    let vm = this;
    vm.disconnect();
  },
  watch: {},
  methods: {
    statusChange() {
      this.settingsStatus = !this.settingsStatus;
      this.administrationStatus = !this.administrationStatus;
    },
    style(background, font, fontSize) {
      let data = {
        backgroundColor: background,
        color: font,
        fontSize: fontSize + "px",
      };
      return data;
    },
    onopen() {
      let vm = this;
      let session = {
        sessionId: "null",
        token: this.token,
        deviceId: vm.conn.id,
      };
      console.log("Info: WebSocket connection opened.", session);
      //this.ws.send(window.btoa(JSON.stringify(session)));
      this.ws.send(localStorage.getItem("username"));
      this.isConnected = true;
    },
    message(event) {
      if (this.version == null) {
        console.log("This is new connection:", event.data);
        let m = JSON.parse(event.data);
        this.connectionString = m;
        //this.treeData = _.map(m.tables, (n) => ({ label: n }));
        this.$bvToast.toast(
          `${m.username} opened new connection in ${m.serviceName}!`,
          {
            title: "Connection Notification",
            variant: "info",
            autoHideDelay: 5000,
          }
        );
        const notification = {
          title: "New Client Session",
          options: {
            body: `${m.username} opened new connection in ${m.serviceName}!`,
          },
          events: {
            onerror: function () {
              console.log("Custom error event was called");
            },
            onclick: function () {
              console.log("Custom click event was called");
            },
            onclose: function () {
              console.log("Custom close event was called");
            },
            onshow: function () {
              console.log("Custom show event was called");
            },
          },
        };
        this.$notification.show(
          notification.title,
          notification.options,
          notification.events
        );
      } else {
        console.log("Result Set:" + event.data);
        let j = JSON.parse(event.data);

        if (j.error != null) {
          this.showAlert(j.error.message, "alert-danger");
          this.results = [];
        } else {
          this.results = j.values;
          this.headers = _.map(j.headers, (n) => n.title);
          this.isLoading = false;
        }
      }
    },
    close() {
      console.log("Info: WebSocket connection closed.");
      this.isConnected = false;
    },
    connect() {
      //let target = "/ws/notificationtunnel";
      //this.ws = new SockJS(target);
      //this.ws.onopen = this.onopen;
      //this.ws.onmessage = this.message;
      //this.ws.onclose = this.close;
    },
    disconnect() {
      if (this.ws != null) {
        this.ws.close();
        this.ws = null;
      }
    },
    checkNotifications() {
      let id = this.user.userId;
      this.$http
        .post("/api/v1/notification/check/user")
        .then((response) => {
          if (response.data == "enabled") this.connect();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getCurrentAlarmCount() {
      this.$http
        .get("/api/v1/alarm/count")
        .then((response) => {
          this.currentAlarmCount = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    if (this.baseSrc == null) {
      this.imageLoading = true;
      this.$http
        .get("/api/v1/tag/navbar-logo")
        .then((response) => {
          this.imageUrl = response.data == "" ? "img/pda.png" : response.data;
          this.imageLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.imageLoading = false;
          if (error.status == 500) {
            console.log("error");
          }
          this.baseSrc = require("@/assets/img/pda.png");
        });
    }
    this.userRole = this.user.role;
    this.$http
      .get("/api/v1/broadcast")
      .then((response) => {
        this.messages = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    this.checkNotifications();
    this.getCurrentAlarmCount();
  },
};
</script>

<style>
.sidebar .nav-dropdown.open .nav-link {
  color: #000;
}

.list-group-item {
  padding-top: 0.75rem;
  padding-right: 0rem;
  padding-bottom: 0.75rem;
  padding-left: 0rem;
}
.tab-content .tab-pane {
  padding-top: 1rem;
  padding-right: 0rem;
  padding-bottom: 1rem;
  padding-left: 0rem;
}

.profile-button {
  border: none;
  text-decoration: none;
  color: black;
}
.loadingImage {
  display: block;
  margin: auto;
}

.tab-content {
  border-top: 1px solid #e5e5e5;
  border-right: 0px;
  border-left: 0px;
  border-bottom: 0px;
}

.content-wrapper .container-fluid {
  padding: 0 16px;
  padding-top: 0px;
  padding-right: 16px;
  padding-bottom: 0px;
  padding-left: 16px;
}

.container-fluid {
  background-color: white;
}

.full-width {
  width: 100%;
}
.full-height {
  height: 100%;
}

.message-preview {
  text-align: center;
}

.app-header .navbar-brand {
  height: 40px;
  display: -webkit-inline-box;
  width: fit-content;
}

.app-header {
  border-bottom: 0px;
}

.alert {
  border-radius: 0px;
  margin-bottom: 0px;
  border: 0px;
}

.navbar {
  padding: 0rem 0rem;
}

.search-input {
  font-size: 0.875rem !important;
}

.large-area .dropdown-menu.show {
  width: 300px !important;
  padding: 10px 0 !important;
}

.btn-form-text {
  background-color: #f0f3f5;
  border: 1px solid #e4e7ea;
  border-radius: 0.25rem;
}

.mobile-show {
  display: none;
}

@media only screen and (max-width: 400px) {
  .mobile-show {
    display: inline;
  }

  .mobile-none {
    display: none;
  }
}

@media only screen and (max-width: 370px) {
  .m-margin-none {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}

.split-nav {
  display: none;
}

@media only screen and (max-width: 650px) {
  .container-nav {
    -webkit-box-orient: vertical;
    -moz-box-orient: vertical;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
  }

  .container-nav .module-nav {
    -webkit-box-ordinal-group: 2;
    -moz-box-ordinal-group: 2;
    -ms-flex-order: 2;
    -webkit-order: 2;
    order: 2;
    margin-top: 5px;
  }

  .container-nav .create-nav {
    -webkit-box-ordinal-group: 1;
    -moz-box-ordinal-group: 1;
    -ms-flex-order: 1;
    -webkit-order: 1;
    order: 1;
  }

  .split-nav {
    display: block;
  }

  .sort-input {
    width: 61%;
  }
}

@media only screen and (max-width: 769px) {
  .access-area {
    justify-content: flex-end !important;
    margin-bottom: 2px;
    margin-top: 5px;
  }
}

@media only screen and (max-width: 600px) {
  .c-pane {
    min-width: 300px !important;
  }
}

.user-account-dropdown .dropdown-menu {
  min-width: 12rem;
}

.avatar-link-btn {
  display: flex;
  padding-left: 0;
  align-items: center;
}
</style>
