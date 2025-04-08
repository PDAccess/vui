<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="6" sm="4">
          <div class="form-group">
            <p-select
              :disabled="userRole === 'User'"
              :multiple="true"
              :options="users"
              label="username"
              placeholder="Select User"
              track-by="userId"
              v-model="selectedUserObjects"
            ></p-select>
          </div>
        </b-col>
        <b-col cols="6" sm="4">
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
        <b-col cols="6" sm="4">
          <p-date-picker
            @val="tempDateRangeData = $event"
            :select-date="tempDateRangeData"
            :isRange="true"
            :clearBtn="true"
            mode="range"
          />
        </b-col>
      </b-row>
      <p-loading v-if="loading" class="my-5" message="Loading..." />
      <p-error
        v-else-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <div v-else-if="proxySessions.length === 0">
        <p-initial
          icon="exclamation-circle"
          header="You don't have any sessions."
          message="Please start a session."
        />
      </div>
      <div v-else>
        <b-table
          :fields="fields"
          :items="proxySessions"
          :responsive="responsive"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          hover
          show-empty
          :small="responsive"
          :fixed="responsive"
        >
          <template v-slot:cell(username)="row">
            <b-button
              @click="userDetailPage(row.item)"
              v-if="row.item.userEntity != null"
              variant="link"
              class="profile-button"
            >
              <p-profile-avatar
                :profileUsername="row.item.username"
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
              v-if="row.item.sessionType === 'T'"
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
            <em v-if="row.item.sessionType === 'PDA'">
              <b-badge variant="primary">PDA</b-badge>
            </em>
            {{ row.item.serviceEntity.name }}
          </template>

          <template v-slot:cell(authSystem)="row">
            <span>{{
              row.item.userEntity.external ? "LDAP" : "PDAccess"
            }}</span>
          </template>

          <template v-slot:cell(duration)="row">
            <p-timing
              :start-date="row.item.startTime"
              :end-date="row.item.endTime || new Date()"
            />
          </template>

          <template v-slot:cell(actions)="row">
            <b-button
              @click.stop="details(row.item)"
              class="btn"
              title="Details"
              type="button"
              variant="outline-primary"
              v-b-tooltip.bottom
            >
              <em class="fa fa-info"></em>
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
    </div>
  </div>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";

export default {
  name: "app",
  components: {
    InfiniteLoading,
  },
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      hSpacing: "20px",
      themeStyles: {
        wrapper: {
          background: "",
          color: "#fafafa",
          border: "0",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.14), 0 6px 20px 0 rgba(0, 0, 0, 0.13)",
          borderRadius: "5px",
        },
        header: {
          padding: `20px ${this.hSpacing}`,
        },
        headerHorizontalDivider: {
          borderTop: "solid rgba(255, 255, 255, 0.2) 1px",
          width: "80%",
        },
        weekdays: {
          color: "#000000", // New color
          fontWeight: "100", // And bolder font weight
          padding: `20px ${this.hSpacing} 5px ${this.hSpacing}`,
          fontSize: "0.8rem",
        },
        weeks: {
          padding: `0 ${this.hSpacing} ${this.hSpacing} ${this.hSpacing}`,
        },
        dayContent: {
          fontSize: "0.8rem",
        },
      },
      userRole: "User",
      selectedUserObjects: [],
      selectedServiceObjects: [],
      tempSelectedUsers: [],
      selectedUsers: [],
      tempSelectedServices: [],
      selectedServices: [],
      services: [],
      users: [],
      loading: true,
      tempDateRangeData: null,
      dateRangeData: null,
      proxySessions: [],
      actions: [],
      fields: [
        { key: "username", label: "User" },
        { key: "name", label: "Service" },
        { key: "ipAddress", label: "IP Address" },
        { key: "authSystem", label: "Authentication System" },
        { key: "duration", label: "" },
        { key: "actions", label: "" },
      ],
      dataObject: {},
      currentPage: 0,
      perPage: 15,
      sortBy: null,
      sortDesc: false,
      filter: null,
      tempDateRange: "",
      dateRange: "",
    };
  },
  computed: {
    inputState() {
      if (!this.selectedValue) {
        return {
          type: "is-danger",
          message: "Date required.",
        };
      }
      return {
        type: "is-primary",
        message: "",
      };
    },

    responsive() {
      return screen.width < 500;
    },
  },
  watch: {
    tempDateRangeData: function (value) {
      if (value !== null) {
        let startValue = this.$moment(value.start).format("Y/MM/DD");
        let endValue = this.$moment(value.end).format("Y/MM/DD");
        this.tempDateRange = startValue + " - " + endValue;
        this.searchFilter();
      } else {
        this.clearDate();
      }
    },
    selectedUserObjects: function () {
      this.searchFilter();
    },
    selectedServiceObjects: function () {
      this.searchFilter();
    },
  },
  methods: {
    compareArray(array1, array2) {
      if (array1.length !== array2.length) return false;
      for (let i = 0; i < array1.length; i++) {
        if (!array2.includes(array1[i])) return false;
      }
      return true;
    },
    searchFilter() {
      this.tempSelectedUsers = [];
      this.tempSelectedServices = [];
      this.selectedUserObjects.forEach((user) => {
        this.tempSelectedUsers.push(user.userId);
      });
      this.selectedServiceObjects.forEach((service) => {
        this.tempSelectedServices.push(service.inventory_id);
      });

      localStorage.setItem(
        "selectedUsers",
        JSON.stringify(this.tempSelectedUsers)
      );
      localStorage.setItem(
        "selectedServices",
        JSON.stringify(this.tempSelectedServices)
      );
      localStorage.setItem(
        "dateRangeData",
        JSON.stringify(this.tempDateRangeData)
      );

      if (
        this.tempSelectedServices.length === 0 &&
        this.tempSelectedUsers.length === 0 &&
        this.tempDateRange === ""
      ) {
        this.clearFilter();
      } else if (
        !this.compareArray(this.tempSelectedServices, this.selectedServices) ||
        !this.compareArray(this.tempSelectedUsers, this.selectedUsers) ||
        this.tempDateRange !== this.dateRange
      ) {
        this.selectedUsers = [...this.tempSelectedUsers];
        this.selectedServices = [...this.tempSelectedServices];
        this.dateRangeData = this.tempDateRangeData;
        this.dateRange = this.tempDateRange;
        this.sessionFilter();
      }
    },
    clearFilter() {
      if (
        this.selectedServices.length === 0 &&
        this.selectedUsers.length === 0 &&
        this.tempDateRange === ""
      ) {
        this.tempSelectedServices = [];
        this.tempSelectedUsers = [];
        this.tempDateRangeData = null;
        this.dateRangeData = null;
      } else {
        this.tempSelectedUsers = [];
        this.selectedUsers = [];
        this.tempSelectedServices = [];
        this.selectedServices = [];
        this.selectedUserObjects = [];
        this.selectedServiceObjects = [];
        this.tempDateRangeData = null;
        this.dateRangeData = null;
        this.tempDateRange = "";
        this.dateRange = "";
        this.sessionFilter();
      }
      localStorage.setItem("selectedUsers", JSON.stringify(this.selectedUsers));
      localStorage.setItem(
        "selectedServices",
        JSON.stringify(this.selectedServices)
      );
      localStorage.setItem("dateRangeData", JSON.stringify(this.dateRangeData));
    },

    userDetailPage(item) {
      this.$router.push({
        name: "User Detail",
        params: {
          id: item.userEntity.userId,
        },
      });
    },
    clearDate() {
      this.dateRange = "";
      this.dateRangeData = null;
      this.sessionFilter();
    },
    sessionFilter() {
      this.loading = true;
      let sort = this.$route.query.sort;
      this.proxySessions = [];
      this.currentPage = 0;

      let page = {
        perPage: this.perPage,
        currentPage: this.currentPage,
        sort: sort,
      };

      this.dataObject = {
        userids: this.selectedUsers,
        serviceids: this.selectedServices,
        dateRange: this.dateRangeData,
        pagination: page,
      };

      this.$http
        .post("/api/v1/session/filter", this.dataObject)
        .then((response) => {
          this.currentPage = this.currentPage + 1;
          this.proxySessions = response.data.sessionEntities;
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
    infiniteHandler($state) {
      let sort = this.$route.query.sort;

      let page = {
        perPage: this.perPage,
        currentPage: this.currentPage,
        sort: sort,
      };

      this.dataObject = {
        userids: this.selectedUsers,
        serviceids: this.selectedServices,
        dateRange: this.dateRangeData,
        pagination: page,
      };

      this.$http
        .post("/api/v1/session/filter", this.dataObject)
        .then((response) => {
          if (response.data.sessionEntities.length) {
            this.currentPage = this.currentPage + 1;
            response.data.sessionEntities.forEach((f) => {
              this.proxySessions.push(f);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    details(item) {
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
        .catch((error) => {
          console.log(error);
        });
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
        case 8:
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
        case 8:
          return "secondary";
        default:
          return "";
      }
    },
    addTag(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.value.push(tag);
    },
  },
  created() {
    this.tempSelectedUsers = JSON.parse(localStorage.getItem("selectedUsers"));
    this.tempSelectedServices = JSON.parse(
      localStorage.getItem("selectedServices")
    );
    this.tempDateRangeData = JSON.parse(localStorage.getItem("dateRangeData"));

    if (this.tempSelectedServices == null) this.tempSelectedServices = [];
    if (this.tempSelectedUsers == null) this.tempSelectedUsers = [];
    if (this.tempDateRangeData == null) this.tempDateRangeData = {};

    this.selectedUsers = [...this.tempSelectedUsers];
    this.tempSelectedServices = [...this.tempSelectedServices];
    this.dateRangeData = this.tempDateRangeData;
    this.dateRange = this.tempDateRange;

    this.$http
      .get("/api/v1/user/who")
      .then((response) => {
        this.userRole = response.data.role;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    this.sessionFilter();

    this.$http
      .get("/api/v1/service/sort/name")
      .then((response) => {
        this.services = response.data;
        this.tempSelectedServices.forEach((inventory_id) => {
          this.services.forEach((service) => {
            if (service.inventory_id === inventory_id) {
              this.selectedServiceObjects.push(service);
            }
          });
        });
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    this.$http
      .get("/api/v1/user")
      .then((response) => {
        this.users = response.data;
        this.tempSelectedUsers.forEach((userId) => {
          this.users.forEach((user) => {
            if (user.userId === userId) {
              this.selectedUserObjects.push(user);
            }
          });
        });
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
  },
};
</script>
