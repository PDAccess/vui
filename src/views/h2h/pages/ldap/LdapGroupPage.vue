<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <p-loading v-if="loading" class="my-5" message="Loading..." />
      <p-error
        v-else-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <div v-else-if="groups.length == 0">
        <p-empty message="You don't have any LDAP group." />
      </div>
      <div v-else>
        <b-row>
          <b-col :lg="tableColumn">
            <p-card>
              <ul class="list-group list-group-flush">
                <li
                  class="
                    list-group-item
                    d-flex
                    justify-content-between
                    align-items-center
                  "
                  :key="index"
                  v-for="(item, index) in groups"
                >
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <avatar
                        :rounded="false"
                        :size="40"
                        :username="item.name"
                      ></avatar>
                    </div>
                    <div style="margin-left: 15px">
                      <b-link @click.stop="infoGroup(item)">
                        <p class="mb-1">
                          <strong>{{ item.name }}</strong>
                        </p>
                      </b-link>
                      <small>{{ item.description }}</small>
                    </div>
                  </div>
                  <div>
                    <p>
                      <strong>{{ item.created_at }}</strong>
                    </p>
                  </div>
                  <div>
                    <b-button-group size="sm">
                      <b-button
                        @click.stop="details(item)"
                        type="info"
                        variant="outline-info"
                      >
                        Details
                      </b-button>
                    </b-button-group>
                  </div>
                </li>
              </ul>
            </p-card>
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
                    :username="groupData.groupname"
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
                        {{ groupData.groupname }}
                      </h4>
                    </b-col>
                  </b-row>
                </div>
                <p-modal
                  @confirm="deleteGroup()"
                  :message="modalMessage"
                ></p-modal>
                <b-row style="margin-top: 15px">
                  <b-col>
                    <div class="form-group">
                      <label center for="name">Group Name</label>
                      <input
                        class="form-control"
                        readonly
                        type="text"
                        v-model="groupData.groupname"
                      />
                    </div>
                    <div class="form-group">
                      <label center for="name">Group Description</label>
                      <input
                        class="form-control"
                        readonly
                        type="text"
                        v-model="groupData.groupdescription"
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
                    :username="groupData.groupname"
                    color="#fff"
                    style="margin-bottom: 15px"
                  ></avatar>
                  <b-row align-h="between">
                    <b-col lg="6" sm="12">
                      <b-button-group>
                        <b-button
                          @click.stop="editGroup($event.target)"
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
                        {{ groupData.groupname }}
                      </h4>
                    </b-col>
                  </b-row>
                </div>
                <b-row style="margin-top: 15px">
                  <b-col>
                    <div class="form-group">
                      <label for="inputLive">Group Name</label>
                      <b-form-input
                        :state="!$v.groupData.groupname.$invalid"
                        placeholder=""
                        type="text"
                        v-model.trim="$v.groupData.groupname.$model"
                      ></b-form-input>
                      <b-form-invalid-feedback>
                        <div v-if="!$v.groupData.groupname.required">
                          Group name is required.
                        </div>
                        <div v-if="!$v.groupData.groupname.minLength">
                          Group name must have at least
                          {{
                            $v.groupData.groupname.$params.minLength.min -
                            groupData.groupname.length
                          }}
                          letters.
                        </div>
                        <div v-if="!$v.groupData.groupname.alpha">
                          Group name cannot contain numbers.
                        </div>
                      </b-form-invalid-feedback>
                    </div>
                    <div class="form-group">
                      <label for="inputLive">Group Description</label>
                      <b-form-input
                        :state="!$v.groupData.groupdescription.$invalid"
                        placeholder=""
                        type="text"
                        v-model.trim="$v.groupData.groupdescription.$model"
                      ></b-form-input>
                      <b-form-invalid-feedback>
                        <div v-if="!$v.groupData.groupdescription.required">
                          Group description is required.
                        </div>
                        <div v-if="!$v.groupData.groupdescription.minLength">
                          Group description must have at least
                          {{
                            $v.groupData.groupdescription.$params.minLength
                              .min - groupData.groupdescription.length
                          }}
                          letters.
                        </div>
                        <div v-if="!$v.groupData.groupdescription.alpha">
                          Group description cannot contain numbers.
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
import { alpha, minLength, required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  name: "GroupsPage",
  props: ["id"],
  components: {
    Avatar,
  },
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      groups: [],
      loading: true,
      dataObject: {},
      tableColumn: 12,
      groupData: {
        groupname: "",
        groupdescription: "",
      },
      showDetailCard: false,
      showEditCard: false,
      modalname: "",
      modalMessage: "",
    };
  },
  mixins: [validationMixin],
  validations: {
    groupData: {
      groupname: {
        required,
        alpha,
        minLength: minLength(3),
      },
      groupdescription: {
        required,
        alpha,
        minLength: minLength(3),
      },
    },
  },
  methods: {
    infoGroup(item) {
      this.$router.push({
        name: "Server List",
        params: {
          id: item.name,
        },
        query: {
          sort: "createddesc",
        },
      });
    },
    details(item) {
      this.groupData.groupname = item.name;
      this.groupData.description = item.description;
      this.showDetailCard = true;
      this.tableColumn = 6;
    },
    edits() {
      this.showDetailCard = false;
      this.showEditCard = true;
      this.tableColumn = 6;
    },
    editGroup() {
      this.showEditCard = false;
    },
    editCancel() {
      this.showEditCard = false;
      this.showDetailCard = true;
    },
    deleteGroup() {
      this.dataObject = {
        name: this.modalname,
      };

      this.$http
        .delete("/api/ldap/v1/group", { data: this.dataObject })
        .then((response) => {
          if ((response.status = 200)) {
            this.showDetailCard = false;
            this.$bvToast.toast(`Group is deleted!`, {
              title: "Group is deleted!",
              variant: "success",
              autoHideDelay: 5000,
            });


            this.$http
              .get("/api/ldap/v1/group")
              .then((response2) => {
                this.groups = response2.data;
              })
              .catch((error) => {
                console.log(error);
                this.errorStatus = true;
                this.errorResponse = error;
                this.errorHeader = "Delete operation has error!";
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
    deleteButton() {
      this.modalname = this.groupData.groupname;
      this.modalMessage =
        "Are you sure you want to delete the group with the name " +
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
    this.$http
      .get("api/ldap/v1/group")
      .then((response) => {
        this.groups = response.data;
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