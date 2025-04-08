<template>
  <p-card>
    <div v-if="errorStatus">
      <p-error
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
    </div>
    <p-loading class="my-5" v-if="agentStatusLoading" message="Loading..." />
    <p-error
      v-else-if="errorStatusFile"
      :header="errorHeader"
      :errorResponse="errorResponse"
      @reload="$router.go()"
    />
    <p-initial
      v-else-if="agentStatusData.length === 0"
      icon="exclamation-circle"
      header="You don't have any service agent file logs."
      message="Please start an agent file log"
    />
    <template v-else>
      <b-table
        :fields="agentStatusFields"
        :items="agentStatusData"
        :responsive="true"
        hover
        show-empty
        :small="responsive"
      >
        <template v-slot:cell(created_at)="row">
          <span class="text-info">{{
            row.item.createdAt | moment("calendar")
          }}</span>
        </template>

        <template v-slot:cell(auth_count)="row">
          <span class="text-info">{{
            row.item.statisticsData.counters.auth_log
          }}</span>
        </template>

        <template v-slot:cell(command_count)="row">
          <span class="text-info">{{
            row.item.statisticsData.counters.command_log
          }}</span>
        </template>

        <template v-slot:cell(file_count)="row">
          <span class="text-info">{{
            row.item.statisticsData.counters.file_log
          }}</span>
        </template>

        <template v-slot:cell(command_filter_count)="row">
          <span class="text-info">{{
            row.item.statisticsData.counters.command_filter_log
          }}</span>
        </template>

        <template v-slot:cell(file_filter_count)="row">
          <span class="text-info">{{
            row.item.statisticsData.counters.file_filter_log
          }}</span>
        </template>

        <template v-slot:cell(db_error)="row">
          <span class="text-info">{{
            row.item.statisticsData.counters.database_error
          }}</span>
        </template>

        <template v-slot:cell(invalid_record)="row">
          <span class="text-info">{{
            row.item.statisticsData.counters.invalid_record
          }}</span>
        </template>

        <template v-slot:cell(channel_error)="row">
          <span class="text-info">{{
            row.item.statisticsData.counters.message_jobs_error
          }}</span>
        </template>

        <template v-slot:cell(server_error)="row">
          <span class="text-info">{{
            row.item.statisticsData.counters.server_error
          }}</span>
        </template>

        <template v-slot:cell(server_success)="row">
          <span class="text-info">{{
            row.item.statisticsData.counters.server_success
          }}</span>
        </template>

        <template v-slot:cell(overall_bypass_count)="row">
          <span class="text-info">{{
            row.item.statisticsData.bypass.bypass_count
          }}</span>
        </template>

        <template v-slot:cell(write_bypass_count)="row">
          <span class="text-info">{{
            row.item.statisticsData.bypass.write_bypass_count
          }}</span>
        </template>

        <template v-slot:cell(overall_bypass)="row">
          <span
            v-if="row.item.statisticsData.bypass.bypass_status"
            class="text-danger"
            >true</span
          >
          <span v-else class="text-success">false</span>
        </template>

        <template v-slot:cell(write_bypass)="row">
          <span
            v-if="row.item.statisticsData.bypass.write_bypass_status"
            class="text-danger"
            >true</span
          >
          <span v-else class="text-success">false</span>
        </template>
      </b-table>
      <b-row class="d-flex justify-content-center">
        <b-pagination
            class="mt-4"
            v-model="currentPageAgentStatus"
            :total-rows="totalRows * perPage"
            :per-page="perPage"
            aria-controls="my-table"
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
      currentPageAuthAction: 0,
      currentPageFileAction: 0,
      currentPageExternal: 1,
      currentPageAgentStatus: 1,
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
        { key: "created_at", sortable: true, label: "#" },
        { key: "auth_count", label: "Auth Count" },
        { key: "command_count", label: "Exec count" },
        { key: "file_count", label: "File Count" },
        { key: "command_filter_count", label: "Filtered Exec count" },
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
    getAgentStatus() {
      this.agentStatusLoading = true;
      this.agentStatusData = [];
      let data = {
        perPage: 20,
        currentPage: this.currentPageAgentStatus - 1,
      };

      this.$http
        .post("/api/v1/action/agent/status/" + this.id, data)
        .then((response) => {
          if (response.status == 200) {
            this.totalRows = response.data.totalPages;
            response.data.logs.forEach((element) => {
              element.statisticsData = JSON.parse(element.statisticsData);
              this.agentStatusData.push(element);
            });
            this.agentStatusLoading = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.agentStatusLoading = false;
          this.errorStatusFile = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
  },
  watch: {
    currentPageAgentStatus: function (value) {
      this.getAgentStatus();
    },
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
    this.getAgentStatus();
  },
};
</script>

<style>
</style>