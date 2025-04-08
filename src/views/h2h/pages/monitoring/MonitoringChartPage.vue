<template>
  <div>
    <b-card>
      <b-row>
        <b-col cols="12" sm="6">
          <b-row>
            <b-col>
              <div class="form-group">
                <p-select
                  :options="steps"
                  label="label"
                  placeholder="Select Step"
                  track-by="value"
                  v-model="selectedStep"
                ></p-select>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <div class="form-group">
                <p-select
                  :options="types"
                  label="label"
                  placeholder="Select Data Type"
                  track-by="value"
                  v-model="selectedType"
                ></p-select>
              </div>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="12" sm="6">
          <b-row>
            <b-col>
              <p-date-picker
                @val="dateRangeData = $event"
                :isRange="true"
                :clearBtn="true"
                mode="dateTime"
                placeHolder="Date Range"
                :select-date="dateRangeData"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-row>
            <b-col cols="6" sm="2" class="back-area">
              <b-button
                variant="danger"
                style="width: 100%"
                @click="routeMonitoringDetail"
              >
                <i class="fa fa-chevron-left mr-2" aria-hidden="true"></i>
              </b-button>
            </b-col>
            <b-col cols="6" sm="10" class="live-area">
              <b-button
                @click="liveMode = !liveMode"
                style="width: 100%"
                :variant="liveMode ? 'primary' : 'outline-primary'"
                :title="liveMode ? 'Disable Live Mode' : 'Enable Live Mode'"
                v-b-tooltip.bottom
              >
                <i class="fa fa-refresh" aria-hidden="true"></i>
                <span class="d-sm-down-none ml-2">{{
                  liveMode ? "Enabled Live Mode" : "Disabled Live Mode"
                }}</span>
              </b-button>
            </b-col>
          </b-row>
        </b-col>
        <b-col>
          <b-row>
            <b-col cols="6" class="filter-area">
              <b-button
                @click="dataFilter"
                :disabled="
                  !selectedType ||
                  !dateRangeData ||
                  !selectedStep ||
                  !startTime ||
                  !endTime
                "
                variant="success"
                style="width: 100%"
                >Filter</b-button
              >
            </b-col>
            <b-col cols="6" class="clear-area">
              <b-button
                @click="clearToDefault"
                variant="danger"
                style="width: 100%"
                >Clear</b-button
              >
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <hr />
      <p-loading v-if="loading" class="my-5" message="Loading..." />
      <b-row v-else-if="error" class="mb-4 justify-content-center">
        <b-col>
          <b-card class="tab-card" style="text-align: center">
            <div class="d-flex justify-content-center">
              <img
                height="300"
                alt="Empyt page"
                src="@/assets/img/emptypage.svg"
              />
            </div>
            <p style="font-size: 1.2rem">
              <span style="color: red">{{ errorMessage }}</span>
            </p>
          </b-card>
        </b-col>
      </b-row>
      <b-row
        v-else-if="dataSets.length == 0"
        class="mb-4 justify-content-center"
      >
        <b-col>
          <b-card class="tab-card" style="text-align: center">
            <div class="d-flex justify-content-center">
              <img
                height="300"
                alt="Empyt page"
                src="@/assets/img/emptypage.svg"
              />
            </div>
            <p style="font-size: 1.2rem">
              No records for
              <span style="color: red">{{ title }}</span> metric found
            </p>
          </b-card>
        </b-col>
      </b-row>
      <b-row v-else>
        <b-col>
          <b-row class="mb-4" :key="index" v-for="(data, index) in dataSets">
            <b-col>
              <b-card class="tab-card">
                <b-row v-if="data.dataSet[0].values.length == 0">
                  <b-col>
                    <div style="text-align: center">
                      <div class="d-flex justify-content-center">
                        <img
                          height="300"
                          alt="Empyt page"
                          src="@/assets/img/emptypage.svg"
                        />
                      </div>
                      <p style="font-size: 1.2rem">
                        No records for
                        <span style="color: red" v-if="data.metric.id"
                          >{{ data.metric.id }} sub metric in {{ title }}</span
                        >
                        <span style="color: red" v-else
                          >a sub metric in {{ title }}</span
                        >
                        metric found
                      </p>
                    </div>
                  </b-col>
                </b-row>
                <b-row v-else>
                  <b-col class="mt-2" lg="2" v-if="data.metric.id">
                    <p>
                      <strong>{{
                        data.metric.id + " Sub Metric in " + title + " Metric"
                      }}</strong>
                    </p>
                    <p>{{ help }}</p>
                  </b-col>
                  <b-col class="mt-2" lg="2" v-else>
                    <p>
                      <strong>{{ title + " Metric" }}</strong>
                    </p>
                    <p>{{ help }}</p>
                  </b-col>

                  <b-col lg="10">
                    <vue-frappe
                      :id="'chart-' + index"
                      :labels="data.labels"
                      :title="getTitle"
                      type="line"
                      :height="400"
                      :colors="['purple', '#ffa3ef', 'light-blue']"
                      :dataSets="data.dataSet"
                      :tooltipOptions="tooltipOptions"
                    ></vue-frappe>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>
<script>
import { VueFrappe } from "vue2-frappe";

export default {
  props: ["type", "instance", "metric", "help"],
  components: { VueFrappe },
  data() {
    return {
      error: false,
      errorMessage: "",
      live: null,
      liveMode: false,
      dataSets: [],
      today: {},
      yesterday: {},
      startTime: "",
      endTime: "",
      hSpacing: "20px",
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
      steps: [
        { label: "1 Minute", value: "1m" },
        { label: "3 Minute", value: "3m" },
        { label: "5 Minute", value: "5m" },
        { label: "10 Minute", value: "10m" },
        { label: "30 Minute", value: "30m" },
        { label: "1 Hour", value: "1h" },
        { label: "6 Hour", value: "6h" },
        { label: "12 Hour", value: "12h" },
        { label: "1 Day", value: "1d" },
        { label: "1 Week", value: "1w" },
        { label: "1 Month", value: "4w" },
        { label: "1 Year", value: "1y" },
      ],
      types: [
        {
          label: "Byte",
          value: "byte",
          symbol: "Byte",
          convert: this.convertByte,
        },
        {
          label: "Kilo Byte",
          value: "kilobyte",
          symbol: "KB",
          convert: this.convertKiloByte,
        },
        {
          label: "Mega Byte",
          value: "megabyte",
          symbol: "MB",
          convert: this.convertMegaByte,
        },
        {
          label: "Giga Byte",
          value: "gigabyte",
          symbol: "GB",
          convert: this.convertGigaByte,
        },
        {
          label: "Counter",
          value: "counter",
          symbol: "Count",
          convert: this.convertCount,
        },
        {
          label: "Time",
          value: "time",
          symbol: "",
          convert: this.convertTime,
        },
        {
          label: "Percent",
          value: "percent",
          symbol: "%",
          convert: this.convertPercent,
        },
        {
          label: "Other",
          value: "other",
          symbol: "",
          convert: this.convertOther,
        },
      ],
      selectedStep: { label: "5 Minute", value: "5m" },
      selectedType: {
        label: "Other",
        value: "other",
        symbol: "",
        convert: this.convertOther,
      },
      dateRangeData: null,
      dateRange: "",
      datasets: [{ values: [] }],
      labels: [],
      title: "",
      loading: false,
    };
  },
  computed: {
    tooltipOptions() {
      return {
        formatTooltipX: (d) => d,
        formatTooltipY: (d) => d + " " + this.selectedType.symbol,
      };
    },
    getTitle() {
      return (
        this.title +
        (this.selectedType.symbol != ""
          ? "(" + this.selectedType.symbol + ")"
          : "")
      );
    },
  },
  watch: {
    liveMode(value) {
      if (value) {
        this.live = setInterval(() => {
          this.clearDate();
          this.dataFilter();
        }, 5000);
      } else {
        clearInterval(this.live);
      }
    },
    dateRangeData: function (value) {
      console.log(value.start.format("h:mm:ss"));
      let startTimes = value.start.format("h:mm").split(":");
      let endTimes = value.end.format("h:mm").split(":");
      let startValue;
      let endValue;
      this.dateRangeData.start = this.$moment(this.dateRangeData.start).set({
        hour: startTimes[0],
        minute: startTimes[1],
        second: startTimes[2],
      });
      this.dateRangeData.end = this.$moment(this.dateRangeData.end).set({
        hour: endTimes[0],
        minute: endTimes[1],
        second: endTimes[2],
      });
      if (value) {
        startValue = this.$moment(value.start).format("Y/MM/DD");
        endValue = this.$moment(value.end).format("Y/MM/DD");
        this.dateRange = startValue + " - " + endValue;
      } else {
        startValue = this.today.format("Y/MM/DD");
        endValue = this.yesterday.format("Y/MM/DD");
        this.dateRange = startValue + " - " + endValue;
      }
    },
    startTime(value) {
      let values = value.split(":");
      this.dateRangeData.start = this.$moment(this.dateRangeData.start).set({
        hour: values[0],
        minute: values[1],
        second: values[2],
      });
    },
    endTime(value) {
      let values = value.split(":");
      this.dateRangeData.end = this.$moment(this.dateRangeData.end).set({
        hour: values[0],
        minute: values[1],
        second: values[2],
      });
    },
  },
  methods: {
    clearToDefault() {
      let startValue = this.today.format("Y/MM/DD");
      let endValue = this.yesterday.format("Y/MM/DD");
      this.dateRange = startValue + " - " + endValue;
      this.startTime = this.yesterday.format("H:mm:ss");
      this.endTime = this.today.format("H:mm:ss");
      this.dateRangeData = { start: this.yesterday, end: this.today };
      this.selectedStep = { label: "5 Minute", value: "5m" };
      this.selectedType = {
        label: "Other",
        value: "other",
        symbol: "",
        convert: this.convertOther,
      };
    },
    clearDate() {
      this.today = this.$moment();
      this.yesterday = this.$moment().subtract(6, "hours");
      let startValue = this.today.format("Y/MM/DD");
      let endValue = this.yesterday.format("Y/MM/DD");
      this.dateRange = startValue + " - " + endValue;
      this.startTime = this.yesterday.format("H:mm:ss");
      this.endTime = this.today.format("H:mm:ss");
      this.dateRangeData = { start: this.yesterday, end: this.today };
    },
    routeMonitoringDetail() {
      this.$router.push({
        name: "Monitoring Detail",
        params: {
          job: this.instance,
        },
      });
    },
    dataFilter() {
      this.loading = true;
      let start =
        "&start=" + this.$moment(this.dateRangeData.start).valueOf() / 1000;
      let end = "&end=" + this.$moment(this.dateRangeData.end).valueOf() / 1000;
      let query = this.metric + '{job="' + this.instance + '"}';
      let step = "&step=" + this.selectedStep.value;
      let range_query = query + start + end + step;
      this.$http
        .get("/monitor/api/v1/query_range?query=" + encodeURI(range_query))
        .then((response) => {
          this.error = false;
          this.dataSets = response.data.data.result;
          this.dataSets.forEach((metric) => {
            let values = [];
            let labels = [];
            for (let i = 0; i < metric.values.length; i++) {
              values.push(this.selectedType.convert(metric.values[i][1]));
              labels.push(
                this.$moment(metric.values[i][0] * 1000).format("DD/MM/Y HH:mm")
              );
            }
            metric.labels = labels;
            metric.dataSet = [{ values: values }];
          });
          this.loading = false;
        })
        .catch((error) => {
          console.log("error", error);
          this.error = true;
          this.errorMessage = error.data.error;
          this.loading = false;
        });
    },
    convertByte(data) {
      return data;
    },
    convertKiloByte(data) {
      return Math.round(data / 1000);
    },
    convertMegaByte(data) {
      return Math.round(data / 1000000);
    },
    convertGigaByte(data) {
      return Math.round(data / 1000000000);
    },
    convertCount(data) {
      return Math.round(data);
    },
    convertTime(data) {
      return data;
    },
    convertPercent(data) {
      return Math.round(data * 100);
    },
    convertOther(data) {
      return data;
    },
  },
  created() {
    this.loading = true;
    this.metric.split("_").forEach((word) => {
      this.title += word.charAt(0).toUpperCase() + word.slice(1) + " ";
    });
    this.clearDate();
    this.dataFilter();
  },
};
</script>
<style scoped>
.tab-card {
  cursor: pointer;
  -webkit-transition: box-shadow 0.6s ease-out !important;
  box-shadow: 0.8px 0.9px 3px grey !important;
}
.tab-card:hover {
  box-shadow: 1px 8px 20px grey !important;
  -webkit-transition: box-shadow 0.6s ease-in !important;
}

@media only screen and (max-width: 576px) {
  .back-area {
    margin-top: 10px;
    padding-right: 15px;
  }

  .live-area {
    margin-top: 10px;
    padding-left: 0px;
  }

  .filter-area {
    margin-top: 10px;
    padding-right: 5px;
  }

  .clear-area {
    margin-top: 10px;
    padding-left: 5px;
  }
}
</style>
