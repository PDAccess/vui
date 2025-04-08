<template>
  <div class="animated fadeIn">
    <p-card :cardBody="true">
      <p-loading v-if="loading" class="my-5" message="Loading..." />
      <p-error v-else-if="errorStatus" :header="errorHeader" :errorResponse="errorResponse" @reload="$router.go()" />
      <p-initial v-else-if="requests.length === 0" icon="exclamation-circle"
        header="You don't have any waiting credential request." message="No users have yet requested this credential" />
      <template v-else>
        <b-table :fields="fields" :items="requests" thead-class="hidden_header" responsive fixed>
          <template v-slot:cell(request_user)="row">
            <b-button @click="userDetailPage(row.item.requestingUser.userId)" variant="link" class="profile-button">
              <p-profile-avatar :profileUsername="row.item.requestingUser.username" :username="row.item.requestingUser.first_name +
      ' ' +
      row.item.requestingUser.last_name
      " :size="30" :imageWidth="'30px'" :imageHeight="'auto'" />
            </b-button>
          </template>

          <template v-slot:cell(request_time)="row">
            <span class="text-primary">
              {{ row.item.requestedAt | moment("calendar") }}
            </span>
          </template>

          <template v-slot:cell(credentials)="row">
            {{ row.item.credentials.username }}
          </template>

          <template v-slot:cell(actions)="row">
            <div class="d-flex justify-content-end">
              <b-button @click="approvalRequest(row.item, false)" variant="danger" class="mr-2"><em
                  class="fa fa-times mr-1"></em>Reject</b-button>
              <b-button @click="approvalRequest(row.item, true)" variant="success"><em
                  class="fa fa-check mr-1"></em>Approve</b-button>
            </div>
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
          key: "request_time",
          label: "Request Time",
        },
        {
          key: "credentials",
          label: "Credential",
        },
        {
          key: "actions",
          label: "",
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
    approvalRequest(credentialRequest, isApproved) {
      let data = {
        is_approved: isApproved,
        credential_id: credentialRequest.credentials.id
      }
      this.$http.post("/api/v1/credentials/response/" + credentialRequest.id, data)
        .then(response => {
          this.$bvToast.toast(
            isApproved ? `You have approved the Credential request` : `You have rejected the Credential request`,
            {
              title: "Credential Request",
              variant: "success",
              autoHideDelay: 5000,
            }
          );
          this.requests.splice(this.requests.indexOf(credentialRequest), 1);
        }).catch(error => {
          console.log(error);
          this.$bvToast.toast(`Please try again later`, {
            title: "An unexpected error has occurred",
            variant: "danger",
            autoHideDelay: 5000,
          });
          console.log(error);
        })
    },
    userDetailPage(item) {
      this.$router.push({
        name: "User Detail",
        params: {
          id: item,
        },
      });
    },
    requestCredential(credentialId) {
      this.$http
        .post("/api/v1/credentials/request/" + credentialId)
        .then((response) => {
          this.$bvToast.toast(
            `Please check your e-mail address for the approval of your request.`,
            {
              title: "Your Credential request has been successfully received",
              variant: "success",
              autoHideDelay: 5000,
            }
          );
        })
        .catch((error) => {
          this.$bvToast.toast(`Please try again later`, {
            title: "An unexpected error has occurred",
            variant: "danger",
            autoHideDelay: 5000,
          });
          console.log(error);
        });
    },
    searchFilter() {
      if (this.tempFilter == null) {
        this.clearFilter();
      } else if (
        this.filter == null ||
        this.tempFilter.toLowerCase() !== this.filter.toLowerCase()
      ) {
        this.filter = this.tempFilter.toLowerCase();
        this.getCredentials();
      }
    },
    clearFilter() {
      if (this.filter == null) {
        this.tempFilter = null;
      } else {
        this.tempFilter = null;
        this.filter = null;
        this.getCredentials();
      }
    },
    updateTable($state) {
      let sort =
        this.$route.query.sort == null ? "name" : this.$route.query.sort;
      let filter =
        this.$route.query.filter == null ? "" : this.$route.query.filter;

      let o = {
        perPage: this.perPage,
        currentPage: this.currentPage,
        filter: filter,
        category: this.path,
      };
      this.$http
        .post("/api/v1/credentials/vault/list/" + sort, o)
        .then((response) => {
          if (response.data.length) {
            this.currentPage += 1;
            response.data.forEach((element) => {
              this.users.push(element);
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
    checkoutCredential(item) {
      this.$http
        .post("/api/v1/credentials/checkout/" + item.credentialId)
        .then((response) => {
          item.check = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    credentialDetails(credentialId) {
      this.$router.push({
        path: "/vault/credentials/detail/" + credentialId,
      });
    },
    shareLink() {
      this.$bvModal.hide("service-share-modal");
      this.loadingShare = true;
      let data = {
        credential_id: this.selectedCredential.credentialId,
        description: this.shareDescription,
        expired_at: this.selectedDate,
      };
      this.$http
        .post("/api/v1/share", data)
        .then((response) => {
          this.shareData = response.data;
          this.shareData.share_link = `https://${this.settings.default_system_host_name}/${this.shareData.share_link}`;
          this.loadingShare = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    copyValue(value, message) {
      this.copyKey = value;
      this.message = message;
    },
    selectCredential(credential) {
      this.selectedCredential = credential;
      this.breakReason = "";
    },
    breakedCredential(credentialId, popId) {
      this.loadingBreak = true;
      this.$root.$emit("bv::hide::popover", popId);
      let data = {
        credential_id: credentialId,
        reason: this.reason,
      };
      this.$http
        .post("/api/v1/credentials/break", data)
        .then((response) => {
          this.breakCredential = response.data;
          this.vault = response.data;
          this.vault.popId = popId;
          let vm = this;
          setTimeout(function () {
            vm.reason = "";
            vm.loadingBreak = false;
            vm.$root.$emit("bv::show::popover", popId);
          }, 500);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    ...mapActions({
      setSelectedCredentials: "util/setSelectedCredentials",
    }),
    onCopy(message) {
      this.$bvToast.toast("Successfully Copied", {
        title: "Success Copy",
        variant: "info",
        autoHideDelay: 5000,
      });
    },
    goToConnectionPage(serviceId, serviceTypeLogo, credentialId) {
      window.open(
        `https://${this.settings.default_system_host_name}/term/console/?token=${this.userToken}&serviceId=${serviceId}&type=${serviceTypeLogo}&credentialId=${credentialId}`,
        "_blank",
        `location=yes,height=${window.innerHeight},width=${window.innerWidth},scrollbars=yes,status=yes`
      );
    },
    getClassLock(popId) {
      if (this.loadingBreak && popId === this.vault.popId) {
        return "fa fa-lock fa-spin mr-2";
      } else if (!this.loadingBreak && popId === this.vault.popId) {
        return "fa fa-unlock mr-2";
      }
      return "fa fa-lock mr-2";
    },
    clearResult() {
      if (this.tempUsers.length !== 0) {
        this.users = this.tempUsers;
      }
      this.tempUsers = [];
      this.loadingSearch = false;
    },
    getStringFromDate(date) {
      return `Created at ${this.$moment(date).fromNow()}`;
    },
    breaktheglass(serviceId, popId) {
      this.loadingBreak = true;
      this.$root.$emit("bv::hide::popover", popId);
      this.$http
        .post("/api/breaktheglass/" + serviceId, this.reason)
        .then((response) => {
          this.vault = response.data;
          this.vault.popId = popId;
          let vm = this;
          setTimeout(function () {
            vm.reason = "";
            vm.loadingBreak = false;
            vm.$root.$emit("bv::show::popover", popId);
          }, 500);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    checkOutBreak(item) {
      this.$http
        .post("/api/breaktheglass/checkout/" + item.service.inventory_id)
        .then(() => {
          item.checkStatus = false;
          item.breakStatus = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    searchUser() {
      this.loadingSearch = true;
      if (this.tempUsers.length === 0) {
        this.tempUsers = this.users;
      }
      this.users = [];
      for (let i in this.tempUsers) {
        if (
          this.tempUsers[i].username
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase())
        ) {
          this.users.push(this.tempUsers[i]);
        }
      }
      this.loadingSearch = false;
    },
    serviceNameAvatar(name) {
      let avatar = "";
      let text = name.split(/_/);
      text.forEach((f) => {
        avatar += f + " ";
      });
      return avatar;
    },
    infoService(service) {
      this.$router.push({
        name: "Service Detail",
        params: {
          id: service.id,
        },
        query: { sort: "createddesc" },
      });
    },
    infoGroup(group) {
      this.$router.push({
        name: "Group Detail",
        params: {
          id: group.id,
        },
      });
    },
    userDetails(item) {
      this.setSelectedCredentials(item);
      this.$router.push({
        path: "credential",
      });
    },
    getCredentialRequests() {
      this.loading = true;

      this.$http
        .get("/api/v1/credentials/requests/wait/" + this.id)
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
  },
  created() {
    this.loading = true;

    this.getCredentialRequests();
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
