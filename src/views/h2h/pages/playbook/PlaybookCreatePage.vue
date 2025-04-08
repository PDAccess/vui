<template>
  <div class="animated fadeIn">
    <p-card v-if="user.role === 'Admin'">
      <p-error
        v-if="errorStatus"
        header="Something went wrong!"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <p-error
        v-else-if="errorStatusCreate"
        header="Create operation has error!"
        :errorResponse="errorResponse"
        @reload="createPlaybook"
      />
      <ul v-else class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <b-row>
                <b-col md="12">
                  <h3>Create Playbook</h3>
                  <p>You can created an Playbook</p>
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
              <b-button @click="createPlaybook" variant="success" class="mr-1"
                >Create Playbook</b-button
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
      errorStatusCreate: false,
      errorResponse: "",
      services: [],
      input: "",
      formdata: {
        name: "",
        description: "",
        ymlContent: "",
        services: [],
        userId: "",
        is_private: false,
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
    createPlaybook() {
      this.$http
        .post("/api/v1/playbook/", this.formdata)
        .then(() => {
          this.$bvToast.toast(`Playbook is Created!`, {
            title: "Playbook Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.$router.push(
            this.$route.query.redirect || "/playbook/nav/playbooks"
          );
        })
        .catch((error) => {
          this.errorStatusCreate = true;
          this.errorResponse = error;
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
    this.$http
      .get("/api/v1/service/sort")
      .then((response2) => {
        console.log(response2);
        this.services = response2.data;
      })
      .catch((error) => {
        this.errorStatus = true;
        this.errorResponse = error;
        console.log(error);
        this.$bvToast.toast(`Something went wrong!`, {
          title: "Playbook Notification",
          variant: "danger",
          autoHideDelay: 5000,
        });
      });
  },
};
</script>

<style scoped>
.editor-container {
  position: relative;
  height: 100%;
}
</style>