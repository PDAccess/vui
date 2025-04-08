<template>
  <p-card>
    <b-modal
      id="change-password-modal"
      centered
      hide-footer
      title="Credential Change Password"
    >
      <div class="form-group">
        <label center>New Password</label>
        <b-form-input v-model="newPassword" type="password"></b-form-input>
      </div>
      <div class="d-flex justify-content-end mt-4">
        <b-button
          :disabled="!newPassword"
          variant="success"
          @click="changePassword"
          class="mr-2"
        >
          Change
        </b-button>
        <b-button
          variant="secondary"
          @click="$bvModal.hide('change-password-modal')"
        >
          Cancel
        </b-button>
      </div>
    </b-modal>
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
      <div class="form-group">
        <label center>Users to be allowed</label>
        <p-select
          :options="users"
          label="username"
          placeholder="Select Users"
          v-model.trim="selectedUsers"
          :multiple="true"
          :custom-label="customLabel"
          track-by="userId"
          :close-on-select="false"
        >
          <template slot="singleLabel" slot-scope="props">
            <span class="option__title">{{ props.option.username }}</span>
          </template>
          <template slot="option" slot-scope="props">
            <div class="option__desc">
              <span class="option__title">
                <div class="d-flex justify-content-start align-items-center">
                  <p-profile-avatar
                    :profileUsername="props.option.username"
                    :username="
                      props.option.first_name + ' ' + props.option.last_name
                    "
                    :size="30"
                    :imageWidth="'30px'"
                    :imageHeight="'auto'"
                  />
                </div>
              </span>
            </div>
          </template>
        </p-select>
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
            <b-form-textarea
              class="inputform"
              :readonly="true"
              :value="shareData.share_link"
            ></b-form-textarea>
            <p-copy :copyItem="shareData.share_link" @click="copyValue(
                  shareData.share_link,
                  'Shared link successfully copied'
                )"/>
          </b-input-group>
        </p>
      </div>
    </b-modal>
    <p-loading class="my-5" v-if="isLoading" message="Loading..." />
    <p-error v-else-if="errorState" message="No user found!"></p-error>
    <template v-else>
      <div class="text-center mb-4" style="margin-top: 30px">
        <b-button disabled variant="link">
          <p-profile-avatar
            :username="credentialDetail.credential.name"
            :size="80"
            :imageWidth="'30px'"
            :imageHeight="'auto'"
            :username-show="false"
          />
        </b-button>
        <div class="d-flex justify-content-center align-items-center">
          <h2>{{ credentialDetail.credential.name }}</h2>
        </div>
        <p>
          description
          <a v-show="credentialDetail.credential.createdAt != null">
            <span>&#183;</span>
            Created at
            {{ credentialDetail.credential.createdAt | moment("calendar") }}
            <br />
            <span>&#183;</span>
            <span> Last Access at asdasd </span>
            <br />
            <span>&#183;</span>
            <span> Created by {{ credentialDetail.credential.whoCreate }} </span>
            <br />
            <span>&#183;</span>
            <span> User at {{ credentialDetail.credential.group }}</span>
            <br />
            <span>&#183;</span>
            <span> Last access time: {{ credentialDetail.credential.lastAccessTime != null ? $moment(credentialDetail.credential.lastAccessTime).calendar() : 'No Access' }} </span>
            <br />
            <span>&#183;</span>
            <span> Last password change time: {{ credentialDetail.credential.lastPasswordChangeTime != null ? $moment(credentialDetail.credential.lastPasswordChangeTime).calendar() : 'No Change' }} </span>
            <template v-if="credentialDetail.credential.lastPasswordChangeTime">
              <br />
              <span>&#183;</span>
              <span> Last password change status is {{ credentialDetail.credential.passwordChangeStatus ? 'Successfully' : 'Failed' }} </span>
            </template>
            <template>
              <br />
              <span>&#183;</span>
              <span> ID: {{ id }}</span><p-copy :copyItem="id"></p-copy>
            </template>
          </a>
        </p>
        <br />
        <div class="d-flex justify-content-center">
          <div>
            <b-button
              v-b-modal.service-share-modal
              variant="primary"
              class="mr-1"
              :disabled="credentialDetail.credential.checkStatus"
            >
              <em class="fa fa-link mr-1"></em>
              <span class="d-sm-down-none">Share</span>
            </b-button>
            <b-button
                  variant="danger"
                  class="mr-1"
                >
                  <em class="fa fa-bell mr-1"></em>
                  <span class="d-sm-down-none">Notification</span>
                </b-button>
            <b-dropdown
              :disabled="
                !credentialDetail.credential.canChangePassword
              "
              variant="success"
            >
              <template slot="button-content">
                <em class="fa fa-refresh mr-1"></em>
                <span class="d-sm-down-none">Change Password</span>
              </template>
              <b-dropdown-item @click="changePassword">Auto</b-dropdown-item>
              <b-dropdown-item v-b-modal.change-password-modal
                >Manuel</b-dropdown-item
              >
            </b-dropdown>
          </div>
        </div>
      </div>
      <div>
        <div class="d-flex justify-content-center">
          <!--
            <VuePerfectScrollbar class="scrollperfect" v-once>
              <fcart
                :colors="colors"
                :countLabel="countLabel"
                :dataPoints="data1"
                :dataSets="avc"
                :endDate="end"
                :height="200"
                :labels="labels"
                :startDate="start"
                id="app2"
                title
                type="heatmap"
              ></fcart>
            </VuePerfectScrollbar>
            -->
        </div>
      </div>
      <!--
      <div class="text-center">
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
            <b-button
              v-clipboard:copy="copyKey"
              v-clipboard:success="onCopy"
              @click="
                copyValue(
                  shareData.share_link,
                  'Shared link successfully copied'
                )
              "
              class="btn btn-light"
              v-b-tooltip.hover.bottom="'Copy Share Link'"
            >
              <em class="fa fa-copy"></em>
            </b-button>
          </b-input-group>
        </p>
      </div>
    </b-modal>
    <p-loading class="my-5" v-if="isLoading" message="Loading..." />
    <p-error v-else-if="errorState" message="No user found!"></p-error>
    <div v-else>
      <div
        class="d-flex flex-row justify-content-between align-items-center my-3"
      >
        <div class="d-flex flex-row justify-content-start align-items-center">
          <p-profile-avatar
            :username="credentialDetail.credential.username"
            :size="80"
            :imageWidth="'30px'"
            :imageHeight="'auto'"
            :username-show="false"
          />
          <div
            class="
              ml-2
              d-flex
              flex-column
              justify-content-start
              align-items-start
            "
          >
            <h3>{{ credentialDetail.credential.username }}</h3>
            <span> User at {{ credentialDetail.credential.group.name }}</span>
          </div>
      </div>
      <div class="d-flex justify-content-start align-items-center">
        <div>
          <div class="d-flex justify-content-between">
            <em class="fa fa-calendar mr-1" />
            Created at
            <span
              v-b-tooltip.auto
              :title="credentialDetail.credential.createdAt | moment('lll')"
            >
              {{
                $moment(credentialDetail.credential.createdAt).fromNow()
              }}</span
            >
            <b-link v-b-modal.service-share-modal>
              <em class="fa fa-link ml-3" />
              Share
            </b-link>
          </div>
        </div>
      </div>
      -->
      <hr />
    </template>
  </p-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import TimingComp from "@/views/h2h/components/TimingComp";

import {
  CredentialsApi,
} from "@/generated/cmanager/index.ts";

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
      selectedUsers: [],
      users: [],
      allowIpAddress: "",
      newPassword: "",
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
    customLabel({ first_name, last_name, username }) {
      return `${first_name} ${last_name} (${username})`;
    },
    changePassword() {
      this.$bvModal.hide("change-password-modal");
      let data = {
        credentialId: this.id,
        password: this.newPassword,
      };
      this.$http
        .post("/api/v1/credentials/change-password", data)
        .then((response) => {
          this.$bvToast.toast(
            `Password change request received successfully. You can follow the change status of your password via the notification e-mail.`,
            {
              title: "Password Change Succeed",
              variant: "success",
              autoHideDelay: 5000,
            }
          );
        })
        .catch((error) => {
          console.log(error);
          this.$bvToast.toast(
            `Failed to receive password change request. Please try again later.`,
            {
              title: "Password Change Failed",
              variant: "danger",
              autoHideDelay: 5000,
            }
          );
          this.errorState = true;
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
        users: this.selectedUsers,
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
      new CredentialsApi(this.$cmanagerHttpConfig, undefined, this.$http).getCredentialsById(this.id)
      .then((response) => {
          this.credentialDetail = response.data;
          this.isLoading = false;
          this.$http
            .get(
              "/api/v1/group/user/members/" +
                this.credentialDetail.credential.group.id
            )
            .then((response) => {
              this.users = [];
              response.data.forEach((f) => {
                this.users.push(f.user);
              });
              console.log(this.users);
            })
            .catch((error) => {
              console.log(error);
            });
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
