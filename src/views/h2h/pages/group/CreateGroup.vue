<template>
  <div class="animated fadeIn">
    <p-card :cardBody="false">
      <b-row class="my-1">
        <b-col sm="4">
          <h3>Create Group</h3>
          <p>Create groups to manage and group your services.</p>
        </b-col>
        <b-col sm="8">
          <b-tabs card pills>
            <b-tab title="Normal" active>
              <p-loading
                class="my-5"
                gif-height="75"
                message="Loading..."
                v-if="loading"
              />
              <template v-else>
                <b-row>
                  <b-col>
                    <b-form-group
                      description="Entry name for Group"
                      horizontal
                      id="serviceNameGroup2"
                      label="Group Name"
                      label-for="groupname"
                      label-text-align="left"
                    >
                      <b-form-input
                        id="groupname"
                        placeholder=""
                        type="text"
                        v-model="$v.formdata.groupname.$model"
                        :state="
                          !$v.formdata.groupname.$dirty
                            ? null
                            : !$v.formdata.groupname.$invalid
                        "
                      ></b-form-input>
                      <b-form-invalid-feedback>
                        <div v-if="!$v.formdata.groupname.required">
                          Group name is required.
                        </div>
                        <div v-if="!$v.formdata.groupname.minLength">
                          Group name must have at least
                          {{
                            $v.formdata.groupname.$params.minLength.min -
                            formdata.groupname.length
                          }}
                          more letters.
                        </div>
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-form-group
                      description="Add description for Group"
                      horizontal
                      id="serviceNameGroup2"
                      label="Description"
                      label-for="description"
                      label-text-align="left"
                    >
                      <b-form-input
                        id="groupdesc"
                        placeholder=""
                        type="text"
                        v-model="formdata.description"
                      ></b-form-input>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-form-group
                      description="The parent group from which memberships will be inherited"
                      horizontal
                      id="serviceNameGroup2"
                      label="Parent Group"
                      label-for="parentgroup"
                      label-text-align="left"
                    >
                      <p-select
                        placeholder="Select Group"
                        :options="groups"
                        v-model="selectedGroup"
                        track-by="groupId"
                        label="groupname"
                      />
                      <b-form-invalid-feedback>
                        <div v-if="!$v.formdata.groupname.required">
                          Group name is required.
                        </div>
                        <div v-if="!$v.formdata.groupname.minLength">
                          Group name must have at least
                          {{
                            $v.formdata.groupname.$params.minLength.min -
                            formdata.groupname.length
                          }}
                          more letters.
                        </div>
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col class="d-flex justify-content-end">
                    <b-button
                      :disabled="$v.formdata.$invalid"
                      @click="creategroup"
                      variant="success"
                      >Create</b-button
                    >
                  </b-col>
                </b-row>
              </template>
            </b-tab>
            <b-tab  title="LDAP">
              <p-loading
                class="my-5"
                gif-height="75"
                message="Loading..."
                v-if="loadingLdapGroups"
              />
              <div v-else-if="isLdapError">
                <p-error
                  header="Please check your LDAP credentials and connections"
                  :errorResponse="ldapErrorResponse"
                  @reload="refresh"
                />
              </div>
              <template v-else>
                <b-row>
                  <b-col>
                    <b-form-group
                      description="Add LDAP OU for Group"
                      horizontal
                      id="serviceNameGroup2"
                      label="LDAP OU"
                      label-for="description"
                      label-text-align="left"
                    >
                      <p-select
                        :options="ldapGroups"
                        placeholder="Select LDAP OU"
                        v-model="selectedLdapGroup"
                        label="name"
                      ></p-select>
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-form-group
                    description="The parent group from which memberships will be inherited"
                    horizontal
                    id="serviceNameGroup2"
                    label="Parent Group"
                    label-for="parentLdapgroup"
                    label-text-align="left"
                  >
                    <p-select
                      placeholder="Select Group"
                      :options="groups"
                      v-model="selectedLdapParentGroup"
                      track-by="groupId"
                      label="parentLdapgroup"
                    />
                  </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col class="d-flex justify-content-end">
                    <b-button
                      :disabled="!selectedLdapGroup || creatingLdapGroup"
                      @click="saveLdapGroup"
                      variant="success"
                    >
                      <span v-if="!creatingLdapGroup">Create</span>
                      <b-spinner v-else small></b-spinner>
                    </b-button>
                  </b-col>
                </b-row>
              </template>
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
    </p-card>
  </div>
</template>
<script>
import { minLength, required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      loading: true,
      selectedGroup: null,
      selectedLdapParentGroup: null,
      groups: [],
      loadingLdapGroups: true,
      creatingLdapGroup: false,
      groupType: "normal",
      ldapGroups: [],
      selectedLdapGroup: "",
      formdata: {
        groupname: "",
        description: "",
        grouptype: "",
        groupCategory: "",
      },
      errorStatus: false,
      isLdapError: false,
      errorResponse: "",
      ldapErrorResponse: "",
    };
  },
  mixins: [validationMixin],
  validations: {
    formdata: {
      groupname: {
        required,
        minLength: minLength(3),
      },
    },
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  methods: {
    refresh() {
      this.$router.go();
    },
    saveLdapGroup() {
      this.creatingLdapGroup = true;

      if (this.selectedLdapParentGroup) {
        this.selectedLdapGroup.parentGroup = this.selectedLdapParentGroup.groupId;
      }
      
      this.$http
        .post("/api/v1/ldap/group", this.selectedLdapGroup)
        .then((response) => {
          this.$bvToast.toast(`Group is Created!`, {
            title: "Group Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.$router.push(
            this.$route.query.redirect || "/groups/nav/all"
          );
        })
        .catch((error) => {
          console.log(error);
          this.$bvToast.toast(
            `Group creation failed\nPlease check your ldap connection or data compatibility`,
            {
              title: "Group Notification",
              variant: "danger",
              autoHideDelay: 5000,
            }
          );
          this.creatingLdapGroup = false;
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    clearLdapGroup() {
      this.selectedLdapGroup = "";
    },
    creategroup() {
      this.formdata.groupCategory = "NORMAL";
      this.formdata.grouptype = "public";

      if (this.selectedGroup) {
        this.formdata.parent = this.selectedGroup.groupId;
      }

      this.$http
        .post("/api/v1/group/create", this.formdata)
        .then((response) => {
          this.$bvToast.toast(`Group is Created!`, {
            title: "Group Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.$router.push(this.$route.query.redirect || "/groups/nav/all");
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          if (error.status == 409) {
            this.$bvToast.toast(
              `The group with the specified name already exists. Please add a group with another name.`,
              {
                title: "Group create failed",
                variant: "danger",
                autoHideDelay: 5000,
              }
            );
          }
        });

    },
  },
  created() {
    this.$http
      .get("/api/v1/ldap/group")
      .then((response) => {
        this.ldapGroups = response.data;
        this.loadingLdapGroups = false;
      })
      .catch((error) => {
        if (error.status === 400) {
          this.isLdapError = true;
          this.ldapErrorResponse = error;
        } else {
          this.errorStatus = true;
          this.errorResponse = error;
        }
        this.loadingLdapGroups = false;
      });

      this.$http
        .get("/api/v1/group/parent")
        .then((response) => {
          this.loading = false;
          this.groups = response.data;
        })
        .catch((error) => {
          this.errorStatus = true;
        });
  },
};
</script>
