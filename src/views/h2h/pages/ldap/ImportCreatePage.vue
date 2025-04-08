.<template>
  <div class="animated fadeIn">
    <p-card>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="3">
              <b-row>
                <b-col md="12">
                  <h3>Create Import</h3>
                  <p>
                    You can automatically run your active directories according
                    to the repetition interval you choose.<br /><br />
                    Let's start by choosing the service type first, then choose
                    our service. Let's hit the next button. Let's select the
                    object first from the active directory page that opens, then
                    enter the active directory information and search. Let's
                    continue by choosing one of the results. After entering our
                    description, let's select the runtime of the active
                    directory and save it.
                  </p>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="9">
              <b-col md="12">
                <b-row>
                  <b-col md="12">
                    <b-nav class="mb-2" justified pills>
                      <b-nav-item :active="active == 1" class="font-weight-bold"
                        >Type Select</b-nav-item
                      >
                      <b-nav-item :active="active == 2" class="font-weight-bold"
                        >Select Import</b-nav-item
                      >
                      <b-nav-item :active="active == 3" class="font-weight-bold"
                        >Save</b-nav-item
                      >
                    </b-nav>
                  </b-col>
                </b-row>
              </b-col>
              <hr />
              <div v-if="active == 1">
                <b-form>
                  <b-row md="12">
                    <b-col md="10">
                      <b-row>
                        <b-col md="8">
                          <b-form-group label="Create Type">
                            <b-form-radio-group
                              :options="createTypes"
                              button-variant="outline-primary"
                              buttons
                              class="mb-1"
                              id="create_type_name"
                              name="create-type"
                              size="md"
                              v-model="createSelected"
                            />
                          </b-form-group>
                        </b-col>
                        <b-col
                          v-show="createSelected == 'AD'"
                          md="4"
                          class="mt-3"
                        >
                          <div class="form-group">
                            <p-select
                              :multiple="false"
                              :options="services"
                              label="name"
                              placeholder="Select Service"
                              track-by="inventory_id"
                              v-model="selectedServiceObjects"
                            ></p-select>
                          </div>
                        </b-col>
                        <b-col
                          v-show="createSelected == 'IR'"
                          md="4"
                          class="mt-5"
                        >
                          <vue-ip
                            :on-change="ipChange"
                            :placeholder="true"
                            :ip="ip"
                            :port="port"
                            :theme="theme"
                            ><p style="color: black">IP Address</p></vue-ip
                          >
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                </b-form>
                <b-row>
                  <b-col class="ml-auto" cols="2">
                    <b-button
                      :disabled="createSelected == ''"
                      @click.stop="next"
                      class="mt-3"
                      variant="primary"
                      >Next</b-button
                    >
                  </b-col>
                </b-row>
              </div>
              <div class="mt-3" v-if="active == 2">
                <b-row
                  v-if="createSelected === 'AD' || createSelected === 'IR'"
                >
                  <b-col md="12">
                    <div class="wrapper">
                      <div class="animated fadeIn">
                        <p-card>
                          <ldap-search-component @nextButton="newNext" />
                        </p-card>
                        <b-button class="mt-3" variant="danger" @click="back">
                          Back
                        </b-button>
                      </div>
                    </div>
                  </b-col>
                </b-row>
              </div>
              <div v-if="active == 3">
                <b-form>
                  <b-row md="12">
                    <b-col md="6">
                      <b-row>
                        <b-col md="12">
                          <b-form-fieldset
                            description="Add your description for import"
                            horizontal
                            id="importDescription"
                            label="Description"
                            label-for="description"
                            label-text-align="left"
                          >
                            <b-form-input
                              id="importdescription"
                              placeholder
                              type="text"
                              v-model="formdata.description"
                            ></b-form-input>
                          </b-form-fieldset>
                        </b-col>
                        <div class="ml-3">
                          Renewal Time
                          <VueCronEditorBuefy
                            :visibleTabs="visibleTabs"
                            v-model="cronExpression"
                          />
                        </div>
                      </b-row>
                    </b-col>
                  </b-row>
                </b-form>
                <b-row>
                  <b-col>
                    <b-button variant="danger" @click="back" class="mt-3">
                      Back
                    </b-button>
                  </b-col>
                  <b-col class="ml-auto" cols="2">
                    <b-button
                      :disabled="
                        formdata.description == '' || selectedDate == null
                      "
                      @click.stop="createImport"
                      class="mt-3"
                      variant="success"
                      >Create</b-button
                    >
                  </b-col>
                </b-row>
              </div>
            </b-col>
          </b-row>
        </li>
      </ul>
    </p-card>
  </div>
</template>


<script>
import VueIp from "vue-ip";
import LdapSearchComponent from "../../components/LdapSearchComponent";
import VueCronEditorBuefy from "vue-cron-editor-buefy";
export default {
  components: {
    LdapSearchComponent,
    VueCronEditorBuefy,
    VueIp,
  },
  data() {
    return {
      ip: "",
      port: true,
      valid: null,
      theme: "material",
      cronExpression: "*/1 * * * *",
      visibleTabs: ["hourly", "daily", "weekly", "monthly"],
      services: [],
      selectedServiceObjects: [],
      active: 1,
      buttonText: "Next",
      formdata: {
        description: "",
        usageTime: "",
      },
      createTypes: [
        {
          text: "AD Credentials",
          value: "AD",
        },
        {
          text: "IP Range",
          value: "IR",
        },
      ],
      createSelected: "",
      selectedDate: null,
    };
  },
  methods: {
    ipChange(ip, port, valid) {
      this.ip = ip;
      this.port = port;
      this.valid = valid;
    },
    next() {
      this.active++;
    },
    newNext(items) {
      let selectedEntries = [];
      items.forEach((item) => {
        if (item.selected) {
          selectedEntries.push(item);
        }
      });
      this.next();
    },
    back() {
      this.active--;
    },
    createImport() {
      this.$router.push({
        name: "Imports",
      });
    },
  },
  created() {
    this.$http
      .get("/api/v1/service/all")
      .then((response) => {
        response.data.forEach((f) => {
          if (f.service_type_id == 10) {
            this.services.push(f);
          }
        });
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
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