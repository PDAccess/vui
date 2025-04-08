<template>
  <div class="animated fadeIn">
    <p-card>
      <p-error
        v-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <ul v-else class="list-group list-group-flush">
        <li class="list-group-item">
          <p>
            This is a list of devices that have logged into your account. Revoke
            any sessions that you do not recognize.
          </p>
        </li>
        <li class="list-group-item">
          <b-row align-h="center">
            <b-col cols="12" sm="12" v-show="showSelectedServices">
              <div class="form-group">
                <p-select
                  :multiple="true"
                  :options="services"
                  label="name"
                  placeholder="Select Service"
                  track-by="inventory_id"
                  v-model="selectedServiceObjects"
                ></p-select>
              </div>
            </b-col>
          </b-row>
          <p-loading v-if="loading" class="my-5" message="Loading..." />
          <div v-else-if="proxySessions.length === 0">
            <p-initial
              icon="plus-circle"
              header="You don't have any active sessions."
              message="Please start a session."
            />
          </div>
          <div v-else>
            <b-table
              :fields="fields"
              :filter="filter"
              :items="proxySessions"
              :responsive="responsive"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              @row-clicked="details"
              hover
              show-empty
              :small="responsive"
            >
              <template v-slot:cell(username)="row">
                <b-button
                  @click="userDetailPage(row.item)"
                  v-if="row.item.userEntity != null"
                  variant="link"
                  class="profile-button"
                >
                  <p-profile-avatar
                    :profileUsername="row.item.userEntity.username"
                    :username="
                      row.item.userEntity.first_name +
                      ' ' +
                      row.item.userEntity.last_name
                    "
                    :size="30"
                    :imageWidth="'30px'"
                    :imageHeight="'auto'"
                  />
                </b-button>
              </template>

              <template v-slot:cell(name)="row">
                <b-badge
                  class="ml-1"
                  v-if="row.item.sessionType == 'T'"
                  pill
                  :variant="
                    getServiceBadgeColor(row.item.serviceEntity.service_type_id)
                  "
                >
                  {{
                    getServiceTypeNameByTypeId(
                      row.item.serviceEntity.service_type_id
                    )
                  }}
                </b-badge>
                <em v-if="row.item.sessionType == 'PDA'">
                  <b-badge variant="primary">PDA</b-badge>
                </em>
                {{ row.item.serviceEntity.name }}
              </template>

              <template v-slot:cell(authSystem)="row">
                <span>{{
                  row.item.userEntity.external ? "LDAP" : "PDAccess"
                }}</span>
              </template>

              <template v-slot:cell(start_time)="row">
                <span class="text-info">{{
                  row.item.start_time | moment("calendar")
                }}</span>
              </template>

              <template v-slot:cell(duration)="row">
                <span
                  :title="getDate(row.item.startTime)"
                  class="text-info"
                  v-b-tooltip.right
                  >{{ getDate(row.item.startTime) }}</span
                >
              </template>

              <template v-slot:cell(dropSession)="row">
                <b-button
                  @click.stop="dropSession(row.item)"
                  class="btn"
                  title="Drop"
                  type="button"
                  variant="outline-primary"
                  v-b-tooltip.bottom
                >
                  <em class="fa fa-ban"></em>
                </b-button>
              </template>
            </b-table>
            <infinite-loading
              @infinite="infiniteHandler"
              force-use-infinite-wrapper
            >
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </div>
        </li>
      </ul>
    </p-card>
  </div>
</template>
<script>
import InfiniteLoading from "vue-infinite-loading";
import ServiceDetailPage from "@/views/h2h/pages/service/ServiceDetailPage";

export default {
  props: ["id"],
  components: {
    InfiniteLoading,
    ServiceDetailPage,
  },
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      selectedServiceObjects: [],
      tempFilter: null,
      selectedUsers: [],
      tempSelectedServices: [],
      selectedServices: [],
      services: [],
      loading: true,
      dataObject: {},
      proxySessions: [],
      actions: [],
      fields: [
        { key: "username", label: "User" },
        { key: "name", label: "Service" },
        { key: "ipAddress", label: "Ip Address" },
        { key: "authSystem", label: "Authentication System" },
        { key: "startTime", sortable: true, label: "Start Time" },
        { key: "duration", label: "Duration", sortable: true },
        { key: "dropSession", label: "Drop Session" },
      ],
      currentPage: 0,
      perPage: 15,
      sortBy: null,
      sortDesc: false,
      filter: null,
      showSelectedServices: true,
      conn: null,
      tmpSession: null,
      username: "",
    };
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  watch: {
    selectedServiceObjects: function () {
      this.searchFilter();
    },
  },
  methods: {
    getDate(date) {
      return this.$moment(date).fromNow();
    },
    compareArray(array1, array2) {
      if (array1.length !== array2.length) return false;
      for (let i = 0; i < array1.length; i++) {
        if (!array2.includes(array1[i])) return false;
      }
      return true;
    },
    getSessions() {
      this.loading = true;
      this.currentPage = 0;
      let sort = this.$route.query.sort;
      let page = {
        currentPage: this.currentPage,
        perPage: this.perPage,
        sort: sort,
        usersFilter: this.selectedUsers,
        servicesFilter: this.selectedServices,
      };
      this.$http
        .post("/api/v1/session/live", page)
        .then((response) => {
          this.proxySessions = response.data;
          this.currentPage = this.currentPage + 1;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    searchFilter() {
      this.tempSelectedServices = [];
      this.selectedServiceObjects.forEach((service) => {
        this.tempSelectedServices.push(service.name);
      });

      if (this.tempSelectedServices.length == 0) {
        this.clearFilter();
      } else if (
        !this.compareArray(this.tempSelectedServices, this.selectedServices)
      ) {
        this.selectedServices = [...this.tempSelectedServices];
        this.getSessions();
      }
    },
    clearFilter() {
      if (this.selectedServices.length == 0) {
        this.tempSelectedServices = [];
        this.selectedServiceObjects = [];
      } else {
        this.tempSelectedServices = [];
        this.selectedServices = [];
        this.selectedServiceObjects = [];
        this.getSessions();
      }
    },
    getServiceTypeNameByTypeId(id) {
      switch (id) {
        case 1:
          return "mysql";
        case 2:
          return "postgresql";
        case 3:
          return "msserver";
        case 4:
          return "oracle";
        case 5:
          return "ssh";
        case 6:
          return "telnet";
        case 7:
          return "rdp";
        case 6:
          return "vnc";
        default:
          return "";
      }
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
          return "primary";
        default:
          return "";
      }
    },
    userDetailPage(item) {
      this.$router.push({
        name: "User Detail",
        params: {
          id: item.userEntity.userId,
        },
      });
    },
    infiniteHandler($state) {
      let sort = this.$route.query.sort;
      let page = {
        perPage: this.perPage,
        currentPage: this.currentPage,
        sort: sort,
        usersFilter: this.selectedUsers,
        servicesFilter: this.selectedServices,
      };

      this.$http
        .post("/api/v1/session/live", page)
        .then((response) => {
          if (response.data.length) {
            this.currentPage = this.currentPage + 1;
            response.data.forEach((f) => {
              this.proxySessions.push(f);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch(function (error) {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    sessionFilter() {
      let sort = this.$route.query.sort;
      let page = {
        perPage: this.perPage,
        currentPage: this.currentPage,
        sort: sort,
      };

      this.dataObject = {
        userEntities: this.selectedUsers,
        pagination: page,
      };

      let url = "";
      if (this.selectedUsers.length == 0) {
        url = "/api/v1/session/live";
        this.dataObject = page;
      } else {
        url = "/api/v1/session/live/user";
        this.dataObject = {
          userEntities: this.selectedUsers,
          pagination: page,
        };
      }

      this.$http
        .post(url, this.dataObject)
        .then((response) => {
          this.proxySessions = [];
          response.data.forEach((f) => {
            this.proxySessions.push(f);
          });
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    addTag(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.value.push(tag);
    },
    dropSession(item) {
      let sessionType = "";
      if (item.sessionType == "T") sessionType = "terminalSessionDown";
      else if (item.sessionType == "D") sessionType = "databaseSessionDown";
      this.$http
        .post(`/api/${sessionType}/` + item.sessionId)
        .then((response) => {})
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    details(item) {
      console.log("hii");
      this.$http
        .get("/api/v1/session/actions/" + item.sessionId)
        .then((response) => {
          this.actions = response.data;
          this.$router.push({
            name: "Session Detail",
            params: {
              id: item.sessionId,
            },
          });
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
    let vm = this;
    this.conn = {};
    this.conn.onopen = function (event) {
      console.log("Successful connect");
    };
    this.conn.onmessage = function (event) {
      vm.tmpSession = JSON.parse(event.data);
      if (vm.tmpSession.endTime == null) {
        vm.proxySessions.unshift(vm.tmpSession);
      } else {
        let index = array.indexOf(tmpSession);
        vm.proxySessions.splice(index, 1);
      }
    };
    this.$http
      .get("/api/v1/user/who")
      .then((response) => {
        this.selectedUsers.push(response.data.username);
        this.$http
          .get("/api/v1/service/all")
          .then((response2) => {
            this.services = response2.data;
          })
          .catch((error) => {
            console.log(error);
            this.errorStatus = true;
            this.errorResponse = error;
            this.errorHeader = "Something went wrong!";
          });
        this.getSessions();
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>
