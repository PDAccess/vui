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
              title='Command Exec Time'
            />
          </b-col>
          <b-col cols="1" sm="1" class="d-flex justify-content-center">
            <download-excel
              :fetch="exportExcel"
              name="actions.xls"
              :fields="excelField"
              style="width: 100%; height: 100%"
            >
              <b-button
                variant="outline-primary"
                style="width: 100%; height: 90%"
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
      v-if="isLoading"
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

        <template v-slot:cell(exec_time)="row">
          <span class="text-info">{{ row.item.execTime ? $moment.unix(row.item.execTime / 1000000000).format('DD/MM/YYYY-HH:mm:ss.SSS') : '' }}</span>
        </template>

        <template v-slot:cell(std_out)="row">
          <p style="max-width: 50vw" class="text-info">{{ row.item.stdOut }}</p>
        </template>

        <template v-slot:cell(exec_command)="row">
          <p style="max-width: 15vw" class="text-info">{{ row.item.execCommand }}</p>
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
  props: ["id", "sessionId"],
  components: {
    mappage,
    InfiniteLoading,
    downloadExcel,
  },
  data() {
    return {
      sessionInfo: {},
      sessionInfoLoading: true,
      excelLoading: false,
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
        Id: "id",
        SessionId: "sessionId",
        Username: "username",
        UserId: "userId",
        EUsername: "eUsername",
        EUserId: "eUserId",
        ClientIp: "clientIp",
        ExecTime: "execTime",
        stdOut: "stdOut",
        ExecCommand: "execCommand",
        ServiceId: "serviceId",
        ServiceIp: "serviceIp",
        ServiceHostname: "serviceHostname",
        Size: "objSize",
      },
      commandActionFields: [
        { key: "exec_time", label: "Execute Time" },
        { key: "std_out", label: "Command Output" },
        { key: "exec_command", label: "Execute Command" },
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
    isLoading() {
      return this.externalCommandLoading || this.sessionInfoLoading;
    }
  },
  methods: {
    getValue(object, key) {
      if (object != null && object[key]) {
        return object[key]
      }

      return "";
    },
    getSessionInfo() {
      this.$http
        .get(`/api/v1/shell/action/session/${this.sessionId}`)
        .then((response) => {
          this.sessionInfo = response.data;
          this.sessionInfoLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    updateLiveDate() {
      let nowDate = new Date();
      let beforeDate = new Date(nowDate);
      beforeDate.setHours(nowDate.getHours() - 3);
      this.dateRangeData.start = beforeDate;
      this.dateRangeData.end = nowDate;
    },
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
        .post("/api/v1/shell/action/all/session/" + this.sessionId, externalData)
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
          sessionId: f.sessionId,
          username: this.getValue(this.sessionInfo.session, "username"),
          userId: this.getValue(this.sessionInfo.session, "userId"),
          eUsername: this.getValue(this.sessionInfo.session, "eUsername"),
          eUserId: this.getValue(this.sessionInfo.session, "eUserId"),
          clientIp: this.getValue(this.sessionInfo.session, "clientIp"),
          execTime: f.execTime ? this.$moment.unix(f.execTime/1000000000).format('MMMM Do YYYY, h:mm:ss a') : "",
          stdOut: f.stdOut,
          execCommand: f.execCommand,
          serviceId: f.serviceId,
          serviceIp: this.getValue(this.sessionInfo.service, "ipAddress"),
          serviceHostname: this.getValue(this.sessionInfo.service, "name"),
          objSize: f.objSize
        });
      });

      this.excelLoading = false;

      return excelData;
    },
    updateExternalCommandActions() {
      this.currentPageExternal = 1;
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
        externalData.startTime = this.dateRangeData.start
          ? this.$moment(this.dateRangeData.start).valueOf()
          : null;
        externalData.endTime = this.dateRangeData.end
          ? this.$moment(this.dateRangeData.end).valueOf()
          : null;
      }

      this.$http
        .post("/api/v1/shell/action/session/" + this.sessionId, externalData)
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
    updateExternalCommandActions() {
      this.currentPageExternal = 1;
      this.sessions = [];
      this.getExternalCommandActions();
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
        this.updateLiveDate();
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
    this.getSessionInfo();
    this.updateExternalCommandActions();
  },
};
</script>

<style>
</style>