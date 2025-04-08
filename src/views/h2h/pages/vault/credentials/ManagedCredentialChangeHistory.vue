<template>
  <div class="animated fadeIn">
    <p-card>
      <p-loading class="my-5" v-if="isLoading" message="Loading..." />
      <p-error v-else-if="errorState" message="No user found!"></p-error>
      <p-initial
        v-else-if="logs.length === 0"
        icon="exclamation-circle"
        header="You don't have any credential history."
        message="Please start using a credential."
      />
      <div v-else>
        <b-table :fields="fields" :items="logs">
          <template v-slot:cell(startAt)="row">
            <span class="text-info">{{
              row.item.startAt | moment("calendar")
            }}</span>
          </template>
          <template v-slot:cell(endAt)="row">
            <span class="text-info">{{
              row.item.endAt | moment("calendar")
            }}</span>
          </template>
          <template v-slot:cell(result)="row">
            <span v-if="row.item.result" class="text-success">Success</span>
            <span v-else class="text-danger">Fail</span>
          </template>
        </b-table>
        <infinite-loading @infinite="updateTable" force-use-infinite-wrapper>
          <div slot="no-more"></div>
          <div slot="no-results"></div>
        </infinite-loading>
      </div>
    </p-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import TimingComp from "@/views/h2h/components/TimingComp";
import InfiniteLoading from "vue-infinite-loading";

export default {
  props: ["id"],
  name: "ManagedCredentialsDetails",
  computed: {
    ...mapGetters({
      user: "util/selectedCredentials",
    }),
    responsive() {
      return screen.width < 500;
    },
  },
  components: {
    InfiniteLoading,
    TimingComp,
  },
  data() {
    return {
      fields: [
        { key: "description", label: "Description" },
        { key: "startAt", label: "Start At" },
        { key: "endAt", label: "End At" },
        { key: "result", label: "Result" },
      ],
      logs: [],
      settings: {
        default_system_host_name: "",
        default_system_host_port: "",
      },
      loadingShare: false,
      shareData: {},
      selectedCredential: {},
      shareDescription: "",
      selectedDate: null,
      isLoading: true,
      credentialDetail: {},
      owner: null,
      currentPage: 0,
      perPage: 15,
      loading: true,
      proxySessions: [],
      errorState: false,
      breaks: [],
      listUser: [],
      locked: false,
      credentialHistory: [],
      lastUsage: {
        breakId: "",
        userId: "",
        userEntity: {
          createdAt: "",
          updatedAt: "",
          deletedAt: null,
          userId: "",
          email: "",
          phone: "",
          tenantId: "",
          tenantEntity: null,
          username: "",
          urole: "",
          external: null,
          blocked: null,
          status: "",
          twofactorauth: false,
          notification: null,
          ldapDn: null,
          first_name: "",
          last_name: "",
          remember_token: null,
        },
        reason: "",
        serviceid: "",
        servicename: "",
        createdAt: 0,
        connectionUserEntity: null,
        checked: true,
        checkedTime: 0,
      },
      lastMaintain: {
        description: "",
        endAt: 0,
        id: "",
        inventoryId: "",
        result: true,
        startAt: 0,
      },
      permissions: [
        { label: "Connection, ", enable: true },
        { label: "See password, ", enable: true },
        { label: "Change password ", enable: true },
        { label: "Can authorize other users", enable: false },
        { label: "Can join sessions", enable: false },
        { label: "Can connection with request permission", enable: false },
        { label: "Can manage other users", enable: false },
      ],
    };
  },
  methods: {
    updateTable($state) {
      let data = {
        perPage: this.perPage,
        currentPage: this.currentPage,
      };
      this.$http
        .post("/api/v1/credentials/change-history/" + this.id, data)
        .then((response) => {
          if (response.data.length) {
            this.currentPage += 1;
            response.data.forEach((log) => {
              this.logs.push(log);
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
    onCopy() {
      this.$bvToast.toast(`Agent successfully copied`, {
        title: "Success Copy",
        variant: "info",
        autoHideDelay: 5000,
      });
    },
    ...mapActions({
      setSelectedCredentials: "util/setSelectedCredentials",
      setSelectedUserPermission: "util/setSelectedUserPermission",
    }),
    selectLink(share) {
      this.shareData = share;
      this.shareData.share_link = `https://${this.settings.default_system_host_name}/${this.shareData.share_link}`;
    },
    revokeLink(share) {
      this.$http
        .delete("/api/v1/share/" + share.id)
        .then((response) => {
          this.credentialDetail.shareList.splice(
            this.credentialDetail.shareList.indexOf(share),
            1
          );
        })
        .catch((error) => {});
    },
    shareLink() {
      this.$bvModal.hide("service-share-modal");
      this.loadingShare = true;
      let data = {
        credential_id: this.credentialDetail.credential.id,
        description: this.shareDescription,
        expired_at: this.selectedDate,
        allow_ip: this.allowIpAddress,
      };
      this.$http
        .post("/api/v1/share", data)
        .then((response) => {
          this.shareData = response.data;
          this.shareData.share_link = `https://${this.settings.default_system_host_name}/${this.shareData.share_link}`;
          this.loadingShare = false;
          this.getCredentialDetail();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getBreakTime(date) {
      return date !== null ? this.$moment(date).format("lll") : "Not Checked";
    },
    getRunningTime(item) {
      let startTime = this.$moment(item.startTime);
      let endTime = this.$moment(item.endTime);
      let hour = endTime.day() - startTime.day();
      let minutes = endTime.hour() - startTime.hour();
      let second = endTime.second() - startTime.second();
      return `${hour * 24}:${minutes}:${second}`;
    },
    getStatusVariant(data) {
      return data ? "outline-success" : "outline-danger";
    },
    getStatusIcon(data) {
      return data ? "check-circle" : "x-circle";
    },
    toUserDetail(param) {
      this.setSelectedUserPermission({
        ...param,
        service: this.user.service,
        permissions: this.permissions,
      });
      this.$router.push({ path: "createcredential" });
    },
    getPermission() {
      let str = "";
      for (let i in this.permissions) {
        if (this.permissions[i].enable) {
          str += this.permissions[i].label;
        }
      }
      return str;
    },
    userDetailPage(user) {
      this.$router.push({
        name: "User Detail",
        params: {
          id: user.id,
        },
      });
    },
    getFromDate(date) {
      return this.$moment(date).fromNow();
    },
    infoService(serviceId) {
      this.$router.push({
        name: "Service Detail",
        params: {
          id: serviceId,
        },
        query: { sort: "created" },
      });
    },
    getMaintains() {
      if (this.credentialHistory.length === 0) {
        this.loading = true;
        let serviceIds = this.user.service.inventory_id;
        this.$http
          .get("/api/v1/auto/credential/history/" + serviceIds)
          .then((response) => {
            this.credentialHistory = response.data;
            this.loading = false;
            this.lastMaintain = this.credentialHistory.pop();
          })
          .catch((error) => console.log(error));
      }
    },
    getBreakTheGlassList() {
      this.loading = true;
      this.currentPage = 0;
      let page = {
        currentPage: this.currentPage,
        perPage: this.perPage,
        servicesFilter: [this.user.service.inventory_id],
      };

      this.$http
        .post("/api/breaktheglass", page)
        .then((response) => {
          this.currentPage += 1;
          this.breaks = response.data;
          this.lastUsage = this.breaks.pop();
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    sessionFilter() {
      this.loading = true;
      let sort = "createddesc";
      this.proxySessions = [];
      this.currentPage = 0;
      let page = {
        perPage: this.perPage,
        currentPage: this.currentPage,
        sort: sort,
      };

      this.dataObject = {
        userids: [],
        serviceids: [this.user.service.inventory_id],
        dateRange: null,
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
        });
    },
    getDuration(start, end) {
      return `${this.$moment(start).format("lll")} - ${this.$moment(end).format(
        "lll"
      )}`;
    },
    getCredentialDetail() {
      this.isLoading = true;
      this.$http
        .get("/api/v1/credentials/" + this.id)
        .then((response) => {
          this.credentialDetail = response.data;
          this.isLoading = false;
        })
        .catch((error) => {
          this.errorState = true;
        });
    },
  },
  destroyed() {
    //this.setSelectedCredentials(null);
  },
  created() {
    let data = {
      perPage: this.perPage,
      currentPage: this.currentPage,
    };
    this.$http
      .post("/api/v1/credentials/change-history/" + this.id, data)
      .then((response) => {
        this.currentPage += 1;
        this.logs = response.data;
        this.isLoading = false;
      })
      .catch((error) => {
        this.isLoading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
  },
};
</script>

<style scoped>
.white {
  background-color: #ffffff !important;
}

.inventory-logo {
  width: 24px;
  height: 16px;
}

.error {
  color: #ff4b4b;
}

.success {
  color: #4caf50;
}

.borderless {
  border-top: none;
  border-right: none;
  border-left: none;
}
</style>
