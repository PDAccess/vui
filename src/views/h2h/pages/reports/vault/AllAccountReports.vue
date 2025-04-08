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
            placeHolder="Select Date Range"
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
      <div v-if="loading" class="d-flex justify-content-center">
        <p-loading v-if="loading" class="my-5" message="Loading..." />
      </div>
      <div v-else-if="errorStatus">
        <p-error
          header="List operation has error!"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
      </div>
      <div
        class="d-flex justify-content-center"
        v-else-if="allAccountReports.length === 0"
      >
        <empty-data textmessage="No Data!" />
      </div>
      <div v-else>
        <ul class="list-group list-group-flush">
          <li
            :key="index"
            class="list-group-item"
            v-for="(item, index) in allAccountReports"
          >
            <div
              class="d-flex justify-content-between align-items-center"
            ></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import DownloadExcel from "vue-json-excel";

export default {
  name: "AllAccountReports",
  components: {
    DownloadExcel,
  },
  data() {
    return {
      loading: false,
      errorStatus: false,
      errorResponse: "",
      allAccountReports: [],
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
      this.loading = false;
    },
  },
  created() {
    this.loading = true;
    this.$http
      .get("/api/v1/service/all")
      .then((response) => {
        this.services = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
      });
    this.getData();
  },
};
</script>
