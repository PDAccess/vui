<template>
  <div class="animated fadeIn">
    <p-card>
      <p-modal @confirm="deleteAlarm()" :message="modalMessage"></p-modal>
      <p-loading v-if="loading" class="my-5" message="Loading..." />
      <p-error
        v-else-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <div v-else-if="alarms.length === 0">
        <p-initial
          icon="plus-circle"
          header="You don't have any service alarm."
          message="Please create a service alarm."
        />
      </div>
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
            :title="row.item.active ? 'Turn off Alarm' : 'Turn on Alarm'"
            v-b-tooltip.bottom
            class="mt-1 m-2"
          >
            <em class="fa fa-bell"></em>
          </b-button>
        </template>
        <template v-slot:cell(description)="row">
          <em v-if="!row.item.description">Not Assigned!</em>
          <span v-else>{{ row.item.description }}</span>
        </template>
        <template v-slot:cell(created_at)="row">
          <span style="color: #20a8d8">
            <strong>{{ row.item.createdAt | moment("lll") }}</strong>
          </span>
        </template>
      </b-table>
    </p-card>
  </div>
</template>

<script>
import DatePickerComp from "../../components/DatePickerComp.vue";
export default {
  props: ["id"],
  components: { DatePickerComp },
  data() {
    return {
      alertCheck: false,
      alertVariant: "success",
      alertMessage: "",
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      alarms: [],
      loading: true,
      tableFields: [
        { key: "status", label: "Status" },
        { key: "name", label: "Alarm Name" },
        { key: "description", label: "Description" },
        { key: "created_at", label: "Created At" },
      ],
      modalMessage: "",
      item_id: "",
      item: {},
    };
  },
  methods: {
    editAlarm(item) {
      this.$router.push({
        name: "Edit Service Alarm",
        params: {
          id: this.id,
          alarmid: item.id,
        },
      });
    },
    deleteButton(item, event) {
      this.item_id = item.id;
      this.modalMessage =
        "Are you sure you want to delete the selected " +
        item.name +
        " service alarm?";
    },
    deleteAlarm() {
      this.$http
        .delete("/api/v1/alarm/" + this.item_id)
        .then((response) => {
          this.alertCheck = true;
          this.alertVariant = "success";
          this.alertMessage = "Deleted Alarm";

          for (let i = 0; i < this.alarms.length; i++) {
            if (this.alarms[i].id == this.item_id) {
              this.alarms.splice(i, 1);
              break;
            }
          }
        })
        .catch((error) => {
          this.alertCheck = true;
          this.alertVariant = "danger";
          this.alertMessage = "Something went wrong";
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Delete operation has error!";
        });
    },
    changeStatus(item) {
      item.active = !item.active;
      this.$http
        .post(
          "/api/v1/alarm/" +
            (item.active ? "activate" : "deactivate") +
            "/" +
            item.id
        )
        .then((response) => {
          this.alertCheck = true;
          console.log(this.alertCheck);
          this.alertVariant = "success";
          this.alertMessage = "Changed Alarm Status";
        })
        .catch((error) => {
          this.$bvToast.toast(`Something went wrong!`, {
            title: "Service Alarm Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
          item.active = !item.active;
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Change operation has error!";
        });
    },
  },
  created() {
    this.$http
      .get("api/v1/alarm/services/" + this.id)
      .then((response) => {
        this.alarms = response.data;
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
  },
};
</script>