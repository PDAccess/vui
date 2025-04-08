<template>
  <div class="animated fadeIn">
    <p-card>
      <p-error
        v-if="errorStatus"
        header="List operation has error!"
        @reload="$router.go()"
      />
      <p-loading v-else-if="loading" class="my-5" message="Loading..." />
      <ul v-else class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Group Permissions</h3>
              <p>
                You can manage your group permissions for all Group Credentials
              </p>
            </b-col>
            <b-col sm="8">
              <div>
                <form>
                  <p-card>
                    Permissions
                    <hr />
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
                  </p-card>
                </form>
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
                >Save Permissions
              </b-button>
              <b-button variant="danger">Back</b-button>
            </b-col>
          </b-row>
        </li>
      </ul>
    </p-card>
  </div>
</template>

<script>
//import "babel-polyfill";

import { required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      userDto: "util/selectedUserPermission",
    }),
  },
  data() {
    return {
      title: "From Scratch",
      description: "You can create a credential.",
      locked: false,
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
      errorStatus: false,
      loading: true,
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
      return `${first_name} ${last_name} (${username})`.replace(
        "null null",
        ""
      );
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
    let groupId = this.$route.params.id;
    this.$http
      .get("/api/templateuser/")
      .then((response) => {
        this.users = response.data;
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
      });
    this.loading = true;
    this.$http
      .get("/api/v1/service/all")
      .then((response) => {
        this.services = response.data;
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
      });
    this.loading = true;
    this.$http
      .get("/api/v1/group/user/members/" + groupId)
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          this.selectedUsers.push(response.data[i].user);
        }
        this.loading = false;
        this.usersOptions = this.selectedUsers;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
      });

    if (this.userDto !== null) {
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
