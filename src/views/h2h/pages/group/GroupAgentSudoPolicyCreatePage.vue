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
                  restrictions on PDAccess. There are limitations that are
                  services created before or made up by whole group admins. Only
                  group admins impose restrictions on PDAccess. In this context,
                  you can define which users will be authorized to run sudo
                  commands by creating a sudo policy for agents.
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
                        <label for="input-default">Run as User:</label>
                      </b-col>
                      <b-col md="9">
                        <b-form-input
                          type="text"
                          v-model="formdata.runAsUser"
                        ></b-form-input>
                      </b-col>
                    </b-row>

                    <b-row>
                      <b-col md="3">
                        <label for="input-default">Policy Type:</label>
                      </b-col>
                      <b-col md="9">
                        <b-form-radio-group
                          id="policyTypeRadio"
                          v-model="selectedPolicyType"
                          name
                        >
                          <b-row>
                            <b-col lg="3" md="4" sm="6">
                              <b-form-radio
                                name="radio-size"
                                size="sm"
                                value="group"
                                >Group Policy</b-form-radio
                              >
                            </b-col>
                            <b-col lg="3" md="4" sm="6">
                              <b-form-radio
                                name="radio-size"
                                size="sm"
                                value="user"
                                >User Policy</b-form-radio
                              >
                            </b-col>
                          </b-row>
                        </b-form-radio-group>
                      </b-col>
                    </b-row>
                    <br>
                    <b-row v-show="selectedPolicyType == 'user'" class="mb-3">
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

                    <b-row
                      class="mb-3"
                      v-for="(regex, index) in regexFields"
                      v-bind:key="index"
                    >
                      <b-col cols="3" md="3">
                        <label for="input-default">{{
                          "Command " + [index + 1]
                        }}</label>
                      </b-col>
                      <b-col
                        cols="7"
                        md="7"
                        v-show="formdata.servicemeta == 'T'"
                      >
                        <b-form-input
                          placeholder="Enter Command"
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
                            placeholder="Enter Command"
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
                          @click="addRegexField"
                          class="btn btn-outline-success btn-bg"
                          type="button"
                        >
                          Add Command
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
                        :to="'/groups/sudopolicy/' + id"
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
      selectedPolicyType: "group",
      errorStatus: false,
      errorResponse: "",
      selectedUsers: [],
      selectedGroups: [],
      users: [],
      groups: [],
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
      formdata: {
        id: "",
        name: "",
        behavior: "S",
        servicetype: "",
        servicemeta: "T",
        operatingsystem: "",
        runAsUser: "",
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
        this.regexFields[0].regex == "" ||
        (this.selectedPolicyType == "user" && this.selectedUsers.length == 0)
      ) {
        return true;
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
        if (this.regexFields[i].regex != "") {
          list.push(this.regexFields[i].regex);
        }
      }

      let selectedUsers = [];
      if (this.selectedPolicyType == "user") {
        for (let i = 0; i < this.selectedUsers.length; i++) {
          selectedUsers.push(this.selectedUsers[i].userId);
        }
      }

      let selectedGroups = [];
      for (let i = 0; i < this.selectedGroups.length; i++) {
        selectedGroups.push(this.selectedGroups[i].groupid);
      }

      let data = {
        policyEntity: this.formdata,
        regexList: list,
        type: "group",
        userList: selectedUsers,
        groupList: selectedGroups,
      };
      this.$http
        .put("/api/v1/policy/sudo", data)
        .then((response) => {
          this.$router.push({
            name: "Group Sudo Policy",
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
    this.formdata.behavior = "S";
    this.formdata.servicemeta = "T";
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

    this.$http
      .post("api/v1/group")
      .then((response) => {
        this.groups = response.data;
        console.log(response.data);
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
