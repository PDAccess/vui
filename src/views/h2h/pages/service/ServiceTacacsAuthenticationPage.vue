<template>
  <p-card>
    <div v-if="errorStatus">
      <p-error
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
    </div>
    <template v-else>
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
                  placeholder="Search User"
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

      <p-initial
        v-else-if="
          tacacsAuthenticationLogs === null ||
          tacacsAuthenticationLogs.length === 0
        "
        icon="exclamation-circle"
        header="You don't have any service tacacs logs."
        message="Please start an tacacs command from network device"
      />
      <template v-else>
        <b-table
          :fields="tacacsAuthenticationLogFields"
          :items="tacacsAuthenticationLogs"
          :responsive="responsive"
          hover
          show-empty
          :small="responsive"
        >
          <template v-slot:cell(username)="row">
            <router-link :to="`/user/userdetail/${row.item.userId}`">
              {{ row.item.username }}
            </router-link>
          </template>

          <template v-slot:cell(user_address)="row">
            <span class="text-info">{{ row.item.userAddress }}</span>
          </template>

          <template v-slot:cell(remote_address)="row">
            <span class="text-info">{{ row.item.remoteAddress }}</span>
          </template>

          <template v-slot:cell(authen_type)="row">
            <span class="text-info">{{ row.item.authen_type }}</span>
          </template>

          <template v-slot:cell(authen_action)="row">
            <span class="text-info">{{ row.item.authen_action }}</span>
          </template>

          <template v-slot:cell(authen_service)="row">
            <span class="text-info">{{ row.item.authen_service }}</span>
          </template>

          <template v-slot:cell(attempted_at)="row">
            <span
              v-if="row.item.attemptedAt"
              class="text-info"
              :title="$moment(row.item.attemptedAt).calendar()"
              >{{
                $moment(row.item.attemptedAt).format("DD/MM/Y - HH:mm:s")
              }}</span
            >
          </template>

          <template v-slot:cell(reason)="row">
            <span class="text-info">{{
              row.item.status ? "Successfully Authentication" : row.item.reason
            }}</span>
          </template>

          <template v-slot:cell(status)="row">
            <div class="d-flex justify-content-center">
              <i
                v-if="row.item.status"
                class="fa fa-sign-in fa-lg"
                style="color: green"
                aria-hidden="true"
              ></i>
              <i
                v-else
                class="fa fa-sign-in fa-lg"
                style="color: red"
                aria-hidden="true"
              ></i>
            </div>
          </template>

          <template v-slot:cell(authentication)="row">
            <div class="d-flex justify-content-center">
              <b-button
                @click="detailAuthentication(row.item.authenticationId)"
                variant="primary"
              >
                <i class="fa fa-info"></i>
              </b-button>
            </div>
            <!--
            <span class="text-info">{{ row.item.authenticationId }}</span>
            -->
          </template>
        </b-table>
        <infinite-loading
          @infinite="updateTacacsAuthenticationLogs"
          force-use-infinite-wrapper
        >
          <div slot="no-more"></div>
          <div slot="no-results"></div>
        </infinite-loading>
      </template>
    </template>
  </p-card>
</template>
<script>
import { mapGetters } from "vuex";
import InfiniteLoading from "vue-infinite-loading";

import downloadExcel from "vue-json-excel";

export default {
  props: ["id"],
  components: {
    InfiniteLoading,
    downloadExcel,
  },
  data() {
    return {
      excelField: {
        "Authentication ID": "authenticationId",
        "User ID": "userId",
        Username: "username",
        "User Address": "userAddress",
        "Remote Address": "remoteAddress",
        "Authentication Type": "authenticationType",
        "Authentication Action": "authenticationAction",
        "Authentication Service": "authenticationService",
        "Attempted At": "attemptedAt",
        Reason: "reason",
        Status: "status",
      },
      excelLoading: false,
      liveAction: null,
      dateRangeData: {
        start: null,
        end: null,
      },
      filter: "",
      liveMode: false,
      offset: 0,
      limit: 20,
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      loading: true,
      tacacsAuthenticationLogs: [],
      tacacsAuthenticationLogFields: [
        { key: "username", label: "Username" },
        { key: "user_address", label: "User Address" },
        { key: "remote_address", label: "Remote Address" },
        { key: "authen_type", label: "Type" },
        { key: "authen_action", label: "Action" },
        { key: "authen_service", label: "Service" },
        { key: "attempted_at", label: "Attempted At" },
        { key: "reason", label: "Reason" },
        { key: "status", label: "Status" },
        { key: "authentication", label: "Detail" },
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
  watch: {
    dateRangeData: function (value) {
      this.getTacacsAuthenticationLogs();
    },
    liveMode(value) {
      if (value) {
        this.lastTacacsAuthenticationLogs();
        this.liveAction = setInterval(this.lastTacacsAuthenticationLogs, 5000);
      } else {
        clearInterval(this.liveAction);
      }
    },
  },
  methods: {
    lastTacacsAuthenticationLogs() {
      this.updateLiveDate();
      this.getTacacsAuthenticationLogs();
    },
    async exportExcel() {
      this.excelLoading = true;
      let excelData = [];

      let queryParams = ``;

      if (this.dateRangeData != null) {
        if (this.dateRangeData.start) {
          queryParams += `startDate=${this.$moment(this.dateRangeData.start)
            .utc()
            .format()}&`;
        }

        if (this.dateRangeData.end) {
          queryParams += `endDate=${this.$moment(this.dateRangeData.end)
            .utc()
            .format()}&`;
        }
      }

      if (this.filter) {
        queryParams += `&filter=${this.filter}&`;
      }

      let logs = await this.$http
        .post(`/api/v1/tacacs/logs/authentication/${this.id}?${queryParams}`)
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
          authenticationId: f.authenticationId,
          userId: f.userId,
          username: f.username,
          userAddress: f.userAddress,
          remoteAddress: f.remoteAddress,
          authenticationType: f.authen_type,
          authenticationAction: f.authen_action,
          authenticationService: f.authen_service,
          attemptedAt: this.$moment(f.attemptedAt).format("DD/MM/Y - HH:mm:s"),
          reason: (function () {
            if (f.reason) {
              return f.reason;
            }
            return "Successfully Authentication";
          })(),
          status: f.status,
        });
      });

      this.excelLoading = false;

      return excelData;
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
        this.getTacacsAuthenticationLogs();
      }
    },
    clearFilter() {
      this.filter = "";
      this.loading = true;
      this.getTacacsAuthenticationLogs();
    },
    detailAuthentication(authenticationId) {
      this.$router.push({
        name: "Service Authentication Activity",
        params: {
          id: this.id,
        },
        query: { sort: "createddesc" },
        hash: "#" + authenticationId,
      });
    },
    updateTacacsAuthenticationLogs($state) {
      let queryParams = `limit=${this.limit}&offset=${this.offset}`;

      if (this.dateRangeData != null) {
        if (this.dateRangeData.start) {
          queryParams += `&startDate=${this.$moment(this.dateRangeData.start)
            .utc()
            .format()}`;
        }

        if (this.dateRangeData.end) {
          queryParams += `&endDate=${this.$moment(this.dateRangeData.end)
            .utc()
            .format()}`;
        }
      }

      if (this.filter) {
        queryParams += `&filter=${this.filter}`;
      }

      this.$http
        .post(`/api/v1/tacacs/logs/authentication/${this.id}?${queryParams}`)
        .then((response) => {
          if (response.data.data.length) {
            this.offset += this.limit;
            response.data.data.forEach((element) => {
              this.tacacsAuthenticationLogs.push(element);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    getTacacsAuthenticationLogs() {
      this.loading = true;
      this.offset = 0;

      let queryParams = `limit=${this.limit}&offset=${this.offset}`;
      if (this.dateRangeData != null) {
        if (this.dateRangeData.start) {
          queryParams += `&startDate=${this.$moment(this.dateRangeData.start)
            .utc()
            .format()}`;
        }

        if (this.dateRangeData.end) {
          queryParams += `&endDate=${this.$moment(this.dateRangeData.end)
            .utc()
            .format()}`;
        }
      }

      if (this.filter) {
        queryParams += `&filter=${this.filter}`;
      }

      this.$http
        .post(`/api/v1/tacacs/logs/authentication/${this.id}?${queryParams}`)
        .then((response) => {
          this.offset += this.limit;
          this.tacacsAuthenticationLogs = response.data.data;
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
  },
  beforeDestroy() {
    clearInterval(this.liveAction);
  },
  created() {
    this.getTacacsAuthenticationLogs();
  },
};
</script>

<style></style>
