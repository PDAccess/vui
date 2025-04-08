<template>
  <p-error
    v-if="errorStatusList"
    header="List operation has error!"
    :errorResponse="errorResponse"
    @reload="getActions"
  />
  <p-error
    v-else-if="errorStatusBlock"
    header="Unblock operation has error!"
    :errorResponse="errorResponse"
    @reload="unblockUser"
  />
  <p-loading v-else-if="loading" class="my-5" message="Loading..." />
  <p-initial
    v-else-if="blockedUsers.length === 0"
    icon="person-dash"
    header="Not found any blocked user."
    message="Please block an user."
  />
  <b-table
    v-else
    :current-page="currentPage"
    :fields="fields"
    :items="blockedUsers"
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
        row.item.role
      }}</b-badge>
      <b-badge v-else variant="secondary" pill>{{ row.item.role }}</b-badge>
    </template>
    <template v-slot:cell(first_name)="row">
      {{ row.item.firstName }}
    </template>
    <template v-slot:cell(last_name)="row">
      {{ row.item.lastName }}
    </template>
    <template v-slot:cell(blocked_at)="row">
      <span style="color: #20a8d8">
        {{ row.item.blocked | moment("calendar") }}</span
      >
    </template>
    <template v-slot:cell(actions)="row">
      <b-button
        @click.stop="unblockUser(row.item.id)"
        class="btn"
        variant="success"
        title="Unblock User"
        type="button"
        v-b-tooltip.bottom
      >
        <em class="fa fa-unlock"></em>
      </b-button>
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
      errorStatusBlock: false,
      errorStatusList: false,
      errorResponse: "",
      blockedUsers: [],
      currentPage: 1,
      perPage: 100,
      sortBy: null,
      sortDesc: false,
      filterInput: null,
      fields: [
        { key: "username", sortable: true, label: "User" },
        { key: "first_name", sortable: true, label: "First Name" },
        { key: "last_name", sortable: true, label: "Last Name" },
        { key: "blocked_at", label: "Blocked at" },
        { key: "actions", label: "Actions" },
      ],
    };
  },
  methods: {
    userDetailPage(item) {
      this.$router.push({
        name: "User Detail",
        params: {
          id: item.userId,
        },
      });
    },
    unblockUser(id) {
      new UserApi(this.$authHttpConfig, undefined, this.$http).blockUser(id, false)
        .then((response) => {
          this.$bvToast.toast(`User Unblocked!`, {
            title: "User Settings Notification",
            variant: "info",
            autoHideDelay: 5000,
          });
          new UserApi(this.$authHttpConfig, undefined, this.$http).searchUsers(undefined, true)
            .then((response3) => {
              this.blockedUsers = response3.data;
            })
            .catch((error) => {
              console.log(error);
              this.loading = false;
              this.errorStatusBlock = true;
              this.errorResponse = error;
            });
        })
        .catch((error) => {
          console.log(error);
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
    new UserApi(this.$authHttpConfig, undefined, this.$http).searchUsers(undefined, true)
      .then((response) => {
        this.blockedUsers = response.data;
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatusList = true;
        this.errorResponse = error;
      });

  },
};
</script>
