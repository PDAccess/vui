<template>
  <div class="animated fadeIn">
    <p-card>
      <div class="card d-flex justify-content-between container-nav mb-2">
        <div class="module-nav">
          <b-button
          class="btn btn-ghost-primary"
          @click="setSelectedType('general')"
          :pressed="isActive('general')"
          type="button" >
          <span class="d-md-down-none">General</span>
          </b-button>
          <b-button
          class="btn btn-ghost-primary"
          @click="setSelectedType('vault')"
          style="margin-left: 5px"
          :pressed="isActive('vault')"
          type="button" >
          <span class="d-md-down-none">Vault</span>
          </b-button>
          <b-button
          class="btn btn-ghost-primary"
          @click="setSelectedType('auth')"
          style="margin-left: 5px"
          :pressed="isActive('auth')"
          type="button" >
          <span class="d-md-down-none">Auth</span>
          </b-button>
          <b-button
          class="btn btn-ghost-primary"
          @click="setSelectedType('proxy')"
          style="margin-left: 5px"
          :pressed="isActive('proxy')"
          type="button" >
          <span class="d-md-down-none">Proxy</span>
          </b-button>
        </div>
      </div>
      <div v-if="loading" class="loadingImage">
        <p-loading class="my-5" message="Loading..." />
      </div>
      <p-error
        v-else-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <div v-else-if="credentialHistories.length === 0">
        <p-initial
          icon="exclamation-circle"
          header="You don't have any activity logs."
          message="Please select other type."
        />
      </div>
    <template v-else>
      <b-card
        style="width: 100%"
        class="shadow mb-2"
        body-class="p-2"
        header-tag="header"
        :key="credentialHistory.id" v-for="credentialHistory in credentialHistories"
      >
      <div class="d-flex justify-content-between">
        <div class="d-flex flex-column">
          <h6 class="mb-0">
            <em class="fa fa-lock mr-2" aria-hidden="true"></em>Vault Activity
          </h6>
          <small class="text-muted">
            <p-timing :start-date="credentialHistory.opTime" />
          </small>
        </div>
        <b-col cols="auto">
          <p-user :id="credentialHistory.whoDid" />
        </b-col>
        <b-col cols="5">
          <b-card-text style="margin-top: 8px">
            <div class="button next text-white text-center" :class="credentialHistory.status ? 'success': 'fail'">
              <span v-if="credentialHistory.status">✓</span>
              <span v-else>X</span>
              {{ credentialHistory.opType}}
            </div>
          </b-card-text>
        </b-col>
        <b-col cols="auto">
          <p-credential :id="credentialHistory.credentialId" />
        </b-col>
      </div>
      </b-card>

          <infinite-loading
            @infinite="updateBreaktheglassTable"
            force-use-infinite-wrapper
          >
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </infinite-loading>
     
      </template>
    </p-card>
  </div>
</template>
<script>
import InfiniteLoading from "vue-infinite-loading";

import { CredentialsApi } from "@/generated/cmanager";

export default {
  components: {
    InfiniteLoading,
  },
  props: ["serviceid", "groupid"],
  data() {
    return {
      selectedType: "general",
      historyFields: [
        {
          key: "who_did",
          label: "Who Did",
        },
        {
          key: "credential",
          label: "Credential",
        },
        {
          key: "op_type",
          label: "Op Type",
        },
        {
          key: "op_time",
          label: "Op Time",
        },
        {
          key: "message",
          label: "Message",
        },
        {
          key: "status",
          label: "Status",
        },
      ],
      credentialHistories: [],
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
        { key: "servicename", label: "Service Name" },
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
    setSelectedType(typeValue) {
      this.selectedType = typeValue
    },
    isActive(typeValue) {
      return this.selectedType == typeValue
    },
    setSelectedType(typeValue) {
      this.selectedType = typeValue
    },
    isActive(typeValue) {
      return this.selectedType == typeValue
    },
    changeType(e) {
      this.credentialHistories = []
      switch (this.selectedType) {
        case "general":
          this.getCredentialHistory();
          break;
        case "vault":
          this.getCredentialHistory();
          break
        default:
          break;
      }
    },
    getCredentialHistory() {
      this.loading = true;
      this.currentPage = 0;

      let data = {
        limit: this.perPage,
        offset: this.currentPage * this.perPage
      }

      new CredentialsApi(this.$cmanagerHttpConfig, undefined, this.$http,).getHistory(data)
        .then((response) => {
          this.credentialHistories = response.data.history;
          this.currentPage += 1;
          this.loading = false;
        })
        .catch((error) => {
          this.errorState = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    getBreaktheglassList() {
      this.loading = true;
      this.currentPage = 0;
      let sort = this.$route.query.sort;

      let page = {
        currentPage: this.currentPage,
        perPage: this.perPage,
        usersFilter: this.selectedUsers,
        servicesFilter: this.selectedServices,
        sort: sort
      };

      this.$http
        .post("/api/v1/break", page)
        .then((response) => {
          this.breaks = response.data;
          this.currentPage += 1;
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
      let data = {
        limit: this.perPage,
        offset: this.currentPage * this.perPage
      }
      new CredentialsApi(this.$cmanagerHttpConfig, undefined, this.$http).getHistory(data)
        .then((response) => {
          if (response.data.history.length) {
            this.currentPage += 1;
            response.data.history.forEach((history) => {
              this.credentialHistories.push(history);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          this.errorState = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
  },
  created() {
    this.getCredentialHistory()
  },
};
</script>

<style scoped>
.fail {
  background: red;
}
.success {
  background: green;
}

.button {
  position: relative;
  margin: 0;
  padding-left: 14px;
  padding-right: 14px;
  padding-top: 4px;
  padding-bottom: 4px;
  color: white;
  font-size: 14px;
}
.button::after {
  content: '';
  position: absolute;
  top: 0;
  width: 0;
  height: 0;
}
/* Arrow Buttons */
/* ------------- */
.next::after,
.prev::after {
  border-style: solid;
}
/* Next Button */
/* ----------- */
.next::after {
  right: -22px;
  border-width: 11px;
}
.next.success::after {
  border-color: transparent transparent transparent green;
}
.next.fail::after {
  border-color: transparent transparent transparent red;
}

.card {
  border: none;
  border-left: 0px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  border-radius: 0px;
  padding-top: 10px;
  padding-right: 0px;
  padding-bottom: 10px;
  padding-left: 0px;
}

.card {
  border: none;
  border-left: 0px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  border-radius: 0px;
  padding-top: 10px;
  padding-right: 0px;
  padding-bottom: 10px;
  padding-left: 0px;
}
</style>
