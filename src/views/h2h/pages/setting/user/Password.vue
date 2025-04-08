<template>
  <div class="animated fadeIn">
    <p-card>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h5>Change your password or recover your current one</h5>
              <p>
                After a successful password update, you will be redirected to
                the login page where you can log in with your new password.
              </p>
            </b-col>
            <b-col sm="8">
              <b-form-group
                description=""
                horizontal
                label="Current Password"
                label-for="Name"
                label-text-align="left"
              >
                <b-form-input
                  placeholder=""
                  type="password"
                  v-model="password.oldpass"
                ></b-form-input>
                <small class="text-muted"
                  >Please enter your Current Password .</small
                >
              </b-form-group>
              <b-form-group
                description=""
                horizontal
                label="New Password"
                label-for="Name"
                label-text-align="left"
              >
                <b-form-input
                  placeholder=""
                  type="password"
                  v-model="password.newpass"
                ></b-form-input>
                <small class="text-muted"
                  >Please enter your New Password .</small
                >
              </b-form-group>
              <b-form-group
                description=""
                horizontal
                label="New Password Again"
                label-for="Name"
                label-text-align="left"
              >
                <b-form-input
                  placeholder=""
                  type="password"
                  v-model="confirm"
                ></b-form-input>
                <small class="text-muted"
                  >Please enter your New Password again .</small
                >
              </b-form-group>
              <b-form-group
                description=""
                horizontal
                label-for="Name"
                label-text-align="left"
              >
                <b-button
                  :disabled="
                    confirm !== password.newpass ||
                    password.oldpass === '' ||
                    password.newpass === '' ||
                    password.newpass.length < 6
                  "
                  @click="changePassword()"
                  variant="success"
                  >Change Password</b-button
                >
              </b-form-group>
            </b-col>
          </b-row>
        </li>
      </ul>
    </p-card>
  </div>
</template>
<script>

import { UserApi } from '@/generated/authws';

export default {
  props: ["id"],
  components: {},
  data() {
    return {
      disabled: true,
      confirm: "",
      password: {
        oldpass: "",
        newpass: "",
      },
    };
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  methods: {
    changePassword() {
      let data = {
        currentPassword: this.password.oldpass,
        newPassword: this.password.newpass,
      };

      new UserApi(this.$authHttpConfig, undefined, this.$http).changePassword(data)
        .then((response) => {
          this.$bvToast.toast(`Password changed successfully!`, {
            title: "User Settings Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
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
    },
  },
  created() {},
};
</script>
