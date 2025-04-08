<template>
  <div class="animated fadeIn">
    <p-card  v-if="user.role === 'Admin'">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
        <div v-if="errorStatus">
          <p-error
            header="List operation has error!"
            :errorResponse="errorResponse"
            @reload="createsnippet"
          />
        </div>
        <div v-else>
          <b-row class="my-1">
            <b-col sm="4">
              <b-row>
                <b-col md="12">
                  <h3>Create Snippets</h3>
                  <p>You can create a Snippet</p>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="4">
              <b-row>
                <b-col md="12">
                  <b-form-group
                    description="Entry name for Snippet"
                    horizontal
                    id="snippetName2"
                    label="Title"
                    label-for="snippetname"
                    label-text-align="left"
                  >
                    <b-form-input
                      id="title"
                      placeholder=""
                      type="text"
                      v-model="formdata.title"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <b-form-group
                    description="Add description for Snippet"
                    horizontal
                    id="snippetName2"
                    label="Description(optional)"
                    label-for="description"
                    label-text-align="left"
                  >
                    <b-form-input
                      id="description"
                      placeholder=""
                      type="text"
                      v-model="formdata.description"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <b-form-fieldset
                    v-if="serviceSelected === 'D'"
                    description="Add info for Snippet"
                    horizontal
                    id="snippetName3"
                    label="Query"
                    label-for="info"
                    label-text-align="left"
                  >
                    <b-form-textarea
                      id="info"
                      placeholder=""
                      type="text"
                      v-model="formdata.info"
                    ></b-form-textarea>
                  </b-form-fieldset>
                  <b-form-fieldset
                    v-else-if="serviceSelected === 'T'"
                    description="Add info for Snippet"
                    horizontal
                    id="snippetName3"
                    label="Command"
                    label-for="info"
                    label-text-align="left"
                  >
                    <b-form-textarea
                      id="info"
                      placeholder=""
                      type="text"
                      v-model="formdata.info"
                    ></b-form-textarea>
                  </b-form-fieldset>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="4">
              <b-row>
                <b-col md="12">
                  <RadioSelection
                    @val="formdata.operatingSystemId = $event"
                    :description="'Select an OP system'"
                    :label="'Operating System'"
                    :values="selections.operatingSystems"
                    :radioGroup="'radio-group-1'"
                    :selectedValue="formdata.operatingSystemId.toString()"
                  />
                </b-col>
              </b-row>
              <hr />
              <b-row>
                <b-col md="12">
                  <b-form-fieldset
                    description="Choose a service type"
                    horizontal
                    id="service-type"
                    label="Service Type"
                    label-for="service-type"
                    label-text-align="left"
                  >
                    <b-form-radio-group
                      :options="selections.serviceMetaTypes"
                      button-variant="outline-primary"
                      buttons
                      class="mb-1"
                      id="service_type_name"
                      name="service-meta-type"
                      size="md"
                      v-model="serviceSelected"
                    />
                  </b-form-fieldset>
                </b-col>
              </b-row>
              <hr />
              <b-row>
                <b-col md="12">
                  <RadioSelection
                    @val="formdata.serviceTypeId = $event"
                    :description="'Select service'"
                    :label="'Service'"
                    :values="selections.serviceDatabase"
                    :radioGroup="'radio-group-2'"
                    :selectedValue="formdata.serviceTypeId.toString()"
                    v-show="serviceSelected === 'D'"
                  />

                  <RadioSelection
                    @val="formdata.serviceTypeId = $event"
                    :description="'Select service'"
                    :label="'Service'"
                    :values="selections.serviceTerminal"
                    :radioGroup="'radio-group-2'"
                    :selectedValue="formdata.serviceTypeId.toString()"
                    v-show="serviceSelected === 'T'"
                  />
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="d-flex justify-content-end">
              <b-button @click="createsnippet" variant="success" class="mr-1"
                >Create Snippet</b-button
              >
              <b-button @click="cancel" variant="danger">Cancel</b-button>
            </b-col>
          </b-row>
        </div>
        </li>
      </ul>
    </p-card>
  </div>
</template>
<script>
import RadioSelection from "@/views/h2h/components/RadioSelection.vue";
import radioSelectionsData from "@/views/h2h/util/radioSelectionsData.js";
import { mapGetters } from "vuex";

export default {
  components: {
    RadioSelection,
  },
  data() {
    return {
      formdata: {
        userid: "",
        title: "",
        description: "",
        info: "",
        operatingsystem: "",
        servicemeta: "T",
        operatingSystemId: 0,
        serviceTypeId: 0,
      },
      serviceSelected: "T",
      selections: radioSelectionsData,
      errorStatus: false,
      errorResponse: "",
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  methods: {
    createsnippet() {
      this.formdata.userid = this.user.userId;
      this.$http
        .put("/api/v1/snippet", this.formdata)
        .then((response) => {
          this.$bvToast.toast(`Snippet is Created!`, {
            title: "Snippet Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.$router.push(
            this.$route.query.redirect || "/snippets/nav/yoursnippets"
          );
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
        });

    },
    cancel() {
      this.$router.push(
        this.$route.query.redirect || "/snippets/nav/yoursnippets"
      );
    },
  },
};
</script>

<style scoped>
#info {
  height: 150px;
  padding: 12px 20px;
  box-sizing: border-box;
  border-radius: 4px;
  font-size: 16px;
  resize: none;
}

.serviceInputTag {
  width: 180px;
  font-weight: bold;
}
</style>