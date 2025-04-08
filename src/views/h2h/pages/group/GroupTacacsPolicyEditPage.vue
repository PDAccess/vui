<template>
  <div class="animated fadeIn">
    <p-card>
      <p-error
        v-if="errorStatus"
        header="Edit operation has error!"
        :errorResponse="errorResponse"
        @reload="getActions"
      />
      <p-loading class="my-5" v-else-if="loading" message="Loading..." />
      <ul v-else class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Edit Agent Policy</h3>
              <p>
                Create users to use your modules and manage human resources
                effectively.
              </p>
            </b-col>
            <b-col sm="8">
              <b-row>
                <b-col>
                  <b-form-group description="Add name for Policy" horizontal>
                    <label for="inputLive">Name</label>
                    <b-form-input
                      :state="
                        !$v.formdata.name.$dirty
                          ? null
                          : !$v.formdata.name.$invalid
                      "
                      placeholder
                      type="text"
                      v-model.trim="$v.formdata.name.$model"
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      <div v-if="!$v.formdata.name.required">
                        Policy name is required.
                      </div>
                      <div v-if="!$v.formdata.name.minLength">
                        Policy name must have at least
                        {{
                          $v.formdata.name.$params.minLength.min -
                          formdata.name.length
                        }}
                        more letters.
                      </div>
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"></b-col>
            <b-col sm="8">
              <b-form-group description="Add description for Policy" horizontal>
                <label for="inputLive">Description</label>
                <b-form-input
                  :state="
                    !$v.formdata.description.$dirty
                      ? null
                      : !$v.formdata.description.$invalid
                  "
                  placeholder
                  type="text"
                  v-model.trim="$v.formdata.description.$model"
                ></b-form-input>
                <b-form-invalid-feedback>
                  <div v-if="!$v.formdata.description.required">
                    Policy Description is required.
                  </div>
                  <div v-if="!$v.formdata.description.minLength">
                    Policy Description must have at least
                    {{
                      $v.formdata.description.$params.minLength.min -
                      formdata.description.length
                    }}
                    more letters.
                  </div>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"></b-col>
            <b-col sm="8">
              <b-form-group
                description="Enter users indicating policy conditions"
                horizontal
              >
                <label for="inputLive">Users</label>
                <p-select
                  :options="users"
                  placeholder="Add Users"
                  tag-placeholder="Add this as new user"
                  v-model="selectedUsers"
                  :close-on-select="false"
                  label="username"
                  track-by="userId"
                  :multiple="true"
                ></p-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"></b-col>
            <b-col sm="8">
              <b-form-group
                description="Enter regex expressions indicating policy conditions"
                horizontal
              >
                <label for="inputLive">Regex</label>
                <p-select
                  v-model="regex"
                  tag-placeholder="Add this as new regex"
                  placeholder="Add Regex"
                  :options="regexOptions"
                  :multiple="true"
                  :taggable="true"
                  @tag="addRegexTag"
                  :close-on-select="false"
                ></p-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="my-4">
            <b-col cols="4"></b-col>
            <b-col cols="8" class="d-flex justify-content-end">
              <b-button
                :disabled="
                  $v.formdata.$invalid ||
                  (users.length == 0 && regex.length == 0)
                "
                variant="success"
                class="mr-2"
                @click="editPolicy"
                >Update Policy</b-button
              >
              <b-button variant="primary" @click="clearForm">Clear</b-button>
            </b-col>
          </b-row>
        </li>
      </ul>
    </p-card>
  </div>
</template>

<script>
//internet explorer için polyfill gerekli yoksa hata veriyor
import "babel-polyfill";

import { minLength, required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  props: ["id", "policyid"],
  components: {},
  data() {
    return {
      loading: true,
      errorStatus: false,
      errorResponse: "",
      userOptions: [],
      regexOptions: [],
      regex: [],
      selectedUsers: [],
      users: [],
      policyType: "",
      formdata: {
        name: "",
        description: "",
        users: "",
        regex: "",
      },
    };
  },
  mixins: [validationMixin],
  validations: {
    formdata: {
      name: {
        required,
        minLength: minLength(3),
      },
      description: {
        required,
        minLength: minLength(3),
      },
    },
  },
  methods: {
    addUserTag(newTag) {
      this.users.push(newTag);
      this.selectedUsers.push(newTag);
    },
    customLabel({ first_name, last_name, username }) {
      return `${first_name} ${last_name} (${username})`;
    },
    addRegexTag(newTag) {
      this.regexOptions.push(newTag);
      this.regex.push(newTag);
    },
    clearForm() {
      this.users = [];
      this.regex = [];
      this.formdata.name = "";
      this.formdata.description = "";
    },
    addTag1(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.value.push(tag);
    },
    editPolicy() {
      let data = {
        "name": this.formdata.name,
        "description": this.formdata.description,
        "userIds": this.selectedUsers.map(user => user.userId),
        "regexes": this.regex,
        "groupid": this.id,
        "policyType": this.policyType
      };

      this.$http
        .post("/api/v1/tacacs/policy/" + this.policyid, data)
        .then((response) => {
          this.$router.push({ path: `/groups/tacacspolicy/${this.id}` });
        })
        .catch((error) => {
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
  },
  created() {
    this.$http
      .get("/api/v1/group/user/members/" + this.id)
      .then((response) => {
        response.data.forEach(f => {
          this.users.push(f.user)
        });
        this.$http
        .get("/api/v1/tacacs/policy/" + this.policyid)
        .then((response) => {
          console.log("data: ", data);
          let data = response.data.policy;
          this.formdata.name = data.name;
          this.formdata.description = data.description;
          this.regex = data.regexes;
          this.regexOptions = [...this.regex];
          this.policyType = data.policyType;

          this.users.forEach(user => {
            if (data.userIds.includes(user.userId)) {
              this.selectedUsers.push(user);
              return
            }
          });
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
      });
    
  },
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
  .fade-leave-to

    /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
