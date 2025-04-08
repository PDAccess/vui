<template>
  <div class="animated fadeIn">
    <p-card v-if="user.role === 'Admin'">
      <div v-if="errorStatus">
        <p-error
          :header="errorHeader"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
      </div>
      <ul v-else class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <b-row>
                <b-col md="12">
                  <h3>Edit Playbook Installer</h3>
                  <p>You can edited your Playbook</p>
                </b-col>
              </b-row>
            </b-col>
            <b-col md="4">
              <b-row>
                <b-col md="12">
                  <b-form-group
                    description="Entry name for Playbook"
                    horizontal
                    id="name"
                    label="Playbook Name"
                    label-for="playbookName"
                    label-text-align="left"
                  >
                    <b-form-input
                      id="playbookName"
                      placeholder=""
                      type="text"
                      v-model="formdata.name"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <b-form-group
                    description="Add description for Playbook"
                    horizontal
                    id="description"
                    label="Description (optional)"
                    label-for="playbookDescription"
                    label-text-align="left"
                  >
                    <b-form-input
                      id="playbookDescription"
                      placeholder=""
                      type="text"
                      v-model="formdata.description"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <div class="form-group">
                    <b-form-group
                      description="Add Service for Playbook"
                      horizontal
                      id="service"
                      label="Sevices"
                      label-for="playbookService"
                      label-text-align="left"
                    >
                      <p-select
                        id="playbookService"
                        :multiple="true"
                        :options="services"
                        label="name"
                        placeholder="Select Service"
                        track-by="inventory_id"
                        v-model="formdata.services"
                      ></p-select>
                    </b-form-group>
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <b-form-fieldset
                    description="Choose visiblity"
                    horizontal
                    id="chooseVisibility"
                    label="Visibility"
                    label-for="visibility"
                    label-text-align="left"
                  >
                    <b-form-radio-group
                      :options="visibilityOptions"
                      button-variant="outline-primary"
                      buttons
                      class="mb-1"
                      id="visibility"
                      name="visibility"
                      size="md"
                      v-model="formdata.is_private"
                    />
                  </b-form-fieldset>
                </b-col>
              </b-row>
            </b-col>
            <b-col md="4">
              <b-row>
                <b-col md="12">
                  <b-form-fieldset
                    description="Add YAML for Playbook"
                    horizontal
                    id="yaml"
                    label="YAML Content"
                    label-for="playbookYAML"
                    label-text-align="left"
                  >
                    <div class="editor-container">
                      <yaml-editor v-model="formdata.ymlContent" />
                    </div>
                  </b-form-fieldset>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="d-flex justify-content-end">
              <b-button @click="editPlaybook" variant="success" class="mr-1"
                >Edit Playbook</b-button
              >
              <b-button @click="cancel" variant="danger">Cancel</b-button>
            </b-col>
          </b-row>
        </li>
      </ul>
    </p-card>
  </div>
</template>

<script>
import YamlEditor from "@/views/h2h/components/YamlEditor";
import { mapGetters } from "vuex";

export default {
  components: {
    YamlEditor,
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      services: [],
      input: "",
      formdata: {
        userId: "",
        name: "",
        description: "",
        ymlContent: "",
        services: [],
        is_private: null,
      },
      filter: "",
      sort: "createddesc",
      visibilityOptions: [
        {
          text: "Private",
          value: true,
        },
        {
          text: "Public",
          value: false,
        },
      ],
    };
  },
  methods: {
    editPlaybook() {
      let id = this.$attrs.id;
      this.$http
        .put("/api/v1/playbook/" + id, this.formdata)
        .then(() => {
          this.$bvToast.toast(`Playbook is Edited!`, {
            title: "Playbook Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.$router.push(
            this.$route.query.redirect || "/playbook/nav/playbooks"
          );
        })
        .catch((error) => {
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Create operation has error!";
          this.$bvToast.toast(`Something went wrong!`, {
            title: "Playbook Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
          console.log(error);
        });
    },
    cancel() {
      this.$router.push(
        this.$route.query.redirect || "/playbook/nav/playbooks"
      );
    },
  },
  created() {
    this.formdata.userId = this.user.userId;

    let id = this.$attrs.id;
    this.$http
      .get("/api/v1/playbook/" + id)
      .then((response2) => {
        let formdata = response2.data.ansibleInstallerEntity;
        this.formdata.name = formdata.name;
        this.formdata.description = formdata.description;
        this.formdata.ymlContent = formdata.ymlContent;
        this.formdata.is_private = formdata.private;
        this.formdata.services = response2.data.serviceEntities;
      })
      .catch((error) => {
        this.$bvToast.toast(`Something went wrong!`, {
          title: "Playbook Notification",
          variant: "danger",
          autoHideDelay: 5000,
        });
        console.log(error);
      });
    this.$http
      .get("/api/v1/service/sort")
      .then((response2) => {
        console.log(response2);
        this.services = response2.data;
      })
      .catch((error) => {
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
        this.$bvToast.toast(`Something went wrong!`, {
          title: "Playbook Notification",
          variant: "danger",
          autoHideDelay: 5000,
        });
        console.log(error);
      });
  },
  watch: {
    formdata: function () {
      console.log(this.formdata.services);
    },
  },
};
</script>

<style scoped>
.editor-container {
  position: relative;
  height: 100%;
}
</style>