<template>
  <p-card>
    <div v-if="errorStatus">
      <p-error
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
    </div>
    <b-tabs v-else content-class="mt-2" pills>
      <b-tab active title="Live Sessions">
        <ServiceLiveSessionPage :serviceid="id"> </ServiceLiveSessionPage>
      </b-tab>
      <b-tab @click="getSessions" title="Sessions">
        <p-loading class="my-5" v-if="loading" message="Loading..." />
        <p-error
          v-else-if="errorStatusSession"
          :header="errorHeader"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
        <p-initial
          v-else-if="sessions.length === 0"
          icon="exclamation-circle"
          header="You don't have any sessions."
          message="Please start a session."
        />
        <template v-else>
          <b-table
            :fields="sessionfields"
            :items="sessions"
            :responsive="responsive"
            hover
            show-empty
            small
          >
            <template v-slot:cell(username)="data">
              <b-button
                @click.stop="userDetailPageSession(data.item)"
                variant="link"
                class="profile-button"
              >
                <p-profile-avatar
                  :rounded="false"
                  :size="30"
                  :profile-username="data.item.userEntity.username"
                  :username="
                    data.item.userEntity.first_name +
                    ' ' +
                    data.item.userEntity.last_name
                  "
                  image-width="30px"
                  image-height="auto"
                  v-if="data.item.userEntity"
                ></p-profile-avatar>
              </b-button>
            </template>

            <template v-slot:cell(actions)="data">
              <b-button
                @click.stop="details(data.item)"
                title="Details"
                type="button"
                variant="outline-primary"
                v-b-tooltip.bottom
              >
                <em class="fa fa-info"></em>
              </b-button>
            </template>

            <template v-slot:cell(duration)="data">
              <p-timing
                :start-date="data.item.start_time"
                :end-date="data.item.end_time || new Date()"
              />
            </template>
          </b-table>
          <infinite-loading
            @infinite="infiniteHandlerSession"
            force-use-infinite-wrapper
          >
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </infinite-loading>
        </template>
      </b-tab>
      <b-tab @click="getActions" title="Actions">
        <p-loading class="my-5" v-if="actionLoading" message="Loading..." />
        <p-error
          v-else-if="errorStatusAction"
          :header="errorHeader"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
        <p-initial
          v-else-if="actions.length === 0"
          icon="exclamation-circle"
          header="You don't have any service actions."
          message="Please start an action."
        />
        <template v-else>
          <b-table
            :fields="actionfields"
            :items="actions"
            :responsive="responsive"
            hover
            show-empty
            small
          >
            <template v-slot:cell(username)="row">
              <b-button
                @click="userDetailPageAction(row.item)"
                variant="link"
                class="profile-button"
              >
                <p-profile-avatar
                  :rounded="false"
                  :size="30"
                  :username="
                    row.item.sessionEntity.first_name +
                    ' ' +
                    row.item.sessionEntity.last_name
                  "
                  color="#fff"
                  image-width="30px"
                  image-height="auto"
                  :profile-username="row.item.sessionEntity.username"
                ></p-profile-avatar>
              </b-button>
            </template>

            <template v-slot:cell(actionTime)="row">
              <p-timing
                :start-date="row.item.sessionEntity.startTime"
                :end-date="row.item.id.actionTime || new Date()"
              />
            </template>

            <template v-slot:cell(proxy_action)="row">
              <span class="text-danger">{{ row.item.proxy_action }}</span>
            </template>
          </b-table>
          <infinite-loading
            @infinite="infiniteHandlerAction"
            force-use-infinite-wrapper
          >
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </infinite-loading>
        </template>
      </b-tab>
      <b-tab @click="getExternalCommandActions" title="Agent Commands">
        <b-row>
          <b-col>
            <b-row>
              <b-col cols="2" sm="1" class="refresh-container">
                <b-button
                  @click="commandActionLiveMode = !commandActionLiveMode"
                  style="width: 100%; font-size: 1.3rem"
                  :variant="
                    commandActionLiveMode ? 'primary' : 'outline-primary'
                  "
                  :title="
                    commandActionLiveMode
                      ? 'Disable Live Mode'
                      : 'Enable Live Mode'
                  "
                  v-b-tooltip.bottom
                >
                  <i class="fa fa-refresh" aria-hidden="true"></i>
                </b-button>
              </b-col>
              <b-col cols="10" sm="11" class="search-container">
                <div class="input-group mb-1">
                  <b-form-input
                    class="form-control search-input"
                    size="lg"
                    placeholder="Search Command"
                    type="text"
                    v-model="tempCommandFilter"
                    @keydown.enter="searchExternalCommandActions"
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
            <template v-slot:cell(user)="row">
              <span class="text-info">{{ row.item.user }}</span>
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

            <template v-slot:cell(time)="row">
              <p-timing
                :start-date="row.item.time * 1000"
                :end-date="new Date()"
              />
            </template>
          </b-table>
          <infinite-loading
            @infinite="infiniteHandlerExCommand"
            force-use-infinite-wrapper
          >
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </infinite-loading>
        </template>
      </b-tab>
      <b-tab @click="getExternalAuthActions" title="Agent Authentication Logs">
        <b-row>
          <b-col>
            <b-row>
              <b-col cols="2" sm="1" class="refresh-container">
                <b-button
                  @click="authActionLiveMode = !authActionLiveMode"
                  style="width: 100%; font-size: 1.3rem"
                  :variant="authActionLiveMode ? 'primary' : 'outline-primary'"
                  :title="
                    authActionLiveMode
                      ? 'Disable Live Mode'
                      : 'Enable Live Mode'
                  "
                  v-b-tooltip.bottom
                >
                  <i class="fa fa-refresh" aria-hidden="true"></i>
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
        <p-loading
          class="my-5"
          v-if="externalAuthloading"
          message="Loading..."
        />
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
          <infinite-loading
            @infinite="infiniteHandlerExAuth"
            force-use-infinite-wrapper
          >
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </infinite-loading>
        </template>
      </b-tab>
      <b-tab @click="getExternalFileActions" title="Agent File Logs">
        <b-row>
          <b-col>
            <b-row>
              <b-col cols="2" sm="1" class="refresh-container">
                <b-button
                  @click="fileActionLiveMode = !fileActionLiveMode"
                  style="width: 100%; font-size: 1.3rem"
                  :variant="fileActionLiveMode ? 'primary' : 'outline-primary'"
                  :title="
                    fileActionLiveMode
                      ? 'Disable Live Mode'
                      : 'Enable Live Mode'
                  "
                  v-b-tooltip.bottom
                >
                  <i class="fa fa-refresh" aria-hidden="true"></i>
                </b-button>
              </b-col>
              <b-col cols="10" sm="11" class="search-container">
                <div class="input-group mb-1">
                  <b-form-input
                    class="form-control search-input"
                    size="lg"
                    placeholder="Search Action"
                    type="text"
                    v-model="tempFileActionFilter"
                    @keydown.enter="searchExternalFileActions"
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
          </b-col>
        </b-row>
        <br />
        <p-loading
          class="my-5"
          v-if="externalFileloading"
          message="Loading..."
        />
        <p-error
          v-else-if="errorStatusFile"
          :header="errorHeader"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
        <p-initial
          v-else-if="exFileLogs.length === 0"
          icon="exclamation-circle"
          header="You don't have any service agent file logs."
          message="Please start an agent file log"
        />
        <template v-else>
          <b-table
            :fields="fileActionFields"
            :items="exFileLogs"
            :responsive="responsive"
            hover
            show-empty
            :small="responsive"
          >
            <template v-slot:cell(user)="row">
              <span class="text-info">{{ row.item.user }}</span>
            </template>

            <template v-slot:cell(path)="row">
              <span class="text-info">{{ row.item.path }}</span>
            </template>

            <template v-slot:cell(file_name)="row">
              <span class="text-info">{{ row.item.fileName }}</span>
            </template>

            <template v-slot:cell(action)="row">
              <span class="text-info">{{ row.item.action }}</span>
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
          <infinite-loading
            @infinite="infiniteHandlerExFile"
            force-use-infinite-wrapper
          >
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </infinite-loading>
        </template>
      </b-tab>
      <b-tab lazy title="Break the Glass">
        <ServiceBreakTheGlassListComp
          :serviceid="id"
        ></ServiceBreakTheGlassListComp>
      </b-tab>
      <b-tab lazy title="Map" v-if="info.mapx !== 0 && info.mapy !== null">
        <b-row>
          <b-col md="10" offset-md="1">
            <div>
              <h6>X:{{ info.mapx }} Y:{{ info.mapy }}</h6>
            </div>
            <div class="card" style="height: 25rem">
              <mappage
                :draggable="false"
                :x="info.mapx"
                :y="info.mapy"
              ></mappage>
            </div>
          </b-col>
        </b-row>
      </b-tab>
      <b-tab @click="getCredantials" title="Credantials">
        <p-loading
          class="my-5"
          v-if="credantialHistoryLoading"
          message="Loading..."
        />
        <p-error
          v-else-if="errorStatusCredantial"
          :header="errorHeader"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
        <p-initial
          v-else-if="credantialHistory.length === 0"
          icon="folder-plus"
          header="You don't have any service credentials."
          message="Please create a credentials"
        />
        <template v-else>
          <b-table
            :fields="credantialsFields"
            :items="credantialHistory"
            :responsive="responsive"
            hover
            show-empty
            small
          >
            <template v-slot:cell(result)="row">
              <b-badge :variant="row.item.result ? 'success' : 'danger'">{{
                row.item.result
              }}</b-badge>
            </template>

            <template v-slot:cell(endAt)="row">
              <p-timing
                :start-date="row.item.startAt"
                :end-date="row.item.endAt || new Date()"
              />
            </template>
          </b-table>
        </template>
      </b-tab>
    </b-tabs>
  </p-card>
</template>
<script>
import mappage from "@/views/h2h/components/mappage";
import InfiniteLoading from "vue-infinite-loading";
import ServiceLiveSessionPage from "@/views/h2h/pages/service/ServiceLiveSessionsPage";
import ServiceBreakTheGlassListComp from "@/views/h2h/pages/service/ServiceBreakTheGlassListComp";
import { mapGetters } from "vuex";

export default {
  name: "app",
  props: ["id"],
  components: {
    mappage,
    InfiniteLoading,
    ServiceLiveSessionPage,
    ServiceBreakTheGlassListComp,
  },
  data() {
    return {
      errorStatus: false,
      errorStatusSession: false,
      errorStatusAction: false,
      errorStatusFile: false,
      errorStatusCommandAction: false,
      errorStatusAuth: false,
      errorStatusCredantial: false,
      errorHeader: "",
      errorResponse: "",
      externalCommandLoading: true,
      externalAuthloading: true,
      externalFileloading: true,
      credantialHistoryLoading: true,
      actionLoading: true,
      loading: true,
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
      favorite: false,
      userid: "",
      start: new Date(2018, 1, 1),
      end: new Date(),
      perPage: 20,
      currentPageAction: 0,
      currentPageAuthAction: 0,
      currentPageFileAction: 0,
      currentPageSession: 0,
      currentPageExternal: 0,
      currentPageCredantials: 0,
      info: {
        name: "",
      },
      filter: this.$route.params.id,
      users: [],
      sessions: [],
      actions: [],
      actionfields: [
        { key: "username", label: "User" },
        { key: "proxy_action", label: "Action" },
        { key: "actionTime", sortable: true, label: "" },
      ],
      credantialsFields: [
        { key: "result", label: "Result" },
        { key: "endAt", sortable: true, label: "" },
        { key: "description", label: "Message" },
      ],
      sessionfields: [
        { key: "username", label: "User" },
        { key: "ipAddress", label: "Ip Address" },
        { key: "duration", label: "" },
        { key: "actions", label: "" },
      ],
      commandActionFields: [
        { key: "user", label: "User" },
        { key: "command", label: "Command" },
        { key: "params", label: "Params" },
        { key: "ipadd", label: "Ip Address" },
        { key: "time", sortable: true, label: "" },
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
    details(item) {
      this.$http
        .get("/api/v1/session/actions/" + item.sessionId)
        .then((response) => {
          if (response.status == 200) {
            if (this.actions.length == 0) {
              this.$bvToast.toast(`There is no action on this session!`, {
                title: "Service Notification",
                variant: "warning",
                solid: true,
                autoHideDelay: 5000,
              });
            } else {
              this.$router.push({
                name: "Session Detail",
                params: {
                  id: item.sessionId,
                },
              });
            }
          }
        })
        .catch(function (error) {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    infiniteHandlerSession($state) {
      let pagination = {
        perPage: 20,
        currentPage: this.currentPageSession,
      };
      let serviceids = [this.id];

      let data = {
        pagination: pagination,
        serviceids: serviceids,
      };

      this.$http
        .post("/api/v1/session/filter", data)
        .then((response) => {
          if (response.data.sessionEntities.length) {
            this.currentPageSession += 1;
            response.data.sessionEntities.forEach((f) => {
              this.sessions.push(f);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorStatusSession = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    infiniteHandlerAction($state) {
      let data = {
        perPage: 20,
        currentPage: this.currentPageAction,
      };

      this.$http
        .post("/api/v1/action/service/" + this.id, data)
        .then((response) => {
          if (response.data.length) {
            this.currentPageAction += 1;
            response.data.forEach((f) => {
              this.actions.push(f);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorStatusAction = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    userDetailPageAction(item) {
      this.$router.push({
        name: "User Detail",
        params: { id: item.sessionEntity.userEntity.userId },
      });
    },
    userDetailPageSession(item) {
      this.$router.push({
        name: "User Detail",
        params: { id: item.userEntity.userId },
      });
    },
    infiniteHandlerExCommand($state) {
      let externalData = {
        perPage: 20,
        currentPage: this.currentPageExternal,
        filter: this.commandFilter,
      };

      this.$http
        .post("/api/v1/action/list/findbyserviceid/" + this.id, externalData)
        .then((response) => {
          if (response.data.length) {
            this.currentPageExternal += 1;
            response.data.forEach((element) => {
              this.exCommandLogs.push(element);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorStatusCommandAction = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    infiniteHandlerExAuth($state) {
      let externalData = {
        perPage: 20,
        currentPage: this.currentPageAuthAction,
        filter: this.authUserFilter,
      };

      this.$http
        .post("/api/v1/action/auth/list/service/" + this.id, externalData)
        .then((response) => {
          if (response.data.length) {
            this.currentPageAuthAction += 1;
            response.data.forEach((element) => {
              this.exAuthLogs.push(element);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorStatusAuth = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    infiniteHandlerExFile($state) {
      let externalData = {
        perPage: 20,
        currentPage: this.currentPageFileAction,
        filter: this.fileActionFilter,
      };

      this.$http
        .post("/api/v1/action/file/list/service/" + this.id, externalData)
        .then((response) => {
          if (response.data.length) {
            this.currentPageFileAction += 1;
            response.data.forEach((element) => {
              this.exFileLogs.push(element);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorStatusFile = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    updateExternalCommandActions() {
      this.currentPageExternal = 0;
      this.getExternalCommandActions();
    },
    updateExternalAuthActions() {
      this.currentPageAuthAction = 0;
      this.getExternalAuthActions();
    },
    updateExternalFileActions() {
      this.currentPageFileAction = 0;
      this.getExternalFileActions();
    },
    getExternalCommandActions() {
      let externalData = {
        perPage: 20,
        currentPage: this.currentPageExternal,
        filter: this.commandFilter,
      };

      this.$http
        .post("/api/v1/action/list/findbyserviceid/" + this.id, externalData)
        .then((response) => {
          if (response.status == 200) {
            this.currentPageExternal += 1;
            this.exCommandLogs = response.data;
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
    getSessions() {
      let pagination = {
        perPage: 20,
        currentPage: this.currentPageSession,
      };
      let serviceids = [this.id];

      let data = {
        pagination: pagination,
        serviceids: serviceids,
      };

      this.$http
        .post("/api/v1/session/filter", data)
        .then((response) => {
          this.currentPageSession += 1;
          response.data.sessionEntities.forEach((f) => {
            this.sessions.push(f);
          });
        })
        .catch((error) => {
          console.log(error);
          this.errorStatusSession = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });

      this.$http
        .get("/api/v1/session/session/" + this.id)
        .then((response) => {
          this.sessions = response.data;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.errorStatusSession = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    getExternalAuthActions() {
      let externalData = {
        perPage: 20,
        currentPage: this.currentPageAuthAction,
        filter: this.authUserFilter,
      };

      this.$http
        .post("/api/v1/action/auth/list/service/" + this.id, externalData)
        .then((response) => {
          if (response.status == 200) {
            this.currentPageAuthAction += 1;
            this.exAuthLogs = response.data;
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
    getExternalFileActions() {
      let externalData = {
        perPage: 20,
        currentPage: this.currentPageFileAction,
        filter: this.fileActionFilter,
      };

      this.$http
        .post("/api/v1/action/file/list/service/" + this.id, externalData)
        .then((response) => {
          if (response.status == 200) {
            this.currentPageFileAction += 1;
            this.exFileLogs = response.data;
            this.externalFileloading = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.externalFileloading = false;
          this.errorStatusFile = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    getActions() {
      let data2 = {
        perPage: 20,
        currentPage: this.currentPageAction,
      };

      this.$http
        .post("/api/v1/action/service/" + this.id, data2)
        .then((response) => {
          this.currentPageAction += 1;
          response.data.forEach((f) => {
            this.actions.push(f);
          });
          this.actionLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.actionLoading = false;
          this.errorStatusAction = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    getCredantials() {
      let serviceids = [this.id];
      this.$http
        .get("/api/v1/auto/credential/history/" + serviceids)
        .then((response) => {
          this.credantialHistory = response.data;
          this.credantialHistoryLoading = false;
          console.log(this.credantialHistory);
        })
        .catch((error) => {
          console.log(error);
          this.credantialHistoryLoading = false;
          this.errorStatusCredantial = true;
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
        this.currentPageExternal = 0;
        this.externalCommandLoading = true;
        this.getExternalCommandActions();
      }
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
        this.currentPageAuthAction = 0;
        this.externalAuthloading = true;
        this.getExternalAuthActions();
      }
    },
    searchExternalFileActions() {
      if (this.tempFileActionFilter == null) {
        this.clearFileActionFilter();
      } else if (
        this.fileActionFilter == null ||
        this.tempFileActionFilter.toLowerCase() !=
          this.fileActionFilter.toLowerCase()
      ) {
        this.fileActionFilter = this.tempFileActionFilter.toLowerCase();
        this.currentPageFileAction = 0;
        this.externalFileloading = true;
        this.getExternalFileActions();
      }
    },
    clearCommandFilter() {
      if (this.commandFilter == null) {
        this.tempCommandFilter = null;
      } else {
        this.tempCommandFilter = null;
        this.commandFilter = null;
        this.currentPageExternal = 0;
        this.externalCommandLoading = true;
        this.getExternalCommandActions();
      }
    },
    clearAuthUserFilter() {
      if (this.authUserFilter == null) {
        this.tempAuthUserFilter = null;
      } else {
        this.tempAuthUserFilter = null;
        this.authUserFilter = null;
        this.currentPageAuthAction = 0;
        this.externalCommandLoading = true;
        this.getExternalAuthActions();
      }
    },
    clearFileActionFilter() {
      if (this.fileActionFilter == null) {
        this.tempFileActionFilter = null;
      } else {
        this.tempFileActionFilter = null;
        this.fileActionFilter = null;
        this.currentPageFileAction = 0;
        this.externalFileloading = true;
        this.getExternalFileActions();
      }
    },
  },
  watch: {
    tempCommandFilter: function (val) {
      if (val.length >= 3 || val.length == 0)
        this.searchExternalCommandActions();
    },
    tempAuthUserFilter: function (val) {
      if (val.length >= 3 || val.length == 0) this.searchExternalAuthActions();
    },
    tempFileActionFilter: function (val) {
      if (val.length >= 3 || val.length == 0) this.searchExternalFileActions();
    },
    sessions(val) {
      val.forEach((element) => {
        element.startTime = this.$moment(element.startTime).format(
          "YYYY/M/D HH:mm"
        );
      });
    },
    actions(val) {
      val.forEach((element) => {
        element.actionTime = this.$moment(element.actionTime).format(
          "YYYY/M/D HH:mm"
        );
        element.sessionEntity.startTime = this.$moment(
          element.sessionEntity.startTime
        ).format("YYYY/M/D HH:mm");
      });
    },
    commandActionLiveMode(value) {
      if (value) {
        this.exCommandActionLive = setInterval(
          this.updateExternalCommandActions,
          5000
        );
      } else {
        clearInterval(this.exCommandActionLive);
      }
    },
    authActionLiveMode(value) {
      if (value) {
        this.exAuthActionLive = setInterval(
          this.updateExternalAuthActions,
          5000
        );
      } else {
        clearInterval(this.exAuthActionLive);
      }
    },
    fileActionLiveMode(value) {
      if (value) {
        this.exFileActionLive = setInterval(
          this.updateExternalFileActions,
          5000
        );
      } else {
        clearInterval(this.exFileActionLive);
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.exCommandActionLive);
    clearInterval(this.exAuthActionLive);
    clearInterval(this.exFileActionLive);
  },
  created() {
    this.$http
      .get("/api/v1/service/id/" + this.id)
      .then((response) => {
        this.info = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

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
  },
};
</script>

<style scoped>
.tab-content .tab-pane {
  padding-top: 1rem;
  padding-right: 0rem;
  padding-bottom: 1rem;
  padding-left: 0rem;
}

.scrollperfect {
  position: relative;
  margin: auto;
  height: auto;
}

.inventory-logo {
  width: 40px;
  height: 30px;
}

.dropdownClass {
  white-space: nowrap;
  width: 100%;
}

.inputform {
  background-color: white;
  height: 40px;
}

.clearButton {
  width: 150px;
}

.dropdown-menu.show .dropdowntext .b-dropdown-text {
  padding: 10px;
}

.search-container {
  padding-left: 0 !important;
}

@media only screen and (max-width: 576px) {
  .refresh-container {
    padding-right: 0 !important;
  }

  .search-container {
    padding-left: 15px !important;
  }
}
</style>
