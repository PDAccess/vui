<template>
  <p-card>
    <b-tabs content-class="mt-2" pills>
      <b-tab active title="Break the Glass">
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
          <b-col v-else-if="loadingLdapSynchronizationLogs">
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
import BreakTheGlassListComp from "@/views/h2h/components/BreakTheGlassListComp";
export default {
  props: ["id"],
  components: {
    InfiniteLoading,
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
      currentLdapLogPage: 0,
      perPage: 15,
      loadingLdapSynchronizationLogs: true,
      tempLdapFilter: "",
      ldapUserFilter: "",
      ldapSynchronizationLogFields: [
        { key: "created_users", label: "Created Users" },
        { key: "added_users", label: "Added Members" },
        { key: "deleted_users", label: "Delete Members" },
        { key: "created_at", label: "" },
      ],
      ldapSynchronizationLogs: [],
      errorStatus: false,
      errorResponse: "",
    };
  },
  watch: {
    tempLdapFilter: function (val) {
      if (val.length >= 3 || val.length == 0) this.searchLdapFilter();
    },
  },
  methods: {
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
    clearLdapFilter() {
      if (this.ldapUserFilter == null) {
        this.tempLdapFilter = null;
      } else {
        this.tempLdapFilter = null;
        this.ldapUserFilter = null;
        this.getLdapSynchronizationLogs();
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
  },
  created() {
    this.$http
      .get("/api/v1/group/info/" + this.id)
      .then((response) => {
        this.info = response.data;
        if (this.info.groupCategory == "ldap") {
          this.getLdapSynchronizationLogs();
        } else {
          this.loadingLdapSynchronizationLogs = false;
        }
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
      });
  },
};
</script>

<style>
</style>