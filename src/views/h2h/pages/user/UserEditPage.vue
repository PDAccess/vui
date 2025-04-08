<template>
  <div class="animated fadeIn">
    <p-card>
      <p-loading v-if="loadingUserInfo" class="my-5" message="Loading..." />
      <p-error
        v-else-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <ul v-else class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Edit User</h3>
              <p>
                Edit users to use your modules and manage human resources
                effectively.
              </p>
            </b-col>
            <b-col sm="8">
              <b-row>
                <b-col>
                  <b-form-group
                    description="Add first name for User"
                    horizontal
                  >
                    <label for="inputLive">First Name</label>
                    <b-form-input
                      :state="!$v.formdata.first_name.$invalid"
                      placeholder
                      type="text"
                      v-model.trim="$v.formdata.first_name.$model"
                    ></b-form-input>
                    <b-form-invalid-feedback>
                      <div v-if="!$v.formdata.first_name.required">
                        First name is required.
                      </div>
                      <div v-if="!$v.formdata.first_name.minLength">
                        First name must have at least
                        {{
                          $v.formdata.first_name.$params.minLength.min -
                          formdata.first_name.length
                        }}
                        more letters.
                      </div>
                      <div v-if="!$v.formdata.first_name.alpha">
                        First name cannot contain numbers/special character.
                      </div>
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"></b-col>
            <b-col sm="8">
              <b-form-group description="Add last name for User" horizontal>
                <label for="inputLive">Last Name</label>
                <b-form-input
                  :state="!$v.formdata.last_name.$invalid"
                  placeholder
                  type="text"
                  v-model.trim="$v.formdata.last_name.$model"
                ></b-form-input>
                <b-form-invalid-feedback>
                  <div v-if="!$v.formdata.last_name.required">
                    Last name is required.
                  </div>
                  <div v-if="!$v.formdata.last_name.minLength">
                    Last name must have at least
                    {{
                      $v.formdata.last_name.$params.minLength.min -
                      formdata.last_name.length
                    }}
                    more letters.
                  </div>
                  <div v-if="!$v.formdata.last_name.alpha">
                    Last name cannot contain numbers/special character.
                  </div>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"></b-col>
            <b-col sm="8">
              <b-form-group description="Add Username for User" horizontal>
                <label for="inputLive">Username</label>
                <b-form-input
                  :state="!$v.formdata.username.$invalid"
                  placeholder
                  type="text"
                  v-model.trim="$v.formdata.username.$model"
                ></b-form-input>
                <b-form-invalid-feedback>
                  <div v-if="!$v.formdata.username.required">
                    Username is required.
                  </div>
                  <div v-if="!$v.formdata.username.minLength">
                    Username must have at least
                    {{
                      $v.formdata.username.$params.minLength.min -
                      formdata.username.length
                    }}
                    more letters.
                  </div>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"></b-col>
            <b-col sm="8">
              <b-form-group description="Add Phone for User" horizontal>
                <label for="inputLive">Phone</label>
                <PhoneInput
                  :phone.sync="phone"
                  :valid.sync="validPhone"
                  :clearNumber="clearNumber"
                />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"></b-col>
            <b-col sm="8">
              <b-form-group description="Add Email for User" horizontal>
                <label for="inputLive">Email</label>
                <b-form-input
                  :state="!$v.formdata.email.$invalid"
                  placeholder
                  type="email"
                  v-model.trim="$v.formdata.email.$model"
                ></b-form-input>
                <b-form-invalid-feedback>
                  <div v-if="!$v.formdata.email.required">
                    Email is required.
                  </div>
                  <div v-if="!$v.formdata.email.email">
                    Please enter valid email adress.
                  </div>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"> </b-col>
            <b-col sm="8">
              <b-row>
                <b-col>
                  <b-form-group label="IP Address">
                    <p-select
                      v-model="selectedIps"
                      tag-placeholder="Add IP Address"
                      placeholder="Add IP Address"
                      :options="ipOptions"
                      :multiple="true"
                      :taggable="true"
                      @tag="addIpTag"
                      :close-on-select="false"
                    ></p-select>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="my-1">
            <b-col sm="4"></b-col>
            <b-col sm="8">
              <b-row>
                <b-col>
                  <b-form-group label="Role">
                    <b-form-radio-group
                      :options="options"
                      button-variant="outline-primary"
                      buttons
                      id="btnradios2"
                      name="radioBtnOutline"
                      v-model.trim="$v.formdata.urole.$model"
                    />
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="External">
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
                </b-col>
              </b-row>
            </b-col>
          </b-row>
          <b-row class="my-4">
            <b-col cols="4"></b-col>
            <b-col cols="8" class="d-flex justify-content-end">
              <b-button
                :disabled="$v.formdata.$invalid || formdata.external"
                @click="updateUser($event.target)"
                variant="success"
                class="mr-2"
                >Update User</b-button
              >
              <b-button
                @click.stop="$router.push({ name: 'User list' })"
                variant="danger"
                >Back</b-button
              >
            </b-col>
          </b-row>
        </li>
      </ul>
    </p-card>
  </div>
</template>

<script>
//internet explorer için polyfill gerekli yoksa hata veriyor
import "babel-polyfill";
import PhoneInput from "@/views/h2h/components/PhoneInput.vue";
import {
  alpha,
  email,
  minLength,
  required,
  sameAs,
} from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

import { UserApi } from "@/generated/authws";

export default {
  props: ["id"],
  components: {
    PhoneInput,
  },
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      oldUserRole: "",
      selectedIps: [],
      ipOptions: [],
      loadingUserInfoServices: true,
      selectedServices: [],
      loadingUserInfo: true,
      externalSwitch: false,
      services: [],
      multivalue: [],
      companies: [],
      selected: "User",
      phone: {
        number: "",
        required: false,
        invalid: false,
        country: undefined,
        selected: true,
      },
      options: [
        {
          text: "User",
          value: "User",
        },
        {
          text: "Admin",
          value: "Admin",
        },
        {
          text: "System",
          value: "System",
        },
      ],
      items: [],
      userName: "",
      urole: "",
      usrname: "",
      mail: "",
      Id: "",
      modalid: "",
      formdata: {
        first_name: "",
        last_name: "",
        validPhone: true,
        email: "",
        tenantId: "",
        urole: "",
        username: "",
        external: false,
      },
      validPhone: true,
      clearNumber: false,
    };
  },
  mixins: [validationMixin],
  validations: {
    formdata: {
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
      validPhone: {
        sameAs: sameAs(function () {
          return true;
        }),
      },
      email: {
        required,
        email,
      },
      urole: {
        required,
      },
      username: {
        required,
        minLength: minLength(3),
      },
    },
  },
  watch: {
    validPhone: function (value) {
      this.formdata.validPhone = value;
    },
  },
  methods: {
    addIpTag(newTag) {
      this.selectedIps.push(newTag);
    },
    multiselectEvent(value) {
      this.formdata.tenantId = value != null ? value.tenantId : "";
    },
    customLabel({ name, serviceTypeLogo }) {
      return `${name} (${serviceTypeLogo})`;
    },
    addTag(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.value.push(tag);
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
    updateUser() {
      if (
        !(
          (this.oldUserRole === "Admin" || this.oldUserRole === "User") &&
          this.formdata.urole === "System"
        ) ||
        (this.oldUserRole === "System" && this.formdata.urole === "System")
      ) {

        let user = {
          userId: this.id,
          firstName: this.formdata.first_name,
          lastName: this.formdata.last_name,
          phone: this.phone.number,
          email: this.formdata.email,
          tenantid: this.formdata.tenantId,
          role: this.formdata.urole,
          username: this.formdata.username.toLowerCase(),
          external: this.externalSwitch,
          ipAddress: this.selectedIps,
        };
        new UserApi(this.$authHttpConfig, undefined, this.$http).updateUser(this.id, user)
          .then((response) => {
            this.$router.push({ name: "User list" });
          })
          .catch((error) => {
            console.log(error);
            this.errorStatus = true;
            this.errorResponse = error;
            this.errorHeader = "Update operation has error!";
          });
      } else {
        this.$bvToast.toast(
          `You cannot convert a user with User and Administrator roles to System role!`,
          {
            title: "User Settings Notification",
            variant: "success",
            autoHideDelay: 5000,
          }
        );
      }
    },
  },
  created() {
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

    new UserApi(this.$authHttpConfig, undefined, this.$http).getUserById(this.id)
      .then((response) => {
        let item = response.data;

        this.externalSwitch = item.external;
        this.formdata.blocked = item.blocked;
        this.formdata.external = item.external;
        this.serviceUserId = item.userId;
        this.formdata.username = item.username;
        this.formdata.email = item.email;
        this.phone.number = item.phone;
        this.formdata.image = item.image;
        this.formdata.urole = item.role;
        this.formdata.first_name = item.firstName;
        this.formdata.last_name = item.lastName;
        this.formdata.created_at = item.createdAt;
        this.formdata.updated_at = item.updatedAt;
        this.formdata.tenantId = item.tenantId;
        this.multivalue.tenantId = item.tenantId;
        this.oldUserRole = item.urole;

        this.loadingUserInfo = false;
      })
      .catch((error) => {
        console.log(error);
        this.loadingUserInfo = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
    this.$http
      .get("/api/v1/user/ipAddresses/" + this.id)
      .then((response) => {
        this.selectedIps = response.data;
        this.ipOptions = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    // this.$http
    //   .get("/api/v1/service/all", {})
    //   .then((response) => {
    //     this.services = response.data;
    //     this.$http
    //       .get("/api/getservice/" + this.id)
    //       .then((response2) => {
    //         this.selectedServices = response2.data;
    //         this.loadingUserInfoServices = false;
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //         this.loadingUserInfoServices = false;
    //         this.errorStatus = true;
    //         this.errorResponse = error;
    //         this.errorHeader = "Something went wrong!";
    //       });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     this.errorStatus = true;
    //     this.errorResponse = error;
    //     this.errorHeader = "Something went wrong!";
    //   });
  },
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
  .fade-leave-to

    /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
