<template>
  <div class="animated fadeIn">
    <p-card :cardBody="false" style="width: auto">
      <p-loading v-if="loading" class="my-5" message="Loading..." />
      <template v-else>
        <b-row class="my-1">
          <b-col sm="4">
            <h3>Edit Realm</h3>
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
                  <label>Realm Name</label>
                  <b-form-input
                    id="servicename"
                    :state="!$v.formdata.name.$invalid"
                    type="text"
                    v-model.trim="$v.formdata.name.$model"
                    placeholder=""
                  ></b-form-input>
                  <b-form-invalid-feedback>
                    <div v-if="!$v.formdata.name.required">
                      Company name is required.
                    </div>
                    <div v-if="!$v.formdata.name.minLength">
                      Company name must have at least
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
              @click="updateRealm($event.target)"
              variant="success"
              >Update</b-button
            >
            <b-button
              @click="$router.go(-1)"
              variant="danger"
              >Back</b-button
            >
          </b-col>
        </b-row>
      </template>
    </p-card>
  </div>
</template>

<script>
//internet explorer için polyfill gerekli yoksa hata veriyor
import "babel-polyfill";

import { required, minLength } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

import { RealmApi } from '@/generated/authws';

export default {
  props: ["id"],
  data() {
    return {
      formdata: {
        name: "",
        description: "",
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
    },
  },
  methods: {
    updateRealm() {
    let realmData = {
      name: this.formdata.name,
      descriptionText: this.formdata.description
    }
    new RealmApi(this.$authHttpConfig, undefined, this.$http).updateRealm(this.id, realmData)
        .then(() => {
          this.$router.go(-1);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    new RealmApi(this.$authHttpConfig, undefined, this.$http).getRealmById(this.id)
      .then((response) => {
        this.formdata.name = response.data.name;
        this.formdata.description = response.data.descriptionText;
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
