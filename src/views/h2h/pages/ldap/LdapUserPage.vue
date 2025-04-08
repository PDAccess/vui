<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col>
          <div v-if="false" class="form-group">
            <p-select
              :multiple="true"
              :options="users"
              :taggable="true"
              label="username"
              placeholder="Select User"
              track-by="userId"
              v-model="selectedUsers"
            ></p-select>
          </div>
        </b-col>
        <b-col cols="1.2" style="padding-right: 25px">
          <b-button
            :to="'/ldap/servers/' + id + '/create/user'"
            variant="success"
            style="margin-bottom: 5px"
            >Create User</b-button
          >
        </b-col>
      </b-row>
      <p-error
        v-if="errorStatus"
        header="List operation has error!"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <p-loading v-else-if="loading" class="my-5" message="Loading..." />
      <div v-else-if="users.length == 0">
        <p-empty message="You don't have any LDAP user." />
      </div>
      <div v-else>
        <b-row>
          <b-col :lg="tableColumn" class="item-table">
            <b-table
              fixed
              :fields="fields"
              :items="users"
              :responsive="responsive"
              hover
              show-empty
              small
            >
              <template v-slot:cell(user)="row">
                <span class="text-info"> {{ row.item.uid }}</span>
              </template>
              <template v-slot:cell(full_name)="row">
                <span class="text-info"> {{ row.item.fullName }}</span>
              </template>
              <template v-slot:cell(actions)="row">
                <b-button
                  @click.stop="details(row.item)"
                  type="info"
                  variant="outline-primary"
                >
                  <em class="fa fa-info"></em>
                </b-button>
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
                  <avatar
                    :rounded="false"
                    :size="150"
                    :username="userdata.fullname"
                    color="#fff"
                    style="margin-bottom: 15px"
                  ></avatar>
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
                      </b-button-group>
                    </b-col>
                    <b-col lg="6" sm="12">
                      <h4 class="text-right mr-3">
                        {{ userdata.fullname }}
                      </h4>
                    </b-col>
                  </b-row>
                </div>
                <p-modal
                  @confirm="deleteUser()"
                  :message="modalMessage"
                ></p-modal>
                <b-row style="margin-top: 15px">
                  <b-col>
                    <div class="form-group">
                      <label center for="name">User id</label>
                      <input
                        class="form-control"
                        readonly
                        type="text"
                        v-model="userdata.userId"
                      />
                    </div>
                    <div class="form-group">
                      <label center for="name">Home directory</label>
                      <input
                        class="form-control"
                        readonly
                        type="text"
                        v-model="userdata.homedirectory"
                      />
                    </div>
                  </b-col>
                  <b-col>
                    <div class="form-group">
                      <label center for="name">Full Name</label>
                      <input
                        class="form-control"
                        readonly
                        type="text"
                        v-model="userdata.fullname"
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
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
            <b-col lg="6" v-if="showEditCard">
              <b-card header-tag="header" style="width: auto">
                <div slot="header">
                  <b-button @click="closeEdit" style="float: right"
                    ><em class="fa fa-remove"></em
                  ></b-button>
                  <avatar
                    :rounded="false"
                    :size="150"
                    :username="userdata.fullname"
                    color="#fff"
                    style="margin-bottom: 15px"
                  ></avatar>
                  <b-row align-h="between">
                    <b-col lg="6" sm="12">
                      <b-button-group>
                        <b-button
                          @click.stop="editUser($event.target)"
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
                      <h4 class="text-right mr-3">
                        {{ userdata.fullname }}
                      </h4>
                    </b-col>
                  </b-row>
                </div>
                <b-row style="margin-top: 15px">
                  <b-col>
                    <div class="form-group">
                      <label for="inputLive">User id</label>
                      <b-form-input
                        :state="!$v.userEditdata.userId.$invalid"
                        placeholder=""
                        type="text"
                        readonly
                        v-model.trim="$v.userEditdata.userId.$model"
                      ></b-form-input>
                      <b-form-invalid-feedback>
                        <div v-if="!$v.userEditdata.userId.required">
                          User id is required.
                        </div>
                        <div v-if="!$v.userEditdata.userId.numeric">
                          User id is numeric.
                        </div>
                      </b-form-invalid-feedback>
                    </div>
                    <div class="form-group">
                      <label for="inputLive">Home directory</label>
                      <b-form-input
                        :state="!$v.userEditdata.homedirectory.$invalid"
                        placeholder=""
                        type="text"
                        v-model.trim="$v.userEditdata.homedirectory.$model"
                      ></b-form-input>
                      <b-form-invalid-feedback>
                        <div v-if="!$v.userEditdata.homedirectory.required">
                          Full name is required.
                        </div>
                        <div v-if="!$v.userEditdata.homedirectory.minLength">
                          Full name must have at least
                          {{
                            $v.userEditdata.homedirectory.$params.minLength
                              .min - userEditdata.homedirectory.length
                          }}
                          letters.
                        </div>
                      </b-form-invalid-feedback>
                    </div>
                  </b-col>
                  <b-col>
                    <div class="form-group">
                      <label for="inputLive">Full Name</label>
                      <b-form-input
                        :state="!$v.userEditdata.fullname.$invalid"
                        placeholder=""
                        type="text"
                        v-model.trim="$v.userEditdata.fullname.$model"
                      ></b-form-input>
                      <b-form-invalid-feedback>
                        <div v-if="!$v.userEditdata.fullname.required">
                          Full name is required.
                        </div>
                        <div v-if="!$v.userEditdata.fullname.minLength">
                          Full name must have at least
                          {{
                            $v.userEditdata.fullname.$params.minLength.min -
                            userEditdata.fullname.length
                          }}
                          letters.
                        </div>
                      </b-form-invalid-feedback>
                    </div>
                    <div class="form-group">
                      <label for="inputLive">Username</label>
                      <b-form-input
                        :state="!$v.userEditdata.username.$invalid"
                        placeholder=""
                        type="text"
                        v-model.trim="$v.userEditdata.username.$model"
                      ></b-form-input>
                      <b-form-invalid-feedback>
                        <div v-if="!$v.userEditdata.username.required">
                          Username is required.
                        </div>
                        <div v-if="!$v.userEditdata.username.minLength">
                          Username must have at least
                          {{
                            $v.userEditdata.username.$params.minLength.min -
                            userEditdata.username.length
                          }}
                          letters.
                        </div>
                      </b-form-invalid-feedback>
                    </div>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </transition>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from "vue-avatar";
import { alpha, minLength, numeric, required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  name: "app",
  props: ["id"],
  components: {
    Avatar,
  },
  data() {
    return {
      selectedUsers: [],
      loading: true,
      errorStatus: false,
      errorResponse: "",
      users: [],
      fields: [
        { key: "user", label: "User" },
        { key: "full_name", label: "Full Name" },
        { key: "actions", label: "Actions" },
      ],
      dataObject: {},
      userdata: {
        userId: "",
        username: "",
        fullname: "",
        homedirectory: "",
      },
      userEditdata: {
        userId: "",
        username: "",
        fullname: "",
        homedirectory: "",
      },
      tableColumn: 12,
      showDetailCard: false,
      showEditCard: false,
      modalid: "",
      modalname: "",
      modalMessage: "",
    };
  },
  mixins: [validationMixin],
  validations: {
    userEditdata: {
      fullname: {
        required,
        minLength: minLength(5),
      },
      username: {
        required,
        alpha,
        minLength: minLength(3),
      },
      useIid: {
        required,
        numeric,
      },
      homedirectory: {
        required,
        minLength: minLength(1),
      },
    },
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  methods: {
    details(item) {
      this.userdata.userId = item.uidnumber;
      this.userdata.username = item.uid;
      this.userdata.fullname = item.fullName;
      this.userdata.homedirectory = item.homedirectory;
      this.showDetailCard = true;
      this.tableColumn = 6;
    },
    edits() {
      this.userEditdata.userId = this.userdata.userId;
      this.userEditdata.username = this.userdata.username;
      this.userEditdata.fullname = this.userdata.fullname;
      this.userEditdata.homedirectory = this.userdata.homedirectory;

      this.showDetailCard = false;
      this.showEditCard = true;
      this.tableColumn = 6;
    },
    editUser() {
      this.showEditCard = false;
      //Editing user item
    },
    editCancel() {
      this.showEditCard = false;
      this.showDetailCard = true;
    },
    deleteUser() {
      //deleting user item
    },
    deleteButton() {
      this.modalid = this.userdata.userId;
      this.modalname = this.userdata.username;
      this.modalMessage =
        "Are you sure you want to delete the users with the name " +
        this.modalname +
        " ?";
    },
    closeDetail() {
      this.showDetailCard = false;
    },
    closeEdit() {
      this.showEditCard = false;
    },
  },
  created() {
    this.dataObject = {
      name: this.id,
    };

    this.loading = true;
    this.$http
      .post("/api/ldap/v1/user", this.dataObject)
      .then((response) => {
        if ((response.status = 200)) {
          this.users = response.data;
          this.loading = false;
        }
      })
      .catch(function (error) {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
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
