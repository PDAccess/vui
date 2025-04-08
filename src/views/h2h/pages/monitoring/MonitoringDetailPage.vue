<template>
  <div class="animated fadeIn">
    <b-card v-if="errorStatus">
      <p-error
        header="Something went wrong!"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
    </b-card>
    <b-card v-else-if="loading">
      <p-loading class="my-5" message="Loading..." />
    </b-card>
    <p-card v-else no-body>
      <b-row class="mt-2 justify-content-center">
        <b-col cols="3">
          <b-button
            variant="danger"
            @click="$router.push({ name: 'Monitoring' })"
          >
            <i class="fa fa-arrow-left" aria-hidden="true"></i>
          </b-button>
        </b-col>
        <b-col cols="6" style="text-align: center">
          <b-card
            class="tab-card text-white bg-primary title-card"
            style="height: 30px; padding: 0"
          >
            <h6 class="text-uppercase">{{ job }}</h6>
          </b-card>
        </b-col>
        <b-col cols="3"></b-col>
      </b-row>
      <br />
      <b-row>
        <b-col>
          <b-table
            striped
            hover
            :items="items"
            :fields="fields"
            :responsive="responsive"
            :small="responsive"
            fixed
          >
            <template v-slot:cell(instance)="data">{{
              data.item.target.instance
            }}</template>
            <template v-slot:cell(unit)="data">{{ data.item.unit }}</template>
            <template v-slot:cell(action)="data">
              <b-button
                variant="primary"
                title="Show"
                v-b-tooltip.bottom
                @click="showChart(data.item)"
              >
                <i class="fa fa-eye" aria-hidden="true"></i>
              </b-button>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </p-card>
  </div>
</template>
<script>
export default {
  name: "app",
  props: ["job"],
  components: {},
  data() {
    return {
      items: [],
      fields: [
        { key: "instance", label: "Instance" },
        { key: "metric", sortable: true, label: "Metric" },
        { key: "type", labelc: "Type" },
        { key: "help", label: "Help" },
        { key: "unit", label: "Unit" },
        { key: "action", label: "Show" },
      ],
      loading: true,
      errorStatus: false,
      errorResponse: "",
    };
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  methods: {
    showChart(data) {
      console.log(data);
      this.$router.push({
        name: "Monitoring Show",
        params: {
          type: data.type,
          instance: this.job,
          metric: data.metric,
          help: data.help,
        },
      });
    },
  },
  created() {
    let obj = '{job="' + this.job + '"}';
    this.$http
      .get("/monitor/api/v1/targets/metadata?match_target=" + encodeURI(obj))
      .then((response) => {
        this.items = response.data.data;
        this.loading = false;
      })
      .catch((error) => {
        console.log("error: ", error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
      });
  },
};
</script>
<style>
.title-card > div {
  padding-top: 6px !important;
}
</style>