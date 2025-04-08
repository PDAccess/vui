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
          <p-loading v-else-if="loading" class="my-5" message="Loading..." />
          <b-row v-else class="my-1">
            <b-col sm="4">
              <h3>Edit Policy</h3>
              <p style="text-align: justify">
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

                  <b-row
                    class="mb-3"
                    v-for="(regex, index) in regexFields"
                    v-bind:key="index"
                  >
                    <b-col md="3">
                      <label for="input-default">{{
                        "Regex " + [index + 1]
                      }}</label>
                    </b-col>
                    <b-col md="7">
                      <b-form-input
                        placeholder="Enter Regex"
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
                        Add Regex
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
                      :to="'/groups/grouppolicy/' + groupid"
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
      errorStatus: false,
      errorResponse: "",
      errorStatusUpdate: false,
      loading: true,
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

      ],
      groups: [],
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
        for (let j = 0; j < item.policyUserEntity.length; j++) {
          if (this.users[i].userId == item.policyUserEntity[j]) {
            this.selectedUsers.push(this.users[i]);
          }
        }
      }

      this.formdata = item;
      if (item.behavior == "BLACK") {
        this.formdata.behavior = "B"
      } else if (item.behavior == "WHITE") {
        this.formdata.behavior = "W"
      }
      this.regexFields = item.policyRegexEntity;

      this.updateButton = true;
    },
    updatePolicy() {
      let list = [];

      for (let i = 0; i < this.regexFields.length; i++) {
        list.push(this.regexFields[i]);
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
        .put("/api/v1/policy/update", data)
        .then((response) => {
          this.$bvToast.toast(`This policy updated!`, {
            title: "Policy Notification",
            variant: "success",
            autoHideDelay: 5000,
          });

          this.$router.push({
            name: "Group Policy",
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
        this.regexFields[this.regexFields.length - 1] != ""
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
          .get("/api/v1/policy/id/" + this.policyid)
          .then((response2) => {
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
