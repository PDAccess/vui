<template>
  <p-card>
    <div v-if="errorStatus">
      <p-error
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
    </div>
    <b-row>
      <b-col>
        <b-row>
          <b-col cols="2" sm="1" class="refresh-container">
            <b-button
              @click="authActionLiveMode = !authActionLiveMode"
              style="width: 100%; font-size: 1.2rem"
              :variant="authActionLiveMode ? 'danger' : 'outline-primary'"
              :title="
                authActionLiveMode ? 'Disable Live Mode' : 'Enable Live Mode'
              "
              v-b-tooltip.bottom
            >
              <i
                :class="[
                  authActionLiveMode ? 'fa fa-stop-circle-o' : 'fa fa-play',
                  'fa',
                ]"
                aria-hidden="true"
              ></i>
            </b-button>
          </b-col>
          <b-col cols="10" sm="11" class="search-container">
            <div class="input-group mb-1">
              <b-form-input
                class="form-control search-input"
                size="lg"
                placeholder="Search User"
                type="text"
                v-model="tempAuthUserFilter"
                @keydown.enter="searchExternalAuthActions"
              ></b-form-input>
              <div class="input-group-append">
                <b-button
                  @click="clearAuthUserFilter"
                  variant="outline-primary"
                  type="button"
                  >Clear</b-button
                >
              </div>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <br />
    <p-loading class="my-5" v-if="externalAuthloading" message="Loading..." />
    <p-error
      v-else-if="errorStatusAuth"
      :header="errorHeader"
      :errorResponse="errorResponse"
      @reload="$router.go()"
    />
    <p-initial
      v-else-if="exAuthLogs.length === 0"
      icon="exclamation-circle"
      header="You don't have any service agent authentication logs."
      message="Please start an agent authentication log"
    />
    <template v-else>
      <b-table
        :fields="authActionFields"
        :items="exAuthLogs"
        :responsive="responsive"
        hover
        show-empty
        :small="responsive"
      >
        <template v-slot:cell(user)="row">
          <span class="text-info">{{ row.item.user }}</span>
        </template>

        <template v-slot:cell(tty)="row">
          <span class="text-info">{{ row.item.tty }}</span>
        </template>

        <template v-slot:cell(function)="row">
          <span class="text-info">{{ row.item.function }}</span>
        </template>

        <template v-slot:cell(flags)="row">
          <span class="text-info">{{ row.item.flags }}</span>
        </template>

        <template v-slot:cell(r_user)="row">
          <span class="text-info">{{ row.item.rUser }}</span>
        </template>

        <template v-slot:cell(r_host)="row">
          <span class="text-info">{{ row.item.rHost }}</span>
        </template>

        <template v-slot:cell(host)="row">
          <span class="text-info">{{ row.item.host }}</span>
        </template>

        <template v-slot:cell(exec_time)="row">
          <p-timing :start-date="row.item.time" :end-date="new Date()" />
        </template>

        <template v-slot:cell(report_time)="row">
          <p-timing
            :start-date="row.item.reportTime"
            :end-date="new Date()"
          />
        </template>
      </b-table>
      <b-row class="d-flex justify-content-center">
        <b-pagination
          class="mt-4"
          v-model="currentPageAuthAction"
          :total-rows="totalRows * perPage"
          :per-page="perPage"
          aria-controls="my-table"
          :disabled="authActionLiveMode"
        ></b-pagination>
      </b-row>
    </template>
  </p-card>
</template>
<script>
import mappage from "@/views/h2h/components/mappage";
import InfiniteLoading from "vue-infinite-loading";
import { mapGetters } from "vuex";

import jsonSize from "@/shared/json-size";
import downloadExcel from "vue-json-excel";

export default {
  props: ["id"],
  components: {
    mappage,
    InfiniteLoading,
    downloadExcel,
  },
  data() {
    return {
      exporting: false,
      perPage: 20,
      totalRows: 0,
      dateRangeData: {
        start: null,
        end: null,
      },
      errorStatus: false,
      errorStatusFile: false,
      errorStatusCommandAction: false,
      errorStatusAuth: false,
      errorHeader: "",
      errorResponse: "",
      externalCommandLoading: true,
      externalAuthloading: true,
      externalFileloading: true,
      loading: true,
      agentStatusLoading: true,
      commandFilter: "",
      tempCommandFilter: "",
      tempAuthUserFilter: "",
      authUserFilter: "",
      tempFileActionFilter: "",
      fileActionFilter: "",
      exCommandLogs: [],
      credantialHistory: [],
      exAuthLogs: [],
      exFileLogs: [],
      agentStatusData: [],
      currentPageAuthAction: 1,
      currentPageFileAction: 0,
      currentPageExternal: 0,
      currentPageAgentStatus: 0,
      filter: this.$route.params.id,
      users: [],
      excelField: {
        ID: "user",
        EID: "userId",
        User: "loginUser",
        Exe: "command",
        Cmdline: "params",
        Server: "host",
        Client: "loginAddress",
        Session: "loginTime",
        Action: "time",
        Size: "objSize",
      },
      commandActionFields: [
        { key: "user", label: "ID" },
        { key: "effective_user", label: "EID" },
        { key: "login_user", label: "User" },
        { key: "command", label: "Exe" },
        { key: "params", label: "Cmdline" },
        { key: "ipadd", label: "Server" },
        { key: "login_address", label: "Client" },
        { key: "login_time", sortable: true, label: "Session" },
        { key: "time", sortable: true, label: "Action" },
        { key: "size", sortable: true, label: "" },
      ],
      authActionFields: [
        { key: "user", label: "User" },
        { key: "tty", label: "Tty" },
        { key: "function", label: "Method" },
        { key: "flags", label: "Flags" },
        { key: "r_user", label: "Remote User" },
        { key: "r_host", label: "Remote Host" },
        { key: "host", label: "Ip Address" },
        { key: "exec_time", sortable: true, label: "" },
        { key: "report_time", sortable: true, label: "" },
      ],
      fileActionFields: [
        { key: "user", label: "User" },
        { key: "path", label: "Path" },
        { key: "file_name", label: "File Name" },
        { key: "action", label: "Action" },
        { key: "host", label: "Ip Address" },
        { key: "exec_time", sortable: true, label: "Exec Time" },
        { key: "report_time", sortable: true, label: "Report Time" },
      ],
      agentStatusFields: [
        { key: "id", label: "#" },
        { key: "auth_count", label: "Auth Count" },
        { key: "command_count", label: "Command count" },
        { key: "file_count", label: "File Count" },
        { key: "command_filter_count", label: "Filtered Command count" },
        { key: "file_filter_count", label: "Filtered File Count" },
        { key: "db_error", label: "Db Error" },
        { key: "invalid_record", sortable: true, label: "Invalid Record" },
        { key: "channel_error", sortable: true, label: "Channel Error" },
        { key: "server_error", sortable: true, label: "Server Error" },
        { key: "server_success", sortable: true, label: "Server Success" },
        {
          key: "overall_bypass_count",
          sortable: true,
          label: "Overall Bypass Count",
        },
        {
          key: "write_bypass_count",
          sortable: true,
          label: "Write Bypass Count",
        },
        { key: "overall_bypass", sortable: true, label: "Overall Bypass" },
        { key: "write_bypass", sortable: true, label: "Write Bypass" },
        { key: "created_at", sortable: true, label: "Created At" },
      ],
      commandActionLiveMode: false,
      authActionLiveMode: false,
      fileActionLiveMode: false,
      exCommandActionLive: null,
      exAuthActionLive: null,
      exFileActionLive: null,
    };
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
    ...mapGetters({
      user: "auth/user",
    }),
  },
  methods: {
    exportExcel() {
      let excelData = [];
      this.exCommandLogs.forEach((f) => {
        excelData.push({
          user: f.user,
          userId: f.userId,
          loginUser: f.loginUser,
          command: f.command,
          params: f.params,
          host: f.host,
          loginAddress: f.loginAddress,
          loginTime: this.$moment(f.loginTime).format("hh:mm:s Y/MM/DD"),
          time: this.$moment(f.time * 1000).format("hh:mm:ss Y/MM/DD"),
          objSize: f.objSize,
        });
      });

      return excelData;
    },
    updateExternalAuthActions() {
      this.currentPageAuthAction = 1;
      this.getExternalAuthActions();
    },
    getExternalAuthActions() {
      this.externalAuthloading = true;
      this.exAuthLogs = [];
      let externalData = {
        perPage: 20,
        currentPage: this.currentPageAuthAction - 1,
        filter: this.authUserFilter,
      };

      this.$http
        .post("/api/v1/action/auth/list/service/" + this.id, externalData)
        .then((response) => {
          if (response.status == 200) {
            this.totalRows = response.data.totalPages;
            response.data.logs.forEach(element => {
              this.exAuthLogs.push(element);
            });
            this.externalAuthloading = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.externalAuthloading = false;
          this.errorStatusAuth = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    searchExternalAuthActions() {
      if (this.tempAuthUserFilter == null) {
        this.clearAuthUserFilter();
      } else if (
        this.authUserFilter == null ||
        this.tempAuthUserFilter.toLowerCase() !=
          this.authUserFilter.toLowerCase()
      ) {
        this.authUserFilter = this.tempAuthUserFilter.toLowerCase();
        this.currentPageAuthAction = 1;
        this.externalAuthloading = true;
        this.getExternalAuthActions();
      }
    },
    clearAuthUserFilter() {
      if (this.authUserFilter == null) {
        this.tempAuthUserFilter = null;
      } else {
        this.tempAuthUserFilter = null;
        this.authUserFilter = null;
        this.currentPageAuthAction = 1;
        this.externalCommandLoading = true;
        this.getExternalAuthActions();
      }
    },
  },
  watch: {
    currentPageAuthAction: function (value) {
      this.getExternalAuthActions();
    },
    tempAuthUserFilter: function (val) {
      if (val.length >= 3 || val.length == 0) this.searchExternalAuthActions();
    },
    authActionLiveMode(value) {
      if (value) {
        this.updateExternalAuthActions();
        this.exAuthActionLive = setInterval(
          this.updateExternalAuthActions,
          5000
        );
      } else {
        clearInterval(this.exAuthActionLive);
      }
    },
  },

  beforeDestroy() {
    clearInterval(this.exAuthActionLive);
  },
  created() {
    this.$http
      .get("/api/v1/user")
      .then((response) => {
        this.users = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    let currentDate = new Date();
    this.start = new Date(
      currentDate.getFullYear() - 1,
      currentDate.getMonth(),
      currentDate.getDay()
    );
    this.updateExternalAuthActions();
  },
};
</script>

<style>
</style>