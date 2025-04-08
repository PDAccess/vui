<template>
  <div class="animated fadeIn">
    <p-card>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>{{ isScratch ? " Create Credential" : title }}</h3>
              <p>
                {{ description }}
              </p>
            </b-col>
            <b-col sm="8">
              <div v-if="userDto === null">
                <b-button
                  variant="outline-primary my-1 mr-1"
                  @click="isScratch = true"
                  >{{ title }}</b-button
                >
                <b-button
                  variant="outline-primary my-1"
                  @click="isScratch = false"
                  >From Template</b-button
                >
              </div>
              <div v-if="isScratch || userDto !== null">
                <form>
                  <b-form-group description="Add Username for User" horizontal>
                    <label>Username</label>
                    <b-form-input
                      placeholder="username"
                      type="text"
                      v-model="credentialUser.username"
                    ></b-form-input>
                  </b-form-group>
                  <div class="d-flex justify-content-start mt-2 mb-2">
                    <b-form-checkbox
                      v-model="showPassword"
                      name="checkbox-1"
                      switch
                    >
                      I want to enter the password manually
                    </b-form-checkbox>
                  </div>
                  <div v-if="showPassword">
                    <b-form-group
                      description="Add password for User"
                      horizontal
                    >
                      <label>Password</label>
                      <b-form-input
                        placeholder="Password"
                        type="password"
                        v-model.trim="credentialUser.password"
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group
                      description="Confirm password for User"
                      horizontal
                    >
                      <label>Password Confirm</label>
                      <b-form-input
                        placeholder="Confirm password"
                        type="password"
                        v-model.trim="credentialUser.passwordConfirm"
                      ></b-form-input>
                    </b-form-group>
                  </div>
                  <label>Services</label>
                  <p-select
                    :options="services"
                    label="service"
                    class="my-1"
                    placeholder="Select service"
                    v-model.trim="formdata.services"
                    :multiple="false"
                    :custom-label="customLabelService"
                    :close-on-select="true"
                    :taggable="true"
                    @tag="addTag"
                  >
                    <template slot="singleLabel" slot-scope="props">
                      <span class="option__title">{{ props.option.name }}</span>
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
                            <span class="ml-1">{{ props.option.name }}</span>
                          </div>
                        </span>
                      </div>
                    </template>
                  </p-select>
                  <div class="form-group">
                    <label center>Select Users</label>
                    <p-select
                      id="serviceuseradd"
                      :disabled="locked"
                      v-model="selectedUsers"
                      :options="usersOptions"
                      track-by="userId"
                      placeholder="Select Users"
                      :multiple="true"
                      :taggable="true"
                      @tag="addTag1"
                      :custom-label="customLabel"
                      :show-labels="false"
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
                  </div>
                  Permissions
                  <div class="mt-2">
                    <b-form-checkbox
                      class="mt-1"
                      v-for="(permission, item) in permissions"
                      v-bind:key="item"
                      name="checkbox-1"
                      v-model="permission.enable"
                      switch
                    >
                      {{ permission.label }}
                    </b-form-checkbox>
                    <br />
                  </div>
                  <hr />
                  <div class="d-flex justify-content-start mt-2">
                    <b-form-checkbox
                      v-model="isTemplate"
                      name="checkbox-1"
                      switch
                    >
                      Also save as template user
                    </b-form-checkbox>
                  </div>
                </form>
              </div>
              <div v-else-if="!isScratch && userDto == null">
                <b-form-group
                  description="Select the users to whom the alarm will be sent"
                  horizontal
                >
                  <label>Users</label>
                  <p-select
                    :options="users"
                    label="username"
                    placeholder="Select Users"
                    v-model.trim="formdata.users"
                    :multiple="false"
                    :custom-label="customLabel"
                    track-by="username"
                    :close-on-select="true"
                    :taggable="true"
                    @tag="addTag"
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
                            <span class="ml-1">{{
                              props.option.username
                            }}</span>
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
                  <label
                    v-if="formdata.users !== null && formdata.users !== []"
                    class="mt-2"
                    >Services</label
                  >
                  <p-select
                    v-if="formdata.users !== null && formdata.users !== []"
                    :options="services"
                    label="service"
                    placeholder="Select service"
                    v-model.trim="formdata.services"
                    :multiple="false"
                    :custom-label="customLabel"
                    track-by="username"
                    :close-on-select="true"
                    :taggable="true"
                    @tag="addTag"
                  >
                    <template slot="singleLabel" slot-scope="props">
                      <span class="option__title">{{ props.option.name }}</span>
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
                            <span class="ml-1">{{ props.option.name }}</span>
                          </div>
                        </span>
                      </div>
                    </template>
                  </p-select>
                </b-form-group>
              </div>
            </b-col>
          </b-row>
          <b-row class="my-4">
            <b-col cols="4"></b-col>
            <b-col cols="8" class="d-flex justify-content-end">
              <b-button
                :disabled="$v.formdata.$invalid"
                variant="success"
                class="mr-2"
                @click="createAccount"
                >Create Account
              </b-button>
              <b-button variant="primary">Clear</b-button>
            </b-col>
          </b-row>
        </li>
      </ul>
    </p-card>
  </div>
</template>

<script>
import "babel-polyfill";

import { required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { mapActions, mapGetters } from "vuex";

export default {
  props: ["id"],
  computed: {
    ...mapGetters({
      userDto: "util/selectedUserPermission",
    }),
  },
  data() {
    return {
      title: "From Scratch",
      description: "You can create a user from scratch or using a template.",
      locked: false,
      isScratch: true,
      credentialUser: {
        username: "",
        password: "",
        passwordConfirm: "",
      },
      isTemplate: false,
      options: [],
      users: [],
      selectedUsers: [],
      usersOptions: [],
      services: [],
      showPassword: false,
      formdata: {
        users: [],
        services: [],
      },
      permissions: [
        { label: "Can connection", enable: false },
        { label: "Can see password", enable: false },
        { label: "Can change password ", enable: false },
        { label: "Can authorize other users", enable: false },
        { label: "Can join sessions", enable: false },
        { label: "Can connection with request permission", enable: false },
        { label: "Can manage other users", enable: false },
      ],
    };
  },
  mixins: [validationMixin],
  validations: {
    formdata: {
      users: {
        required,
      },
    },
  },
  methods: {
    ...mapActions({
      setSelectedUserPermission: "util/setSelectedUserPermission",
    }),
    modelIsValid() {
      return (
        this.credentialUser.username !== "" &&
        this.credentialUser.password !== "" &&
        this.credentialUser.passwordConfirm !== ""
      );
    },
    addTag(newTag) {
      let data = {
        username: newTag,
      };
      this.users.push(data);
      this.formdata.users = data;
    },
    customLabel({ first_name, last_name, username }) {
      return `${first_name} ${last_name} (${username})`;
    },
    customLabelService({ name }) {
      return `${name}`;
    },
    addTag1(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.value.push(tag);
    },
    createAccount() {
      let data = new FormData();
      data.append("username", this.formdata.users.username);
      console.log(this.formdata);
      /* this.$http
         .post("/api/service/connection-users/" + this.id, data)
         .then(() => {
           this.$bvToast.toast(`Created Account`, {
             title: "Service Account Notification",
             variant: "success",
             autoHideDelay: 5000,
           });
           this.$router.push({
             name: "Local Accounts",
             params: { id: this.id },
           });
         })
         .catch((error) => {
           console.log(error.status);
           if (error.status === 409) {
             this.$bvToast.toast(`Account already registered`, {
               title: "Service Account Notification",
               variant: "warning",
               autoHideDelay: 5000,
             });
           } else {
             this.$bvToast.toast(`Something went wrong!`, {
               title: "Service Account Notification",
               variant: "danger",
               autoHideDelay: 5000,
             });
           }
           console.log(error);
         });*/
    },
  },
  destroyed() {
    this.setSelectedUserPermission(null);
  },
  created() {
    this.$http
      .get("/api/templateuser/")
      .then((response) => {
        this.users = response.data;
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
      });
    this.$http
      .get("/api/v1/user")
      .then((response) => {
        this.usersOptions = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    this.$http
      .get("/api/v1/service/all")
      .then((response) => {
        this.services = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    if (this.userDto !== null) {
      this.isScratch = false;
      this.permissions = this.userDto.permissions;
      if (this.userDto.user !== null) {
        this.selectedUsers.push(this.userDto.user);
      }
      this.title = "Edit Credential";
      this.description = "You can edit credential.";
      this.credentialUser.username = this.userDto.connectionUserEntity.username;
      this.formdata.services.push(this.credentialUser.service);
    }
  },
};
</script>
<style>
.tab-content {
  border: none;
}

.card-header {
  background-color: #fff;
}
</style>
