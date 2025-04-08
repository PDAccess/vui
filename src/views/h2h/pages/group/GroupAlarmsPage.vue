<template>
  <div class="animated fadeIn">
    <div>
      <b-alert
        v-model="alertCheck"
        :variant="alertVariant"
        dismissible
        v-html="alertMessage"
      >
      </b-alert>
    </div>
    <p-card>
      <b-row class="mb-2">
        <b-col class="d-flex justify-content-end policy-create-field">
          <b-button :to="'/groups/createalarm/' + id" variant="success">
            <i class="fa fa-plus-circle mr-2" aria-hidden="true"></i>Create
            Group Alarm
          </b-button>
        </b-col>
      </b-row>
      <p-modal @confirm="deleteAlarm()" :message="modalMessage"></p-modal>

      <p-error
        v-if="errorStatusList"
        header="List operation has error!"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <p-error
        v-else-if="errorStatusDelete"
        header="Delete operation has error!"
        :errorResponse="errorResponse"
        @reload="deleteAlarm"
      />
      <p-error
        v-else-if="errorStatusChange"
        header="Change alarm operation has error!"
        :errorResponse="errorResponse"
        @reload="changeStatus"
      />
      <p-loading class="my-5" v-else-if="loading" message="Loading..." />
      <b-col v-else-if="alarms.length === 0">
        <p-initial
          icon="plus-circle"
          header="You don't have any group alarms."
          message="Please create a group alarm."
        />
      </b-col>
      <b-table
        v-else
        :fields="tableFields"
        :items="alarms"
        hover
        show-empty
        small
        responsive
      >
        <template v-slot:cell(status)="row">
          <b-button
            :variant="row.item.active ? 'danger' : 'outline-danger'"
            @click="changeStatus(row.item)"
            :title="row.item.active ? 'Turn off Alarm' : 'Turn on Alarm'"
            v-b-tooltip.bottom
            class="mt-1 m-2"
          >
            <em class="fa fa-bell"></em>
          </b-button>
        </template>
        <template v-slot:cell(created_at)="row">
          <span style="color: #20a8d8">
            <strong>{{ row.item.createdAt | moment("calendar") }}</strong>
          </span>
        </template>
        <template v-slot:cell(settings)="row">
          <b-dropdown
            id="dropdown-1"
            text="Action"
            variant="primary"
            class="user-actions"
          >
            <template slot="button-content">
              <i class="mr-1 fa fa-cogs" aria-hidden="true"></i>
            </template>
            <b-dropdown-item @click.stop="editAlarm(row.item)" variant="primary"
              ><em class="mr-1 fa fa-pencil"></em>Edit
            </b-dropdown-item>
            <b-dropdown-item
              @click.stop="deleteButton(row.item)"
              variant="danger"
              v-b-modal.modal
              ><em class="mr-1 fa fa-trash"></em>Delete
            </b-dropdown-item>
          </b-dropdown>
        </template>
      </b-table>
    </p-card>
  </div>
</template>

<script>
export default {
  props: ["id"],
  components: {},
  data() {
    return {
      alertCheck: false,
      alertVariant: "success",
      alertMessage: "",
      errorStatusDelete: false,
      errorResponse: "",
      errorStatusChange: false,
      errorStatusList: false,
      alarms: [],
      loading: true,
      tableFields: [
        { key: "status", label: "Status" },
        { key: "name", label: "Alarm Name" },
        { key: "description", label: "Description" },
        { key: "created_at", label: "Created At" },
        { key: "settings", label: "Edit/Delete" },
      ],
      modalMessage: "",
      item_id: "",
      item: {},
    };
  },
  methods: {
    editAlarm(item) {
      this.$router.push({
        name: "Edit Group Alarm",
        params: {
          id: this.id,
          alarmid: item.alarmId,
        },
      });
    },
    deleteButton(item) {
      this.alarmId = item.alarmId;
      this.item_id = item.id;
      this.modalMessage =
        "Are you sure you want to delete the selected " +
        item.name +
        " group alarm?";
    },
    deleteAlarm() {
      this.$http
        .delete("/api/v1/alarm/" + this.alarmId)
        .then(() => {
          for (let i = 0; i < this.alarms.length; i++) {
            if (this.alarms[i].id == this.item_id) {
              this.alarms.splice(i, 1);
              break;
            }
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorStatusDelete = true;
          this.errorResponse = error;
        });
    },
    changeStatus(item) {
      item.active = !item.active;
      this.$http
        .post(
          "/api/v1/alarm/" +
            (item.active ? "activate" : "deactivate") +
            "/" +
            item.alarmId
        )
        .then(() => {
          this.alertCheck = true;
          if (item.active) {
            this.alertVariant = "success";
            this.alertMessage = `Alarm On: <em>${item.name}</em>`;
          } else {
            this.alertVariant = "danger";
            this.alertMessage = `Alarm Off: <em>${item.name}</em>`;
          }
        })
        .catch((error) => {
          item.active = !item.active;
          console.log(error);
          this.errorStatusChange = true;
          this.errorResponse = error;
        });
    },
  },
  created() {
    this.$http
      .get("api/v1/alarm/groups/" + this.id)
      .then((response) => {
        this.alarms = response.data;
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatusList = true;
        this.errorResponse = error;
      });
  },
};
</script>

<style scoped>
.inventory-logo {
  width: 50px;
  height: 40px;
}

.navbar {
  padding: 0.5rem 0rem;
}

.buttonMR {
  margin-right: 5px;
}
</style>

<style>
.policy-create-field .dropdown-menu.show {
  width: 100% !important;
}
</style>
