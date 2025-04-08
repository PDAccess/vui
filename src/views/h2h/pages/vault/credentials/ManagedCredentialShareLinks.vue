<template>
  <div>
    <b-modal
      id="service-share-modal"
      centered
      hide-footer
      title="Credential Share"
    >
      <div class="form-group">
        <label center>Expire Date/Time</label>
        <p-date-picker
          id="groupExpireTime"
          @val="selectedDate = $event"
          :select-date="selectedDate"
          mode="dateTime"
          :clearBtn="true"
          :isRange="false"
          placeHolder="Select expire date/time"
        />
      </div>
      <div class="form-group">
        <label center>Description</label>
        <b-form-textarea
          id="groupUserSelect"
          v-model="shareDescription"
          placeholder="Add a description"
          rows="4"
          max-rows="6"
        />
      </div>
      <div class="form-group">
        <label center>IP address to be allowed</label>
        <b-form-input
          id="groupUserSelect"
          v-model="allowIpAddress"
          placeholder="Add a ip address"
        />
      </div>
      <div class="d-flex justify-content-end mt-4">
        <b-button
          variant="secondary"
          @click="$bvModal.hide('service-share-modal')"
          class="mr-2"
        >
          Cancel
        </b-button>
        <b-button
          variant="success"
          @click="shareLink"
          v-b-modal.modal-show-share
        >
          Share
        </b-button>
      </div>
    </b-modal>
    <b-modal
      id="modal-show-share"
      hide-footer
      centered
      title="Shared Credential"
      size="xl"
      header-bg-variant="success"
      header-text-variant="light"
    >
      <p-loading v-if="loadingShare" class="my-5" message="Loading..." />
      <div v-else>
        <p>
          <strong>Share Link:</strong>
          <b-input-group class="inputgroup mt-2">
            <b-form-input
              class="inputform"
              :readonly="true"
              :value="shareData.share_link"
            ></b-form-input>
            <!-- <b-button
                    v-clipboard:copy="shareData.share_link"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError"
                    class="btn btn-light"
                    v-b-tooltip.hover.bottom="'Copy Share Link'"
                  >
                    <em class="fa fa-copy"></em>
                  </b-button> -->
            <p-copy :copy-item="shareData.share_link" />
          </b-input-group>
        </p>
      </div>
    </b-modal>
    <p-loading class="my-5" v-if="isLoading" message="Loading..." />
    <p-error v-else-if="errorState" message="No user found!"></p-error>
    <p-initial
      v-else-if="credentialDetail.credential.checkStatus"
      icon="exclamation-circle"
      header="Share link cannot be used when check status is active."
      message="Please disable check status"
    />
    <p-initial
      v-else-if="credentialDetail.shareList.length === 0"
      icon="exclamation-circle"
      header="You don't have any credential share link."
      message="Please create a share link."
    />
    <div v-else>
      <ul class="list-group list-group-flush">
        <li
          class="list-group-item"
          :key="index"
          v-for="(share, index) in credentialDetail.shareList"
        >
          <b-row class="d-flex justify-content-between align-items-center">
            <b-col lg="3">
              <b-button
                :disabled="locked"
                variant="link"
                @click="userDetailPage(share.user)"
                class="profile-button"
              >
                <p-profile-avatar
                  :profileUsername="share.user.username"
                  :username="share.user.firstName + ' ' + share.user.lastName"
                  :size="30"
                  :imageWidth="'30px'"
                  :imageHeight="'auto'"
                />
              </b-button>
              <b-badge
                class="ml-1"
                v-show="
                  credentialDetail.credential.whoCreate.id === share.user.id
                "
                pill
                variant="success"
              >
                Owner
              </b-badge>
            </b-col>
            <b-col lg="3" class="d-flex justify-content-center">
              {{ share.description }}
            </b-col>
            <b-col lg="3" class="d-flex justify-content-center">
              <b-badge
                :variant="
                  $moment() > $moment(share.expired_at) ? 'danger' : 'primary'
                "
                >{{ share.expired_at | moment("calendar") }}</b-badge
              >
            </b-col>
            <b-col lg="3" class="d-flex justify-content-end">
              <b-button
                @click="selectLink(share)"
                v-b-modal.modal-show-share
                class="mr-2"
                variant="success"
              >
                <em class="fa fa-link mr-1"> </em> Link
              </b-button>
              <b-button @click="revokeLink(share)" variant="danger">
                <em class="fa fa-times mr-1"> </em> Revoke
              </b-button>
            </b-col>
          </b-row>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import TimingComp from "@/views/h2h/components/TimingComp";

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
    TimingComp,
  },
  data() {
    return {
      settings: {
        default_system_host_name: "",
        default_system_host_port: "",
      },
      loadingShare: false,
      shareData: {},
      allowIpAddress: "",
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
      credentialsFields: [
        { key: "result", label: "Result" },
        { key: "startAt", label: "Start Time" },
        { key: "endAt", sortable: true, label: "End Time" },
        { key: "description", label: "Message" },
      ],
      fields: [
        { key: "username", label: "User" },
        { key: "reason", label: "Reason" },
        { key: "time", label: "Break Time" },
        { key: "checked_time", label: "Checked Time" },
      ],
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
    onCopy() {
      this.$bvToast.toast(`Agent successfully copied`, {
        title: "Success Copy",
        variant: "info",
        autoHideDelay: 5000,
      });
    },
    onError() {
      this.$bvToast.toast(`Agent copy failed`, {
        title: "Failed Copy",
        variant: "danger",
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
    this.getCredentialDetail();

    this.$http
      .get("/api/v1/settings/generalSettings")
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].tag === "default_system_host_name") {
            this.settings.default_system_host_name = response.data[i].value
              ? response.data[i].value
              : location.host;
          }
          if (response.data[i].tag === "default_system_host_port") {
            this.settings.default_system_host_port = response.data[i].value;
          }
        }
      })
      .catch((error) => {
        console.log(error);
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
