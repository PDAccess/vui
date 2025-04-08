<template>
  <div class="animated fadeIn">
    <p-card>
      <ul class="list-group list-group-flush">
        <div v-if="errorStatus">
          <p-error
            header="Edit operation has error!"
            :errorResponse="errorResponse"
            @reload="createPolicy"
          />
        </div>
        <div v-else>
          <li class="list-group-item">
            <b-row class="my-1">
              <b-col sm="4">
                <h3>Edit a Tacacs Privileged Policy</h3>
                <p>
                  Edit tacacs privileged policy on users to manage tacacs authorizations.
                </p>
              </b-col>
              <b-col sm="8">
                <b-form-group
                  description="Enter users indicating policy conditions"
                  horizontal
                >
                  <label for="inputLive">Users</label>
                  <p-select
                    :options="userOptions"
                    placeholder="Add User"
                    v-model="$v.formdata.user.$model"
                    label="username"
                    track-by="userId"
                    :multiple="true"
                  >
                  </p-select>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row class="my-1">
              <b-col sm="4"></b-col>
              <b-col sm="8">
                <b-form-group
                  description="Add description for Policy"
                  horizontal
                >
                  <label for="inputLive">Privileged Level</label>
                  <b-form-input
                    :state="
                      !$v.formdata.privLevel.$dirty
                        ? null
                        : !$v.formdata.privLevel.$invalid
                    "
                    placeholder
                    type="text"
                    v-model.trim="$v.formdata.privLevel.$model"
                  ></b-form-input>
                  <b-form-invalid-feedback>
                    <div v-if="!$v.formdata.privLevel.required">
                      Privileged Level is required.
                    </div>
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row class="my-4">
              <b-col cols="4"></b-col>
              <b-col cols="8" class="d-flex justify-content-end">
                <b-button
                  :disabled="
                    $v.formdata.$invalid
                  "
                  variant="success"
                  class="mr-2"
                  @click="editPrivPolicy"
                  >Edit Privileged Policy</b-button
                >
                <b-button variant="primary" @click="clearForm">Clear</b-button>
              </b-col>
            </b-row>
          </li>
        </div>
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
  props: ["id", "privId"],
  components: {},
  data() {
    return {
      userOptions: [],
      errorStatus: false,
      errorResponse: "",
      regexOptions: [],
      regex: [],
      users: [],
      formdata: {
        privLevel: "",
        user: [],
      },
    };
  },
  mixins: [validationMixin],
  validations: {
    formdata: {
      user: {
        required,
      },
      privLevel: {
        required,
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
    addRegexTag(newTag) {
      this.regexOptions.push(newTag);
      this.regex.push(newTag);
    },
    addUserTag(newTag) {
      this.userOptions.push(newTag);
      this.users.push(newTag);
    },
    clearForm() {
      this.formdata.user = [];
      this.formdata.privLevel = "";
    },
    editPrivPolicy() {
      console.log("privId: ", this.privId)
      let data = {
        "privilegeId": this.privId,
        "privilegedLevel": this.formdata.privLevel,
        "userId": this.formdata.user.map(user => user.userId),
      };

      this.$http
        .post("/api/v1/tacacs/privilege/group/" + this.id, data)
        .then((response) => {
          this.$bvToast.toast(`Updated Privileged Tacacs Policy`, {
            title: "Group Tacacs Policy Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.$router.push({ path: `/groups/tacacspolicy/${this.id}` });
        })
        .catch((error) => {
          this.$bvToast.toast(`Something went wrong!`, {
            title: "Group Tacacs Policy Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
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
        response.data.forEach(f => {
          this.userOptions.push(f.user)
        });
        this.$http.get("/api/v1/tacacs/privilege/" + this.privId)
        .then((response) => {
          this.userOptions.forEach(user => {
            if (response.data.privilege.userId.includes(user.userId)) {
              this.formdata.user.push(user);
              return
            }
          });
          this.formdata.privLevel = response.data.privilege.privilegedLevel
          this.loading = false;
        }).catch(error => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        })
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
