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
      <p-loading v-if="loading" class="my-5" message="Loading..." />
      <p-error
        v-else-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <div
        class="d-flex justify-content-center"
        v-else-if="serverAgentData.length === 0"
      >
        <p-empty message="No Data!" />
      </div>
      <div v-else>
        <b-table :fields="fields" :items="serverAgentData" hover show-empty>
          <template v-slot:cell(osImage)="row">
            <div
              class="inventory-logo- windows"
              style="width: 32px; height: 32px"
            />
          </template>
          <template v-slot:cell(includeDate)="row">
            <b-badge
              variant="primary"
              v-b-tooltip.bottom
              title="Domain Include Date"
            >
              {{ row.item.includeDate | moment("calendar") }}
            </b-badge>
          </template>
          <template v-slot:cell(serverAccessStatus)="row">
            <b-badge
              :variant="row.item.serverAccessStatus ? 'success' : 'danger'"
            >
              {{ row.item.serverAccessStatus ? "Enable" : "Disable" }}
            </b-badge>
          </template>
          <template v-slot:cell(mfaStatus)="row">
            <b-badge :variant="row.item.mfaStatus ? 'success' : 'danger'"
              >{{ row.item.mfaStatus ? "Enable" : "Disable" }}
            </b-badge>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import DownloadExcel from "vue-json-excel";

export default {
  name: "ServersAgentVersions",
  components: {
    DownloadExcel,
  },
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      loading: false,
      serverAgentData: [],
      services: [],
      selected: [],
      tempSelectedServices: [],
      selectedServices: [],
      excelField: null,
      exporting: false,
      tempDateRangeData: null,
      fields: [
        { key: "osImage" },
        { key: "agentVersion", label: "Agent Version" },
        { key: "agentSystemLocation", label: "System Location" },
        {
          key: "includeDate",
          sortable: true,
          label: "Include Date",
        },
        { key: "os", sortable: true, label: "Operating System" },
        { key: "osVersion", label: "OS Version" },
        { key: "serverAccessStatus", label: "Server Access Status" },
        { key: "mfaStatus", label: "MFA Status" },
      ],
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
      let datas = [
        {
          agentVersion: "2.0",
          agentSystemLocation: "test",
          includeDate: new Date(),
          os: "ubuntu",
          osVersion: "20.04",
          serverAccessStatus: true,
          mfaStatus: false,
        },
        {
          agentVersion: "19042.1110",
          agentSystemLocation: "test",
          includeDate: new Date(),
          os: "win10",
          osVersion: "20H2",
          serverAccessStatus: false,
          mfaStatus: true,
        },
        {
          agentVersion: "8.0",
          agentSystemLocation: "test",
          includeDate: new Date(),
          os: "centos",
          osVersion: "2105",
          serverAccessStatus: true,
          mfaStatus: false,
        },
      ];
      this.serverAgentData = datas;
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
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
    this.getData();
  },
};
</script>
