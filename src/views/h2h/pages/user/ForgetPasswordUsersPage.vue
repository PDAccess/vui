<template>
  <p-loading v-if="loading" class="my-5" message="Loading..." />
  <p-error
    v-else-if="errorStatus"
    :header="errorHeader"
    :errorResponse="errorResponse"
    @reload="$router.go()"
  />
  <p-initial
    v-else-if="forgetItems.length === 0"
    icon="person-check"
    header="Not found user forgot password."
    message="Wait for a user to forget their password."
  />
  <b-table
    v-else
    fixed
    :current-page="currentPage"
    :fields="forgetFields"
    :items="forgetItems"
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
          :profileUsername="row.item.userEntity.username"
          :username="
            row.item.userEntity.first_name + ' ' + row.item.userEntity.last_name
          "
          :size="30"
          :imageWidth="'30px'"
          :imageHeight="'auto'"
        />
      </b-button>
      <b-badge
        v-if="row.item.userEntity.urole == 'Admin'"
        variant="success"
        pill
        >{{ row.item.userEntity.urole }}</b-badge
      >
      <b-badge v-else variant="secondary" pill>{{
        row.item.userEntity.urole
      }}</b-badge>
    </template>
    <template v-slot:cell(requested_at)="row">
      <span class="text-info">{{
        row.item.requested_at | moment("calendar")
      }}</span>
    </template>
    <template v-slot:cell(actions)="row">
      <b-dropdown
        id="dropdown-1"
        text="Action"
        variant="primary"
        class="user-actions"
      >
        <template slot="button-content">
          <i class="mr-1 fa fa-cogs" aria-hidden="true"></i>
        </template>
        <b-dropdown-item @click.stop="approveUser(row.item)" variant="success"
          ><em class="mr-1 fa fa-check"></em>Approve
        </b-dropdown-item>
        <b-dropdown-item @click.stop="rejectUser(row.item)" variant="danger"
          ><em class="mr-1 fa fa-ban"></em>Reject
        </b-dropdown-item>
      </b-dropdown>
    </template>
  </b-table>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      loading: true,
      currentPage: 1,
      perPage: 100,
      sortBy: null,
      sortDesc: false,
      filterInput: null,
      forgetItems: [],
      fields: [
        { key: "username", sortable: true, label: "User" },
        { key: "first_name", sortable: true, label: "First Name" },
        { key: "last_name", sortable: true, label: "Last Name" },
        { key: "urole", sortable: true, label: "Role" },
        { key: "actions", label: "Actions" },
      ],
      forgetFields: [
        { key: "username", sortable: true, label: "User" },
        { key: "userEntity.first_name", sortable: true, label: "First Name" },
        { key: "userEntity.last_name", sortable: true, label: "Last Name" },
        { key: "userEntity.urole", sortable: true, label: "Role" },
        { key: "requested_at", sortable: true, label: "Requested At" },
        { key: "actions", label: "Actions" },
      ],
    };
  },
  methods: {
    userDetailPage(item) {
      this.$router.push({
        name: "User Detail",
        params: {
          id: item.userEntity.userId,
        },
      });
    },
    rejectUser(item) {
      this.$http
        .delete("/api/v1/user/user/rejectChangePassword/" + item.userEntity.userId)
        .then((response) => {
          if (response.status == 200) {
            this.forgetItems.pop(item);
            this.$bvToast.toast(`Password reset request reject successful.`, {
              title: "Reset Password Notification",
              variant: "info",
              autoHideDelay: 5000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
          this.$bvToast.toast(
            `No Records Found! 
                                        The user or user request may have been deleted.`,
            {
              title: "Reset Password Notification",
              variant: "danger",
              autoHideDelay: 5000,
            }
          );
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
    approveUser(item) {
      let formData = new FormData();
      formData.append("userid", item.userEntity.userId);

      this.$http
        .post("/api/v1/user/user/changepassword", formData)
        .then((response) => {
          if (response.status == 200) {
            this.forgetItems.pop(item);
            this.$bvToast.toast(`Password reset request has been confirmed.`, {
              title: "Reset Password Notification",
              variant: "info",
              autoHideDelay: 5000,
            });
          }
        })
        .catch((error) => {
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
          this.$bvToast.toast(
            `No Records Found! 
                                         The user or user request may have been deleted.`,
            {
              title: "Reset Password Notification",
              variant: "danger",
              autoHideDelay: 5000,
            }
          );
        });
    },
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  created() {
    //Get users for forget passwords
    this.$http
      .get("api/v1/user/getForgetPasswordUser")
      .then((response) => {
        this.forgetItems = response.data;
        this.loading = false;
      })
      .catch((error) => {
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    this.$http
      .get("/api/v1/user", {})
      .then((response) => {
        this.items = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
  },
};
</script>
