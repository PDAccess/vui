<template>
  <div class="animated fadeIn">
    <p-card :cardBody="false">
      <p-loading v-if="loading" class="my-5" message="Loading..." />
      <p-error
        v-else-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <template v-else>
        <b-row>
          <b-col sm="4">
            <h3>Service Edit</h3>
            <p>
              You can make updates about your service by changing the name and
              description of the specified service
            </p>
          </b-col>
          <b-col sm="8">
            <b-form-group description="Edit Service name for Group" horizontal>
              <label for="inputLive">Name</label>
              <b-form-input
                :state="
                  !$v.formdata.service_name.$dirty
                    ? null
                    : !$v.formdata.service_name.$invalid
                "
                placeholder
                type="text"
                v-model.trim="$v.formdata.service_name.$model"
              ></b-form-input>
              <b-form-invalid-feedback>
                <div v-if="!$v.formdata.service_name.required">
                  Service name is required.
                </div>
                <div v-if="!$v.formdata.service_name.minLength">
                  Service name must have at least
                  {{
                    $v.formdata.service_name.$params.minLength.min -
                    formdata.service_name.length
                  }}
                  more letters.
                </div>
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"></b-col>
          <b-col sm="8">
            <b-form-group
              description="Edit Service description for Group"
              horizontal
            >
              <label for="inputLive">Description</label>
              <b-form-input
                :state="
                  !$v.formdata.service_description.$dirty
                    ? null
                    : !$v.formdata.service_description.$invalid
                "
                placeholder
                type="text"
                v-model.trim="$v.formdata.service_description.$model"
              ></b-form-input>
              <b-form-invalid-feedback>
                <div v-if="!$v.formdata.service_description.required">
                  Service description is required.
                </div>
                <div v-if="!$v.formdata.service_description.minLength">
                  Service description must have at least
                  {{
                    $v.formdata.service_description.$params.minLength.min -
                    formdata.service_name.length
                  }}
                  more letters.
                </div>
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col sm="4"></b-col>
          <b-col sm="8" class="d-flex justify-content-end">
            <b-button
              @click="updateService"
              :disabled="$v.formdata.$invalid || updateStatus"
              variant="success"
              class="mr-2"
              >Update Service</b-button
            >
            <b-button @click="clearForm" variant="primary">Clear</b-button>
          </b-col>
        </b-row>
      </template>
    </p-card>
  </div>
</template>
<script>
import { minLength, required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  props: ["id"],
  data() {
    return {
      oldServiceName: "",
      updateStatus: false,
      loading: true,
      formdata: {
        service_name: "",
        service_description: "",
      },
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
    };
  },
  mixins: [validationMixin],
  validations: {
    formdata: {
      service_name: {
        required,
        minLength: minLength(3),
      },
      service_description: {
        required,
        minLength: minLength(3),
      },
    },
  },
  methods: {
    clearForm() {
      this.formdata.service_name = "";
      this.formdata.service_description = "";
    },
    updateService() {
      this.updateStatus = true;

      let formData = new FormData();
      formData.append("service_name", this.formdata.service_name);
      formData.append("service_description", this.formdata.service_description);
      this.$http
        .put("/api/service/" + this.id, formData)
        .then((response) => {
          this.$bvToast.toast(`Service successfully updated`, {
            title: "Update Success",
            variant: "info",
            autoHideDelay: 5000,
          });
          this.updateStatus = false;
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Update operation has error!";
          this.$bvToast.toast(`Error while updating the service`, {
            title: "Update Failed",
            variant: "danger",
            autoHideDelay: 5000,
          });
          this.updateStatus = false;
        });
    },
  },
  created() {
    this.$http
      .get("/api/v1/service/id/" + this.id)
      .then((response) => {
        this.oldServiceName = response.data.name;
        this.formdata.service_name = response.data.name;
        this.formdata.service_description = response.data.description;
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
  },
};
</script>