<template>
  <div class="animated fadeIn">
    <p-card>
      <p-modal @confirm="deleteUser()" message="Are you sure you want to delete your user?"></p-modal>
      <ul class="list-group list-group-flush">
 
        
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Delete account</h3>
              <p>
                To delete your user, you must do write the username
              </p>
            </b-col>
            <b-col sm="8">
              <b-form-group
                horizontal
                label-for="Name"
                label-text-align="left"
                description=""
              >
              <b-form-input v-model="deleteConfirmText"
                  
                ></b-form-input>
              </b-form-group>
              <b-form-group
                horizontal
                label-for="Name"
                label-text-align="left"
                description=""
              >
              <b-button :disabled="deleteControl"  v-b-modal.modal style="width: 100%"  variant="danger">
                <em class="fa fa-trash mr-2" />Delete account</b-button>
              </b-form-group>
            </b-col>
          </b-row>
        </li>
      </ul>
    </p-card>
  </div>
</template>

<script>
import Qrcode from "v-qrcode";
import { mapGetters } from "vuex";
import { email, required, numeric } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

import { UserApi } from '@/generated/authws';

export default {
  props: ["id"],
  components: {
    Qrcode,
  },
  data() {
    return {
      deleteConfirmText: "",
      userShells: ["/bin/sh", "/bin/bash", "/bin/ksh", "/usr/bin/pdax/sh", "/usr/bin/pdax/bash", "/usr/bin/pdax/ksh"],
      errorStatusUpdate: false,
      errorStatusEmail: false,
      errorResponse: "",
      username: "",
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
      loading: true,
      modal: {
        status: "",
        title: "",
        variant: "",
        cancelButtonVariant: "",
      },
    };
  },
  mixins: [validationMixin],
  validations: {
    user: {
      phone: {
        required,
        numeric,
      },
      email: {
        required,
        email,
      },
    },
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
    ...mapGetters({
      userStore: "auth/user",
      userToken: "auth/token",
    }),
    deleteControl() {
      return this.deleteConfirmText != this.userStore.username;
    },
  },
  methods: {
    
    deleteUser() {
      new UserApi(this.$authHttpConfig, undefined, this.$http).deleteUser(this.userStore.id).then(response =>{

      })
    },
    update() {
      let userupdate = {
        userId: this.user.userId,
        created_at: this.user.createdAt,
        email: this.user.email,
        username: this.user.username,
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        phone: this.user.phone,
        remember_token: this.user.remember_token,
        tenantid: this.user.tenantId,
        updated_at: this.user.updatedAt,
        urole: this.user.role,
        deleted_at: this.user.deletedAt,
        external: this.user.external,
        blocked: this.user.blocked,
      };
      this.$http
        .put("/api/v1/user/user", userupdate)
        .then((response) => {
          if (response.status == 200) {
            this.$bvToast.toast(`Profile is updated!`, {
              title: "User Settings Notification",
              variant: "success",
              autoHideDelay: 5000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorStatusUpdate = true;
          this.errorResponse = error;
        });
    },

    updateEmail() {
      this.$http
        .put("/api/v1/user/update/email", this.user.email)
        .then((response) => {
          if (response.status == 200) {
            this.$bvToast.toast(`Email is updated!`, {
              title: "User Settings Notification",
              variant: "success",
              autoHideDelay: 5000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
  },
  created() {
    this.loading = true;
    this.$http
      .get("/api/v1/user/who")
      .then((response) => {
        this.loading = false;
        this.username = response.data.username;
        this.user = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
      });
    this.sendToken += this.userToken;
    this.sendToken += "=";
    this.sendToken += this.userStore.username;
    this.qrText = this.sendToken;
  },
};
</script>
