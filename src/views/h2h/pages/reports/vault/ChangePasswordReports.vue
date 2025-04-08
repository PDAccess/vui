<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <div class="d-flex justify-content-around mt-2 ml-2">
        <div class="form-group" style="width: 100%">
          <p-select
            :multiple="true"
            size="lg"
            v-model="selected"
            :options="services"
            placeholder="Select Service"
            track-by="inventory_id"
            label="name"
          />
        </div>
        <div class="form-group ml-2" style="width: 100%">
          <p-date-picker
            @val="tempDateRangeData = $event"
            :isRange="true"
            :clearBtn="true"
            placeHolder="Select Last Healthy Check Date Range"
            mode="range"
            :selectDate="tempDateRangeData"
          />
        </div>
        <div class="ml-2 mr-2">
          <b-button
            class="input-group-text"
            style="background: #ffffff; border: none; height: 40px"
          >
            <DownloadExcel
              :fetch="exportExcel"
              name="actions.xls"
              :fields="excelField"
            >
              <p-loading v-if="loading" gif-height="20" />
              <em
                v-else-if="!exporting"
                style="font-size: 25px"
                class="fa fa-download"
              ></em>
            </DownloadExcel>
          </b-button>
        </div>
      </div>
      <div v-if="errorStatus">
        <p-error
          :header="errorHeader"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
      </div>
      <div v-else-if="loading" class="d-flex justify-content-center">
        <p-loading v-if="loading" class="my-5" message="Loading..." />
      </div>
      <p-error
        v-else-if="errorStatus"
        header="Error"
        message="Something went wrong!"
        :error-response="errorResponse"
      />
      <div
        class="d-flex justify-content-center"
        v-else-if="changePasswordData.length === 0"
      >
        <p-empty message="No Data!" />
      </div>
      <div v-else>
        <b-table :items="changePasswordData" hover show-empty>
          <template v-slot:cell(name)="row">
            <div class="d-flex justify-content-start align-items-center">
              <div
                class="inventory-logo- ubuntu"
                style="width: 32px; height: 32px"
              ></div>
              <span v-b-tooltip.bottom title="Service Name" class="ml-1">{{
                row.item.name
              }}</span>
            </div>
          </template>
          <template v-slot:cell(lastHealthyCheck)="row">
            <b-badge variant="primary">
              {{ row.item.lastHealthyCheck | moment("calendar") }}
            </b-badge>
          </template>
          <template v-slot:cell(lastChange)="row">
            <b-badge variant="success">{{
              row.item.lastChange | moment("calendar")
            }}</b-badge>
          </template>
          <template v-slot:cell(status)="row">
            <b-badge :variant="row.item.status ? 'success' : 'danger'">{{
              row.item.status ? "enable" : "disable"
            }}</b-badge>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import DownloadExcel from "vue-json-excel";

export default {
  name: "ChangePasswordReports",
  components: {
    DownloadExcel,
  },
  data() {
    return {
      loading: false,
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      changePasswordData: [
        {
          name: "servicename",
          manage: "test manage",
          lastHealthyCheck: new Date(),
          lastChange: new Date(),
          status: true,
        },
        {
          name: "servicename",
          manage: "test manage",
          lastHealthyCheck: new Date(),
          lastChange: new Date(),
          status: false,
        },
        {
          name: "servicename",
          manage: "test manage",
          lastHealthyCheck: new Date(),
          lastChange: new Date(),
          status: true,
        },
        {
          name: "servicename",
          manage: "test manage",
          lastHealthyCheck: new Date(),
          lastChange: new Date(),
          status: false,
        },
      ],
      services: [],
      selected: [],
      tempSelectedServices: [],
      selectedServices: [],
      excelField: null,
      exporting: false,
      tempDateRangeData: null,
    };
  },
  watch: {
    selected: function () {
      this.loading = true;
      this.portalReportData = [];
      this.searchFilter();
    },
  },
  methods: {
    exportExcel() {
      this.exporting = !this.exporting;
    },
    searchFilter() {
      this.tempSelectedServices = [];
      this.selected.forEach((service) => {
        this.tempSelectedServices.push(service.name);
      });

      if (this.tempSelectedServices.length === 0) {
        this.clearFilter();
      } else if (
        !this.compareArray(this.selectedServices, this.tempSelectedServices)
      ) {
        this.selectedUsers = [...this.tempSelectedUsers];
        this.getData();
      }
    },
    clearFilter() {
      this.getData();
    },
    compareArray(array1, array2) {
      if (array1.length !== array2.length) return false;
      for (let i = 0; i < array1.length; i++) {
        if (!array2.includes(array1[i])) return false;
      }
      return true;
    },
    getData() {
      let data = [
        {
          name: "servicename",
          lastHealthyCheck: new Date(),
          manage: "test manage",
          lastChange: new Date(),
          status: true,
        },
        {
          name: "servicename",
          lastHealthyCheck: new Date(),
          manage: "test manage",
          lastChange: new Date(),
          status: false,
        },
        {
          name: "servicename",
          lastHealthyCheck: new Date(),
          manage: "test manage",
          lastChange: new Date(),
          status: true,
        },
        {
          name: "servicename",
          lastHealthyCheck: new Date(),
          manage: "test manage",
          lastChange: new Date(),
          status: false,
        },
      ];
      this.changePasswordData = data;
      this.loading = false;
    },
  },
  created() {
    this.$http
      .get("/api/v1/service/all")
      .then((response) => {
        this.services = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
    this.getData();
  },
};
</script>
