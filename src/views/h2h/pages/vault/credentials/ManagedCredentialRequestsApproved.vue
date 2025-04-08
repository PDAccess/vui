<template>
  <div class="animated fadeIn">
    <p-card :cardBody="true">
      <p-loading v-if="loading" class="my-5" message="Loading..." />
      <p-error
        v-else-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <p-initial
        v-else-if="requests.length === 0"
        icon="exclamation-circle"
        header="You don't have any credential request."
        message="No user requests for this credential have yet been approved"
      />
      <template v-else>
        <b-table
          :fields="fields"
          :items="requests"
          thead-class="hidden_header"
          responsive
          fixed
        >
          <template v-slot:cell(request_user)="row">
            <b-button
              @click="userDetailPage(row.item.requestingUser.userId)"
              variant="link"
              class="profile-button"
            >
              <p-profile-avatar
                :profileUsername="row.item.requestingUser.username"
                :username="
                  row.item.requestingUser.first_name +
                  ' ' +
                  row.item.requestingUser.last_name
                "
                :size="30"
                :imageWidth="'30px'"
                :imageHeight="'auto'"
              />
            </b-button>
          </template>
          
          <template v-slot:cell(response_user)="row">
            <b-button
              @click="userDetailPage(row.item.respondingUser.userId)"
              variant="link"
              class="profile-button"
            >
              <p-profile-avatar
                :profileUsername="row.item.respondingUser.username"
                :username="
                  row.item.respondingUser.first_name +
                  ' ' +
                  row.item.respondingUser.last_name
                "
                :size="30"
                :imageWidth="'30px'"
                :imageHeight="'auto'"
              />
            </b-button>
          </template>
          
          <template v-slot:cell(request_time)="row">
            <span class="text-primary">
              {{ row.item.requestedAt | moment("calendar") }}
            </span>
          </template>

          <template v-slot:cell(response_time)="row">
            <span class="text-primary">
              {{ row.item.respondedAt | moment("calendar") }}
            </span>
          </template>

          <template v-slot:cell(credentials)="row">
            {{ row.item.credentials.username }}
          </template>

          <template v-slot:cell(status)="row">
              <b-badge variant="success">APPROVE</b-badge>
          </template>
          
        </b-table>
      </template>
    </p-card>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import InfiniteLoading from "vue-infinite-loading";
import Avatar from "vue-avatar";

export default {
  props: ["id"],
  name: "ManagedCredentials",
  components: {
    Avatar,
    InfiniteLoading,
  },
  data() {
    return {
      requests: [],
      sortSelect: "create-desc",
      breakCredential: {},
      loadingShare: false,
      shareData: {},
      selectedDate: null,
      shareDescription: "",
      copyKey: "",
      breakReason: "",
      selectedCredential: {},
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      services: [],
      users: [],
      fields: [
        {
          key: "request_user",
          label: "Request User",
        },
        {
          key: "response_user",
          label: "Response User",
        },
        {
          key: "request_time",
          label: "Request Time",
        },
        {
          key: "response_time",
          label: "Response Time",
        },
        {
          key: "credentials",
          label: "Credential",
        },
        {
          key: "status",
          label: "Status",
        },
      ],
      currentPage: 0,
      perPage: 15,
      breakFormItem: {
        serviceId: "",
        name: "",
        id: 0,
        vault: {
          ipAddress: "",
          key: "",
          password: "",
          port: "",
          username: "",
        },
        originId: 1,
      },
      vault: {
        popId: "",
        ipaddress: "",
        key: "",
        password: "",
        port: "",
        username: "",
      },
      checkStatus: false,
      breakStatus: true,
      breakForm: false,
      loadingBreak: false,
      loading: true,
      tempFilter: null,
      filter: null,
      searchTerm: null,
      tempUsers: [],
      code: 0,
      reason: "",
      confirm: null,
      breaked: false,
      loadingSearch: false,
      settings: {
        default_system_host_name: "",
        default_system_host_port: "",
      },
    };
  },
  watch: {
    tempFilter: function (val) {
      if (val.length >= 3 || val.length === 0) this.searchFilter();
    },
    searchTerm: function () {
      if (this.searchTerm === "") {
        this.$nextTick(() => {
          this.clearResult();
        });
      } else {
        this.$nextTick(() => {
          this.searchUser();
        });
      }
    },
  },
  computed: {
    ...mapGetters({ userToken: "auth/token" }),
    path() {
      return this.$route.path.substring(this.$route.path.lastIndexOf("/") + 1);
    },
  },
  methods: {
      getNotApprovedCredentialRequests() {
          this.loading = true;

            this.$http
            .get("/api/v1/credentials/requests/approved/" + this.id)
            .then((response) => {
            this.requests = response.data;
            this.loading = false;
            })
            .catch((error) => {
            this.errorStatus = true;
            this.errorResponse = error;
            this.errorHeader = "Something went wrong!";
            });
      },
      userDetailPage(item) {
      this.$router.push({
        name: "User Detail",
        params: {
          id: item,
        },
      });
    },
  },
  created() {
    this.loading = true;

    this.getNotApprovedCredentialRequests();
  },
};
</script>
<style scoped>
.bg-color {
  background-color: #ffffff;
}

.inventory-logo {
  width: 24px;
  height: 16px;
}

.btn2 {
  min-width: 150px;
}

.showpass {
  color: #000000;
}

.admincolor {
  color: #00a6ff;
}

.usercolor {
  color: #626262;
}

.wfont {
  font-size: 13px;
  font-weight: 600;
  color: #575757;
}

.area {
  background-color: white;
  height: 100%;
}

.search-input {
  border-radius: 5px;
}

.list-group-item {
  border-right: none;
  border-left: none;
}
</style>
