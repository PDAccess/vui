<template>
  <div class="animated fadeIn">
    <p-card>
      <div v-if="maintenanceList.length === 0" style="margin: auto">
        <p-initial
          icon="plus-circle"
          header="You don't have any confirmed maintenance."
          message="Please confirm a maintenance."
        />
      </div>
      <b-table
        v-else
        small
        :items="maintenanceList"
        :fields="tableField"
        show-empty
      >
        <template v-slot:cell(username)="row">
          {{ row.item.username }}
        </template>
        <template v-slot:cell(date)="row">
          <p-timing
            :start-date="row.item.startDate"
            :end-date="row.item.endDate || new Date()"
          />
        </template>

        <template v-slot:cell(status)="row">
          <b-badge :variant="statusBarFunction(row, row.index)">{{
            setStatusInfo(row, row.index)
          }}</b-badge>
        </template>
      </b-table>
    </p-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      hSpacing: "20px",
      serviceId: "",
      users: [],
      value: [],
      tempDateRangeData: null,
      tempDateRange: "",
      dateRange: "",
      tempOldDateRangeData: null,
      tempOldDateRange: "",
      dateOldRange: "",
      screen: "createMaintenance",
      editUsers: [],
      deleteButtonValue: "",
      maintenanceList: [],
      oldDateStart: "",
      oldDateEnd: "",
      infoUsers: "",
      uniqueUsernames: "",
      statusInfo: "",
      data: {
        message: "",
        startDate: this.$moment().format("calendar"),
        endDate: this.$moment().format("calendar"),
        backgroundColor: "#D1ECF1",
        fontColor: "#336573",
        startAtVal: 0,
        endAtVal: 0,
        messageId: "f",
        messageIndex: 0,
      },
      deleteUserId: "",
      deleteUserStartDate: "",
      deleteUserEndDate: "",
      modalMessage: "",
      modalMessageMaintenance: "",
      items: [],
      willDeleteItem: "",
      startEndObjectList: [],
      tableField: [
        { key: "username", label: "Username" },
        { key: "status", label: "Status" },
        { key: "date", label: "" },
      ],
      fields: [
        {
          key: "username",
          label: "Username",
        },
        {
          key: "delete_button",
          label: "Delete Button",
        },
      ],
      small_fields: [
        {
          key: "status_bar",
          label: "Status",
        },
        {
          key: "startDateShow",
          label: "Start Date",
        },
        {
          key: "endDateShow",
          label: "End Date",
        },
        {
          key: "actions",
          label: "Actions",
        },
      ],
      themeStyles: {
        wrapper: {
          background: "",
          color: "#fafafa",
          border: "0",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.14), 0 6px 20px 0 rgba(0, 0, 0, 0.13)",
          borderRadius: "5px",
        },
        header: {
          padding: `20px ${this.hSpacing}`,
        },
        headerHorizontalDivider: {
          borderTop: "solid rgba(255, 255, 255, 0.2) 1px",
          width: "80%",
        },
        weekdays: {
          color: "#000000", // New color
          fontWeight: "100", // And bolder font weight
          padding: `20px ${this.hSpacing} 5px ${this.hSpacing}`,
          fontSize: "0.8rem",
        },
        weeks: {
          padding: `0 ${this.hSpacing} ${this.hSpacing} ${this.hSpacing}`,
        },
        dayContent: {
          fontSize: "0.8rem",
        },
      },
    };
  },
  watch: {
    items(data) {
      this.uniqueUsersFunction();
    },
  },
  computed: {
    inputState() {
      if (!this.selectedValue) {
        return {
          type: "is-danger",
          message: "Date required.",
        };
      }
      return {
        type: "is-primary",
        message: "",
      };
    },
  },
  methods: {
    clearForm() {
      this.screen = "createMaintenance";
      this.value = [];
      this.tempDateRangeData = null;
    },
    addMaintenance() {
      this.tempDateRange = this.tempDateRangeData;
      this.dateRange = this.tempDateRange;
      let willSendData = {
        serviceId: this.$route.params.id,
        userIds: [],
        dateRange: this.dateRange,
      };
      this.value.forEach((element) => {
        willSendData.userIds.push(element.userId);
      });
      this.$http
        .put("/api/v1/maintenance", willSendData)
        .then((response) => {
          this.$bvToast.toast(`Added Maintenance`, {
            title: "Maintenance Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.$http
            .get("/api/v1/maintenance/" + this.$route.params.id)
            .then((response2) => {
              this.items = response2.data;
              this.uniqueMaintenance(this.items);
              this.value = [];
              this.clearDate();
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          this.$bvToast.toast(`Something went wrong!`, {
            title: "Maintenance Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    editMaintenance() {
      this.tempDateRange = this.tempDateRangeData;
      this.dateRange = this.tempDateRange;

      let willSendData = {
        serviceId: this.$route.params.id,
        userIds: [],
        oldDateRange: this.dateOldRange,
        newDateRange: this.dateRange,
      };
      this.value.forEach((element) => {
        willSendData.userIds.push(element.userId);
      });
      this.$http
        .put("/api/v1/maintenance/edit", willSendData)
        .then((response) => {
          this.$bvToast.toast(`Edited Maintenance`, {
            title: "Maintenance Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.$http
            .get("/api/v1/maintenance/" + this.$route.params.id)
            .then((response2) => {
              this.items = response2.data;
              this.uniqueMaintenance(this.items);
              this.screen = "createMaintenance";
              this.value = [];
              this.clearDate();
            })
            .catch((error) => {
              console.log(error);
              this.errorStatus = true;
              this.errorResponse = error;
              this.errorHeader = "Edit operation has error!";
            });
        })
        .catch((error) => {
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Edit operation has error!";
          this.$bvToast.toast(`Something went wrong!`, {
            title: "Maintenance Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
        });
    },
    uniqueMaintenance(items) {
      let dates = null;
      let available = false;
      let maintenanceList = [];
      items.forEach((element) => {
        this.infoUsers += element.username;
        dates = {
          startDate: element.startDate,
          endDate: element.endDate,
        };
        available = false;
        for (let i = 0; i < maintenanceList.length; i++) {
          if (
            dates.startDate == maintenanceList[i].startDate &&
            dates.endDate == maintenanceList[i].endDate
          )
            available = true;
        }
        dates = {
          username: this.infoUsers,
          startDate: this.$moment(element.startDate),
          endDate: this.$moment(element.endDate),
          startDateShow: this.$moment(element.startDate).calendar(),
          endDateShow: this.$moment(element.endDate).calendar(),
        };

        if (available == false) maintenanceList.push(dates);

        this.maintenanceList = maintenanceList;
      });
    },
    deleteButton(item, index, event) {
      this.modalMessage =
        "Are you sure you want to delete the maintenance with the name " +
        item.username +
        " ?";
      this.deleteUserId = item.userId;
      this.deleteUserStartDate = item.startDate;
      this.deleteUserEndDate = item.endDate;
      this.deleteButtonValue = "User";
    },
    deleteMaintenanceButton(item, index, event) {
      this.modalMessageMaintenance =
        "Are you sure you want to delete maintenance ?";
      this.deleteButtonValue = "Maintenance";
      this.willDeleteItem = item;
    },
    deleteMaintenance(item, index, event) {
      let dateRange = {
        start: this.willDeleteItem.startDate,
        end: this.willDeleteItem.endDate,
      };
      let deleteMaintenanceItem = {
        serviceId: this.$route.params.id,
        dateRange: dateRange,
      };
      this.$http
        .delete("/api/v1/maintenance/delete", {
          body: deleteMaintenanceItem,
          data: deleteMaintenanceItem,
        })
        .then((response) => {
          this.$bvToast.toast(`Deleted Maintenance`, {
            title: "Maintenance Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.value = [];
          this.$http
            .get("/api/v1/maintenance/" + this.$route.params.id)
            .then((response2) => {
              this.items = response2.data;
              this.uniqueMaintenance(this.items);
            })
            .catch((error) => {
              console.log(error);
              this.errorStatus = true;
              this.errorResponse = error;
              this.errorHeader = "Delete operation has error!";
            });
        })
        .catch((error) => {
          this.$bvToast.toast(`Something went wrong!`, {
            title: "Maintenance Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Delete operation has error!";
        });
    },
    firstEditButton(item, index, event) {
      this.screen = "editMaintenance";
      let dateRange = {
        start: item.startDate,
        end: item.endDate,
      };
      let sendData = {
        serviceId: this.$route.params.id,
        dateRange: dateRange,
      };
      this.$http
        .post("/api/v1/maintenance/list", sendData)
        .then((response) => {
          this.value = [];
          this.editUsers = response.data;
          this.editUsers.forEach((element) => {
            this.value.push(element);
          });
          this.dateOldRange = {
            start: new Date(item.startDate),
            end: new Date(item.endDate),
          };
          console.log(this.dateOldRange);
          this.tempDateRangeData = this.dateOldRange;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    deleteUser() {
      let dateRange = {
        start: this.deleteUserStartDate,
        end: this.deleteUserEndDate,
      };
      let delData = {
        serviceId: this.$route.params.id,
        userId: this.deleteUserId,
        dateRange: dateRange,
      };
      this.$http
        .delete("/api/v1/maintenance/delete/user", delData)
        .then((response) => {
          this.$http
            .get("/api/v1/maintenance/" + this.$route.params.id)
            .then((response2) => {
              this.items = response2.data;
              this.uniqueMaintenance(this.items);
            })
            .catch((error) => {
              console.log("error", error);
              this.errorStatus = true;
              this.errorResponse = error;
              this.errorHeader = "Delete operation has error!";
            });
        })
        .catch((error) => {
          this.$bvToast.toast(`Something went wrong!`, {
            title: "Maintenance Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Delete operation has error!";
        });
    },
    infoUsersFunction(item, index) {
      return this.uniqueUsernames[index];
    },
    uniqueUsersFunction() {
      let uniqueUsernames = [];
      let startEndObjectList = [];

      this.items.forEach((element) => {
        let varMı = false;
        let startEndObject = {
          start: element.startDate,
          end: element.endDate,
        };
        for (let i = 0; i < startEndObjectList.length; i++)
          if (
            JSON.stringify(startEndObjectList[i]) ===
            JSON.stringify(startEndObject)
          )
            varMı = true;

        if (!varMı) {
          startEndObjectList.push(startEndObject);
          uniqueUsernames.pop("");
        }
      });
      this.startEndObjectList = startEndObjectList;
      this.items.forEach((element) => {
        let startEndObject = {
          start: element.startDate,
          end: element.endDate,
        };
        for (let i = 0; i < startEndObjectList.length; i++) {
          if (
            JSON.stringify(startEndObjectList[i]) ===
            JSON.stringify(startEndObject)
          ) {
            if (uniqueUsernames[i] === undefined) uniqueUsernames[i] = "";
            uniqueUsernames[i] += element.username + " | ";
          }
        }
      });
      this.uniqueUsernames = uniqueUsernames;
    },
    setStatusInfo(item, index) {
      let itemStart = new Date(item.item.startDate);
      let itemEnd = new Date(item.item.endDate);
      let now = new Date();
      let statusInfo = "";
      if (itemEnd < now) statusInfo = "past";
      else if (itemStart > now) statusInfo = "scheduled";
      else statusInfo = "active";
      return statusInfo;
    },
    statusBarFunction(item, index) {
      let itemStart = new Date(item.item.startDate);
      let itemEnd = new Date(item.item.endDate);
      let nowStart = new Date();
      let nowEnd = new Date();
      if (itemEnd < nowEnd) {
        return "danger";
      }
      if (itemStart > nowStart) {
        return "warning";
      } else {
        return "success";
      }
    },
    clearDate() {
      this.dateRange = "";
      this.tempDateRange = "";
      this.tempDateRangeData = null;
      this.data.startTime = "";
      this.data.endTime = "";
    },
  },
  created() {
    this.$http
      .get("/api/v1/user")
      .then((response) => {
        this.users = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    this.$http
      .get("/api/v1/maintenance/" + this.$route.params.id)
      .then((response) => {
        this.items = response.data;
        this.uniqueMaintenance(this.items);
        this.value = [];
      })
      .catch((error) => {
        console.log("error", error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
  },
};
</script>

<style>
</style>