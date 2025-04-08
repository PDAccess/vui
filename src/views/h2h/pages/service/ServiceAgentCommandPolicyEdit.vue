<template>
  <div class="animated fadeIn">
    <p-card>
      <p-loading v-if="loading" class="my-5" message="Loading..." />
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
                  :options="userOptions"
                  placeholder="Add Users"
                  tag-placeholder="Add this as new user"
                  v-model="users"
                  :multiple="true"
                  :taggable="true"
                  @tag="addUserTag"
                  :close-on-select="false"
                >
                </p-select>
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
      userOptions: [],
      regexOptions: [],
      regex: [],
      users: [],
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
    customLabel({ first_name, last_name, username }) {
      if (first_name == null || last_name == null) {
        return `(${username})`;
      }
      return `${first_name} ${last_name} (${username})`;
    },
    addUserTag(newTag) {
      this.userOptions.push(newTag);
      this.users.push(newTag);
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
    editPolicy() {
      let data = new FormData();
      data.append("name", this.formdata.name);
      data.append("description", this.formdata.description);
      data.append("users", JSON.stringify(this.users));
      data.append("regexes", JSON.stringify(this.regex));

      this.$http
        .put("/api/v1/filter/command/" + this.policyid, data)
        .then((response) => {
          this.$bvToast.toast(`Edited File Agent Policy`, {
            title: "Service Agent Policy Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.$router.push({ path: `/service/agentpolicy/${this.id}` });
        })
        .catch((error) => {
          this.$bvToast.toast(`Something went wrong!`, {
            title: "Service Agent Policy Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
          console.log(error);
        });
    },
  },
  created() {
    this.$http
      .get("/api/v1/filter/command/" + this.policyid)
      .then((response) => {
        let data = response.data;
        this.formdata.name = data.name;
        this.formdata.description = data.description;
        this.users = JSON.parse(data.users);
        this.regex = JSON.parse(data.regexes);
        this.userOptions = [...this.users];
        this.regexOptions = [...this.regex];
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
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
