<template>
  <div class="animated fadeIn">
    <p-loading class="my-5" message="Loading..." v-if="loading" />
    <p-card v-else>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Create a Alarm</h3>
              <p>
                Create users to use your modules and manage human resources
                effectively.
              </p>
            </b-col>
            <b-col sm="8">
              <b-row>
                <b-col>
                  <b-form-group description="Add name for Alarm" horizontal>
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
                        Alarm name is required.
                      </div>
                      <div v-if="!$v.formdata.name.minLength">
                        Alarm name must have at least
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
              <b-form-group description="Add description for Alarm" horizontal>
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
                    Alarm Description is required.
                  </div>
                  <div v-if="!$v.formdata.description.minLength">
                    Alarm Description must have at least
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
                description="Add a message indicating the alarm content to be shown in the notification"
                horizontal
              >
                <label for="inputLive">Message</label>
                <b-form-textarea
                  :state="
                    !$v.formdata.message.$dirty
                      ? null
                      : !$v.formdata.message.$invalid
                  "
                  placeholder
                  type="text"
                  v-model.trim="$v.formdata.message.$model"
                  rows="4"
                  max-rows="6"
                ></b-form-textarea>
                <b-form-invalid-feedback>
                  <div v-if="!$v.formdata.message.required">
                    Alarm message is required.
                  </div>
                  <div v-if="!$v.formdata.message.minLength">
                    Alarm message must have at least
                    {{
                      $v.formdata.message.$params.minLength.min -
                      formdata.message.length
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
                description="Select the users to whom the alarm will be sent"
                horizontal
              >
                <label for="inputLive">Users</label>
                <p-select
                  :options="users"
                  label="username"
                  placeholder="Select Users"
                  v-model.trim="formdata.users"
                  :multiple="true"
                  :custom-label="customLabel"
                  track-by="userId"
                  :close-on-select="false"
                >
                  <template slot="singleLabel" slot-scope="props">
                    <span class="option__title">{{
                      props.option.username
                    }}</span>
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
                <b-form-invalid-feedback>
                  <div v-if="!$v.formdata.users.required">
                    Users is required.
                  </div>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"></b-col>
            <b-col sm="8">
              <b-form-group
                description="Enter regex expressions indicating alarm conditions"
                horizontal
              >
                <label for="inputLive">Regex</label>
                <p-select
                  v-model="formdata.regex"
                  tag-placeholder="Add this as new regex"
                  placeholder="Add Regex"
                  :options="options"
                  :multiple="true"
                  :taggable="true"
                  @tag="addTag"
                  :close-on-select="false"
                ></p-select>
                <b-form-invalid-feedback>
                  <div v-if="!$v.formdata.regex.required">
                    Alarm regex is required.
                  </div>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="my-4">
            <b-col cols="4"></b-col>
            <b-col cols="8" class="d-flex justify-content-end">
              <b-button
                :disabled="$v.formdata.$invalid"
                variant="success"
                class="mr-2"
                @click="createAlarm"
                >Create Alarm</b-button
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
  props: ["id"],
  components: {},
  data() {
    return {
      options: [],
      users: [],
      formdata: {
        name: "",
        description: "",
        message: "",
        users: [],
        regex: [],
      },
      loading: true,
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
      message: {
        required,
        minLength: minLength(20),
      },
      users: {
        required,
      },
      regex: {
        required,
      },
    },
  },
  methods: {
    addTag(newTag) {
      this.options.push(newTag);
      this.formdata.regex.push(newTag);
    },
    customLabel({ first_name, last_name, username }) {
      return `${first_name} ${last_name} (${username})`;
    },
    clearForm() {
      this.formdata.name = "";
      this.formdata.description = "";
      this.formdata.message = "";
      this.formdata.users = [];
      this.formdata.regex = [];
    },
    createAlarm() {
      let users = [];
      for (let i = 0; i < this.formdata.users.length; i++) {
        users.push(this.formdata.users[i].userId);
      }

      let data = {
        name: this.formdata.name,
        description: this.formdata.description,
        message: this.formdata.message,
        users: users,
        regex: this.formdata.regex,
      };

      this.$http
        .post("/api/v1/alarm/groups/" + this.id, data)
        .then((response) => {
          this.$router.push({
            name: "Group Alarms",
            params: { id: this.id },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /*
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
    */
  },
  created() {
    this.$http
      .get("/api/v1/group/user/members/" + this.id)
      .then((response) => {
        response.data.forEach((f) => {
          this.users.push(f.user);
        });
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
