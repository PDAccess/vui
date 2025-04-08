<template>
  <div class="animated fadeIn">
    <p-card>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <div v-if="errorStatus">
            <p-error
              header="Create operation has error!"
              :errorResponse="errorResponse"
              @reload="createPolicy"
            />
          </div>
          <div v-else>
            <b-row class="my-1">
              <b-col sm="4">
                <h3>Create a Agent Policy</h3>
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
                <b-form-group
                  description="Add description for Policy"
                  horizontal
                >
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
                    placeholder="Select Users"
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
                  description="Enter path expressions indicating policy conditions"
                  horizontal
                >
                  <label for="inputLive">Paths</label>
                  <p-select
                    v-model="paths"
                    tag-placeholder="Add this as new path"
                    placeholder="Add path"
                    :options="pathOptions"
                    :multiple="true"
                    :taggable="true"
                    @tag="addPathTag"
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
                    (users.length == 0 && paths.length == 0)
                  "
                  variant="success"
                  class="mr-2"
                  @click="createPolicy"
                  >Create Policy</b-button
                >
                <b-button variant="primary" @click="clearForm">Clear</b-button>
              </b-col>
            </b-row>
          </div>
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
  props: ["id"],
  components: {},
  data() {
    return {
      errorStatus: false,
      errorResponse: "",
      userOptions: [],
      pathOptions: [],
      paths: [],
      users: [],
      formdata: {
        name: "",
        description: "",
        users: [],
        path: [],
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
    addUserTag(newTag) {
      this.userOptions.push(newTag);
      this.users.push(newTag);
    },
    addPathTag(newTag) {
      this.pathOptions.push(newTag);
      this.paths.push(newTag);
    },
    clearForm() {
      this.users = [];
      this.paths = [];
      this.formdata.name = "";
      this.formdata.description = "";
    },
    createPolicy() {
      let data = new FormData();
      data.append("name", this.formdata.name);
      data.append("description", this.formdata.description);
      data.append("users", JSON.stringify(this.users));
      data.append("paths", JSON.stringify(this.paths));
      data.append("group_id", this.id);

      this.$http
        .post("/api/v1/filter/file", data)
        .then((response) => {
          console.log(response.data);
          this.$router.push({ path: `/groups/agentpolicy/${this.id}` });
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
  },
  created() {
    this.$http
      .get("/api/v1/group/user/members/" + this.id)
      .then((response) => {
        response.data.forEach((f) => {
          this.userOptions.push(f.user.username);
        });
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
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
