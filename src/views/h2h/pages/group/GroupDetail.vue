<template>
  <div class="animated fadeIn">
    <div>
      <b-alert v-model="alertCheck" :variant="alertVariant" dismissible>
        {{ alertMessage }}
      </b-alert>
    </div>
    <p-card v-if="loading">
      <p-loading class="my-5" message="Loading..." />
    </p-card>
    <p-card v-else-if="errorStatus">
      <p-error
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
    </p-card>
    <template v-else>
      <p-card>
        <b-row>
          <div>
            <b-button disabled variant="link">
              <avatar
                :rounded="false"
                :size="90"
                :username="serviceNameAvatar(info.groupname)"
                color="#fff"
              ></avatar>
            </b-button>
          </div>
          <div>
            <div>
              <h2>{{ info.groupname }}</h2>
            </div>
            <div>
              <p>
                {{ info.description }}
                <a v-show="info.createTime != null">
                  <span>&#183;</span>
                  Created at {{ info.createTime | moment("calendar") }}
                </a>
                <span>
                  <span>&#183;</span>
                  {{ totalService }} Services Available
                </span>
                <span>
                  <span>&#183;</span>
                  {{ id }}<p-copy :copyItem="id"></p-copy>
                </span>
              </p>
            </div>
            <div class="d-flex">
              <div>
                <b-button
                  @click.stop="disableNotification"
                  variant="success"
                  v-show="notification"
                >
                  <em class="fa fa-bell"></em>
                  <span class="d-sm-down-none">Notification </span>
                </b-button>
                <b-button
                  @click.stop="enableNotification"
                  variant="danger"
                  v-show="!notification"
                >
                  <em class="fa fa-bell-slash"></em>
                  <span class="d-sm-down-none">Notification</span>
                </b-button>
              </div>
              <div v-if="isAdmin" class="pl-1">
                <b-button
                  @click="isEditModeEnabled = !isEditModeEnabled"
                  :variant="isEditModeEnabled ? 'danger' : 'success'"
                >
                  <span v-if="isEditModeEnabled">
                    <em class="fa fa-times mr-2"></em>Close
                    <span class="d-sm-down-none">Edit</span>
                  </span>
                  <span v-else>
                    <span class="d-sm-down-none">Edit</span>
                    Services
                  </span>
                </b-button>
              </div>
              <div class="pl-1">
                <b-dropdown
                  v-if="isAdmin"
                  class="dropdownClass large-area"
                  text="Install Agent"
                  variant="primary"
                  size="md"
                >
                  <b-tabs>
                    <b-tab class="install-tab" title="Install">
                      <hr />
                      <div class="p-2">
                        You can copy the existing scripts from this section to
                        install the PDAccess agent
                      </div>
                      <hr />
                      <template v-for="agentType in agents">
                          <b-tabs :key="agentType.name" class="copy-container inceptor">
                            <b-tab
                              :key="architecture.arc"
                              v-for="architecture in agentType.archs"
                              :title="architecture.arc"
                            >
                              <b-tabs class="mt-2">
                                <b-tab
                                  class="mt-2"
                                  :title="osystem.os"
                                  :key="osystem.os"
                                  v-for="osystem in architecture.osystems"
                                >
                                  <div style="height: 250px; overflow: auto">
                                    <b-dropdown-text
                                      class="dropdowntext"
                                      :key="agent.label"
                                      v-for="agent in osystem.versions"
                                    >
                                      <p style="font-size=1.3rem">
                                        <strong>{{ agent.label }}</strong>
                                      </p>
                                      <b-input-group class="inputgroup">
                                        <b-form-input
                                          class="inputform"
                                          :readonly="true"
                                          :value="
                                            getAgent(
                                              agent.runner,
                                              agentType.path
                                            )
                                          "
                                        ></b-form-input>
                                        <p-copy
                                          v-if="agent.runner != ''"
                                          :copyItem="copyKey"
                                          @click="
                                            copyAgent(
                                              agent.runner,
                                              agentType.path
                                            )
                                          "
                                        />
                                      </b-input-group>
                                      <hr
                                        style="
                                          margin-bottom: 0;
                                          padding-bottom: 0;
                                        "
                                      />
                                    </b-dropdown-text>
                                  </div>
                                </b-tab>
                              </b-tabs>
                            </b-tab>
                          </b-tabs>
                      </template>
                    </b-tab>
                    <b-tab title="Save">
                      <hr />
                      <div class="p-2">
                        To install the PDAccess agent with the pdaccess command
                        line tool, you can copy the available commands from this
                        section
                      </div>
                      <hr />
                      <b-dropdown-text class="dropdowntext mt-2">
                        <p style="font-size=1.3rem">
                          <strong>Register Agent</strong>
                        </p>
                        <b-input-group class="inputgroup">
                          <b-form-input
                            class="inputform"
                            :readonly="true"
                            :value="copyAgentSave"
                          ></b-form-input>
                          <p-copy
                            :copyItem="copyAgentSave"
                            @click="copyAgent(agent.runner)"
                          />
                        </b-input-group>
                        <hr style="margin-bottom: 0; padding-bottom: 0" />
                      </b-dropdown-text>
                    </b-tab>
                  </b-tabs>
                </b-dropdown>
              </div>
            </div>
            <div>
              <transition name="fade" mode="out-in">
                <div key="edit" v-show="editable">
                  <b-row>
                    <b-col>
                      <p-select
                        :disabled="locked"
                        v-model="selectedServices"
                        :options="services"
                        track-by="inventoryId"
                        placeholder="Select Services"
                        :multiple="true"
                        :taggable="true"
                        @tag="addTag"
                        :custom-label="customLabel"
                        :show-labels="false"
                        @select="serviceUpdate"
                        @remove="onRemoveSelect"
                      >
                        <template slot="singleLabel" slot-scope="props">
                          <span class="option__title">{{
                            props.option.name
                          }}</span>
                        </template>
                        <template slot="option" slot-scope="props">
                          <div class="option__desc">
                            <span class="option__title">
                              {{ props.option.name }}
                              <span>
                                <b-badge
                                  pill
                                  :variant="
                                    badgeVariant(props.option.service_type_id)
                                  "
                                  >{{ props.option.serviceTypeLogo }}</b-badge
                                >
                              </span>
                            </span>
                          </div>
                        </template>
                      </p-select>
                    </b-col>
                  </b-row>
                </div>
              </transition>
            </div>
          </div>
        </b-row>
      </p-card>
      <p-card class="group-detail-body">
        <div class="input-group mb-3 mt-3">
          <b-form-input
            class="form-control search-input"
            size="md"
            placeholder="Enter Service Info to Search"
            type="text"
            v-model="tempFilter"
            @keydown.enter="searchFilter"
          ></b-form-input>
          <template v-if="isEditModeEnabled">
            <b-modal
              id="addServiceModal"
              centered
              title="Add service to group:"
            >
              <p-select
                :disabled="locked"
                v-model="selectedServices"
                :options="services"
                track-by="inventoryId"
                placeholder="Select Services"
                :multiple="true"
                :taggable="true"
                @tag="addTag"
                :custom-label="customLabel"
                :show-labels="false"
                @select="serviceUpdate"
                @remove="onRemoveSelect"
              >
                <template slot="singleLabel" slot-scope="props">
                  <span class="option__title">{{ props.option.name }}</span>
                </template>
                <template slot="option" slot-scope="props">
                  <div class="option__desc">
                    <span class="option__title">
                      {{ props.option.name }}
                      <span>
                        <b-badge
                          pill
                          :variant="badgeVariant(props.option.service_type_id)"
                          >{{ props.option.serviceTypeLogo }}</b-badge
                        >
                      </span>
                    </span>
                  </div>
                </template>
              </p-select>
            </b-modal>
            <p-modal
              id="deleteServiceModal"
              ref="deleteServiceModal"
              @confirm="deleteServices"
              message="Are you sure you want to delete the selected services?"
            ></p-modal>
            <b-button
              v-b-modal.deleteServiceModal
              class="ml-2"
              variant="danger"
            >
              <em class="fa fa-trash" />
            </b-button>
            <b-button
              @click="selectedService = []"
              v-b-modal.addServiceModal
              class="ml-2"
              variant="success"
            >
              <em class="fa fa-plus" />
            </b-button>
          </template>
        </div>
        <hr />
        <div v-if="items.length == 0">
          <p-empty message="You don't have any service" />
        </div>
        <div v-else>
          <div :class="{ 'service-focus': isFocused }">
            <ul class="list-group list-group-flush">
              <li
                class="
                  list-group-item
                  d-flex
                  justify-content-between
                  align-items-center
                "
                :key="index"
                v-for="(item, index) in items"
              >
                <b-row style="width: 100%">
                  <b-col cols="12" md="5">
                    <div class="d-flex align-items-center">
                      <b-form-checkbox
                        v-if="isEditModeEnabled"
                        :id="'checkbox-' + item.inventoryId"
                        v-model="item.checked"
                        :name="'checkbox-' + item.inventoryId"
                        value="accepted"
                        unchecked-value="not_accepted"
                      >
                      </b-form-checkbox>
                      <div
                        class="d-flex justify-content-center align-items-center"
                      >
                        <b-button
                          @click.stop="infoService(item)"
                          variant="link"
                        >
                          <avatar
                            :rounded="false"
                            :size="40"
                            :username="serviceNameAvatar(item.name)"
                          ></avatar>
                        </b-button>
                        <div
                          :class="[
                            'inventory-logo',
                            'mx-auto',
                            item.serviceNameLogo,
                          ]"
                          :title="item.serviceNameLogo"
                          v-b-tooltip.bottom
                        ></div>
                        <div
                          :class="[
                            'inventory-logo',
                            'mx-auto',
                            item.serviceTypeLogo,
                          ]"
                          :title="item.serviceTypeLogo"
                          v-b-tooltip.bottom
                        ></div>
                      </div>
                      <div style="margin-left: 15px">
                        <b-link @click.stop="infoService(item)">
                          <p class="mb-1">
                            <strong class="mr-1">{{ item.name }}</strong>
                            <b-badge variant="primary">{{
                              item.sessioncount
                            }}</b-badge>
                          </p>
                        </b-link>
                        <div>
                          <small>{{ item.description }}</small>
                        </div>
                      </div>
                    </div>
                  </b-col>
                  <b-col
                    cols="12"
                    md="7"
                    class="d-flex justify-content-end align-items-center"
                  >
                    <strong>
                      <b-badge
                        title="Created At"
                        v-b-tooltip.bottom
                        variant="success"
                        class="mr-1 p-1"
                      >
                        <span>{{ item.createdAt | moment("calendar") }}</span>
                      </b-badge>
                      <b-badge
                        v-if="item.lastAccessTime"
                        title="Last Access"
                        v-b-tooltip.bottom
                        variant="primary"
                        class="p-1"
                      >
                        <span>{{
                          item.lastAccessTime | moment("calendar")
                        }}</span>
                      </b-badge>
                      <b-badge
                        v-else
                        title="Last Access"
                        v-b-tooltip.bottom
                        variant="danger"
                        class="p-1"
                      >
                        <span>No Access</span>
                      </b-badge>
                      <b-button
                        v-show="editable"
                        class="ml-1"
                        variant="danger"
                        @click="onRemoveSelect(item, null)"
                      >
                        <em class="mr-1 fa fa-trash"></em>
                      </b-button>
                    </strong>
                  </b-col>
                </b-row>
              </li>
            </ul>
            <infinite-loading
              @infinite="updateServices"
              force-use-infinite-wrapper
            >
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </div>
        </div>
      </p-card>
    </template>
  </div>
</template>
<script>
import Avatar from "vue-avatar";
import InfiniteLoading from "vue-infinite-loading";
import { mapGetters } from "vuex";
import axios from "axios";

import agentInstallers from "../../../../data/AgentInstallers.json";

export default {
  props: ["id"],
  components: {
    Avatar,
    InfiniteLoading,
  },
  data() {
    return {
      isEditModeEnabled: false,
      alertCheck: false,
      alertVariant: "success",
      alertMessage: "",
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      isFocused: false,
      loading: true,
      agents: agentInstallers,
      editable: false,
      locked: true,
      selectedServices: [],
      services: [],
      copyKey: "",
      hostname: "",
      logs: [],
      notification: false,
      items: [],
      info: {
        groupname: "",
        description: "",
        created_at: "",
      },
      exFields: [
        { key: "user", label: "User" },
        { key: "command", label: "Command" },
        { key: "params", label: "Params" },
        { key: "ipadd", label: "Ip Address" },
        { key: "time", sortable: true, label: "Exec Time" },
      ],
      fields: {
        avatar: {
          label: "",
          class: "text-center",
        },
        name: {
          label: "Name",
        },
        sessioncount: {
          label: "Session Count",
          class: "text-center",
        },
        serviceNameLogo: {
          label: "Operating System",
          class: "text-center",
        },
        serviceTypeLogo: {
          label: "Service Type",
          sortable: true,
          class: "text-center",
        },
        serviceUser: {
          label: "Created User",
          sortable: true,
          class: "text-center",
        },
        created_at: {
          label: "Created",
          class: "text-center",
        },
        actions: {
          label: "",
          class: "text-center",
        },
      },
      filter: null,
      copyAgentSave: `sudo pdaccess register save -g ${this.id}`,
      currentPage: 0,
      perpage: 10,
      tempFilter: null,
      getServicesLoading: true,
      totalService: 0,
      deletecontrol: false,
    };
  },
  watch: {
    tempFilter: function (val) {
      if (val.length >= 3 || val.length == 0) this.searchFilter();
    },
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
    isAdmin() {
      return this.info !== undefined && this.info.ownMembership === "ADMIN";
    },
  },
  methods: {
    deleteServices() {
      let services = [];
      this.items.forEach((service) => {
        if (service.checked) {
          services.push(service.inventoryId);
        }
      });
      this.$http
        .post("/api/v1/group/service/delete/" + this.id, services)
        .then((response) => {
          this.$bvToast.toast("Group services deleted", {
            title: "Group Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          services.forEach((serviceId) => {
            this.items.forEach((item) => {
              if (item.inventoryId == serviceId) {
                this.items.splice(this.items.indexOf(item), 1);
              }
            });
          });
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Update operation has error!";
        });
    },
    onRemoveSelect(value, id) {
      this.$http
        .delete("/api/v1/group/service/" + this.id + "/" + value.inventoryId)
        .then((response) => {
          this.$bvToast.toast("Group deleted", {
            title: "Group Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.items.splice(this.items.indexOf(value), 1);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    searchFilter() {
      if (this.tempFilter == null) {
        this.clearFilter();
      } else if (
        this.filter == null ||
        this.tempFilter.toLowerCase() != this.filter.toLowerCase()
      ) {
        this.currentPage = 0;
        this.filter = this.tempFilter.toLowerCase();
        this.getServices();
      }
    },
    clearFilter() {
      if (this.filter == null) {
        this.tempFilter = null;
      } else {
        this.currentPage = 0;
        this.tempFilter = null;
        this.filter = null;
        this.getServices();
      }
    },
    getServices() {
      this.getServicesLoading = true;
      let pageable = {
        perPage: this.perpage,
        currentPage: this.currentPage,
        filter: this.filter,
      };

      this.items = [];

      this.$http
        .post("/api/v1/group/service/" + this.id, pageable)
        .then((response) => {
          if (response.data.totalRows > this.currentPage * this.perpage) {
            if (response.data.services.length) {
              response.data.services.forEach((element) => {
                this.items.push(element);
              });
            }
            this.currentPage += 1;
            this.selectedServices = this.items;
            this.getServicesLoading = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getAgent(runner, path) {
      if (runner == "") {
        return "No package available yet";
      }
      return `curl https://${this.hostname}/${path}/${runner} --output ${runner} --insecure && sudo bash ./${runner} -- -H ${this.hostname} -a ${this.id} -i ${this.user.userId}`;
    },
    serviceUpdate(service) {
      this.$http
        .post("/api/v1/service/groups/" + service.inventoryId, { filter: null })
        .then((response) => {
          if (response.data != null && response.data.length > 0) {
            this.$bvToast.toast(service.name + " service already in Groups: " + response.data.map((group) => group.groupname).join(', '), {
              title: "Service Group Notification",
              variant: "warning",
              autoHideDelay: 5000,
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });

      let datas = [service.inventoryId];
      for (let i = 0; i < this.selectedServices.length; i++) {
        datas.push(this.selectedServices[i].inventoryId);
      }

      this.$http
        .put("/api/v1/group/service/" + this.id, datas)
        .then(() => {
          this.$bvToast.toast("Group services updated", {
            title: "Group Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.items = this.selectedServices;
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Update operation has error!";
        });
    },
    onCopy() {
      this.$bvToast.toast(`Agent successfully copied`, {
        title: "Success Copy",
        variant: "info",
        autoHideDelay: 5000,
      });
    },
    copyAgent(runner, path) {
      console.log("clicked");
      this.copyKey = this.getAgent(runner, path);
    },
    enableNotification() {
      this.$http
        .put("/api/v1/notification/group/user/" + this.id)
        .then(() => {
          this.notification = true;
          this.alertCheck = true;
          this.alertVariant = "success";
          this.alertMessage = "Group notifications are enabled!";
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    disableNotification() {
      this.$http
        .delete("/api/v1/notification/group/user/" + this.id)
        .then(() => {
          this.notification = false;
          this.alertCheck = true;
          this.alertVariant = "danger";
          this.alertMessage = "Group notifications are disabled!";
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    serviceNameAvatar(name) {
      let avatar = "";
      let text = name.split(/_/);
      text.forEach((f) => {
        avatar += f + " ";
      });
      return avatar;
    },
    infoService(item) {
      this.$router.push({
        name: "Service Detail",
        params: {
          id: item.inventoryId,
        },
      });
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
    updateServices($state) {
      let pageable = {
        perPage: this.perpage,
        currentPage: this.currentPage,
        filter: this.filter,
      };

      this.$http
        .get("/api/v1/group/service/" + this.id, pageable)
        .then((response) => {
          if (response.data.totalRows > this.currentPage * this.perpage) {
            if (response.data.services.length) {
              response.data.services.forEach((element) => {
                this.items.push(element);
              });
            }
            this.currentPage += 1;
            this.selectedServices = this.items;
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
  },
  created() {
    const r1 = this.$http.get(`/api/v1/group/info/${this.id}`);
    const r2 = this.$http.post(`/api/v1/notification/check/group/${this.id}`);
    const r3 = this.$http.get(
      "/api/v1/settings/generalSettings/default_system_host_name"
    );
    const r4 = this.$http.get(`/api/v1/group/service/${this.id}`, {});
    const r5 = this.$http.get(`/api/v1/service/admin`, {});

    axios
      .all([r1, r2, r3, r4, r5])
      .then(
        axios.spread((...results) => {
          this.info = results[0].data;
          this.notification = results[1].data;
          this.hostname = results[2].data;
          this.services = results[4].data;
          this.selectedServices = results[3].data;
          this.totalService = this.selectedServices.length;
          this.getServicesLoading = false;
          this.loading = false;
          this.locked = this.user.role !== "Admin";
        })
      )
      .catch((error) => {
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
    this.getServices();
  },
};
</script>
<style scoped>
.p-select__tag-icon {
  display: none;
}

.inventory-logo {
  width: 30px;
  height: 20px;
}

.clearButton {
  width: 150px;
}

.group-detail-body {
  padding: 0;
}

.group-detail-body > .card-body {
  padding: 0;
}

.inputform {
  background-color: white;
  height: 40px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.tab-pane {
  padding: 0 !important;
}
</style>
<style>
.copy-container .tab-content {
  margin-top: 0;
  background: none;
  border: none !important;
}

.copy-container .tabs .nav-item {
  font-size: 0.7rem;
}

.inceptor .nav-pills {
  margin-left: 10px;
}

.inceptor hr {
  margin-top: 5px;
  margin-bottom: 0;
}
</style>
