<template>
  <div class="animated fadeIn">
    <p-error
      v-if="errorStatus"
      header="Something went wrong!"
      :errorResponse="errorResponse"
      @reload="$router.go()"
    />
    <p-loading v-else-if="loading" class="my-5" message="Loading..." />
    <template v-else>
      <b-row style="padding: 15px">
        <b-col col="6"> You can access system dashbord from here </b-col>
        <b-col col="6">
          <b-link href="/dashboard/" target="_blank"> System Dashboard</b-link>
        </b-col>
      </b-row>
      <b-row style="padding: 15px">
        <b-col col="6"> API Level Developer Console </b-col>
        <b-col col="6">
          <b-link href="/devportal/" target="_blank"> Developer Console</b-link>
        </b-col>
      </b-row>
      <!--
      <b-row>
        <b-col
          v-for="item in items"
          sm="6"
          lg="3"
          style="padding: 15px"
          v-bind:key="item.labels.job"
        >
          <b-card :class="itemType(item.health)" style="height: 11rem">
            <div class="h4 m-0">{{ item.labels.job }}</div>
            <div>Last Metric: {{ item.lastScrape | moment("calendar") }}</div>
            <br />
            <small class="text-muted">Health {{ item.health }}</small>
            <p>{{ item.lastError }}</p>
            <b-button @click.stop="detail(item)" variant="success"
              >Metrics</b-button
            >
          </b-card>
        </b-col>
      </b-row>
      -->
    </template>
  </div>
</template>
<script>
export default {
  name: "AdminSidebar",
  data() {
    return {
      items: [],
      loading: true,
      errorStatus: false,
      errorResponse: "",
    };
  },
  methods: {
    detail(item) {
      this.$router.push({
        name: "Monitoring Detail",
        params: {
          job: item.labels.job,
        },
      });
    },
    itemType(health) {
      let type;

      if (health == "up") {
        type = "primary";
      } else {
        type = "danger";
      }

      return "text-white bg-" + type;
    },
  },
  created() {
    this.loading = false;
    /*
    this.$http
      .get("/monitor/api/v1/targets")
      .then((response) => {
        this.items = response.data.data.activeTargets;
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
      });
      */
  },
};
</script>
