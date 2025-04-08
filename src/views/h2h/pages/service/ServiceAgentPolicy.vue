<template>
  <div class="animated fadeIn">
    <p-card>
      <b-row class="mb-2" style="position: absolute; right: 10px">
        <b-col class="d-flex justify-content-end policy-create-field">
          <b-dropdown id="dropdown-left" variant="success">
            <template v-slot:button-content>
              <i class="fa fa-plus-circle mr-2" aria-hidden="true"></i>Create Service Agent Policy
            </template>
            <b-dropdown-item
              @click="
                $router.push({
                  path: `/service/create-command-agentpolicy/${id}`,
                })
              "
            >
              COMMAND<br />
              <span style="font-size: 0.5rem">Command Policy</span>
            </b-dropdown-item>
            <b-dropdown-item
              @click="
                $router.push({ path: `/service/create-file-agentpolicy/${id}` })
              "
            >
              FILE<br />
              <span style="font-size: 0.5rem">File Policy</span>
            </b-dropdown-item>
          </b-dropdown>
        </b-col>
      </b-row>
      <b-tabs no-body pills content-class="mt-2">
        <b-tab active title="File Policy">
          <b-row>
            <b-col>
              <p-modal
                id="filePolicyModal"
                ref="filePolicyModal"
                @confirm="deleteFilePolicy()"
                :message="modalMessage"
              ></p-modal>
              <p-loading
                v-if="filePolicyLoading"
                class="my-5"
                message="Loading..."
              />
              <p-error
                v-else-if="errorStatus"
                :header="errorHeader"
                :errorResponse="errorResponse"
                @reload="$router.go()"
              />
              <div v-else-if="filePolicies.length === 0">
                <p-initial
                  icon="plus-circle"
                  header="You don't have any agent file policy."
                  message="Please create an agent file policy."
                />
              </div>
              <b-table
                v-else
                :items="filePolicies"
                :fields="filePolicyFields"
                fixed
                show-empty
              >
                <template v-slot:cell(users)="row">
                  <em v-if="row.item.users.length === 0">Not Assigned!</em>
                  <b-badge
                    class="mr-1"
                    v-else
                    :key="index"
                    v-for="(user, index) in row.item.users"
                    variant="primary"
                    >{{ user.username }}</b-badge
                  >
                </template>
                <template v-slot:cell(paths)="row">
                  <em v-if="row.item.paths.length == 0">Not Assigned!</em>
                  <b-badge
                    v-else
                    class="mr-1"
                    :key="path"
                    v-for="path in row.item.paths"
                    variant="success"
                    >{{ path }}</b-badge
                  >
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
                    <b-dropdown-item
                      @click.stop="editFilePolicy(row.item)"
                      variant="primary"
                      ><em class="fa fa-edit"></em>Edit</b-dropdown-item
                    >
                    <b-dropdown-item
                      @click.stop="deleteButton(row.item)"
                      variant="danger"
                      v-b-modal.filePolicyModal
                      ><em class="fa fa-trash"></em>Delete</b-dropdown-item
                    >
                  </b-dropdown>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Command Policy">
          <b-row>
            <b-col>
              <p-modal
                id="commandPolicyModal"
                ref="commandPolicyModal"
                @confirm="deleteCommandPolicy()"
                :message="modalMessage"
              ></p-modal>
              <p-loading
                v-if="commandPolicyLoading"
                class="my-5"
                message="Loading..."
              />
              <p-error
                v-else-if="errorStatus"
                :header="errorHeader"
                :errorResponse="errorResponse"
                @reload="$router.go()"
              />
              <div v-else-if="commandPolicies.length == 0">
                <p-initial
                  icon="plus-circle"
                  header="You don't have any agent command policy."
                  message="Please create an agent command policy."
                />
              </div>
              <b-table
                v-else
                :items="commandPolicies"
                :fields="commandPolicyFields"
                fixed
                show-empty
              >
                <template v-slot:cell(users)="row">
                  <em v-if="row.item.users.length == 0">Not Assigned!</em>
                  <b-badge
                    class="mr-1"
                    v-else
                    v-for="(user, index) in row.item.users"
                    v-bind:key="index"
                    variant="primary"
                    >{{ user.username }}</b-badge
                  >
                </template>
                <template v-slot:cell(regexes)="row">
                  <em v-if="row.item.regexes.length == 0">Not Assigned!</em>
                  <b-badge
                    class="mr-1"
                    v-else
                    v-bind:key="index"
                    v-for="(regex, index) in row.item.regexes"
                    variant="success"
                    >{{ regex }}</b-badge
                  >
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
                    <b-dropdown-item
                      @click.stop="editCommandPolicy(row.item)"
                      variant="primary"
                      ><em class="fa fa-edit"></em>Edit</b-dropdown-item
                    >
                    <b-dropdown-item
                      @click.stop="deleteButton(row.item)"
                      variant="danger"
                      v-b-modal.commandPolicyModal
                      ><em class="fa fa-trash"></em>Delete</b-dropdown-item
                    >
                  </b-dropdown>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
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
      filePolicyLoading: true,
      commandPolicyLoading: true,
      filePolicyFields: [
        { key: "name", label: "Policy Name" },
        { key: "users", label: "Users" },
        { key: "paths", label: "Paths" },
        { key: "actions", label: "" },
      ],
      commandPolicyFields: [
        { key: "name", label: "Policy Name" },
        { key: "users", label: "Users" },
        { key: "regexes", label: "Regexes" },
        { key: "actions", label: "" },
      ],
      list_message: "d",
      item_id: 0,
      info: {
        name: "",
      },
      selected: null,
      services: [],
      formdata: {
        id: "",
        name: "",
        behavior: "",
        servicetype: "",
        servicemeta: "T",
        operatingsystem: "",
      },
      options: [
        {
          value: false,
          text: "BLOCK",
        },
        {
          value: true,
          text: "ALLOW",
        },
      ],
      details: "",
      commandPolicies: [],
      filePolicies: [],
      fields: {
        inventoryid: {
          label: "Service",
          sortable: true,
          class: "text-center",
        },
        regex: {
          label: "Regular Expression",
          sortable: true,
          class: "text-center",
        },
        status: {
          label: "Status",
          class: "text-center",
        },
      },
      modalMessage: "",
    };
  },
  methods: {
    editFilePolicy(item) {
      this.$router.push({
        path: `/service/${this.id}/file-agentpolicy/${item.id}`,
      });
    },
    editCommandPolicy(item) {
      this.$router.push({
        path: `/service/${this.id}/command-agentpolicy/${item.id}`,
      });
    },
    deleteButton(item, event) {
      this.item_id = item.id;
      this.list_message = item.name;
      this.modalMessage =
        "Are you sure you want to delete the selected " +
        this.list_message +
        " service agent policy?";
    },
    deleteFilePolicy() {
      this.$http
        .delete("/api/v1/filter/file/" + this.item_id)
        .then((response) => {
          console.log(this.filePolicies);
          console.log(this.item_id);

          for (let i = 0; i < this.filePolicies.length; i++) {
            if (this.filePolicies[i].id === this.item_id) {
              this.filePolicies.splice(i, 1);
              break;
            }
          }

          this.$bvToast.toast(
            `The agent file policy named ${this.list_message} has been deleted`,
            {
              title: "Agent Policy Notification",
              variant: "success",
              autoHideDelay: 5000,
            }
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteCommandPolicy() {
      this.$http
        .delete("/api/v1/filter/command/" + this.item_id)
        .then((response) => {
          for (let i = 0; i < this.commandPolicies.length; i++) {
            if (this.commandPolicies[i].id === this.item_id) {
              this.commandPolicies.splice(i, 1);
              break;
            }
          }

          this.$bvToast.toast(
            `The agent command policy named ${this.list_message} has been deleted`,
            {
              title: "Agent Policy Notification",
              variant: "success",
              autoHideDelay: 5000,
            }
          );
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Delete operation has error!	";
        });
    },
    deletePolicy() {
      this.$http
        .delete("/api/v1/policy/" + this.item_id)
        .then((response) => {
          if (response.data != 0) {
            this.$bvToast.toast(
              `This policy using ${response.data} times in services, you must remove relationship for delete!`,
              {
                title: "Session Notification",
                variant: "danger",
                autoHideDelay: 5000,
              }
            );
          }
          this.updateTable();
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Delete operation has error!	";
        });
    },
    regexList(list) {
      let regex = "";
      for (let i = 0; i < list.length; i++) {
        regex = regex + list[i].regex + ", ";
      }
      regex = regex.slice(0, -2);

      return regex;
    },
    customLabel(user) {
      if (user.first_name == null || user.last_name == null) {
        return `(${user.username})`;
      }
      return `${user.first_name} ${user.last_name} (${user.username})`;
    },
    servicetypeLogo(item) {
      let variant;
      switch (item) {
        case "1":
          variant = "mysql";
          break;
        case "2":
          variant = "postgresql";
          break;
        case "3":
          variant = "msserver";
          break;
        case "4":
          variant = "oracle";
          break;
        case "5":
          variant = "ssh";
          break;
        case "6":
          variant = "telnet";
          break;
        case "7":
          variant = "rdp";
          break;
        case "8":
          variant = "vnc";
          break;
        default:
          variant = "ssh";
      }
      return variant;
    },
    updateTable() {
      this.$http
        .get("/api/v1/policy/" + this.id, {})
        .then((response) => {
          this.policies = response.data;
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Update operation has error!	";
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
  },
  created() {
    this.$http
      .get("/api/v1/filter/command/service/" + this.id)
      .then((response) => {
        response.data.forEach((policy) => {
          policy.users = JSON.parse(policy.users);
          policy.regexes = JSON.parse(policy.regexes);
          this.commandPolicies.push(policy);
        });
        this.commandPolicyLoading = false;
      })
      .catch((error) => {
        console.log(error);
        this.commandPolicyLoading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    this.$http
      .get("/api/v1/filter/file/service/" + this.id)
      .then((response) => {
        response.data.forEach((policy) => {
          policy.users = JSON.parse(policy.users);
          policy.paths = JSON.parse(policy.paths);
          this.filePolicies.push(policy);
        });
        this.filePolicyLoading = false;
      })
      .catch((error) => {
        console.log(error);
        this.filePolicyLoading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
  },
};
</script>

<style scoped>
.inventory-logo {
  width: 50px;
  height: 40px;
}

.navbar {
  padding: 0.5rem 0rem;
}

.buttonMR {
  margin-right: 5px;
}
</style>

<style>
.policy-create-field .dropdown-menu.show {
  width: 100% !important;
}
</style>
