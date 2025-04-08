<template>
  <div class="animated fadeIn">
    <p-card>
      <div v-if="errorStatus">
        <p-error
          header="Create operation has error!"
          :errorResponse="errorResponse"
          @reload="groupCreate"
        />
      </div>
      <div v-else>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Create a Group</h3>
              <p>
                Create customized groups to group the structures in the system
                as you wish.
              </p>
            </b-col>
            <b-col sm="8">
              <b-row>
                <b-col>
                  <b-form-group
                    description="Add name for Group"
                    horizontal
                    id="groupname"
                  >
                    <label for="inputLive">Group Name</label>
                    <b-form-input
                      id="groupname"
                      :state="
                        !$v.formdata.group_name.$dirty
                          ? null
                          : !$v.formdata.group_name.$invalid
                      "
                      placeholder
                      type="text"
                      v-model.trim="$v.formdata.group_name.$model"
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      <div v-if="!$v.formdata.group_name.required">
                        Group name is required.
                      </div>
                      <div v-if="!$v.formdata.group_name.minLength">
                        Group name must have at least
                        {{
                          $v.formdata.group_name.$params.minLength.min -
                          formdata.group_name.length
                        }}
                        more letters.
                      </div>
                      <div v-if="!$v.formdata.group_name.alpha">
                        Group name cannot contain numbers/special character.
                      </div>
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"> </b-col>
            <b-col sm="8">
              <b-form-group
                description="Add description for Group"
                horizontal
                id="groupdescription"
              >
                <label for="inputLive">Description</label>
                <b-form-textarea
                  id="groupdescription"
                  :state="
                    !$v.formdata.description.$dirty
                      ? null
                      : !$v.formdata.description.$invalid
                  "
                  placeholder
                  type="text"
                  v-model.trim="$v.formdata.description.$model"
                  rows="3"
                  max-rows="6"
                ></b-form-textarea>
                <b-form-invalid-feedback>
                  <div v-if="!$v.formdata.description.required">
                    Description is required.
                  </div>
                  <div v-if="!$v.formdata.description.minLength">
                    Description must have at least
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
          <b-row class="my-4">
            <b-col cols="4"> </b-col>
            <b-col cols="8" class="d-flex justify-content-end">
              <b-button
                :disabled="$v.formdata.$invalid"
                @click.stop="groupCreate($event.target)"
                variant="success"
                class="mr-2"
                >Submit</b-button
              >
              <b-button @click.stop="clearform()" variant="primary"
                >Clear</b-button
              >
            </b-col>
          </b-row>
        </li>
      </ul>
      </div>
    </p-card>
  </div>
</template>

<script>
//internet explorer için polyfill gerekli yoksa hata veriyor
import "babel-polyfill";

import { alpha, minLength, required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  data() {
    return {
      errorStatus: false,
      errorResponse: "",
      groupName: "",
      description: "",
      formdata: {
        group_name: "",
        description: "",
      },
    };
  },
  mixins: [validationMixin],
  validations: {
    formdata: {
      group_name: {
        required,
        alpha,
        minLength: minLength(3),
      },
      description: {
        required,
        minLength: minLength(3),
      },
    },
  },
  methods: {
    groupCreate() {
      let groupname = this.formdata.group_name.toLowerCase();
      let description = this.formdata.description;

      let param = {
        name: groupname,
        description: description,
      };

      this.$http
        .put("/api/ldap/v1/group", param)
        .then((response) => {
          console.log(response);
          this.$bvToast.toast(`Group Created!`, {
            title: "Group Settings Notification",
            variant: "success",
            autoHideDelay: 5000,
          });

          this.$router.push({
            name: "Groups List",
            params: { id: this.id },
            query: { sort: "createddesc" },
          });
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.$bvToast.toast(`This Group is already used!`, {
            title: "Group Settings Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
        });
    },
    clearform() {
      this.formdata.group_name = "";
      this.formdata.description = "";
    },
  },
  created() {
    //get require area to create group
  },
};
</script>
