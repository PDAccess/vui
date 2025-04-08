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

      <b-tab @click="getSessions(null)" title="Sessions">
        <b-row>
        <b-col>
          <b-row>
            <b-col cols="2" sm="1" class="refresh-container">
              <b-button
                @click="liveMode = !liveMode"
                style="width: 100%; font-size: 1.2rem"
                :variant="liveMode ? 'danger' : 'outline-primary'"
                :title="liveMode ? 'Disable Live Mode' : 'Enable Live Mode'"
                v-b-tooltip.bottom
              >
                <i
                  :class="[
                    liveMode ? 'fa fa-stop-circle-o' : 'fa fa-play',
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
                  placeholder="Search"
                  type="text"
                  v-model="filter"
                  @keydown.enter="searchLogs"
                  :disabled="liveMode"
                ></b-form-input>
                <div class="input-group-append">
                  <b-button
                    @click="clearFilter"
                    variant="outline-primary"
                    type="button"
                    :disabled="liveMode"
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
                :disabled="liveMode"
                title="Session Start Time"
              />
            </b-col>
            <b-col cols="1" sm="1" class="d-flex justify-content-center">
              <download-excel
                :fetch="exportExcel"
                :name="`Tacacs-Authentication-Logs-${id}.xls`"
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
            :small="responsive"
          >
            <template v-slot:cell(userId)="row">
              <UserView :id="row.item.userId" />
            </template>

            <template v-slot:cell(credential)="row">
              <CredentialView :id="row.item.credentialId" />
            </template>

            <template v-slot:cell(sessionType)="row">
              <b-badge v-if="row.item.sessionType == 0" variant="success">Terminal</b-badge>
              <b-badge v-else variant="primary">SSH</b-badge>
            </template>

            <template v-slot:cell(remoteAddress)="row">
              <span class="text-info"> {{ row.item.remoteAddress }}</span>
            </template>

            <template v-slot:cell(startTime)="row">
            <p-timing :start-date="row.item.startTime"/>
            </template>

          </b-table>
          <infinite-loading
            @infinite="($state) => getSessions($state)"
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
    </b-tabs>
  </p-card>
</template>

<script>
import mappage from "@/views/h2h/components/mappage";
import InfiniteLoading from "vue-infinite-loading";
import ServiceLiveSessionPage from "@/views/h2h/pages/service/ServiceLiveSessionsPage";
import { mapGetters } from "vuex";
import { LogsApi } from "@/generated/terminal";

import downloadExcel from "vue-json-excel";

import CredentialView from "../../components/CredentialView.vue";
import UserView from "../../components/UserView.vue";

export default {
  props: ["id"],

  components: {
    ServiceLiveSessionPage,
    mappage,
    InfiniteLoading,
    downloadExcel,
    CredentialView,
    UserView
  },

  data() {
    return {
      excelField: {
        "User ID": "userId",
        "Credential ID": "credentialId",
        "Session ID": "sessionId",
        "Session Type": "sessionType",
        "Remote Address": "remoteAddress",
        "Start Time": "startTime",
      },
      excelLoading: false,
      liveAction: null,
      dateRangeData: {
        start: null,
        end: null,
      },
      filter: "",
      liveMode: false,
      errorStatus: false,
      errorStatusSession: false,
      errorStatusAction: false,
      errorHeader: "",
      errorResponse: "",
      actionLoading: true,
      loading: true,
      perPage: 20,
      currentPageAction: 0,
      currentPageSession: 0,
      users: [],
      sessions: [],
      actions: [],
      favorite: false,
      userid: "",
      info: {
        name: "",
      },
      start: new Date(2018, 1, 1),
      end: new Date(),
      actionfields: [
        { key: "username", label: "User" },
        { key: "proxy_action", label: "Action" },
        { key: "actionTime", sortable: true, label: "" },
      ],
      sessionfields: [
        { key: "userId", label: "User ID" },
        { key: "credential", label: "Credential" },
        { key: "sessionType", label: "Session Type" },
        { key: "remoteAddress", label: "Remote address" },
        { key: "startTime", label: "Start Time" },
      ],
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
    lastSessionsLogs() {
      this.updateLiveDate();
      this.getSessions(false);
    },
    updateLiveDate() {
      let nowDate = new Date();
      let beforeDate = new Date(nowDate);
      beforeDate.setHours(nowDate.getHours() - 3);
      this.dateRangeData.start = beforeDate;
      this.dateRangeData.end = nowDate;
    },
    searchLogs() {
      if (this.filter === "") {
        this.clearFilter();
      } else {
        this.getSessions(null);
      }
    },
    clearFilter() {
      this.filter = "";
      this.loading = true;
      this.getSessions(null);
    },
    async exportExcel() {
      this.excelLoading = true;
      let excelData = [];

      let logs = await new LogsApi(this.$terminalHttpConfig, undefined, this.$http).getSessionLogs(this.id, null, null, this.filter, this.dateRangeData.start, this.dateRangeData.end)
        .then((response) => {
          if (response.status == 200) {
            return response.data.data;
          }
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
          return [];
        });

      logs.forEach((f) => {
        excelData.push({
          userId: f.userId,
          credentialId: f.credentialId,
          sessionId: f.sessionId,
          sessionType: f.sessionType,
          remoteAddress: f.remoteAddress,
          startTime: f.startTime,
        });
      });

      this.excelLoading = false;

      return excelData;
    },
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
    getSessions($state) {
      if (!$state) {
        this.currentPageSession = 0;
        this.loading = true;
        this.sessions = [];
      }

      new LogsApi(this.$terminalHttpConfig, undefined, this.$http).getSessionLogs(this.id, this.perPage, this.perPage * this.currentPageSession, this.filter, this.dateRangeData.start, this.dateRangeData.end).then(response => {
        let sessions = response.data.data;
        if ($state) {
          if (sessions.length) {
            sessions.forEach(session => {
            this.sessions.push(session);
          });
            $state.loaded();
          } else {
            $state.complete();
          }
        } else {
          this.sessions = sessions;
          this.loading = false;
        }
        this.currentPageSession += 1;
      })
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
  },
  watch: {
    dateRangeData: function (value) {
      this.getSessions(false);
    },
    liveMode(value) {
      if (value) {
        this.lastSessionsLogs();
        this.liveAction = setInterval(this.lastSessionsLogs, 5000);
      } else {
        clearInterval(this.liveAction);
      }
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
    sessions(val) {
      val.forEach((element) => {
        element.startTime = this.$moment(element.startTime).format(
          "YYYY/M/D HH:mm"
        );
      });
    },
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

<style>
</style>