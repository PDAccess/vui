<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row>
        <b-col>
          <div v-if="false" class="form-group">
            <p-select
              :multiple="true"
              :options="servers"
              :taggable="true"
              label="servername"
              placeholder="Select Server"
              track-by="userId"
              v-model="selectedServers"
            ></p-select>
          </div>
        </b-col>
        <b-col cols="1.2" style="padding-right: 25px">
          <b-button
            :to="'/ldap/servers/' + id + '/create/server'"
            variant="success"
            style="margin-bottom: 5px"
            >Create Server</b-button
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
      <div v-else-if="servers.length == 0">
        <p-empty message="You don't haveave any LDAP server." />
      </div>
      <div v-else>
        <b-row>
          <b-col :lg="tableColumn" class="item-table">
            <b-table
              fixed
              :fields="fields"
              :items="servers"
              :responsive="responsive"
              hover
              show-empty
              small
            >
              <template v-slot:cell(server)="row">
                <span class="text-info"> {{ row.item.name }}</span>
              </template>
              <template v-slot:cell(description)="row">
                <span class="text-info"> {{ row.item.description }}</span>
              </template>
              <template v-if="false" v-slot:cell(actions)="row">
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
                    :username="serverData.servername"
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
                        {{ serverData.servername }}
                      </h4>
                    </b-col>
                  </b-row>
                </div>
                <p-modal
                  @confirm="deleteServer()"
                  :message="modalMessage"
                ></p-modal>
                <b-row style="margin-top: 15px"> Input Show Area </b-row>
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
                    :username="serverData.servername"
                    color="#fff"
                    style="margin-bottom: 15px"
                  ></avatar>
                  <b-row align-h="between">
                    <b-col lg="6" sm="12">
                      <b-button-group>
                        <b-button
                          @click.stop="editServer($event.target)"
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
                        {{ serverData.servername }}
                      </h4>
                    </b-col>
                  </b-row>
                </div>
                <b-row> Edit Input Area </b-row>
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

export default {
  name: "app",
  props: ["id"],
  components: {
    Avatar,
  },
  data() {
    return {
      selectedServers: [],
      loading: true,
      errorStatus: false,
      errorResponse: "",
      servers: [],
      fields: [
        { key: "server", label: "Server Name" },
        { key: "description", label: "Server Description" },
      ],
      dataObject: {},
      serverData: {
        server_id: "",
        servername: "",
        created_time: "",
      },
      tableColumn: 12,
      showDetailCard: false,
      showEditCard: false,
      modalid: "",
      modalname: "",
      modalMessage: "",
    };
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  methods: {
    details(item) {
      this.serverData.server_id = "1";
      this.serverData.servername = item.name;
      this.serverData.created_time = item.created_time;
      this.showDetailCard = true;
      this.tableColumn = 6;
    },
    edits() {
      this.showDetailCard = false;
      this.showEditCard = true;
      this.tableColumn = 6;
    },
    editServer() {
      this.showEditCard = false;
      //Editing server item
    },
    editCancel() {
      this.showEditCard = false;
      this.showDetailCard = true;
    },
    deleteServer() {
      //deleting server item
    },
    deleteButton() {
      this.modalid = this.serverData.server_id;
      this.modalname = this.serverData.servername;
      this.modalMessage =
        "Are you sure you want to delete the server with the name " +
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
    this.loading = true;

    this.dataObject = {
      name: this.id,
    };
    this.$http
      .post("/api/ldap/v1/server", this.dataObject)
      .then((response) => {
        if (response.status == 200) {
          this.loading = false;
          this.servers = response.data;
        }
      })
      .catch((error) => {
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
