<template>
  <p-card>
    <b-row>
      <b-col>
        <b-row>
          <b-col cols="12" sm="12" class="search-container">
            <div class="input-group mb-1">
              <b-form-input
                class="form-control search-input"
                size="lg"
                placeholder="Search User"
                type="text"
                v-model="tempAlarmUserFilter"
                @keydown.enter="searchAlarmHistories"
              ></b-form-input>
              <div class="input-group-append">
                <b-button
                  @click="clearAlarmUserFilter"
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
    <p-loading class="my-5" v-if="loading" message="Loading..." />
    <p-error
      v-else-if="errorStatusAuth"
      :header="errorHeader"
      :errorResponse="errorResponse"
      @reload="$router.go()"
    />

    <p-initial
      v-else-if="alarmHistories.length === 0"
      icon="exclamation-circle"
      header="You don't have any alarms."
      message="No activity detected to generate alarm"
    />
    <template v-else>
      <b-table
        :fields="alarmHistoryFields"
        :items="alarmHistories"
        :responsive="responsive"
        hover
        show-empty
        :small="responsive"
      >
        <template v-slot:cell(id)="row">
          <span class="text-info">{{ row.item.id }}</span>
        </template>

        <template v-slot:cell(username)="row">
          <span class="text-info">{{ row.item.username }}</span>
        </template>

        <template v-slot:cell(group)="row">
          <span class="text-info">{{ row.item.group }}</span>
        </template>

        <template v-slot:cell(description)="row">
          <span class="text-info">{{ row.item.description }}</span>
        </template>

        <template v-slot:cell(created_at)="row">
          <span class="text-info">{{
            row.item.createdAt | moment("calendar")
          }}</span>
        </template>
      </b-table>
      <infinite-loading @infinite="infiniteHandler" force-use-infinite-wrapper>
        <div slot="no-more"></div>
        <div slot="no-results"></div>
      </infinite-loading>
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
      perPage: 15,
      errorStatus: false,
      errorStatusAuth: false,
      errorHeader: "",
      errorResponse: "",
      externalCommandLoading: true,
      loading: true,
      externalFileloading: true,
      loading: true,
      agentStatusLoading: true,
      commandFilter: "",
      tempCommandFilter: "",
      tempAlarmUserFilter: "",
      alarmUserFilter: "",
      tempFileActionFilter: "",
      fileActionFilter: "",
      exCommandLogs: [],
      credantialHistory: [],
      alarmHistories: [],
      exFileLogs: [],
      agentStatusData: [],
      currentPage: 0,
      currentPageFileAction: 0,
      currentPageExternal: 1,
      currentPageAgentStatus: 0,
      filter: this.$route.params.id,
      users: [],
      alarmHistoryFields: [
        { key: "id", label: "#" },
        { key: "username", label: "username" },
        { key: "group", label: "Group" },
        { key: "description", label: "Description" },
        { key: "created_at", label: "Created At" },
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
    infiniteHandler($state) {
      let data = {
        perPage: 15,
        currentPage: this.currentPage,
        filter: this.alarmUserFilter,
      };

      this.$http
        .post("/api/v1/alarm/histories", data)
        .then((response) => {
          if (response.data.length) {
            this.currentPage += 1;
            response.data.forEach((element) => {
              this.alarmHistories.push(element);
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
    updateAlarmHistories() {
      this.currentPage = 0;
      this.getAlarmHistories();
    },
    getAlarmHistories() {
      let data = {
        perPage: 15,
        currentPage: this.currentPage,
        filter: this.alarmUserFilter,
      };

      this.$http
        .post("/api/v1/alarm/histories", data)
        .then((response) => {
          if (response.status == 200) {
            this.currentPage += 1;
            this.alarmHistories = response.data;
            this.loading = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.errorStatusAuth = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    searchAlarmHistories() {
      if (this.tempAlarmUserFilter == null) {
        this.clearAlarmUserFilter();
      } else if (
        this.alarmUserFilter == null ||
        this.tempAlarmUserFilter.toLowerCase() !=
          this.alarmUserFilter.toLowerCase()
      ) {
        this.alarmUserFilter = this.tempAlarmUserFilter.toLowerCase();
        this.currentPage = 0;
        this.loading = true;
        this.getAlarmHistories();
      }
    },
    clearAlarmUserFilter() {
      if (this.alarmUserFilter == null) {
        this.tempAlarmUserFilter = null;
      } else {
        this.tempAlarmUserFilter = null;
        this.alarmUserFilter = null;
        this.currentPage = 0;
        this.loading = true;
        this.getAlarmHistories();
      }
    },
  },
  watch: {
    tempAlarmUserFilter: function (val) {
      if (val.length >= 3 || val.length == 0) this.searchAlarmHistories();
    },
  },
  created() {
    this.updateAlarmHistories();
  },
};
</script>

<style>
</style>