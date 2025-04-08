<template>
  <div class="animated fadeIn">
    <p-card>
      <p-error
        v-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <ul v-else class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Policies</h3>
              <p>
                ​There are limitations that are services created before or made
                up by whole group admins. Only group admins impose restrictions
                on PDAccess. Also, there are two lists that are black list and
                white list. The black list represents, banned or blocked
                comments and the white list demonstrates one and only the
                comments that have allowed by a group admin. Both lists can be
                created separately so one of the services can not contain both
                white and black lists.
              </p>
            </b-col>
            <b-col sm="8">
              <b-row>
                <b-col>
                  <b-row class="mb-3">
                    <b-col cols="3">
                      <label for="input-default">Policy Name</label>
                    </b-col>
                    <b-col cols="9">
                      <b-form-input
                        type="text"
                        v-model="formdata.name"
                      ></b-form-input>
                    </b-col>
                  </b-row>

                  <b-row class="mb-3">
                    <b-col cols="3">
                      <label for="input-default">Users</label>
                    </b-col>
                    <b-col cols="9">
                      <p-select
                        v-model="selectedUsers"
                        :options="users"
                        track-by="userId"
                        placeholder="Select Users"
                        :multiple="true"
                        :taggable="true"
                        @tag="addTag1"
                        :custom-label="customLabel"
                        :show-labels="false"
                        :close-on-select="false"
                        :clear-on-select="false"
                        :preserve-search="true"
                        :preselect-first="true"
                        :searchable="false"
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
                                class="
                                  d-flex
                                  justify-content-start
                                  align-items-center
                                "
                              >
                                <p-profile-avatar
                                  :profileUsername="props.option.username"
                                  :username="
                                    props.option.first_name +
                                    ' ' +
                                    props.option.last_name
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
                    </b-col>
                  </b-row>

                  <b-tooltip
                    placement="right"
                    :target="serviceDatabase[0].iddata"
                  ></b-tooltip>
                  <b-tooltip
                    placement="right"
                    :target="serviceDatabase[1].iddata"
                  ></b-tooltip>
                  <b-tooltip
                    placement="right"
                    :target="serviceDatabase[2].iddata"
                  ></b-tooltip>
                  <b-tooltip
                    placement="right"
                    :target="serviceDatabase[3].iddata"
                  ></b-tooltip>
                  <b-tooltip
                    placement="right"
                    :target="serviceTerminal[0].iddata"
                  ></b-tooltip>
                  <b-tooltip
                    placement="right"
                    :target="serviceTerminal[1].iddata"
                  ></b-tooltip>
                  <b-tooltip
                    placement="right"
                    :target="serviceTerminal[2].iddata"
                  ></b-tooltip>
                  <b-tooltip
                    placement="right"
                    :target="serviceTerminal[3].iddata"
                  ></b-tooltip>

                  <b-row
                    class="mb-3"
                    :key="index"
                    v-for="(regex, index) in regexFields"
                  >
                    <b-col cols="3">
                      <label for="input-default">{{
                        "Regex " + [index + 1]
                      }}</label>
                    </b-col>
                    <b-col cols="7" v-show="formdata.servicemeta == 'T'">
                      <b-form-input
                        placeholder="Enter regex"
                        type="text"
                        v-model="regexFields[index].regex"
                      ></b-form-input>
                    </b-col>
                    <b-col cols="7" v-show="formdata.servicemeta == 'D'">
                      <b-input-group>
                        <b-form-select
                          :options="options2"
                          v-model="regexFields[index].command"
                        />
                        <b-form-input
                          placeholder="Enter regex"
                          type="text"
                          v-model="regexFields[index].regex"
                        ></b-form-input>
                      </b-input-group>
                    </b-col>
                    <b-col cols="2">
                      <button
                        @click="deleteEmailfield(index)"
                        class="btn btn-pill btn-danger btn-sm"
                        type="button"
                      >
                        <em class="fa fa-minus"></em>
                      </button>
                    </b-col>
                  </b-row>

                  <b-row class="mb-3">
                    <b-col cols="3"> </b-col>
                    <b-col>
                      <button
                        @click="addRegexField"
                        class="btn btn-outline-success btn-bg"
                        type="button"
                      >
                        Add Regex
                      </button>
                    </b-col>
                  </b-row>
                  <div class="d-flex justify-content-end">
                    <b-button
                      :disabled="validForm()"
                      @click="savePolicy()"
                      variant="success"
                      >Save Service Policy
                    </b-button>
                    <b-button
                      variant="danger"
                      :to="'/service/servicepolicy/' + id"
                      class="ml-2"
                      >Back</b-button
                    >
                  </div>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </li>
      </ul>
    </p-card>
  </div>
</template>

<script>
export default {
  props: ["id", "behavior"],
  components: {},
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      loading: true,
      info: {
        name: "",
      },
      serviceDatabase: [
        {
          classdata: "inventory-logo mx-auto mysql",
          iddata: "mysqltip",
        },
        {
          classdata: "inventory-logo mx-auto postgresql",
          iddata: "postgretip",
        },
        {
          classdata: "inventory-logo mx-auto msserver",
          iddata: "mssqltip",
        },
        {
          classdata: "inventory-logo mx-auto oracle",
          iddata: "oracletip",
        },
      ],
      serviceTerminal: [
        {
          classdata: "inventory-logo mx-auto ssh",
          iddata: "sshtip",
        },
        {
          classdata: "inventory-logo mx-auto telnet",
          iddata: "telnettip",
        },
        {
          classdata: "inventory-logo mx-auto rdp",
          iddata: "rdptip",
        },
        {
          classdata: "inventory-logo mx-auto vnc",
          iddata: "vnctip",
        },
      ],
      selected: null,
      options2: [
        {
          value: "SELECT",
          text: "SELECT",
        },
        {
          value: "INSERT",
          text: "INSERT",
        },
        {
          value: "DELETE",
          text: "DELETE",
        },
      ],
      services: [],
      regexFields: [
        {
          command: "SELECT",
          regex: "",
        },
      ],
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
      users: [],
      selectedUsers: [],
    };
  },
  methods: {
    validForm() {
      this.formdata.operatingsystem = this.details.operating_system_id;
      if (
        this.formdata.name == "" ||
        this.formdata.behavior == "" ||
        this.regexFields.length == 0 ||
        this.regexFields[0].regex == ""
      ) {
        return true;
      }
      if (this.formdata.behavior == "") return true;
      if (this.formdata.regexList == "") return true;
      return false;
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
    addRegexField() {
      if (
        this.regexFields.length == 0 ||
        this.regexFields[this.regexFields.length - 1].regex != ""
      ) {
        this.regexFields.push({
          command: "SELECT",
          regex: "",
        });
      }
    },
    deleteEmailfield(index) {
      if (index > -1) this.regexFields.splice(index, 1);
    },
    savePolicy() {
      let list = [];
      for (let i = 0; i < this.regexFields.length; i++) {
        if (
          this.formdata.servicemeta == "D" &&
          this.regexFields[i].regex != ""
        ) {
          this.formdata.operatingsystem = "";
          list.push(
            this.regexFields[i].command + " " + this.regexFields[i].regex
          );
        } else if (
          this.formdata.servicemeta == "T" &&
          this.regexFields[i].regex != ""
        ) {
          list.push(this.regexFields[i].regex);
        }
      }

      let selectedUsers = [];
      for (let j = 0; j < this.selectedUsers.length; j++) {
        selectedUsers.push(this.selectedUsers[j].userId);
      }

      this.formdata.id = this.id;
      let data = {
        policyEntity: this.formdata,
        regexlist: list,
        type: "service",
        userList: selectedUsers,
      };

      this.$http
        .put("/api/v1/policy", data)
        .then((response) => {
          this.$bvToast.toast(`Updated Policy`, {
            title: "Service Policy Notification",
            variant: "success",
            autoHideDelay: 5000,
          });

          this.$router.push({
            name: "Service Policy",
            params: { id: this.id },
          });
        })
        .catch((error) => {
          this.$bvToast.toast(`Something went wrog!`, {
            title: "Service Policy Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Create operation has error!";
        });
      this.formdata.servicetype = this.details.service_type_id;
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
    this.formdata.behavior = this.behavior;

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
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    this.$http
      .get("/api/userservice/" + this.id)
      .then((response) => {
        response.data.userPolicyWrappers.forEach((element) => {
          this.users.push(element.user);
        });
        this.loading = false;
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
