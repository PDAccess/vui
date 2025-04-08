<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <div class="input-group mb-3">
        <b-form-input
          class="form-control search-input"
          size="lg"
          placeholder="Entry Playbook Name"
          type="text"
          v-model="tempFilter"
          @keydown.enter="searchFilter"
        ></b-form-input>
      </div>
      <p-loading v-if="loading" class="my-5" message="Loading..." />
      <p-error
        v-else-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <div v-else>
        <div v-if="items.length === 0">
          <p-initial
            icon="file-plus"
            header="You don't have any Playbook"
            message="Please create a Playbook."
          />
        </div>
        <ul v-else class="list-group list-group-flush">
          <li
            class="list-group-item d-flex align-items-center"
            :key="index"
            v-for="(item, index) in items"
          >
            <b-row style="width: 100%">
              <b-col md="1">
                <b-button
                  @click="userDetailPage(item.ansibleInstallerEntity.userId)"
                  variant="link"
                  class="profile-button"
                >
                  <p-profile-avatar
                    :profileUsername="item.username"
                    :username="item.firstName + ' ' + item.lastName"
                    :size="30"
                    :imageWidth="'30px'"
                    :imageHeight="'auto'"
                    :username-show="false"
                  />
                </b-button>
              </b-col>
              <b-col
                md="3"
                @click="detailPlaybook(item.ansibleInstallerEntity)"
              >
                <b-link>{{ item.ansibleInstallerEntity.name }}</b-link>
              </b-col>
              <b-col md="3">
                <b-row>
                  <b-col
                    :key="index2"
                    v-for="(service, index2) in item.serviceEntities"
                    md="2"
                  >
                    <div
                      v-if="index2 < 6"
                      v-b-tooltip.bottom
                      style="min-width: 80px"
                    >
                      <b-link @click="serviceDetailPage(service.inventory_id)">
                        <div
                          :class="['inventory-logo-', getSystemIcon(service)]"
                          style="width: 40px; height: 40px"
                          :title="service.name + '-' + getSystemIcon(service)"
                          v-b-tooltip.bottom
                        ></div>
                      </b-link>
                    </div>
                  </b-col>
                </b-row>
              </b-col>
              <b-col md="2">
                <strong>Create Date: </strong>
                <template
                  v-if="item.ansibleInstallerEntity.createdAt != null"
                  >{{
                    item.ansibleInstallerEntity.createdAt | moment("calendar")
                  }}</template
                >
                <em v-else>Not Assigned!</em>
              </b-col>
              <b-col md="2">
                <strong>Update Date: </strong>
                <template
                  v-if="item.ansibleInstallerEntity.updatedAt != null"
                  >{{
                    item.ansibleInstallerEntity.updatedAt | moment("calendar")
                  }}</template
                >
                <em v-else>Not Assigned!</em>
              </b-col>
              <b-col lg="1">
                <b-dropdown
                  id="dropdown-1"
                  text="Action"
                  variant="primary"
                  class="user-actions"
                >
                  <template slot="button-content">
                    <i class="mr-1 fa fa-cogs" aria-hidden="true"></i>
                  </template>
                  <b-dropdown-item
                    @click.stop="editPlaybook(item.ansibleInstallerEntity)"
                    ><em class="fa fa-edit"></em>Edit</b-dropdown-item
                  >
                  <b-dropdown-item
                    @click.stop="deleteButton(item.ansibleInstallerEntity)"
                    v-b-modal.modal
                    ><em class="fa fa-trash"></em>Delete</b-dropdown-item
                  >
                </b-dropdown>
              </b-col>
            </b-row>
          </li>
        </ul>
      </div>
    </div>
    <p-modal @confirm="deletePlaybook()" :message="modalMessage"></p-modal>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  components: {},
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      loading: true,
      items: [],
      serviceName: "",
      tempFilter: "",
      modalMessage: "",
      selectedPlaybook: {},
    };
  },
  methods: {
    startPlaybook(id) {
      this.$http
        .post("/api/v1/playbook/play/" + id)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          this.$bvToast.toast(`Something went wrong!`, {
            title: "Playbook Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    detailPlaybook(item) {
      this.$router.push(
        this.$route.query.redirect || "/playbook/detail/" + item.id
      );
    },
    editPlaybook(item) {
      this.$router.push(
        this.$route.query.redirect || "/playbook/edit/" + item.id
      );
    },
    deleteButton(item) {
      this.selectedPlaybook.id = item.id;
      this.selectedPlaybook.name = item.name;
      this.modalMessage =
        "Are you sure you want to delete the Playbook with the name " +
        this.selectedPlaybook.name +
        " ?";
    },
    deletePlaybook() {
      this.$http
        .delete("/api/v1/playbook/" + this.selectedPlaybook.id)
        .then((response) => {
          this.$bvToast.toast(`Playbook is Deleted!`, {
            title: "Playbook Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.getPlaybook();
        })
        .catch((error) => {
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
          this.$bvToast.toast(`Something went wrong!`, {
            title: "Playbook Notification",
            variant: "danger",
            autoHideDelay: 5000,
          });
          console.log(error);
        });
    },
    getPlaybook() {
      this.loading = true;
      this.$http
        .get("/api/v1/playbook/myplaybook/" + this.user.userId)
        .then((response2) => {
          this.items = response2.data;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
          console.log(error);
        });
    },
    userDetailPage(item) {
      this.$router.push({
        name: "User Detail",
        params: {
          id: item,
        },
      });
    },
    serviceDetailPage(item) {
      this.$router.push({
        name: "Service Detail",
        params: {
          id: item,
        },
      });
    },
    getSystemIcon(item) {
      let system_type = item.service_type_id;
      if (
        system_type == 1 ||
        system_type == 2 ||
        system_type == 3 ||
        system_type == 4 ||
        system_type == 9
      ) {
        return this.numberToService(system_type);
      } else return this.numberToOS(item.operating_system_id);
    },
    numberToService(item) {
      let serviceId = item;
      if (serviceId == 1) return "mysql";
      else if (serviceId == 2) return "postgresql";
      else if (serviceId == 3) return "mssql";
      else if (serviceId == 4) return "oracle";
      else if (serviceId == 5) return "ssh";
      else if (serviceId == 6) return "telnet";
      else if (serviceId == 7) return "rdp";
      else if (serviceId == 8) return "vnc";
      else if (serviceId == 9) return "mongodb";
    },
    numberToOS(item) {
      let OSId = item;
      if (OSId == 1) return "ubuntu";
      else if (OSId == 2) return "redhat";
      else if (OSId == 3) return "debian";
      else if (OSId == 4) return "centos";
      else if (OSId == 5) return "windows";
      else if (OSId == 6) return "unix";
      else if (OSId == 7) return "linux";
      else if (OSId == 8) return "solaris";
      else if (OSId == 9) return "cisco";
    },
  },
  created() {
    this.getPlaybook();
  },
};
</script>
