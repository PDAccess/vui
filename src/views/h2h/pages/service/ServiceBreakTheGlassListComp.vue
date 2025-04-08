<template>
  <div>
    <b-row align-h="center">
      <b-col cols="12" lg="6" class="mb-3">
        <p-select
          :multiple="true"
          :options="users"
          label="username"
          placeholder="Select User"
          track-by="userId"
          v-model="selectedUserObjects"
        ></p-select>
      </b-col>
      <b-col cols="12" lg="6" class="mb-3" v-if="showSelectedServices">
        <p-select
          :multiple="true"
          :options="services"
          label="name"
          placeholder="Select Service"
          track-by="inventory_id"
          v-model="selectedServiceObjects"
        ></p-select>
      </b-col>
    </b-row>
    <div v-if="loading" class="loadingImage">
      <p-loading class="my-5" message="Loading..." />
    </div>
    <p-error
      v-else-if="errorStatus"
      :header="errorHeader"
      :errorResponse="errorResponse"
      @reload="$router.go()"
    />
    <div v-else-if="breaks.length === 0">
      <p-initial
        icon="exclamation-circle"
        header="You don't have any break the glass."
        message="Please start a break."
      />
    </div>
    <b-row v-else>
      <b-col>
        <b-table
          :fields="fields"
          :items="breaks"
          :responsive="responsive"
          hover
          show-empty
          small
        >
          <template v-slot:cell(username)="row">
            <b-button
              @click="userDetailPage(row.item.userEntity)"
              variant="link"
              class="profile-button"
            >
              <p-profile-avatar
                :rounded="false"
                :size="30"
                :profile-username="row.item.userEntity.username"
                :username="
                  row.item.userEntity.first_name +
                  ' ' +
                  row.item.userEntity.last_name
                "
                color="#fff"
                image-height="30px"
                image-width="auto"
              ></p-profile-avatar>
            </b-button>
          </template>
          <template v-slot:cell(reason)="row">
            <em>
              <strong>{{ row.item.reason }}</strong>
            </em>
          </template>
          <template v-slot:cell(connection_user)="row">
            {{
              row.item.connectionUserEntity
                ? row.item.connectionUserEntity.username
                : "No user"
            }}
          </template>
          <template v-slot:cell(checked_time)="row">
            <p-timing
              :start-date="row.item.createdAt"
              :end-date="row.item.checkedTime || Date.now()"
            />
          </template>
        </b-table>
        <infinite-loading
          @infinite="updateBreaktheglassTable"
          force-use-infinite-wrapper
        >
          <div slot="no-more"></div>
          <div slot="no-results"></div>
        </infinite-loading>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import InfiniteLoading from "vue-infinite-loading";

export default {
  components: {
    InfiniteLoading,
  },
  props: ["serviceid", "groupid"],
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      selectedUserObjects: [],
      selectedServiceObjects: [],
      tempSelectedUsers: [],
      tempSelectedServices: [],
      selectedUsers: [],
      selectedServices: [],
      tempArr: [],
      users: [],
      services: [],
      loading: true,
      breaks: [],
      fields: [
        { key: "username", label: "User" },
        { key: "connection_user", label: "Connection User" },
        { key: "reason", label: "Reason" },
        { key: "checked_time", label: "" },
      ],
      perPage: 15,
      currentPage: 0,
      showSelectedServices: true,
    };
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  watch: {
    selectedUserObjects: function () {
      this.tempArr = this.selectedUserObjects;
      this.searchFilter();
    },
    selectedServiceObjects: function () {
      this.searchFilter();
    },
  },
  methods: {
    getBreaktheglassList() {
      this.loading = true;
      this.currentPage = 0;
      let page = {
        currentPage: this.currentPage,
        perPage: this.perPage,
        usersFilter: this.selectedUsers,
        servicesFilter: this.selectedServices,
      };

      this.$http
        .post("/api/v1/break", page)
        .then((response) => {
          this.currentPage += 1;
          this.breaks = response.data;
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
      this.tempSelectedUsers = [];
      this.tempSelectedServices = [];
      this.tempArr.forEach((user) => {
        this.tempSelectedUsers.push(user.userId);
      });
      this.selectedServiceObjects.forEach((service) => {
        this.tempSelectedServices.push(service.inventory_id);
      });

      if (
        this.tempSelectedServices.length === 0 &&
        this.tempSelectedUsers.length === 0
      ) {
        this.clearFilter();
      } else if (
        !this.compareArray(this.tempSelectedServices, this.selectedServices) ||
        !this.compareArray(this.tempSelectedUsers, this.selectedUsers)
      ) {
        this.selectedUsers = [...this.tempSelectedUsers];
        this.selectedServices = [...this.tempSelectedServices];
        this.getBreaktheglassList();
      }
    },
    clearFilter() {
      if (
        this.selectedServices.length === 0 &&
        this.selectedUsers.length === 0
      ) {
        this.tempSelectedServices = [];
        this.tempSelectedUsers = [];
      } else {
        this.tempSelectedUsers = [];
        this.selectedUsers = [];
        this.tempSelectedServices = [];
        this.selectedServices = [];
        this.selectedUserObjects = [];
        this.selectedServiceObjects = [];
        this.getBreaktheglassList();
      }
    },
    compareArray(array1, array2) {
      if (array1.length !== array2.length) return false;
      for (let i = 0; i < array1.length; i++) {
        if (!array2.includes(array1[i])) return false;
      }
      return true;
    },
    userDetailPage(item) {
      this.$router.push({
        name: "User Detail",
        params: {
          id: item.userId,
        },
      });
    },
    updateBreaktheglassTable($state) {
      let page = {
        currentPage: this.currentPage,
        perPage: this.perPage,
        usersFilter: this.selectedUsers,
        servicesFilter: this.selectedServices,
      };

      this.$http
        .post("/api/v1/break", page)
        .then((response) => {
          if (response.data.length) {
            this.currentPage += 1;
            response.data.forEach((element) => {
              this.breaks.push(element);
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
          this.errorHeader = "Something went wrong!";
        });
    },
  },
  created() {
    if (typeof this.serviceid !== "undefined") {
      this.showSelectedServices = false;
      this.$http
        .get("/api/v1/service/id/" + this.serviceid)
        .then((response) => {
          this.selectedServiceObjects.push(response.data);
          this.searchFilter();
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    } else if (typeof this.groupid !== "undefined") {
      this.$http
        .get("/api/v1/group/service/" + this.groupid)
        .then((response) => {
          this.selectedServiceObjects = response.data;
          this.services = response.data;
          this.searchFilter();
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    } else {
      this.getBreaktheglassList();
      this.$http
        .get("/api/v1/service/all", {})
        .then((response) => {
          this.services = response.data;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    }

    this.$http
      .get("/api/v1/user", {})
      .then((response) => {
        this.users = response.data;
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
