<template>
  <p-error
    v-if="errorStatusAuth"
    header="List operation has error!"
    :errorResponse="errorResponse"
    @reload="$router.go()"
  />
  <p-loading v-else-if="authLoading" class="my-5" message="Loading..." />
  <div v-else>
    <div v-if="authsessions.length === 0">
      <p-initial
        icon="plus-circle"
        header="You don't have any Authentications."
        message="Please start a session."
      />
    </div>
    <div v-else>
      <b-table
        :fields="sessionsuserfields"
        :items="authsessions"
        :responsive="responsive"
        hover
        show-empty
      >
        <template v-slot:cell(ip_address)="row">
          <div
            class="text-danger"
            :title="row.item.ip_address"
            v-b-tooltip.bottom
          >
            {{ row.item.ip_address }}
          </div>
        </template>
        <template v-slot:cell(attemptedAt)="row">
          <p-timing :start-date="row.item.attemptedAt" />
        </template>
        <template v-slot:cell(service)="row">
          <span v-if="row.item.service">
            {{ row.item.service.name }}
          </span>
        </template>
        <template v-slot:cell(success)="row">
          <b-badge v-if="row.item.success" variant="primary"> Success </b-badge>
          <b-badge v-else variant="danger"> Failed </b-badge>
        </template>
      </b-table>
      <b-row class="d-flex justify-content-center">
        <b-pagination
          class="mt-4"
          v-model="currentPageAuth"
          :total-rows="totalPages * perPage"
          :per-page="perPage"
          aria-controls="my-table"
          :disabled="commandActionLiveMode"
        ></b-pagination>
      </b-row>
    </div>
  </div>
</template>

<script>
import mappage from "@/views/h2h/components/mappage";
import InfiniteLoading from "vue-infinite-loading";
import fcart from "@/views/h2h/components/frappecharts";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Avatar from "vue-avatar";
import axios from "axios";

export default {
  name: "app",
  props: ["id"],
  components: {
    mappage,
    InfiniteLoading,
    fcart,
    VuePerfectScrollbar,
    Avatar,
  },
  data() {
    return {
      errorStatus: false,
      loading: true,
      userinfodiv: false,
      statisticgraph: false,

      errorResponse: {},
      avc: [],
      colors: ["#ebedf0", "#c0ddf9", "#73b3f3", "#3886e1", "#17459e"],
      labels: [
        "12am-3am",
        "3am-6am",
        "6am-9am",
        "9am-12pm",
        "12pm-3pm",
        "3pm-6pm",
        "6pm-9pm",
        "9pm-12am",
      ],
      totalPages: 0,
      perPage: 15,
      data1: {},
      data2: {},
      countLabel: "Level",
      start: new Date(2018, 1, 1),
      end: new Date(),
      currentPageAction: 0,
      currentPageSession: 0,
      currentPageAuth: 1,
      currentPageService: 0,
      currentPageGroup: 0,
      currentPagePolicy: 0,
      sessionsLoading: true,
      errorStatusSessions: false,
      actionsLoading: true,
      errorStatusActions: false,
      authLoading: true,
      errorStatusAuth: false,
      servicesLoading: true,
      errorStatusService: false,
      groupsLoading: true,
      errorStatusGroups: false,
      policiesLoading: true,
      errorStatusPolicies: false,
      userdata: {
        userId: "",
        username: "",
        first_name: "",
        last_name: "",
        phone: "",
        company: "",
        email: "",
        urole: "",
        created_at: "",
        updated_at: "",
        tenantid: "",
        external: false,
        tenantEntity: {
          companyName: "",
        },
      },
      usercontroldata: {
        userId: "",
        username: " ",
        first_name: "",
        last_name: "",
        phone: "",
        company: "",
        email: "",
        urole: "",
        created_at: "",
        updated_at: "",
        tenantid: "",
        external: false,
        tenantEntity: {
          companyName: "",
        },
      },
      authsessions: [],
      sessions: [],
      actions: [],
      services: [],
      groups: [],
      policies: [],
      sessionsuserfields: [
        { key: "ipAddress", label: "Ip" },
        { key: "userAgent", label: "User Agent" },
        { key: "attemptedAt", label: "Attempt Time" },
        { key: "success", label: "" },
        { key: "loginType", label: "" },
        { key: "service", label: "Service" },
      ],
      actionfields: [
        { key: "servicename", label: "Service" },
        { key: "proxy_action", label: "Action" },
        { key: "actionTime", label: "" },
      ],
      sessionfields: [
        { key: "name", label: "Service" },
        { key: "ipAddress", label: "IP Address" },
        { key: "duration", label: "" },
        { key: "actions", label: "" },
      ],
      servicefields: [
        { key: "name", label: "Service Name" },
        { key: "description", label: "Description" },
        { key: "ipAddress", label: "Ip Adress" },
      ],
      groupfields: [
        { key: "groupname", label: "Group Name" },
        { key: "description", label: "Description" },
        { key: "grouptype", sortable: true, label: "Type" },
      ],
      policyfields: [
        { key: "name", label: "Policy Name" },
        { key: "policyRegexEntity", label: "Regex" },
        { key: "idtype", sortable: true, label: "Type" },
      ],
    };
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  watch: {
    currentPageAuth: function (value) {
      this.getAuthLogs();
    },
  },
  methods: {
    details(item) {
      this.$http
        .get("/api/v1/session/actions/" + item.sessionId)
        .then((response) => {
          if (response.status == 200) {
            if (this.actions.length == 0) {
              this.$bvToast.toast(`There is no action on this session!`, {
                title: "There is no action on this session!",
                variant: "warning",
                autoHideDelay: 5000,
              });
            } else {
              this.$router.push({
                name: "Session Detail",
                params: {
                  id: item.sessionId,
                },
              });
            }
          }
        })
        .catch(function (error) {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    mailto(mail) {
      return "mailto:" + mail;
    },
    getServiceTypeNameByTypeId(id) {
      let variant;
      switch (id) {
        case "1":
          variant = "mysql";
          break;
        case "2":
          variant = "postgresql";
          break;
        case "3":
          variant = "msserver";
          break;
        case "4":
          variant = "oracle";
          break;
        case "5":
          variant = "ssh";
          break;
        case "6":
          variant = "telnet";
          break;
        case "7":
          variant = "rdp";
          break;
        case "8":
          variant = "vnc";
          break;
        default:
          variant = "ssh";
      }
      return variant;
    },
    getServiceBadgeColor(id) {
      switch (id) {
        case 1:
          return "success";
        case 2:
          return "dark";
        case 3:
          return "primary";
        case 4:
          return "secondary";
        case 5:
          return "warning";
        case 6:
          return "secondary";
        case 7:
          return "warning";
        case 8:
          return "secondary";
        default:
          return "";
      }
    },
    infiniteHandlerAction($state) {
      let data = {
        perPage: this.perPage,
        currentPage: this.currentPageAction,
      };

      this.$http
        .post("/api/v1/action/user/" + this.id, data)
        .then((response) => {
          if (response.data.length) {
            this.currentPageAction += 1;
            response.data.forEach((f) => {
              this.actions.push(f);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    infiniteHandlerSession($state) {
      let pagination = {
        perPage: this.perPage,
        currentPage: this.currentPageSession,
      };
      let userids = [this.id];

      let data = {
        pagination: pagination,
        userids: userids,
      };

      this.$http
        .post("/api/v1/session/filter", data)
        .then((response) => {
          if (response.data.sessionEntities.length) {
            this.currentPageSession += 1;
            response.data.sessionEntities.forEach((f) => {
              this.sessions.push(f);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    infiniteHandlerAuth($state) {
      let dataPolicy = {
        perPage: this.perPage,
        currentPage: this.currentPageAuth,
      };
      this.$http
        .post("/api/v1/auths/group/" + this.id, dataPolicy)
        .then((response) => {
          if (response.data.length) {
            this.currentPageAuth += 1;
            response.data.forEach((f) => {
              this.authsessions.push(f);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          $state.complete();
          console.log(error);
          if (error.status == 500) {
            this.$bvToast.toast(`Sessions cant get!`, {
              title: "Sessions cant get!",
              variant: "error",
              autoHideDelay: 5000,
            });
          }
        });
    },
    infiniteHandlerService($state) {
      let sort =
        this.$route.query.sort == null ? "name" : this.$route.query.sort;
      let o = {
        perPage: this.perPage,
        currentPage: this.currentPageService,
      };
      this.$http
        .post(`/api/v1/service/user/${this.userdata.id}/${sort}`, o)
        .then((response) => {
          if (response.data.length) {
            this.currentPageService += 1;
            response.data.forEach((f) => {
              this.services.push(f);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.status == 500) {
            this.$bvToast.toast(`Service cant get!`, {
              title: "Service cant get!",
              variant: "error",
              autoHideDelay: 5000,
            });
          }
        });
    },
    infiniteHandlerPolicy($state) {
      let dataPolicy = {
        perPage: this.perPage,
        currentPage: this.currentPagePolicy,
      };
      this.$http
        .post("/api/v1/policy/policyuser/" + this.id, dataPolicy)
        .then((response4) => {
          if (response4.data.length) {
            this.currentPagePolicy += 1;
            response4.data.forEach((f) => {
              this.policies.push(f);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.status == 500) {
            this.$bvToast.toast(`Policies cant get!`, {
              title: "Policies cant get!",
              variant: "error",
              autoHideDelay: 5000,
            });
          }
        });
    },
    infiniteHandlerGroup($state) {
      let groupsdata = {
        perPage: this.perPage,
        currentPage: this.currentPageGroup,
        sort: this.$route.query.sort == null ? "name" : this.$route.query.sort,
      };
      if (this.userdata.urole == "Admin") {
        this.$http
          .post("/api/v1/group", groupsdata)
          .then((response2) => {
            if (response2.data.length) {
              response2.data.forEach((f) => {
                this.groups.push(f);
              });
              this.currentPageGroup += 1;
              $state.loaded();
            } else {
              $state.complete();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.$http
          .post(`/api/v1/group/user/${this.id}`, groupsdata)
          .then((response) => {
            if (response.data.length) {
              response.data.forEach((f) => {
                this.groups.push(f);
              });

              this.currentPageGroup += 1;

              $state.loaded();
            } else {
              $state.complete();
            }
          })
          .catch((error) => {
            console.log(error);
            this.errorStatus = true;
            this.errorResponse = error;
          });
      }
    },
    getServices() {
      let sort =
        this.$route.query.sort == null ? "name" : this.$route.query.sort;
      let o = {
        perPage: this.perPage,
        currentPage: this.currentPageService,
        filter: this.filter,
      };
      this.$http
        .post(`/api/v1/service/user/${this.userdata.username}/${sort}`, o)
        .then((response) => {
          this.currentPageService += 1;
          response.data.forEach((f) => {
            this.services.push(f);
          });
          this.servicesLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.servicesLoading = false;
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    infoService(item, index, button) {
      this.$router.push({
        name: "Service Detail",
        params: {
          id: item.inventory_id,
        },
        query: { sort: "createddesc" },
      });
    },
    getGroups() {
      let groupsdata = {
        perPage: this.perPage,
        currentPage: this.currentPageGroup,
        sort: this.$route.query.sort == null ? "name" : this.$route.query.sort,
      };
      if (this.userdata.urole == "Admin") {
        this.$http
          .post("/api/v1/group", groupsdata)
          .then((response2) => {
            response2.data.forEach((f) => {
              this.groups.push(f);
            });
            this.currentPageGroup += 1;
            this.groupsLoading = false;
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.$http
          .post(`/api/v1/group/user/user/${this.id}`, groupsdata)
          .then((response) => {
            this.currentPageGroup += 1;
            response.data.forEach((f) => {
              this.groups.push(f);
            });
            this.groupsLoading = false;
          })
          .catch((error) => {
            console.log(error);
            this.groupsLoading = false;
            this.errorStatus = true;
            this.errorResponse = error;
          });
      }
    },
    infoGroup(item) {
      this.$router.push({
        name: "Group Detail",
        params: {
          id: item.groupid,
        },
      });
    },
    getAuthLogs() {
      this.authLoading = true;
      this.authsessions = [];

      let dataPolicy = {
      perPage: this.perPage,
      currentPage: this.currentPageAuth - 1,
      sort: "createddesc",
    };

    this.$http
      .post("/api/v1/auths/group/" + this.id, dataPolicy)
      .then((response) => {
        this.totalPages = response.data.totalPages;
        response.data.logs.forEach((f) => {
          this.authsessions.push(f);
        });
        this.authLoading = false;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.actionsLoading = false;
        this.sessionsLoading = false;
        this.errorStatusSessions = true;
        this.statisticgraph = true;
        this.userinfodiv = true;
        this.authLoading = false;
        this.errorStatusAuth = true;
        this.policiesLoading = false;
        this.errorStatusPolicies = true;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "User Profile Loading got an error";
      });
    }
  },
  created() {
    // get one year before
    let currentDate = new Date();
    this.start = new Date(
      currentDate.getFullYear() - 1,
      currentDate.getMonth(),
      currentDate.getDay()
    );
    let data = {
      perPage: this.perPage,
      currentPage: this.currentPageAction,
    };
    let pagination = {
      perPage: this.perPage,
      currentPage: this.currentPageSession,
    };
    let userids = [this.id];

    let data2 = {
      pagination: pagination,
      userids: userids,
    };

    this.getAuthLogs();
  },
};
</script>

<style>
.inventory-logo {
  width: 30px;
  height: 20px;
}

.scrollperfect {
  position: relative;
  margin: auto;
  height: auto;
}
</style>