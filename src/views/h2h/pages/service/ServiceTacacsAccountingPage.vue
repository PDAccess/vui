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
                :name="`Tacacs-Accounting-Logs-${id}.xls`"
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
        v-else-if="tacacsLogs === null || tacacsLogs.length === 0"
        icon="exclamation-circle"
        header="You don't have any service tacacs logs."
        message="Please start an tacacs command from network device"
      />
      <template v-else>
        <b-table
          :fields="tacacsLogFields"
          :items="tacacsLogs"
          :responsive="responsive"
          hover
          show-empty
          :small="responsive"
        >
          <template v-slot:cell(user)="row">
            <router-link :to="`/user/userdetail/${row.item.userId}`">
              {{ row.item.username }}
            </router-link>
          </template>

          <template v-slot:cell(command)="row">
            <span class="text-info">{{ row.item.command }}</span>
          </template>

          <template v-slot:cell(params)="row">
            <span class="text-info">{{ row.item.params }}</span>
          </template>

          <template v-slot:cell(remote_address)="row">
            <span class="text-info">{{ row.item.remoteAddr }}</span>
          </template>

          <template v-slot:cell(flag)="row">
            <span class="text-info">{{ row.item.flag }}</span>
          </template>

          <template v-slot:cell(authen_type)="row">
            <span class="text-info">{{ row.item.authenType }}</span>
          </template>

          <template v-slot:cell(authen_service)="row">
            <span class="text-info">{{ row.item.authenService }}</span>
          </template>

          <template v-slot:cell(authen_method)="row">
            <span class="text-info">{{ row.item.authenMethod }}</span>
          </template>

          <template v-slot:cell(exec_time)="row">
            <span
              v-if="row.item.createdAt"
              class="text-info"
              :title="$moment(row.item.createdAt).calendar()"
              >{{
                $moment(row.item.createdAt).format("DD/MM/Y - HH:mm:s")
              }}</span
            >
          </template>
        </b-table>
        <infinite-loading
          @infinite="updateTacacsActivity"
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

import { LogsApi } from "@/generated/tacacs/index.ts"

export default {
  props: ["id"],
  components: {
    InfiniteLoading,
    downloadExcel,
  },
  data() {
    return {
      excelField: {
        "User ID": "userId",
        "Username": "username",
        "Command": "command",
        "Params": "params",
        "Remote Address": "remoteAddress",
        "Flag": "flag",
        "Authentication Type": "authenType",
        "Authentication Service": "authenService",
        "Authentication Method": "authenMethod",
        "Exec Time": "execTime"
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
      tacacsLogFields: [
        { key: "user", label: "User" },
        { key: "command", label: "Command" },
        { key: "params", label: "Params" },
        { key: "remote_address", label: "Remote Address" },
        { key: "flag", label: "Flag" },
        { key: "authen_type", label: "Type" },
        { key: "authen_service", label: "Service" },
        { key: "authen_method", label: "Method" },
        { key: "exec_time", label: "Exec Time" },
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
      this.getTacacsActivity();
    },
    liveMode(value) {
      if (value) {
        this.lastTacacsActivity();
        this.liveAction = setInterval(this.lastTacacsActivity, 5000);
      } else {
        clearInterval(this.liveAction);
      }
    },
  },
  methods: {
    lastTacacsActivity() {
      this.updateLiveDate();
      this.getTacacsActivity();
    },
    async exportExcel() {
      this.excelLoading = true;
      let excelData = [];

      let startDate, endDate, filter;

      if (this.dateRangeData != null) {
        if (this.dateRangeData.start) {
          startDate=this.$moment(this.dateRangeData.start)
            .utc()
            .format();
        }

        if (this.dateRangeData.end) {
          endDate=this.$moment(this.dateRangeData.end)
            .utc()
            .format();
        }
      }

      if (this.filter) {
        filter=this.filter;
      }
        
      let logApi = new LogsApi(this.$tacacsHttpConfig, undefined, this.$http)
      logApi.acctService(this.id, this.limit, this.offset, filter, startDate, endDate)
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
          username: f.username,
          command: f.command,
          params: f.params,
          remoteAddress: f.remoteAddr,
          flag: f.flag,
          authenType: f.authenType,
          authenService: f.authenService,
          authenMethod: f.authenMethod,
          execTime: this.$moment(f.execTime).format("DD/MM/Y - HH:mm:s"),
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
        this.getTacacsActivity();
      }
    },
    clearFilter() {
      this.filter = "";
      this.loading = true;
      this.getTacacsActivity();
    },
    updateTacacsActivity($state) {
      let startDate, endDate, filter;

      if (this.dateRangeData != null) {
        if (this.dateRangeData.start) {
          startDate=this.$moment(this.dateRangeData.start)
            .utc()
            .format();
        }

        if (this.dateRangeData.end) {
          endDate=this.$moment(this.dateRangeData.end)
            .utc()
            .format();
        }
      }

      if (this.filter) {
        filter=this.filter;
      }

      let logApi = new LogsApi(this.$tacacsHttpConfig, undefined, this.$http)
      logApi.acctService(this.id, this.limit, this.offset, filter, startDate, endDate)
      .then((response) => {
          if (response.data.data.length) {
            this.offset += this.limit;
            response.data.data.forEach((element) => {
              this.tacacsLogs.push(element);
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
    getTacacsActivity() {
      this.loading = true;
      this.offset = 0;
      let startDate, endDate, filter;

      if (this.dateRangeData != null) {
        if (this.dateRangeData.start) {
          startDate = this.$moment(this.dateRangeData.start)
            .utc()
            .format();
        }

        if (this.dateRangeData.end) {
          endDate = this.$moment(this.dateRangeData.end)
            .utc()
            .format();
        }
      }

      if (this.filter) {
        filter = this.filter
      }

      let logApi = new LogsApi(this.$tacacsHttpConfig, undefined, this.$http)
      logApi.acctService(this.id, this.limit, this.offset, filter, startDate, endDate)
        .then((response) => {
          this.tacacsLogs = response.data.data;
          this.offset += this.limit;
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
    this.getTacacsActivity();
  },
};
</script>

<style></style>
