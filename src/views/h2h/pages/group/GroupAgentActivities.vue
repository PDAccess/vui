<template>
  <p-card>
    <b-tabs content-class="mt-2" pills>
      <b-tab lazy title="Sessions">
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
        <br />
        <b-row class="justify-content-center">
          <p-error
            v-if="errorStatus"
            header="List operation has error!"
            :errorResponse="errorResponse"
            @reload="getExternalCommandLogs"
          />
          <p-loading
            class="my-5"
            message="Loading..."
            v-else-if="loadingCommandLogs"
          />
          <p-initial
            class="my-5"
            v-else-if="sessions.length === 0"
            icon="exclamation-circle"
            header="You don't have any group agent sessions."
            message="Please start an agent session."
          />
          <b-col v-else>
            <b-table
              :fields="sessionActionFields"
              :items="sessions"
              :responsive="responsive"
              hover
              show-empty
              :small="responsive"
            >
              <template v-slot:cell(session_status)="row">
                <i
                  v-if="row.item.session.endTime == null"
                  class="fa fa-play-circle fa-2x"
                  style="color: green"
                  aria-hidden="true"
                ></i>
                <i
                  v-else
                  class="fa fa-stop-circle fa-2x"
                  style="color: red"
                  aria-hidden="true"
                ></i>
              </template>

              <template v-slot:cell(username)="row">
                <span class="text-info">{{
                  row.item.session.username + "@" + row.item.service.name
                }}</span>
              </template>

              <template v-slot:cell(user_id)="row">
                <span class="text-info">{{ row.item.session.userId }}</span>
              </template>

              <template v-slot:cell(e_username)="row">
                <span class="text-info">{{ row.item.session.eUsername }}</span>
              </template>

              <template v-slot:cell(e_user_id)="row">
                <span class="text-info">{{ row.item.session.eUserId }}</span>
              </template>

              <template v-slot:cell(ip_address)="row">
                <span class="text-info">{{ row.item.session.clientIp }}</span>
              </template>

              <template v-slot:cell(session_id)="row">
                <span class="text-info">{{ row.item.session.sessionId }}</span>
              </template>

              <!--
          <template v-slot:cell(service_hostname)="row">
            <span class="text-info">{{ serviceInfo.name }}</span>
          </template>
          -->
              <template v-slot:cell(login_time)="row">
                <span
                  v-if="row.item.session.startTime"
                  class="text-info"
                  :title="$moment(row.item.session.startTime).calendar()"
                  >{{
                    $moment(row.item.session.startTime).format(
                      "DD/MM/YYYY-HH:mm:ss"
                    )
                  }}</span
                >
              </template>

              <template v-slot:cell(logout_time)="row">
                <span
                  v-if="row.item.session.endTime"
                  class="text-info"
                  :title="$moment(row.item.session.endTime).calendar()"
                  >{{
                    $moment(row.item.session.endTime).format(
                      "DD/MM/YYYY-HH:mm:ss"
                    )
                  }}</span
                >
                <span v-else> In-Progress </span>
              </template>

              <template v-slot:cell(action)="row">
                <b-button
                  :to="
                    '/service/agentShellActivities/session/' +
                    row.item.service.inventoryId +
                    '/' +
                    row.item.session.id
                  "
                  variant="primary"
                  class="fa fa-info"
                ></b-button>
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
          </b-col>
        </b-row>
      </b-tab>

      <b-tab lazy title="Authentication Logs">
        <p-error
          v-if="errorStatus"
          header="List operation has error!"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
        <p-loading v-else-if="authLoading" class="my-5" message="Loading..." />
        <div v-else>
          <div v-if="authActions.length === 0">
            <p-initial
              icon="plus-circle"
              header="You don't have any Authentications."
              message="Please start a session."
            />
          </div>
          <div v-else>
            <b-table
              :fields="authActionFields"
              :items="authActions"
              :responsive="responsive"
              hover
              show-empty
            >
              <template v-slot:cell(ip_address)="row">
                <div
                  class="text-danger"
                  :title="row.item.ip_address"
                  v-b-tooltip.bottom
                >
                  {{ row.item.ip_address }}
                </div>
              </template>
              <template v-slot:cell(attemptedAt)="row">
                <p-timing :start-date="row.item.attemptedAt" />
              </template>
              <template v-slot:cell(service)="row">
                <span v-if="row.item.service">
                  {{ row.item.service.name }}
                </span>
              </template>
              <template v-slot:cell(success)="row">
                <b-badge v-if="row.item.success" variant="primary">
                  Success
                </b-badge>
                <b-badge v-else variant="danger"> Failed </b-badge>
              </template>
            </b-table>
            <b-row class="d-flex justify-content-center">
              <b-pagination
                class="mt-4"
                v-model="currentAuthPage"
                :total-rows="totalAuthPages * perAuthPage"
                :per-page="perPage"
                aria-controls="my-table"
              ></b-pagination>
            </b-row>
          </div>
        </div>
      </b-tab>

      <b-tab lazy title="File Logs">
        <b-row>
          <b-col md="12">
            <div class="input-group mb-1">
              <b-form-input
                class="form-control search-input"
                size="lg"
                placeholder="Search Action"
                type="text"
                v-model="tempFileActionFilter"
                @keydown.enter="searchFileActionFilter"
              ></b-form-input>
              <div class="input-group-append">
                <b-button
                  @click="clearFileActionFilter"
                  variant="outline-primary"
                  type="button"
                  >Clear</b-button
                >
              </div>
            </div>
          </b-col>
        </b-row>
        <br />
        <b-row>
          <b-col v-if="errorStatus">
            <p-error
              header="List operation has error!"
              :errorResponse="errorResponse"
              @reload="getExternalFileLogs"
            />
          </b-col>
          <b-col v-else-if="loadingFileLogs">
            <p-loading class="my-5" message="Loading..." />
          </b-col>
          <b-col v-else-if="fileLogs.length === 0">
            <p-initial
              icon="exclamation-circle"
              header="You don't have any agent agent file logs."
              message="Please start an agent file log."
            />
          </b-col>
          <b-col v-else>
            <b-table
              :fields="exFileFields"
              :items="fileLogs"
              hover
              :responsive="responsive"
              :small="responsive"
            >
              <template v-slot:cell(user)="row">
                <span class="text-info">{{ row.item.execFile.user }}</span>
              </template>

              <template v-slot:cell(path)="row">
                <span class="text-info">{{ row.item.execFile.path }}</span>
              </template>

              <template v-slot:cell(file_name)="row">
                <span class="text-info">{{ row.item.execFile.fileName }}</span>
              </template>

              <template v-slot:cell(action)="row">
                <span class="text-info">{{ row.item.execFile.action }}</span>
              </template>

              <template v-slot:cell(service_name)="row">
                <span class="text-info">{{ row.item.serviceName }}</span>
              </template>

              <template v-slot:cell(host)="row">
                <span class="text-info">{{ row.item.execFile.host }}</span>
              </template>

              <template v-slot:cell(exec_time)="row">
                <p-timing
                  v-b-tooltip.lefttop
                  title="Exec and report time"
                  :start-date="row.item.execFile.time"
                  :end-date="row.item.execFile.reportTime"
                />
              </template>
            </b-table>
            <infinite-loading
              @infinite="updateExternalFileTable"
              force-use-infinite-wrapper
            >
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </b-col>
        </b-row>
      </b-tab>
    </b-tabs>
  </p-card>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";
import jsonSize from "@/shared/json-size";
export default {
  props: ["id"],
  components: {
    InfiniteLoading,
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  data() {
    return {
      authLoading: true,
      authActions: [],
      authActionFields: [
        { key: "ipAddress", label: "Ip" },
        { key: "userAgent", label: "User Agent" },
        { key: "attemptedAt", label: "Attempt Time" },
        { key: "success", label: "" },
        { key: "loginType", label: "" },
        { key: "service", label: "Service" },
      ],
      sessions: [],
      commandActionLiveMode: false,
      dateRangeData: {
        start: null,
        end: null,
      },
      totalAuthPages: 0,
      perAuthPage: 15,
      totalRows: 0,
      currentCommandPage: 0,
      currentAuthPage: 1,
      currentFilePage: 0,
      info: {},
      loadingCommandLogs: true,
      loadingAuthLogs: true,
      loadingFileLogs: true,
      perPage: 15,
      tempCommandFilter: "",
      commandFilter: "",
      tempAuthUserFilter: "",
      authUserFilter: "",
      tempFileActionFilter: "",
      fileActionFilter: "",
      sessionActionFields: [
        { key: "session_status", label: "Status" },
        { key: "username", label: "Username" },
        { key: "user_id", label: "User ID" },
        { key: "e_username", label: "Effective User" },
        { key: "e_user_id", label: "Effective User ID" },
        { key: "ip_address", label: "IP Address" },
        //{ key: "service_hostname", label: "Service Hostname" },
        { key: "session_id", label: "Session ID" },
        { key: "login_time", label: "Login Time" },
        { key: "logout_time", label: "Logout Time" },
        { key: "action", label: "" },
      ],
      exCommandFields: [
        { key: "login_user", label: "Login User" },
        { key: "effective_username", label: "Effective Username" },
        { key: "command", label: "Command" },
        { key: "params", label: "Params" },
        { key: "ipadd", label: "Ip Address" },
        { key: "server_hostname", label: "Server Hostname" },
        { key: "login_address", label: "Login Address" },
        { key: "client_hostname", label: "Client Hostname" },
        { key: "service_name", label: "Service Name" },
        { key: "login_time", sortable: true, label: "Login Time" },
        { key: "time", sortable: true, label: "Action Time" },
        { key: "size", sortable: true, label: "" },
      ],
      exAuthFields: [
        { key: "user", label: "User" },
        { key: "tty", label: "Tty" },
        { key: "function", label: "Method" },
        { key: "flags", label: "Flag" },
        { key: "r_user", label: "Remote User" },
        { key: "r_host", label: "Remote Host" },
        { key: "host", label: "Ip Address" },
        { key: "service_name", label: "Service Name" },
        { key: "exec_time", sortable: true, label: "" },
      ],
      exFileFields: [
        { key: "user", label: "User" },
        { key: "path", label: "Path" },
        { key: "file_name", label: "File Name" },
        { key: "action", label: "Action" },
        { key: "host", label: "Ip Address" },
        { key: "service_name", label: "Service Name" },
        { key: "exec_time", sortable: true, label: "" },
      ],
      commandLogs: [],
      authLogs: [],
      fileLogs: [],
      errorStatus: false,
      errorResponse: "",
    };
  },
  watch: {
    tempCommandFilter: function (val) {
      if (val.length >= 3 || val.length == 0) this.searchCommandFilter();
    },
    tempAuthUserFilter: function (val) {
      if (val.length >= 3 || val.length == 0) this.searchAuthUserFilter();
    },
    tempFileActionFilter: function (val) {
      if (val.length >= 3 || val.length == 0) this.searchFileActionFilter();
    },
  },
  methods: {
    getExternalAuthLogs() {
      this.authLoading = true;
      this.authActions = [];

      let dataPolicy = {
      perPage: this.perPage,
      currentPage: this.currentAuthPage - 1,
      sort: "createddesc",
    };

    this.$http
      .post("/api/v1/auths/group/" + this.id, dataPolicy)
      .then((response) => {
        this.totalAuthPages = response.data.totalPages;
        response.data.logs.forEach((f) => {
          this.authActions.push(f);
        });
        this.authLoading = false;
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
          loginTime: f.loginTime
            ? this.$moment(f.loginTime).format("hh:mm:s Y/MM/DD")
            : "",
          time: f.time
            ? this.$moment(f.time * 1000).format("hh:mm:ss Y/MM/DD")
            : "",
          objSize: f.objSize,
        });
      });

      return excelData;
    },
    updateExternalCommandActions() {
      this.currentPageExternal = 1;
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
        externalData.startTime = this.dateRangeData.start
          ? this.$moment(this.dateRangeData.start).valueOf()
          : null;
        externalData.endTime = this.dateRangeData.end
          ? this.$moment(this.dateRangeData.end).valueOf()
          : null;
      }

      this.$http
        .post("/api/v1/shell/action/sessions/group/" + this.id, externalData)
        .then((response) => {
          if (response.status == 200) {
            this.totalRows = response.data.totalPages;
            response.data.logs.forEach((element) => {
              this.sessions.push(element);
            });
            this.loadingCommandLogs = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    getAllExternalCommandActions() {
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
        .post("/api/v1/shell/action/sessions/" + this.id, externalData)
        .then((response) => {
          if (response.status == 200) {
            this.totalRows = response.data.totalPages;
            response.data.logs.forEach((element) => {
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
    getExternalFileLogs() {
      this.loadingFileLogs = true;
      this.currentFilePage = 0;
      let o = {
        perPage: this.perPage,
        currentPage: this.currentFilePage,
        filter: this.fileActionFilter,
      };
      this.$http
        .post("/api/v1/action/file/list/group/" + this.id, o)
        .then((response) => {
          if (response.status == 200) {
            this.currentFilePage += 1;
            this.fileLogs = response.data;
            this.loadingFileLogs = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.loadingFileLogs = false;
          this.errorStatus = true;
          this.errorResponse = error;
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
        this.sessions = [];
        this.currentPageExternal = 1;
        this.getExternalCommandActions();
      }
    },
    searchAuthUserFilter() {
      if (this.tempAuthUserFilter == null) {
        this.clearAuthUserFilter();
      } else if (
        this.authUserFilter == null ||
        this.tempAuthUserFilter.toLowerCase() !=
          this.authUserFilter.toLowerCase()
      ) {
        this.authUserFilter = this.tempAuthUserFilter.toLowerCase();
        this.getExternalAuthLogs();
      }
    },
    searchFileActionFilter() {
      if (this.tempFileActionFilter == null) {
        this.clearFileActionFilter();
      } else if (
        this.fileActionFilter == null ||
        this.tempFileActionFilter.toLowerCase() !=
          this.fileActionFilter.toLowerCase()
      ) {
        this.fileActionFilter = this.tempFileActionFilter.toLowerCase();
        this.getExternalFileLogs();
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
    clearAuthUserFilter() {
      if (this.authUserFilter == null) {
        this.tempAuthUserFilter = null;
      } else {
        this.tempAuthUserFilter = null;
        this.authUserFilter = null;
        this.getExternalAuthLogs();
      }
    },
    clearFileActionFilter() {
      if (this.fileActionFilter == null) {
        this.tempFileActionFilter = null;
      } else {
        this.tempFileActionFilter = null;
        this.fileActionFilter = null;
        this.getExternalFileLogs();
      }
    },

    updateExternalCommandTable($state) {
      let o = {
        perPage: this.perPage,
        currentPage: this.currentCommandPage,
        filter: this.commandFilter,
      };

      if (this.dateRangeData != null) {
        o.startTime = this.$moment(this.dateRangeData.start).valueOf();
        o.endTime = this.$moment(this.dateRangeData.end).valueOf();
      }

      this.$http
        .post("/api/v1/action/list/findbygroupid/" + this.id, o)
        .then((response) => {
          if (response.data.length) {
            this.currentCommandPage += 1;
            response.data.forEach((log) => {
              log.objSize = jsonSize(log);
              this.commandLogs.push(log);
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
    updateExternalFileTable($state) {
      let o = {
        perPage: this.perPage,
        currentPage: this.currentFilePage,
        filter: this.fileActionFilter,
      };

      this.$http
        .post("/api/v1/action/file/list/group/" + this.id, o)
        .then((response) => {
          if (response.data.length) {
            this.currentFilePage += 1;
            response.data.forEach((log) => {
              this.fileLogs.push(log);
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
    this.$http
      .get("/api/v1/group/info/" + this.id)
      .then((response) => {
        this.info = response.data;
        if (this.info.groupCategory == "ldap") {
          this.getLdapSynchronizationLogs();
        }
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
      });

    this.updateExternalCommandActions();
    this.getExternalAuthLogs();
    this.getExternalFileLogs();
  },
};
</script>

<style>
</style>