<template>
  <div class="animated fadeIn" v-if="credential === 'transparent'">
    <p-card>
      <b-row class="my-1">
        <b-col sm="4">
          <h3>Break the Glass</h3>
          <p>You can access all sensetive data in here.</p>
          <p>Please use in Emergency Cases (like fire alarm.)</p>
          <p>All attempts will be logged.</p>
          <p>Service name: {{ info.name }}</p>
        </b-col>
        <b-col class="d-flex justify-content-center">
          <div>
            <h4 class="text-center">Service Credential is Transparent mode!</h4>
          </div>
        </b-col>
      </b-row>
    </p-card>
  </div>
  <div v-else-if="!breakform" class="animated fadeIn">
    <p-card>
      <b-row class="mt-2">
        <b-col>
          <h3>Break the Glass</h3>
        </b-col>
      </b-row>
      <hr />
      <b-row class="my-1">
        <b-col sm="4">
          <p>You can access all sensetive data in here.</p>
          <p>Please use in Emergency Cases (like fire alarm.)</p>
          <p>All attempts will be logged.</p>
          <p>Service name: {{ info.name }}</p>
        </b-col>
        <b-col align-self="center">
          <b-row align-h="center">
            <b-col align-self="center" class="d-flex justify-content-center">
              <b-button
                :disabled="locked"
                variant="danger"
                size="lg"
                @click.stop="breakform = true"
                >Break The Glass</b-button
              >
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </p-card>
  </div>
  <div v-else class="animated fadeIn">
    <b-card bg-variant="danger" no-body>
      <b-row class="my-1">
        <b-col sm="4">
          <h3>Break the Glass</h3>
          <p>You can access all sensetive data in here.</p>
          <p>Please use in Emergency Cases (like fire alarm.)</p>
          <p>All attempts will be logged.</p>
          <p>Service name: {{ info.name }}</p>
        </b-col>
        <b-col sm="8">
          <p>To break the glass entry your reason and confirm code.</p>
          <b-form-textarea
            placeholder="Entry your reason"
            class="mb-2"
            v-model="reason"
            :rows="8"
          ></b-form-textarea>
          <br />
          <h5>Code: {{ code }}</h5>
          <b-form-input
            placeholder="Confirm Code"
            class="mb-2"
            v-model="confirm"
            type="text"
          ></b-form-input>
          <b-button
            :disabled="!(code == confirm) || reason == ''"
            variant="dark"
            @click.stop="breaktheglass"
            >Break !</b-button
          >
        </b-col>
      </b-row>
    </b-card>
    <b-card v-show="breaked" no-body>
      <b-row class="my-1">
        <b-col sm="4">
          <h3>Service Vault Info</h3>
          <p>
            Service name: <strong>{{ info.name }}</strong>
          </p>
        </b-col>
        <b-col sm="8">
          <p><strong>Ip address: </strong>{{ vault.ipaddress }}</p>
          <p><strong>Key: </strong>{{ vault.key }}</p>
          <p><strong>Password: </strong>{{ vault.password }}</p>
          <p><strong>Port: </strong>{{ vault.port }}</p>
          <p><strong>Username: </strong>{{ vault.username }}</p>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["id"],
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  data() {
    return {
      breaked: false,
      vault: {
        ipaddress: "",
        key: "",
        password: "",
        port: "",
        username: "",
      },
      breakform: false,
      credential: "",
      code: 0,
      confirm: null,
      reason: "",
      info: {
        name: "",
      },
      locked: true,
    };
  },
  methods: {
    breaktheglass() {
      this.$http
        .post("/api/breaktheglass/" + this.id, this.reason)
        .then((response) => {
          this.vault = response.data;
          this.breaked = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    this.code = Math.floor(Math.random() * 10000);
    this.$http
      .get("/api/v1/service/id/" + this.id)
      .then((response) => {
        this.info = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    this.$http
      .get("/api/v1/service/id/" + this.id)
      .then((response) => {
        this.credential = response.data.credantial;
        console.log("this.credential", this.credential);
      })
      .catch((error) => {
        console.log(error);
      });

    this.locked = this.user.role === "Admin";
  },
};
</script>
