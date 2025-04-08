<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col cols="12" sm="6">
          <div class="form-group">
            <p-select
              :multiple="true"
              :options="users"
              placeholder="Select User"
              v-model="tempSelectedUsers"
            ></p-select>
          </div>
        </b-col>
        <b-col cols="12" sm="6">
          <div class="input-group mb-3">
            <b-form-input
              @keydown.enter="searchFilter"
              class="form-control search-input"
              size="lg"
              placeholder="Search Command"
              type="text"
              v-model="tempCommandFilter"
            ></b-form-input>
          </div>
        </b-col>
      </b-row>
      <p-error
        v-if="errorStatus"
        header="List operation has error!"
        :errorResponse="errorResponse"
        @reload="getExternalActions"
      />
      <p-loading v-else-if="loading" class="my-5" message="Loading..." />
      <b-col v-else-if="logs.length === 0">
        <p-empty message="You don't have any logs." />
      </b-col>
      <template v-else>
        <b-table
          :fields="fields"
          :items="logs"
          fixed
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
            <span class="text-info">{{ row.item.time }}</span>
          </template>
        </b-table>
        <infinite-loading @infinite="updateTable" force-use-infinite-wrapper>
          <div slot="no-more"></div>
          <div slot="no-results"></div>
        </infinite-loading>
      </template>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";

export default {
  name: "ExternalActionsPage",
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
      errorStatus: false,
      errorResponse: "",
      tempSelectedUsers: [],
      tempCommandFilter: null,
      commandFilter: null,
      tempLogs: [],
      value: [],
      users: [],
      selectedUsers: [],
      logs: [],
      loading: true,
      ip: "1",
      fields: [
        { key: "user", label: "User" },
        { key: "command", label: "Command" },
        { key: "params", label: "Params" },
        { key: "ipadd", label: "Ip Address" },
        { key: "time", sortable: true, label: "Time" },
      ],
      currentPage: 0,
      perPage: 15,
    };
  },
  watch: {
    tempSelectedUsers: function () {
      this.searchFilter();
    },
    tempCommandFilter: function (val) {
      if (val.length >= 3 || val.length == 0) this.searchFilter();
    },
  },
  methods: {
    compareArray(array1, array2) {
      if (array1.length !== array2.length) return false;
      for (let i = 0; i < array1.length; i++) {
        if (!array2.includes(array1[i])) return false;
      }
      return true;
    },
    searchFilter() {
      this.tempCommandFilter =
        this.tempCommandFilter == null
          ? null
          : this.tempCommandFilter.toLowerCase();
      this.commandFilter =
        this.commandFilter == null ? null : this.commandFilter.toLowerCase();
      if (
        this.tempCommandFilter == null &&
        this.tempSelectedUsers.length == 0
      ) {
        this.clearFilter();
      } else if (
        this.tempCommandFilter != this.commandFilter ||
        !this.compareArray(this.tempSelectedUsers, this.selectedUsers)
      ) {
        this.commandFilter = this.tempCommandFilter;
        this.selectedUsers = [...this.tempSelectedUsers];
        this.getExternalActions();
      }
    },
    clearFilter() {
      if (this.commandFilter == null && this.selectedUsers.length == 0) {
        this.tempCommandFilter = null;
        this.tempSelectedUsers = [];
      } else {
        this.tempCommandFilter = null;
        this.commandFilter = null;
        this.tempSelectedUsers = [];
        this.selectedUsers = [];
        this.getExternalActions();
      }
    },
    getExternalActions() {
      this.loading = true;
      this.currentPage = 0;
      let sort = this.$route.query.sort;
      let o = {
        perPage: this.perPage,
        currentPage: this.currentPage,
        sort: sort,
        usersFilter: this.selectedUsers,
        filter: this.commandFilter,
      };
      this.$http
        .post("/api/v1/action/list/" + this.ip, o)
        .then((response) => {
          if (response.status == 200) {
            response.data.forEach((element) => {
              element.time = this.$moment(element.time * 1000).format(
                "HH:mm DD/MM/YYYY"
              );
            });
            this.logs = response.data;
            this.currentPage += 1;
            this.loading = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    addTag(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.value.push(tag);
    },
    updateTable($state) {
      let sort = this.$route.query.sort;
      let o = {
        perPage: this.perPage,
        currentPage: this.currentPage,
        sort: sort,
        usersFilter: this.selectedUsers,
        filter: this.commandFilter,
      };
      this.$http
        .post("/api/v1/action/list/" + this.ip, o)
        .then((response) => {
          if (response.data.length != 0) {
            this.currentPage = this.currentPage + 1;
            response.data.forEach((element) => {
              element.time = this.$moment(element.time * 1000).format(
                "HH:mm DD/MM/YYYY"
              );
              this.logs.push(element);
            });
            $state.loaded();
          } else {
            $state.complete();
          }

          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
  },
  created() {
    this.getExternalActions();

    this.$http
      .post("/api/v1/action/users/" + this.ip)
      .then((response) => {
        this.users = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
      });
  },
};
</script>

<style>
.searchCommand {
  height: 40px;
}

.searchParam {
  height: 40px;
}

.clearButton {
  width: 150px;
  height: 38px;
}

.input-group-append {
  padding-top: 1px;
}
</style>
