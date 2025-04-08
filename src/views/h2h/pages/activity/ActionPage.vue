<template>
  <div class="animated fadeIn">
    <div>
      <div class="d-flex justify-content-between mb-3">
        <div class="vw-100 ml-2">
          <b-form-input
            class="form-control search-input"
            size="lg"
            placeholder="Entry Action info"
            type="text"
            v-model="tempFilter"
            @keydown.enter="searchFilter"
          ></b-form-input>
        </div>
        <div class="vw-100 ml-2">
          <p-date-picker
            @val="tempDateRangeData = $event"
            :isRange="true"
            :clearBtn="true"
            mode="range"
            :select-date="tempDateRangeData"
          />
        </div>
        <div class="ml-2">
          <b-button variant="link" style="height: 40px">
            <download-excel
              :fetch="exportExcel"
              name="actions.xls"
              :fields="excelField"
            >
              <div v-if="exporting">
                <p-loading gif-height="15" />
              </div>
              <em v-else style="font-size: 20px" class="fa fa-download"></em>
            </download-excel>
          </b-button>
        </div>
      </div>
      <div v-if="loading" class="my-5">
        <p-loading message="Loading..." class="my-5" />
      </div>
      <div v-else-if="errorStatus">
        <p-error
          header="List operation has error!"
          :errorResponse="errorResponse"
          @reload="getActions"
        />
      </div>
      <div v-else-if="proxyLogs.length === 0">
        <p-initial
          icon="exclamation-circle"
          header="You don't have any action."
          message="Please start an action."
        />
      </div>
      <div v-else>
        <b-table
          :fields="fields"
          :items="proxyLogs"
          :responsive="responsive"
          hover
          show-empty
          :small="responsive"
          :fixed="responsive"
        >
          <template v-slot:cell(username)="row">
            <b-button
              @click="userDetailPage(row.item)"
              v-if="row.item.session.userEntity != null"
              variant="link"
              class="profile-button"
            >
              <p-profile-avatar
                :profileUsername="row.item.session.userEntity.username"
                :username="
                  row.item.session.userEntity.first_name +
                  ' ' +
                  row.item.session.userEntity.last_name
                "
                :size="30"
                :imageWidth="'30px'"
                :imageHeight="'auto'"
              />
            </b-button>
          </template>

          <template v-slot:cell(servicename)="row">
            {{ row.item.session.serviceEntity.name }}
            <em
              class="fa fa-terminal fa-1x"
              v-if="row.item.session.session_type == 'T'"
            ></em>
            <em
              class="fa fa-database fa-1x"
              v-if="row.item.session.session_type == 'D'"
            ></em>
            <em v-if="row.item.session.session_type == 'PDA'">
              <b-badge variant="primary">PDA</b-badge>
            </em>
          </template>

          <template v-slot:cell(proxy_action)="row">
            <span class="text-danger">{{ row.item.proxy_action }}</span>
          </template>

          <template v-slot:cell(actionTime)="row">
            <p-timing
              :start-date="row.item.session.startTime"
              :end-date="row.item.action_time"
            />
          </template>
        </b-table>
        <infinite-loading @infinite="updateTable" force-use-infinite-wrapper>
          <div slot="no-more"></div>
          <div slot="no-results"></div>
        </infinite-loading>
      </div>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";
import moment from "vue-moment";
import downloadExcel from "vue-json-excel";

export default {
  components: {
    InfiniteLoading,
    moment,
    downloadExcel,
  },
  data() {
    return {
      loading: true,
      errorStatus: false,
      errorResponse: "",
      tempDateRangeData: null,
      tempDateRange: "",
      proxyLogs: [],
      fields: [
        { key: "username", label: "User" },
        { key: "servicename", label: "Service" },
        { key: "proxy_action", sortable: true, label: "Action" },
        { key: "actionTime", label: "" },
      ],
      excelField: {
        User: "username",
        "Session Type": "sessionType",
        "External Session Id": "externalSessionId",
        "Service Id": "serviceId",
        "Proxy Action": "proxy_action",
        "Session Id": "sessionId",
        "Start Time": "startTime",
        "End Time": "endTime",
        "Action Time": "actionTime",
      },
      currentPage: 0,
      perPage: 15,
      filter: null,
      tempFilter: null,
      excelData: [],
      dateRangeData: null,
      exporting: false,
      dateRange: "",
    };
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  methods: {
    async exportExcel() {
      let sort = this.$route.query.sort;
      let cp = 0;
      let done = false;
      let list = [];

      this.searchFilter();
      while (!done) {
        this.exporting = true;
        let o = {
          perPage: 100,
          currentPage: cp,
          sort: sort,
          filter: this.filter,
          dateRange: this.dateRangeData,
        };
        await this.$http
          .post("/api/v1/action", o)
          .then((response) => {
            if (response.data.actionEntities.length) {
              list = response.data.actionEntities;
              list.forEach((f) => {
                this.excelData.push({
                  username: f.session.userEntity.username,
                  sessionType: f.session.sessionType,
                  externalSessionId: f.session.externalSessionId,
                  serviceId: f.session.inventoryId,
                  proxy_action: f.proxy_action,
                  sessionId: f.session.sessionId,
                  startTime: f.session.startTime ? this.$moment(f.session.startTime).calendar() : 'No date',
                  endTime: f.session.endTime ? this.$moment(f.session.endTime).calendar() : 'No date',
                  actionTime: f.action_time ? this.$moment(f.action_time).calendar() : 'No date',
                });
              });
              cp++;
            } else {
              done = true;
              this.exporting = false;
            }
          })
          .catch((error) => {
            console.log(error);
            this.loading = false;
            this.errorStatus = true;
            this.errorResponse = error;
          });
      }

      return this.excelData;
    },
    getActions() {
      this.loading = true;
      this.currentPage = 0;
      let sort = this.$route.query.sort;

      this.searchFilter();

      let o = {
        perPage: this.perPage,
        currentPage: this.currentPage,
        sort: sort,
        filter: this.filter,
        dateRange: this.dateRangeData,
      };
      this.$http
        .post("/api/v1/action", o)
        .then((response) => {
          this.proxyLogs = response.data.actionEntities;
          this.currentPage = this.currentPage + 1;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    searchDate() {
      if (this.tempDateRange == "") {
        this.clearDate();
      } else {
        this.dateRangeData = this.tempDateRangeData;
        this.dateRange = this.tempDateRange;
        this.getActions();
      }
    },
    searchFilter() {
      if (this.tempFilter == null) {
        this.clearFilter();
      } else if (
        this.filter == null ||
        this.tempFilter.toLowerCase() != this.filter.toLowerCase()
      ) {
        this.filter = this.tempFilter.toLowerCase();
      }
    },
    clearFilter() {
      if (this.filter == null) {
        this.tempFilter = null;
      } else {
        this.tempFilter = null;
        this.filter = null;
        this.getActions();
      }
    },
    clearDate() {
      this.dateRange = "";
      this.dateRangeData = null;
      this.getActions();
    },
    userDetailPage(item) {
      this.$router.push({
        name: "User Detail",
        params: {
          id: item.sessionEntity.userEntity.userId,
        },
      });
    },
    updateTable($state) {
      let sort = this.$route.query.sort;
      let o = {
        perPage: this.perPage,
        currentPage: this.currentPage,
        sort: sort,
        filter: this.filter,
        dateRange: this.dateRangeData,
      };

      this.$http
        .post("/api/v1/action", o)
        .then((response) => {
          if (response.data.actionEntities.length) {
            this.currentPage = this.currentPage + 1;
            response.data.actionEntities.forEach((f) => {
              this.proxyLogs.push(f);
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
        });
    },
  },
  watch: {
    tempDateRangeData: function (value) {
      if (value !== null) {
        let startValue = this.$moment(value.start).format("Y/MM/DD");
        let endValue = this.$moment(value.end).format("Y/MM/DD");
        this.tempDateRange = startValue + " - " + endValue;
        this.searchDate();
      } else {
        this.clearDate();
      }
    },
    tempFilter: function (value) {
      if (value.length >= 3 || value.length == 0) this.getActions();
    },
  },
  created() {
    this.getActions();
  },
};
</script>
