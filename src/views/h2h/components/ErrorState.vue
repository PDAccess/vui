<template>
  <div class="d-flex flex-column h-100">
    <div
      class="
        d-flex
        flex-column
        justify-content-center
        text-center
        mt-4
        flex-fill
      "
    >
      <div class="p-2">
        <p class="h1">
          <b-icon icon="exclamation-circle" font-scale="4" variant="danger" />
        </p>
      </div>
      <div class="p-2">
        <h3 class="text-center">
          {{ header }}
        </h3>
      </div>
      <div class="p-2">
        <em class="text-center">
          {{ message }}
        </em>
      </div>
      <div class="p-2">
        <b-button variant="success" @click="$emit('reload')"
          ><b-icon icon="arrow-clockwise" /> &nbsp;Reload</b-button
        >&nbsp;&nbsp;
        <b-button
          class="ml-2"
          variant="primary"
          @click="showDetails = !showDetails"
        >
          <b-icon :icon="showDetails ? 'box-arrow-up' : 'box-arrow-down'" />
          &nbsp; Details</b-button
        >&nbsp;&nbsp;
        <b-button class="ml-2" variant="info" @click="renderPdf()">
          <b-icon icon="arrow-bar-down" /> &nbsp; Download Reports</b-button
        >
      </div>
      <div class="p-2" v-if="showDetails">{{ errorResponseParsing }}</div>
      <div class="p-2">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import jsPDF from "jspdf";
import "jspdf-autotable";

export default {
  components: {},
  data() {
    return {
      showDetails: false,
      errorData: {
        status: "",
        statusText: "",
        date: "",
        method: "",
        baseURL: "",
        url: "",
      },
    };
  },
  props: {
    message: {
      type: String,
      required: false,
    },
    header: {
      type: String,
      required: false,
    },
    errorResponse: {
      type: Object,
      required: false,
    },
  },
  computed: {
    errorResponseParsing() {
      return JSON.stringify(this.errorResponse);
    },
  },
  methods: {
    renderPdf() {
      const doc = new jsPDF();

      this.errorData.status = this.errorResponse.status;
      this.errorData.statusText = this.errorResponse.statusText;
      this.errorData.date = this.errorResponse.headers.date;
      this.errorData.method = this.errorResponse.config.method;
      this.errorData.baseURL = this.errorResponse.config.baseURL;
      this.errorData.url = this.errorResponse.config.url;
      this.errorData.data = this.errorResponse.config.data;

      var col = ["Details", "Values"];
      var rows = [];

      for (var key in this.errorData) {
        var temp = [key, this.errorData[key]];
        rows.push(temp);
      }
      doc.autoTable(col, rows);
      doc.save("PDAReport.pdf");
    },
  },
};
</script>
