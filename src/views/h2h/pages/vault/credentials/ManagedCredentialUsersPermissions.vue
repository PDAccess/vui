<template>
  <div>
    <p-loading class="my-5" v-if="isLoading" message="Loading..." />
    <p-error v-else-if="errorState" message="No user found!"></p-error>
    <p-initial
      v-else-if="permissions.length === 0"
      icon="exclamation-circle"
      header="You don't have any credential permission."
      message="Please create a permission."
    />
    <div v-else>
      <b-table :fields="permissionFields" :items="permissions" responsive>
        <template v-slot:cell(user)="row">
          <p-user :id="row.item.user" />
              <b-badge
                v-show="
                  credentialDetail.whoCreate ===
                  row.item.user
                "
                pill
                variant="success"
              >
                Owner
              </b-badge>
        </template>
        <template v-slot:cell(can_connect)="row">
          <em v-if="row.item.permissionsSet.includes('CAN_CONNECT')" class="fa fa-2x fa-check-circle text-success" aria-hidden="true"></em>
          <em v-else class="fa fa-2x fa-times-circle text-danger" aria-hidden="true"></em>
        </template>
        <template v-slot:cell(can_see_password)="row">
          <em v-if="row.item.permissionsSet.includes('CAN_SEE_PASSWORD')" class="fa fa-2x fa-check-circle text-success" aria-hidden="true"></em>
          <em v-else class="fa fa-2x fa-times-circle text-danger" aria-hidden="true"></em>
        </template>
        <template v-slot:cell(can_change_password)="row">
          <em v-if="row.item.permissionsSet.includes('CAN_CHANGE_PASSWORD')" class="fa fa-2x fa-check-circle text-success" aria-hidden="true"></em>
          <em v-else class="fa fa-2x fa-times-circle text-danger" aria-hidden="true"></em>
        </template>
        <template v-slot:cell(can_authorize_other_users)="row">
          <em v-if="row.item.permissionsSet.includes('CAN_AUTHORIZE_OTHER_USERS')" class="fa fa-2x fa-check-circle text-success" aria-hidden="true"></em>
          <em v-else class="fa fa-2x fa-times-circle text-danger" aria-hidden="true"></em>
        </template>
        <template v-slot:cell(can_join_session)="row">
          <em v-if="row.item.permissionsSet.includes('CAN_JOIN_SESSIONS')" class="fa fa-2x fa-check-circle text-success" aria-hidden="true"></em>
          <em v-else class="fa fa-2x fa-times-circle text-danger" aria-hidden="true"></em>
        </template>
        <template v-slot:cell(can_connection_with_request_permission)="row">
          <em v-if="row.item.permissionsSet.includes('CAN_CONNECTION_WITH_REQUEST_PERMISSION')" class="fa fa-2x fa-check-circle text-success" aria-hidden="true"></em>
          <em v-else class="fa fa-2x fa-times-circle text-danger" aria-hidden="true"></em>
        </template>
        <template v-slot:cell(can_manage_others_users)="row">
          <em v-if="row.item.permissionsSet.includes('CAN_MANAGE_OTHER_USERS')" class="fa fa-2x fa-check-circle text-success" aria-hidden="true"></em>
          <em v-else class="fa fa-2x fa-times-circle text-danger" aria-hidden="true"></em>
        </template>
      </b-table>
      <!--
        <ul class="list-group list-group-flush">
        <li
          class="list-group-item"
          :key="index"
          v-for="(permission, index) in permissions"
        >
          <b-row class="d-flex justify-content-between align-items-center">
            <b-col lg="3">
              <p-user :id="permission.user" />
              <b-badge
                v-show="
                  credentialDetail.whoCreate ===
                  permission.user
                "
                pill
                variant="success"
              >
                Owner
              </b-badge>
            </b-col>
            <template v-if="!permission.hasMore">
              <b-col
                cols="1"
                :key="perm"
                v-for="perm in convertPermissions(permission.permissionsSet)"
              >
                <b-badge variant="info" class="text-wrap">
                  {{ perm.replaceAll("_", " ") }}
                </b-badge>
              </b-col>
            </template>
            <b-col
              cols="1"
              class="d-flex justify-content-end text-wrap"
              v-if="hasMorePermissions(permission.permissionsSet)"
            >
              <b-link @click="permission.hasMore = !permission.hasMore">
                {{ permission.hasMore ? "less" : "more" }}
                <b-icon
                  :icon="permission.hasMore ? 'dash-square' : 'plus-square'"
                  animation="spin-pulse"
                />
              </b-link>
            </b-col>
          </b-row>
          <b-row v-if="permission.hasMore">
            <b-col :key="perm2" v-for="perm2 in permission.permissionsSet">
              <b-badge variant="info" class="text-wrap">
                {{ perm2.replaceAll("_", " ") }}
              </b-badge>
            </b-col>
          </b-row>
        </li>
      </ul>
      -->
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import { PermissionApi, CredentialsApi } from "@/generated/cmanager";

import axios from "axios";

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
  data() {
    return {
      permissionFields: [
        {
          key: "user",
          label: "User",
        },
        {
          key: "can_connect",
          label: "Can Connect",
        },
        {
          key: "can_see_password",
          label: "Can See Password",
        },
        {
          key: "can_change_password",
          label: "Can Change Password",
        },
        {
          key: "can_authorize_other_users",
          label: "Can Authorize Other Users",
        },
        {
          key: "can_join_session",
          label: "Can Join Session",
        },
        {
          key: "can_connection_with_request_permission",
          label: "Can Connection With Request Permission",
        },
        {
          key: "can_manage_others_users",
          label: "Can Manage Others Users",
        },
      ],
      permissions: [],
      credentialDetail: {},
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
    convertPermissions(permissions) {
      return permissions.slice(0, 3);
    },
    hasMorePermissions(permissions) {
      return permissions.length > 3;
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
      new PermissionsApi(this.$cmanagerHttpConfig, undefined, this.$http)
      .then((response) => {
          this.permissions = response.data.permissions;
          this.isLoading = false;
        })
        .catch((error) => {
          this.errorState = true;
        });
    },
    getCredentialPermissions() {
      this.isLoading = true;
      new PermissionsApi(this.$cmanagerHttpConfig, undefined, this.$http)
      .then((response) => {
          this.permissions = response.data.permissions;
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

    this.isLoading = true

    let credentialPermissionRequest = new PermissionApi(this.$cmanagerHttpConfig, undefined, this.$http).getCredentialPermission(this.id)
    let credentialDetailRequest = new CredentialsApi(this.$cmanagerHttpConfig, undefined, this.$http).getCredentialsById(this.id)

    axios
      .all([credentialPermissionRequest, credentialDetailRequest])
      .then(
        axios.spread((...results) => {
          this.permissions = results[0].data.permissions
          this.permissions.forEach((element) => {
            this.$set(element, "hasMore", false);
          });
          this.credentialDetail = results[1].data.credential
          this.isLoading = false
        })
      )
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

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
