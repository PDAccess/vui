<template>
  <div class="animated fadeIn">
    <p-card>
      <p-loading v-if="loading" class="my-5" message="Loading..." />
      <p-error
        v-else-if="errorStatusAssign"
        header="Assign operation has error!"
        :errorResponse="errorResponse"
        @reload="userAssign"
      />
      <p-initial
        v-else-if="credentialPermissions.length === 0"
        icon="person-plus"
        header="Not found any assigned user."
        message="Please assign an user."
      />
      <p-card v-else>
        <b-table :fields="fields" :items="credentialPermissions">
          <template v-slot:cell(user)="row">
            <div class="d-flex align-items-center">
              <div>
                <b-button
                  @click="userDetailPage(row.item.user)"
                  v-if="row.item.user != null"
                  variant="link"
                >
                  <p-profile-avatar
                    :profileUsername="row.item.user.username"
                    :username="
                      row.item.user.first_name +
                      row.item.user.last_name
                    "
                    :size="30"
                    :imageWidth="'30px'"
                    :imageHeight="'auto'"
                  />
                </b-button>
              </div>
            </div>
          </template>
          <template v-slot:cell(can_connect)="row">
            <b-form-checkbox
              class="mt-1"
              name="checkbox-1"
              v-model="row.item.permissions['CAN_CONNECT']"
              switch
              @change="onChangePermission(row.item, 'CAN_CONNECT', $event)"
            >
            </b-form-checkbox>
          </template>
          <template v-slot:cell(can_see_password)="row">
            <b-form-checkbox
              class="mt-1"
              name="checkbox-1"
              v-model="row.item.permissions['CAN_SEE_PASSWORD']"
              switch
              @change="onChangePermission(row.item, 'CAN_SEE_PASSWORD', $event)"
            >
            </b-form-checkbox>
          </template>
          <template v-slot:cell(can_change_password)="row">
            <b-form-checkbox
              class="mt-1"
              name="checkbox-1"
              v-model="row.item.permissions['CAN_CHANGE_PASSWORD']"
              switch
              @change="
                onChangePermission(row.item, 'CAN_CHANGE_PASSWORD', $event)
              "
            >
            </b-form-checkbox>
          </template>
          <template v-slot:cell(can_authorize_other_users)="row">
            <b-form-checkbox
              class="mt-1"
              name="checkbox-1"
              v-model="row.item.permissions['CAN_AUTHORIZE_OTHER_USERS']"
              switch
              @change="
                onChangePermission(
                  row.item,
                  'CAN_AUTHORIZE_OTHER_USERS',
                  $event
                )
              "
            >
            </b-form-checkbox>
          </template>
          <template v-slot:cell(can_join_sessions)="row">
            <b-form-checkbox
              class="mt-1"
              name="checkbox-1"
              v-model="row.item.permissions['CAN_JOIN_SESSIONS']"
              switch
              @change="
                onChangePermission(row.item, 'CAN_JOIN_SESSIONS', $event)
              "
            >
            </b-form-checkbox>
          </template>
          <template v-slot:cell(can_connection_with_request_permission)="row">
            <b-form-checkbox
              class="mt-1"
              name="checkbox-1"
              v-model="
                row.item.permissions['CAN_CONNECTION_WITH_REQUEST_PERMISSION']
              "
              switch
              @change="
                onChangePermission(
                  row.item,
                  'CAN_CONNECTION_WITH_REQUEST_PERMISSION',
                  $event
                )
              "
            >
            </b-form-checkbox>
          </template>
          <template v-slot:cell(can_manage_other_users)="row">
            <b-form-checkbox
              class="mt-1"
              name="checkbox-1"
              v-model="row.item.permissions['CAN_MANAGE_OTHER_USERS']"
              switch
              @change="
                onChangePermission(row.item, 'CAN_MANAGE_OTHER_USERS', $event)
              "
            >
            </b-form-checkbox>
          </template>
        </b-table>
      </p-card>
    </p-card>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { PermissionApi } from "@/generated/cmanager/index.ts"
import axios from "axios";
export default {
  props: ["id", "credentialid"],
  components: {},
  data() {
    return {
      credentialPermissions: [],
      errorStatus: false,
      errorStatusAssign: false,
      errorResponse: "",
      hSpacing: "20px",
      themeStyles: {
        wrapper: {
          background: "",
          color: "#fafafa",
          border: "0",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.14), 0 6px 20px 0 rgba(0, 0, 0, 0.13)",
          borderRadius: "5px",
        },
        header: {
          padding: `20px ${this.hSpacing}`,
        },
        headerHorizontalDivider: {
          borderTop: "solid rgba(255, 255, 255, 0.2) 1px",
          width: "80%",
        },
        weekdays: {
          color: "#000000", // New color
          fontWeight: "100", // And bolder font weight
          padding: `20px ${this.hSpacing} 5px ${this.hSpacing}`,
          fontSize: "0.8rem",
        },
        weeks: {
          padding: `0 ${this.hSpacing} ${this.hSpacing} ${this.hSpacing}`,
        },
        dayContent: {
          fontSize: "0.8rem",
        },
      },
      selectedDate: null,
      users: [],
      roles: ["USER", "ADMIN"],
      tenants: [],
      selectedUsers: [],
      selectedRole: null,
      locked: true,
      listUser: [],
      selectedServices: null,
      groupServices: [],
      services: [],
      loadingCheck: 0,
      loading: true,
      groupName: "",
      modalMessage: "",
      deletingUser: null,
      permissions: [
        { label: "Can connection", enable: false },
        { label: "Can see password", enable: false },
        { label: "Can change password ", enable: false },
        { label: "Can authorize other users", enable: false },
        { label: "Can join sessions", enable: false },
        { label: "Can connection with request permission", enable: false },
        { label: "manage other users", enable: false },
      ],
      fields: [
        { key: "user", label: "User" },
        { key: "can_connect", label: "connect" },
        { key: "can_see_password", label: "see password" },
        { key: "can_change_password", label: "change password" },
        {
          key: "can_authorize_other_users",
          label: "authorize other users",
        },
        { key: "can_join_sessions", label: "join sessions" },
        {
          key: "can_connection_with_request_permission",
          label: "connection with request permission",
        },
        { key: "can_manage_other_users", label: "manage other users" },
      ],
    };
  },
  watch: {
    loadingCheck() {
      if (this.loadingCheck === 3) this.loading = false;
    },
  },
  computed: {
    inputState() {
      if (!this.selectedValue) {
        return {
          type: "is-danger",
          message: "Date required.",
        };
      }
      return {
        type: "is-primary",
        message: "",
      };
    },
    ...mapGetters({
      user: "auth/user",
    }),
    responsive() {
      return screen.width < 500;
    },
  },
  methods: {
    onChangePermission(item, key, value) {
      let permissionsSet = [];
      for (const [key, value] of Object.entries(item.permissions)) {
        if (item.permissions[key]) {
          permissionsSet.push(key);
        }
      }

      let data = {
        permissions: [
          {
            permissionsSet: permissionsSet,
            user: item.user.userId,
          }
        ]
      };


      new PermissionApi(this.$cmanagerHttpConfig, undefined, this.$http).upsertPermission(this.credentialid, data )
        .then((response) => {
          let message = value
            ? `${item.user.username} user has been granted "${key
                .replaceAll("_", " ")
                .toUpperCase()}" permission.`
            : `Removed "${key
                .replaceAll("_", " ")
                .toUpperCase()}" permission from ${
                item.user.username
              } user.`;
          this.$bvToast.toast(message, {
            title: "Permission Updated",
            variant: "success",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
          item.permissions[key] = !value;
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    userDetailPage(user) {
      this.$router.push({
        name: "User Detail",
        params: { id: user.userId },
      });
    },
    getFromDate(date) {
      return this.$moment(date).fromNow();
    },
    deleteUser(item) {
      this.deletingUser = item;
      console.log(this.deletingUser);
      this.modalMessage =
        "Are you sure you want to delete the user with the name " +
        this.deletingUser.user.username +
        " ?";
    },
    userDelete() {
      this.$http
        .delete("/api/v1/group/user/delete", {
          data: {
            userid: this.deletingUser.user.userId,
            groupid: this.id,
          },
        })
        .then(() => {
          this.$bvToast.toast(`Group user is unassigned!`, {
            title: "Group Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
          this.updateTable();
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    userAssign() {
      let users = [];

      for (let i = 0; i < this.selectedUsers.length; i++) {
        users.push(this.selectedUsers[i].userId);
      }

      let data = {
        userlist: users,
        expiredate: this.selectedDate,
        expiretime: this.expiretime,
        role: this.selectedRole,
      };

      this.$http
        .post("/api/v1/group/user/" + this.id, data)
        .then(() => {
          this.$bvToast.toast(`Group user is updated!`, {
            title: "Group Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.updateTable();
          this.clearForm();
        })
        .catch((error) => {
          this.$bvToast.toast(error.data, {
            title: "Group Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
          this.errorStatusAssign = true;
          this.errorResponse = error;
        });
    },
    clearForm() {
      this.selectedDate = null;
      this.selectedUsers = [];
    },
    customLabel({ first_name, last_name, username }) {
      return `${first_name} ${last_name} (${username})`;
    },
    addTag1(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.value.push(tag);
    },
    userDetailPage(user) {
      this.$router.push({
        name: "User Detail",
        params: {
          id: user.userId,
        },
      });
    },
    updateTable() {
      this.$http
        .get("/api/v1/credentials/" + this.id)
        .then((response) => {
          this.listUser = response.data;
        })
        .catch((error) => {
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    hasPermission(user, type) {
      return (
        user.permissionEntity != null &&
        user.permissionEntity.permissionsSet.includes(type)
      );
    },
  },
  created() {
    let getGroupMemberRequest = this.$http.get("/api/v1/group/user/members/" + this.id);
    let getCredentialPermissionRequest = new PermissionApi(this.$cmanagerHttpConfig, undefined, this.$http).getCredentialPermission(this.credentialid)
    axios
      .all([getGroupMemberRequest, getCredentialPermissionRequest])
      .then(
        axios.spread((...results) => {
          let members = results[0].data;
          let credentialPermissions = results[1].data.permissions;
          
          console.log("members:", members)

          members.forEach(member => {
            let permissions = credentialPermissions.filter(permission => permission.user == member.user.userId)
            let permission = {}
            if (permissions.length == 0) {
              permission["CAN_CONNECT"] = false
              permission["CAN_SEE_PASSWORD"] = false
              permission["CAN_CHANGE_PASSWORD"] = false
              permission["CAN_AUTHORIZE_OTHER_USERS"] = false
              permission["CAN_JOIN_SESSIONS"] = false
              permission["CAN_CONNECTION_WITH_REQUEST_PERMISSION"] = false
              permission["CAN_MANAGE_OTHER_USERS"] = false
            } else {
              let permissionsSet = permissions[0].permissionsSet
              permission["CAN_CONNECT"] = permissionsSet.includes("CAN_CONNECT")
              permission["CAN_SEE_PASSWORD"] = permissionsSet.includes("CAN_SEE_PASSWORD")
              permission["CAN_CHANGE_PASSWORD"] = permissionsSet.includes("CAN_CHANGE_PASSWORD")
              permission["CAN_AUTHORIZE_OTHER_USERS"] = permissionsSet.includes("CAN_AUTHORIZE_OTHER_USERS")
              permission["CAN_JOIN_SESSIONS"] = permissionsSet.includes("CAN_JOIN_SESSIONS")
              permission["CAN_CONNECTION_WITH_REQUEST_PERMISSION"] = permissionsSet.includes("CAN_CONNECTION_WITH_REQUEST_PERMISSION")
              permission["CAN_MANAGE_OTHER_USERS"] = permissionsSet.includes("CAN_MANAGE_OTHER_USERS");
            }
            this.credentialPermissions.push({
              user: member.user,
              permissions: permission,
            });
          });

          this.loading = false;
        })
      )
  },
};
</script>
