<template>
  <div class="animated fadeIn">
    <p-card v-if="user.role === 'Admin'">
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <div v-if="errorStatus">
            <p-error
              header="List operation has error!"
              :errorResponse="errorResponse"
              @reload="editSnippet"
            />
          </div>
          <div v-else>
          <b-row class="my-1">
            <b-col sm="4">
              <b-row>
                <b-col md="12">
                  <h3>Edit Snippet</h3>
                  <p>You can edited this Snippet</p>
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
                      :placeholder="snippetInfo.snippetEntity.title"
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
                      :placeholder="snippetInfo.snippetEntity.description"
                      type="text"
                      v-model="formdata.description"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="12">
                  <b-form-fieldset
                    description="Add info for Snippet"
                    horizontal
                    id="snippetName3"
                    label="Info"
                    label-for="info"
                    label-text-align="left"
                  >
                    <b-form-textarea
                      id="info"
                      :placeholder="snippetInfo.snippetEntity.info"
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
                    :id="'os-type'"
                    :label="'Operating System'"
                    :label-for="'os'"
                    :values="selections.operatingSystems"
                    :radioGroup="'radio-group-1'"
                    :selectedValue="formdata.operatingSystemId.toString()"
                  />
                </b-col>
              </b-row>
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
              <b-row>
                <b-col md="12">
                  <RadioSelection
                    @val="formdata.serviceTypeId = $event"
                    :description="'Select service'"
                    :id="'os-type'"
                    :label="'Service'"
                    :label-for="'os'"
                    :values="selections.serviceDatabase"
                    :radioGroup="'radio-group-2'"
                    :selectedValue="formdata.serviceTypeId.toString()"
                    v-show="serviceSelected === 'D'"
                  />
                  <RadioSelection
                    @val="formdata.serviceTypeId = $event"
                    :description="'Select service'"
                    :id="'os-type'"
                    :label="'Service'"
                    :label-for="'os'"
                    :values="selections.serviceTerminal"
                    :radioGroup="'radio-group-2'"
                    :selectedValue="formdata.serviceTypeId.toString()"
                    v-show="serviceSelected === 'T'"
                  />
                </b-col>
              </b-row>
            </b-col>
          </b-row>

          <br />

          <b-row>
            <b-col class="d-flex justify-content-end">
              <b-button @click="editSnippet" variant="success" class="mr-1"
                >Edit Snippet</b-button
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
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  data() {
    return {
      errorStatus: false,
      errorResponse: "",
      formdata: {
        userid: "",
        title: "",
        description: "",
        info: "",
        operatingsystem: "",
        servicemeta: "T",
        operatingSystemId: 0,
        serviceTypeId: 0,
        snippet_id: "",
      },
      snippetInfo: {
        snippetEntity: {
          description: "",
          title: "",
          deletedAt: "",
          snippetId: "",
          userId: "",
          info: "",
          operatingSystemId: 0,
          serviceTypeId: 0,
          servicemeta: "",
        },
        username: "",
      },
      selections: radioSelectionsData,
      serviceSelected: "",
    };
  },
  methods: {
    editSnippet() {
      this.formdata.userid = this.user.userId;
      if (this.formdata.description != "")
        this.snippetInfo.snippetEntity.description = this.formdata.description;
      if (this.formdata.title != "")
        this.snippetInfo.snippetEntity.title = this.formdata.title;
      if (this.formdata.info != "")
        this.snippetInfo.snippetEntity.info = this.formdata.info;
      this.snippetInfo.snippetEntity.operatingSystemId = parseInt(
        this.formdata.operatingSystemId
      );
      this.snippetInfo.snippetEntity.serviceTypeId = parseInt(
        this.formdata.serviceTypeId
      );
      this.snippetInfo.snippetEntity.snippetId = this.$route.params.id;
      this.$http
        .put("/api/v1/snippet/edit", this.snippetInfo)
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
  created() {
    let id = this.$attrs.id;
    this.$http
      .get("/api/v1/snippet/info/" + id)
      .then((response) => {
        this.snippetInfo = response.data;
        this.formdata.operatingSystemId =
          this.snippetInfo.snippetEntity.operatingSystemId;
        this.formdata.serviceTypeId =
          this.snippetInfo.snippetEntity.serviceTypeId;
        if (
          this.snippetInfo.snippetEntity.serviceTypeId >= 0 &&
          this.snippetInfo.snippetEntity.serviceTypeId < 4
        ) {
          this.serviceSelected = "D";
        } else {
          this.serviceSelected = "T";
        }
      })
      .catch((error) => {
        console.log(error);
      });
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