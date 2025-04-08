<template>
  <div class="animated fadeIn">
    <p-card>
      <p-modal @confirm="userDelete()" :message="modalMessage"></p-modal>
      <div class="mt-4">
        <h5>
          You can manage a new member to <strong> {{ groupName }} </strong>
        </h5>
        <p-error
          v-if="errorStatusAssign"
          header="Assign operation has error!"
          :errorResponse="errorResponse"
          @reload="userAssign"
        />
        <p-loading v-else-if="loading" class="my-5" message="Loading..." />

        <b-container v-else class="mt-3" fluid>
          <div class="form-group">
            <label center>Users</label>
            <p-select
              id="groupUserSelect"
              :disabled="locked"
              v-model="selectedUsers"
              :options="users"
              track-by="userId"
              placeholder="Select Users"
              :multiple="true"
              :taggable="true"
              @tag="addTag1"
              :custom-label="customLabel"
              :show-labels="false"
            >
              <template slot="singleLabel" slot-scope="props">
                <span class="option__title">
                  {{ props.option.username }}
                </span>
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
          </div>
          <div class="form-group">
            <label center>Expire Date/Time</label>
            <p-date-picker
              id="groupExpireTime"
              @val="selectedDate = $event"
              :select-date="selectedDate"
              mode="dateTime"
              :clearBtn="true"
              :isRange="false"
              placeHolder="Select expire date/time"
            />
          </div>
          <div class="form-group">
            <label center>Group Role</label>
            <p-select
              id="groupUserSelect"
              v-model="selectedRole"
              :options="roles"
              placeholder="Select Group role"
            />
          </div>
          <div class="d-flex justify-content-end">
            <b-button
              :disabled="selectedUsers.length === 0 || selectedRole == null"
              @click.stop="userAssign"
              variant="success"
              class="mr-2"
              >Assign
            </b-button>
            <b-button @click.stop="clearForm()" variant="primary"
              >Clear
            </b-button>
          </div>
        </b-container>

        <span class="mt-2" v-if="!loading">
          Existing members and group members
          <b-badge variant="warning" pill>{{ listUser.length }}</b-badge>
        </span>

        <p-error
          v-if="errorStatus"
          header="List operation has error!"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
        <p-card v-else-if="!loading" class="mt-3">
          <b-container fluid>
            <p-initial
              v-if="listUser.length === 0"
              icon="person-plus"
              header="Not found any assigned user."
              message="Please assign an user."
            />
            <ul v-else class="list-group list-group-flush">
              <li
                class="list-group-item"
                v-for="(item, index) in listUser"
                v-bind:key="index"
              >
                <b-row
                  class="d-flex justify-content-between align-items-center"
                >
                  <b-col lg="2">
                    <b-button
                      variant="link"
                      @click="userDetailPage(item)"
                      class="profile-button"
                    >
                      <p-profile-avatar
                        :profileUsername="item.user.username"
                        :username="
                          item.user.first_name + ' ' + item.user.last_name
                        "
                        :size="30"
                        :imageWidth="'30px'"
                        :imageHeight="'auto'"
                      />
                    </b-button>
                  </b-col>
                  <b-col lg="2">
                    <em
                      v-if="item.expiredatetime"
                      class="text-info"
                      v-b-tooltip.top
                      title="Expire Date"
                    >
                      {{ getFromDate(item.expiredatetime) }}
                    </em>
                  </b-col>
                  <b-col lg="2">
                    <em
                      v-if="item.createdAt"
                      class="text-info"
                      v-b-tooltip.top
                      title="Created At"
                    >
                      {{ getFromDate(item.createdAt) }}
                    </em>
                  </b-col>
                  <b-col lg="2">
                    <b-badge
                      :variant="
                        item.membershipRole == roles[1]
                          ? 'primary'
                          : 'secondary'
                      "
                      class="p-1"
                    >
                      {{ item.membershipRole }}
                    </b-badge>
                  </b-col>
                  <b-col lg="1">
                    <b-badge
                      v-if="item.membershipType === 'ldap'"
                      variant="primary"
                    >
                      LDAP Member
                    </b-badge>
                    <b-button
                      v-else
                      v-b-modal.modal
                      variant="danger"
                      v-b-tooltip.top
                      title="Delete"
                      @click.stop="deleteUser(item)"
                      ><em class="fa fa-trash"></em>
                    </b-button>
                  </b-col>
                </b-row>
              </li>
            </ul>
          </b-container>
        </p-card>
      </div>
    </p-card>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: ["id"],
  components: {},
  data() {
    return {
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
    userDetailPage(item) {
      this.$router.push({
        name: "User Detail",
        params: {
          id: item.user.userId,
        },
      });
    },
    updateTable() {
      this.$http
        .get("/api/v1/group/user/members/" + this.id)
        .then((response) => {
          this.listUser = response.data;
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
  },
  created() {
    this.locked = this.user.role !== "Admin";
    this.loadingCheck++;

    this.$http
      .get("/api/v1/group/info/" + this.id)
      .then((response) => {
        this.groupName = response.data.groupname;
        this.loadingCheck++;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
      });

    

    this.$http
      .get("/api/v1/user", {})
      .then((response) => {
        this.users = response.data;
        this.loadingCheck++;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
      });

    this.$http
      .get("/api/v1/group/user/members/" + this.id)
      .then((response) => {
        this.listUser = response.data;
        this.loadingCheck++;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
      });
  },
};
</script>
