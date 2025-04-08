<template>
  <div class="animated fadeIn">
    <p-card>
      <b-row class="mb-2">
        <b-col class="d-flex justify-content-end policy-create-field">
          <b-dropdown id="dropdown-left" variant="success">
            <template v-slot:button-content>
              <i class="fa fa-plus-circle mr-2" aria-hidden="true"></i>Create
              Service Policy
            </template>
            <b-dropdown-item
              @click="$router.push({ path: `/service/createpolicy/${id}/W` })"
            >
              WHITE<br />
              <span style="font-size: 0.5rem">White list commands</span>
            </b-dropdown-item>
            <b-dropdown-item
              @click="$router.push({ path: `/service/createpolicy/${id}/B` })"
            >
              BLACK<br />
              <span style="font-size: 0.5rem">Black list commands</span>
            </b-dropdown-item>
          </b-dropdown>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <p-modal @confirm="deletePolicy()" :message="modalMessage"></p-modal>
          <p-loading v-if="loading" class="my-5" message="Loading..." />
          <p-error
            v-else-if="errorStatus"
            :header="errorHeader"
            :errorResponse="errorResponse"
            @reload="$router.go()"
          />
          <div v-else-if="policies.length === 0">
            <p-initial
              icon="plus-circle"
              header="You don't have any service policy."
              message="Please create a service policy."
            />
          </div>
          <b-table
            v-else
            :items="policies"
            :fields="policyFields"
            fixed
            show-empty
          >
            <template v-slot:cell(policy)="row">
              <div class="d-flex">
                <div class="d-flex">
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
            <template v-slot:cell(regex)="row">
              <em>{{ regexList(row.item.policyRegexEntity) }}</em>
            </template>
            <template v-slot:cell(created_at)="row">
              <em style="color: #20a8d8"
                ><strong>{{ row.item.createdAt | moment("lll") }}</strong></em
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
                  @click.stop="editPolicy(row.item)"
                  variant="primary"
                  ><em class="fa fa-edit"></em>Edit</b-dropdown-item
                >
                <b-dropdown-item
                  @click.stop="deleteButton(row.item)"
                  variant="danger"
                  v-b-modal.modal
                  ><em class="fa fa-trash"></em>Delete</b-dropdown-item
                >
              </b-dropdown>
            </template>
          </b-table>
        </b-col>
      </b-row>
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
      loading: true,
      policyFields: [
        { key: "policy", label: "Policy" },
        { key: "regex", label: "Regex" },
        { key: "created_at", label: "Created At" },
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
        name: "Edit Service Policy",
        params: {
          policyid: item.id,
          serviceid: this.id,
        },
      });
    },
    deleteButton(item, event) {
      this.item_id = item.id;
      this.list_message = item.name;
      this.modalMessage =
        "Are you sure you want to delete the selected " +
        this.list_message +
        " service policy?";
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
          this.$bvToast.toast(`Deleted Policy`, {
            title: "Service Policy Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.updateTable();
        })
        .catch((error) => {
          this.$bvToast.toast(`Something went wrong!`, {
            title: "Service Policy Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Delete operation has error!";
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
        .get("/api/v1/policy/" + this.id, {})
        .then((response) => {
          this.policies = response.data;
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Update operation has error!";
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
  },
  created() {
    this.$http
      .get("/api/v1/policy/" + this.id, {})
      .then((response) => {
        this.policies = response.data;
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
        this.info = response.data;
        this.details = response.data;
        this.details.serviceTypeLogo =
          this.details.serviceTypeLogo.toUpperCase();
        this.details.serviceNameLogo =
          this.details.serviceNameLogo.toUpperCase();
        this.formdata.servicetype = this.details.service_type_id;
        this.formdata.operatingsystem = this.details.operating_system_id;
        this.formdata.servicemeta = this.details.serviceType;
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
