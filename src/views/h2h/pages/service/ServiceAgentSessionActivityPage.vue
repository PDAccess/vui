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
              @click="commandActionLiveMode = !commandActionLiveMode"
              style="width: 100%; font-size: 1.2rem"
              :variant="commandActionLiveMode ? 'danger' : 'outline-primary'"
              :title="
                commandActionLiveMode ? 'Disable Live Mode' : 'Enable Live Mode'
              "
              v-b-tooltip.bottom
            >
              <i
                    :class="[
                      commandActionLiveMode
                        ? 'fa fa-stop-circle-o'
                        : 'fa fa-play',
                      'fa',
                    ]"
                    aria-hidden="true"
                  ></i>
            </b-button>
          </b-col>
          <b-col cols="7" sm="7" class="search-container">
            <div class="input-group mb-1">
              <b-form-input
                class="form-control search-input"
                size="lg"
                placeholder="Search User"
                type="text"
                v-model="tempCommandFilter"
                @keydown.enter="searchExternalCommandActions"
                :disabled="commandActionLiveMode"
              ></b-form-input>
              <div class="input-group-append">
                <b-button
                  @click="clearCommandFilter"
                  variant="outline-primary"
                  type="button"
                  :disabled="commandActionLiveMode"
                  >Clear</b-button
                >
              </div>
            </div>
          </b-col>
          <b-col cols="4" sm="4">
            <p-date-picker
              @val="dateRangeData = $event"
              :isRange="true"
              :clearBtn="false"
              mode="dateTime"
              placeHolder="Session Start Time"
              :select-date="dateRangeData"
              :disabled="commandActionLiveMode"
              title="Session Start Time"
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <br />
    <p-loading
      class="my-5"
      v-if="externalCommandLoading"
      message="Loading..."
    />
    <p-error
      v-else-if="errorStatusCommandAction"
      :header="errorHeader"
      :errorResponse="errorResponse"
      @reload="$router.go()"
    />
    <p-initial
      v-else-if="sessions.length === 0"
      icon="exclamation-circle"
      header="You don't have any service session."
      message="Please start an session to service"
    />
    <template v-else>
      <b-table
        :fields="sessionActionFields"
        :items="sessions"
        :responsive="responsive"
        hover
        show-empty
        :small="responsive"
      >
        <template v-slot:cell(session_status)="row">
            <i v-if="row.item.sessionEndTime == null" class="fa fa-play-circle fa-2x" style="color: green" aria-hidden="true"></i>
            <i v-else class="fa fa-stop-circle fa-2x" style="color: red" aria-hidden="true"></i>
        </template>

        <template v-slot:cell(login_user)="row">
          <span class="text-info">{{ row.item.loginUser }}</span>
        </template>

        <template v-slot:cell(login_terminal)="row">
          <span class="text-info">{{ row.item.loginTerminal }}</span>
        </template>

        <template v-slot:cell(ip_address)="row">
          <span class="text-info">{{ row.item.remoteAddress }}</span>
        </template>

        <template v-slot:cell(login_time)="row">
          <span class="text-info">{{ row.item.sessionStartTime | moment('calendar') }}</span>
        </template>

        <template v-slot:cell(logout_time)="row">
          <span class="text-info">{{ row.item.sessionEndTime | moment('calendar') }}</span>
        </template>

        <template v-slot:cell(action)="row">
          <b-button :to="'/service/agentActivities/session/' + id + '/' + row.item.sessionId" variant="primary" class="fa fa-info"></b-button>
        </template>

      </b-table>
      <b-row class="d-flex justify-content-center">
        <b-pagination
          class="mt-4"
          v-model="currentPageExternal"
          :total-rows="totalRows * perPage"
          :per-page="perPage"
          aria-controls="my-table"
          :disabled="commandActionLiveMode"
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
      sessions: [],
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
      currentPageAuthAction: 0,
      currentPageFileAction: 0,
      currentPageExternal: 1,
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
      sessionActionFields: [
        { key: "session_status", label: "Status" },
        { key: "login_user", label: "User" },
        { key: "login_terminal", label: "Terminal" },
        { key: "ip_address", label: "IP Address" },
        { key: "login_time", label: "Login Time" },
        { key: "logout_time", label: "Logout Time" },
        { key: "action", label: "" }
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
          loginTime: f.loginTime ? this.$moment(f.loginTime).format("hh:mm:s Y/MM/DD") : "",
          time: f.time ? this.$moment(f.time * 1000).format("hh:mm:ss Y/MM/DD"): "",
          objSize: f.objSize,
        });
      });

      return excelData;
    },
    updateExternalCommandActions() {
      this.currentPageExternal = 1;
      let nowDate = new Date();
      let beforeDate = new Date(nowDate);
      beforeDate.setHours(nowDate.getHours() - 3);
      this.dateRangeData.start = beforeDate;
      this.dateRangeData.end = nowDate;
      this.getExternalCommandActions();
    },
    getExternalCommandActions() {
      this.externalCommandLoading = true;
      this.sessions = [];
      let externalData = {
        perPage: 20,
        currentPage: this.currentPageExternal - 1,
        filter: this.commandFilter,
      };

      if (this.dateRangeData != null) {
        externalData.startTime = this.$moment(
          this.dateRangeData.start
        ).valueOf();
        externalData.endTime = this.$moment(this.dateRangeData.end).valueOf();
      }

      this.$http
      .post("/api/v1/action/sessions/" + this.id, externalData)
      .then((response) => {
        if (response.status == 200) { 
          this.totalRows = response.data.totalPages;
          response.data.logs.forEach(element => {
            this.sessions.push(element);
          });
          this.externalCommandLoading = false;
        }
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
    },
    searchExternalCommandActions() {
      if (this.tempCommandFilter == null) {
        this.clearCommandFilter();
      } else if (
        this.commandFilter == null ||
        this.tempCommandFilter.toLowerCase() != this.commandFilter.toLowerCase()
      ) {
        this.commandFilter = this.tempCommandFilter.toLowerCase();
        this.externalCommandLoading = true;
        this.sessions = []
        this.currentPageExternal = 1;
        this.getExternalCommandActions();
      }
    },
    clearCommandFilter() {
      if (this.commandFilter == null) {
        this.tempCommandFilter = null;
      } else {
        this.tempCommandFilter = null;
        this.commandFilter = null;
        this.externalCommandLoading = true;
        this.currentPageExternal = 1;
        this.getExternalCommandActions();
      }
    },
  },
  watch: {
    currentPageExternal: function (value) {
      this.getExternalCommandActions();
    },
    dateRangeData: function (value) {
      this.currentPageExternal = 1;
      this.getExternalCommandActions();
    },
    tempCommandFilter: function (val) {
      if (val.length >= 3 || val.length == 0)
        this.searchExternalCommandActions();
    },
    commandActionLiveMode(value) {
      if (value) {
        this.updateExternalCommandActions();
        this.exCommandActionLive = setInterval(
          this.updateExternalCommandActions,
          5000
        );
      } else {
        clearInterval(this.exCommandActionLive);
      }
    },
  },

  beforeDestroy() {
    clearInterval(this.exCommandActionLive);
  },
  created() {
    this.updateExternalCommandActions();
  },
};
</script>

<style>
</style>