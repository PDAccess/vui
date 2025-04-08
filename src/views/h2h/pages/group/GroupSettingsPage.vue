<template>
  <p-card class="p-4" role="tablist">
    <p-modal @confirm="deleteGroup()" :message="modalMessage"></p-modal>
    <p-modal
                id="deletePrivPolicyModal"
                ref="deletePrivPolicyModal"
                @confirm="deleteTacacsDefaultPriv()"
                :message="`Are you sure you want to delete the default privileged for ${info.groupname} group?`"
              ></p-modal>
    <p-error
      v-if="errorStatusDelete"
      header="Delete operation has error!"
      :errorResponse="errorResponse"
      @reload="deleteGroup"
    />
    <p-error
      v-else-if="errorStatusUpdate"
      header="Update operation has error!"
      :errorResponse="errorResponse"
      @reload="updateGroup"
    />
    <p-loading v-else-if="loading" class="my-5" message="Loading..." />
    <template v-else>
      <template v-if="info.groupCategory != 'ldap'">
        <div class="mb-1">
          <b-row>
            <b-col lg="10">
              <h5>Group Edit</h5>
            </b-col>
            <b-col lg="2">
              <b-button
                @click="changeTabStatus(!editTabStatus, false)"
                v-b-toggle.editGroupArea
                :variant="editTabStatus ? 'danger' : 'primary'"
                style="width: 100%"
                >{{ editTabStatus ? "Collapse" : "Expand" }}</b-button
              >
            </b-col>
          </b-row>
          <b-collapse
            id="editGroupArea"
            accordion="settings-accordion"
            role="tabpanel"
          >
            <b-card class="mt-3">
              <div class="animated fadeIn">
                <b-row>
                  <b-col sm="4">
                    <p>
                      You can make updates about your group by changing the name
                      and description of the specified group
                    </p>
                  </b-col>
                  <b-col sm="8">
                    <b-form-group
                      description="Edit Group name for Group"
                      horizontal
                    >
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
                            $v.formdata.group_description.$params.minLength
                              .min - formdata.group_name.length
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
                      description="Edit Parent Group for Group"
                      horizontal
                    >
                      <label for="inputLive">Parent Group</label>
                      <p-select
                      placeholder="Select Group"
                      :options="groups"
                      v-model="selectedGroup"
                      track-by="groupId"
                      label="groupname"
                    />
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
                    <b-button @click="clearForm" variant="primary"
                      >Clear</b-button
                    >
                  </b-col>
                </b-row>
              </div>
            </b-card>
          </b-collapse>
        </div>
        <hr />
        <div class="mb-1" v-if="userRole === 'Admin'">
          <b-row>
            <b-col lg="10">
              <h5>Group Delete</h5>
            </b-col>
            <b-col lg="2">
              <b-button
                @click="changeTabStatus(false, !deleteTabStatus)"
                v-b-toggle.deleteGroupArea
                :variant="deleteTabStatus ? 'danger' : 'primary'"
                style="width: 100%"
                >{{ deleteTabStatus ? "Collapse" : "Expand" }}</b-button
              >
            </b-col>
          </b-row>
          <b-collapse
            id="deleteGroupArea"
            accordion="settings-accordion"
            role="tabpanel"
          >
            <b-card class="mt-3">
              <div class="animated fadeIn">
                <b-list-group flush>
                  <b-list-group-item>
                    <b-row class="my-1">
                      <b-col sm="4">
                        <p>Are you sure delete this group?</p>
                        <p>Group name: {{ info.groupname }}</p>
                      </b-col>
                      <b-col sm="8">
                        <p>
                          To delete this group, you must do write the first 3
                          characters of the Group Name!
                        </p>
                        <b-form-input
                          class="mb-2"
                          type="text"
                          v-model="deleteconfirmtext"
                        ></b-form-input>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col class="sm=4"></b-col>
                      <b-col sm="8" class="d-flex justify-content-end">
                        <b-button
                          :disabled="deleteControl"
                          @click.stop="deleteGroupConfirm()"
                          v-b-modal.modal
                          class="btn btn-danger mt-2"
                          >Delete</b-button
                        >
                      </b-col>
                    </b-row>
                  </b-list-group-item>
                </b-list-group>
              </div>
            </b-card>
          </b-collapse>
        </div>
        <hr />
      </template>
      <div class="mb-1">
        <b-row>
          <b-col lg="10">
            <h5>Group Services Maximum Session Time and Idle Timeout</h5>
          </b-col>
          <b-col lg="2">
            <b-button
              @click="changeTabStatus(false, false, !timeoutTabStatus)"
              v-b-toggle.timeoutTabArea
              :variant="timeoutTabStatus ? 'danger' : 'primary'"
              style="width: 100%"
              >{{ timeoutTabStatus ? "Collapse" : "Expand" }}</b-button
            >
          </b-col>
        </b-row>
        <b-collapse
          id="timeoutTabArea"
          accordion="settings-accordion"
          role="tabpanel"
        >
          <b-card class="mt-3">
            <div class="animated fadeIn">
              <b-row class="my-1">
                <b-col sm="4">
                  <p>
                    You can update service session maximum time and idle
                    timeout.
                  </p>
                </b-col>
                <b-col sm="8">
                  <div class="padd">
                    <b-form-fieldset
                      description="Default maximum session time value 30 minute"
                      :label="getMaxSessionLabel(maxSessionMinute)"
                    >
                      <b-form-input
                        placeholder="pdaccess.com"
                        type="range"
                        :min="minSessionTimeLimit"
                        :max="maxSessionTimeLimit"
                        v-model="maxSessionMinute"
                      ></b-form-input>
                    </b-form-fieldset>
                    <b-form-fieldset
                      description="Default timeout value 5 minute"
                      :label="getTimeOutLabel(idleTimoutMinute)"
                    >
                      <b-form-input
                        placeholder="pdaccess.com"
                        type="range"
                        :min="minSessionIdleTimeOutLimit"
                        :max="maxSessionIdleTimeOutLimit"
                        v-model="idleTimoutMinute"
                      ></b-form-input>
                    </b-form-fieldset>

                    <div class="d-flex justify-content-end mt-2">
                      <b-button
                        :disabled="info.locked"
                        @click="updateServiceTimeout"
                        class="mt-2"
                        variant="success"
                        >Update</b-button
                      >
                    </div>
                  </div>
                </b-col>
              </b-row>
            </div>
          </b-card>
        </b-collapse>
        <hr />
      </div>
      <div class="mb-1">
        <b-row>
          <b-col lg="10">
            <h5>Group Tacacs Default Privileged Policy</h5>
          </b-col>
          <b-col lg="2">
            <b-button
              @click="changeTabStatus(false, false, false, !tacacsDefaultPrivTabStatus)"
              v-b-toggle.tacacsDefaultPrivTabArea
              :variant="tacacsDefaultPrivTabStatus ? 'danger' : 'primary'"
              style="width: 100%"
              >{{ tacacsDefaultPrivTabStatus ? "Collapse" : "Expand" }}</b-button
            >
          </b-col>
        </b-row>
        <b-collapse
          id="tacacsDefaultPrivTabArea"
          accordion="settings-accordion"
          role="tabpanel"
        >
          <b-card class="mt-3">
            <div class="animated fadeIn">
              <b-row class="my-1">
                <b-col sm="4">
                  <p>
                    You can set the default tacacs privileged level for this group.
                  </p>
                </b-col>
                <b-col sm="8">
                  <div class="padd">
                    <b-form-fieldset
                      description="Default tacacs privileged level in this group"
                      label="Privileged Level"
                    >
                      <b-form-input
                        v-model="tacacsDefaultPriv"
                      ></b-form-input>
                    </b-form-fieldset>
                    <div class="d-flex justify-content-end mt-2">
                      <b-button
                        :disabled="info.locked || !tacacsDefaultPriv"
                        @click="updateTacacsDefaultPriv"
                        class="mt-2 mr-2"
                        variant="success"
                        >Update</b-button
                      >
                      <b-button class="mt-2" variant="danger" :disabled="!tacacsPrivilegeId" v-b-modal.deletePrivPolicyModal>
                      Delete</b-button>
                    </div>
                  </div>
                </b-col>
              </b-row>
            </div>
          </b-card>
        </b-collapse>
      </div>
    </template>
  </p-card>
</template>

<script>
import { minLength, required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { mapGetters } from "vuex";

export default {
  props: ["id"],
  components: {},
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),

    deleteControl() {
      return (
        this.deleteconfirmtext.substring(0, 3) !==
          this.info.groupname.substring(0, 3) ||
        this.deleteconfirmtext.substring(0, this.deleteconfirmtext.length) !==
          this.info.groupname.substring(0, this.deleteconfirmtext.length)
      );
    },
  },
  data() {
    return {
      tacacsPrivilegeId: null,
      tacacsDefaultPriv: "",
      selectedGroup: null,
      groups: [],
      deleteCheck: true,
      modalMessage: "",
      loading: true,
      errorStatusDelete: false,
      errorStatusUpdate: false,
      errorResponse: "",
      editTabStatus: false,
      deleteTabStatus: false,
      timeoutTabStatus: false,
      tacacsDefaultPrivTabStatus: false,
      oldGroupName: "",
      updateStatus: false,
      formdata: {
        group_name: "",
        group_description: "",
        group_parent: ""
      },
      userRole: "User",
      info: {
        groupname: "",
      },
      deleteconfirmtext: "",
      serviceTimeoutParams: {
        groupId: this.id,
        key: "",
        value: "",
      },
      maxSessionTimeLimit: 1440,
      minSessionTimeLimit: 0,
      maxSessionIdleTimeOutLimit: 1440,
      minSessionIdleTimeOutLimit: 0,
      maxSessionMinute: 15,
      idleTimoutMinute: 15,
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
    deleteTacacsDefaultPriv() {
      this.$http
        .delete("/api/v1/tacacs/privilege/" + this.tacacsPrivilegeId)
        .then((response) => {
          this.tacacsDefaultPriv = "";
          this.tacacsPrivilegeId = null;
          this.$bvToast.toast(
            `The Tacacs default privileged policy has been deleted`,
            {
              title: "Tacacy Policy Notification",
              variant: "success",
              autoHideDelay: 5000,
            }
          );
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    changeTabStatus(editTabStatus, deleteTabStatus, timeoutTabStatus, tacacsDefaultPrivTabStatus) {
      this.editTabStatus = editTabStatus;
      this.deleteTabStatus = deleteTabStatus;
      this.timeoutTabStatus = timeoutTabStatus;
      this.tacacsDefaultPrivTabStatus = tacacsDefaultPrivTabStatus;
    },
    deleteGroupConfirm() {
      this.modalMessage =
        "Are you sure you want to delete the group with the name " +
        this.info.groupname +
        " ?";
    },
    deleteGroup() {
      this.$http
        .delete("/api/v1/group/" + this.id)
        .then((response) => {
          this.$bvToast.toast(`Group successfully deleted`, {
            title: "Delete Success",
            variant: "info",
            autoHideDelay: 5000,
          });
          this.updateStatus = false;
          this.$router.push({ name: "Your Groups" });
        })
        .catch((error) => {
          console.log(error);
          this.$bvToast.toast(`Error while updating the group`, {
            title: "Update Failed",
            variant: "danger",
            autoHideDelay: 5000,
          });
        });
    },
    clearForm() {
      this.formdata.group_name = "";
      this.formdata.group_description = "";
    },
    updateGroup() {
      this.updateStatus = true;

      let formData = new FormData();
      formData.append("group_name", this.formdata.group_name);
      formData.append("group_description", this.formdata.group_description);

      if (this.selectedGroup) {
        formData.append("group_parent", this.selectedGroup.groupId);
      }

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
          this.errorStatusUpdate = true;
          this.errorResponse = error;
          this.$bvToast.toast(`Error while updating the group`, {
            title: "Update Failed",
            variant: "danger",
            autoHideDelay: 5000,
          });
          this.updateStatus = false;
        });
    },
    updateServiceTimeout() {
      this.serviceTimeoutParams.groupId = this.id;
      this.serviceTimeoutParams.key = "maximum-session";
      this.serviceTimeoutParams.value = this.maxSessionMinute;
      this.$http
        .post("/api/v1/group/property/save", this.serviceTimeoutParams)
        .then((response) => {
          this.$bvToast.toast(`Maximum Session Time Updated!`, {
            title: "Service Notification",
            variant: "info",
            autoHideDelay: 5000,
          });
          this.serviceTimeoutParams.key = "idle-timeout";
          this.serviceTimeoutParams.value = this.idleTimoutMinute;
          this.$http
            .post("/api/v1/group/property/save", this.serviceTimeoutParams)
            .then((res) => {
              this.$bvToast.toast(`Idle Timeout Updated!`, {
                title: "Service Notification",
                variant: "info",
                autoHideDelay: 5000,
              });
            })
            .catch((error) => {
              console.log(error);
              this.errorStatusUpdate = true;
              this.errorResponse = error;
            });
        })
        .catch((error) => {
          console.log(error);
          this.errorStatusUpdate = true;
          this.errorResponse = error;
        });
    },
    getMaxSessionLabel(term) {
      let lbl = "Maximum Session Time " + term + " minute";
      return term == 0 ? "Max Session Time Unlimited" : lbl;
    },
    getTimeOutLabel(term) {
      let lbl = "Idle Timeout " + term + " minute";
      return term == 0 ? "Idle timeout unlimited" : lbl;
    },
    updateTacacsDefaultPriv() {
      let defaultPrivParams = {
        privilegeId: this.tacacsPrivilegeId,
        userId: ["*"],
        privilegedLevel: this.tacacsDefaultPriv
      }
      this.$http
        .post("/api/v1/tacacs/privilege/group/" + this.id, defaultPrivParams)
        .then((response) => {
          this.tacacsPrivilegeId = response.data.privilege.privilegeId
          this.$bvToast.toast(`Tacacs Default Privileged Updated!`, {
            title: "Group Notification",
            variant: "info",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
          this.errorStatusUpdate = true;
          this.errorResponse = error;
        });
    },
  },
  created() {
    this.userRole = this.user.role;
    this.loading = false;

    this.$http
      .get("/api/v1/group/info/" + this.id)
      .then((response) => {
        this.oldGroupName = response.data.groupname;
        this.formdata.group_name = response.data.groupname;
        this.formdata.group_description = response.data.description;
        this.info = response.data;

        this.$http
        .get("/api/v1/group/parent")
        .then((responseGroups) => {
          this.groups = [];
          responseGroups.data.forEach(group => {
            if (this.info != null && this.info.groupId != group.groupId) {
              this.groups.push(group);
            }
          });;
          if (response.data.parent) {
            this.selectedGroup = this.groups.filter(
            (group) => response.data.parent == group.groupId
          )[0];;
          }
        })
        .catch((error) => {
          this.errorStatus = true;
        });
      })
      .catch((error) => {
        console.log(error);
      });

    this.$http
      .get(
        "/api/v1/group/property/get?groupid=" + this.id + "&key=idle-timeout"
      )
      .then((response) => {
        if (response.status == 200) {
          this.idleTimoutMinute = parseInt(response.data.value);
        }
      })
      .catch((error) => {
        this.idleTimoutMinute = 10;
        console.log(error);
      });
    this.$http
      .get(
        "/api/v1/group/property/get?groupid=" + this.id + "&key=maximum-session"
      )
      .then((response) => {
        if (response.status == 200) {
          this.maxSessionMinute = parseInt(response.data.value);
        }
      })
      .catch((error) => {
        this.maxSessionMinute = 10;
        console.log(error);
      });
      this.$http
      .get("/api/v1/tacacs/privilege/group/" + this.id)
      .then((response) => {
        let defaultPrivPolicy = response.data.default;
        if (defaultPrivPolicy) {
          this.tacacsDefaultPriv = defaultPrivPolicy.privilegedLevel;
          this.tacacsPrivilegeId = defaultPrivPolicy.privilegeId;
        }
        this.isLoading = false;
      })
      .catch((error) => {
        console.log(error);
        this.isLoading = false;
        this.errorStatus = true;
        this.errorResponse = error;
      });
  },
};
</script>