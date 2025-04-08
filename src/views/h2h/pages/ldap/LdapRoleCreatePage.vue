<template>
  <div class="animated fadeIn">
    <p-card>
      <div v-if="errorStatus">
        <p-error
          header="Create operation has error!"
          :errorResponse="errorResponse"
          @reload="roleCreate"
        />
      </div>
      <div v-else>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <b-row class="my-1">
              <b-col sm="4">
                <h3>Create a Role</h3>
                <p>
                  Create customizable roles to provide your access management.
                </p>
              </b-col>
              <b-col sm="8">
                <b-row>
                  <b-col>
                    <b-form-group
                      description="Add name for Role"
                      horizontal
                      id="rolename"
                    >
                      <label for="inputLive">Role Name</label>
                      <b-form-input
                        id="rolename"
                        :state="
                          !$v.formdata.role_name.$dirty
                            ? null
                            : !$v.formdata.role_name.$invalid
                        "
                        placeholder
                        type="text"
                        v-model.trim="$v.formdata.role_name.$model"
                      ></b-form-input>
                      <b-form-invalid-feedback>
                        <div v-if="!$v.formdata.role_name.required">
                          Role name is required.
                        </div>
                        <div v-if="!$v.formdata.role_name.minLength">
                          Role name must have at least
                          {{
                            $v.formdata.role_name.$params.minLength.min -
                            formdata.role_name.length
                          }}
                          more letters.
                        </div>
                        <div v-if="!$v.formdata.role_name.alpha">
                          Role name cannot contain numbers/special character.
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
                  description="Add description for Role"
                  horizontal
                  id="roledescription"
                >
                  <label for="inputLive">Description</label>
                  <b-form-textarea
                    id="roledescription"
                    :state="
                      !$v.formdata.role_description.$dirty
                        ? null
                        : !$v.formdata.role_description.$invalid
                    "
                    placeholder
                    type="text"
                    v-model.trim="$v.formdata.role_description.$model"
                    rows="3"
                    max-rows="6"
                  ></b-form-textarea>
                  <b-form-invalid-feedback>
                    <div v-if="!$v.formdata.role_description.required">
                      Role description is required.
                    </div>
                    <div v-if="!$v.formdata.role_description.minLength">
                      Description must have at least
                      {{
                        $v.formdata.role_description.$params.minLength.min -
                        formdata.role_description.length
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
                  @click.stop="roleCreate($event.target)"
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
  props: ["id"],
  data() {
    return {
      errorStatus: false,
      errorResponse: "",
      formdata: {
        role_name: "",
        role_description: "",
      },
    };
  },
  mixins: [validationMixin],
  validations: {
    formdata: {
      role_name: {
        required,
        alpha,
        minLength: minLength(3),
      },
      role_description: {
        required,
        minLength: minLength(3),
      },
    },
  },
  methods: {
    roleCreate() {
      let rolename = this.formdata.role_name;
      let description = this.formdata.role_description;
      let gidnumber = 10001;

      let param = {
        gidnumber: gidnumber,
        name: rolename,
        description: description,
      };

      this.$http
        .put("/api/ldap/v1/role/" + this.id, param)
        .then((response) => {
          this.$bvToast.toast(`Role Created!`, {
            title: "Role Settings Notification",
            variant: "success",
            autoHideDelay: 5000,
          });

          this.$router.push({
            name: "Role List",
            params: { id: this.id },
            query: { sort: "name" },
          });
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.$bvToast.toast(`This Role is already used!`, {
            title: "Role Settings Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
        });
    },
    clearform() {
      this.formdata.role_name = "";
      this.formdata.role_description = "";
    },
  },
  created() {
    //get need info for create role
  },
};
</script>
