<template>
  <div>
    <div>
      <b-alert v-model="alertCheck" :variant="alertVariant" dismissible>
        {{ alertMessage }}
      </b-alert>
    </div>
    <p-card>
      <p-loading
        v-if="
          statisticGraphLoading || loadingServiceInfo || loadingServiceGroup
        "
        class="my-5"
        message="Loading..."
      />
      <p-error
        v-else-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <template v-else>
        <div class="d-flex justify-content-between flex-row align-bottom">
          <div class="d-flex justify-content-center">
            <div class="mr-2">
              <avatar
                :rounded="false"
                :size="110"
                :username="serviceNameAvatar(info.name)"
                color="#fff"
              ></avatar>
            </div>
            <div>
              <div class="d-flex justify-content-start flex-column">
                <div>
                  <h3>{{ info.name }}</h3>
                </div>
                <div>
                  <h4>{{ info.description }}</h4>
                </div>
                <div class="d-flex justify-content-start pt-1">
                  <div v-if="info.createdAt != null">
                    <p-timing title="Created At" :start-date="info.createdAt" />
                  </div>
                  <div>
                    &nbsp;
                    <span>&#183;</span>
                    &nbsp;
                  </div>
                  <div v-if="info.lastAccessTime">
                    <p-timing
                      title="Last Accessed At"
                      :start-date="info.lastAccessTime"
                    />
                  </div>
                </div>
                <div>
                  ID: {{ id }} <p-copy :copyItem="id"></p-copy>
                  <template v-if="info.ipAddress">
                    <span>&#183;</span>&nbsp;&nbsp; IP: {{ info.ipAddress }}
                    <p-copy :copyItem="info.ipAddress"></p-copy>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="ml-auto">
            <div class="d-flex justify-content-start">
              <div
                v-if="info.serviceNameLogo !== 'unknown'"
                :class="['inventory-logo', info.serviceNameLogo]"
                :title="serviceNameLogo"
                v-b-tooltip.bottom
              ></div>
              <div
                v-if="info.serviceTypeLogo !== 'unknown'"
                :class="['inventory-logo', info.serviceTypeLogo]"
                :title="serviceTypeLogo"
                v-b-tooltip.bottom
              ></div>
              <div class="pl-1">
                <b-button
                  @click.stop="showStats = !showStats"
                  :variant="showStats ? 'danger' : 'light'"
                  v-b-tooltip.hover.bottom="'Show Stats'"
                >
                  <b-icon
                    :icon="showStats ? 'arrow-bar-up' : 'arrow-bar-down'"
                  />
                </b-button>
              </div>
              <div class="pl-1">
                <b-button
                  @click.stop="addFavorite"
                  variant="light"
                  v-show="!favorite"
                  v-b-tooltip.hover.bottom="'Mark it'"
                >
                  <em class="fa fa-star-o mr-1"></em>
                </b-button>
                <b-button
                  @click.stop="delFavorite"
                  variant="light"
                  v-show="favorite"
                  v-b-tooltip.hover.bottom="'Marked'"
                >
                  <em class="fa fa-star mr-1"></em>
                </b-button>
              </div>
              <div class="pl-1">
                <b-button
                  @click.stop="disableNotification"
                  variant="success"
                  v-show="notification"
                >
                  <em class="fa fa-bell mr-1"></em>
                  <span class="d-sm-down-none">Notification</span>
                </b-button>
                <b-button
                  @click.stop="enableNotification"
                  variant="danger"
                  v-show="!notification"
                >
                  <em class="fa fa-bell-slash mr-1"></em>
                  <span class="d-sm-down-none">Notification</span>
                </b-button>
              </div>
              <div v-if="isAdminForService" class="pl-1">
                <template
                  v-if="
                    info.serviceNameLogo === 'windows' &&
                    info.serviceTypeLogo === 'rdp'
                  "
                >
                  <b-button
                    variant="primary"
                    @click="
                      $router.push({
                        path: `/service/create-application/${id}`,
                      })
                    "
                    v-if="info.originId === null"
                  >
                    <i class="fa fa-plus mr-1" aria-hidden="true"></i>Add
                    Application
                  </b-button>
                </template>
                <b-dropdown
                  v-else-if="servicesGroup.length === 0"
                  class="dropdownClass"
                  text="Agents Not Found"
                  variant="danger"
                  size="md"
                >
                  <b-dropdown-text class="dropdowntext">
                    <div style="width: inherit">
                      <span>
                        The group to which the service belongs
                        <br />was not found
                      </span>
                    </div>
                  </b-dropdown-text>
                </b-dropdown>
                <b-dropdown
                  v-else-if="runner !== ''"
                  class="dropdownClass large-area"
                  variant="primary"
                  size="md"
                >
                  <template #button-content>
                    <em class="fa fa-download mr-1"></em>
                    Install Agent
                  </template>
                  <b-dropdown-text class="dropdowntext">
                        <b-input-group class="inputgroup">
                          <b-form-input
                            class="inputform"
                            :readonly="true"
                            :value="
                              getAgent(runnerShell, 'download-linuxagent')
                            "
                          ></b-form-input>
                          <p-copy
                            :copyItem="copyKey"
                            @click="
                              copyAgent(runnerShell, 'download-linuxagent')
                            "
                          />
                        </b-input-group>
                      </b-dropdown-text>
                </b-dropdown>
                <b-dropdown
                  v-else
                  class="dropdownClass"
                  text="Agents Not Found"
                  variant="danger"
                  size="md"
                >
                  <b-dropdown-text class="dropdowntext">
                    <div style="width: inherit">
                      <span>
                        No agent compatible with the service's
                        <br />operating system found
                      </span>
                    </div>
                  </b-dropdown-text>
                </b-dropdown>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-center" v-if="showStats">
          <VuePerfectScrollbar class="scrollperfect" v-once>
            <fcart
              :colors="colors"
              :countLabel="countLabel"
              :dataPoints="data1"
              :dataSets="avc"
              :endDate="end"
              :height="200"
              :labels="labels"
              :startDate="start"
              id="app2"
              title
              type="heatmap"
            ></fcart>
          </VuePerfectScrollbar>
        </div>
      </template>
    </p-card>

    <p-card class="group-detail-body">
      <div class="input-group mb-3 mt-3">
        <b-form-input
          class="form-control search-input"
          size="sm"
          placeholder="Entry Group Info"
          type="text"
          v-model="tempFilter"
          @keydown.enter="searchFilter"
        ></b-form-input>
      </div>

      <div v-if="servicesGroup.length == 0">
        <p-empty message="You don't have any groups" />
      </div>
      <div v-else>
        <ul class="list-group list-group-flush">
          <li
            class="
              list-group-item
              d-flex
              justify-content-between
              align-items-center
            "
            v-for="item in servicesGroup"
            :key="item.groupId"
          >
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <avatar
                  :rounded="false"
                  :size="40"
                  :username="item.groupname"
                ></avatar>
              </div>
              <div style="margin-left: 15px">
                <b-link @click.stop="infoGroup(item)">
                  <p class="mb-1">
                    <strong>{{ item.groupname }}</strong>
                  </p>
                </b-link>
                <small :class="item.description ? 'mr-1' : ''">{{
                  item.description
                }}</small>
                <b-badge
                  v-if="item.groupCategory == 'ldap'"
                  variant="primary"
                  title="LDAP Group"
                  v-b-tooltip.bottom
                >
                  LDAP
                </b-badge>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </p-card>
  </div>
</template>

<script>
import Avatar from "vue-avatar";
import fcart from "@/views/h2h/components/frappecharts";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "ServiceDetailPage",
  props: ["id"],
  components: {
    Avatar,
    fcart,
    VuePerfectScrollbar,
  },
  data() {
    return {
      isAdminForService: false,
      showStats: false,
      alertCheck: false,
      alertVariant: "success",
      alertMessage: "",
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      checkStatus: false,
      LiveSessionsPagemessage: "",
      credential: "",
      code: 0,
      confirm: null,
      reason: "",
      locked: true,
      settings: {
        default_system_host_name: "",
        default_system_host_port: "",
      },
      servicesGroup: [],
      copyKey: "",
      notification: false,
      favorite: false,
      userid: "",
      statisticGraphLoading: true,
      avc: [],
      colors: ["#ebedf0", "#c0ddf9", "#73b3f3", "#3886e1", "#17459e"],
      labels: [
        "12am-3am",
        "3am-6am",
        "6am-9am",
        "9am-12pm",
        "12pm-3pm",
        "3pm-6pm",
        "6pm-9pm",
        "9pm-12am",
      ],
      data1: {},
      data2: {},
      countLabel: "Level",
      start: new Date(2018, 1, 1),
      end: new Date(),
      perPage: 20,
      currentPageAction: 0,
      currentPageSession: 0,
      info: {
        name: "loading",
      },
      filter: this.$route.params.id,
      runner: "",
      runnerShell: "",
      loadingServiceInfo: true,
      loadingServiceGroup: true,
      tempFilter: null,
      totalGroup: 0,
      getGroupsLoading: true,
    };
  },
  computed: {
    ...mapGetters({ userToken: "auth/token" }),
    ...mapGetters({
      user: "auth/user",
    }),
    serviceNameLogo() {
      if (this.info == null || this.info.serviceNameLogo === "unknown") {
        return "";
      }

      if (this.info.operatingSystemVersion) {
        return (
          this.info.serviceNameLogo + " " + this.info.operatingSystemVersion
        );
      }

      return this.info.serviceNameLogo;
    },
    serviceTypeLogo() {
      if (this.info == null || this.info.serviceTypeLogo === "unknown") {
        return "";
      }

      return this.info.serviceTypeLogo;
    },
  },
  methods: {
    searchFilter() {
      this.$http.post(`/api/v1/service/groups/${this.id}`, { filter: this.tempFilter })
      .then(response => {
        this.servicesGroup = response.data;
      }).catch(error => {
        console.log(error);
      })
    },
    infoGroup(item) {
      this.$router.push({
        name: "Group Detail",
        params: {
          id: item.groupId,
        },
      });
    },
    getAgent(runner, path) {
      return `curl https://${this.settings.default_system_host_name}/${path}/${runner} --output ${runner} --insecure && sudo bash ./${runner} -- -H ${this.settings.default_system_host_name} -s ${this.id}`;
    },
    onCopy() {
      this.$bvToast.toast(this.message, {
        title: "Success Copy",
        variant: "info",
        autoHideDelay: 5000,
      });
    },
    copyAgent(runner, path) {
      this.message = "Agent successfully copied";
      this.copyKey = this.getAgent(runner, path);
    },
    addFavorite() {
      this.$http
        .put("/api/v1/fav/mark/" + this.id)
        .then(() => {
          this.favorite = true;
          this.alertCheck = true;
          this.alertVariant = "success";
          this.alertMessage = "Service is added marked services!";
        })
        .catch((error) => {
          console.log(error);
        });
    },
    delFavorite() {
      this.$http
        .delete("/api/v1/fav/mark/" + this.id)
        .then(() => {
          this.favorite = false;
          this.alertCheck = true;
          this.alertVariant = "danger";
          this.alertMessage = "Service is removed in marked services!";
        })
        .catch((error) => {
          console.log(error);
        });
    },
    enableNotification() {
      this.$http
        .put("/api/v1/notification/service/user/" + this.id)
        .then(() => {
          this.notification = true;
          this.alertCheck = true;
          this.alertVariant = "success";
          this.alertMessage = "Service notifications are enabled!";
        })
        .catch((error) => {
          console.log(error);
        });
    },
    disableNotification() {
      this.$http
        .delete("/api/v1/notification/service/user/" + this.id)
        .then(() => {
          this.notification = false;
          this.alertCheck = true;
          this.alertVariant = "danger";
          this.alertMessage = "Service notifications are disabled!";
        })
        .catch((error) => {
          console.log(error);
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
  },
  created() {
    const r1 = this.$http.get(`/api/v1/session/statistic/service/${this.id}`);
    const r2 = this.$http.get(`/api/v1/service/id/${this.id}`);
    const r3 = this.$http.post(`/api/v1/service/groups/${this.id}`, { filter: this.tempFilter });
    const r4 = this.$http.get(
      `/api/v1/fav/check/${this.user.userId}/${this.id}`
    );
    const r5 = this.$http.post(`/api/v1/notification/check/service/${this.id}`);
    const r6 = this.$http.get(
      "/api/v1/settings/generalSettings/default_system_host_name"
    );

    const r7 = this.$http.get(
      "/api/v1/settings/generalSettings/default_system_host_port"
    );

    const r8 = this.$http.get("/api/v1/service/role/" + this.id);

    axios
      .all([r1, r2, r3, r4, r5, r6, r7, r8])
      .then(
        axios.spread((...results) => {
          this.currentPageSession += 1;
          results[0].data.forEach((f) => {
            this.data1[f.sessions] = f.cnt;
          });
          this.statisticGraphLoading = false;

          this.info = results[1].data;
          if (this.info.serviceNameLogo === "ubuntu") {
            this.runner = `pdagent-ubuntu1804.run`;
            this.runnerShell = `pdagent-ubuntu1804.run`;
          } else if (this.info.serviceNameLogo === "centos") {
            this.runner = `pdagent-centos${this.info.operatingSystemVersion}.run`;
            this.runnerShell = `pdagent-centos${this.info.operatingSystemVersion}-amd64.run`;
          } else if (this.info.serviceNameLogo === "redhat") {
            this.runner = `pdagent-redhat${this.info.operatingSystemVersion}.run`;
            this.runnerShell = `pdagent-redhat${this.info.operatingSystemVersion}-amd64.run`;
          } else if (this.info.serviceNameLogo === "oracle_linux") {
            this.runner = `pdagent-oracle${this.info.operatingSystemVersion}.run`;
            this.runnerShell = `pdagent-oracle${this.info.operatingSystemVersion}-amd64.run`;
          } else if (this.info.serviceNameLogo === "suse") {
            this.runner = `pdagent-suse${this.info.operatingSystemVersion}.run`;
            this.runnerShell = `pdagent-suse${this.info.operatingSystemVersion}-amd64.run`;
          } else {
            this.runner = "";
            this.runnerShell = "";
          }
          this.loadingServiceInfo = false;
          this.credential = results[1].data.credantial;
          this.info = results[1].data;

          this.servicesGroup = results[2].data;
          this.loadingServiceGroup = false;
          this.favorite = results[3].status == 200;
          this.notification = results[4].status == 200;
          this.settings.default_system_host_name = results[5].data;
          this.settings.default_system_host_port = results[6].data;
          this.isAdminForService = results[7].data == "ADMIN";
        })
      )
      .catch((error) => {
        console.log(error);
        this.statisticGraphLoading = false;
        this.loadingServiceInfo = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    this.code = Math.floor(Math.random() * 10000);
    let currentDate = new Date();
    this.start = new Date(
      currentDate.getFullYear() - 1,
      currentDate.getMonth(),
      currentDate.getDay()
    );
    if (this.user.role === "Admin") {
      this.locked = false;
    } else {
      this.locked = true;
    }
  },
};
</script>

<style scoped>
.scrollperfect {
  position: relative;
  margin: auto;
  height: auto;
}

.inventory-logo {
  width: 40px;
  height: 30px;
}

.dropdownClass {
  white-space: nowrap;
  width: 100%;
}

.inputform {
  background-color: white;
  height: 40px;
}

.clearButton {
  width: 150px;
}

.dropdown-menu.show .dropdowntext .b-dropdown-text {
  padding: 10px;
}
</style>
