<template>
  <div class="animated fadeIn">
    <p-error
      v-if="errorStatus"
      :header="errorHeader"
      :errorResponse="errorResponse"
      @reload="$router.go()"
    />
    <p-card v-else>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col cols="12" sm="4">
              <h3>Public Avatar</h3>
              <p>
                You can change your avatar here or remove the current avatar to
                revert to gravatar.com
              </p>
            </b-col>
            <b-col cols="6" sm="2">
              <p-loading v-if="subLoading" class="my-5" message="Loading..." />
              <p-profile-avatar
                v-else
                :profile-username="user.name"
                :username="userData.firstName + ' ' + userData.lastName"
                :size="120"
                :imageWidth="'120px'"
                :imageHeight="'auto'"
                :username-show="false"
                :baseSrc="profileImageBaseSrc"
              />
            </b-col>
            <b-col cols="6" sm="6">
              <h5 class="prepend-top-0">Upload new avatar</h5>
              <div class="prepend-top-5 appendf-bottom-10">
                <b-form-file
                  ref="uploadFileButton"
                  v-show="false"
                  class="mt-3"
                  plain
                  v-model="uploadFile"
                  @change="onFileChanged"
                  accept="image/*"
                ></b-form-file>
                <b-button
                  @click.stop="$refs.uploadFileButton.$el.click()"
                  variant="success"
                  >Upload Image</b-button
                >
              </div>
              <div
                v-if="imageError == 'typeError'"
                class="form-text text-danger"
              >
                Please upload only image file<br />
                (Accepted file extensions: JPEG/PNG)
              </div>
              <div
                v-else-if="imageError == 'sizeError'"
                class="form-text text-danger"
              >
                Please enter a file smaller than the max file size<br />
                (Max size: 200KB)
              </div>
              <div v-else class="form-text text-muted">
                The maximum file size allowed is 200KB.
              </div>
              <hr />
              <button
                class="button btn btn-danger btn-inverted"
                v-b-modal.modal
              >
                Remove avatar
              </button>
              <p-modal
                @confirm="deleteImage()"
                message="Are you sure you want to delete your profile picture?"
              >
              </p-modal>
            </b-col>
          </b-row>
        </li>
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Main Settings</h3>
              <p>This information will appear on your profile.</p>
            </b-col>
            <b-col sm="8">
              <b-form-group
                horizontal
                id="serviceNameGroup1"
                label="Username"
                label-text-align="left"
              >
                <b-form-input
                  :state="
                    !$v.userData.username.$dirty ? null : !$v.userData.username.$invalid
                  "
                  disabled
                  placeholder=""
                  type="text"
                  v-model.trim="$v.userData.username.$model"
                ></b-form-input>
                <small class="text-muted">Must be 3-20 characters long.</small>
                <b-form-invalid-feedback>
                  <div v-if="!$v.userData.username.required">
                    Field is required.
                  </div>
                  <div v-if="!$v.userData.username.minLength">
                    Username must have at least
                    {{
                      $v.userData.username.$params.minLength.min -
                      userData.username.length
                    }}
                    letters.
                  </div>
                </b-form-invalid-feedback>
              </b-form-group>

              <b-form-group
                horizontal
                id="serviceNameGroup1"
                label="First Name"
                label-text-align="left"
              >
                <b-form-input
                  :state="
                    !$v.userData.firstName.$dirty
                      ? null
                      : !$v.userData.firstName.$invalid
                  "
                  i
                  placeholder=""
                  type="text"
                  v-model.trim="$v.userData.firstName.$model"
                ></b-form-input>
                <small class="text-muted">Please enter your First Name.</small>
                <b-form-invalid-feedback>
                  <div v-if="!$v.userData.firstName.required">
                    Field is required.
                  </div>
                  <div v-if="!$v.userData.firstName.minLength">
                    First name must have at least
                    {{
                      $v.userData.firstName.$params.minLength.min -
                      userData.firstName.length
                    }}
                    letters.
                  </div>
                  <div v-if="!$v.userData.firstName.alpha">
                    First name cannot contain numbers.
                  </div>
                </b-form-invalid-feedback>
              </b-form-group>

              <b-form-group
                horizontal
                id="serviceNameGroup1"
                label="Last Name"
                label-text-align="left"
              >
                <b-form-input
                  :state="
                    !$v.userData.lastName.$dirty
                      ? null
                      : !$v.userData.lastName.$invalid
                  "
                  i
                  placeholder=""
                  type="text"
                  v-model.trim="$v.userData.lastName.$model"
                ></b-form-input>
                <small class="text-muted">Please enter your Last Name.</small>
                <b-form-invalid-feedback>
                  <div v-if="!$v.userData.lastName.required">
                    Field is required.
                  </div>
                  <div v-if="!$v.userData.lastName.minLength">
                    Last name must have at least
                    {{
                      $v.userData.lastName.$params.minLength.min -
                      userData.lastName.length
                    }}
                    letters.
                  </div>
                  <div v-if="!$v.userData.lastName.alpha">
                    First name cannot contain numbers.
                  </div>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
        </li>
        <li  class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Contact Settings</h3>
              <p>Control emails linked to your account</p>
            </b-col>
            <b-col sm="8">
              <b-form-group
                horizontal
                label="Email"
                label-for="Name"
                label-text-align="top"
                description="Press enter your Email."
              >
                <b-form-input
                  type="text"
                  v-model="userData.email"
                  placeholder=""
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="serviceNameGroup1"
                horizontal
                label="Phone"
                label-text-align="left"
              >
                <b-form-input
                  i
                  :state="
                    !$v.userData.phone.$dirty ? null : !$v.userData.phone.$invalid
                  "
                  type="number"
                  v-model.trim="$v.userData.phone.$model"
                  placeholder=""
                ></b-form-input>
                <small class="text-muted"
                  >Please enter your Phone number.</small
                >
                <b-form-invalid-feedback>
                  <div v-if="!$v.userData.phone.required">Field is required.</div>
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
          </b-row>
        </li>
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Account Settings</h3>
              <p>
                This emoji and message will appear on your profile and
                throughout the interface.
              </p>
            </b-col>
            <b-col sm="8">
              <b-form-group horizontal
                label="User Shell"
                label-text-align="left" class="mt-3">
                <p-select
                  :options="userShells"
                  v-model="userData.shell"
                ></p-select>
              </b-form-group>
            </b-col>
          </b-row>
        </li>
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Notification Settings</h3>
              <p>
                This emoji and message will appear on your profile and
                throughout the interface.
              </p>
            </b-col>
            <b-col sm="8">
              <b-form-group
                    description="Set manage in mechanism"
                    label="Notification Status"
                  >
                    <label class="switch switch-3d switch-primary">
                      <input
                        class="switch-input"
                        type="checkbox"
                        v-model="userData.notification"
                      />
                      <span class="switch-slider"></span>
                    </label>
                  </b-form-group>

            </b-col>
          </b-row>
        </li>
        <li class="list-group-item">
          <b-row class="my-1">
            <b-col sm="4">
              <h3>Other Settings</h3>
              <p>
                This emoji and message will appear on your profile and
                throughout the interface.
              </p>
            </b-col>
            <b-col sm="8">
              <b-form-group horizontal
                label="Status"
                label-text-align="left">
                <b-input-group>
                <b-form-input
                  id="input-small"
                  type="text"
                  v-model="userData.status"
                ></b-form-input>
                <b-input-group-append>
                  <b-button
                    @click="emojiVisible = !emojiVisible"
                    variant="outline-primary"
                    >😁</b-button
                  >
                </b-input-group-append>
              </b-input-group>
              </b-form-group>

              <picker
                :data="data"
                @select="selectEmoji"
                set="apple"
                v-if="emojiVisible"
              />
            </b-col>
          </b-row>
        </li>
        
        <b-button
        :disabled="$v.userData.$invalid"
                  @click="update()"
                  variant="success"
                  style="width: 100%;"
                  >
                  <i class="fa fa-save mr-2" />
                  Save</b-button
                >
      </ul>
    </p-card>
  </div>
</template>
<script>
import { alpha, minLength, numeric, required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

import data from "emoji-mart-vue-fast/data/messenger.json";
import { EmojiIndex, Picker } from "emoji-mart-vue-fast";

import { mapGetters, mapActions } from "vuex";

let index = new EmojiIndex(data);

import { UserApi } from '@/generated/authws';

export default {
  props: ["id"],
  components: {
    Picker,
  },
  data() {
    return {
      userShells: ["/bin/sh", "/bin/bash", "/bin/ksh", "/usr/bin/pdax/sh", "/usr/bin/pdax/bash", "/usr/bin/pdax/ksh"],
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      sampleData: "Test successsss !",
      emojiVisible: false,
      data: index,
      sessions: [],
      sessionsfields: {
        ip_address: {
          label: "Ip",
          class: "text-center",
        },
        user_agent: {
          label: "User Agent",
          sortable: true,
          class: "text-center",
        },
        last_activity: {
          label: "Last Activity",
          sortable: true,
          class: "text-center",
        },
      },
      tenant: [],
      password: {
        oldpass: "",
        newpass: "",
        newagain: "",
      },
      profileImage: null,
      profileImageBaseSrc: "",
      subLoading: false,
      uploadFile: [],
      MAX_SIZE: 1024 * 200,
      imageError: "",
      userData: {},
    };
  },
  mixins: [validationMixin],
  validations: {
    userData: {
      firstName: {
        required,
        alpha,
        minLength: minLength(3),
      },
      lastName: {
        required,
        alpha,
        minLength: minLength(3),
      },
      phone: {
        required,
        numeric,
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
    ...mapGetters({
      cacheNumber: "util/cacheNumber",
      user: "auth/user",
    }),
  },
  methods: {
    ...mapActions({
      setCacheNumber: "util/setCacheNumber",
    }),
    selectEmoji(emoji) {
      this.userData.status = this.userData.status + emoji.native;
    },
    updateStatus(status) {
      this.$http
        .put("/api/v1/user/status", status)
        .then((response) => {
          this.$bvToast.toast(`Status is updated!`, {
            title: "User Settings Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateShell(shell) {
      this.$http
        .put("/api/v1/user/shell", shell)
        .then((response) => {
          this.$bvToast.toast(`Default shell is updated!`, {
            title: "User Settings Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    update() {
      new UserApi(this.$authHttpConfig, undefined, this.$http).updateUser(this.user.id, this.userData)
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
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Update operation has error!";
        });
    },
    onFileChanged(event) {
      this.imageError = false;
      this.profileImage = event.target.files[0];
      console.log("profile image", this.profileImage)
      const acceptedImageTypes = ["image/jpeg", "image/png"];

      if (this.profileImage) {
        if (!acceptedImageTypes.includes(this.profileImage.type)) {
          this.imageError = "typeError";
          this.uploadFile = [];
        } else if (this.profileImage.size > this.MAX_SIZE) {
          this.imageError = "sizeError";
          this.uploadFile = [];
        } else {
          this.subLoading = true;
          const formData = new FormData();
          formData.append("image", this.profileImage);
          new UserApi(this.$authHttpConfig, undefined, this.$http).updateAvatar(this.profileImage)
            .then((response) => {
              if (response.status == 200) {
                new UserApi(this.$authHttpConfig, undefined, this.$http).getAvatarById(this.user.id)
                .then((response) => {
                  this.profileImageBaseSrc = response.data;
                  this.subLoading = false;
                })
                .catch((error) => {
                  console.log(error);
                  this.subLoading = false;
                });
                this.setCacheNumber();
                this.$bvToast.toast(`Profil image is updated!`, {
                  title: "User Settings Notification",
                  variant: "success",
                  autoHideDelay: 5000,
                });
              }
            })
            .catch((error) => {
              console.log(error);
              if (error.status == 500) {
                this.errorStatus = true;
                this.errorResponse = error;
                this.errorHeader = "Something went wrong!";
              }
            });
        }
      } else {
        this.subLoading = false;
      }
    },
    deleteImage() {
      this.imageError = false;
      this.subLoading = true;
      new UserApi(this.$authHttpConfig, undefined, this.$http).deleteAvatar()
        .then((response) => {
          if (response.status == 200) {
            this.profileImageBaseSrc = "";
            this.subLoading = false;
            this.uploadFile = [];
            this.setCacheNumber();
            this.$bvToast.toast(`Profil image is deleted!`, {
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
          this.errorHeader = "Delete operation has error!";
        });
    },
  },
  created() {
    this.subLoading = true;

    new UserApi(this.$authHttpConfig, undefined, this.$http).getUserById(this.user.id).then(response => {
      this.userData = response.data;
    })

    new UserApi(this.$authHttpConfig, undefined, this.$http).getAvatarById(this.user.id)
      .then((response) => {
        this.profileImageBaseSrc = response.data;
        this.subLoading = false;
      })
      .catch((error) => {
        console.log(error);
        this.subLoading = false;
      });

    
  },
};
</script>
