<template>
  <div class="animated fadeIn">
    <p-card :cardBody="true">
      <b-modal id="service-connect-modal" centered hide-footer
        title="Please select the service you want to connect to:">
        <b-button :key="service.id" v-for="service in selectedCredential.services" variant="outline-primary" block
          @click="hideModal">
          <div v-b-tooltip.bottom :class="['inventory-logo', 'mx-auto', 'mb-2 mt-1', service.type]"></div>
          {{ service.name }}
        </b-button>
      </b-modal>
      <b-modal id="service-share-modal" centered hide-footer
        :title="'Credential Share: ' + selectedCredential.username">
        <div class="form-group">
          <label center>Expire Date/Time</label>
          <p-date-picker id="groupExpireTime" @val="selectedDate = $event" :select-date="selectedDate" mode="dateTime"
            :clearBtn="true" :isRange="false" placeHolder="Select expire date/time" />
        </div>
        <div class="form-group">
          <label center>Description</label>
          <b-form-input id="groupUserSelect" v-model="shareDescription" placeholder="Add a description" />
        </div>
        <div class="d-flex justify-content-end mt-4">
          <b-button variant="secondary" @click="$bvModal.hide('service-share-modal')" class="mr-2">
            Cancel
          </b-button>
          <b-button variant="success" @click="shareLink" v-b-modal.modal-show-share>
            Share
          </b-button>
        </div>
      </b-modal>
      <b-modal id="modal-show-share" hide-footer centered :title="'Shared Credential: ' + selectedCredential.username"
        size="xl" header-bg-variant="success" header-text-variant="light">
        <p-loading v-if="loadingShare" class="my-5" message="Loading..." />
        <div v-else>
          <p>
            <strong>Share Link:</strong>
            <b-input-group class="inputgroup mt-2">
              <b-form-input class="inputform" :readonly="true" :value="shareData.share_link"></b-form-input>
              <p-copy :copyItem="copyKey" @click="
      copyValue(
        shareData.share_link,
        'Shared link successfully copied'
      )
      " />
            </b-input-group>
          </p>
        </div>
      </b-modal>
      <b-modal id="service-break-modal" centered hide-footer
        :title="'Credential Break: ' + selectedCredential.username">
        <b-form-input v-model="breakReason" placeholder="Reason for Break">
        </b-form-input>
        <div class="d-flex justify-content-end mt-4">
          <b-button variant="secondary" @click="$bvModal.hide('service-break-modal')" class="mr-2">
            Cancel
          </b-button>
          <b-button variant="danger" @click="breakedCredential" v-b-modal.modal-show-break>
            Break
          </b-button>
        </div>
      </b-modal>
      <b-modal id="modal-show-break" hide-footer centered title="Breaked Credential Data" size="xl"
        header-bg-variant="danger" header-text-variant="light">
        <p-loading v-if="loadingBreak" class="my-5" message="Loading..." />
        <div v-else>
          <p>
            <strong>Name:</strong>
            <b-input-group class="inputgroup mt-2">
              <b-form-input class="inputform" :readonly="true" :value="breakCredential.name"></b-form-input>
              <p-copy :copyItem="breakCredential.name" />
            </b-input-group>
          </p>
          <p :key="index" v-for="(keyValue, index) in breakCredential.keyValue">
            <strong>{{ keyValue.key }}</strong>
            <b-input-group class="inputgroup mt-2">
              <b-form-input class="inputform" :readonly="true" :value="keyValue.value"></b-form-input>
              <p-copy :copyItem="keyValue.value" @click="message = keyValue.key + ' successfully copied'" />
            </b-input-group>
          </p>
        </div>
      </b-modal>
      <p-loading v-if="loading" class="my-5" message="Loading..." />
      <p-error v-else-if="errorStatus" :header="errorHeader" :errorResponse="errorResponse" @reload="$router.go()" />
      <p-initial v-else-if="credentials.length === 0" icon="exclamation-circle" header="You don't have any credential."
        message="Please create a credential." />
      <template v-else>
        <b-table :fields="fields" :items="credentials" thead-class="hidden_header" responsive>
          <template v-slot:cell(credential_name)="row">
            <span class="text-nowrap">
              <em v-if="row.item.canManage" v-b-tooltip.bottom class="fa fa-user text-primary"></em>
              <em v-else v-b-tooltip.bottom class="fa fa-user text-danger"></em>
              <b-link :disabled="!row.item.canManage" @click.stop="credentialDetails(row.item.credentialId)">
                <span class="wfont ml-2">{{ row.item.name }}</span>
              </b-link>
            </span>
          </template>
          <template v-slot:cell(credential_type)="row">
            <span class="text-primary">
              {{ row.item.credentialType }}
            </span>
          </template>
          <template v-slot:cell(group)="row">
            <p-group :id="row.item.group" />
          </template>
          <template v-slot:cell(service)="row">
            <p-service :id="row.item.serviceId" />
          </template>
          <template v-slot:cell(check_status)="row">
            <b-badge v-if="row.item.checkStatus" variant="primary">
              Active
            </b-badge>
            <b-badge v-else variant="danger">
              Passive
            </b-badge>
          </template>
          <template v-slot:cell(manage_status)="row">
            <b-badge v-if="row.item.manageStatus" variant="primary">
              Active
            </b-badge>
            <b-badge v-else variant="danger">
              Passive
            </b-badge>
          </template>
          <template v-slot:cell(who_create)="row">
            <p-user :id="row.item.whoCreate" />
          </template>
          <template v-slot:cell(created_at)="row">
            <p-timing :startDate="row.item.createdAt" nowrap />
          </template>
          <template v-slot:cell(updated_at)="row">
            <p-timing :startDate="row.item.updatedAt" nowrap />
          </template>
          <template v-slot:cell(action)="row">
            <div class="d-flex justify-content-center">
              <b-button v-if="row.item.canBreak" :id="'pop' + row.item.credentialId" variant="primary" class="mr-2">
                <em :class="getClassLock('pop' + row.item.credentialId)
      " aria-hidden="true" />
              </b-button>
              <b-button v-if="row.item.canCheckout" variant="success" title="Check Out"
                @click="checkoutCredential(row.item)">
                <em class="fa fa-lock" aria-hidden="true" />
              </b-button>
              <b-button v-else variant="danger">
                <em class="fa fa-ban" aria-hidden="true" />
              </b-button>
              <b-popover v-if="row.item.canBreak" :show="vault.popId === 'pop' + row.item.credentialId"
                :target="'pop' + row.item.credentialId" triggers="hover">
                <template #title>Break The Glass</template>
                <div v-if="vault.popId !== 'pop' + row.item.credentialId">
                  <b-input v-model="reason" placeholder="Enter Your Reason" />
                  <div class="d-flex flex-row justify-content-end mt-2">
                    <b-button size="sm" :disabled="reason.length <= 3" @click="
      breakedCredential(
        row.item,
        'pop' + row.item.credentialId,
        'pop2' + row.item.credentialId
      )
      " variant="danger"><em class="fa fa-gavel" aria-hidden="true"></em> Break
                    </b-button>
                  </div>
                </div>
                <div v-else>
                  <b-link v-clipboard:copy="breakPasskey.value" v-clipboard:success="onCopy" v-if="breakPasskey">
                    Copy Key <em class="fa fa-copy"></em>
                  </b-link>
                  <br />
                  <br />
                  <b-link class="mt-2" v-clipboard:copy="breakPassword.value" v-clipboard:success="onCopy" v-if="breakPassword
      ">
                    Copy Password <em class="fa fa-copy"></em></b-link>
                  <br />
                  <br />
                  <b-link class="mt-2" v-b-modal.modal-show-break>
                    Show more</b-link>
                </div>
              </b-popover>
            </div>
            <!--
          <div class="d-flex justify-content-end">
          <b-button :disabled="!row.item.permissionsSet.includes('CAN_SEE_PASSWORD')" @click="selectCredential(row.item.credentialEntity)" v-b-modal.service-share-modal variant="success" class="mr-2">
            <i class="fa fa-share-alt" aria-hidden="true"></i>
          </b-button>
          <b-button :disabled="&& !row.item.permissionsSet.includes('CAN_SEE_PASSWORD')" @click="selectCredential(row.item.credentialEntity)" v-b-modal.service-break-modal variant="danger" class="mr-2">
            <i class="fa fa-lock" aria-hidden="true"></i>
          </b-button>
          <b-button :disabled="!row.item.permissionsSet.includes('CAN_CONNECT') || row.item.credentialEntity.connectionUser == null" variant="primary">
            <i class="fa fa-plug" aria-hidden="true"></i>
          </b-button>
          </div>
          -->
          </template>
          <template v-slot:cell(connection)="row">
            <b-link v-if="row.item.permissionsSet.includes('CAN_CONNECT') &&
      row.item.service
      " @click.stop="
      goToConnectionPage(
        row.item.service.id,
        row.item.service.serviceTypeLogo,
        row.item.credentialId
      )
      " size="sm" variant="outline-success">
              <em class="fa fa-plug mr-1"></em>
            </b-link>
            <em v-else class="fa fa-plug text-danger" aria-hidden="true"></em>
          </template>
        </b-table>
        <infinite-loading @infinite="updateTable" force-use-infinite-wrapper>
          <div slot="no-more"></div>
          <div slot="no-results"></div>
        </infinite-loading>
      </template>
    </p-card>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import InfiniteLoading from "vue-infinite-loading";
import Avatar from "vue-avatar";

import {
  CredentialsApi,
  BreakTheGlassApi,
} from "@/generated/cmanager/index.ts";

export default {
  name: "ManagedCredentials",
  components: {
    Avatar,
    InfiniteLoading,
  },
  data() {
    return {
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
      credentials: [],
      fields: [
        {
          key: "credential_name",
          label: "Name",
        },
        {
          key: "credential_type",
          label: "Type",
        },
        {
          key: "group",
          label: "Group",
        },
        {
          key: "service",
          label: "Service",
        },
        {
          key: "check_status",
          label: "Check Status",
        },
        {
          key: "manage_status",
          label: "Manage Status",
        },
        {
          key: "who_create",
          label: "Who Create",
        },
        {
          key: "created_at",
          label: "Created At",
        },
        {
          key: "updated_at",
          label: "Updated At",
        },
        {
          key: "action",
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
      new CredentialsApi(this.$cmanagerHttpConfig, undefined, this.$http)
        .searchCredentials(
          undefined,
          this.perPage,
          this.currentPage * this.perPage,
          this.$route.query.filter,
          undefined,
          undefined,
          undefined,
          true
        )
        .then((response) => {
          if (response.data.credentials.length) {
            this.currentPage += 1;
            response.data.credentials.forEach((credential) => {
              this.credentials.push(credential);
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
      new BreakTheGlassApi(this.$cmanagerHttpConfig, undefined, this.$http)
        .breakCredential(item.credentialId, true)
        .then((response) => {
          item.canBreak = true;
          item.canCheckout = false;
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
    breakedCredential(item, popId) {
      this.loadingBreak = true;
      this.$root.$emit("bv::hide::popover", popId);
      new BreakTheGlassApi(this.$cmanagerHttpConfig, undefined, this.$http)
        .breakCredential(item.credentialId, false, this.reason)
        .then((response) => {
          this.breakCredential = response.data.credential;
          this.vault = response.data.credential;
          this.vault.popId = popId;
          let vm = this;
          item.canCheckout = true;
          setTimeout(function () {
            vm.reason = "";
            vm.loadingBreak = false;
            vm.$root.$emit("bv::show::popover", popId);
          }, 500);
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
        return "fa fa-lock fa-spin";
      } else if (!this.loadingBreak && popId === this.vault.popId) {
        return "fa fa-unlock";
      }
      return "fa fa-lock";
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
      new BreakTheGlassApi(this.$cmanagerHttpConfig, undefined, this.$http)
        .breakCredential(item.credentialId, true)
        .then((response) => {
          item.checkStatus = false;
          item.breakStatus = true;
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
    getCredentials() {
      this.loading = true;
      this.currentPage = 0;
      this.credentials = [];

      new CredentialsApi(this.$cmanagerHttpConfig, undefined, this.$http)
        .searchCredentials(
          undefined,
          this.perPage,
          this.currentPage * this.perPage,
          this.$route.query.filter,
          undefined,
          undefined,
          undefined,
          true
        )
        .then((response) => {
          response.data.credentials.forEach(credential => {
            this.credentials.push(credential)
          });
          this.currentPage++;
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

    this.getCredentials();
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
