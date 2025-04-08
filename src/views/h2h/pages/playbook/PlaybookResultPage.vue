<template>
  <b-card>
    <b-link :to="'/playbook/detail/' + $attrs.id">Back to Histories</b-link>
    <hr />
    <p-loading v-if="loading" class="my-5" message="Loading..." />
    <div class="wrapper" v-else>
      <div class="d-flex justify-content-between container-nav">
        <div class="module-nav">
          <h4>{{ playbook.ansibleInstallerEntity.name }} Result</h4>
        </div>
        <div class="create-nav">
          <b-button @click="sendMessage" variant="success" v-if="!runStatus"
            >Re run</b-button
          >
          <b-button variant="danger" v-else disabled>Running</b-button>
          <hr class="split-nav" />
        </div>
      </div>
      <hr />
      <b-card class="console">
        <div class="console">
          <b-spinner
            variant="light"
            label="Text Centered"
            v-if="conn == null"
          ></b-spinner>
          <p
            :class="message.success"
            v-else
            v-for="(message, index) in messages"
            v-bind:key="index"
          >
            {{ message.content }}
          </p>
          <p
            :class="status.finished ? 'success' : 'failure'"
            v-for="(status, i) in playbookStatusList"
            v-bind:key="i + 1"
          >
            Playbook is
            {{
              status.finished
                ? "finished \n"
                : "not finished \n" + status.result
            }}
          </p>
        </div>
      </b-card>
    </div>
  </b-card>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      firstRun: true,
      loading: true,
      conn: null,
      connectionMessage: null,
      runStatus: true,
      playbookStatusList: [],
      playbookStatus: {
        finished: null,
        result: null,
      },
      playbookPlayInfo: null,
      playbook: null,
      messages: [],
      tmpMessage: {
        content: null,
        success: null,
      },
      socketTrigger: {
        userId: null,
        playbookId: this.$attrs.id,
        token: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
      token: "auth/token",
    }),
  },
  methods: {
    playbookRun() {
      this.firstRun = true;
      this.conn.send(JSON.stringify(this.socketTrigger));
      this.runStatus = true;
    },
    getStatus() {
      if (!this.runStatus && !this.playbookStatus.finished) {
        let self = this;
        setInterval(() => {
          self.conn.send(JSON.stringify(self.playbookPlayInfo));
        }, 5000);
      } else {
        this.runStatus = !this.runStatus;
      }
    },
  },
  created() {
    let id = this.$attrs.id;
    this.socketTrigger.userId = this.user.userId;
    this.socketTrigger.token = this.token;
    this.conn = {};
    // this.conn = new SockJS("/ws/playbooktunnel");
    let vm = this;
    this.conn.onopen = function (event) {
      console.log("Successful connect");
      vm.tmpMessage.content = "Connection has been established successfully.";
      vm.tmpMessage.success = "message";
      vm.messages.push(vm.tmpMessage);
      vm.tmpMessage = {
        content: null,
        success: null,
      };
      vm.playbookRun();
    };

    this.conn.onmessage = function (event) {
      if (vm.firstRun) {
        vm.playbookPlayInfo = JSON.parse(event.data);
        vm.firstRun = false;
      } else {
        vm.playbookStatus = JSON.parse(event.data);
        vm.playbookStatusList.push(vm.playbookStatus);
        vm.playbookStatus = null;
      }
      vm.getStatus();
    };

    this.$http
      .get("/api/v1/playbook/" + id)
      .then((response) => {
        this.playbook = response.data;
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>
<style scoped>
.console {
  background-color: rgb(0, 0, 0);
}
.success {
  color: rgb(0, 255, 0);
}
.failure {
  color: red;
}
.message {
  color: rgb(200, 200, 200);
}
</style>