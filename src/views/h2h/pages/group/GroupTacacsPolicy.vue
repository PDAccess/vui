<template>
  <div class="animated fadeIn">
    <p-card>
      <b-row class="mb-2" style="position: absolute; right: 10px">
        <b-col class="d-flex justify-content-end policy-create-field">
          <b-dropdown id="dropdown-left" variant="success">
            <template v-slot:button-content>
              <i class="fa fa-plus-circle mr-2" aria-hidden="true"></i>Create
              Tacacs Policy
            </template>
            <b-dropdown-item
              @click="
                $router.push({
                  path: `/groups/create-tacacsprivpolicy/${id}`,
                })
              "
            >
              PRIVILEGED<br />
              <span style="font-size: 0.5rem">Privileged Policy</span>
            </b-dropdown-item>
            <b-dropdown-item
              @click="
                $router.push({
                  path: `/groups/create-tacacspolicy/B/${id}`,
                })
              "
            >
              BLACK<br />
              <span style="font-size: 0.5rem">Black Policy</span>
            </b-dropdown-item>
            <b-dropdown-item
              @click="
                $router.push({ path: `/groups/create-tacacspolicy/W/${id}` })
              "
            >
              WHITE<br />
              <span style="font-size: 0.5rem">White Policy</span>
            </b-dropdown-item>
            <b-dropdown-item
              @click="
                $router.push({
                  path: `/groups/create-tacacspolicy/A/${id}`,
                })
              "
            >
              ALARM<br />
              <span style="font-size: 0.5rem">Alarm Policy</span>
            </b-dropdown-item>
            <b-dropdown-item
              @click="
                $router.push({
                  path: `/groups/create-tacacspolicy/F/${id}`,
                })
              "
            >
              FILTER<br />
              <span style="font-size: 0.5rem">Filter Policy</span>
            </b-dropdown-item>
          </b-dropdown>
        </b-col>
      </b-row>
      <p-modal
                id="deletePolicyModal"
                ref="deletePolicyModal"
                @confirm="deletePolicy()"
                :message="modalMessage"
              ></p-modal>
      <p-modal
                id="deletePrivPolicyModal"
                ref="deletePrivPolicyModal"
                @confirm="deletePrivPolicy()"
                :message="modalMessage"
              ></p-modal>
      <b-tabs pills content-class="mt-2">
        <b-tab active title="Privileged Policy">
          <b-row>
            <b-col>
              <p-error
                v-if="errorStatus"
                header="List operation has error!"
                :errorResponse="errorResponse"
                @reload="$router.go()"
              />
              <p-loading
                class="my-5"
                v-else-if="isLoading"
                message="Loading..."
              />
              <b-col v-else-if="privPolicies.length === 0">
                <p-initial
                  icon="plus-circle"
                  header="You don't have any tacacs privileged policy."
                  message="Please create a group tacacs privileged policy."
                />
              </b-col>
              <b-table
                v-else
                :items="privPolicies"
                :fields="privPolicyFields"
                fixed
              >
                <template v-slot:cell(id)="row">
                  <span>{{ row.item.privilegeId }}</span>
                </template>
                <template v-slot:cell(user)="row">
                  <router-link :to="`/user/userdetail/${user.userId}`" :key="index"
                    v-for="(user, index) in getUser(row.item.userId)">
                  <b-badge
                    class="mr-1"
                    
                    variant="primary"
                    >{{ user.username }}</b-badge
                  >
                  </router-link>
                </template>
                <template v-slot:cell(privLevel)="row">
                  <b-badge
                    variant="danger"
                    >{{ row.item.privilegedLevel }}</b-badge
                  >
                </template>

                <template v-slot:cell(created_at)="row">
                  <span
                    v-if="row.item.createdAt"
                    class="text-info"
                    :title="$moment(row.item.createdAt).calendar()"
                    >{{
                      $moment(row.item.createdAt).format("DD/MM/Y - HH:mm:s")
                    }}</span
                  >
                </template>

                <template v-slot:cell(created_by)="row">
                  <router-link :to="`/user/userdetail/${row.item.createdByUserid}`">
                  {{ row.item.createdByUsername }}
                  </router-link>
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
                      @click.stop="editPrivPolicy(row.item)"
                      variant="primary"
                      ><em class="mr-1 fa fa-pencil"></em>Edit
                    </b-dropdown-item>
                    <b-dropdown-item
                      @click.stop="deletePrivPolicyButton(row.item)"
                      variant="danger"
                      v-b-modal.deletePrivPolicyModal
                      ><em class="mr-1 fa fa-trash"></em>Delete
                    </b-dropdown-item>
                  </b-dropdown>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Black Policy">
          <b-row>
            <b-col>
              <p-error
                v-if="errorStatus"
                header="List operation has error!"
                :errorResponse="errorResponse"
                @reload="$router.go()"
              />
              <p-loading
                class="my-5"
                v-else-if="isLoading"
                message="Loading..."
              />
              <b-col v-else-if="blackPolicies.length === 0">
                <p-initial
                  icon="plus-circle"
                  header="You don't have any tacacs black policy."
                  message="Please create a group tacacs black policy."
                />
              </b-col>
              <b-table
                v-else
                :items="blackPolicies"
                :fields="policyFields"
                fixed
              >
                <template v-slot:cell(id)="row">
                  <span>{{ row.item.policyId }}</span>
                </template>
                <template v-slot:cell(name)="row">
                  <span>{{ row.item.name }}</span>
                </template>
                <template v-slot:cell(users)="row">
                  <router-link :to="`/user/userdetail/${user.userId}`" :key="index"
                    v-for="(user, index) in getUser(row.item.userIds)">
                  <b-badge
                    class="mr-1"
                    
                    variant="primary"
                    >{{ user.username }}</b-badge
                  >
                  </router-link>
                </template>
                <template v-slot:cell(regexes)="row">
                  <b-badge
                    class="mr-1"
                    :key="index"
                    v-for="(regex, index) in row.item.regexes"
                    variant="success"
                    >{{ regex }}</b-badge
                  >
                </template>
                <template v-slot:cell(created_at)="row">
                  <span
                    v-if="row.item.createdAt"
                    class="text-info"
                    :title="$moment(row.item.createdAt).calendar()"
                    >{{
                      $moment(row.item.createdAt).format("DD/MM/Y - HH:mm:s")
                    }}</span
                  >
                </template>

                <template v-slot:cell(created_by)="row">
                  <router-link :to="`/user/userdetail/${row.item.createdByUserid}`">
                  {{ row.item.createdByUsername }}
                  </router-link>
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
                      @click.stop="editPolicy(row.item)"
                      variant="primary"
                      ><em class="mr-1 fa fa-pencil"></em>Edit
                    </b-dropdown-item>
                    <b-dropdown-item
                      @click.stop="deleteButton(row.item)"
                      variant="danger"
                      v-b-modal.deletePolicyModal
                      ><em class="mr-1 fa fa-trash"></em>Delete
                    </b-dropdown-item>
                  </b-dropdown>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="White Policy">
          <b-row>
            <b-col>
              <p-error
                v-if="errorStatus"
                header="List operation has error!"
                :errorResponse="errorResponse"
                @reload="$router.go()"
              />
              <p-loading
                class="my-5"
                v-else-if="isLoading"
                message="Loading..."
              />
              <b-col v-else-if="whitePolicies.length === 0">
                <p-initial
                  icon="plus-circle"
                  header="You don't have any group tacacs white policy."
                  message="Please create a group tacacs white policy."
                />
              </b-col>
              <b-table
                v-else
                :items="whitePolicies"
                :fields="policyFields"
                fixed
              >
                <template v-slot:cell(id)="row">
                  <span>{{ row.item.policyId }}</span>
                </template>
                <template v-slot:cell(name)="row">
                  <span>{{ row.item.name }}</span>
                </template>
                <template v-slot:cell(users)="row">
                  <router-link :to="`/user/userdetail/${user.userId}`" :key="index"
                    v-for="(user, index) in getUser(row.item.userIds)">
                  <b-badge
                    class="mr-1"
                    
                    variant="primary"
                    >{{ user.username }}</b-badge
                  >
                  </router-link>
                </template>
                <template v-slot:cell(regexes)="row">
                  <b-badge
                    class="mr-1"
                    :key="index"
                    v-for="(regex, index) in row.item.regexes"
                    variant="success"
                    >{{ regex }}</b-badge
                  >
                </template>
                <template v-slot:cell(created_at)="row">
                  <span
                    v-if="row.item.createdAt"
                    class="text-info"
                    :title="$moment(row.item.createdAt).calendar()"
                    >{{
                      $moment(row.item.createdAt).format("DD/MM/Y - HH:mm:s")
                    }}</span
                  >
                </template>

                <template v-slot:cell(created_by)="row">
                  <router-link :to="`/user/userdetail/${row.item.createdByUserid}`">
                  {{ row.item.createdByUsername }}
                  </router-link>
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
                      @click.stop="editPolicy(row.item)"
                      variant="primary"
                      ><em class="mr-1 fa fa-pencil"></em>Edit
                    </b-dropdown-item>
                    <b-dropdown-item
                      @click.stop="deleteButton(row.item)"
                      variant="danger"
                      v-b-modal.deletePolicyModal
                      ><em class="mr-1 fa fa-trash"></em>Delete
                    </b-dropdown-item>
                  </b-dropdown>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Alarm Policy">
          <b-row>
            <b-col>
              <p-error
                v-if="errorStatus"
                header="List operation has error!"
                :errorResponse="errorResponse"
                @reload="$router.go()"
              />
              <p-loading
                class="my-5"
                v-else-if="isLoading"
                message="Loading..."
              />
              <b-col v-else-if="alarmPolicies.length === 0">
                <p-initial
                  icon="plus-circle"
                  header="You don't have any group tacacs alarm policy."
                  message="Please create a group tacacs alarm policy."
                />
              </b-col>
              <b-table
                v-else
                :items="alarmPolicies"
                :fields="policyFields"
                fixed
              >
                <template v-slot:cell(id)="row">
                  <span>{{ row.item.policyId }}</span>
                </template>
                <template v-slot:cell(name)="row">
                  <span>{{ row.item.name }}</span>
                </template>
                <template v-slot:cell(users)="row">
                  <router-link :to="`/user/userdetail/${user.userId}`" :key="index"
                    v-for="(user, index) in getUser(row.item.userIds)">
                  <b-badge
                    class="mr-1"
                    
                    variant="primary"
                    >{{ user.username }}</b-badge
                  >
                  </router-link>
                </template>
                <template v-slot:cell(regexes)="row">
                  <b-badge
                    class="mr-1"
                    :key="index"
                    v-for="(regex, index) in row.item.regexes"
                    variant="success"
                    >{{ regex }}</b-badge
                  >
                </template>
                <template v-slot:cell(created_at)="row">
                  <span
                    v-if="row.item.createdAt"
                    class="text-info"
                    :title="$moment(row.item.createdAt).calendar()"
                    >{{
                      $moment(row.item.createdAt).format("DD/MM/Y - HH:mm:s")
                    }}</span
                  >
                </template>

                <template v-slot:cell(created_by)="row">
                  <router-link :to="`/user/userdetail/${row.item.createdByUserid}`">
                  {{ row.item.createdByUsername }}
                  </router-link>
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
                      @click.stop="editPolicy(row.item)"
                      variant="primary"
                      ><em class="mr-1 fa fa-pencil"></em>Edit
                    </b-dropdown-item>
                    <b-dropdown-item
                      @click.stop="deleteButton(row.item)"
                      variant="danger"
                      v-b-modal.deletePolicyModal
                      ><em class="mr-1 fa fa-trash"></em>Delete
                    </b-dropdown-item>
                  </b-dropdown>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Filter Policy">
          <b-row>
            <b-col>
              <p-error
                v-if="errorStatus"
                header="List operation has error!"
                :errorResponse="errorResponse"
                @reload="$router.go()"
              />
              <p-loading
                class="my-5"
                v-else-if="isLoading"
                message="Loading..."
              />
              <b-col v-else-if="filterPolicies.length === 0">
                <p-initial
                  icon="plus-circle"
                  header="You don't have any group tacacs filter policy."
                  message="Please create a group tacacs filter policy."
                />
              </b-col>
              <b-table
                v-else
                :items="filterPolicies"
                :fields="policyFields"
                fixed
              >
                <template v-slot:cell(id)="row">
                  <span>{{ row.item.policyId }}</span>
                </template>
                <template v-slot:cell(name)="row">
                  <span>{{ row.item.name }}</span>
                </template>
                <template v-slot:cell(users)="row">
                  <router-link :to="`/user/userdetail/${user.userId}`" :key="index"
                    v-for="(user, index) in getUser(row.item.userIds)">
                  <b-badge
                    class="mr-1"
                    
                    variant="primary"
                    >{{ user.username }}</b-badge
                  >
                  </router-link>
                </template>
                <template v-slot:cell(regexes)="row">
                  <b-badge
                    class="mr-1"
                    :key="index"
                    v-for="(regex, index) in row.item.regexes"
                    variant="success"
                    >{{ regex }}</b-badge
                  >
                </template>
                <template v-slot:cell(created_at)="row">
                  <span
                    v-if="row.item.createdAt"
                    class="text-info"
                    :title="$moment(row.item.createdAt).calendar()"
                    >{{
                      $moment(row.item.createdAt).format("DD/MM/Y - HH:mm:s")
                    }}</span
                  >
                </template>

                <template v-slot:cell(created_by)="row">
                  <router-link :to="`/user/userdetail/${row.item.createdByUserid}`">
                  {{ row.item.createdByUsername }}
                  </router-link>
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
                      @click.stop="editPolicy(row.item)"
                      variant="primary"
                      ><em class="mr-1 fa fa-pencil"></em>Edit
                    </b-dropdown-item>
                    <b-dropdown-item
                      @click.stop="deleteButton(row.item)"
                      variant="danger"
                      v-b-modal.deletePolicyModal
                      ><em class="mr-1 fa fa-trash"></em>Delete
                    </b-dropdown-item>
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
  data() {
    return {
      users: [],
      privPolicies: [],
      blackPolicies: [],
      whitePolicies: [],
      alarmPolicies: [],
      filterPolicies: [],
      errorStatus: false,
      errorResponse: "",
      isLoading: true,
      filePolicyLoading: true,
      commandPolicyLoading: true,
      privPolicyFields: [
        { key: "id", label: "Privileged ID" },
        { key: "user", label: "User" },
        { key: "privLevel", label: "Privileged Level" },
        { key: "created_at", label: "Created At" },
        { key: "created_by", label: "Created By" },
        { key: "actions", label: "Actions" },
      ],
      policyFields: [
        { key: "id", label: "Policy ID" },
        { key: "name", label: "Policy Name" },
        { key: "users", label: "Users" },
        { key: "regexes", label: "Regexes" },
        { key: "created_at", label: "Created At" },
        { key: "created_by", label: "Created By" },
        { key: "actions", label: "Actions" },
      ],
      filePolicyFields: [
        { key: "name", label: "Policy Name" },
        { key: "users", label: "Users" },
        { key: "paths", label: "Paths" },
        { key: "actions", label: "Actions" },
      ],
      filePolicyFields: [
        { key: "name", label: "Policy Name" },
        { key: "users", label: "Users" },
        { key: "paths", label: "Paths" },
        { key: "actions", label: "Actions" },
      ],
      commandPolicyFields: [
        { key: "name", label: "Policy Name" },
        { key: "users", label: "Users" },
        { key: "regexes", label: "Regexes" },
        { key: "actions", label: "Actions" },
      ],
      list_message: "d",
      item_id: 0,
      item_type: "",
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
    getUser(userIds) {
      let users = [];
      for (let i = 0 ; i < this.users.length ; i++) {
        if (userIds.includes(this.users[i].userId)) {
          users.push(this.users[i])
        }
      }
      return users
    },
    editPolicy(item) {
      this.$router.push({
        path: `/groups/${this.id}/tacacspolicy/${item.policyId}`,
      });
    },
    editPrivPolicy(item) {
      this.$router.push({
        path: `/groups/${this.id}/tacacsprivpolicy/${item.privilegeId}`,
      });
    },
    editPrivPolicy(item) {
      this.$router.push({
        path: `/groups/${this.id}/tacacsprivpolicy/${item.privilegeId}`,
      });
    },
    deleteButton(item, event) {
      this.item_id = item.policyId;
      this.list_message = item.Name;
      this.item_type = item.policyType;
      this.modalMessage =
        "Are you sure you want to delete the selected " +
        this.list_message +
        " group tacacs policy?";
    },
    deletePrivPolicyButton(item, event) {
      this.item_id = item.privilegeId;
      this.modalMessage =
        "Are you sure you want to delete the selected group tacacs privileged policy?";
    },
    deletePrivPolicy() {
      this.$http
        .delete("/api/v1/tacacs/privilege/" + this.item_id)
        .then((response) => {
          for (let i = 0; i < this.privPolicies.length; i++) {
                if (this.privPolicies[i].privilegeId === this.item_id) {
                  this.privPolicies.splice(i, 1);
                  break;
                }
              }

          this.$bvToast.toast(
            `The Tacacs privileged policy has been deleted`,
            {
              title: "Tacacy Policy Notification",
              variant: "success",
              autoHideDelay: 5000,
            }
          );
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    deletePolicy() {
      this.$http
        .delete("/api/v1/tacacs/policy/" + this.item_id)
        .then((response) => {
          switch (this.item_type) {
            case "W":
              for (let i = 0; i < this.whitePolicies.length; i++) {
                if (this.whitePolicies[i].policyId === this.item_id) {
                  this.whitePolicies.splice(i, 1);
                  break;
                }
              }
              break;
            case "B":
              for (let i = 0; i < this.blackPolicies.length; i++) {
                if (this.blackPolicies[i].policyId === this.item_id) {
                  this.blackPolicies.splice(i, 1);
                  break;
                }
              }
              break;
            case "F":
              for (let i = 0; i < this.filterPolicies.length; i++) {
                if (this.filterPolicies[i].policyId === this.item_id) {
                  this.filterPolicies.splice(i, 1);
                  break;
                }
              }
              break;
            case "A":
              for (let i = 0; i < this.alarmPolicies.length; i++) {
                if (this.alarmPolicies[i].policyId === this.item_id) {
                  this.alarmPolicies.splice(i, 1);
                  break;
                }
              }
              break;
            default:
              break;
          }

          this.$bvToast.toast(
            `The Tacacs policy named ${this.list_message} has been deleted`,
            {
              title: "Tacacy Policy Notification",
              variant: "success",
              autoHideDelay: 5000,
            }
          );
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
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
        .get("/api/v1/policy/sudo/" + this.id, {})
        .then((response) => {
          this.sudoPolicies = response.data;
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
        });
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
    userList(list) {
      let user = "";
      for (let i = 0; i < list.length; i++) {
        user = user + list[i].userid + ", ";
      }
      user = user.slice(0, -2);

      return user;
    },
    groupList(list) {
      let group = "";
      for (let i = 0; i < list.length; i++) {
        group = group + list[i].groupId + ", ";
      }
      group = group.slice(0, -2);

      return group;
    },
  },
  created() {
    this.$http
      .get("/api/v1/group/user/members/" + this.id)
      .then((response) => {
        response.data.forEach(f => {
          this.users.push(f.user)
        });
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
      });
    this.$http
      .get("/api/v1/tacacs/privilege/group/" + this.id)
      .then((response) => {
        this.privPolicies = response.data.user;
        this.isLoading = false;
      })
      .catch((error) => {
        console.log(error);
        this.isLoading = false;
        this.errorStatus = true;
        this.errorResponse = error;
      });
    this.$http
      .get("/api/v1/tacacs/policy/group/" + this.id)
      .then((response) => {
        if (response.data.data) {
          response.data.data.forEach((policy) => {
            switch (policy.policyType) {
              case "W":
                this.whitePolicies.push(policy);
                break;
              case "B":
                this.blackPolicies.push(policy);
                break;
              case "A":
                this.alarmPolicies.push(policy);
                break;
              case "F":
                this.filterPolicies.push(policy);
                break;
              default:
                break;
            }
          });
        }
        this.isLoading = false;
      })
      .catch((error) => {
        console.log(error);
        this.isLoading = false;
        this.errorStatus = true;
        this.errorResponse = error;
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
