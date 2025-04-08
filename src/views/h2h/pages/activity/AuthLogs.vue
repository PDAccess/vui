<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <div class="input-group mb-3">
        <b-form-input
          class="form-control search-input"
          size="lg"
          placeholder="Entry User info"
          type="text"
          v-model="tempFilter"
          @keydown.enter="searchFilter"
        ></b-form-input>
      </div>
      <p-loading class="my-5" message="Loading..." v-if="loading" />
      <p-error
        v-else-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <div v-else-if="sessions.length === 0">
        <p-initial
          icon="exclamation-circle"
          header="You don't have any authentications log in your services"
          message="Please start a session."
        />
      </div>
      <div v-else>
        <b-table
          :fields="sessionsfields"
          :filter="filter"
          :items="sessions"
          :responsive="responsive"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :small="responsive"
        >
          <template v-slot:cell(username)="row">
            <div class="d-flex align-items-center">
              <div>
                <b-button
                  @click="userDetailPage(row.item)"
                  v-if="row.item.username != null"
                  variant="link"
                >
                  <p-profile-avatar
                    :profileUsername="row.item.username"
                    :username="row.item.username"
                    :size="30"
                    :imageWidth="'30px'"
                    :imageHeight="'auto'"
                  />
                </b-button>
              </div>
            </div>
          </template>

          <template v-slot:cell(success)="row">
            <b-badge v-if="row.item.success" variant="primary">
              Success
            </b-badge>
            <b-badge v-else variant="danger"> Failed </b-badge>
          </template>

          <template v-slot:cell(created_at)="row">
            <p-timing :start-date="row.item.attemptedAt" />
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
      loading: false,
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      sessions: [],
      sessionsfields: [
        { key: "username", label: "User" },
        { key: "ipAddress", sortable: true, label: "Ip" },
        { key: "userAgent", sortable: true, label: "User Agent" },
        { key: "success", label: "" },
        { key: "loginType", label: "" },
        { key: "created_at", label: "" },
      ],
      currentPage: 0,
      perPage: 15,
      // totalRows: this.proxyLogs.length,
      pageOptions: [
        {
          text: 10,
          value: 10,
        },
        {
          text: 15,
          value: 15,
        },
        {
          text: 25,
          value: 25,
        },
        {
          text: 50,
          value: 50,
        },
        {
          text: 100,
          value: 100,
        },
      ],
      sortBy: null,
      sortDesc: false,
      filter: null,
      tempFilter: null,
    };
  },
  watch: {
    tempFilter: function (val) {
      if (val.length >= 3 || val.length == 0) this.searchFilter();
    },
  },
  computed: {
    // onFiltered(filteredItems) {
    //   // Trigger pagination to update the number of buttons/pages due to filtering
    //   this.totalRows = filteredItems.length;
    //   this.currentPage = 1;
    // },
    responsive() {
      return screen.width < 500;
    },
  },
  methods: {
    searchFilter() {
      if (this.tempFilter == null) {
        this.clearFilter();
      } else if (
        this.filter == null ||
        this.tempFilter.toLowerCase() != this.filter.toLowerCase()
      ) {
        this.filter = this.tempFilter.toLowerCase();
        this.getOnlineUsers();
      }
    },
    clearFilter() {
      if (this.filter == null) {
        this.tempFilter = null;
      } else {
        this.tempFilter = null;
        this.filter = null;
        this.getOnlineUsers();
      }
    },
    getOnlineUsers() {
      this.loading = true;
      this.currentPage = 0;
      let sort = this.$route.query.sort;
      let page = {
        currentPage: this.currentPage,
        perPage: this.perPage,
        sort: sort,
        filter: this.filter,
      };
      this.$http
        .post("/api/v1/auths/live", page)
        .then((response) => {
          this.currentPage = this.currentPage + 1;
          this.sessions = response.data.content;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
          if (error.status == 500) {
            this.$bvToast.toast(`Sessions can't get!`, {
              title: "Session Notification",
              variant: "warning",
              autoHideDelay: 5000,
            });
          }
        });
    },
    infiniteHandler($state) {
      let sort = this.$route.query.sort;
      let page = {
        perPage: this.perPage,
        currentPage: this.currentPage,
        sort: sort,
        filter: this.filter,
      };

      this.$http
        .post("/api/v1/auths/live", page)
        .then((response) => {
          if (response.data.length) {
            this.currentPage = this.currentPage + 1;
            response.data.content.forEach((f) => {
              this.sessions.push(f);
            });
            $state.complete();
          } else {
            $state.complete();
          }
        })
        .catch(function (error) {
          console.log(error);
          if (error.status == 500) {
            this.loading = false;
            this.errorStatus = true;
            this.errorResponse = error;
            this.errorHeader = "Something went wrong!";
          }
        });
    },
    userDetailPage(item) {
      this.$router.push({
        name: "User Detail",
        params: {
          id: item.userEntity.userId,
        },
      });
    },
  },
  created() {
    this.getOnlineUsers();
  },
};
</script>
