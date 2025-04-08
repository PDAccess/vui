<template>
  <div class="animated fadeIn">
    <p-card :cardBody="false">
      <p-modal
        id="deletePrivModal"
        ref="deletePrivModal"
        @confirm="deleteTacacsPrivilege()"
        message="Are you sure you want to delete the system default privileged for TACACS"
      ></p-modal>
      <h5>Tacacs Default Privilege</h5>
      <hr />
      <b-form-fieldset
        label="Privileged Level"
        description="Tacacs default privileged level for system"
        :label-cols="3"
        :horizontal="true"
      >
        <b-form-input
          type="text"
          v-model="tacacsPrivilegedLevel"
        ></b-form-input>
      </b-form-fieldset>
      <b-form-fieldset
        label="Secret"
        description="Tacacs secret"
        :label-cols="3"
        :horizontal="true"
      >
        <b-input-group>
          <b-form-input
            type="text"
            v-model="tacacsSecret"
            :readonly="true"
          ></b-form-input>
          <b-input-group-append>
            <p-copy :copyItem="tacacsSecret" />
          </b-input-group-append>
        </b-input-group>
      </b-form-fieldset>
      <b-form-fieldset
        label="Connection Rate"
        description="Tacacs connection rate"
        :label-cols="3"
        :horizontal="true"
      >
        <b-form-input
          type="text"
          v-model="tacacsConnectionRate"
          :readonly="true"
        ></b-form-input>
      </b-form-fieldset>
      <b-form-fieldset
        label="Maximum Connection"
        description="Tacacs maximum connection"
        :label-cols="3"
        :horizontal="true"
      >
        <b-form-input
          type="text"
          v-model="tacacsMaximumConnection"
          :readonly="true"
        ></b-form-input>
      </b-form-fieldset>
      <b-row>
        <b-col class="d-flex justify-content-end">
          <b-button
            @click="updateTacacsPrivilege"
            variant="success"
            class="mr-2"
          >
            Update
          </b-button>
          <b-button
            v-b-modal.deletePrivModal
            :disabled="!tacacsPrivilegeId"
            variant="danger"
          >
            Delete
          </b-button>
        </b-col>
      </b-row>
    </p-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tacacsPrivilegedLevel: "",
      tacacsSecret: "",
      tacacsConnectionRate: "",
      tacacsMaximumConnection: "",
      tacacsPrivilegeId: null,
      settings: {
        listen_port: "",
        secret: "",
      },
    };
  },
  methods: {
    deleteTacacsPrivilege() {
      this.$http
        .delete("/api/v1/tacacs/privilege/" + this.tacacsPrivilegeId)
        .then((response) => {
          this.tacacsPrivilegedLevel = "";
          this.tacacsPrivilegeId = null;
          this.$bvToast.toast(
            `The Tacacs System default privileged policy has been deleted`,
            {
              title: "System Notification",
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
    updateTacacsPrivilege() {
      let defaultPrivParams = {
        privilegeId: this.tacacsPrivilegeId,
        userId: ["*"],
        privilegedLevel: this.tacacsPrivilegedLevel,
      };
      this.$http
        .post("/api/v1/tacacs/privilege/group/*", defaultPrivParams)
        .then((response) => {
          this.tacacsPrivilegeId = response.data.privilege.privilegeId;
          this.$bvToast.toast(`Tacacs System Default Privileged Updated!`, {
            title: "System Notification",
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
    this.$http
      .get("/api/v1/tacacs/privilege/group/*")
      .then((response) => {
        let systemPrivPolicy = response.data.default;
        if (systemPrivPolicy) {
          this.tacacsPrivilegedLevel = systemPrivPolicy.privilegedLevel;
          this.tacacsPrivilegeId = systemPrivPolicy.privilegeId;
        }
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
      });

    this.$http
      .get("/api/v1/tacacs/settings")
      .then((response) => {
        this.tacacsSecret = response.data.secret;
        this.tacacsConnectionRate = response.data.connectionRate;
        this.tacacsMaximumConnection = response.data.maxConnection;
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
