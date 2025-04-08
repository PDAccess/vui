<template>
  <p-error
    v-if="errorStatus"
    header="List operation has error!"
    :errorResponse="errorResponse"
    @reload="getActions"
  />
  <p-loading v-else-if="loading" class="my-5" message="Loading..." />
  <p-initial
    v-else-if="deletedUsers.length === 0"
    icon="person-dash"
    header="Not found any deleted user."
    message="Please delete an user."
  />
  <b-table
    v-else
    :current-page="currentPage"
    :fields="fields"
    :items="deletedUsers"
    :per-page="perPage"
    :responsive="responsive"
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
    @filtered="onFiltered"
    hover
    show-empty
    small
  >
    <template v-slot:cell(username)="row">
      <b-button
        @click.stop="userDetailPage(row.item)"
        variant="link"
        class="profile-button"
      >
        <p-profile-avatar
          :profileUsername="row.item.username"
          :username="row.item.firstName + ' ' + row.item.lastName"
          :size="30"
          :imageWidth="'30px'"
          :imageHeight="'auto'"
          :isBlocked="row.item.blocked"
          :isDeleted="row.item.deletedAt"
        />
      </b-button>
      <b-badge v-if="row.item.role == 'Admin'" variant="success" pill>{{
        row.item.urole
      }}</b-badge>
      <b-badge v-else variant="secondary" pill>{{ row.item.role }}</b-badge>
    </template>
    <template v-slot:cell(first_name)="row">
      {{ row.item.firstName }}
    </template>
    <template v-slot:cell(last_name)="row">
      {{ row.item.lastName }}
    </template>
    <template v-slot:cell(deleted_at)="row">
      <span style="color: #20a8d8">
        {{ row.item.deletedAt | moment("calendar") }}</span
      >
    </template>
  </b-table>
</template>

<script>

import { UserApi } from '@/generated/authws';

export default {
  components: {},
  data() {
    return {
      loading: true,
      errorStatus: false,
      errorResponse: "",
      deletedUsers: [],
      currentPage: 1,
      perPage: 100,
      sortBy: null,
      sortDesc: false,
      filterInput: null,
      fields: [
        { key: "username", sortable: true, label: "User" },
        { key: "first_name", sortable: true, label: "First Name" },
        { key: "last_name", sortable: true, label: "Last Name" },
        { key: "deleted_at", label: "Deleted at" },
      ],
    };
  },
  methods: {
    getDeletedUsers() {
      new UserApi(this.$authHttpConfig, undefined, this.$http).searchUsers(true)
      .then((response) => {
        this.deletedUsers = response.data;
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
      });
    },
    unDeleteUser(userId) {
      this.$http
        .post("/api/v1/user/un-delete/" + userId)
        .then((response) => {
          this.$bvToast.toast(`User Undeleted!`, {
            title: "User Settings Notification",
            variant: "info",
            autoHideDelay: 5000,
          });
          this.getDeletedUsers();
        })
        .catch((error) => {
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    userDetailPage(item) {
      this.$router.push({
        name: "User Detail",
        params: {
          id: item.userId,
        },
      });
    },
    filter(data) {
      if (this.filterInput == null) {
        return true;
      } else {
        // TODO : convert lower or upper case this strings
        if (
          data.first_name.includes(this.filterInput) ||
          data.last_name.includes(this.filterInput)
        ) {
          // return true if first name or last name includes filter input which is entered by user.
          // return false if not.
          return true;
        }
      }
      return false;
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  created() {
    this.getDeletedUsers();
  },
};
</script>
