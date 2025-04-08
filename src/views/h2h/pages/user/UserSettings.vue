<template>
  <div>
    <p-card :cardBody="true">
      <div v-if="errorStatus">
        <p-error
          :header="errorHeader"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
      </div>
      <div v-else>
        <h3>Tenant Info</h3>
        <b-form-group
          horizontal
          label="Company Name"
          label-for="Name"
          label-text-align="left"
          description=""
        >
          <em>{{ user.tenantEntity.companyName }}</em>
        </b-form-group>
        <b-form-group
          horizontal
          label="Country"
          label-for="Name"
          label-text-align="left"
          description=""
        >
          <em>{{ user.tenantEntity.country }}</em>
        </b-form-group>
        <br />
        <h3>User Settings</h3>

        <b-form-group
          id="serviceNameGroup1"
          horizontal
          label="Username"
          label-text-align="left"
        >
          <b-form-input
            i
            :state="
              !$v.user.username.$dirty ? null : !$v.user.username.$invalid
            "
            type="text"
            v-model.trim="$v.user.username.$model"
            placeholder=""
          ></b-form-input>
          <small class="text-muted">Must be 3-20 characters long.</small>
          <b-form-invalid-feedback>
            <div v-if="!$v.user.username.required">Field is required.</div>
            <div v-if="!$v.user.username.minLength">
              Username must have at least
              {{
                $v.user.username.$params.minLength.min - user.username.length
              }}
              letters.
            </div>
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          id="serviceNameGroup1"
          horizontal
          label="First Name"
          label-text-align="left"
        >
          <b-form-input
            i
            :state="
              !$v.user.first_name.$dirty ? null : !$v.user.first_name.$invalid
            "
            type="text"
            v-model.trim="$v.user.first_name.$model"
            placeholder=""
          ></b-form-input>
          <small class="text-muted">Please enter your First Name.</small>
          <b-form-invalid-feedback>
            <div v-if="!$v.user.first_name.required">Field is required.</div>
            <div v-if="!$v.user.first_name.minLength">
              First name must have at least
              {{
                $v.user.first_name.$params.minLength.min -
                user.first_name.length
              }}
              letters.
            </div>
            <div v-if="!$v.user.first_name.alpha">
              First name cannot contain numbers.
            </div>
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          id="serviceNameGroup1"
          horizontal
          label="Last Name"
          label-text-align="left"
        >
          <b-form-input
            i
            :state="
              !$v.user.last_name.$dirty ? null : !$v.user.last_name.$invalid
            "
            type="text"
            v-model.trim="$v.user.last_name.$model"
            placeholder=""
          ></b-form-input>
          <small class="text-muted">Please enter your Last Name.</small>
          <b-form-invalid-feedback>
            <div v-if="!$v.user.last_name.required">Field is required.</div>
            <div v-if="!$v.user.last_name.minLength">
              Last name must have at least
              {{
                $v.user.last_name.$params.minLength.min - user.last_name.length
              }}
              letters.
            </div>
            <div v-if="!$v.user.last_name.alpha">
              First name cannot contain numbers.
            </div>
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          id="serviceNameGroup1"
          horizontal
          label="E-mail Adress"
          label-text-align="left"
        >
          <b-form-input
            i
            :state="!$v.user.email.$dirty ? null : !$v.user.email.$invalid"
            type="text"
            v-model.trim="$v.user.email.$model"
            placeholder=""
          ></b-form-input>
          <small class="text-muted">Please enter your E-mail.</small>
          <b-form-invalid-feedback>
            <div v-if="!$v.user.email.required">Field is required.</div>
            <div v-if="!$v.user.email.email">
              Please enter valid e-mail adress.
            </div>
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          id="serviceNameGroup1"
          horizontal
          label="Phone"
          label-text-align="left"
        >
          <b-form-input
            i
            :state="!$v.user.phone.$dirty ? null : !$v.user.phone.$invalid"
            type="number"
            v-model.trim="$v.user.phone.$model"
            placeholder=""
          ></b-form-input>
          <small class="text-muted">Please enter your Phone number.</small>
          <b-form-invalid-feedback>
            <div v-if="!$v.user.phone.required">Field is required.</div>
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          horizontal
          label-for="Name"
          label-text-align="left"
          description=""
        >
          <b-button
            variant="success"
            :disabled="$v.user.$invalid"
            @click="update()"
            >Save</b-button
          >
        </b-form-group>

        <br />
        <h3>Password</h3>
        <b-form-group
          horizontal
          label="Current Password"
          label-for="Name"
          label-text-align="left"
          description=""
        >
          <b-form-input
            type="password"
            v-model="password.oldpass"
            placeholder=""
          ></b-form-input>
          <small class="text-muted">Please enter your Current Password .</small>
        </b-form-group>
        <b-form-group
          horizontal
          label="New Password"
          label-for="Name"
          label-text-align="left"
          description=""
        >
          <b-form-input
            type="password"
            v-model="password.newpass"
            placeholder=""
          ></b-form-input>
          <small class="text-muted">Please enter your New Password .</small>
        </b-form-group>
        <b-form-group
          horizontal
          label="New Password Again"
          label-for="Name"
          label-text-align="left"
          description=""
        >
          <b-form-input
            type="password"
            v-model="password.newagain"
            placeholder=""
          ></b-form-input>
          <small class="text-muted"
            >Please enter your New Password again .</small
          >
        </b-form-group>
        <b-form-group
          horizontal
          label-for="Name"
          label-text-align="left"
          description=""
        >
          <b-button variant="success" @click="changePassword()"
            >Change Password</b-button
          >
        </b-form-group>

        <br />
      </div>
    </p-card>
  </div>
</template>
<script>
import {
  alpha,
  numeric,
  email,
  required,
  minLength,
} from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      user: {
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        tenantEntity: {
          companyName: "",
          country: "",
        },
      },
      tenant: [],
      password: {
        oldpass: "",
        newpass: "",
        newagain: "",
      },
    };
  },
  mixins: [validationMixin],
  validations: {
    user: {
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
  methods: {
    update() {
      this.$http
        .post("/api/edittenantuser", this.user)
        .then((response) => {
          if (response.status == 200) {
            this.$bvToast.toast(`Updated Profile!`, {
              title: "Updated Profile!",
              variant: "success",
              autoHideDelay: 5000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Update operation has error!";
        });
    },
    changePassword() {
      if (this.password.newpass == this.password.newagain) {
        this.$http
          .post("/api/changepassword", this.password)
          .then((response) => {
            if (response.status == 200) {
              this.$bvToast.toast(`Password Changed Succesfully!`, {
                title: "Password Changed Succesfully!",
                variant: "success",
                autoHideDelay: 5000,
              });
            }
          })
          .catch((error) => {
            console.log(error);
            if (error.status == 500) {
              this.$bvToast.toast(`Password Dont Changed!`, {
                title: "Password Dont Changed!",
                variant: "error",
                autoHideDelay: 5000,
              });
            }
          });
      } else {
        this.$bvToast.toast(`Passwords doesnt match!`, {
          title: "Passwords doesnt match!",
          variant: "error",
          autoHideDelay: 5000,
        });
      }
    },
  },
  created() {
    this.$http
      .get("/api/v1/user/who")
      .then((response) => {
        this.user = response.data;
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
