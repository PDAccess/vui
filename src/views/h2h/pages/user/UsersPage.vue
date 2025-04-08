<template>
  <div class="animated fadeIn">
    <b-tabs card pills>
      <b-tab active title="Users">
        <b-row>
          <b-col :lg="tableColumn">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text"
                  ><em class="fa fa-search"></em
                ></span>
              </div>
              <input
                class="form-control"
                placeholder="Entry User info"
                type="text"
                v-model="filterInput"
              />
              <div class="input-group-append">
                <button
                  @click="filterInput = ''"
                  class="btn btn-outline-info"
                  type="button"
                >
                  Clear
                </button>
              </div>
            </div>
            <b-table
              :current-page="currentPage"
              :fields="fields"
              :filter="filter"
              :items="items"
              :per-page="perPage"
              :responsive="responsive"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              @filtered="onFiltered"
              hover
              show-empty
              small
            >
              <template v-slot:cell(username)="row">
                <b-button
                  @click.stop="userDetailPage(row.item)"
                  variant="link"
                  class="profile-button"
                >
                  <p-profile-avatar
                    :profileUsername="row.item.username"
                    :username="row.item.first_name + ' ' + row.item.last_name"
                    :size="30"
                    :imageWidth="'30px'"
                    :imageHeight="'auto'"
                  />
                </b-button>
              </template>
              <template v-slot:cell(actions)="row">
                <b-button-group size="sm">
                  <b-button
                    @click.stop="details(row.item, row.index, $event.target)"
                    type="info"
                    variant="outline-info"
                  >
                    Details
                  </b-button>
                </b-button-group>
              </template>
            </b-table>
          </b-col>
          <transition name="fade" v-on:after-leave="tableColumn = 12">
            <b-col lg="6" v-if="showDetailCard">
              <b-card header-tag="header" style="width: auto">
                <div slot="header">
                  <b-button @click="closeDetail" style="float: right"
                    ><em class="fa fa-remove"></em
                  ></b-button>
                  <p-profile-avatar
                    :profileUsername="userdata.username"
                    :username="userdata.first_name + ' ' + userdata.last_name"
                    :size="150"
                    :imageWidth="'150px'"
                    :imageHeight="'auto'"
                    style="margin-bottom: 15px"
                    :username-show="false"
                  />
                  <b-row align-h="between">
                    <b-col lg="6" sm="12">
                      <b-button-group>
                        <b-button
                          @click.stop="edits($event.target)"
                          variant="outline-primary"
                        >
                          Edit
                        </b-button>
                        <b-button
                          @click.stop="deleteButton($event.target)"
                          v-b-modal.modal
                          variant="outline-danger"
                        >
                          Delete
                        </b-button>
                        <b-button
                          @click.stop="blockUser(userdata.userId)"
                          v-if="userdata.blocked == null"
                          variant="outline-danger"
                        >
                          Block User
                        </b-button>
                        <b-button disabled v-else variant="danger">
                          User Blocked at:
                          {{ userdata.blocked | moment("calendar") }}
                        </b-button>
                      </b-button-group>
                    </b-col>
                    <b-col lg="6" sm="12">
                      <h4 class="text-right">
                        {{ userdata.first_name }} {{ userdata.last_name }}
                      </h4>
                    </b-col>
                  </b-row>
                </div>
                <p-modal
                  @confirm="deleteuser()"
                  :message="modalMessage"
                ></p-modal>
                <b-row style="margin-top: 15px">
                  <b-col>
                    <div class="form-group">
                      <label center for="name">First Name</label>
                      <input
                        class="form-control"
                        readonly
                        type="text"
                        v-model="userdata.first_name"
                      />
                    </div>
                    <div class="form-group">
                      <label center for="name">Username</label>
                      <input
                        class="form-control"
                        readonly
                        type="text"
                        v-model="userdata.username"
                      />
                    </div>
                    <div class="form-group">
                      <label center for="name">Phone</label>
                      <input
                        class="form-control"
                        readonly
                        type="text"
                        v-model="userdata.phone"
                      />
                    </div>
                    <div class="form-group">
                      <b-form-group label="Role">
                        <h5>
                          <b-badge pill variant="primary">{{
                            userdata.urole
                          }}</b-badge>
                        </h5>
                      </b-form-group>
                    </div>
                  </b-col>
                  <b-col>
                    <div class="form-group">
                      <label center for="name">Last Name</label>
                      <input
                        class="form-control"
                        readonly
                        type="text"
                        v-model="userdata.last_name"
                      />
                    </div>
                    <div class="form-group">
                      <label center for="name">Company</label>
                      <input
                        class="form-control"
                        readonly
                        type="text"
                        v-model="userdata.company"
                      />
                    </div>
                    <div class="form-group">
                      <label center for="name">Email</label>
                      <input
                        class="form-control"
                        readonly
                        type="email"
                        v-model="userdata.email"
                      />
                    </div>
                    <div class="form-group">
                      <b-form-group label="External User">
                        <h5>
                          <b-badge pill variant="info">{{
                            userdata.external
                          }}</b-badge>
                        </h5>
                      </b-form-group>
                    </div>
                  </b-col>
                </b-row>
                <div class="form-group">
                  <b-form-group label="Services">
                    <h5>
                      <b-badge
                        :variant="badgeVariant(item.service_type_id)"
                        pill
                        :key="index"
                        v-for="(item, index) in selectedServices"
                      >
                        {{ item.name }}
                      </b-badge>
                    </h5>
                  </b-form-group>
                </div>
              </b-card>
            </b-col>
            <b-col lg="6" v-if="showEditCard">
              <b-card header-tag="header" style="width: auto">
                <div slot="header">
                  <b-button @click="closeEdit" style="float: right"
                    ><em class="fa fa-remove"></em
                  ></b-button>
                  <p-profile-avatar
                    :profileUsername="userdata.username"
                    :username="userdata.first_name + ' ' + userdata.last_name"
                    :size="150"
                    :imageWidth="'150px'"
                    :imageHeight="'auto'"
                    style="margin-bottom: 15px"
                    :username-show="false"
                  />
                  <b-row align-h="between">
                    <b-col lg="6" sm="12">
                      <b-button-group>
                        <b-button
                          :disabled="$v.userdata.$invalid"
                          @click.stop="editusr($event.target)"
                          variant="outline-success"
                        >
                          Submit
                        </b-button>
                        <b-button
                          @click.stop="editCancel"
                          variant="outline-danger"
                        >
                          Cancel
                        </b-button>
                      </b-button-group>
                    </b-col>
                    <b-col lg="6" sm="12">
                      <h4 class="text-right">
                        {{ userdata.first_name }} {{ userdata.last_name }}
                      </h4>
                    </b-col>
                  </b-row>
                </div>
                <b-row>
                  <b-col>
                    <label for="inputLive">First Name</label>
                    <b-form-input
                      :state="!$v.userdata.first_name.$invalid"
                      placeholder=""
                      type="text"
                      v-model.trim="$v.userdata.first_name.$model"
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      <div v-if="!$v.userdata.first_name.required">
                        First name is required.
                      </div>
                      <div v-if="!$v.userdata.first_name.minLength">
                        First name must have at least
                        {{
                          $v.userdata.first_name.$params.minLength.min -
                          userdata.first_name.length
                        }}
                        letters.
                      </div>
                      <div v-if="!$v.userdata.first_name.alpha">
                        First name cannot contain numbers.
                      </div>
                    </b-form-invalid-feedback>
                    <label for="inputLive">Username</label>
                    <b-form-input
                      :state="!$v.userdata.username.$invalid"
                      placeholder=""
                      type="text"
                      v-model.trim="$v.userdata.username.$model"
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      <div v-if="!$v.userdata.username.required">
                        Username is required.
                      </div>
                      <div v-if="!$v.userdata.username.minLength">
                        Username must have at least
                        {{
                          $v.userdata.username.$params.minLength.min -
                          userdata.username.length
                        }}
                        letters.
                      </div>
                    </b-form-invalid-feedback>
                    <label for="inputLive">Phone</label>
                    <b-form-input
                      :state="!$v.userdata.phone.$invalid"
                      placeholder=""
                      type="number"
                      v-model.trim="$v.userdata.phone.$model"
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      <div v-if="!$v.userdata.phone.required">
                        Phone is required.
                      </div>
                      <div v-if="!$v.userdata.phone.numeric">.</div>
                    </b-form-invalid-feedback>
                    <b-form-group label="Role">
                      <b-form-radio-group
                        :options="options"
                        button-variant="outline-primary"
                        buttons
                        id="btnradios2"
                        name="radioBtnOutline"
                        v-model.trim="userdata.urole"
                      />
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <label for="inputLive">Last Name</label>
                    <b-form-input
                      :state="!$v.userdata.last_name.$invalid"
                      placeholder=""
                      type="text"
                      v-model.trim="$v.userdata.last_name.$model"
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      <div v-if="!$v.userdata.last_name.required">
                        Last name is required.
                      </div>
                      <div v-if="!$v.userdata.last_name.minLength">
                        Last name must have at least
                        {{
                          $v.userdata.last_name.$params.minLength.min -
                          userdata.last_name.length
                        }}
                        letters.
                      </div>
                      <div v-if="!$v.userdata.last_name.alpha">
                        Last name cannot contain numbers.
                      </div>
                    </b-form-invalid-feedback>
                    <div class="form-group">
                      <label center for="name">Company</label>
                      <p-select
                        :options="companies"
                        :placeholder="userdata.company"
                        @input="multiselectEditEvent"
                        label="companyName"
                        track-by="tenant_id"
                        v-model="selectedCompany"
                      ></p-select>
                    </div>
                    <label for="inputLive">Email</label>
                    <b-form-input
                      :state="!$v.userdata.email.$invalid"
                      placeholder=""
                      type="email"
                      v-model.trim="$v.userdata.email.$model"
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      <div v-if="!$v.userdata.email.required">
                        Email is required.
                      </div>
                      <div v-if="!$v.userdata.email.email">
                        Please enter valid email adress.
                      </div>
                    </b-form-invalid-feedback>
                    <div class="form-group">
                      <b-form-group label="External User">
                        <label class="switch switch-3d switch-primary">
                          <input
                            checked
                            class="switch-input"
                            type="checkbox"
                            v-model="externalSwitch"
                          />
                          <span class="switch-slider"></span>
                        </label>
                      </b-form-group>
                    </div>
                  </b-col>
                </b-row>
                <div class="form-group">
                  <label center for="name">Services</label>
                  <p-select
                    :custom-label="customLabel"
                    :multiple="true"
                    :options="services"
                    :show-labels="false"
                    :taggable="true"
                    @tag="addTag"
                    placeholder="Select Services"
                    track-by="inventory_id"
                    v-model="selectedServices"
                  >
                    <template slot="singleLabel" slot-scope="props"
                      ><span class="option__title">{{
                        props.option.name
                      }}</span></template
                    >
                    <template slot="option" slot-scope="props">
                      <div class="option__desc">
                        <span class="option__title">
                          {{ props.option.name }}
                          <span>
                            <b-badge
                              :variant="
                                badgeVariant(props.option.service_type_id)
                              "
                              pill
                              >{{ props.option.serviceTypeLogo }}</b-badge
                            >
                          </span>
                        </span>
                      </div>
                    </template>
                  </p-select>
                </div>
              </b-card>
            </b-col>
          </transition>
          <div class="row my-1" v-if="items.length > perPage">
            <div class="col-sm-6">
              <b-pagination
                :per-page="perPage"
                :total-rows="items.length"
                v-model="currentPage"
              />
            </div>
            <div class="col-md-4">
              <b-form-group :label-cols="3" horizontal label="Rows per page:">
                <b-form-select :options="pageOptions" v-model="perPage" />
              </b-form-group>
            </div>
            <div class="col-md-2 text-md-right">
              <b-button :disabled="!sortBy" @click="sortBy = null"
                >Clear Sort</b-button
              >
            </div>
          </div>
        </b-row>
      </b-tab>
      <b-tab title="Blocked Users">
        <b-table
          :current-page="currentPage"
          :fields="fields"
          :filter="filter"
          :items="blockedUsers"
          :per-page="perPage"
          :responsive="responsive"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @filtered="onFiltered"
          hover
          show-empty
          small
        >
          <template v-slot:cell(username)="row">
            <b-button
              @click.stop="userDetailPage(row.item)"
              variant="link"
              class="profile-button"
            >
              <p-profile-avatar
                :profileUsername="row.item.username"
                :username="row.item.first_name + ' ' + row.item.last_name"
                :size="30"
                :imageWidth="'30px'"
                :imageHeight="'auto'"
              />
            </b-button>
          </template>
          <template v-slot:cell(actions)="row">
            <div>
              <span style="margin-right: 10px">
                Blocked at: {{ row.item.blocked | moment("calendar") }}</span
              >
              <b-button
                @click.stop="unblockUser(row.item.userId)"
                variant="danger"
                >Unblock</b-button
              >
            </div>
          </template>
        </b-table>
      </b-tab>
      <b-tab title="Forget password">
        <b-table
          fixed
          :current-page="currentPage"
          :fields="forgetFields"
          :filter="filter"
          :items="forgetItems"
          :per-page="perPage"
          :responsive="responsive"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @filtered="onFiltered"
          hover
          show-empty
          small
        >
          <template v-slot:cell(username)="row">
            <b-button
              @click.stop="userDetailPage(row.item)"
              variant="link"
              class="profile-button"
            >
              <p-profile-avatar
                :profileUsername="row.item.userEntity.username"
                :username="
                  row.item.userEntity.first_name +
                  ' ' +
                  row.item.userEntity.last_name
                "
                :size="30"
                :imageWidth="'30px'"
                :imageHeight="'auto'"
              />
            </b-button>
          </template>
          <template v-slot:cell(requested_at)="row">
            <span class="text-info">{{
              row.item.requested_at | moment("calendar")
            }}</span>
          </template>
          <template v-slot:cell(actions)="row">
            <div>
              <b-button
                @click.stop="approveUser(row.item)"
                type="success"
                variant="outline-success"
                class="mr-1"
                >Approve</b-button
              >
              <b-button @click.stop="rejectUser(row.item)" variant="danger"
                >Reject</b-button
              >
            </div>
          </template>
        </b-table>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import "babel-polyfill";
//internet explorer için polyfill gerekli yoksa hata veriyor
import {
  alpha,
  email,
  minLength,
  numeric,
  required,
} from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  components: {},
  data() {
    return {
      blockedUsers: [],
      forgetItems: [],
      selectedCompany: [],
      externalSwitch: false,
      selectedServices: [],
      services: [],
      serviceUserId: "",
      multivalue: [],
      companies: [],
      detailCardServices: "",
      tableColumn: 12,
      showDetailCard: false,
      showCreateCard: false,
      showEditCard: false,
      selected: "User",
      options: [
        {
          text: "User",
          value: "User",
        },
        {
          text: "Admin",
          value: "Admin",
        },
      ],
      items: [],
      pageOptions: [
        {
          text: 10,
          value: 10,
        },
        {
          text: 15,
          value: 15,
        },
        {
          text: 25,
          value: 25,
        },
        {
          text: 50,
          value: 50,
        },
        {
          text: 100,
          value: 100,
        },
      ],
      fields: [
        { key: "username", sortable: true, label: "User" },
        { key: "first_name", sortable: true, label: "First Name" },
        { key: "last_name", sortable: true, label: "Last Name" },
        { key: "urole", sortable: true, label: "Role" },
        { key: "actions", label: "Actions" },
      ],
      forgetFields: [
        { key: "username", sortable: true, label: "User" },
        { key: "userEntity.first_name", sortable: true, label: "First Name" },
        { key: "userEntity.last_name", sortable: true, label: "Last Name" },
        { key: "userEntity.urole", sortable: true, label: "Role" },
        { key: "requested_at", sortable: true, label: "Requested At" },
        { key: "actions", label: "Actions" },
      ],
      userdata: {
        userId: "",
        username: "",
        first_name: "",
        last_name: "",
        image: "",
        phone: "",
        company: "",
        email: "",
        urole: "",
        created_at: "",
        updated_at: "",
        tenantid: "",
        external: false,
        blocked: "",
      },
      totalRows: 0,
      filterInput: null,
      currentPage: 1,
      perPage: 100,
      sortBy: null,
      sortDesc: false,
      userName: "",
      urole: "",
      mail: "",
      Id: "",
      modalid: "",
      modalname: "",

      modalMessage: "",
    };
  },
  mixins: [validationMixin],
  validations: {
    userdata: {
      first_name: {
        required,
        alpha,
        minLength: minLength(3),
      },
      last_name: {
        required,
        alpha,
        minLength: minLength(3),
      },
      phone: {
        required,
        numeric,
      },
      tenantid: {
        required,
      },
      email: {
        required,
        email,
      },
      username: {
        required,
        minLength: minLength(3),
      },
    },
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  watch: {
    totalRows: function () {
      return this.items.length;
    },
  },
  methods: {
    blockUser(id) {
      this.$http
        .post("/api/v1/user/block", id)
        .then((response) => {
          this.$bvToast.toast(`User Blocked!`, {
            title: "User Settings Notification",
            variant: "info",
            autoHideDelay: 5000,
          });
          this.$http
            .get("/api/v1/user")
            .then((response2) => {
              this.items = response2.data;
            })
            .catch((error) => {
              console.log(error);
              this.errorStatus = true;
              this.errorResponse = error;
              this.errorHeader = "Block operation has error!!";
            });

          this.$http
            .get("/api/v1/user/blocked", {})
            .then((response3) => {
              this.blockedUsers = response3.data;
            })
            .catch((error) => {
              this.errorStatus = true;
              this.errorResponse = error;
              this.errorHeader = "List operation has error!!";
            });
        })
        .catch((error) => {
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Block operation has error!!";
        });
    },
    unblockUser(id) {
      this.$http
        .post("/api/v1/user/unblock", id)
        .then((response) => {
          this.$bvToast.toast(`User Unblocked!`, {
            title: "User Settings Notification",
            variant: "info",
            autoHideDelay: 5000,
          });
          this.$http
            .get("/api/v1/user")
            .then((response2) => {
              this.items = response2.data;
            })
            .catch((error) => {
              console.log(error);
              this.errorStatus = true;
              this.errorResponse = error;
              this.errorHeader = "Unblock operation has error!!";
            });
          this.$http
            .get("/api/v1/user/blocked", {})
            .then((response3) => {
              this.blockedUsers = response3.data;
            })
            .catch((error) => {
              console.log(error);
              this.errorStatus = true;
              this.errorResponse = error;
              this.errorHeader = "List operation has error!!";
            });
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Unblock operation has error!!";
        });
    },
    userDetailPage(item) {
      this.$router.push({
        name: "User Detail",
        params: {
          id: item.userId,
        },
      });
    },
    multiselectEditEvent() {
      this.userdata.tenantid = this.selectedCompany.tenant_id;
    },
    customLabel({ name, serviceTypeLogo }) {
      return `${name} (${serviceTypeLogo})`;
    },
    badgeVariant(id) {
      let variant;
      switch (id) {
        case 1:
          variant = "primary";
          break;
        case 2:
          variant = "secondary";
          break;
        case 3:
          variant = "success";
          break;
        case 4:
          variant = "danger";
          break;
        case 5:
          variant = "warning";
          break;
        case 6:
          variant = "info";
          break;
        case 7:
          variant = "light";
          break;
        default:
          variant = "dark";
      }
      return variant;
    },
    servicesUpdate() {
      let datas = [];

      for (let i = 0; i < this.selectedServices.length; i++) {
        datas.push(this.selectedServices[i].inventory_id);
      }

      this.$http
        .put("/api/userservice/" + this.serviceUserId, datas)
        .then((response) => {
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Update operation has error!!";
        });
    },
    addTag(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.value.push(tag);
    },
    editusr() {
      this.showEditCard = false;
      this.servicesUpdate();

      this.userdata.external = this.externalSwitch;

      this.$http
        .post("/api/v1/user/user", this.userdata)
        .then((response) => {
          this.$bvToast.toast(`User Updated!`, {
            title: "User Updated!",
            variant: "success",
            autoHideDelay: 5000,
          });

          this.$http
            .get("/api/v1/user")
            .then((response3) => {
              this.items = response3.data;
            })
            .catch((error) => {
              console.log(error);
              this.errorStatus = true;
              this.errorResponse = error;
              this.errorHeader = "Update operation has error!!";
            });
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Update operation has error!!";
        });
    },
    deleteuser() {
      this.$http
        .delete("/api/v1/user/id/" + this.modalid)
        .then((response) => {
          this.$bvToast.toast(`User is deleted!`, {
            title: "User is deleted!",
            variant: "success",
            autoHideDelay: 5000,
          });

          this.$http
            .get("/api/v1/user")
            .then((response3) => {
              this.items = response3.data;
            })
            .catch((error) => {
              console.log(error);
              this.errorStatus = true;
              this.errorResponse = error;
              this.errorHeader = "Delete operation has error!!";
            });
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Delte operation has error!!";
        });
    },
    filter(data) {
      if (this.filterInput == null) {
        return true;
      } else {
        // TODO : convert lower or upper case this strings
        if (
          data.first_name.includes(this.filterInput) ||
          data.last_name.includes(this.filterInput)
        ) {
          // return true if first name or last name includes filter input which is entered by user.
          // return false if not.
          return true;
        }
      }
      return false;
    },
    details(item, index, button) {
      this.$http
        .get("/api/v1/service/" + item.userId)
        .then((response) => {
          this.selectedServices = response.data;
          this.detailCardServices = "";
          for (let i = 0; i < response.data.length; i++) {
            this.detailCardServices =
              this.detailCardServices + response.data[i].name + " ";
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });

      this.externalSwitch = item.external;

      this.userdata.blocked = item.blocked;
      this.userdata.external = item.external;
      this.userdata.userId = item.userId;
      this.serviceUserId = item.userId;
      this.userdata.username = item.username;
      this.userdata.email = item.email;
      this.userdata.phone = item.phone;
      this.userdata.image = item.image;
      this.userdata.company = item.tenantEntity.companyName;
      this.userdata.urole = item.urole;
      this.userdata.first_name = item.first_name;
      this.userdata.last_name = item.last_name;
      this.userdata.created_at = item.created_at;
      this.userdata.updated_at = item.updated_at;
      this.userdata.tenantid = item.tenantid;
      this.multivalue.tenant_id = item.tenantid;
      this.showDetailCard = true;
      this.showCreateCard = false;
      this.tableColumn = 6;
    },
    edits() {
      this.showDetailCard = false;
      this.showEditCard = true;
      this.tableColumn = 6;
    },
    createCard() {
      this.showCreateCard = true;
      this.showEditCard = false;
      this.showDetailCard = false;
      this.tableColumn = 6;
    },
    deleteButton(button) {
      this.modalid = this.userdata.userId;
      this.modalname = this.userdata.username;
      this.modalMessage =
        "Are you sure you want to delete the user with the name " +
        this.modalname +
        " ?";
    },
    closeDetail() {
      this.showDetailCard = false;
    },
    closeEdit() {
      this.showEditCard = false;
    },
    editCancel() {
      this.showEditCard = false;
      this.showDetailCard = true;
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    approveUser(item) {
      let formData = new FormData();
      formData.append("userid", item.userEntity.userId);

      this.$http
        .post("/api/v1/user/user/changepassword", formData)
        .then((response) => {
          if (response.status == 200) {
            this.forgetItems.pop(item);
            this.$bvToast.toast(`Password reset request has been confirmed.`, {
              title: "Reset Password Notification",
              variant: "info",
              autoHideDelay: 5000,
            });
          }
        })
        .catch((error) => {
          if (error.status == 500) {
            this.errorStatus = true;
            this.errorResponse = error;
            this.errorHeader = "Something went wrong!";
          } else if (error.status == 404) {
            this.$bvToast.toast(
              `No Records Found! 
                                         The user or user request may have been deleted.`,
              {
                title: "Reset Password Notification",
                variant: "danger",
                autoHideDelay: 5000,
              }
            );
          }
        });
    },
    rejectUser(item) {
      this.$http
        .delete(
          "/api/v1/user/user/rejectChangePassword/" + item.userEntity.userId
        )
        .then((response) => {
          if (response.status == 200) {
            this.forgetItems.pop(item);
            this.$bvToast.toast(`Password reset request reject successful.`, {
              title: "Reset Password Notification",
              variant: "info",
              autoHideDelay: 5000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.status == 500) {
            this.errorStatus = true;
            this.errorResponse = error;
            this.errorHeader = "Reject operation has error!!";
          } else if (error.status == 404) {
            this.$bvToast.toast(
              `No Records Found! 
                                         The user or user request may have been deleted.`,
              {
                title: "Reset Password Notification",
                variant: "danger",
                autoHideDelay: 5000,
              }
            );
          }
        });
    },
  },

  created() {
    this.$http
      .get("/api/v1/user/blocked", {})
      .then((response) => {
        this.blockedUsers = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    this.$http
      .get("/api/v1/tenant/all", {})
      .then((response) => {
        this.companies = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    this.$http
      .get("/api/v1/service/all", {})
      .then((response) => {
        this.services = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    this.$http
      .get("/api/v1/user", {})
      .then((response) => {
        this.items = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    //Get users for forget passwords
    this.$http
      .get("api/v1/user/getForgetPasswordUser")
      .then((response) => {
        this.forgetItems = response.data;
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
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
  .fade-leave-to

    /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.col-lg-6 {
  padding-right: 0px;
  padding-left: 0px;
}
</style>
