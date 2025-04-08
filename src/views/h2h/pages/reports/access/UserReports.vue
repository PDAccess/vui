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
          @reload="getData"
        />
      </div>
      <div
        class="d-flex justify-content-center"
        v-else-if="userReportsData.length === 0"
      >
        <empty-data textmessage="No Data!" />
      </div>
      <div v-else>
        <b-table :items="userReportsData" hover show-empty>
          <template v-slot:cell(user)="row">
            <div class="d-flex justify-content-start align-items-center">
              <b-button
                @click="userDetailPage(row.item)"
                variant="link"
                class="profile-button"
              >
                <p-profile-avatar
                  :profileUsername="row.item.user"
                  :username="row.item.user"
                  :size="30"
                  :imageWidth="'30px'"
                  :imageHeight="'auto'"
                />
              </b-button>
            </div>
          </template>
          <template v-slot:cell(services)="row">
            <div class="d-flex justify-content-start align-items-center">
              <b-badge
                variant="success"
                class="m-1"
                :key="index"
                v-for="(service, index) in row.item.services"
              >
                <span v-b-tooltip.bottom title="Service Name">
                  {{ service.name }}
                </span>
                <span
                  v-b-tooltip.bottom
                  title="Service User Expire Date"
                  v-if="service.expireDate"
                >
                  - {{ service.expireDate | moment("calendar") }}
                </span>
                <span v-b-tooltip.bottom title="Service User Auth">
                  - {{ service.auth }}
                </span>
              </b-badge>
            </div>
          </template>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
import DownloadExcel from "vue-json-excel";

export default {
  name: "UserReports",
  components: {
    DownloadExcel,
  },
  data() {
    return {
      errorStatus: false,
      errorResponse: "",
      loading: false,
      userReportsData: [],
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
      let datas = [
        {
          user: "hekemen",
          services: [
            {
              inventory_id: "0199ed5a-d7b7-462e-8bcb-1bc185997d88",
              name: "aws4",
              expireDate: new Date(),
              auth: "supervisor",
            },
            {
              inventory_id: "0199ed5a-d7b7-462e-8bcb-1bc185997d88",
              name: "aws1",
              expireDate: new Date(),
              auth: "user",
            },
            {
              inventory_id: "0199ed5a-d7b7-462e-8bcb-1bc185997d88",
              name: "aws4",
              expireDate: null,
              auth: "supervisor",
            },
          ],
        },
        {
          user: "ggultekin",
          services: [
            {
              inventory_id: "0199ed5a-d7b7-462e-8bcb-1bc185997d88",
              name: "aws4",
              expireDate: new Date(),
              auth: "supervisor",
            },
            {
              inventory_id: "0199ed5a-d7b7-462e-8bcb-1bc185997d88",
              name: "aws1",
              expireDate: new Date(),
              auth: "user",
            },
          ],
        },
        {
          user: "sakbal",
          services: [
            {
              inventory_id: "0199ed5a-d7b7-462e-8bcb-1bc185997d88",
              name: "aws4",
              expireDate: new Date(),
              auth: "supervisor",
            },
            {
              inventory_id: "0199ed5a-d7b7-462e-8bcb-1bc185997d88",
              name: "aws4",
              expireDate: null,
              auth: "supervisor",
            },
          ],
        },
        {
          user: "userone",
          services: [
            {
              inventory_id: "0199ed5a-d7b7-462e-8bcb-1bc185997d88",
              name: "aws1",
              expireDate: new Date(),
              auth: "user",
            },
            {
              inventory_id: "0199ed5a-d7b7-462e-8bcb-1bc185997d88",
              name: "aws4",
              expireDate: null,
              auth: "supervisor",
            },
          ],
        },
      ];
      this.userReportsData = datas;
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
