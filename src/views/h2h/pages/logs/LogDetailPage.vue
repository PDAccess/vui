<template>
  <p-error
    v-if="errorStatus"
    :header="errorHeader"
    :errorResponse="errorResponse"
    @reload="$router.go()"
  />
  <p-card v-else>
    <b-row no-gutters class="mb-1">
      <b-col cols="3" class="align-self-center">
        <b-button
          variant="outline-danger"
          size="sm"
          @click="$router.push('/admin/logs')"
        >
          <i class="fa fa-arrow-left" aria-hidden="true"></i>
        </b-button>
        &nbsp;
        <b-button variant="outline-primary" size="sm" @click="loadLog">
          <i class="fa fa-refresh" aria-hidden="true"></i>
        </b-button>
        &nbsp;
        <b-button
          @click="download()"
          variant="outline-success"
          size="sm"
          :disabled="downloadStatus"
        >
          <i class="fa fa-download"></i>
        </b-button>
      </b-col>
      <b-col cols="2" class="align-self-center">
        <div class="font-weight-bold h6">
          <em class="fa fa-tag" style="width: inherit; padding: 0px 5px"></em
          ><span>{{ tag }}</span>
        </div>
      </b-col>
      <b-col cols="2" class="align-self-center">
        <div class="font-weight-bold h6">
          <em
            class="fa fa-file-text-o"
            style="width: inherit; padding: 0px 5px"
          ></em
          ><span>{{ file }}</span>
        </div>
      </b-col>
      <b-col cols="2" class="align-self-center">
        <div class="font-weight-bold h6">
          <em
            class="fa fa-file-text-o"
            style="width: inherit; padding: 0px 5px"
          ></em
          ><span>{{ $moment(parseInt(time)).fromNow() }}</span>
        </div>
      </b-col>
      <b-col cols="4" class="align-self-center"> </b-col>
    </b-row>
    <log-viewer
      :log="log"
      :loading="isLoading"
      :scroll-duration="1000"
      style="height: 82vh"
    />
  </p-card>
</template>
<script>
import LogViewer from "@femessage/log-viewer";

export default {
  props: ["tag", "file", "time"],
  components: {
    LogViewer,
  },
  data() {
    return {
      log: "",
      isLoading: true,
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      downloadStatus: false,
    };
  },
  methods: {
    download() {
      this.downloadStatus = true;
      this.$http
        .post("/api/v1/system/log/download", `${this.tag}/${this.file}`, {
          responseType: "arraybuffer",
        })
        .then((response) => {
          const type = response.headers["content-type"];
          const blob = new Blob([response.data], {
            type: type,
            encoding: "UTF-8",
          });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = this.file;
          link.click();
          this.downloadStatus = false;
        });
    },
    loadLog() {
      this.isLoading = true;
      this.$http
        .post("/api/v1/system/log/read", this.tag + "/" + this.file)
        .then((response) => {
          this.log = response.data;
          this.isLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.isLoading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
  },
  created() {
    this.loadLog();
  },
};
</script>