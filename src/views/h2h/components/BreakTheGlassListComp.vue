<template>
  <div>
    <b-row align-h="center">
      
      <b-col cols="12" lg="3" class="mb-3">
        <p-select
          :options="users"
          label="username"
          placeholder="Select User"
          track-by="userId"
          v-model="selectedUserObjects"
        ></p-select>
      </b-col>
      <b-col cols="12" lg="3" class="mb-3">
        <p-select
          :options="services"
          label="name"
          placeholder="Select Credential"
          track-by="inventory_id"
          v-model="selectedServiceObjects"
        ></p-select>
      </b-col>
      <b-col cols="12" lg="3" class="mb-3">
        <p-date-picker
                @val="dateRangeData = $event"
                :isRange="true"
                :clearBtn="false"
                mode="dateTime"
                placeHolder="Session Start Time"
                :select-date="dateRangeData"
                :disabled="liveMode"
                title="Session Start Time"
              />
      </b-col>
      <b-col cols="12" lg="3" class="mb-3">
        <b-input
        style="height: 100%"
        placeholder="Search"
          label="username"
        ></b-input>
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
    <div v-else-if="credentialHistories.length === 0">
      <p-initial
        icon="exclamation-circle"
        header="You don't have any break the glass."
        message="Please start a break."
      />
    </div>
    <b-row v-else>
      <b-col>
        <b-table :fields="historyFields" :items="credentialHistories" responsive>
        
        <template v-slot:cell(who_did)="row">
          <p-user :id="row.item.whoDid" />
        </template>
        <template v-slot:cell(credential)="row">
          <span class="text-primary">
            {{ row.item.credentialId }}
          </span>
        </template>
        <template v-slot:cell(op_type)="row">
          <span class="text-primary">
            {{ row.item.opType }}
          </span>
        </template>
        <template v-slot:cell(op_time)="row">
          <p-timing :start-date="row.item.opTime" />
        </template>
        <template v-slot:cell(message)="row">
          <span class="text-primary">
            {{ row.item.message }}
          </span>
        </template>
        <template v-slot:cell(status)="row">
          <em v-if="row.item.status" class="fa fa-2x fa-check-circle text-success" aria-hidden="true"></em>
          <em v-else class="fa fa-2x fa-times-circle text-danger" aria-hidden="true"></em>
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

import { CredentialsApi } from "@/generated/cmanager";

export default {
  components: {
    InfiniteLoading,
  },
  props: ["serviceid", "groupid"],
  data() {
    return {
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
