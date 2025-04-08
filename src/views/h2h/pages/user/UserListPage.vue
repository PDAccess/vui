<template>
  <b-row>
    <b-col>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text">
            <em class="fa fa-search"></em>
          </span>
        </div>
        <b-form-input
          class="form-control search-input"
          size="lg"
          placeholder="Entry User info"
          type="text"
          v-model="filterInput"
        ></b-form-input>
        <div class="input-group-append">
          <b-button
            @click="filterInput = ''"
            variant="outline-primary"
            type="button"
            >Clear</b-button
          >
        </div>
      </div>
      <p-modal @confirm="deleteuser()" :message="modalMessage"></p-modal>
      <p-loading v-if="loading" class="my-5" message="Loading..." />
      <p-error
        v-else-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <div v-else-if="items.length === 0">
        <p-initial
          icon="person-plus"
          header="Not found any user."
          message="Please create an user."
        />
      </div>
      <b-table
        v-else
        :current-page="currentPage"
        :fields="fields"
        :filter="filterInput"
        :filter-function="filter"
        :items="items"
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
          <b-badge v-else variant="secondary" pill>{{
            row.item.role
          }}</b-badge>
        </template>

        <template v-slot:cell(first_name)="row">
          {{ row.item.firstName }}
        </template>

        <template v-slot:cell(last_name)="row">
          {{ row.item.lastName }}
        </template>

        <template v-slot:cell(verification)="row">
          <!--
            <b-badge
            pill
            v-if="row.item.mfaVerification.googleAuthenticator"
            v-b-tooltip.bottom
            title="Google Authentication"
            style="height: 19px"
            variant="success"
          >
            <p>Qr</p>
          </b-badge>

          <b-badge
            pill
            v-if="row.item.mfaVerification.sms"
            v-b-tooltip.bottom
            title="Sms Verification"
            style="height: 19px"
            :class="qrVerification ? 'ml-1' : 'null'"
            variant="success"
          >
            <p>Sms</p>
          </b-badge>

          <b-badge
            pill
            v-if="row.item.mfaVerification.email"
            v-b-tooltip.bottom
            title="Email Verification"
            style="height: 19px"
            :class="qrVerification || phoneNumberVerification ? 'ml-1' : 'null'"
            variant="success"
          >
            <p>Email</p>
          </b-badge>
          -->
        </template>

        <template v-slot:cell(actions)="row">
          <b-dropdown
            id="dropdown-1"
            text="Action"
            variant="primary"
            class="user-actions"
            :disabled="row.item.isRefreshingLdapUser"
          >
            <template slot="button-content">
              <b-spinner class="mr-1" v-if="row.item.isRefreshingLdapUser || row.item.isResettingPassword" small />
              <i v-else class="mr-1 fa fa-cogs" aria-hidden="true"></i>
            </template>
            <b-dropdown-item
              v-if="row.item.external"
              @click.stop="refreshLdapUser(row.item, index)"
              variant="primary"
              ><em class="mr-1 fa fa-refresh"></em>Refresh User
            </b-dropdown-item>
            <template v-else>
              <b-dropdown-item
                @click.stop="details(row.item, row.index, $event.target)"
                variant="primary"
                ><em class="mr-1 fa fa-pencil"></em>Edit User
              </b-dropdown-item>
              <b-dropdown-item
                @click.stop="resetPassword(row.item)"
                variant="success"
                ><em class="mr-1 fa fa-refresh"></em>Reset Password
              </b-dropdown-item>
            </template>
            <b-dropdown-item
              @click.stop="blockUser(row.item.id)"
              v-if="row.item.blocked == null"
              ><em class="mr-1 fa fa-ban"></em>Block User
            </b-dropdown-item>
            <b-dropdown-item
              v-if="!row.item.external"
              @click.stop="deleteButton(row.item)"
              variant="danger"
              v-b-modal.modal
              ><em class="mr-1 fa fa-trash"></em>Delete User
            </b-dropdown-item>
          </b-dropdown>
        </template>

        <template v-slot:cell(created_at)="row">
          <span v-if="row.item.createdAt != undefined" style="color: #20a8d8">{{
            row.item.createdAt | moment("calendar")
          }}</span>
          <span v-else style="color: #20a8d8">No Date</span>
        </template>
      </b-table>
    </b-col>
    <div class="row my-1" v-if="items.length > perPage">
      <div class="col-sm-6">
        <b-pagination
          :per-page="perPage"
          :total-rows="items.length"
          v-model="currentPage"
        />
      </div>
      <div class="col-md-4">
        <b-form-group :label-cols="3" horizontal label="Rows per page:">
          <b-form-select :options="pageOptions" v-model="perPage" />
        </b-form-group>
      </div>
      <div class="col-md-2 text-md-right">
        <b-button :disabled="!sortBy" @click="sortBy = null"
          >Clear Sort</b-button
        >
      </div>
    </div>
  </b-row>
</template>

<script>

import { UserApi } from '@/generated/authws';

export default {
  components: {},
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      qrVerification: true,
      emailVerification: true,
      phoneNumberVerification: true,
      options: [
        {
          text: "User",
          value: "User",
        },
        {
          text: "Admin",
          value: "Admin",
        },
      ],
      loading: true,
      items: [],
      pageOptions: [
        {
          text: 10,
          value: 10,
        },
        {
          text: 15,
          value: 15,
        },
        {
          text: 25,
          value: 25,
        },
        {
          text: 50,
          value: 50,
        },
        {
          text: 100,
          value: 100,
        },
      ],
      fields: [
        { key: "username", sortable: true, label: "User" },
        { key: "first_name", sortable: true, label: "First Name" },
        { key: "last_name", sortable: true, label: "Last Name" },
        { key: "created_at", sortable: true, label: "Created At" },
        { key: "actions", label: "" },
      ],
      totalRows: 0,
      filterInput: null,
      currentPage: 1,
      perPage: 100,
      sortBy: null,
      sortDesc: false,
      userName: "",
      urole: "",
      mail: "",
      Id: "",
      modalid: "",
      modalname: "",
      modalMessage: "",
    };
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  watch: {
    totalRows: function () {
      return this.items.length;
    },
  },
  methods: {
    getUsers() {
      new UserApi(this.$authHttpConfig, undefined, this.$http).searchUsers()
      .then((response) => {
        response.data.forEach(user => {
          user.isRefreshingLdapUser = false;
          user.isResettingPassword = false;
        });
        this.items = response.data;
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
    blockUser(id) {
      new UserApi(this.$authHttpConfig, undefined, this.$http).blockUser(id, true)
        .then((response) => {
          this.$bvToast.toast(`User Blocked!`, {
            title: "User Settings Notification",
            variant: "info",
            autoHideDelay: 5000,
          });
          new UserApi(this.$authHttpConfig, undefined, this.$http).searchUsers()
            .then((response2) => {
              this.items = response2.data;
            })
            .catch((error) => {
              console.log(error);
              this.errorStatus = true;
              this.errorResponse = error;
              this.errorHeader = "Block operation has error!";
            });
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Block operation has error!";
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
    deleteuser() {
      console.log("user id", this.modalid)
      new UserApi(this.$authHttpConfig, undefined, this.$http).deleteUser(this.modalid)
        .then((response) => {
          this.$bvToast.toast(`User successfully deleted`, {
            title: "Delete Success",
            variant: "info",
            autoHideDelay: 5000,
          });

          new UserApi(this.$authHttpConfig, undefined, this.$http).searchUsers()
            .then((response3) => {
              this.items = response3.data;
            })
            .catch((error) => {
              console.log(error);
              this.errorStatus = true;
              this.errorResponse = error;
              this.errorHeader = "Delete operation has error!";
            });
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Delete operation has error!";
        });
    },
    filter(data) {
      if (this.filterInput == null) {
        return false;
      }
      if (data.first_name == null || data.last_name == null) return false;
      else {
        if (
          data.first_name
            .toLowerCase()
            .includes(this.filterInput.toLowerCase()) ||
          data.last_name.toLowerCase().includes(this.filterInput.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    },
    refreshLdapUser(user) {
      user.isRefreshingLdapUser = true;
      this.$http
      .post("/api/v1/ldap/sync-user/" + user.userId)
      .then(() => {
        user.isRefreshingLdapUser = false;
        this.getUsers();
        this.$bvToast.toast(
          `LDAP update of ${user.username} user done successfully`,
          {
            title: "User Sync Notification",
            variant: "info",
            autoHideDelay: 5000,
          }
        );
      })
      .catch((error) => {
        user.isRefreshingLdapUser = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
    },
    details(item, index, button) {
      this.$router.push({ name: "User Edit", params: { id: item.id } });
    },
    resetPassword(user) {
      user.isResettingPassword = true;
      const formData = new FormData();
      formData.append("userid", user.userId);
      this.$http.post("/api/v1/user/password/change", formData)
      .then(response => {
        user.isResettingPassword = false;
        this.$bvToast.toast(
          `${user.username} user's password has been reset.`,
          {
            title: "Password Reset Notification",
            variant: "info",
            autoHideDelay: 5000,
          }
        );
      }).catch(error => {
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      })
    },
    deleteButton(user) {
      this.modalid = user.id;
      this.modalname = user.username;
      this.modalMessage =
        "Are you sure you want to delete the users with the name " +
        this.modalname +
        " ?";
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
  created() {
    this.getUsers();
  },
};
</script>
<style>
.user-actions .dropdown-menu.show {
  width: 100% !important;
}
</style>
