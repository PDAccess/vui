<template>
  <div class="animated fadeIn">
    <p-card>
      <p-modal @confirm="deleteUser()" :message="modalMessage"></p-modal>
      <b-modal
        v-if="info.originId === null"
        id="modal-break"
        centered
        title="Break the Glass"
        header-bg-variant="danger"
        header-text-variant="light"
        size="xl"
        v-model="breakForm"
      >
        <b-row class="my-1">
          <b-col sm="4">
            <h3>Break the Glass</h3>
            <p>You can access all sensetive data in here.</p>
            <p>Please use in Emergency Cases (like fire alarm.)</p>
            <p>All attempts will be logged.</p>
            <p>Service name: {{ info.name }}</p>
            <p>Connection user: {{ selectedUser }}</p>
          </b-col>
          <b-col sm="8">
            <p>To break the glass entry your reason and confirm code.</p>
            <b-form-input
              placeholder="Entry your reason"
              class="mb-2"
              v-model="reason"
              :rows="8"
            ></b-form-input>
            <br />
            <h5>Code: {{ code }}</h5>
            <b-form-input
              placeholder="Confirm Code"
              class="mb-2"
              v-model="confirm"
              type="text"
            ></b-form-input>
          </b-col>
        </b-row>
        <template v-slot:modal-footer>
          <div class="w-100">
            <b-button
              variant="danger"
              size="md"
              class="float-right ml-2"
              :disabled="!(code == confirm) || reason == ''"
              @click.stop="breaktheglass"
            >
              <i class="fa fa-gavel mr-2" aria-hidden="true"></i>Break
            </b-button>
            <b-button
              variant="primary"
              size="md"
              class="float-right"
              @click="breakForm = false"
            >
              <i class="fa fa-times mr-2" aria-hidden="true"></i>Close
            </b-button>
          </div>
        </template>
      </b-modal>
      <b-modal
        v-if="info.originId === null"
        id="modal-breaked"
        centered
        title="Break the Glass"
        header-bg-variant="danger"
        header-text-variant="light"
        size="xl"
        v-model="breaked"
      >
        <p-loading v-if="loadingBreak" class="my-5" message="Loading..." />
        <template v-else>
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Service Vault Info</h3>
              <p>
                Service name:
                <strong>{{ info.name }}</strong>
              </p>
            </b-col>
            <b-col sm="8">
              <p>
                <strong>Ip address:</strong>
                <b-input-group class="inputgroup mt-2">
                  <b-form-input
                    class="inputform"
                    :readonly="true"
                    :value="vault.ipaddress"
                  ></b-form-input>
                  <p-copy :copyItem="vault.ipaddress" @click="message = 'Ip address successfully copied'"/>
                </b-input-group>
              </p>
              <p>
                <strong>Key:</strong>
                <b-input-group class="inputgroup mt-2">
                  <b-form-textarea
                    class="inputform"
                    :readonly="true"
                    :value="vault.key"
                    rows="6"
                    max-rows="7"
                  ></b-form-textarea>
                  <p-copy :copyItem="vault.key" @click="message = 'Key successfully copied'"/>
                </b-input-group>
              </p>
              <p>
                <strong>Password:</strong>
                <b-input-group class="inputgroup mt-2">
                  <b-form-input
                    class="inputform"
                    :readonly="true"
                    :value="vault.password"
                  ></b-form-input>
                  <p-copy :copyItem="vault.password" @click="message = 'Password successfully copied'"/>
                </b-input-group>
              </p>
              <p>
                <strong>Port:</strong>
                <b-input-group class="inputgroup mt-2">
                  <b-form-input
                    class="inputform"
                    :readonly="true"
                    :value="vault.port"
                  ></b-form-input>
                  <p-copy :copyItem="vault.port" @click="message = 'Port successfully copied'"/>
                </b-input-group>
              </p>
              <p>
                <strong>Username:</strong>
                <b-input-group class="inputgroup mt-2">
                  <b-form-input
                    class="inputform"
                    :readonly="true"
                    :value="vault.username"
                  ></b-form-input>
                  <p-copy :copyItem="vault.username" @click="message = 'Username successfully copied'"/>
                </b-input-group>
              </p>
            </b-col>
          </b-row>
        </template>
        <template v-slot:modal-footer>
          <div class="w-100">
            <b-button
              variant="primary"
              size="md"
              class="float-right"
              @click="breaked = false"
            >
              <i class="fa fa-times mr-2" aria-hidden="true"></i>Close
            </b-button>
          </div>
        </template>
      </b-modal>
      <b-modal
        id="manage-account-modal"
        centered
        title="Please select credential for manage the account:"
      >
        <p-select
          :multiple="true"
          :options="credentials"
          label="username"
          placeholder="Select Credential"
          v-model="selectedCredential"
        ></p-select>
        <template #modal-footer>
          <div class="w-100 d-flex justify-content-between">
            <b-button :to="'/service/accounts/new-credential/' + selectedAccount.id" variant="primary"><i class="fa fa-plus-circle mr-2"/>New</b-button>
            <div class="d-flex">
              <b-button variant="secondary" class="mr-2"> Cancel </b-button>
              <b-button
                @click="manageAccount"
                :disabled="selectedCredential == null"
                variant="success"
              >
                Manage
              </b-button>
            </div>
          </div>
        </template>
      </b-modal>
      <p-error
        v-if="errorStatus"
        header="List operation has error!"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <p-loading v-else-if="loading" class="my-5" message="Loading..." />
      <p-initial
        v-else-if="users.length === 0"
        icon="person-plus"
        header="You don't have any Service Local Account."
        message="Please create a local account."
      />
      <b-table
        v-else
        :fields="tableFields"
        :items="users"
        hover
        show-empty
        responsive
        fixed
      >
        <template v-slot:cell(username)="row">
          <span>{{ row.item.username }}</span>
        </template>
        <template v-slot:cell(admin)="row">
          <b-badge v-if="row.item.admin" variant="primary">Admin</b-badge>
          <b-badge v-else variant="light">User</b-badge>
        </template>
        <template v-slot:cell(created_at)="row">
          <span style="color: #20a8d8">
            <strong>{{ row.item.createdAt | moment("calendar") }}</strong>
          </span>
        </template>
        <template v-slot:cell(updated_at)="row">
          <span style="color: #20a8d8">
            <strong>{{ row.item.updatedAt | moment("calendar") }}</strong>
          </span>
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
              v-if="row.item.deletable"
              @click.stop="deleteButton(row.item)"
              v-b-modal.modal
              variant="danger"
              ><em class="fa fa-trash mr-1"></em>Delete</b-dropdown-item
            >
            <b-dropdown-item @click.stop="editUser(row.item)" variant="primary"
              ><em class="fa fa-edit mr-1"></em>Edit</b-dropdown-item
            >
            <b-dropdown-item
              @click="selectedAccount = row.item"
              v-if="
                row.item.credentials == null || row.item.credentials.length == 0
              "
              v-b-modal.manage-account-modal
              variant="success"
              ><em class="fa fa-object-group mr-1"></em>Manage</b-dropdown-item
            >
          </b-dropdown>
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
      selectedAccount: null,
      selectedCredential: null,
      credentials: [],
      vault: {
        ipaddress: "",
        key: "",
        password: "",
        port: "",
        username: "",
      },
      errorStatus: false,
      errorResponse: "",
      checkStatus: false,
      breakStatus: true,
      loadingBreak: false,
      breaked: false,
      confirm: null,
      reason: "",
      code: "",
      users: [],
      loading: true,
      tableFields: [
        { key: "username", label: "Username" },
        { key: "admin", label: "Role" },
        { key: "created_at", label: "Created At" },
        { key: "updated_at", label: "Updated At" },
        { key: "actions", label: "Actions" },
      ],
      modalMessage: "",
      item_id: "",
      selectedUser: "",
      item: {},
      breakForm: false,
      info: {},
    };
  },
  methods: {
    manageAccount() {
      let data = {
        account_id: this.selectedAccount.id,
        credential_id: this.selectedCredential[0].credentialId,
      };

      this.$http
        .post("/api/v1/service/account/manage", data)
        .then((response) => {
          this.$bvToast.toast("Account managed successfully", {
            title: "Success manage",
            variant: "info",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onCopy() {
      this.$bvToast.toast(this.message, {
        title: "Success Copy",
        variant: "info",
        autoHideDelay: 5000,
      });
    },
    breaktheglass() {
      this.loadingBreak = true;
      this.breakForm = false;
      this.breaked = true;
      let data = new FormData();
      data.append("account_id", this.item_id);
      this.$http
        .post("/api/v1/service/connection-users/break", data)
        .then((response) => {
          this.vault = response.data;
          this.loadingBreak = false;
          this.checkStatus = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editUser(item) {
      this.$router.push({
        name: "Edit Local Account",
        params: {
          id: this.id,
          accountId: item.id,
        },
      });
    },
    deleteButton(item, event) {
      this.item_id = item.id;
      this.selectedUser = item.username;
      this.modalMessage =
        "Are you sure you want to delete the selected " +
        item.username +
        " service account?";
    },
    deleteUser() {
      this.$http
        .delete("/api/v1/service/connection-users/" + this.item_id)
        .then((response) => {
          this.$bvToast.toast(`Deleted Account`, {
            title: "Service Account Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id === this.item_id) {
              this.users.splice(i, 1);
              break;
            }
          }
        })
        .catch((error) => {
          this.$bvToast.toast(`Something went wrong!`, {
            title: "Service Account Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
          console.log(error);
        });
    },
    breakUser(user) {
      this.code = Math.floor(Math.random() * 10000);
      this.selectedUser = user.username;
      this.item_id = user.id;
      this.breakForm = true;
    },
  },
  created() {
    this.$http
      .get("/api/v1/service/connection-users/" + this.id)
      .then((response) => {
        this.users = response.data;
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
      });

    this.$http
      .get("/api/v1/service/id/" + this.id)
      .then((response) => {
        this.info = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
      });

    this.$http
      .get("/api/v1/credentials/group/admin")
      .then((response) => {
        this.credentials = response.data;
      })
      .catch((error) => {
        console.log(error);
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
