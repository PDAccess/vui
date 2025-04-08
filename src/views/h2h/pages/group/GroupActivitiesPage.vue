<template>
  <p-card>
    <b-tabs content-class="mt-2" pills>
      <b-tab lazy title="Live Sessions">
        <LiveSessionPage :groupid="id"></LiveSessionPage>
      </b-tab>
      <b-tab lazy title="Agent Commands">
        <b-row>
          <b-col md="12">
            <div class="input-group mb-1">
              <b-form-input
                class="form-control search-input"
                size="lg"
                placeholder="Search Command"
                type="text"
                v-model="tempCommandFilter"
                @keydown.enter="searchCommandFilter"
              ></b-form-input>
              <div class="input-group-append">
                <b-button
                  @click="clearCommandFilter"
                  variant="outline-primary"
                  type="button"
                  >Clear</b-button
                >
              </div>
            </div>
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
            v-else-if="commandLogs.length === 0"
            icon="exclamation-circle"
            header="You don't have any group agent commands."
            message="Please start an agent command."
          />
          <b-col v-else>
            <b-table
              :fields="exCommandFields"
              :items="commandLogs"
              hover
              :responsive="responsive"
              :small="responsive"
            >
              <template v-slot:cell(user)="row">
                <span class="text-info">{{ row.item.execTrace.user }}</span>
              </template>

              <template v-slot:cell(command)="row">
                <span class="text-info">{{ row.item.execTrace.command }}</span>
              </template>

              <template v-slot:cell(params)="row">
                <span class="text-info">{{ row.item.execTrace.params }}</span>
              </template>

              <template v-slot:cell(ipadd)="row">
                <span class="text-info">{{ row.item.execTrace.host }}</span>
              </template>

              <template v-slot:cell(service_name)="row">
                <span class="text-info">{{ row.item.serviceName }}</span>
              </template>

              <template v-slot:cell(time)="row">
                <p-timing
                  :start-date="row.item.execTrace.time * 1000"
                  :end-date="new Date()"
                />
              </template>
            </b-table>
            <infinite-loading
              @infinite="updateExternalCommandTable"
              force-use-infinite-wrapper
            >
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </b-col>
        </b-row>
      </b-tab>
      <b-tab lazy title="Agent Authentication Logs">
        <b-row>
          <b-col md="12">
            <div class="input-group mb-1">
              <b-form-input
                class="form-control search-input"
                size="lg"
                placeholder="Search User"
                type="text"
                v-model="tempAuthUserFilter"
                @keydown.enter="searchAuthUserFilter"
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
        <br />
        <b-row>
          <b-col v-if="errorStatus">
            <p-error
              header="List operation has error!"
              :errorResponse="errorResponse"
              @reload="getExternalAuthLogs"
            />
          </b-col>
          <b-col v-else-if="loadingAuthLogs">
            <p-loading message="Loading..." />
          </b-col>
          <b-col v-else-if="authLogs.length === 0">
            <p-initial
              icon="exclamation-circle"
              header="You don't have any agent authentication logs."
              message="Please start an agent authentication log."
            />
          </b-col>
          <b-col v-else>
            <b-table
              :fields="exAuthFields"
              :items="authLogs"
              hover
              :responsive="responsive"
              :small="responsive"
            >
              <template v-slot:cell(user)="row">
                <span class="text-info">{{ row.item.execAuth.user }}</span>
              </template>

              <template v-slot:cell(tty)="row">
                <span class="text-info">{{ row.item.execAuth.tty }}</span>
              </template>

              <template v-slot:cell(function)="row">
                <span class="text-info">{{ row.item.execAuth.function }}</span>
              </template>

              <template v-slot:cell(flags)="row">
                <span class="text-info">{{ row.item.execAuth.flags }}</span>
              </template>

              <template v-slot:cell(service_name)="row">
                <span class="text-info">{{ row.item.serviceName }}</span>
              </template>

              <template v-slot:cell(r_user)="row">
                <span class="text-info">{{ row.item.execAuth.rUser }}</span>
              </template>

              <template v-slot:cell(r_host)="row">
                <span class="text-info">{{ row.item.execAuth.rHost }}</span>
              </template>

              <template v-slot:cell(host)="row">
                <span class="text-info">{{ row.item.execAuth.host }}</span>
              </template>

              <template v-slot:cell(exec_time)="row">
                <p-timing
                  v-b-tooltip.lefttop
                  title="Exec and report time"
                  :start-date="row.item.execAuth.time"
                  :end-date="row.item.execAuth.reportTime"
                />
              </template>
            </b-table>
            <infinite-loading
              @infinite="updateExternalAuthTable"
              force-use-infinite-wrapper
            >
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </b-col>
        </b-row>
      </b-tab>
      <b-tab lazy title="Agent File Logs">
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
      <b-tab lazy title="Break the Glass">
        <BreakTheGlassListComp :groupid="id"></BreakTheGlassListComp>
      </b-tab>
      <b-tab v-if="info.groupCategory == 'ldap'" title="LDAP Synchronizations">
        <b-row>
          <b-col md="12">
            <div class="input-group mb-1">
              <b-form-input
                class="form-control search-input"
                size="lg"
                placeholder="Search LDAP User"
                type="text"
                v-model="tempLdapFilter"
                @keydown.enter="searchLdapFilter"
              ></b-form-input>
              <div class="input-group-append">
                <b-button
                  @click="clearLdapFilter"
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
              @reload="getLdapSynchronizationLogs"
            />
          </b-col>
          <b-col v-if="loadingLdapSynchronizationLogs">
            <p-loading class="my-5" message="Loading..." />
          </b-col>
          <b-col v-else-if="ldapSynchronizationLogs.length === 0">
            <p-initial
              icon="exclamation-circle"
              header="You don't have any LDAP Synchronization logs."
              message="Please start a LDAP Synchronization."
            />
          </b-col>
          <b-col v-else>
            <b-table
              :fields="ldapSynchronizationLogFields"
              :items="ldapSynchronizationLogs"
              hover
              :responsive="responsive"
              :small="responsive"
            >
              <template v-slot:cell(created_users)="row">
                <span
                  class="text-danger"
                  v-if="row.item.createdUsers.length == 0"
                  >No user</span
                >
                <b-badge
                  v-else
                  class="mr-1"
                  variant="success"
                  :key="user"
                  v-for="user in row.item.createdUsers.split(',')"
                  >{{ user }}</b-badge
                >
              </template>

              <template v-slot:cell(added_users)="row">
                <span class="text-danger" v-if="row.item.addedUsers.length == 0"
                  >No user</span
                >
                <b-badge
                  v-else
                  class="mr-1"
                  variant="primary"
                  :key="user"
                  v-for="user in row.item.addedUsers.split(',')"
                  >{{ user }}</b-badge
                >
              </template>

              <template v-slot:cell(deleted_users)="row">
                <span
                  class="text-danger"
                  v-if="row.item.deletedUsers.length === 0"
                  >No user</span
                >
                <b-badge
                  v-else
                  class="mr-1"
                  variant="danger"
                  :key="user"
                  v-for="user in row.item.deletedUsers.split(',')"
                  >{{ user }}</b-badge
                >
              </template>

              <template v-slot:cell(created_at)="row">
                <p-timing
                  :start-date="row.item.createdAt"
                  :end-date="row.item.execTrace.time * 1000"
                />
              </template>
            </b-table>
            <infinite-loading
              @infinite="updateLdapSynchronizationLogsTable"
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
import LiveSessionPage from "../activity/LiveSessionsPage";
import BreakTheGlassListComp from "@/views/h2h/components/BreakTheGlassListComp";

export default {
  props: ["id"],
  components: {
    InfiniteLoading,
    LiveSessionPage,
    BreakTheGlassListComp,
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  data() {
    return {
      info: {},
      currentCommandPage: 0,
      currentAuthPage: 0,
      currentFilePage: 0,
      currentLdapLogPage: 0,
      perPage: 15,
      loadingCommandLogs: true,
      loadingAuthLogs: true,
      loadingFileLogs: true,
      loadingLdapSynchronizationLogs: true,
      tempCommandFilter: "",
      tempLdapFilter: "",
      commandFilter: "",
      tempAuthUserFilter: "",
      authUserFilter: "",
      tempFileActionFilter: "",
      fileActionFilter: "",
      ldapUserFilter: "",
      exCommandFields: [
        { key: "user", label: "User" },
        { key: "command", label: "Command" },
        { key: "params", label: "Params" },
        { key: "ipadd", label: "Ip Address" },
        { key: "service_name", label: "Service Name" },
        { key: "time", sortable: true, label: "" },
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
      ldapSynchronizationLogFields: [
        { key: "created_users", label: "Created Users" },
        { key: "added_users", label: "Added Members" },
        { key: "deleted_users", label: "Delete Members" },
        { key: "created_at", label: "" },
      ],
      commandLogs: [],
      authLogs: [],
      fileLogs: [],
      ldapSynchronizationLogs: [],
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
    tempLdapFilter: function (val) {
      if (val.length >= 3 || val.length == 0) this.searchLdapFilter();
    },
  },
  methods: {
    getExternalCommandLogs() {
      this.loadingCommandLogs = true;
      this.currentCommandPage = 0;
      let o = {
        perPage: this.perPage,
        currentPage: this.currentCommandPage,
        filter: this.commandFilter,
      };
      this.$http
        .post("/api/v1/action/list/findbygroupid/" + this.id, o)
        .then((response) => {
          if (response.status == 200) {
            this.currentCommandPage += 1;
            this.commandLogs = response.data;
            this.loadingCommandLogs = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.loadingCommandLogs = false;
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    getExternalAuthLogs() {
      this.loadingAuthLogs = true;
      this.currentAuthPage = 0;
      let o = {
        perPage: this.perPage,
        currentPage: this.currentAuthPage,
        filter: this.authUserFilter,
      };
      this.$http
        .post("/api/v1/action/auth/list/group/" + this.id, o)
        .then((response) => {
          if (response.status == 200) {
            this.currentAuthPage += 1;
            this.authLogs = response.data;
            this.loadingAuthLogs = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.loadingAuthLogs = false;
          this.errorStatus = true;
          this.errorResponse = error;
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
    getLdapSynchronizationLogs() {
      this.loadingLdapSynchronizationLogs = true;
      this.currentLdapLogPage = 0;
      let o = {
        perPage: this.perPage,
        currentPage: this.currentLdapLogPage,
        filter: this.ldapUserFilter,
      };
      this.$http
        .post("/api/v1/group/ldap/logs/" + this.id, o)
        .then((response) => {
          if (response.status == 200) {
            this.currentLdapLogPage += 1;
            this.ldapSynchronizationLogs = response.data;
            this.loadingLdapSynchronizationLogs = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.loadingLdapSynchronizationLogs = false;
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    searchCommandFilter() {
      if (this.tempCommandFilter == null) {
        this.clearCommandFilter();
      } else if (
        this.commandFilter == null ||
        this.tempCommandFilter.toLowerCase() != this.commandFilter.toLowerCase()
      ) {
        this.commandFilter = this.tempCommandFilter.toLowerCase();
        this.getExternalCommandLogs();
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
    searchLdapFilter() {
      if (this.tempLdapFilter == null) {
        this.clearLdapFilter();
      } else if (
        this.ldapUserFilter == null ||
        this.tempLdapFilter.toLowerCase() != this.ldapUserFilter.toLowerCase()
      ) {
        this.ldapUserFilter = this.tempLdapFilter.toLowerCase();
        this.getLdapSynchronizationLogs();
      }
    },
    clearCommandFilter() {
      if (this.commandFilter == null) {
        this.tempCommandFilter = null;
      } else {
        this.tempCommandFilter = null;
        this.commandFilter = null;
        this.getExternalCommandLogs();
      }
    },
    clearLdapFilter() {
      if (this.ldapUserFilter == null) {
        this.tempLdapFilter = null;
      } else {
        this.tempLdapFilter = null;
        this.ldapUserFilter = null;
        this.getLdapSynchronizationLogs();
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
    updateLdapSynchronizationLogsTable($state) {
      let o = {
        perPage: this.perPage,
        currentPage: this.currentLdapLogPage,
        filter: this.ldapUserFilter,
      };

      this.$http
        .post("/api/v1/group/ldap/logs/" + this.id, o)
        .then((response) => {
          if (response.data.length) {
            this.currentLdapLogPage += 1;
            response.data.forEach((log) => {
              this.ldapSynchronizationLogs.push(log);
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
    updateExternalCommandTable($state) {
      let o = {
        perPage: this.perPage,
        currentPage: this.currentCommandPage,
        filter: this.commandFilter,
      };

      this.$http
        .post("/api/v1/action/list/findbygroupid/" + this.id, o)
        .then((response) => {
          if (response.data.length) {
            this.currentCommandPage += 1;
            response.data.forEach((log) => {
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
    updateExternalAuthTable($state) {
      let o = {
        perPage: this.perPage,
        currentPage: this.currentAuthPage,
        filter: this.authUserFilter,
      };

      this.$http
        .post("/api/v1/action/auth/list/group/" + this.id, o)
        .then((response) => {
          if (response.data.length) {
            this.currentAuthPage += 1;
            response.data.forEach((log) => {
              this.authLogs.push(log);
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

    this.getExternalCommandLogs();
    this.getExternalAuthLogs();
    this.getExternalFileLogs();
  },
};
</script>
