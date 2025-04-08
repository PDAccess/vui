<template>
  <div class="animated fadeIn">
    <p-card v-if="user.role === 'Admin'">
      <p-error v-if="errorStatus" :header="errorHeader" :errorResponse="errorResponse" @reload="$router.go()" />
      <ul v-else class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="3">
              <b-row>
                <b-col md="12">
                  <h3>Create Service</h3>
                  <p>
                    You can creating PDAccess services, you can manage and group
                    your services via PDAccess.
                  </p>
                </b-col>
              </b-row>
            </b-col>
            <b-col sm="9">
              <b-col md="12">
                <b-row>
                  <b-col md="12">
                    <b-nav class="mb-2" justified pills>
                      <b-nav-item :active="active == 1" class="font-weight-bold">Service Definition</b-nav-item>
                      <b-nav-item :active="active == 2" class="font-weight-bold">
                        <em class="fa fa-key"></em> Vault Credientials
                      </b-nav-item>
                      <b-nav-item :active="active == 3" class="font-weight-bold">Save</b-nav-item>
                    </b-nav>
                  </b-col>
                </b-row>
              </b-col>
              <hr />
              <div v-if="active == 1">
                <b-form>
                  <b-row md="12">
                    <b-col md="6">
                      <b-row>
                        <b-col md="12">
                          <b-form-fieldset description horizontal id="serviceGroup1" label="Service Group"
                            label-for="servicegroup" label-text-align="left">
                            <b-row>
                              <b-col>
                                <p-select :options="groups" @input="mutliselectEvent" id="servicegroup"
                                  label="groupname" placeholder="Select Group" track-by="groupId"
                                  v-model="multivalue"></p-select>
                                <small class="form-text text-muted">Select group</small>
                              </b-col>
                            </b-row>
                          </b-form-fieldset>

                          <b-form-fieldset description horizontal id="serviceNameGroup1" label="Service Name"
                            label-for="servicename" label-text-align="left">
                            <b-row>
                              <b-col cols="12">
                                <b-form-input :state="!$v.formdata.name.$dirty
        ? null
        : !$v.formdata.name.$invalid
      " id="servicename" placeholder type="text"
                                  v-model.trim="$v.formdata.name.$model"></b-form-input>
                                <small class="form-text text-muted">Add your name for service</small>
                                <b-form-invalid-feedback>
                                  <div v-if="!$v.formdata.name.required">
                                    Field is required.
                                  </div>
                                  <div v-if="!$v.formdata.name.minLength">
                                    Service name must have at least
                                    {{
      $v.formdata.name.$params.minLength.min -
      formdata.name.length
    }}
                                    more letters.
                                  </div>
                                </b-form-invalid-feedback>
                              </b-col>
                            </b-row>
                          </b-form-fieldset>
                          <b-form-fieldset description="Add your description for service" horizontal
                            id="serviceNameGroup2" label="Description" label-for="description" label-text-align="left">
                            <b-form-input id="servicedescription" placeholder type="text"
                              v-model="formdata.description"></b-form-input>
                          </b-form-fieldset>

                          <b-form-fieldset description="Select coordinates in map" horizontal id="os-type"
                            label="Coordinates" label-for="os" label-text-align="left">
                            <label class="switch switch-3d switch-primary">
                              <input checked class="switch-input" type="checkbox" v-model="mapvisibile" />
                              <span class="switch-slider"></span>
                            </label>
                          </b-form-fieldset>
                          <b-row>
                            <b-col class="ml-auto" md="12" v-if="mapvisibile">
                              <div v-if="!formdata.mapx == ''">
                                <h6>
                                  X:{{ formdata.mapx }} Y:{{ formdata.mapy }}
                                </h6>
                              </div>
                              <div class="card mb-3" style="height: 15rem">
                                <mappage @marked="mapLocation($event)"></mappage>
                              </div>
                            </b-col>
                          </b-row>
                        </b-col>
                      </b-row>
                    </b-col>
                    <b-col md="6">
                      <b-row>
                        <b-col md="12">
                          <b-form-fieldset description="Choose a service type" horizontal id="service-type"
                            label="Service Type" label-for="service-type" label-text-align="left">
                            <b-form-radio-group :options="serviceMetaTypes" button-variant="outline-primary" buttons
                              class="mb-1" id="service_type_name" name="service-meta-type" size="md"
                              v-model="serviceSelected" />
                          </b-form-fieldset>
                        </b-col>
                      </b-row>
                      <b-row v-if="serviceSelected === 'D' || serviceSelected === 'T'
      ">
                        <b-col md="12">
                          <RadioSelection @val="$v.formdata.operatingSystemId.$model = $event"
                            :description="'Select an OP system'" :label="'Operating System'"
                            :values="selections.operatingSystems" :radioGroup="'radio-group-1'" :selectedValue="$v.formdata.operatingSystemId.$model.toString()
      " />
                          <hr />
                        </b-col>
                      </b-row>
                      <b-row v-if="serviceSelected === 'L'">
                        <b-col md="12">
                          <RadioSelection @val="$v.formdata.directoryType.$model = $event"
                            description="Select an Directory" label="Directory" :values="selections.directoryType"
                            :radioGroup="'radio-group-1'" :selectedValue="$v.formdata.directoryType.$model.toString()
      " />
                          <hr />
                        </b-col>
                      </b-row>
                      <b-row v-if="serviceSelected !== 'W' &&
      serviceSelected !== 'L' &&
      $v.formdata.operatingSystemId.$model !== ''
      ">
                        <b-col md="12">
                          <RadioSelection @val="$v.formdata.serviceTypeId.$model = $event"
                            :description="'Select service'" :label="'Service'" :values="selections.serviceDatabase"
                            :radioGroup="'radio-group-2'" :selectedValue="$v.formdata.serviceTypeId.$model.toString()
      " v-show="serviceSelected === 'D'" />

                          <RadioSelection @val="$v.formdata.serviceTypeId.$model = $event"
                            :description="'Select service'" :label="'Service'" :values="selections.serviceTerminal"
                            :radioGroup="'radio-group-2'" :selectedValue="$v.formdata.serviceTypeId.$model.toString()
      " v-show="serviceSelected === 'T'" />
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                  <b-tooltip placement="bottom" target="ubuntutip" title="Ubuntu"></b-tooltip>
                  <b-tooltip placement="bottom" target="redhattip" title="Red Hat"></b-tooltip>
                  <b-tooltip placement="bottom" target="debiantip" title="Debian"></b-tooltip>
                  <b-tooltip placement="bottom" target="centostip" title="CentOS"></b-tooltip>
                  <b-tooltip placement="bottom" target="windowstip" title="Windows"></b-tooltip>
                  <b-tooltip placement="bottom" target="unixtip" title="Unix"></b-tooltip>
                  <b-tooltip placement="bottom" target="linuxtip" title="Linux"></b-tooltip>
                  <b-tooltip placement="bottom" target="solaristip" title="Solaris"></b-tooltip>
                  <b-tooltip placement="bottom" target="ciscotip" title="Cisco"></b-tooltip>
                  <b-tooltip placement="bottom" target="postgretip" title="PostgreSQL"></b-tooltip>
                  <b-tooltip placement="bottom" target="mysqltip" title="MySQL"></b-tooltip>
                  <b-tooltip placement="bottom" target="oracletip" title="Oracle"></b-tooltip>
                  <b-tooltip placement="bottom" target="mssqltip" title="MsSQL"></b-tooltip>
                  <b-tooltip placement="bottom" target="sshtip" title="SSH"></b-tooltip>
                  <b-tooltip placement="bottom" target="telnettip" title="TELNET"></b-tooltip>
                  <b-tooltip placement="bottom" target="rdptip" title="RDP"></b-tooltip>
                  <b-tooltip placement="bottom" target="vnctip" title="VNC"></b-tooltip>
                  <b-tooltip placement="bottom" target="susetip" title="Suse"></b-tooltip>
                </b-form>
                <b-row>
                  <b-col class="ml-auto" cols="2">
                    <b-button :disabled="$v.formdata.$invalid ||
      (this.mapvisibile == true && formdata.mapx == '') ||
      !groupid
      " @click.stop="next" style="margin-top: 15px" variant="primary">Next</b-button>
                  </b-col>
                </b-row>
              </div>
              <div v-if="active == 2 || active == 3">
                <b-form>
                  <b-row>
                    <b-col md="12">
                      <b-row>
                        <b-col md="6">
                          <b-form-fieldset description="Inventory host name or ip address" horizontal id="ipGroup1"
                            label="Hostname/IP Address " label-for="ipAddress" label-text-align="left">
                            <b-form-input :state="!$v.vaultdata.ipaddress.$dirty
        ? null
        : !$v.vaultdata.ipaddress.$invalid
      " id="ipAddress" placeholder="hostname/ip address" type="text"
                              v-model.trim="$v.vaultdata.ipaddress.$model"></b-form-input>
                            <b-form-invalid-feedback>
                              <div v-if="!$v.vaultdata.ipaddress.required">
                                Field is required.
                              </div>
                            </b-form-invalid-feedback>
                          </b-form-fieldset>

                          <b-form-fieldset
                            description="We assume you use default port for this service but you can change it"
                            horizontal id="portGroup2" label="Port " label-for="port" label-text-align="left">
                            <b-form-input :state="!$v.vaultdata.port.$dirty
        ? null
        : !$v.vaultdata.port.$invalid
      " id="port" min="0" max="65535" placeholder="port" type="number"
                              v-model.trim="$v.vaultdata.port.$model"></b-form-input>
                            <b-form-invalid-feedback>
                              <div v-if="!$v.vaultdata.port.required">
                                Field is required.
                              </div>
                            </b-form-invalid-feedback>
                          </b-form-fieldset>

                          <template v-if="serviceSelected === 'L'">
                            <b-form-fieldset description="Add Base DN for Directory" horizontal id="baseDN"
                              label="Base DN" label-for="baseDNInput" label-text-align="left">
                              <b-form-input :state="!$v.vaultdata.baseDN.$dirty
        ? null
        : !$v.vaultdata.baseDN.$invalid
      " id="baseDNInput" placeholder="Base DN" type="text"
                                v-model.trim="$v.vaultdata.baseDN.$model"></b-form-input>
                              <b-form-invalid-feedback>
                                <div v-if="!$v.vaultdata.baseDN.required">
                                  Base DN Field is required.
                                </div>
                              </b-form-invalid-feedback>
                            </b-form-fieldset>
                            <b-form-fieldset description="Add Bind DN for Directory" horizontal id="bindDN"
                              label="Bind DN" label-for="bindDNInput" label-text-align="left">
                              <b-form-input :state="!$v.vaultdata.bindDN.$dirty
        ? null
        : !$v.vaultdata.bindDN.$invalid
      " id="bindDNInput" placeholder="Base DN" type="text"
                                v-model.trim="$v.vaultdata.bindDN.$model"></b-form-input>
                              <b-form-invalid-feedback>
                                <div v-if="!$v.vaultdata.bindDN.required">
                                  Bind DN Field is required.
                                </div>
                              </b-form-invalid-feedback>
                            </b-form-fieldset>
                            <b-form-group description="Select connection type for Directory" horizontal>
                              <label for="directoryConnectionType">Connection Type</label>
                              <p-select :options="connectionTypes" label="name" id="directoryConnectionType"
                                placeholder="Select Connection Type" track-by="value"
                                v-model="$v.vaultdata.connectionType.$model" />
                            </b-form-group>
                            <b-form-fieldset label="Insecure TLS" v-if="$v.vaultdata.connectionType.$model !== null &&
      $v.vaultdata.connectionType.$model.value ===
      'start_tls'
      ">
                              <label class="switch switch-3d switch-primary">
                                <input type="checkbox" class="switch-input" v-model="$v.vaultdata.insecureTLS.$model" />
                                <span class="switch-slider"></span>
                              </label>
                            </b-form-fieldset>
                          </template>

                          <b-form-fieldset v-if="serviceSelected === 'W'"
                            description="Please enter the path for the web application" horizontal id="portGroup2"
                            label="Path " label-for="path" label-text-align="left">
                            <b-form-input :state="!$v.vaultdata.path.$dirty
        ? null
        : !$v.vaultdata.path.$invalid
      " id="path" placeholder="path" type="text"
                              v-model.trim="$v.vaultdata.path.$model"></b-form-input>
                            <b-form-invalid-feedback>
                              <div v-if="!$v.vaultdata.path.required">
                                Path is required.
                              </div>
                            </b-form-invalid-feedback>
                          </b-form-fieldset>

                          <b-form-fieldset v-if="serviceSelected === 'D'" description="Database name" horizontal
                            id="databasename" label="Database Name " label-for="databasename" label-text-align="left">
                            <b-form-input id="databasename" placeholder="databasename" type="text"
                              v-model="vaultdata.dbname"></b-form-input>
                          </b-form-fieldset>
                        </b-col>
                        <b-col md="6">
                          <b-form-fieldset description="Create local accounts for Service" horizontal id="pass-type"
                            label="Local Accounts" label-for="service-type" label-text-align="left">
                          </b-form-fieldset>

                          <div class="mb-2">
                            <p-card :cardBody="false" v-if="!normalUserActivate">
                              <b-form-fieldset description="We will use username to access inventory." horizontal
                                id="usernameGroup" label="Username" label-for="username" label-text-align="left">
                                <b-form-input :state="!$v.credentialData.username.$dirty
        ? null
        : !$v.credentialData.username.$invalid
      " id="username" placeholder="username" type="text" v-model.trim="$v.credentialData.username.$model
      "></b-form-input>
                                <b-form-invalid-feedback>
                                  <div v-if="!$v.credentialData.username.required">
                                    Field is required.
                                  </div>
                                </b-form-invalid-feedback>
                              </b-form-fieldset>

                              <div v-show="formdata.serviceTypeId == 5">
                                <b-form-fieldset description="Choose a service type" horizontal id="pass-type"
                                  label="Authentication Type" label-for="service-type" label-text-align="left">
                                  <b-form-radio-group :options="passwordType" button-variant="outline-primary" buttons
                                    class="mb-1" id="passwordtypebutton" name="service-meta-type" size="md"
                                    v-model="selectedPassType" />
                                </b-form-fieldset>
                              </div>
                              <b-form-fieldset description="We will use password to access inventory for changing it"
                                horizontal id="passwordGroup" label="Password " label-for="password"
                                label-text-align="left" v-if="selectedPassType === 'P'">
                                <b-form-input :state="!$v.credentialData.username.$dirty
        ? null
        : !$v.credentialData.username.$invalid
      " :type="passType" placeholder="password" v-model.trim="$v.credentialData.password.$model
      "></b-form-input>
                                <b-form-checkbox :indeterminate.sync="indeterminate" unchecked-value="password"
                                  v-model="passType" value="text">Show Password</b-form-checkbox>
                                <b-form-invalid-feedback>
                                  <div v-if="!$v.credentialData.password.required">
                                    Field is required.
                                  </div>
                                </b-form-invalid-feedback>
                              </b-form-fieldset>

                              <b-form-fieldset horizontal id="passwordGroup2" label="Key" label-for="password"
                                label-text-align="left" v-if="selectedPassType === 'K'">
                                <b-form-textarea :max-rows="8" :rows="6" id="textarea1"
                                  v-model="$v.credentialData.key.$model"></b-form-textarea>
                                <b-form-invalid-feedback>
                                  <div v-if="!$v.credentialData.key.required">
                                    Field is required.
                                  </div>
                                </b-form-invalid-feedback>
                              </b-form-fieldset>

                              <b-form-fieldset
                                description="The private key must be in OpenSSH format, as would be generated by the OpenSSH ssh-keygen utility."
                                horizontal id="passwordGroup3" label="Passphrase" label-for="password"
                                label-text-align="left" v-if="selectedPassType === 'K'">
                                <b-form-input id="passphrase" type="text"
                                  v-model="credentialData.passphrase"></b-form-input>
                              </b-form-fieldset>
                              <b-row>
                                <b-col class="d-flex justify-content-end">
                                  <b-button @click="saveAdmin" :disabled="$v.credentialData.$invalid" variant="primary"
                                    class="mt-2">Save
                                    Admin</b-button>
                                </b-col>
                              </b-row>
                            </p-card>
                            <template v-if="normalUserActivate">
                              <b-button class="mb-1" :variant="vaultdata.connectionUser ==
        adminCredentials.username
        ? 'primary'
        : 'outline-primary'
      " @click="
      vaultdata.connectionUser =
      adminCredentials.username
      " style="width: 100%"><i class="fa fa-lock mr-1" aria-hidden="true"></i>
                                {{ adminCredentials.username }}</b-button>
                              <hr />
                              <b-button @click="
      vaultdata.connectionUser = credential.username
      " class="mb-1" :variant="vaultdata.connectionUser ==
        credential.username
        ? 'primary'
        : 'outline-primary'
      " style="width: 100%" v-for="credential in credentials" :key="credential.username">
                                {{ credential.username }}
                              </b-button>
                            </template>
                            <b-button v-if="normalUserActivate" v-b-toggle.collapse-1 variant="primary"
                              style="width: 100%"><i class="fa fa-plus-circle mr-1" aria-hidden="true"></i>
                              Add User</b-button>
                            <b-collapse id="collapse-1" class="mt-2">
                              <p-card :cardBody="false">
                                <b-form-fieldset description="We will use username to access inventory." horizontal
                                  id="usernameGroup" label="Username" label-for="username" label-text-align="left">
                                  <b-form-input :state="!$v.credentialData.username.$dirty
        ? null
        : !$v.credentialData.username.$invalid
      " id="username" placeholder="username" type="text" v-model.trim="$v.credentialData.username.$model
      "></b-form-input>
                                  <b-form-invalid-feedback>
                                    <div v-if="!$v.credentialData.username.required
      ">
                                      Field is required.
                                    </div>
                                  </b-form-invalid-feedback>
                                </b-form-fieldset>

                                <div v-show="formdata.serviceTypeId == 5">
                                  <b-form-fieldset description="Choose a service type" horizontal id="pass-type"
                                    label="Authentication Type" label-for="service-type" label-text-align="left">
                                    <b-form-radio-group :options="passwordType" button-variant="outline-primary" buttons
                                      class="mb-1" id="passwordtypebutton" name="service-meta-type" size="md"
                                      v-model="selectedPassType" />
                                  </b-form-fieldset>
                                </div>
                                <b-form-fieldset description="We will use password to access inventory for changing it"
                                  horizontal id="passwordGroup" label="Password " label-for="password"
                                  label-text-align="left" v-if="selectedPassType == 'P'">
                                  <b-form-input :state="!$v.credentialData.username.$dirty
        ? null
        : !$v.credentialData.username.$invalid
      " :type="passType" placeholder="password" v-model.trim="$v.credentialData.password.$model
      "></b-form-input>
                                  <b-form-checkbox :indeterminate.sync="indeterminate" unchecked-value="password"
                                    v-model="passType" value="text">Show Password</b-form-checkbox>
                                  <b-form-invalid-feedback>
                                    <div v-if="!$v.credentialData.password.required
      ">
                                      Field is required.
                                    </div>
                                  </b-form-invalid-feedback>
                                </b-form-fieldset>

                                <b-form-fieldset horizontal id="passwordGroup2" label="Key" label-for="password"
                                  label-text-align="left" v-if="selectedPassType == 'K'">
                                  <b-form-textarea :max-rows="8" :rows="6" id="textarea1"
                                    v-model="$v.credentialData.key.$model"></b-form-textarea>
                                  <b-form-invalid-feedback>
                                    <div v-if="!$v.credentialData.key.required">
                                      Field is required.
                                    </div>
                                  </b-form-invalid-feedback>
                                </b-form-fieldset>

                                <b-form-fieldset
                                  description="The private key must be in OpenSSH format, as would be generated by the OpenSSH ssh-keygen utility."
                                  horizontal id="passwordGroup3" label="Passphrase" label-for="password"
                                  label-text-align="left" v-if="selectedPassType == 'K'">
                                  <b-form-input id="passphrase" type="text"
                                    v-model="credentialData.passphrase"></b-form-input>
                                </b-form-fieldset>
                                <div class="d-flex justify-content-end">
                                  <b-button @click="addUser" class="mt-3" variant="primary"
                                    :disabled="$v.credentialData.$invalid">Add
                                    User</b-button>
                                </div>
                              </p-card>
                            </b-collapse>
                          </div>
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                </b-form>
                <b-row>
                  <b-col md="4">
                    <b-button @click.stop="back" variant="danger">Back</b-button>
                  </b-col>
                  <b-col md="3">
                    <span class="font-weight-bold">
                      Connection
                      <span v-html="connectionResult"></span>
                    </span>
                  </b-col>
                  <b-col class="ml-auto" cols="2">
                    <b-button :disabled="$v.vaultdata.$invalid" @click.stop="testConnection" variant="primary">
                      <em class="fa fa-exchange"></em> Test Connection
                    </b-button>
                  </b-col>
                </b-row>
              </div>
              <div class="mt-3" v-if="active == 3">
                <hr />
                <b-row>
                  <b-col md="12">
                    <b-row>
                      <b-col>
                        <h4>Service Creation</h4>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col>
                        <p>
                          This inventroy will be created with entered
                          incredientials.
                        </p>
                        <p>
                          The
                          <strong>Vault incredientials</strong>
                          can not be accessable.The passwords are automatically
                          changed.
                        </p>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col md="4">
                        <b-button @click.stop="saveInventory" style="margin-top: 12px" variant="primary">{{ buttonText
                          }}</b-button>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </div>
            </b-col>
          </b-row>
        </li>
      </ul>
    </p-card>
  </div>
</template>

<script>
import mappage from "@/views/h2h/components/mappage";
import { minLength, required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import RadioSelection from "@/views/h2h/components/RadioSelection";
import SelectionDatas from "@/views/h2h/util/radioSelectionsData";
import { mapGetters } from "vuex";

export default {
  components: {
    mappage,
    RadioSelection,
  },
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      normalUserActivate: false,
      credentials: [],
      adminCredentials: {},
      autoModeTypes: ["hour", "day", "week", "month", "year"],
      autoModeTime: 1,
      selectedAutoModeType: "day",
      groups: [],
      multivalue: {},
      mapvisibile: false,
      buttonText: "Next",
      active: 1,
      credentialTypes: [
        {
          text: "Auto",
          value: "auto",
        },
        {
          text: "Vault",
          value: "vault",
        },
        {
          text: "Transparent",
          value: "transparent",
        },
      ],
      selections: SelectionDatas,
      allServices: [],
      serviceOptions: [],
      serviceSelected: "",
      selectedPassType: "P",
      connectionTestParams: {
        serverName: "",
        port: 0,
      },
      serviceMetaTypes: [
        {
          text: "Terminal",
          value: "T",
        },
        {
          text: "Database",
          value: "D",
        },
        {
          text: "Webapp",
          value: "W",
        },
        {
          text: "Directory",
          value: "L",
        },
      ],
      passwordType: [
        {
          text: '<i class="fa fa-key fa-1x"></i> Password',
          value: "P",
        },
        {
          text: '<i class="fa fa-certificate fa-1x"></i> Key',
          value: "K",
        },
      ],
      serviceMetaType: "",
      formdata: {
        name: "",
        operatingSystemId: "",
        serviceTypeId: "",
        directoryType: "",
        who_create: null,
        description: "",
        mapx: "",
        mapy: "",
      },
      vaultdata: {
        ipaddress: "",
        port: "",
        path: "",
        username: "",
        password: "",
        key: "",
        passphrase: "",
        dbname: "",
        connectionUser: "",
        baseDN: "",
        bindDN: "",
        connectionType: "",
        insecureTLS: false,
      },
      credentialData: {
        username: "",
        password: "",
        key: "",
        passphrase: "",
      },
      groupid: "",
      connectionTest: false,
      connectionResult: " is not tested",
      passType: "password",
      indeterminate: true,
      nextStatus: true,
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
    };
  },
  mixins: [validationMixin],
  watch: {
    "$v.formdata.operatingSystemId.$model": (val) => {
      console.log("test", val);
    },
  },
  validations() {
    if (this.serviceSelected === "W") {
      return {
        formdata: {
          name: {
            required,
            minLength: minLength(3),
          },
        },
        vaultdata: {
          ipaddress: {
            required,
          },
          port: {
            required,
          },
          path: {
            required,
          },
        },
        credentialData: {
          username: {
            required,
          },
          password: {
            required,
          },
        },
      };
    } else if (this.serviceSelected === "L") {
      return {
        formdata: {
          name: {
            required,
            minLength: minLength(3),
          },
          directoryType: {
            required,
          },
        },
        vaultdata: {
          ipaddress: {
            required,
          },
          port: {
            required,
          },
          baseDN: {
            required,
          },
          bindDN: {
            required,
          },
          connectionType: {
            required,
          },
          insecureTLS: {
            required,
          },
        },
        credentialData: {
          username: {
            required,
          },
          password: {
            required,
          },
        },
      };
    } else if (this.selectedPassType === "P") {
      return {
        formdata: {
          name: {
            required,
            minLength: minLength(3),
          },
          operatingSystemId: {
            required,
          },
          serviceTypeId: {
            required,
          },
        },
        vaultdata: {
          ipaddress: {
            required,
          },
          port: {
            required,
          },
        },
        credentialData: {
          username: {
            required,
          },
          password: {
            required,
          },
        },
      };
    } else {
      return {
        formdata: {
          name: {
            required,
            minLength: minLength(3),
          },
          operatingSystemId: {
            required,
          },
          serviceTypeId: {
            required,
          },
        },
        vaultdata: {
          ipaddress: {
            required,
          },
          port: {
            required,
          },
        },
        credentialData: {
          username: {
            required,
          },
          key: {
            required,
          },
        },
      };
    }
  },
  computed: {
    services: function () {
      return (this.serviceOptions = this.allServices.filter((serviceItem) => {
        return serviceItem.service_type === this.serviceMetaType;
      }));
    },
    ...mapGetters({
      user: "auth/user",
    }),
  },
  methods: {
    chooseDirectory(val) {
      this.formdata.directoryType = val;
    },
    saveAdmin() {
      this.adminCredentials = {
        username: this.credentialData.username,
        password: this.credentialData.password,
        key: this.credentialData.key,
        passphrase: this.credentialData.passphrase,
      };

      this.vaultdata.connectionUser = this.adminCredentials.username;
      this.credentialData.username = "";
      this.credentialData.password = "";
      this.credentialData.key = "";
      this.credentialData.passphrase = "";

      this.normalUserActivate = true;
    },
    addUser() {
      this.credentials.push({
        username: this.credentialData.username,
        password: this.credentialData.password,
        key: this.credentialData.key,
        passphrase: this.credentialData.passphrase,
      });

      this.credentialData.username = "";
      this.credentialData.password = "";
      this.credentialData.key = "";
      this.credentialData.passphrase = "";
    },
    mutliselectEvent() {
      this.groupid = this.multivalue ? this.multivalue.groupId : null;
    },
    mapLocation(xy) {
      this.formdata.mapx = xy.x;
      this.formdata.mapy = xy.y;
    },
    testConnection() {
      this.connectionResult = '<i class="text-warning">testing ...</i>';
      this.connectionTestParams.serverName = this.vaultdata.ipaddress;
      this.connectionTestParams.port = this.vaultdata.port;
      this.$http
        .post("/api/v1/service/connect", this.connectionTestParams)
        .then((response) => {
          if (response.status === 200) {
            this.connectionTest = true;
            this.connectionResult = '<i class="text-success">Success !<i>';
          }
        })
        .catch((error) => {
          this.connectionTest = false;
          this.connectionResult = '<i class="text-danger">Failed !<i>';
          console.log(error);
        })
        .then(() => {
          if (this.nextStatus) {
            this.next();
          }
        });
    },
    back() {
      this.active = 1;
    },
    next() {

      if (this.active++ > 2) this.active = 1;

      if (this.active == 3) {

        this.nextStatus = false;
        this.buttonText = "Create Inventory";
      }
    },
    state() {
      return this.autoModeTime >= 1;
    },
    restartInventoryCreation() {
      this.formdata.name = "";
      this.formdata.operatingSystemId = "";
      this.formdata.serviceTypeId = "";
      this.vaultdata.macaddress = "";
      this.vaultdata.ipaddress = "";
      this.vaultdata.port = "";
      this.credentialData.username = "";
      this.credentialData.password = "";
      this.vaultdata.securitytext = "";
      this.vaultdata.dbname = "";
      this.buttonText = "Next";
      this.connectionResult = " is not tested";

      this.passType = "password";
      this.indeterminate = true;
      this.serviceMetaType = "";
    },
    saveInventory() {
      if (this.state()) {
        if (this.serviceSelected === "W") {
          this.formdata.serviceTypeId = "10";
          this.formdata.operatingSystemId = "10";
        } else if (this.serviceSelected === 'L') {
          this.formdata.serviceTypeId = "11";
          this.formdata.operatingSystemId = this.formdata.directoryType;
        }

        let o = {
          serviceEntity: this.formdata,
          ipaddress: this.vaultdata.ipaddress,
          port: this.vaultdata.port,
          dbname: this.vaultdata.dbname,
          path: this.vaultdata.path,
          vaults: this.credentials,
          groupid: this.groupid,
          connection_user: this.vaultdata.connectionUser,
          admin: this.adminCredentials,
        };

        this.$http
          .post("/api/v1/service/service", o)
          .then((response) => {
            if (response.status === 200) {
              this.$bvToast.toast(`Service is Created!`, {
                title: "Service Notification",
                variant: "success",
                autoHideDelay: 5000,
              });
              this.$router.push({
                name: "Services",
              });
              //this.restartInventoryCreation();
            }
          })
          .catch((error) => {
            console.log(error);
            if (error.response) {
              this.$bvToast.toast(`${error.response.data}`, {
                title: "Service Notification",
                variant: "danger",
                autoHideDelay: 5000,
              });
            }
          });
      } else {
        this.$bvToast.toast(`Please enter numbers greater than 0`, {
          title: "Service Notification",
          variant: "error",
          autoHideDelay: 5000,
        });
      }
    },
  },
  created() {
    this.formdata.who_create = this.user.userId;
    if (this.user.role == "Admin") {
      this.$http
        .get("/api/v1/group")
        .then((response2) => {
          this.groups = response2.data;
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    } else {
      this.$http
        .get("/api/v1/group/user/user/" + this.user.userId)
        .then((response3) => {
          this.groups = response3.data;
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    }

    this.$http
      .get("/api/v1/settings/vaultautosettings")
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].tag === "default_password_refreshing_type") {
            this.selectedAutoModeType = response.data[i].value;
          }
          if (response.data[i].tag === "default_password_refreshing") {
            this.autoModeTime = response.data[i].value;
          }
        }
        let seconds = this.autoModeTime;
        if (this.selectedAutoModeType === "hour") {
          this.autoModeTime = seconds / 3600;
        } else if (this.selectedAutoModeType === "day") {
          this.autoModeTime = seconds / 86400;
        } else if (this.selectedAutoModeType === "week") {
          this.autoModeTime = seconds / 604800;
        } else if (this.selectedAutoModeType === "month") {
          this.autoModeTime = seconds / 2629743;
        } else if (this.selectedAutoModeType === "year") {
          this.autoModeTime = seconds / 31556926;
        }
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
  },
};
</script>
<style>
.inventory-logo {
  width: 50px;
  height: 40px;
}

.serviceInputTag {
  width: 180px;
  font-weight: bold;
}
</style>
