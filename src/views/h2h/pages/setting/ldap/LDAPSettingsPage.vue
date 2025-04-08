<template>
  <div class="animated fadeIn">
    <p-card>
      <div class="p-3">
        <b-row>
          <b-col lg="10">
            <h5>General Settings</h5>
          </b-col>
          <b-col lg="2">
            <b-button
              @click="changeTabStatus(!editTabStatus, false, false)"
              v-b-toggle.editLdapArea
              :variant="editTabStatus ? 'danger' : 'primary'"
              style="width: 100%"
              >{{ editTabStatus ? "Collapse" : "Expand" }}</b-button
            >
          </b-col>
        </b-row>
        <b-collapse
          id="editLdapArea"
          accordion="settings-accordion"
          role="tabpanel"
        >
          <hr />
          <p-card :cardBody="false">
            <div class="animated fadeIn">
              <b-row>
                <b-col sm="4">
                  <p>
                    You can manage your settings here by updating and editing
                    your LDAP server
                  </p>
                </b-col>
                <b-col sm="8">
                  <b-form-group
                    description="Edit Host for LDAP Server"
                    horizontal
                  >
                    <label for="inputLive">Host</label>
                    <b-form-input
                      :state="
                        !$v.formData.ldap_url.$dirty
                          ? null
                          : !$v.formData.ldap_url.$invalid
                      "
                      placeholder
                      type="text"
                      v-model.trim="$v.formData.ldap_url.$model"
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      <div v-if="!$v.formData.ldap_url.required">
                        LDAP Host is required.
                      </div>
                      <div v-if="!$v.formData.ldap_url.minLength">
                        LDAP Host must have at least
                        {{
                          $v.formData.ldap_url.$params.minLength.min -
                          formData.ldap_url.length
                        }}
                        more letters.
                      </div>
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="4"></b-col>
                <b-col sm="8">
                  <b-form-group
                    description="Edit Port for LDAP Server"
                    horizontal
                  >
                    <label for="inputLive">Port</label>
                    <b-form-input
                      :state="
                        !$v.formData.ldap_port.$dirty
                          ? null
                          : !$v.formData.ldap_port.$invalid
                      "
                      placeholder
                      type="number"
                      v-model.trim="$v.formData.ldap_port.$model"
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      <div v-if="!$v.formData.ldap_port.required">
                        LDAP Port is required.
                      </div>
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="4"></b-col>
                <b-col sm="8">
                  <b-form-group
                    description="Edit Base DN for LDAP Server"
                    horizontal
                  >
                    <label for="inputLive">Base DN</label>
                    <b-form-input
                      :state="
                        !$v.formData.base_dn.$dirty
                          ? null
                          : !$v.formData.base_dn.$invalid
                      "
                      placeholder
                      type="text"
                      v-model.trim="$v.formData.base_dn.$model"
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      <div v-if="!$v.formData.base_dn.required">
                        Base DN is required.
                      </div>
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="4"></b-col>
                <b-col sm="8">
                  <b-form-group
                    description="Edit Bind DN for LDAP Server"
                    horizontal
                  >
                    <label for="inputLive">Bind DN</label>
                    <b-form-input
                      :state="
                        !$v.formData.bind_dn.$dirty
                          ? null
                          : !$v.formData.bind_dn.$invalid
                      "
                      placeholder
                      type="text"
                      v-model.trim="$v.formData.bind_dn.$model"
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      <div v-if="!$v.formData.bind_dn.required">
                        Bind DN is required.
                      </div>
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="4"></b-col>
                <b-col sm="8">
                  <b-form-group
                    description="Edit Bind Password for LDAP Server"
                    horizontal
                  >
                    <label for="inputLive">Bind Password</label>
                    <b-form-input
                      :state="
                        !$v.formData.bind_pass.$dirty
                          ? null
                          : !$v.formData.bind_pass.$invalid
                      "
                      placeholder
                      type="password"
                      v-model.trim="$v.formData.bind_pass.$model"
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      <div v-if="!$v.formData.bind_pass.required">
                        Bind Password is required.
                      </div>
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="4"></b-col>
                <b-col sm="8">
                  <b-form-group
                    description="Select connection type for LDAP Server"
                    horizontal
                  >
                    <label for="inputLive">Connection Type</label>
                    <p-select
                      :options="connectionTypes"
                      label="name"
                      placeholder="Select Connection Type"
                      track-by="value"
                      v-model="selectedConnectionType"
                    ></p-select>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row
                v-if="
                  selectedConnectionType != null &&
                  selectedConnectionType.value == 'start_tls'
                "
              >
                <b-col sm="4"> </b-col>
                <b-col sm="8">
                  <b-form-fieldset label="Insecure TLS">
                    <label class="switch switch-3d switch-primary">
                      <input
                        type="checkbox"
                        class="switch-input"
                        v-model="formData.insecure_tls"
                      />
                      <span class="switch-slider"></span>
                    </label>
                  </b-form-fieldset>
                </b-col>
              </b-row>
              <b-row class="mt-3">
                <b-col sm="4"></b-col>
                <b-col sm="8" class="d-flex justify-content-end">
                  <b-button
                    @click="testConnection"
                    variant="primary"
                    class="mr-2"
                    :disabled="
                      $v.formData.$invalid ||
                      connecting ||
                      selectedConnectionType == null
                    "
                    ><span v-if="!connecting">Test Connection</span>
                    <b-spinner v-else small></b-spinner>
                  </b-button>
                  <b-button
                    @click="saveSettings"
                    variant="success"
                    :disabled="
                      $v.formData.$invalid ||
                      saving ||
                      selectedConnectionType == null
                    "
                  >
                    <span v-if="!saving">Save Settings</span>
                    <b-spinner v-else small />
                  </b-button>
                </b-col>
              </b-row>
            </div>
          </p-card>
        </b-collapse>
      </div>
      <hr class="my-0" />
      <div class="p-3">
        <b-row>
          <b-col lg="10">
            <h5>Vault Settings</h5>
          </b-col>
          <b-col lg="2">
            <b-button
              @click="changeTabStatus(false, !vaultTabStatus, false)"
              v-b-toggle.editVaultArea
              :variant="vaultTabStatus ? 'danger' : 'primary'"
              style="width: 100%"
              >{{ vaultTabStatus ? "Collapse" : "Expand" }}</b-button
            >
          </b-col>
        </b-row>
        <b-collapse
          id="editVaultArea"
          accordion="settings-accordion"
          role="tabpanel"
        >
          <hr />
          <p-card :cardBody="false">
            <div class="animated fadeIn">
              <b-row>
                <b-col sm="4">
                  <p>
                    You can manage and configure LDAP Authentication
                    configurations for Vault here
                  </p>
                </b-col>
                <b-col sm="8">
                  <b-tabs pills card>
                    <b-tab title="User">
                      <b-form-group
                        description="Edit User DN for LDAP Vault"
                        horizontal
                      >
                        <label for="inputLive">User DN</label>
                        <b-form-input
                          :state="
                            !$v.vaultData.user_dn.$dirty
                              ? null
                              : !$v.vaultData.user_dn.$invalid
                          "
                          placeholder
                          type="text"
                          v-model.trim="$v.vaultData.user_dn.$model"
                        ></b-form-input>
                        <b-form-invalid-feedback>
                          <div v-if="!$v.vaultData.user_dn.required">
                            User DN is required.
                          </div>
                        </b-form-invalid-feedback>
                      </b-form-group>
                      <b-form-group
                        description="Edit Group DN for LDAP Vault"
                        horizontal
                      >
                        <label for="inputLive">Group DN</label>
                        <b-form-input
                          :state="
                            !$v.vaultData.group_dn.$dirty
                              ? null
                              : !$v.vaultData.group_dn.$invalid
                          "
                          placeholder
                          type="text"
                          v-model.trim="$v.vaultData.group_dn.$model"
                        ></b-form-input>
                        <b-form-invalid-feedback>
                          <div v-if="!$v.vaultData.group_dn.required">
                            Group DN is required.
                          </div>
                        </b-form-invalid-feedback>
                      </b-form-group>
                      <b-form-group
                        description="Edit Group filter for LDAP Vault"
                        horizontal
                      >
                        <label for="inputLive">Group Filter</label>
                        <b-form-input
                          :state="
                            !$v.vaultData.group_filter.$dirty
                              ? null
                              : !$v.vaultData.group_filter.$invalid
                          "
                          placeholder
                          type="text"
                          v-model.trim="$v.vaultData.group_filter.$model"
                        ></b-form-input>
                        <b-form-invalid-feedback>
                          <div v-if="!$v.vaultData.group_filter.required">
                            Group filter is required.
                          </div>
                        </b-form-invalid-feedback>
                      </b-form-group>
                      <b-form-group
                        description="Edit Group attributes for LDAP Vault"
                        horizontal
                      >
                        <label for="inputLive">Group Attribute</label>
                        <b-form-input
                          :state="
                            !$v.vaultData.group_attr.$dirty
                              ? null
                              : !$v.vaultData.group_attr.$invalid
                          "
                          placeholder
                          type="text"
                          v-model.trim="$v.vaultData.group_attr.$model"
                        ></b-form-input>
                        <b-form-invalid-feedback>
                          <div v-if="!$v.vaultData.group_attr.required">
                            Group attribute is required.
                          </div>
                        </b-form-invalid-feedback>
                      </b-form-group>
                      <b-form-group
                        description="Edit User attribute for LDAP Vault"
                        horizontal
                      >
                        <label for="inputLive">User Attribute</label>
                        <b-form-input
                          :state="
                            !$v.vaultData.user_attr.$dirty
                              ? null
                              : !$v.vaultData.user_attr.$invalid
                          "
                          placeholder
                          type="text"
                          v-model.trim="$v.vaultData.user_attr.$model"
                        ></b-form-input>
                        <b-form-invalid-feedback>
                          <div v-if="!$v.vaultData.user_attr.required">
                            User attribute is required.
                          </div>
                        </b-form-invalid-feedback>
                      </b-form-group>
                      <b-form-fieldset label="Discover DN">
                        <label class="switch switch-3d switch-primary">
                          <input
                            type="checkbox"
                            class="switch-input"
                            v-model="vaultData.discover_dn"
                          />
                          <span class="switch-slider"></span>
                        </label>
                      </b-form-fieldset>
                      <b-form-group class="d-flex justify-content-end">
                        <b-button
                          @click="saveVaultSettings"
                          variant="success"
                          class="mr-2"
                          :disabled="
                            $v.vaultData.$invalid || savingVaultSettings
                          "
                        >
                          <span v-if="!savingVaultSettings">Save Settings</span>
                          <b-spinner v-else small />
                        </b-button>
                        <b-button @click="clearVaultSettings" variant="danger"
                          >Clear</b-button
                        >
                      </b-form-group>
                    </b-tab>
                    <b-tab title="Admin">
                      <b-form-group
                        description="Edit User DN for LDAP Vault"
                        horizontal
                      >
                        <label for="inputLive">User DN</label>
                        <b-form-input
                          :state="
                            !$v.vaultAdminData.user_dn.$dirty
                              ? null
                              : !$v.vaultAdminData.user_dn.$invalid
                          "
                          placeholder
                          type="text"
                          v-model.trim="$v.vaultAdminData.user_dn.$model"
                        ></b-form-input>
                        <b-form-invalid-feedback>
                          <div v-if="!$v.vaultAdminData.user_dn.required">
                            User DN is required.
                          </div>
                        </b-form-invalid-feedback>
                      </b-form-group>
                      <b-form-group
                        description="Edit Group DN for LDAP Vault"
                        horizontal
                      >
                        <label for="inputLive">Group DN</label>
                        <b-form-input
                          :state="
                            !$v.vaultAdminData.group_dn.$dirty
                              ? null
                              : !$v.vaultAdminData.group_dn.$invalid
                          "
                          placeholder
                          type="text"
                          v-model.trim="$v.vaultAdminData.group_dn.$model"
                        ></b-form-input>
                        <b-form-invalid-feedback>
                          <div v-if="!$v.vaultAdminData.group_dn.required">
                            Group DN is required.
                          </div>
                        </b-form-invalid-feedback>
                      </b-form-group>
                      <b-form-group
                        description="Edit Group filter for LDAP Vault"
                        horizontal
                      >
                        <label for="inputLive">Group Filter</label>
                        <b-form-input
                          :state="
                            !$v.vaultAdminData.group_filter.$dirty
                              ? null
                              : !$v.vaultAdminData.group_filter.$invalid
                          "
                          placeholder
                          type="text"
                          v-model.trim="$v.vaultAdminData.group_filter.$model"
                        ></b-form-input>
                        <b-form-invalid-feedback>
                          <div v-if="!$v.vaultAdminData.group_filter.required">
                            Group filter is required.
                          </div>
                        </b-form-invalid-feedback>
                      </b-form-group>
                      <b-form-group
                        description="Edit Group attributes for LDAP Vault"
                        horizontal
                      >
                        <label for="inputLive">Group Attribute</label>
                        <b-form-input
                          :state="
                            !$v.vaultAdminData.group_attr.$dirty
                              ? null
                              : !$v.vaultAdminData.group_attr.$invalid
                          "
                          placeholder
                          type="text"
                          v-model.trim="$v.vaultAdminData.group_attr.$model"
                        ></b-form-input>
                        <b-form-invalid-feedback>
                          <div v-if="!$v.vaultAdminData.group_attr.required">
                            Group attribute is required.
                          </div>
                        </b-form-invalid-feedback>
                      </b-form-group>
                      <b-form-group
                        description="Edit User attribute for LDAP Vault"
                        horizontal
                      >
                        <label for="inputLive">User Attribute</label>
                        <b-form-input
                          :state="
                            !$v.vaultAdminData.user_attr.$dirty
                              ? null
                              : !$v.vaultAdminData.user_attr.$invalid
                          "
                          placeholder
                          type="text"
                          v-model.trim="$v.vaultAdminData.user_attr.$model"
                        ></b-form-input>
                        <b-form-invalid-feedback>
                          <div v-if="!$v.vaultAdminData.user_attr.required">
                            User attribute is required.
                          </div>
                        </b-form-invalid-feedback>
                      </b-form-group>
                      <b-form-fieldset label="Discover DN">
                        <label class="switch switch-3d switch-primary">
                          <input
                            type="checkbox"
                            class="switch-input"
                            v-model="vaultAdminData.discover_dn"
                          />
                          <span class="switch-slider"></span>
                        </label>
                      </b-form-fieldset>
                      <b-form-group class="d-flex justify-content-end">
                        <b-button
                          @click="saveVaultAdminSettings"
                          variant="success"
                          class="mr-2"
                          :disabled="
                            $v.vaultAdminData.$invalid || savingVaultSettings
                          "
                        >
                          <span v-if="!savingVaultAdminSettings"
                            >Save Settings</span
                          >
                          <b-spinner v-else small />
                        </b-button>
                        <b-button
                          @click="clearVaultAdminSettings"
                          variant="danger"
                          >Clear</b-button
                        >
                      </b-form-group>
                    </b-tab>
                  </b-tabs>
                </b-col>
              </b-row>
            </div>
          </p-card>
        </b-collapse>
      </div>
      <hr class="mt-0" />
      <div class="p-3">
        <b-row>
          <b-col lg="10">
            <h5>Vault Authentication</h5>
          </b-col>
          <b-col lg="2">
            <b-button
              @click="changeTabStatus(false, false, !authTabStatus)"
              v-b-toggle.editAuthArea
              :variant="authTabStatus ? 'danger' : 'primary'"
              style="width: 100%"
              >{{ authTabStatus ? "Collapse" : "Expand" }}</b-button
            >
          </b-col>
        </b-row>
        <b-collapse
          id="editAuthArea"
          accordion="settings-accordion"
          role="tabpanel"
        >
          <hr />
          <p-card :cardBody="false">
            <div class="animated fadeIn">
              <b-row>
                <b-col sm="12">
                  <b-tabs pills card>
                    <b-tab title="User">
                      <b-tabs>
                        <b-tab title="Config">
                          <b-form-fieldset label="Status">
                            <label class="switch switch-3d switch-primary">
                              <input
                                type="checkbox"
                                class="switch-input"
                                v-model="vaultAuthStatus"
                              />
                              <span class="switch-slider"></span>
                            </label>
                          </b-form-fieldset>
                          <div class="d-flex justify-content-end">
                            <b-button
                              @click="saveAuthSettings"
                              variant="success"
                              class="mr-2"
                              :disabled="savingVaultAuthentication"
                            >
                              <span v-if="!savingVaultAuthentication"
                                >Save Settings</span
                              >
                              <b-spinner v-else small />
                            </b-button>
                            <b-button
                              @click="vaultAuthStatus = authStatus"
                              variant="danger"
                              >Clear</b-button
                            >
                          </div>
                        </b-tab>
                        <b-tab v-if="authStatus" title="Test">
                          <b-form-group
                            description="Enter your username"
                            horizontal
                          >
                            <label for="inputLive">Username</label>
                            <b-form-input
                              :state="
                                !$v.testData.username.$dirty
                                  ? null
                                  : !$v.testData.username.$invalid
                              "
                              placeholder
                              type="text"
                              v-model.trim="$v.testData.username.$model"
                            ></b-form-input>
                            <b-form-invalid-feedback>
                              <div v-if="!$v.testData.username.required">
                                Username is required.
                              </div>
                            </b-form-invalid-feedback>
                          </b-form-group>
                          <b-form-group
                            description="Enter your password"
                            horizontal
                          >
                            <label for="inputLive">Password</label>
                            <b-form-input
                              :state="
                                !$v.testData.password.$dirty
                                  ? null
                                  : !$v.testData.password.$invalid
                              "
                              placeholder
                              type="password"
                              v-model.trim="$v.testData.password.$model"
                            ></b-form-input>
                            <b-form-invalid-feedback>
                              <div v-if="!$v.testData.password.required">
                                Password is required.
                              </div>
                            </b-form-invalid-feedback>
                          </b-form-group>
                          <div class="d-flex justify-content-end">
                            <b-button
                              @click="testAuthConnection"
                              variant="success"
                              class="mr-2"
                              :disabled="
                                $v.testData.$invalid || testingVaultAuth
                              "
                            >
                              <span v-if="!testingVaultAuth"
                                >Test Connection</span
                              >
                              <b-spinner v-else small />
                            </b-button>
                            <b-button @click="clearTestAuth" variant="danger"
                              >Clear</b-button
                            >
                          </div>
                        </b-tab>
                      </b-tabs>
                    </b-tab>
                    <b-tab title="Admin">
                      <b-tabs>
                        <b-tab title="Config">
                          <b-form-fieldset label="Status">
                            <label class="switch switch-3d switch-primary">
                              <input
                                type="checkbox"
                                class="switch-input"
                                v-model="vaultAdminAuthStatus"
                              />
                              <span class="switch-slider"></span>
                            </label>
                          </b-form-fieldset>
                          <div class="d-flex justify-content-end">
                            <b-button
                              @click="saveAuthAdminSettings"
                              variant="success"
                              class="mr-2"
                              :disabled="savingVaultAdminAuthentication"
                            >
                              <span v-if="!savingVaultAdminAuthentication"
                                >Save Settings</span
                              >
                              <b-spinner v-else small />
                            </b-button>
                            <b-button
                              @click="vaultAdminAuthStatus = authAdminStatus"
                              variant="danger"
                              >Clear</b-button
                            >
                          </div>
                        </b-tab>
                        <b-tab v-if="authAdminStatus" title="Test">
                          <b-form-group
                            description="Enter your username"
                            horizontal
                          >
                            <label for="inputLive">Username</label>
                            <b-form-input
                              :state="
                                !$v.testAdminData.username.$dirty
                                  ? null
                                  : !$v.testAdminData.username.$invalid
                              "
                              placeholder
                              type="text"
                              v-model.trim="$v.testAdminData.username.$model"
                            ></b-form-input>
                            <b-form-invalid-feedback>
                              <div v-if="!$v.testAdminData.username.required">
                                Username is required.
                              </div>
                            </b-form-invalid-feedback>
                          </b-form-group>
                          <b-form-group
                            description="Enter your password"
                            horizontal
                          >
                            <label for="inputLive">Password</label>
                            <b-form-input
                              :state="
                                !$v.testAdminData.password.$dirty
                                  ? null
                                  : !$v.testAdminData.password.$invalid
                              "
                              placeholder
                              type="password"
                              v-model.trim="$v.testAdminData.password.$model"
                            ></b-form-input>
                            <b-form-invalid-feedback>
                              <div v-if="!$v.testAdminData.password.required">
                                Password is required.
                              </div>
                            </b-form-invalid-feedback>
                          </b-form-group>
                          <div class="d-flex justify-content-end">
                            <b-button
                              @click="testAuthAdminConnection"
                              variant="success"
                              class="mr-2"
                              :disabled="
                                $v.testAdminData.$invalid ||
                                testingVaultAdminAuth
                              "
                            >
                              <span v-if="!testingVaultAdminAuth"
                                >Test Connection</span
                              >
                              <b-spinner v-else small />
                            </b-button>
                            <b-button
                              @click="clearTestAdminAuth"
                              variant="danger"
                              >Clear</b-button
                            >
                          </div>
                        </b-tab>
                      </b-tabs>
                    </b-tab>
                  </b-tabs>
                </b-col>
              </b-row>
            </div>
          </p-card>
        </b-collapse>
      </div>
      <hr class="mt-0" />
    </p-card>
  </div>
</template>
<script>
import { minLength, required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  data() {
    return {
      connectionTypes: [
        {
          name: "No encryption",
          value: "no",
        },
        {
          name: "Use SSL encryption (ldaps://)",
          value: "ssl",
        },
        {
          name: "Use StartTLS extension",
          value: "start_tls",
        },
      ],
      selectedConnectionType: null,
      testingVaultAuth: false,
      testingVaultAdminAuth: false,
      vaultAuthStatus: false,
      vaultAdminAuthStatus: false,
      authStatus: false,
      authAdminStatus: false,
      savingVaultAuthentication: false,
      savingVaultAdminAuthentication: false,
      savingVaultSettings: false,
      savingVaultAdminSettings: false,
      saving: false,
      connecting: false,
      total: 0,
      minimum: 0,
      sealed: false,
      editTabStatus: false,
      vaultTabStatus: false,
      authTabStatus: false,
      testData: {
        username: "",
        password: "",
      },
      testAdminData: {
        username: "",
        password: "",
      },
      formData: {
        ldap_url: "",
        ldap_port: "",
        base_dn: "",
        bind_dn: "",
        bind_pass: "",
        ssl: false,
        insecure_tls: false,
        start_tls: false,
      },
      vaultData: {
        user_dn: "",
        group_dn: "",
        group_filter: "",
        group_attr: "",
        user_attr: "",
        discover_dn: false,
      },
      vaultAdminData: {
        user_dn: "",
        group_dn: "",
        group_filter: "",
        group_attr: "",
        user_attr: "",
        discover_dn: false,
      },
    };
  },
  mixins: [validationMixin],
  validations: {
    formData: {
      ldap_url: {
        required,
        minLength: minLength(3),
      },
      ldap_port: {
        required,
      },
      base_dn: {
        required,
      },
      bind_dn: {
        required,
      },
      bind_pass: {
        required,
      },
    },
    vaultData: {
      user_dn: {
        required,
      },
      group_dn: {
        required,
      },
      group_filter: {
        required,
      },
      group_attr: {
        required,
      },
      user_attr: {
        required,
      },
    },
    vaultAdminData: {
      user_dn: {
        required,
      },
      group_dn: {
        required,
      },
      group_filter: {
        required,
      },
      group_attr: {
        required,
      },
      user_attr: {
        required,
      },
    },
    testData: {
      username: {
        required,
      },
      password: {
        required,
      },
    },
    testAdminData: {
      username: {
        required,
      },
      password: {
        required,
      },
    },
  },
  methods: {
    clearTestAuth() {
      this.testData.username = "";
      this.testData.password = "";
    },
    clearTestAdminAuth() {
      this.testAdminData.username = "";
      this.testAdminData.password = "";
    },
    changeTabStatus(editTabStatus, vaultTabStatus, authTabStatus) {
      this.editTabStatus = editTabStatus;
      this.vaultTabStatus = vaultTabStatus;
      this.authTabStatus = authTabStatus;
    },
    clearVaultSettings() {
      this.vaultData.user_dn = "";
      this.vaultData.group_dn = "";
      this.vaultData.group_filter = "";
      this.vaultData.group_attr = "";
      this.vaultData.user_attr = "";
      this.vaultData.insecure_tls = false;
      this.vaultData.start_tls = false;
      this.vaultData.discover_dn = false;
    },
    clearVaultAdminSettings() {
      this.vaultAdminData.user_dn = "";
      this.vaultAdminData.group_dn = "";
      this.vaultAdminData.group_filter = "";
      this.vaultAdminData.group_attr = "";
      this.vaultAdminData.user_attr = "";
      this.vaultAdminData.insecure_tls = false;
      this.vaultAdminData.start_tls = false;
      this.vaultAdminData.discover_dn = false;
    },
    testConnection() {
      this.connecting = true;

      this.formData.ssl = this.selectedConnectionType.value == "ssl";
      this.formData.start_tls =
        this.selectedConnectionType.value == "start_tls";

      this.$http
        .post("/api/v1/ldap/check", this.formData)
        .then((response) => {
          if (response.status === 200) {
            this.$bvToast.toast(
              `Connection with LDAP server successfully established`,
              {
                title: "Connection Success",
                variant: "success",
                autoHideDelay: 5000,
              }
            );
          }
          this.connecting = false;
        })
        .catch((error) => {
          console.log(error);
          this.connecting = false;
          this.$bvToast.toast(
            `Connection with LDAP server could not be established`,
            {
              title: "Connection Failed",
              variant: "danger",
              autoHideDelay: 5000,
            }
          );
        });
    },
    testAuthConnection() {
      this.testingVaultAuth = true;
      let data = new FormData();
      data.append("username", this.testData.username);
      data.append("password", this.testData.password);
      this.$http
        .post("/api/v1/settings/ldap/vault/connection", data)
        .then((response) => {
          this.$bvToast.toast(`LDAP authentication is successful.`, {
            title: "Connection Success",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.testingVaultAuth = false;
        })
        .catch((error) => {
          console.log(error);
          this.$bvToast.toast(`LDAP authentication is fail`, {
            title: "Connection Failed",
            variant: "danger",
            autoHideDelay: 5000,
          });
          this.testingVaultAuth = false;
        });
    },
    testAuthAdminConnection() {
      this.testingVaultAdminAuth = true;
      let data = new FormData();
      data.append("username", this.testAdminData.username);
      data.append("password", this.testAdminData.password);
      this.$http
        .post("/api/v1/settings/ldap/vault/admin/connection", data)
        .then((response) => {
          this.$bvToast.toast(`LDAP authentication is successful.`, {
            title: "Connection Success",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.testingVaultAdminAuth = false;
        })
        .catch((error) => {
          console.log(error);
          this.$bvToast.toast(`LDAP authentication is fail`, {
            title: "Connection Failed",
            variant: "danger",
            autoHideDelay: 5000,
          });
          this.testingVaultAdminAuth = false;
        });
    },
    saveSettings() {
      this.saving = true;

      this.formData.ssl = this.selectedConnectionType.value == "ssl";
      this.formData.start_tls =
        this.selectedConnectionType.value == "start_tls";

      this.$http
        .post("/api/v1/settings/ldap/general", this.formData)
        .then((response) => {
          this.$bvToast.toast(`LDAP settings saved successfully`, {
            title: "Save Successfull",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.saving = false;
        })
        .catch((error) => {
          console.log(error);
          this.$bvToast.toast(`LDAP settings saved failed`, {
            title: "Save Failed",
            variant: "danger",
            autoHideDelay: 5000,
          });
          this.saving = false;
        });
    },
    saveVaultSettings() {
      this.savingVaultSettings = true;
      this.$http
        .post("/api/v1/settings/ldap/vault", this.vaultData)
        .then((response) => {
          this.$bvToast.toast(`LDAP Vault settings saved successfully`, {
            title: "Save Successfull",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.savingVaultSettings = false;
        })
        .catch((error) => {
          console.log(error);
          this.$bvToast.toast(`LDAP Vault settings saved failed`, {
            title: "Save Failed",
            variant: "danger",
            autoHideDelay: 5000,
          });
          this.savingVaultSettings = false;
        });
    },
    saveVaultAdminSettings() {
      this.savingVaultAdminSettings = true;
      this.$http
        .post("/api/v1/settings/ldap/vault/admin", this.vaultAdminData)
        .then((response) => {
          this.$bvToast.toast(`LDAP Vault settings saved successfully`, {
            title: "Save Successfull",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.savingVaultAdminSettings = false;
        })
        .catch((error) => {
          console.log(error);
          this.$bvToast.toast(`LDAP Vault settings saved failed`, {
            title: "Save Failed",
            variant: "danger",
            autoHideDelay: 5000,
          });
          this.savingVaultAdminSettings = false;
        });
    },
    saveAuthSettings() {
      this.savingVaultAuthentication = true;
      let status = this.vaultAuthStatus ? "enable" : "disable";
      this.$http
        .post("/api/v1/settings/ldap/vault/" + status)
        .then((response) => {
          this.$bvToast.toast(`LDAP Vault authentication ${status}`, {
            title: "Save Success",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.authStatus = this.vaultAuthStatus;
          this.savingVaultAuthentication = false;
        })
        .catch((error) => {
          console.log(error);
          this.$bvToast.toast(`LDAP Vault settings saved failed`, {
            title: "Save Failed",
            variant: "danger",
            autoHideDelay: 5000,
          });
          this.savingVaultAuthentication = false;
        });
    },
    saveAuthAdminSettings() {
      this.savingVaultAdminAuthentication = true;
      let status = this.vaultAdminAuthStatus ? "enable" : "disable";
      this.$http
        .post("/api/v1/settings/ldap/vault/admin/" + status)
        .then((response) => {
          this.$bvToast.toast(`LDAP Vault authentication ${status}`, {
            title: "Save Success",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.authAdminStatus = this.vaultAdminAuthStatus;
          this.savingVaultAdminAuthentication = false;
        })
        .catch((error) => {
          console.log(error);
          this.$bvToast.toast(`LDAP Vault settings saved failed`, {
            title: "Save Failed",
            variant: "danger",
            autoHideDelay: 5000,
          });
          this.savingVaultAdminAuthentication = false;
        });
    },
  },
  created() {
    this.$http
      .get("/api/v1/settings/ldap/general")
      .then((response) => {
        let data = response.data;
        console.log(data);

        if (response.status === 200 && data != null) {
          this.formData.ldap_url = data.ldap_url;
          this.formData.ldap_port = data.ldap_port;
          this.formData.base_dn = data.base_dn;
          this.formData.bind_dn = data.bind_dn;
          this.formData.bind_pass = data.bind_pass;
          this.formData.start_tls = data.start_tls;
          this.formData.insecure_tls = data.insecure_tls;
          let index = 0;
          if (data.ssl) {
            index = 1;
          } else if (data.start_tls) {
            index = 2;
          }

          this.selectedConnectionType = this.connectionTypes[index];
        }
      })
      .catch((error) => {
        console.log(error);
      });

    this.$http
      .get("/api/v1/settings/ldap/vault")
      .then((response) => {
        let data = response.data;
        if (response.status === 200 && data != null) {
          this.vaultData.user_dn = data.user_dn;
          this.vaultData.group_dn = data.group_dn;
          this.vaultData.group_filter = data.group_filter;
          this.vaultData.group_attr = data.group_attr;
          this.vaultData.user_attr = data.user_attr;
          this.vaultData.discover_dn = data.discover_dn;
        }
      })
      .catch((error) => {
        console.log(error);
      });

    this.$http
      .get("/api/v1/settings/ldap/vault/admin")
      .then((response) => {
        let data = response.data;
        if (response.status === 200 && data != null) {
          this.vaultAdminData.user_dn = data.user_dn;
          this.vaultAdminData.group_dn = data.group_dn;
          this.vaultAdminData.group_filter = data.group_filter;
          this.vaultAdminData.group_attr = data.group_attr;
          this.vaultAdminData.user_attr = data.user_attr;
          this.vaultAdminData.discover_dn = data.discover_dn;
        }
      })
      .catch((error) => {
        console.log(error);
      });

    this.$http
      .get("/api/v1/settings/ldap/vault/status")
      .then((response) => {
        this.authStatus = response.status === 200;
        this.vaultAuthStatus = this.authStatus;
        this.savingVaultAuthentication = false;
      })
      .catch((error) => {
        console.log(error);
        this.savingVaultAuthentication = false;
      });

    this.$http
      .get("/api/v1/settings/ldap/vault/admin/status")
      .then((response) => {
        this.authAdminStatus = response.status === 200;
        this.vaultAdminAuthStatus = this.authAdminStatus;
        this.savingVaultAdminAuthentication = false;
      })
      .catch((error) => {
        console.log(error);
        this.savingVaultAdminAuthentication = false;
      });
  },
};
</script>
