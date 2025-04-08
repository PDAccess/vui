<template>
  <p-card>
    <div v-if="errorStatus">
      <p-error
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
    </div>
    <br />
    <p-loading
      class="my-5"
      v-if="externalCommandLoading"
      message="Loading..."
    />
    <p-error
      v-else-if="errorStatusCommandAction"
      :header="errorHeader"
      :errorResponse="errorResponse"
      @reload="$router.go()"
    />
    <p-initial
      v-else-if="exCommandLogs.length === 0"
      icon="exclamation-circle"
      header="You don't have any service agent commands."
      message="Please start an agent command"
    />
    <template v-else>
      <xterm :logs="exCommandLogs" />
    </template>
  </p-card>
</template>
<script>

import Xterm from "../../components/Xterm.vue";

export default {
  props: ["id", "sessionId"],
  components: {
    Xterm
  },
  data() {
    return {
      errorStatus: false,
      errorStatusFile: false,
      errorStatusCommandAction: false,
      errorStatusAuth: false,
      errorHeader: "",
      errorResponse: "",
      externalCommandLoading: true,
      loading: true,
      exCommandLogs: [],
      term: null,
      logs: [
        {
          execCommand: "userone-MacBook-Pro:~ userone$ ls",
          stdOut: "AndroidStudioProjects			ingress-deploy.yaml"
        },
        {
          execCommand: "userone-MacBook-Pro:~ userone$ ls",
          stdOut: "Applications				java_error_in_datagrip_10445.log"
        },
        {
          execCommand: "userone-MacBook-Pro:~ userone$ ls",
          stdOut: "Desktop					java_error_in_datagrip_1538.log"
        },
        {
          execCommand: "userone-MacBook-Pro:~ userone$ ifconfig",
          stdOut: "lo0: flags=8049<UP,LOOPBACK,RUNNING,MULTICAST> mtu 16384"
        },
        {
          execCommand: "userone-MacBook-Pro:~ userone$ ifconfig",
          stdOut: "   	options=1203<RXCSUM,TXCSUM,TXSTATUS,SW_TIMESTAMP>"
        },
        {
          execCommand: "userone-MacBook-Pro:~ userone$ ifconfig",
          stdOut: "	    inet 127.0.0.1 netmask 0xff000000"
        },
        {
          execCommand: "userone-MacBook-Pro:~ userone$ ifconfig",
          stdOut: "     inet6 ::1 prefixlen 128"
        }
      ]
    };
  },
  methods: {
    getExternalCommandActions() {
      this.externalCommandLoading = true;
      this.exCommandLogs = [];

      this.$http
        .get("/api/v1/shell/action/all/session/" + this.sessionId)
        .then((response) => {
          if (response.status == 200) {
            response.data.forEach((element) => {
              this.exCommandLogs.push(element);
            });

            this.externalCommandLoading = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorStatusCommandAction = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
  },
  created() {
    this.getExternalCommandActions();
  },
};
</script>

<style>
</style>