<template>
  <div class="wrapper">
    <p-card>
      <b-row>
          <b-col cols="12">
            <b-form-input
              v-model="filter"
              class="form-control search-input"
              placeholder="Search service or account"
              type="text"
            ></b-form-input>
          </b-col>
        </b-row>
        <hr />
      <p-loading v-if="loading" class="my-5" message="Loading..." />
      <p-error
        v-else-if="errorStatus"
        header="List operation has error!"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <div v-else-if="users.length === 0">
        <p-initial
          icon="person-plus"
          header="You don't have any credential."
          message="Please create a credential."
        />
      </div>
      <template v-else>
        <b-modal
          id="credential-permissions-modal"
          centered
          title="Please enter permissions for the account:"
        >
          <b-form-group label="Users:">
            <p-select
              :multiple="true"
              :options="groupUsers"
              label="username"
              placeholder="Select User"
              track-by="userId"
              v-model="selectedUsers"
            >
              <template slot="singleLabel" slot-scope="props">
                <span class="option__title">{{ props.option.username }}</span>
              </template>
              <template slot="option" slot-scope="props">
                <div class="option__desc">
                  <span class="option__title">
                    <div
                      class="d-flex justify-content-start align-items-center"
                    >
                      <p-profile-avatar
                        :profileUsername="props.option.username"
                        :username="
                          props.option.first_name + ' ' + props.option.last_name
                        "
                        :size="30"
                        :imageWidth="'30px'"
                        :imageHeight="'auto'"
                      />
                    </div>
                  </span>
                </div>
              </template>
            </p-select>
          </b-form-group>
          <label>Permissions</label>
          <b-form-checkbox
            class="mt-1"
            v-for="(permission, item) in permissions"
            v-bind:key="item"
            name="checkbox-1"
            v-model="permission.enable"
            switch
          >
            {{ permission.label }}
          </b-form-checkbox>
          <br />
          <template #modal-footer>
            <div class="w-100 d-flex justify-content-end">
              <b-button
                variant="secondary"
                class="mr-2"
                @click="$bvModal.hide('credential-permissions-modal')"
              >
                Cancel
              </b-button>
              <b-button variant="success" @click="saveAllPermissions">
                Save
              </b-button>
            </div>
          </template>
        </b-modal>
        <b-table :fields="fields" :items="users" thead-class="hidden_header">
          <template v-slot:cell(select)="row">
            <b-form-checkbox
              :id="'checkbox-' + row.item.credentialId"
              :name="'checkbox-' + row.item.credentialId"
              v-model="row.item.selected"
            >
            </b-form-checkbox>
          </template>
          <template v-slot:cell(credential_name)="row">
            <em v-b-tooltip.bottom class="fa fa-user usercolor"></em>
            <span class="wfont ml-2">{{ row.item.name }}</span>
          </template>
          <template v-slot:cell(created_at)="row">
            <span class="text-info">{{
              row.item.createdAt | moment("calendar")
            }}</span>
          </template>
          <template v-slot:cell(updated_at)="row">
            <span class="text-info">{{
              row.item.updatedAt | moment("calendar")
            }}</span>
          </template>
          <template v-slot:cell(action)="row">
            <div v-if="group.ownMembership == 'ADMIN'" class="d-flex justify-content-end">
              <b-button
                :to="
                  '/groups/' +
                  id +
                  '/credential/' +
                  row.item.credentialId +
                  '/permissions'
                "
                variant="success"
              >
                <i class="fa fa-shield" aria-hidden="true"></i>
              </b-button>
            </div>
          </template>
          <template #head(select)="data">
            <b-form-checkbox
              id="checkbox-all"
              name="checkbox-all"
              @change="changeAllSelection"
            >
            </b-form-checkbox>
          </template>
        </b-table>
        <infinite-loading
          @infinite="handlePageLoading"
          force-use-infinite-wrapper
        >
          <div slot="no-more"></div>
          <div slot="no-results"></div>
        </infinite-loading>
      </template>
    </p-card>
  </div>
</template>
<script>
import InfiniteLoading from "vue-infinite-loading";

import { CredentialsApi, PermissionApi } from "@/generated/cmanager/index.ts"

export default {
  components: {
    InfiniteLoading,
  },
  props: ["id", "permissionChanged"],
  data() {
    return {
      group: {},
      selectedUsers: [],
      groupUsers: [],
      perPage: 15,
      currentPage: 0,
      filter: null,
      permissions: [
        { label: "Can connection", value: "CAN_CONNECT", enable: false },
        { label: "Can see password", value: "CAN_SEE_PASSWORD", enable: false },
        {
          label: "Can change password ",
          value: "CAN_CHANGE_PASSWORD",
          enable: false,
        },
        {
          label: "Can authorize other users",
          value: "CAN_AUTHORIZE_OTHER_USERS",
          enable: false,
        },
        {
          label: "Can join sessions",
          value: "CAN_JOIN_SESSIONS",
          enable: false,
        },
        {
          label: "Can connection with request permission",
          value: "CAN_CONNECTION_WITH_REQUEST_PERMISSION",
          enable: false,
        },
        {
          label: "Can manage other users",
          value: "CAN_MANAGE_OTHER_USERS",
          enable: false,
        },
      ],
      items: [
        {
          title: "Super Users",
          permissions: this.getPermissionsLabel(true),
          createdBy: null,
          users: [],
        },
        {
          title: "Not Super Users",
          permissions: this.getPermissionsLabel(false),
          createdBy: null,
          users: [],
        },
      ],
      users: [],
      fields: [
        {
          key: "select",
          label: "#",
        },
        {
          key: "credential_name",
          label: "Credential Name",
        },
        {
          key: "created_at",
          label: "Created At",
        },
        {
          key: "updated_at",
          label: "Updated At",
        },
        {
          key: "action",
          label: "",
        },
      ],
      loading: true,
      errorStatus: false,
      errorResponse: {},
    };
  },
  watch: {
    filter: function (val) {
      if (val.length >= 3 || val.length == 0) this.getCredentials();
    },
    permissionChanged: function(val) {
      this.onClickPermissions();
    }
  },
  computed: {
    checkSelectedEntry() {
      let hasSelectedItem = false;
      this.users.forEach((item) => {
        if (item.selected) {
          hasSelectedItem = true;
          return;
        }
      });
      console.log(hasSelectedItem);
      return hasSelectedItem;
    },
  },
  methods: {
    saveAllPermissions() {
      this.$bvModal.hide("credential-permissions-modal");

      let permissions = [];
      this.selectedUsers.forEach(user => {
        permissions.push({
          user: user.userId,
          permissionsSet: this.permissions.map(permission => permission.value)
        })
      });

      this.$http
        .post("/api/v1/permissions/all", { permissions })
        .then((response) => {
          this.$bvToast.toast(`All permissions is successfully saved`, {
            title: "Permissions",
            variant: "success",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    getCredentials() {
      this.currentPage = 0;
      this.loading = true;
      this.users = [];
      let data = {
        perPage: this.perPage,
        currentPage: this.currentPage,
        filter: this.filter,
      };

      new CredentialsApi(this.$cmanagerHttpConfig, undefined, this.$http).searchCredentials(this.id, this.perPage, this.currentPage * this.perPage, this.filter)
      .then((response) => {
          response.data.credentials.forEach((user) => {
            user.selected = false;
            this.users.push(user);
          });
          this.currentPage += 1;
          this.loading = false;
        })
        .catch((error) => {
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
        
    },
    handlePageLoading($state) {
      new CredentialsApi(this.$cmanagerHttpConfig, undefined, this.$http).searchCredentials(this.id, this.perPage, this.currentPage * this.perPage, this.filter)
      .then((response) => {
          if (response.data.credentials.length) {
            this.currentPage += 1;
            response.data.credentials.forEach((user) => {
              user.selected = false;
              this.users.push(user);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    changeAllSelection(checked) {
      console.log(this.users);
      this.users.forEach((user) => {
        user.selected = checked;
      });
      console.log(this.users);
    },
    onClickPermissions() {
      this.permissions.forEach((permission) => {
        permission.enable = false;
      });
      this.$bvModal.show('credential-permissions-modal')
    },
    goToDetail() {
      this.$router.push({
        path:
          "/groups/templateuser/createtemplateuser/" + this.$route.params.id,
      });
    },
    getPermissionsLabel(cond) {
      let perms = [
        { label: "Connection, ", enable: true },
        { label: "See password, ", enable: true },
        { label: "Change password, ", enable: true },
        { label: "Authorize other users, ", enable: false },
        { label: "Join sessions, ", enable: false },
        { label: "Connection with request permission, ", enable: false },
        { label: "Manage other users, ", enable: false },
      ];
      let str = "";
      for (let i in perms) {
        if (perms[i].enable === cond) {
          str += perms[i].label;
        }
      }
      return str;
    },
  },
  created() {
    this.$http
      .get(`/api/v1/group/info/${this.id}`)
      .then((response) => {
        this.group = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

      this.$http
      .get("/api/v1/group/user/members/" + this.id)
      .then((response) => {
        response.data.forEach((groupUser) => {
          this.groupUsers.push(groupUser.user);
        });
      })
      .catch((error) => {
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    this.getCredentials();
  },
};
</script>
