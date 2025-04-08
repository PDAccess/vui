<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col>
          <div v-if="false" class="form-group">
            <p-select
              :multiple="true"
              :options="roles"
              :taggable="true"
              label="rolename"
              placeholder="Select Role"
              track-by="userId"
              v-model="selectedRoles"
            ></p-select>
          </div>
        </b-col>
        <b-col cols="1.2" style="padding-right: 25px">
          <b-button
            :to="'/ldap/servers/' + id + '/create/role'"
            variant="success"
            style="margin-bottom: 5px"
            >Create Role</b-button
          >
        </b-col>
      </b-row>
      <p-loading v-if="loading" class="my-5" message="Loading..." />
      <p-error
        v-else-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <div v-else-if="roles.length == 0">
        <p-empty message="You don't have any LDAP role." />
      </div>
      <div v-else>
        <b-row>
          <b-col :lg="tableColumn" class="item-table">
            <b-table
              fixed
              :fields="fields"
              :items="roles"
              :responsive="responsive"
              hover
              show-empty
              small
            >
              <template v-slot:cell(role)="row">
                <span class="text-info"> {{ row.item.name }}</span>
              </template>
              <template v-slot:cell(description)="row">
                <span class="text-info"> {{ row.item.description }}</span>
              </template>
              <template v-slot:cell(actions)="row">
                <b-button
                  @click.stop="details(row.item)"
                  type="info"
                  variant="outline-primary"
                >
                  <em class="fa fa-info"></em>
                </b-button>
              </template>
            </b-table>
          </b-col>
          <transition name="fade" v-on:after-leave="tableColumn = 12">
            <b-col lg="6" v-if="showDetailCard">
              <b-card header-tag="header" style="width: auto">
                <div slot="header">
                  <b-button @click="closeDetail" style="float: right"
                    ><em class="fa fa-remove"></em
                  ></b-button>
                  <b-row align-h="between">
                    <b-col lg="6" sm="12">
                      <b-button-group class="ml-2">
                        <b-button
                          @click.stop="edits($event.target)"
                          variant="outline-primary"
                        >
                          Edit
                        </b-button>
                        <b-button
                          @click.stop="deleteButton($event.target)"
                          v-b-modal.modal
                          variant="outline-danger"
                        >
                          Delete
                        </b-button>
                      </b-button-group>
                    </b-col>
                    <b-col lg="6" sm="12">
                      <h4 class="text-right mr-3">
                        {{ roleData.role_name }}
                      </h4>
                    </b-col>
                  </b-row>
                </div>
                <p-modal
                  @confirm="deleteRole()"
                  :message="modalMessage"
                ></p-modal>
                <b-row style="margin-top: 15px">
                  <b-col v-if="subLoading">
                    <p-loading class="my-5" message="Loading..." />
                  </b-col>
                  <b-col v-else>
                    <b-row>
                      <b-col>
                        <div class="form-group">
                          <label for="tags-separators">Commands:</label>
                          <p-select
                            v-model="commands"
                            tag-placeholder="Add this as new Commands"
                            placeholder="Add Commands"
                            disabled
                            :options="[]"
                            :multiple="true"
                            :taggable="true"
                          >
                          </p-select>
                        </div>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col>
                        <div class="form-group">
                          <label class="typo__label">Users</label>
                          <p-select
                            v-model="selectedUsers"
                            tag-placeholder="Add this as new users"
                            placeholder="Add Users"
                            disabled
                            :options="users"
                            :multiple="true"
                            :taggable="true"
                          >
                          </p-select>
                        </div>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
            <b-col lg="6" v-if="showEditCard">
              <b-card header-tag="header" style="width: auto">
                <div slot="header">
                  <b-button @click="closeEdit" style="float: right"
                    ><em class="fa fa-remove"></em
                  ></b-button>
                  <b-row align-h="between">
                    <b-col lg="6" sm="12">
                      <b-button-group class="ml-2">
                        <b-button
                          @click.stop="editRole($event.target)"
                          variant="outline-success"
                        >
                          Submit
                        </b-button>
                        <b-button
                          @click.stop="editCancel"
                          variant="outline-danger"
                        >
                          Cancel
                        </b-button>
                      </b-button-group>
                    </b-col>
                    <b-col lg="6" sm="12">
                      <h4 class="text-right mr-3">
                        {{ roleData.role_name }}
                      </h4>
                    </b-col>
                  </b-row>
                </div>
                <b-row style="margin-top: 15px">
                  <b-col>
                    <b-row>
                      <b-col>
                        <div class="form-group">
                          <label for="tags-separators">Commands:</label>
                          <p-select
                            v-model="editCommands"
                            tag-placeholder="Add this as new Commands"
                            placeholder="Add Commands"
                            :options="commands"
                            :multiple="true"
                            :taggable="true"
                            @tag="addTag"
                          >
                          </p-select>
                        </div>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col>
                        <div class="form-group">
                          <label class="typo__label">Users</label>
                          <p-select
                            v-model="selectedEditUsers"
                            tag-placeholder="Add this as new user"
                            placeholder="Add Users"
                            :options="users"
                            :multiple="true"
                            :taggable="true"
                          >
                          </p-select>
                        </div>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </transition>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";

export default {
  name: "app",
  props: ["id"],
  components: {
    InfiniteLoading,
  },
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      selectedRoles: [],
      loading: true,
      subLoading: false,
      roles: [],
      fields: [
        { key: "role", label: "Role Name" },
        { key: "description", label: "Description" },
        { key: "actions", label: "Actions" },
      ],
      dataObject: {},
      roleData: {
        role_id: "",
        role_name: "",
        role_description: "",
        created_time: "",
      },
      tableColumn: 12,
      showDetailCard: false,
      showEditCard: false,
      modalid: "",
      modalname: "",
      commands: [],
      editCommands: [],
      selectedUsers: [],
      selectedEditUsers: [],
      users: [],
      modalMessage: "",
    };
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  methods: {
    details(item) {
      this.commands = [];
      this.editCommands = [];
      this.selectedUsers = [];
      this.selectedEditUsers = [];
      this.roleData.role_id = "1";
      this.roleData.role_name = item.name;
      this.roleData.role_description = item.description;
      this.roleData.created_time = item.created_time;
      this.showDetailCard = true;
      this.tableColumn = 6;

      this.subLoading = true;
      this.$http
        .post("/api/ldap/v1/command/" + this.id + "/" + this.roleData.role_name)
        .then((response) => {
          if ((response.status = 200)) {
            this.commands = response.data[0]["sudocommand"];
          }
        })
        .catch(function (error) {
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });

      this.dataObject = {
        name: this.id,
      };

      this.$http
        .get("/api/ldap/v1/role/" + this.id + "/" + this.roleData.role_name)
        .then((response) => {
          if ((response.status = 200)) {
            this.selectedUsers = response.data["members"];
            this.subLoading = false;
          }
        })
        .catch(function (error) {
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    edits() {
      this.editCommands = this.commands;
      this.selectedEditUsers = this.selectedUsers;
      this.showDetailCard = false;
      this.showEditCard = true;
      this.tableColumn = 6;
    },
    editRole() {
      this.showEditCard = false;
      this.showDetailCard = true;
      this.tableColumn = 6;
      this.subLoading = true;

      //Save Commands
      this.$http
        .put(
          "/api/ldap/v1/command/" + this.id + "/" + this.roleData.role_name,
          this.editCommands
        )
        .then((response) => {
          if ((response.status = 200)) {
            this.commands = this.editCommands;
            this.subLoading = false;
          }
        })
        .catch(function (error) {
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Edit operation has error!";
        });

      //Save Users
      this.$http
        .put(
          "/api/ldap/v1/role/" + this.id + "/" + this.roleData.role_name,
          this.selectedEditUsers
        )
        .then((response) => {
          if ((response.status = 200)) {
            this.selectedUsers = this.selectedEditUsers;
            this.subLoading = false;
          }
        })
        .catch(function (error) {
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Edit operation has error!";
        });
    },
    editCancel() {
      this.showEditCard = false;
      this.showDetailCard = true;
    },
    deleteRole() {
      //deleting role item
    },
    deleteButton() {
      this.modalid = this.roleData.role_id;
      this.modalname = this.roleData.role_name;
      this.modalMessage =
        "Are you sure you want to delete the role with the name " +
        this.modalname +
        " ?";
    },
    closeDetail() {
      this.showDetailCard = false;
    },
    closeEdit() {
      this.showEditCard = false;
    },
    addTag(newTag) {
      const tag = newTag;
      this.commands.push(tag);
    },
  },
  created() {
    this.dataObject = {
      name: this.id,
    };

    this.loading = true;
    this.$http
      .post("/api/ldap/v1/role", this.dataObject)
      .then((response) => {
        if ((response.status = 200)) {
          this.roles = response.data;
          this.loading = false;
        }
      })
      .catch(function (error) {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    this.$http
      .post("/api/ldap/v1/user/", this.dataObject)
      .then((response) => {
        if ((response.status = 200)) {
          this.users = response.data.map((user) => user["uid"]);
        }
      })
      .catch(function (error) {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
  },
};
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
  .fade-leave-to

    /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.col-lg-6 {
  padding-right: 0px;
  padding-left: 0px;
}
</style>
