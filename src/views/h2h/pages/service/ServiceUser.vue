<template>
  <div class="animated fadeIn">
    <p-loading class="my-5" v-if="loading" />
    <p-card v-else-if="errorStatus">
      <p-error
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
    </p-card>
    <p-card v-else>
      <p-modal @confirm="userDelete()" :message="modalMessage"></p-modal>
      <p-card>
        <p-initial
          v-if="listUser.length === 0"
          icon="person-plus"
          header="Not found any assigned group."
          message="Please assign a group."
        />
        <b-table v-else :fields="fields" :items="listUser">
          <template v-slot:cell(user)="row">
            <b-button
              :disabled="locked"
              variant="link"
              @click="userDetailPage(row.item.user)"
              class="profile-button"
            >
              <p-profile-avatar
                :profileUsername="row.item.user.username"
                :username="
                  row.item.user.first_name + ' ' + row.item.user.last_name
                "
                :size="30"
                :imageWidth="'30px'"
                :imageHeight="'auto'"
              />
            </b-button>
          </template>
          <template v-slot:cell(group)="row">
            <span>{{ row.item.group.groupname }}</span>
          </template>
          <template v-slot:cell(membership_type)="row">
            <span>{{ row.item.membershipType }}</span>
          </template>
          <template v-slot:cell(membership_role)="row">
            <b-badge
              :variant="
                row.item.membershipRole == 'ADMIN' ? 'primary' : 'secondary'
              "
              class="p-1"
            >
              {{ row.item.membershipRole }}
            </b-badge>
          </template>
          <template v-slot:cell(created_at)="row">
            <!-- <span
              v-b-tooltip.hover-bottom
              :title="
                $moment(row.item.createdAt).format(
                  'dddd, MMMM Do YYYY, h:mm:ss a'
                )
              "
              class="text-info"
            >
              {{ $moment(row.item.createdAt).fromNow() }}
            </span> -->
            <p-timing :start-date="row.item.createdAt" />
          </template>
        </b-table>
      </p-card>
    </p-card>
  </div>
</template>

<script>
export default {
  props: ["id"],
  components: {},
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      fields: [
        { key: "user", label: "User" },
        { key: "group", label: "Group" },
        { key: "membership_type", label: "Membership Type" },
        { key: "membership_role", label: "Membership Role" },
        { key: "created_at", label: "Join Time" },
      ],
      permissionRequired: false,
      loading: true,
      expiretime: null,
      selectedDate: null,
      users: [],
      tenants: [],
      selectedUsers: [],
      selectedTenants: [],
      locked: true,
      user: {},
      listUser: [],
      groupUser: [],
      selectedPolicy: null,
      policies: [],
      owner: "",
      selectedUser: {
        username: "",
        userId: "",
      },
      modalMessage: "",
      groups: [],
      selectedGroup: null,
      serviceName: "",
      serviceGroup: "",
      userAssignLock: true,
      selectedGroupDate: null,
      selectedGroupPolicy: null,
    };
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
    responsive() {
      return screen.width < 500;
    },
  },
  methods: {
    clearForm() {
      this.selectedUsers = [];
      this.selectedPolicy = "";
      this.selectedDate = null;
      this.expiredate = null;
      this.expiretime = null;
    },
    clearDate() {
      this.selectedDate = null;
    },
    userDelete() {
      let form = {
        userid: this.selectedUser.userId,
        serviceid: this.id,
      };

      this.$http
        .delete("/api/userservice/delete", { data: form })
        .then((response) => {
          if (response.status === 200) {
            this.$bvToast.toast(`Service user is unassigned!`, {
              title: "Session Notification",
              variant: "danger",
              autoHideDelay: 5000,
            });
            this.updateTable();
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Delete operation has error!	";
        });
    },
    assignment(item) {
      console.log(item);
      this.$refs.inviteMember.activate();
      if (item.user.first_name == null) {
        item.user.first_name = "";
      }
      this.selectedUsers.push(item.user);
    },
    userAssign() {
      let users = [];
      for (let i = 0; i < this.selectedUsers.length; i++) {
        users.push(this.selectedUsers[i].userId);
      }
      let policyid;
      if (this.selectedPolicy) {
        policyid = this.selectedPolicy.id;
      }

      let data = {
        users: users,
        policyid: policyid,
        expiredate: this.selectedDate,
        expiretime: this.expiretime,
      };

      this.$http
        .post("/api/userservice/service/" + this.id, data)
        .then(() => {
          this.$bvToast.toast(`Service users updated!`, {
            title: "Session Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.updateTable();
        })
        .catch((error) => {
          console.log(error);
          this.$bvToast.toast(error.data, {
            title: "Session Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Update operation has error!	";
        });

      this.clearForm();
    },
    userDetailPage(item) {
      this.$router.push({
        name: "User Detail",
        params: {
          id: item.userId,
        },
      });
    },
    groupDetailPage(item) {
      this.$router.push({
        name: "Group Detail",
        params: {
          id: item.group.groupid,
        },
      });
    },
    customLabelUser({ first_name, last_name, username }) {
      if (last_name == null) {
        last_name = "";
      }
      if (first_name == null) {
        first_name = "";
      }
      return `${first_name} ${last_name} (${username})`;
    },
    updateTable() {
      this.$http
        .get("/api/userservice/" + this.id)
        .then((response) => {
          this.listUser = response.data.userPolicyWrappers;
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    addTag1(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.value.push(tag);
    },
    deleteButton(item) {
      this.selectedUser.userId = item.user.userId;
      this.selectedUser.username = item.user.username;
      this.modalMessage =
        "Are you sure you want to delete the user with the name " +
        this.selectedUser.username +
        " ?";
    },
    addTagGroup(newTag) {
      console.log(newTag);
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.groups.push(tag);
      this.value.push(tag);
    },
    setForm(item) {
      this.clearForm();
      this.selectedUsers.push(item.user);
      this.policies.forEach((policy) => {
        if (policy.name === item.policyname) this.selectedPolicy = policy;
      });
      this.selectedDate = item.expiredatetime;
    },
    clearGroupForm() {
      this.selectedGroup = this.serviceGroup;
    },
    inviteGroupButton() {
      return this.selectedGroup == null || this.selectedGroup.length === 0;
    },
    uninviteGroup(item) {
      this.$http
        .delete("/api/service/groups/" + this.id + "/" + item.groupid)
        .then(() => {
          this.getOtherGroupUsers();
          this.$bvToast.toast(`Service Group is deleted!`, {
            title: "Service Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
          this.$bvToast.toast(`Service Group is not deleted!`, {
            title: "Service Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
        });
    },
    inviteGroup() {
      let groupList = [];

      this.selectedGroup.forEach((group) => {
        groupList.push(group.groupid);
      });

      let data = {
        groupList: groupList,
        expireDate: this.selectedGroupDate,
      };

      this.$http
        .post("/api/service/groups/" + this.id, data)
        .then(() => {
          this.getOtherGroupUsers();
          this.clearGroupForm();
          this.$bvToast.toast(`Service Group is updated!`, {
            title: "Service Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
          this.$bvToast.toast(error.data, {
            title: "Service Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
        });
    },
    getFromDate(date) {
      return this.$moment(date).fromNow();
    },
    getOtherGroupUsers() {
      this.otherGroupUsers = [];
      // this.$http
      //   .get("/api/service/groups/" + this.id)
      //   .then((response) => {
      //     response.data.forEach((group) => {
      //       if (this.groupUser[0].group.groupid !== group.group.groupid) {
      //         group.users.forEach((user) => {
      //           let data = {
      //             group: group.group,
      //             user: user,
      //             expireDate: group.expireDate,
      //           };
      //           this.otherGroupUsers.push(data);
      //         });
      //       }
      //     });
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //     this.errorStatus = true;
      //     this.errorResponse = error;
      //     this.errorHeader = "Something went wrong!";
      //   });
    },
  },
  created() {
    this.$http
      .get("/api/v1/user/who")
      .then((response) => {
        this.user = response.data;

        if (this.user.role === "Admin") {
          // this.$http
          //   .post("/api/v1/group")
          //   .then((response2) => {
          //     this.groups = response2.data;
          //   })
          //   .catch((error) => {
          //     console.log(error);
          //   });
        } else {
          this.$http
            .get("/api/v1/group/user/" + this.user.userId)
            .then((response2) => {
              this.groups = response2.data;
            })
            .catch((error) => {
              console.log(error);
            });
        }
        this.locked = this.user.role !== "Admin";
      })
      .catch((error) => {
        console.log(error);
      });

    this.$http
      .get("/api/v1/user")
      .then((response) => {
        this.users = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    this.$http
      .get("/api/v1/policy/proxy", {})
      .then((response) => {
        this.policies = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
    this.groupUser = [];
    this.$http
      .get("/api/v1/service/members/" + this.id)
      .then((response) => {
        this.listUser = response.data;
        //this.groupUser = response.data.groupuserslist;

        this.getOtherGroupUsers();
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    this.$http
      .get("/api/v1/service/id/" + this.id)
      .then((response) => {
        this.owner = response.data.who_create;
        this.serviceName = response.data.name;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
  },
};
</script>
