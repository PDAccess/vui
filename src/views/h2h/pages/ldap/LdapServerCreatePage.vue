<template>
  <div class="animated fadeIn">
    <p-card>
      <div v-if="errorStatus">
        <p-error
          header="Create operation has error!"
          :errorResponse="errorResponse"
          @reload="serverCreate"
        />
      </div>
      <div v-else>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <b-row class="my-1">
              <b-col sm="4">
                <h3>Create a Server</h3>
                <p>Add servers to manage your servers and make edits.</p>
              </b-col>
              <b-col sm="8">
                <b-row>
                  <b-col>
                    <b-form-group
                      description="Add server name for Server"
                      horizontal
                    >
                      <label for="inputLive">Server Name</label>
                      <b-form-input
                        :state="
                          !$v.formdata.server_name.$dirty
                            ? null
                            : !$v.formdata.server_name.$invalid
                        "
                        placeholder
                        type="text"
                        v-model.trim="$v.formdata.server_name.$model"
                      ></b-form-input>
                      <b-form-invalid-feedback>
                        <div v-if="!$v.formdata.server_name.required">
                          Server name is required.
                        </div>
                        <div v-if="!$v.formdata.server_name.minLength">
                          Server name must have at least
                          {{
                            $v.formdata.server_name.$params.minLength.min -
                            formdata.server_name.length
                          }}
                          more letters.
                        </div>
                        <div v-if="!$v.formdata.server_name.alpha">
                          Server name cannot contain numbers/special character.
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
                <b-row>
                  <b-col>
                    <b-form-group
                      description="Add server description for Server"
                      horizontal
                    >
                      <label for="inputLive">Server Description</label>
                      <b-form-textarea
                        :state="
                          !$v.formdata.server_description.$dirty
                            ? null
                            : !$v.formdata.server_description.$invalid
                        "
                        placeholder
                        type="text"
                        v-model.trim="$v.formdata.server_description.$model"
                        rows="3"
                        max-rows="6"
                      ></b-form-textarea>
                      <b-form-invalid-feedback>
                        <div v-if="!$v.formdata.server_description.required">
                          Server description is required.
                        </div>
                        <div v-if="!$v.formdata.server_description.minLength">
                          Server description must have at least
                          {{
                            $v.formdata.server_description.$params.minLength
                              .min - formdata.server_description.length
                          }}
                          more letters.
                        </div>
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-row class="my-4">
              <b-col cols="4"> </b-col>
              <b-col cols="8" class="d-flex justify-content-end">
                <b-button
                  :disabled="$v.formdata.$invalid"
                  @click.stop="serverCreate($event.target)"
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
        server_name: "",
        server_description: "",
      },
    };
  },
  mixins: [validationMixin],
  validations: {
    formdata: {
      server_name: {
        required,
        alpha,
        minLength: minLength(3),
      },
      server_description: {
        required,
        minLength: minLength(5),
      },
    },
  },
  methods: {
    serverCreate() {
      let serverName = this.formdata.server_name;
      let serverDescription = this.formdata.server_description;

      let params = {
        name: serverName,
        description: serverDescription,
      };
      this.$http
        .put("/api/ldap/v1/server/" + this.id, params)
        .then((response) => {
          this.$bvToast.toast(`Server Created!`, {
            title: "Server Settings Notification",
            variant: "success",
            autoHideDelay: 5000,
          });

          this.$router.push({
            name: "Server List",
            params: { id: this.id },
            query: { sort: "name" },
          });

        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.$bvToast.toast(`This Server is already used!`, {
            title: "Server Settings Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
        });
    },
    clearform() {
      this.formdata.server_name = "";
      this.formdata.server_description = "";
    },
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
