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
                  <h1 style="text-align: center">Vault Error</h1>
                  <br />
                  <h5>
                    Vault Unreachable, Please check your Vault accesses to verify that Vault is active and you have accessed properly.
                  </h5>
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