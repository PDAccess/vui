<template>
  <div class="animated fadeIn">
    <p-card :cardBody="false">
      <p-error
        v-if="errorStatusUpdate"
        header="Update operation has error!"
        :errorResponse="errorResponse"
        @reload="updateGroup"
      />
      <p-error
        v-else-if="errorStatusDelete"
        header="Delete operation has error!"
        :errorResponse="errorResponse"
        @reload="deleteService"
      />
      <p-loading v-else-if="loading" class="my-5" message="Loading..." />
      <template v-else>
        <b-row>
          <b-col sm="4">
            <h3>Group Edit</h3>
            <p>
              You can make updates about your group by changing the name and
              description of the specified group
            </p>
          </b-col>
          <b-col sm="8">
            <b-form-group description="Edit Group name for Group" horizontal>
              <label for="inputLive">Name</label>
              <b-form-input
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
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="4"></b-col>
          <b-col sm="8">
            <b-form-group
              description="Edit Group description for Group"
              horizontal
            >
              <label for="inputLive">Description</label>
              <b-form-input
                :state="
                  !$v.formdata.group_description.$dirty
                    ? null
                    : !$v.formdata.group_description.$invalid
                "
                placeholder
                type="text"
                v-model.trim="$v.formdata.group_description.$model"
              ></b-form-input>
              <b-form-invalid-feedback>
                <div v-if="!$v.formdata.group_description.required">
                  Group description is required.
                </div>
                <div v-if="!$v.formdata.group_description.minLength">
                  Group description must have at least
                  {{
                    $v.formdata.group_description.$params.minLength.min -
                    formdata.group_name.length
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
              @click="updateGroup"
              :disabled="$v.formdata.$invalid || updateStatus"
              variant="success"
              class="mr-2"
              >Update Group</b-button
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
      errorStatusUpdate: false,
      errorResponse: "",
      errorStatusDelete: false,
      oldGroupName: "",
      updateStatus: false,
      loading: true,
      formdata: {
        group_name: "",
        group_description: "",
      },
      userRole: "User",
      info: {
        name: "",
      },
      deleteconfirmtext: "",
    };
  },
  mixins: [validationMixin],
  validations: {
    formdata: {
      group_name: {
        required,
        minLength: minLength(3),
      },
      group_description: {
        required,
        minLength: minLength(3),
      },
    },
  },
  methods: {
    clearForm() {
      this.formdata.group_name = "";
      this.formdata.group_description = "";
    },
    updateGroup() {
      this.updateStatus = true;

      let formData = new FormData();
      formData.append("group_name", this.formdata.group_name);
      formData.append("group_description", this.formdata.group_description);
      this.$http
        .put("/api/v1/group/" + this.id, formData)
        .then((response) => {
          this.$bvToast.toast(`Group successfully updated`, {
            title: "Update Success",
            variant: "info",
            autoHideDelay: 5000,
          });
          this.updateStatus = false;
        })
        .catch((error) => {
          console.log(error);
          this.$bvToast.toast(`Error while updating the group`, {
            title: "Update Failed",
            variant: "danger",
            autoHideDelay: 5000,
          });
          this.updateStatus = false;
          this.errorStatusUpdate = true;
          this.errorResponse = error;
        });
    },
    deleteService() {
      this.$http
        .delete("api/v1/group/" + this.id)
        .then((response) => {
          if ((response.status = 200)) {
            this.$bvToast.toast(`Deleted group!`, {
              title: "Group Notification",
              variant: "info",
              autoHideDelay: 5000,
            });
            this.$router.push(
              this.$route.query.redirect || "/groups/nav/yourgroups"
            );
          }
        })
        .catch(function (error) {
          console.log(error);
          this.errorStatusDelete = true;
          this.errorResponse = error;
        });
    },
  },
  created() {
    this.$http
      .get("/api/v1/group/info/" + this.id)
      .then((response) => {
        this.oldGroupName = response.data.groupname;
        this.formdata.group_name = response.data.groupname;
        this.formdata.group_description = response.data.description;
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>