<template>
  <div
    id="background"
    :style="{ 'background-image': 'url(' + 'img/loginwall.jpg ' + ')' }"
    style="overflow: auto"
  >
    <div class="app flex-row align-items-center">
      <div class="container">
        <b-row class="justify-content-center">
          <b-col lg="10" sm="10">
            <b-card no-body bg-variant="danger">
              <b-card-body class="p-2">
                <div v-if="!isInit">
                  <h1 style="text-align: center">Warning</h1>
                  <br />
                  <h5>
                    In order for Vault to be created, a certain number of keys
                    must be created (first input). For Vault to be unsealed, a
                    certain threshold value must be determined. If the key is
                    entered as many as this threshold value, the vault's seal
                    will be broken, so do not give these keys to a single
                    person.
                  </h5>
                  <br /><br />

                  <b-input-group v-if="!isInit" class="mb-3">
                    <b-input-group-prepend>
                      <b-input-group-text
                        ><em class="fa fa-lock"></em
                      ></b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input
                      type="text"
                      placeholder="Total Secret"
                      v-model="secretShares"
                      autocomplete="nope"
                    />
                  </b-input-group>

                  <b-input-group v-if="!isInit" class="mb-3">
                    <b-input-group-prepend>
                      <b-input-group-text
                        ><em class="fa fa-lock"></em
                      ></b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input
                      type="text"
                      placeholder="Number of Secret to Unlock"
                      v-model="secretThreshold"
                      autocomplete="nope"
                    />
                  </b-input-group>

                  <b-button @click="initVault()" variant="success" block
                    >Init Vault</b-button
                  >
                </div>

                <div v-if="isInit">
                  <div style="padding-left: 115px">
                    <td class="icon">
                      <em
                        class="fa fa-exclamation-triangle warning"
                        style="font-size: 150px"
                      ></em>
                    </td>
                  </div>
                  <br /><br />
                  <h2 style="text-align: center">DON'T FORGET THESE KEYS</h2>
                  <br />
                  <h4>
                    For the security of your secrets, do not give these keys to
                    the same person.
                  </h4>
                  <br /><br />
                  <br /><br /><br />
                  <div>
                    <b-row class="justify-content-center">
                      <b-col lg="1" sm="1" class="mb-0">
                        <span class="keyText" style="font-size: 15px"
                          >Root:
                        </span>
                        <br /><br />
                      </b-col>
                      <b-col lg="8" sm="8" class="mb-0">
                        <span class="key" style="font-size: 15px">{{
                          rootToken
                        }}</span>
                      </b-col>
                      <b-col
                        lg="2"
                        style="padding-bottom: 15px; bottom: 6px"
                        class="mb-0 pb-2"
                      >
                      <p-copy :copyItem="rootToken" />
                      </b-col>
                    </b-row>
                  </div>
                  <hr class="mt-0" />
                  <div :key="index" v-for="(key, index) in unsealKeys">
                    <b-row class="justify-content-center">
                      <b-col lg="1" sm="1">
                        <span class="keyText" style="font-size: 15px"
                          >Key {{ index }}:
                        </span>
                        <br /><br />
                      </b-col>
                      <b-col lg="8" sm="8">
                        <span class="key" style="font-size: 15px">{{
                          key
                        }}</span>
                      </b-col>
                      <b-col lg="2" style="padding-bottom: 15px; bottom: 6px">
                        <p-copy :copyItem="key" />
                      </b-col>
                    </b-row>
                  </div>
                  <br />
                  <br /><br /><br />

                  <b-input-group v-if="isInit" class="mb-3">
                    <b-input-group-prepend>
                      <b-input-group-text
                        ><em class="fa fa-lock"></em
                      ></b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input
                      type="text"
                      placeholder="Username"
                      v-model="username"
                      autocomplete="nope"
                    />
                  </b-input-group>

                  <b-input-group v-if="isInit" class="mb-3">
                    <b-input-group-prepend>
                      <b-input-group-text
                        ><em class="fa fa-lock"></em
                      ></b-input-group-text>
                    </b-input-group-prepend>
                    <b-form-input
                      type="password"
                      placeholder="Password"
                      v-model="password"
                      autocomplete="nope"
                    />
                  </b-input-group>

                  <b-button @click="addUser()" variant="success" block
                    >Add User and Go to Login</b-button
                  >
                </div>
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
  name: "VaultInit",
  data() {
    return {
      unsealKeys: [],
      rootToken: [],
      username: "",
      password: "",
      policy: "inventory",
      secretShares: "",
      secretThreshold: "",
      isInit: false,
      buttonColor: [],
      clickedButton: 99999,
    };
  },
  methods: {
    onCopy(key, index) {},
    changeColor(key, index) {
      this.clickedButton = index;
      for (let i = 0; i < this.buttonColor.length; i++) {
        this.buttonColor[i] = "danger";
      }
    },
    buttonColoring(key, index) {
      if (this.clickedButton == index) return "success";
      else return "";
    },
    addUser() {
      let authValue = {
        username: this.username,
        password: this.password,
        policy: this.policy,
        rootToken: this.rootToken,
      };

      axios
        .post("/api/v1/vault/auth-user", authValue)
        .then(() => {
          this.$router.push(this.$route.query.redirect || "/login");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    initVault() {
      let vaultInfo = {
        secret_shares: this.secretShares,
        secret_threshold: this.secretThreshold,
      };
      axios
        .post("/api/v1/vault/init", vaultInfo)
        .then((response) => {
          this.unsealKeys = response.data.keys;
          for (let i = 0; i < this.unsealKeys.length; i++)
            this.buttonColor.push("");
          this.rootToken = response.data.rootToken;
          this.isInit = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },
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

.icon {
  padding-left: 250px;
}

.warning {
  color: crimson;
}

.copyButton {
  width: 78px !important;
}
</style>