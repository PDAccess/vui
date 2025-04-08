<template>
  <div class="animated fadeIn">
    <p-card>
      <b-row class="mb-2">
        <b-col class="d-flex justify-content-end policy-create-field">
          <b-dropdown id="dropdown-left" variant="success">
            <template v-slot:button-content>
              <i class="fa fa-plus-circle mr-2" aria-hidden="true"></i>Create Group
              Policy
            </template>
            <b-dropdown-item
              @click="$router.push({ path: `/groups/createpolicy/${id}/W` })"
            >
              WHITE<br />
              <span style="font-size: 0.5rem">White list commands</span>
            </b-dropdown-item>
            <b-dropdown-item
              @click="$router.push({ path: `/groups/createpolicy/${id}/B` })"
            >
              BLACK<br />
              <span style="font-size: 0.5rem">Black list commands</span>
            </b-dropdown-item>
            <b-dropdown-item
              @click="$router.push({ path: `/groups/createpolicy/${id}/D` })"
            >
              SQL<br />
              <span style="font-size: 0.5rem">Database commands</span>
            </b-dropdown-item>
          </b-dropdown>
        </b-col>
      </b-row>
      <p-modal @confirm="deletePolicy()" :message="modalMessage"></p-modal>
      <p-error
        v-if="errorStatusList"
        header="List operation has error!"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <p-error
        v-else-if="errorStatusDelete"
        header="Delete operation has error!"
        :errorResponse="errorResponse"
        @reload="deletePolicy"
      />

      <p-loading v-else-if="loading" class="my-5" message="Loading..." />
      <b-col v-else-if="policies.length === 0">
        <p-initial icon="plus-circle" header="You don't have any group policy." message="Please create a group policy." />
      </b-col>
      <b-table
        v-else
        :fields="tableFields"
        :items="policies"
        hover
        show-empty
        small
        responsive
      >
        <template v-slot:cell(policy)="row">
          <div class="d-flex align-items-center">
            <div class="d-flex justify-content-center align-items-center">
              <em
                class="fa fa-terminal fa-1x"
                v-show="row.item.servicemeta == 'T'"
              ></em>
              <em
                class="fa fa-database fa-1x"
                v-show="row.item.servicemeta == 'D'"
              ></em>

              <div
                :class="[
                  'inventory-logo',
                  'mx-auto',
                  servicetypeLogo(row.item.servicetype),
                ]"
                :title="servicetypeLogo(row.item.servicetype)"
                v-b-tooltip.bottom
              ></div>
            </div>
            <div style="margin-left: 15px">
              <p class="mb-1">
                <strong>{{ row.item.name }}</strong>
              </p>

              <div>
                <em v-show="row.item.behavior == 'W'"
                  >Behavior:
                  <b-badge variant="light">WHITE</b-badge>
                </em>
                <em v-show="row.item.behavior == 'B'"
                  >Behavior:
                  <b-badge variant="dark">BLACK</b-badge>
                </em>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:cell(users)="row">
          <em>{{ userList(row.item.policyUserEntity) }}</em>
        </template>
        <template v-slot:cell(commands)="row">
          <em>{{ regexList(row.item.policyRegexEntity) }}</em>
        </template>
        <template v-slot:cell(settings)="row">
          <div class="justify-content-between align-items-center">
            <em
              ><strong>{{
                row.item.created_at | moment("calendar")
              }}</strong></em
            >
            <b-dropdown
              id="dropdown-1"
              text="Action"
              variant="primary"
              class="user-actions m-2"
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
                v-b-modal.modal
                ><em class="mr-1 fa fa-trash"></em>Delete
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </template>
      </b-table>
    </p-card>
  </div>
</template>

<script>
export default {
  props: ["id"],
  components: {},
  data() {
    return {
      loading: true,
      errorStatusDelete: false,
      errorStatusList: false,
      errorResponse: "",
      tableFields: [
        { key: "policy", label: "Policy" },
        { key: "users", label: "Users" },
        { key: "commands", label: "Commands" },
        { key: "settings", label: "Edit/Delete" },
      ],
      selectedUsers: [],
      users: [],
      list_message: "d",
      item_id: 0,
      selected: null,
      services: [],
      groups: [],
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
      items: [],
      policies: [],
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
    editPolicy(item) {
      this.$router.push({
        name: "Edit Group Policy",
        params: {
          policyid: item.id,
          groupid: this.id,
        },
      });
    },
    deleteButton(item, event) {
      this.item_id = item.id;
      this.list_message = item.name;
      this.modalMessage =
        "Are you sure you want to delete the selected " +
        this.list_message +
        " group policy?";
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
          this.errorStatusDelete = true;
          this.errorResponse = error;
        });
    },
    regexList(list) {
      let regex = "";
      for (let i = 0; i < list.length; i++) {
        regex = regex + list[i] + ", ";
      }
      regex = regex.slice(0, -2);

      return regex;
    },
    userList(list) {
      let user = "";
      for (let i = 0; i < list.length; i++) {
        user = user + list[i] + ", ";
      }
      user = user.slice(0, -2);

      return user;
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
        .get("/api/v1/policy/app/" + this.id, {})
        .then((response) => {
          this.policies = response.data;
          console.log(this.policies)
        })
        .catch((error) => {
          console.log(error);
          this.errorStatusList = true;
          this.errorResponse = error;
        });
    },
  },
  created() {
    this.$http
      .get("/api/v1/policy/app/" + this.id, {})
      .then((response) => {
        console.log(response.data);
        this.policies = response.data;
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
