<template>
  <div
    id="background"
    :style="{ 'background-image': 'url(' + 'img/loginwall.jpg ' + ')' }"
  >
    <div class="app flex-row align-items-center">
      <div class="container">
        <b-row class="justify-content-center">
          <b-col lg="8" sm="8">
            <b-card v-if="!isLoadingStatus" no-body bg-variant="primary">
              <b-card-body class="p-4">
                <b-form v-if="error">
                  <h1 class="text-center">Password Vault Locked</h1>
                  <h6 class="text-center">
                    Password Vault is locked, you can try again!
                  </h6>
                  <b-button @click="tryAgain()" variant="success" block
                    >Try Again</b-button
                  >
                </b-form>
                <b-form v-else-if="sealed">
                  <h1 class="text-center">Password Vault Unlock</h1>
                  <h6 class="text-center">
                    For unlock must be entry {{ neededKeys }} valid keys in
                    {{ allKeys }} keys
                  </h6>

                  <div :key="index" v-for="(key, index) in unsealKeys">
                    <h6 class="text-left">Key {{ index }}: {{ key }}</h6>
                  </div>
                  <div :key="index" v-for="(item, index) in progressKeys">
                    <b-input-group class="mb-3">
                      <b-input-group-prepend>
                        <b-input-group-text
                          ><em class="fa fa-lock"></em
                        ></b-input-group-text>
                      </b-input-group-prepend>
                      <b-form-input
                        disabled
                        type="text"
                        placeholder="Key"
                        v-model="disabledpass"
                        autocomplete="nope"
                      />
                    </b-input-group>
                  </div>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend>
                      <b-input-group-text
                        ><em class="fa fa-lock"></em
                      ></b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input
                      type="text"
                      placeholder="Key"
                      v-model="sealKey"
                      autocomplete="nope"
                    />
                  </b-input-group>
                  <b-button
                    v-if="leftKeys == 1"
                    @click="unlock()"
                    variant="success"
                    block
                    ><strong>{{ leftKeys }} Keys left</strong> for unlock to
                    pvault <em class="fa fa-unlock"></em
                  ></b-button>
                  <b-button v-else @click="unlock()" variant="success" block
                    ><strong>{{ leftKeys }} Keys left </strong>
                    <em class="fa fa-unlock"></em
                  ></b-button>
                </b-form>
                <b-form v-else>
                  <h1 class="text-center">Password Vault Unlocked</h1>
                  <h6 class="text-center">
                    Password Vault is unlocked, you can login to PDA.
                  </h6>
                  <b-button @click="gotoLogin()" variant="success" block
                    >Go to Login</b-button
                  >
                </b-form>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Seal",
  data() {
    return {
      isLoadingStatus: true,
      sealed: true,
      error: false,
      sealKey: "",
      progressKeys: 0,
      neededKeys: 3,
      leftKeys: 3,
      allKeys: 5,
      disabledpass: "*****************",
      unsealKeys: [],
    };
  },
  methods: {
    tryAgain() {
      this.error = false;
      axios.post('/api/v1/vault/status').then((response) => {
        this.allKeys = response.data.n;
        this.neededKeys = response.data.t;
        this.leftKeys = response.data.t - response.data.progress;
        this.sealed = response.data.sealed;
      }).catch((error) => {
        console.log(error);

      });
    },
    gotoLogin() {
      this.$router.push(this.$route.query.redirect || "/login");
    },
    unlock() {
      let keydata = {
        key: this.sealKey,
      };
      axios
        .post("/api/v1/vault/unlock", keydata)
        .then((response) => {
          if (response.data.errors) {
            this.error = true;
          }

          if (this.progressKeys == response.data.progress) {
            this.$bvToast.toast(`Key is invalid!`, {
              title: "Key is invalid!",
              variant: "error",
              autoHideDelay: 5000,
            });
          }

          this.sealKey = "";
          this.leftKeys = response.data.t - response.data.progress;
          this.neededKeys = response.data.t;
          this.progressKeys = response.data.progress;
          this.sealed = response.data.sealed;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  beforeMount() {
    axios
      .get("/api/v1/vault/init")
      .then((response1) => {
        /* vault init edilmediyse init ekranina redirect et
         *    init edildiyse server'a reset atilmistir ve unseal edilmesi gerekiyordur
         */
        if (!response1.data)
          this.$router.push(this.$route.query.redirect || "/vaultinit");
        else {
          axios
            .post("/api/v1/vault/status")
            .then((response) => {
              this.allKeys = response.data.n;
              this.neededKeys = response.data.t;
              this.leftKeys = response.data.t - response.data.progress;
              this.progressKeys = response.data.progress;
              this.sealed = response.data.sealed;
              this.isLoadingStatus = false;
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style>
#background {
  background-size: cover;
  background-position: center center;
  position: fixed;
  height: 100%;
  width: 100%;
}
</style>
