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
        <p-loading class="my-5" message="Loading..." />
      </div>
      <p-error
        v-else-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <div
        class="d-flex justify-content-center"
        v-else-if="serverUsersData.length === 0"
      >
        <empty-data textmessage="No Data!" />
      </div>
      <div v-else>
        <b-table :fields="fields" :items="serverUsersData" hover show-empty>
          <template v-slot:cell(user)="row">
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
          </template>
          <template v-slot:cell(authStartDate)="row">
            <b-badge variant="primary">{{
              row.item.authStartDate | moment("calendar")
            }}</b-badge>
          </template>
          <template v-slot:cell(authEndDate)="row">
            <b-badge variant="success">{{
              row.item.authEndDate | moment("calendar")
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
  name: "ServerUsersAuths",
  components: {
    DownloadExcel,
  },
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      loading: false,
      serverUsersData: [],
      services: [],
      selected: [],
      tempSelectedServices: [],
      selectedServices: [],
      excelField: null,
      exporting: false,
      tempDateRangeData: null,
      fields: [
        { key: "user" },
        { key: "userAuth" },
        { key: "authStartDate" },
        { key: "authEndDate" },
        { key: "authDescription" },
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
    userDetailPage() {
      // this.$router.push({
      //   name: "User Detail",
      //   params: {
      //     id: item.sessionEntity.userEntity.userId,
      //   },
      // });
    },
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
          userAuth: "admin",
          authStartDate: new Date(),
          authEndDate: new Date(),
          authDescription: "test description",
        },
        {
          user: "userone",
          userAuth: "admin",
          authStartDate: new Date(),
          authEndDate: new Date(),
          authDescription: "test description",
        },
        {
          user: "sakbal",
          userAuth: "admin",
          authStartDate: new Date(),
          authEndDate: new Date(),
          authDescription: "test description",
        },
        {
          user: "ggultekin",
          userAuth: "admin",
          authStartDate: new Date(),
          authEndDate: new Date(),
          authDescription: "test description",
        },
        {
          user: "bkaya",
          userAuth: "admin",
          authStartDate: new Date(),
          authEndDate: new Date(),
          authDescription: "test description",
        },
      ];
      this.serverUsersData = datas;
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
        this.errorHeader = "Something went wrong!";
      });
    this.getData();
  },
};
</script>
