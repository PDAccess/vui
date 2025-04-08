<template>
  <div class="animated fadeIn">
    <p-card>
      <div v-if="errorStatus">
        <p-error
          header="Create operation has error!"
          :errorResponse="errorResponse"
          @reload="savePolicy"
        />
      </div>
      <div v-else>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <b-row class="my-1">
              <b-col sm="4">
                <h3>Policies</h3>
                <p style="text-align: justify">
                  ​There are limitations that are services created before or
                  made up by whole group admins. Only group admins impose
                  restrictions on PDAccess. Also, there are two lists that are
                  black list and white list. The black list represents, banned
                  or blocked comments and the white list demonstrates one and
                  only the comments that have allowed by a group admin. Both
                  lists can be created separately so one of the services can not
                  contain both white and black lists.
                </p>
              </b-col>
              <b-col sm="8">
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
                      <b-col md="3">
                        <label for="input-default">Users</label>
                      </b-col>
                      <b-col md="9">
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
                    <b-row
                      class="mb-3"
                      v-for="(regex, index) in regexFields"
                      v-bind:key="index"
                    >
                      <b-col cols="3" md="3">
                        <label
                          v-if="formdata.behavior === 'S'"
                          for="input-default"
                          >{{ "Command " + [index + 1] }}</label
                        >
                        <label v-else for="input-default">{{
                          "Regex " + [index + 1]
                        }}</label>
                      </b-col>
                      <b-col
                        cols="7"
                        md="7"
                        v-show="formdata.servicemeta == 'T'"
                      >
                        <b-form-input
                          v-if="formdata.behavior === 'S'"
                          placeholder="Enter Command"
                          type="text"
                          v-model="regexFields[index].regex"
                        ></b-form-input>
                        <b-form-input
                          v-else
                          placeholder="Enter Regex"
                          type="text"
                          v-model="regexFields[index].regex"
                        ></b-form-input>
                      </b-col>
                      <b-col
                        cols="7"
                        md="7"
                        v-show="formdata.servicemeta == 'D'"
                      >
                        <b-input-group>
                          <b-form-select
                            :options="options2"
                            v-model="regexFields[index].command"
                          />
                          <b-form-input
                            v-if="formdata.behavior === 'S'"
                            placeholder="Enter Command"
                            type="text"
                            v-model="regexFields[index].regex"
                          ></b-form-input>
                          <b-form-input
                            v-else
                            placeholder="Enter Regex"
                            type="text"
                            v-model="regexFields[index].regex"
                          ></b-form-input>
                        </b-input-group>
                      </b-col>
                      <b-col cols="2" md="2">
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
                      <b-col cols="3" md="3"> </b-col>
                      <b-col>
                        <button
                          v-if="formdata.behavior == 'S'"
                          @click="addRegexField"
                          class="btn btn-outline-success btn-bg"
                          type="button"
                        >
                          Add Command
                        </button>
                        <button
                          v-else
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
                        >Save Group Policy
                      </b-button>
                      <b-button
                        variant="danger"
                        :to="'/groups/grouppolicy/' + id"
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
      </div>
    </p-card>
  </div>
</template>

<script>
import Avatar from "vue-avatar";

export default {
  props: ["id", "behavior"],
  components: {
    Avatar,
  },
  data() {
    return {
      errorStatus: false,
      errorResponse: "",
      selectedUsers: [],
      users: [],
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
      groups: [],
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
    validForm() {
      if (
        this.formdata.name == "" ||
        this.formdata.behavior == "" ||
        this.regexFields.length == 0 ||
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
    userList(list) {
      let user = "";
      for (let i = 0; i < list.length; i++) {
        user = user + list[i].userid + ", ";
      }
      user = user.slice(0, -2);

      return user;
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
      this.formdata.id = this.id;
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
      for (let i = 0; i < this.selectedUsers.length; i++) {
        selectedUsers.push(this.selectedUsers[i].userId);
      }

      let data = {
        policyEntity: this.formdata,
        regexList: list,
        type: "group",
        userList: selectedUsers,
      };
      this.$http
        .put("/api/v1/policy/proxy", data)
        .then((response) => {
          this.$router.push({
            name: "Group Policy",
            params: { id: this.id },
          });
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
  },
  created() {
    this.formdata.behavior = this.behavior;
    this.formdata.servicemeta = this.behavior == "D" ? "D" : "T";

    this.$http
      .get("api/v1/group/user/members/" + this.id)
      .then((response) => {
        let users = [];
        response.data.forEach((data) => {
          users.push(data.user);
        });

        this.users = users;
      })
      .catch((error) => {
        console.log(error);
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
