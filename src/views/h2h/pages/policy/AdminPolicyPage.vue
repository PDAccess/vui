<template>
  <div class="animated fadeIn">
    <p-card v-if="errorStatus">
      <p-error
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
    </p-card>
    <p-card v-else>
      <ul class="list-group list-group-flush">
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
            <b-col sm="4">
              <b-row>
                <b-col>
                  <b-row class="mb-3">
                    <b-col md="3">
                      <label for="input-default">Policy Name</label>
                    </b-col>
                    <b-col md="9">
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

                  <b-row
                    class="mb-3"
                    :key="index"
                    v-for="(regex, index) in regexFields"
                  >
                    <b-col md="3">
                      <label for="input-default">{{
                        "Regex " + [index + 1]
                      }}</label>
                    </b-col>
                    <b-col md="7" v-show="formdata.servicemeta == 'T'">
                      <b-form-input
                        placeholder="Enter regex"
                        type="text"
                        v-model="regexFields[index].regex"
                      ></b-form-input>
                    </b-col>
                    <b-col md="7" v-show="formdata.servicemeta == 'D'">
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
                    <b-col md="2">
                      <button
                        @click="deleteEmailfield"
                        class="btn btn-pill btn-danger btn-sm"
                        type="button"
                      >
                        <em class="fa fa-minus"></em>
                      </button>
                    </b-col>
                  </b-row>

                  <b-row class="mb-3">
                    <b-col md="3"> </b-col>
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
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="4">
              <b-row>
                <b-col>
                  <b-row class="mb-3">
                    <b-col md="3">
                      <label for="input-default">Behavior</label>
                    </b-col>
                    <b-col md="9">
                      <b-form-radio-group
                        :options="behaviortypes"
                        button-variant="outline-primary"
                        buttons
                        class="mb-1"
                        id="behavior"
                        name="service-behavior-type"
                        size="md"
                        v-model="formdata.behavior"
                      />
                    </b-col>
                  </b-row>

                  <b-row class="mb-3">
                    <b-col md="3">
                      <label for="input-default">Service Meta</label>
                    </b-col>
                    <b-col md="9">
                      <b-form-radio-group
                        :options="serviceMetaTypes"
                        button-variant="outline-primary"
                        buttons
                        class="mb-1"
                        id="service_type_name"
                        name="service-meta-type"
                        size="md"
                        v-model="formdata.servicemeta"
                      />
                    </b-col>
                  </b-row>

                  <b-row class="mb-3" v-show="formdata.servicemeta == 'D'">
                    <b-col md="3">
                      <label for="input-default">Service Types</label>
                    </b-col>
                    <b-col md="9">
                      <b-button-group>
                        <b-button
                          :class="serviceDatabase[0].classdata"
                          :id="serviceDatabase[0].iddata"
                          :pressed="formdata.servicetype === '1'"
                          @click="formdata.servicetype = '1'"
                          variant="outline-primary"
                        ></b-button>
                        <b-button
                          :class="serviceDatabase[1].classdata"
                          :id="serviceDatabase[1].iddata"
                          :pressed="formdata.servicetype === '2'"
                          @click="formdata.servicetype = '2'"
                          variant="outline-primary"
                        ></b-button>
                        <b-button
                          :class="serviceDatabase[2].classdata"
                          :id="serviceDatabase[2].iddata"
                          :pressed="formdata.servicetype === '3'"
                          @click="formdata.servicetype = '3'"
                          variant="outline-primary"
                        ></b-button>
                        <b-button
                          :class="serviceDatabase[3].classdata"
                          :id="serviceDatabase[3].iddata"
                          :pressed="formdata.servicetype === '4'"
                          @click="formdata.servicetype = '4'"
                          variant="outline-primary"
                        ></b-button>
                      </b-button-group>
                    </b-col>
                  </b-row>

                  <b-row class="mb-3" v-show="formdata.servicemeta == 'T'">
                    <b-col md="3">
                      <label for="input-default">Service Types</label>
                    </b-col>
                    <b-col md="9">
                      <b-button-group>
                        <b-button
                          :class="serviceTerminal[0].classdata"
                          :id="serviceTerminal[0].iddata"
                          :pressed="formdata.servicetype === '5'"
                          @click="formdata.servicetype = '5'"
                          variant="outline-primary"
                        ></b-button>
                        <b-button
                          :class="serviceTerminal[1].classdata"
                          :id="serviceTerminal[1].iddata"
                          :pressed="formdata.servicetype === '6'"
                          @click="formdata.servicetype = '6'"
                          variant="outline-primary"
                        ></b-button>
                        <b-button
                          :class="serviceTerminal[2].classdata"
                          :id="serviceTerminal[2].iddata"
                          :pressed="formdata.servicetype === '7'"
                          @click="formdata.servicetype = '7'"
                          variant="outline-primary"
                        ></b-button>
                        <b-button
                          :class="serviceTerminal[3].classdata"
                          :id="serviceTerminal[3].iddata"
                          :pressed="formdata.servicetype === '8'"
                          @click="formdata.servicetype = '8'"
                          variant="outline-primary"
                        ></b-button>
                      </b-button-group>
                    </b-col>
                  </b-row>

                  <b-row class="mb-3" v-show="formdata.servicemeta == 'T'">
                    <b-col md="3">
                      <label for="input-default">Operating Systems</label>
                    </b-col>
                    <b-col md="9">
                      <b-button-group>
                        <b-button
                          :class="operatingSystems[0].classdata"
                          :id="operatingSystems[0].iddata"
                          :pressed="formdata.operatingsystem === '1'"
                          @click="formdata.operatingsystem = '1'"
                          variant="outline-primary"
                        ></b-button>
                        <b-button
                          :class="operatingSystems[1].classdata"
                          :id="operatingSystems[1].iddata"
                          :pressed="formdata.operatingsystem === '2'"
                          @click="formdata.operatingsystem = '2'"
                          variant="outline-primary"
                        ></b-button>
                        <b-button
                          :class="operatingSystems[2].classdata"
                          :id="operatingSystems[2].iddata"
                          :pressed="formdata.operatingsystem === '3'"
                          @click="formdata.operatingsystem = '3'"
                          variant="outline-primary"
                        ></b-button>
                        <b-button
                          :class="operatingSystems[3].classdata"
                          :id="operatingSystems[3].iddata"
                          :pressed="formdata.operatingsystem === '4'"
                          @click="formdata.operatingsystem = '4'"
                          variant="outline-primary"
                        ></b-button>
                        <b-button
                          :class="operatingSystems[4].classdata"
                          :id="operatingSystems[4].iddata"
                          :pressed="formdata.operatingsystem === '5'"
                          @click="formdata.operatingsystem = '5'"
                          variant="outline-primary"
                        ></b-button>
                        <b-button
                          :class="operatingSystems[5].classdata"
                          :id="operatingSystems[5].iddata"
                          :pressed="formdata.operatingsystem === '6'"
                          @click="formdata.operatingsystem = '6'"
                          variant="outline-primary"
                        ></b-button>
                        <b-button
                          :class="operatingSystems[6].classdata"
                          :id="operatingSystems[6].iddata"
                          :pressed="formdata.operatingsystem === '7'"
                          @click="formdata.operatingsystem = '7'"
                          variant="outline-primary"
                        ></b-button>
                        <b-button
                          :class="operatingSystems[7].classdata"
                          :id="operatingSystems[7].iddata"
                          :pressed="formdata.operatingsystem === '8'"
                          @click="formdata.operatingsystem = '8'"
                          variant="outline-primary"
                        ></b-button>
                        <b-button
                          :class="operatingSystems[8].classdata"
                          :id="operatingSystems[8].iddata"
                          :pressed="formdata.operatingsystem === '9'"
                          @click="formdata.operatingsystem = '9'"
                          variant="outline-primary"
                        ></b-button>
                      </b-button-group>
                    </b-col>
                  </b-row>
                  <div class="d-flex justify-content-end">
                    <b-button
                      :disabled="validForm()"
                      @click="updatePolicy()"
                      v-if="updateButton"
                      variant="info"
                      >Update Service Policy
                    </b-button>
                    <b-button
                      :disabled="validForm()"
                      @click="savePolicy()"
                      v-else
                      variant="success"
                      >Save Service Policy
                    </b-button>
                    <b-button class="ml-1" @click="clear()" variant="warning"
                      >Clear
                    </b-button>
                  </div>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </li>
      </ul>
      <b-row>
        <b-col>
          <ul class="list-group list-group-flush">
            <li
              class="
                list-group-item
                d-flex
                justify-content-between
                align-items-center
              "
              :key="index"
              v-for="(item, index) in policies"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex justify-content-center align-items-center">
                  <em
                    class="fa fa-terminal fa-1x"
                    v-show="item.servicemeta == 'T'"
                  ></em>
                  <em
                    class="fa fa-database fa-1x"
                    v-show="item.servicemeta == 'D'"
                  ></em>

                  <div
                    :class="[
                      'inventory-logo',
                      'mx-auto',
                      servicetypeLogo(item.servicetype),
                    ]"
                    :title="servicetypeLogo(item.servicetype)"
                    v-b-tooltip.bottom
                  ></div>
                </div>
                <div style="margin-left: 15px">
                  <p class="mb-1">
                    <strong>{{ item.name }}</strong>
                  </p>

                  <div>
                    <em v-show="item.behavior == 'W'"
                      >Behavior:
                      <b-badge variant="light">WHITE</b-badge>
                    </em>
                    <em v-show="item.behavior == 'B'"
                      >Behavior:
                      <b-badge variant="dark">BLACK</b-badge>
                    </em>
                  </div>
                </div>
              </div>
              <div>
                <em>{{ regexList(item.policyRegexEntity) }}</em>
              </div>
              <div class="justify-content-between align-items-center">
                <em
                  ><strong>{{
                    item.created_at | moment("calendar")
                  }}</strong></em
                >
                <b-button
                  @click.stop="editPolicy(item)"
                  class="ml-2"
                  variant="info"
                  >Edit</b-button
                >
                <b-button
                  @click.stop="deletePolicy(item.id)"
                  class="ml-2"
                  variant="danger"
                  >Delete</b-button
                >
              </div>
            </li>
          </ul>
        </b-col>
      </b-row>
    </p-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      operatingSystems: [
        {
          classdata: "inventory-logo mx-auto ubuntu",
          iddata: "ubuntutip",
        },
        {
          classdata: "inventory-logo mx-auto redhat",
          iddata: "redhattip",
        },
        {
          classdata: "inventory-logo mx-auto debian",
          iddata: "debiantip",
        },
        {
          classdata: "inventory-logo mx-auto centos",
          iddata: "centostip",
        },
        {
          classdata: "inventory-logo mx-auto windows",
          iddata: "windowstip",
        },
        {
          classdata: "inventory-logo mx-auto unix",
          iddata: "unixtip",
        },
        {
          classdata: "inventory-logo mx-auto linux",
          iddata: "linuxtip",
        },
        {
          classdata: "inventory-logo mx-auto solaris",
          iddata: "solaristip",
        },
        {
          classdata: "inventory-logo mx-auto cisco",
          iddata: "ciscotip",
        },
      ],
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
      updateButton: false,
      users: [],
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
      regexFields: [
        {
          command: "SELECT",
          regex: "",
        },
      ],
      serviceMetaTypes: [
        {
          text: '<i class="fa fa-terminal fa-1x"></i> Terminal Service',
          value: "T",
        },
        {
          text: '<i class="fa fa-database fa-1x"></i> Database Service',
          value: "D",
        },
      ],
      behaviortypes: [
        {
          text: "WHITE",
          value: "W",
        },
        {
          text: "BLACK",
          value: "B",
        },
      ],
      selected: null,
      selectedUsers: [],
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
    };
  },
  methods: {
    clear() {
      this.selectedUsers = [];
      this.formdata = {
        id: "",
        name: "",
        behavior: "",
        servicetype: "",
        servicemeta: "T",
        operatingsystem: "",
      };
      this.services = [];
      this.regexFields = [
        {
          command: "SELECT",
          regex: "",
        },
      ];
      this.updateButton = false;
    },
    customLabel({ first_name, last_name, username }) {
      return `${first_name} ${last_name} (${username})`;
    },
    editPolicy(item) {
      this.formdata = item;
      let itemregexlist = [];
      if (item.servicemeta == "T") {
        this.regexFields = item.policyRegexEntity;
      } else if (item.servicemeta == "D") {
        for (let i = 0; i < item.policyRegexEntity.length; i++) {
          let a = item.policyRegexEntity[i].regex;
          let command = a.split(" ")[0];

          let regex = a.split(" ").pop();
          itemregexlist.push({
            command: command,
            regex: regex,
          });
        }
        this.regexFields = itemregexlist;
      }
      this.selectedUsers = [];
      for (let k = 0; k < this.users.length; k++) {
        for (let j = 0; j < item.policyUserEntity.length; j++) {
          if (this.users[k].userId == item.policyUserEntity[j].userid) {
            this.selectedUsers.push(this.users[k]);
          }
        }
      }

      this.updateButton = true;
    },
    updatePolicy() {
      this.updateButton = false;
      let list = [];

      let selectedUsers = [];
      for (let j = 0; j < this.selectedUsers.length; j++) {
        selectedUsers.push(this.selectedUsers[j].userId);
      }

      for (let i = 0; i < this.regexFields.length; i++) {
        if (this.formdata.servicemeta == "D") {
          this.formdata.operatingsystem = "";
          list.push(
            this.regexFields[i].command + " " + this.regexFields[i].regex
          );
        } else if (this.formdata.servicemeta == "T") {
          list.push(this.regexFields[i].regex);
        }
      }

      let data = {
        policyEntity: this.formdata,
        regexlist: list,
        userList: selectedUsers,
      };

      this.$http
        .put("/api/v1/policy/update", data)
        .then((response) => {
          this.$bvToast.toast(`This policy updated!`, {
            title: "Policy Notification",
            variant: "success",
            autoHideDelay: 5000,
          });

          this.updateTable();
          this.resetForm();
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Update operation has error!";
        });
    },
    deletePolicy(id) {
      this.$http
        .delete("/api/v1/policy/" + id)
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
          this.errorHeader = "Delete operation has error!";
        });
    },
    validForm() {
      if (
        this.formdata.name == "" ||
        this.formdata.behavior == "" ||
        this.regexFields[0].regex == ""
      ) {
        return true;
      } else if (this.formdata.servicemeta == "T") {
        return (
          this.formdata.servicetype == "1" ||
          this.formdata.servicetype == "2" ||
          this.formdata.servicetype == "3" ||
          this.formdata.servicetype == "4" ||
          this.formdata.operatingsystem == ""
        );
      } else if (this.formdata.servicemeta == "D") {
        return (
          this.formdata.servicetype == "5" ||
          this.formdata.servicetype == "6" ||
          this.formdata.servicetype == "7" ||
          this.formdata.servicetype == "8"
        );
      } else {
        return false;
      }
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
      if (this.regexFields.length < 5) {
        this.regexFields.push({
          command: "SELECT",
          regex: "",
        });
      }
    },
    deleteEmailfield() {
      this.regexFields.pop();
    },
    savePolicy() {
      let list = [];

      for (let i = 0; i < this.regexFields.length; i++) {
        if (this.formdata.servicemeta == "D") {
          this.formdata.operatingsystem = "";
          list.push(
            this.regexFields[i].command + " " + this.regexFields[i].regex
          );
        } else if (this.formdata.servicemeta == "T") {
          list.push(this.regexFields[i].regex);
        }
      }

      let data = {
        policyEntity: this.formdata,
        regexlist: list,
      };

      this.$http
        .put("/api/v1/policy", data)
        .then((response) => {
          this.updateTable();
          this.resetForm();
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Create operation has error!";
        });
    },
    resetForm() {
      this.formdata.name = "";
      this.formdata.servicetype = "";
      this.formdata.servicemeta = "T";
      this.formdata.operatingsystem = "";
      this.regexFields = [];
      this.regexFields.push({
        command: "SELECT",
        regex: "",
      });
    },
    updateTable() {
      this.$http
        .get("/api/v1/policy", {})
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
      .get("/api/v1/policy", {})
      .then((response) => {
        this.policies = response.data;
        console.log(this.policies);
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    this.$http
      .get("/api/v1/user")
      .then((response) => {
        this.users = response.data;
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
