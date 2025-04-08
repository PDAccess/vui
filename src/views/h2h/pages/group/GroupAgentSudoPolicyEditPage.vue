<template>
  <div class="animated fadeIn">
    <p-card>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <p-error
            v-if="errorStatus"
            header="Something went wrong!"
            :errorResponse="errorResponse"
            @reload="$router.go()"
          />
          <p-error
            v-else-if="errorStatusUpdate"
            header="Update operation has error!"
            :errorResponse="errorResponse"
            @reload="updatePolicy"
          />
          <p-loading class="my-5" v-else-if="loading" message="Loading..." />
          <b-row v-else class="my-1">
            <b-col sm="4">
              <h3>Edit Policy</h3>
              <p style="text-align: justify">
                ​There are limitations that are services created before or made
                up by whole group admins. Only group admins impose restrictions
                on PDAccess. In this context, you can define which users will be
                authorized to run sudo commands by creating a sudo policy for
                agents.
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
                    <b-col md="3">
                      <label for="input-default">{{
                        "Command " + [index + 1]
                      }}</label>
                    </b-col>
                    <b-col md="7">
                      <b-form-input
                        placeholder="Enter Command"
                        type="text"
                        v-model="regexFields[index]"
                      ></b-form-input>
                    </b-col>
                    <b-col md="2">
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
                    <b-col md="3"> </b-col>
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
                      @click="updatePolicy()"
                      v-if="updateButton"
                      variant="primary"
                      >Update Group Policy
                    </b-button>
                    <b-button
                      variant="danger"
                      :to="'/groups/sudopolicy/' + groupid"
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
  props: ["policyid", "groupid"],
  components: {},
  data() {
    return {
      selectedPolicyType: "user",
      loading: true,
      errorStatus: false,
      errorStatusUpdate: false,
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
      updateButton: true,
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
    editPolicy(item) {
      item = JSON.parse(JSON.stringify(item));

      console.log(item);

      this.selectedUsers = [];
      for (let i = 0; i < this.users.length; i++) {
        for (let k = 0; k < item.policyUserEntity.length; k++) {
          if (this.users[i].userId == item.policyUserEntity[k]) {
            this.selectedUsers.push(this.users[i]);
          }
        }
      }

      this.selectedGroups = [];
      for (let i = 0; i < this.groups.length; i++) {
        for (let m = 0; m < item.policyGroupEntity.length; m++) {
          if (this.groups[i].groupid == item.policyGroupEntity[m].groupId) {
            this.selectedGroups.push(this.groups[i]);
          }
        }
      }

      this.formdata = item;
      this.regexFields = item.policyRegexEntity;

      this.updateButton = true;

      if (item.policyUserEntity.length == 0) {
        this.selectedPolicyType = "group";
      }
    },
    updatePolicy() {
      let list = [];

      for (let i = 0; i < this.regexFields.length; i++) {
        if (
          this.regexFields[i] != ""
        ) {
          list.push(this.regexFields[i]);
        }
      }

      let selectedUsers = [];
      if (this.selectedPolicyType == "user") {
        for (let i = 0; i < this.selectedUsers.length; i++) {
          selectedUsers.push(this.selectedUsers[i].userId);
        }
      }

      console.log(this.selectedGroups);

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
        .put("/api/v1/policy/sudo/update", data)
        .then((response) => {
          this.$bvToast.toast(`This policy updated!`, {
            title: "Policy Notification",
            variant: "success",
            autoHideDelay: 5000,
          });

          this.$router.push({
            name: "Group Sudo Policy",
            params: { id: this.groupid },
          });
        })
        .catch((error) => {
          console.log(error);
          this.errorStatusUpdate = true;
          this.errorResponse = error;
        });
    },
    validForm() {
      if (
        this.formdata.name == "" ||
        this.formdata.behavior == "" ||
        this.regexFields.length == 0 ||
        this.regexFields[0].regex == "" ||
        (this.selectedUsers.length == 0 && this.selectedGroups.length == 0)
      ) {
        return true;
      } else if (this.formdata.servicemeta == "T") {
        return (
          this.formdata.servicetype == "1" ||
          this.formdata.servicetype == "2" ||
          this.formdata.servicetype == "3" ||
          this.formdata.servicetype == "4" ||
          this.formdata.operatingsystem == "" ||
          (this.selectedUsers.length == 0 && this.selectedGroups.length == 0)
        );
      } else if (this.formdata.servicemeta == "D") {
        return (
          this.formdata.servicetype == "5" ||
          this.formdata.servicetype == "6" ||
          this.formdata.servicetype == "7" ||
          this.formdata.servicetype == "8" ||
          (this.selectedUsers.length == 0 && this.selectedGroups.length == 0)
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
        this.regexFields.push("");
      }
    },
    deleteEmailfield(index) {
      if (index > -1) this.regexFields.splice(index, 1);
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
      .get("api/v1/group/user/members/" + this.groupid)
      .then((response) => {
        let users = [];
        response.data.forEach((data) => {
          users.push(data.user);
        });
        this.users = users;
        this.$http
          .get("/api/v1/policy/sudo/id/" + this.policyid)
          .then((response2) => {
            console.log(response2.data);
            this.editPolicy(response2.data);
            this.loading = false;
          })
          .catch((error) => {
            console.log(error);
            this.loading = false;
            this.errorStatus = true;
            this.errorResponse = error;
          });
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
      });

    this.$http
      .post("api/v1/group")
      .then((response) => {
        this.groups = response.data;
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
