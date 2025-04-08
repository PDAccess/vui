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
                  commandActionLiveMode ? 'fa fa-stop-circle-o' : 'fa fa-play',
                  'fa',
                ]"
                aria-hidden="true"
              ></i>
            </b-button>
          </b-col>
          <b-col cols="6" sm="6" class="search-container">
            <div class="input-group mb-1">
              <b-form-input
                class="form-control search-input"
                size="lg"
                placeholder="Search Command"
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
              placeHolder="Command Exec Time"
              :select-date="dateRangeData"
              :disabled="commandActionLiveMode"
              title="Command Exec Time"
            />
          </b-col>
          <b-col cols="1" sm="1" class="d-flex justify-content-center">
            <download-excel
              :fetch="exportExcel"
              name="actions.xls"
              :fields="excelFields"
              style="width: 100%; height: 100%"
            >
              <b-button
                variant="outline-primary"
                style="width: 100%; height: 90%"
                :disabled="excelLoading"
              >
                <b-spinner v-if="excelLoading" small />
                <em v-else class="fa fa-lg fa-download"></em>
              </b-button>
            </download-excel>
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
      v-else-if="exCommandLogs.length === 0"
      icon="exclamation-circle"
      header="You don't have any service agent commands."
      message="Please start an agent command"
    />
    <template v-else>
      <b-table
        :fields="commandActionFields"
        :items="exCommandLogs"
        :responsive="responsive"
        hover
        show-empty
        :small="responsive"
      >
        <template v-slot:cell(login_user)="row">
          <span class="text-info" :title="row.item.user" v-b-tooltip.bottom>{{
            row.item.loginUser ? row.item.loginUser : row.item.username
          }}</span>
        </template>

        <template v-slot:cell(effective_username)="row">
          <span class="text-info" :title="row.item.userId" v-b-tooltip.bottom>{{
            row.item.eUsername
          }}</span>
        </template>

        <template v-slot:cell(command)="row">
          <span class="text-info">{{ row.item.command }}</span>
        </template>

        <template v-slot:cell(params)="row">
          <span class="text-info">{{ row.item.params }}</span>
        </template>

        <template v-slot:cell(ipadd)="row">
          <span class="text-info">{{ row.item.host }}</span>
        </template>

        <template v-slot:cell(server_hostname)="row">
          <span class="text-info">{{ row.item.serverHostname }}</span>
        </template>

        <template v-slot:cell(login_address)="row">
          <span class="text-info">{{ row.item.loginAddress }}</span>
        </template>

        <template v-slot:cell(client_hostname)="row">
          <span class="text-info">{{ row.item.clientHostname }}</span>
        </template>

        <template v-slot:cell(login_time)="row">
          <span v-if="row.item.loginTime" class="text-info" :title="$moment(row.item.loginTime).calendar()">{{
            $moment(row.item.loginTime).format("DD/MM/Y - hh:mm:s")
          }}</span>
        </template>

        <template v-slot:cell(exec_time)="row">
          <span v-if="row.item.execTimestamp" class="text-info" :title="$moment(row.item.execTimestamp).calendar()">{{
            $moment(row.item.execTimestamp).format("DD/MM/Y - hh:mm:s")
          }}</span>
        </template>

        <template v-slot:cell(size)="row">
          <span class="text-info">{{ row.item.objSize }}</span>
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
      excelLoading: false,
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
      excelFields: {
        Id: "id",
        UserId: "userId",
        User: "loginUser",
        EUserId: "eUserId",
        EUser: "eUser",
        Exe: "command",
        Cmdline: "params",
        Server: "host",
        ServerHostname: "serverHostname",
        Client: "loginAddress",
        ClientHostname: "clientHostname",
        LoginTerminal: "loginTerminal",
        ServiceId: "serviceId",
        Session: "loginTime",
        ReportTime: "reportTime",
        ExecTime: "execTime",
        Ppid: "ppid",
        Pgid: "pgid",
        Psid: "psid",
        Tgid: "tgid",
        Size: "objSize",
      },
      commandActionFields: [
        { key: "login_user", label: "User" },
        { key: "effective_username", label: "EUser" },
        { key: "command", label: "Exe" },
        { key: "params", label: "Cmdline" },
        { key: "ipadd", label: "Server" },
        { key: "server_hostname", label: "Server Hostname" },
        { key: "login_address", label: "Client" },
        { key: "client_hostname", label: "Client Hostname" },
        { key: "login_time", sortable: true, label: "Session Start Time" },
        { key: "exec_time", sortable: true, label: "Exec Time" },
        { key: "size", sortable: true, label: "Size" },
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
    async exportExcel() {
      this.excelLoading = true;
      let excelData = [];
      let externalData = {
        filter: this.commandFilter,
      };

      if (this.dateRangeData != null) {
        externalData.startTime = this.$moment(
          this.dateRangeData.start
        ).valueOf();
        externalData.endTime = this.$moment(this.dateRangeData.end).valueOf();
      }
      let exCommandLogs = await this.$http
        .post("/api/v1/action/list/all/findbyserviceid/" + this.id, externalData)
        .then((response) => {
          if (response.status == 200) {
            let commandlogs = [];
            response.data.forEach((element) => {
              let size = jsonSize(element);
              element.objSize = size;
              commandlogs.push(element);
            });

            return commandlogs;
          }
        })
        .catch((error) => {
          console.log(error);
          return [];
        });

      exCommandLogs.forEach((f) => {
        excelData.push({
          id: f.id,
          userId: f.user,
          loginUser: f.loginUser ? f.loginUser : f.username,
          eUserId: f.userId,
          eUser: f.eUsername,
          command: f.command,
          params: f.params,
          host: f.host,
          serverHostname: f.serverHostname,
          loginAddress: f.loginAddress,
          clientHostname: f.clientHostname,
          loginTerminal: f.loginTerminal,
          serviceId: f.serviceId,
          loginTime: f.loginTime ? this.$moment(f.loginTime).format("hh:mm:s Y/MM/DD") : "",
          reportTime: f.reportTime ? this.$moment(f.reportTime).format("hh:mm:s Y/MM/DD") : "",
          execTime: f.execTimestamp ? this.$moment(f.execTimestamp).format("hh:mm:s Y/MM/DD") : "",
          ppid: f.ppid,
          pgid: f.pgid,
          psid: f.psid,
          tgid: f.tgid,
          objSize: f.objSize,
        });
      });

      this.excelLoading = false;

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
      this.exCommandLogs = [];
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
        .post("/api/v1/action/list/findbyserviceid/" + this.id, externalData)
        .then((response) => {
          if (response.status == 200) {
            this.totalRows = response.data.totalPages;
            response.data.logs.forEach((element) => {
              let size = jsonSize(element);
              element.objSize = size;
              this.exCommandLogs.push(element);
            });

            this.externalCommandLoading = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorStatusCommandAction = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    searchExternalCommandActions() {
      if (this.tempCommandFilter === "") {
        this.clearCommandFilter();
      } else if (
        this.commandFilter === "" ||
        this.tempCommandFilter.toLowerCase() != this.commandFilter.toLowerCase()
      ) {
        this.currentPageExternal = 1;
        this.commandFilter = this.tempCommandFilter.toLowerCase();
        this.externalCommandLoading = true;
        this.getExternalCommandActions();
      }
    },
    clearCommandFilter() {
      if (this.commandFilter === "") {
        this.tempCommandFilter = "";
      } else {
        this.tempCommandFilter = "";
        this.commandFilter = "";
        this.externalCommandLoading = true;
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

    this.updateExternalCommandActions();
  },
};
</script>

<style>
</style>