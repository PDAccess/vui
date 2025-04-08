<template>
  <div class="animated fadeIn">
    <p-card :cardBody="false" style="width: auto">
      <div v-if="errorStatus">
        <p-error
          header="Create operation has error!"
          :errorResponse="errorResponse"
          @reload="realmCreate"
        />
      </div>
      <div v-else>
      <b-row class="my-1">
        <b-col sm="4">
          <h3>Create a Realm</h3>
          <p>
            Create realms to use your modules and manage human resources
            effectively.
          </p>
        </b-col>
        <b-col sm="8">
          <b-row>
            <b-col>
              <b-form-group
                description="Add name for Realm"
                horizontal
              >
                <label for="inputLive">Realm Name</label>
                <b-form-input
                  id="servicename"
                  :state="
                    !$v.formdata.name.$dirty
                      ? null
                      : !$v.formdata.name.$invalid
                  "
                  type="text"
                  v-model.trim="$v.formdata.name.$model"
                  placeholder=""
                ></b-form-input>
                <b-form-invalid-feedback>
                  <div v-if="!$v.formdata.name.required">
                    Realm name is required.
                  </div>
                  <div v-if="!$v.formdata.name.minLength">
                    Realm name must have at least
                    {{
                      $v.formdata.name.$params.minLength.min -
                      formdata.name.length
                    }}
                    letters.
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
              <b-form-group description="Add description for Realm" horizontal>
                <label for="inputLive">Description</label>
                <b-form-input
                  id="servicename"
                  type="text"
                  v-model.trim="formdata.description"
                  placeholder=""
                ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="4"> </b-col>
        <b-col sm="8" class="d-flex justify-content-end">
          <b-button
            class="mr-2"
            :disabled="$v.formdata.$invalid"
            @click="createRealm($event.target)"
            variant="success"
            >Create</b-button
          >
          <b-button @click="clearForm($event.target)" variant="primary"
            >Clear</b-button
          >
        </b-col>
      </b-row>
      </div>
    </p-card>
  </div>
</template>

<script>
//internet explorer için polyfill gerekli yoksa hata veriyor
import "babel-polyfill";

import Avatar from "vue-avatar";
import { required, minLength } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

import { RealmApi } from '@/generated/authws';

export default {
  components: {
    Avatar,
  },
  data() {
    return {
      services: [],
      errorStatus: false,
      errorResponse: "",
      Id: "",
      formdata: {
        name: "",
        description: "",
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
    },
  },
  methods: {
    createRealm() {
      let realmData = {
        name: this.formdata.name, 
        descriptionText: this.formdata.description
      }
      new RealmApi(this.$authHttpConfig, undefined, this.$http).createRealm(realmData)
      .then((response) => {
          this.$router.push("/admin/realms/list");
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    clearForm() {
      this.formdata.name = "";
      this.formdata.description = "";
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