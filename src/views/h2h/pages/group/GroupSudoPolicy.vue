<template>
  <div class="animated fadeIn">
    <p-card>
      <div class="d-flex justify-content-end container-nav">
        <div>
          <b-button
            variant="success"
            v-text="'New Sudo Policy'"
            @click="
              $router.push({ path: `/groups/create-sudo-agentpolicy/${id}` })
            "
          />
        </div>
      </div>
    </p-card>
    <p-card>
      <p-modal @confirm="deletePolicy()" :message="modalMessage"></p-modal>
      <p-error
        v-if="errorStatus"
        header="List operation has error!"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <p-loading
        class="my-5"
        v-else-if="sudoPolicyLoading"
        message="Loading..."
      />
      <b-col v-else-if="sudoPolicies.length === 0">
        <p-initial
          icon="plus-circle"
          header="You don't have any group SUDO policy."
          message="Please create a group SUDO policy."
        />
      </b-col>
      <b-table
        v-else
        :fields="sudoPolicyFields"
        :items="sudoPolicies"
        hover
        show-empty
        small
        responsive
      >
        <template v-slot:cell(policy)="row">
          <div class="d-flex align-items-center mt-1">
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
              class="user-actions"
            >
              <template slot="button-content">
                <i class="mr-1 fa fa-cogs" aria-hidden="true"></i>
              </template>

              <b-dropdown-item
                @click.stop="editSudoPolicy(row.item)"
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
  data() {
    return {
      errorStatus: false,
      errorResponse: "",
      sudoPolicyLoading: true,
      item_id: 0,
      sudoPolicyFields: [
        { key: "policy", label: "Policy" },
        { key: "users", label: "Users" },
        { key: "commands", label: "Commands" },
        { key: "settings", label: "Edit/Delete" },
      ],
      info: {
        name: "",
      },
      selected: null,
      services: [],
      sudoPolicies: [],
      modalMessage: "",
    };
  },
  methods: {
    editSudoPolicy(item) {
      this.$router.push({
        name: "Edit Group Sudo Agent Policy",
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
        " group agent policy?";
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
    userList(list) {
      let user = "";
      for (let i = 0; i < list.length; i++) {
        user = user + list[i] + ", ";
      }
      user = user.slice(0, -2);

      return user;
    },
  },
  created() {
    this.$http
      .get("/api/v1/policy/sudo/" + this.id, {})
      .then((response) => {
        this.sudoPolicies = response.data;
        this.sudoPolicyLoading = false;
      })
      .catch((error) => {
        console.log(error);
        this.sudoPolicyLoading = false;
        this.errorStatus = true;
        this.errorResponse = error;
      });
  },
};
</script>

<style>
</style>