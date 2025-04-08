<template>
  <div>
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
    <p-card :cardBody="false">
      <div class="text-center mb-4" style="margin-top: 5px">
        <b-button v-if="userdata.username" disabled variant="link">
          <p-profile-avatar
            :profileUsername="userdata.username"
            :username="userdata.first_name + ' ' + userdata.last_name"
            :size="120"
            :imageWidth="'120px'"
            :imageHeight="'auto'"
            :username-show="false"
          />
        </b-button>
        <div v-show="userinfodiv">
          <div class="h4 mb-0">
            {{ userdata.first_name }} {{ userdata.last_name }}
          </div>
          <p>{{ userdata.status }}</p>
          <!-- <span>
              {{ userdata.tenantEntity.companyName }}
            </span> -->
            <br />
            <a :href="mailto(userdata.email)" class="mr-2 ml-2" target="_top">{{
              userdata.email
            }}</a>
            <span class="mr-2 ml-2">&#183;</span>
            <em class="fa fa-phone"></em>{{ userdata.phone }}
            <span class="mr-2 ml-2">&#183;</span>
            <a class="mr-2 ml-2" v-show="userdata.createdAt != null"
              >Member since {{ userdata.createdAt | moment("calendar") }}</a
            >
          </span>
        </div>
      </div>
      <div v-if="statisticgraph">
        <div class="d-flex justify-content-center">
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
              title=""
              type="heatmap"
            >
            </fcart>
          </VuePerfectScrollbar>
        </div>
      </div>
    </p-card>

    <b-tabs
      v-if="
        usercontroldata.role == 'Admin' ||
        usercontroldata.username == userdata.username
      "
      card
      pills
    >
      <b-tab active title="Sessions">
        <p-error
          v-if="errorStatusSessions"
          header="List operation has error!"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
        <p-loading
          v-else-if="sessionsLoading"
          class="my-5"
          message="Loading..."
        />
        <div v-else>
          <div v-if="sessions.length === 0">
            <p-initial
              icon="plus-circle"
              header="You don't have any sessions."
              message="Please start a session."
            />
          </div>
          <div v-else>
            <b-table
              :fields="sessionfields"
              :items="sessions"
              :responsive="responsive"
              hover
              show-empty
            >
              <template v-slot:cell(name)="row">
                <b-badge
                  class="ml-1"
                  v-if="row.item.sessionType == 'T'"
                  pill
                  :variant="
                    getServiceBadgeColor(row.item.serviceEntity.service_type_id)
                  "
                >
                  {{
                    getServiceTypeNameByTypeId(
                      row.item.serviceEntity.service_type_id
                    )
                  }}
                </b-badge>
                <em v-if="row.item.sessionType == 'PDA'">
                  <b-badge variant="primary">PDA</b-badge>
                </em>
                {{ row.item.serviceEntity.name }}
              </template>
              <template v-slot:cell(duration)="row">
                <p-timing :start-date="row.item.startTime" :end-date="row.item.endTime || new Date()" />
              </template>
              <template v-slot:cell(actions)="row">
                <b-button
                  @click.stop="details(row.item)"
                  class="btn"
                  title="Details"
                  type="button"
                  variant="outline-primary"
                  v-b-tooltip.bottom
                >
                  <em class="fa fa-info"></em>
                </b-button>
              </template>
            </b-table>
            <infinite-loading
              @infinite="infiniteHandlerSession"
              force-use-infinite-wrapper
            >
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </div>
        </div>
      </b-tab>
      <b-tab title="Actions">
        <p-error
          v-if="errorStatusActions"
          header="List operation has error!"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
              <p-loading
                v-else-if="actionsLoading"
                class="my-5"
                message="Loading..."
              />
        <div v-else>
          <div v-if="actions.length === 0">
            <p-initial
              icon="plus-circle"
              header="You don't have any actions."
              message="Please start an action."
            />
          </div>
          <div v-else>
            <b-table
              :fields="actionfields"
              :items="actions"
              :responsive="responsive"
              hover
              show-empty
            >
              <template v-slot:cell(servicename)="row">
                {{ row.item.sessionEntity.serviceEntity.name }}
                <em
                  class="fa fa-terminal fa-1x"
                  v-if="row.item.sessionEntity.session_type == 'T'"
                ></em>
                <em
                  class="fa fa-database fa-1x"
                  v-if="row.item.sessionEntity.session_type == 'D'"
                ></em>
                <em v-if="row.item.sessionEntity.session_type == 'PDA'">
                  <b-badge variant="primary">PDA</b-badge>
                </em>
              </template>

              <template v-slot:cell(actionTime)="row">
                <p-timing :start-date="row.item.sessionEntity.startTime" :end-date="row.item.actionTime || new Date()" />
              </template>
              <template v-slot:cell(proxy_action)="row">
                <span class="text-danger">{{ row.item.proxy_action }}</span>
              </template>
            </b-table>
            <infinite-loading
              @infinite="infiniteHandlerAction"
              force-use-infinite-wrapper
            >
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </div>
        </div>
      </b-tab>
      <b-tab title="Authentications">
        <p-error
          v-if="errorStatusAuth"
          header="List operation has error!"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
              <p-loading
                v-else-if="authLoading"
                class="my-5"
                message="Loading..."
              />
        <div v-else>
          <div v-if="authsessions.length === 0">
            <p-initial
              icon="plus-circle"
              header="You don't have any Authentications."
              message="Please start a session."
            />
          </div>
          <div v-else>
            <b-table
              :fields="sessionsuserfields"
              :items="authsessions"
              :responsive="responsive"
              hover
              show-empty
            >
              <template v-slot:cell(ip_address)="row">
                <div
                  class="text-danger"
                  :title="row.item.ip_address"
                  v-b-tooltip.bottom
                >
                  {{ row.item.ip_address }}
                </div>
              </template>
              <template v-slot:cell(attemptedAt)="row">
                <p-timing :start-date="row.item.attemptedAt" />
              </template>
              <template v-slot:cell(service)="row">
                <b-link v-if="row.item.service" @click.stop="infoService(row.item.service)">
                  <div
                    class="d-flex justify-content-start align-items-center text-primary"
                    :title="row.item.service.name"
                    v-b-tooltip.bottom
                  >
                    <div
                      v-b-tooltip.bottom
                      :title="row.item.service.serviceNameLogo"
                      :class="[
                        'inventory-logo',
                        row.item.service.serviceNameLogo,
                      ]"
                    ></div>
                    {{ row.item.service.name }}
                  </div>
                </b-link>
              </template>
              <template v-slot:cell(reason)="row">
                <span>{{ row.item.success ? "Successfully Authentication" : row.item.reason }}</span>
              </template>
              <template v-slot:cell(success)="row">
                <i v-if="row.item.success" class="fa fa-sign-in fa-lg" style="color: green" aria-hidden="true"></i>
                <i v-else class="fa fa-sign-in fa-lg" style="color: red" aria-hidden="true"></i>
              </template>
            </b-table>
            <infinite-loading
              @infinite="infiniteHandlerAuth"
              force-use-infinite-wrapper
            >
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </div>
        </div>
      </b-tab>
      <b-tab title="Services">
        <p-error
          v-if="errorStatusService"
          header="List operation has error!"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
              <p-loading
                v-else-if="servicesLoading"
                class="my-5"
                message="Loading..."
              />
        <div v-else>
          <div v-if="services.length === 0">
            <p-initial
              icon="folder-plus"
              header="You don't have any service."
              message="Please create or join a service."
            />
          </div>
          <div v-else>
            <b-table
              :fields="servicefields"
              :items="services"
              :responsive="responsive"
              hover
              show-empty
            >
              <template v-slot:cell(name)="row">

                <b-link @click.stop="infoService(row.item)">
                  <div
                    class="d-flex justify-content-start align-items-center text-primary"
                    :title="row.item.name"
                    v-b-tooltip.bottom
                  >
                    <div
                      v-b-tooltip.bottom
                      :title="row.item.serviceNameLogo"
                      :class="[
                        'inventory-logo',
                        row.item.serviceNameLogo,
                      ]"
                    ></div>
                    {{ row.item.name }}
                  </div>
                </b-link>
              </template>
            </b-table>
            <infinite-loading
              @infinite="infiniteHandlerService"
              force-use-infinite-wrapper
            >
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </div>
        </div>
      </b-tab>
      <b-tab title="Groups">
        <p-error
          v-if="errorStatusGroups"
          header="List operation has error!"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
              <p-loading
                v-else-if="groupsLoading"
                class="my-5"
                message="Loading..."
              />
        <div v-else>
          <div v-if="groups.length === 0">
            <p-initial
              icon="folder-plus"
              header="You don't have any groups."
              message="Please create or join a group."
            />
          </div>
          <div v-else>
            <b-table
              :fields="groupfields"
              :items="groups"
              :responsive="responsive"
              hover
              show-empty
            >
              <template v-slot:cell(groupname)="row">
                <b-link @click.stop="infoGroup(row.item)">
                  <div
                    class="text-primary"
                    :title="row.item.groupname"
                    v-b-tooltip.bottom
                  >
                    {{ row.item.groupname }}
                  </div>
                </b-link>
              </template>
              <template v-slot:cell(grouptype)="row">
                <div
                  class="text-primary"
                  :title="row.item.grouptype"
                >
                  <b-badge v-if="row.item.grouptype == 'public'" variant="success" pill>
                    {{row.item.grouptype}}
                  </b-badge>
                  <b-badge v-else-if="row.item.grouptype == 'private'" variant="danger" pill>
                    {{row.item.grouptype}}
                  </b-badge>
                  <span v-else >
                    {{row.item.grouptype}}
                  </span>
                  </div>
              </template>
            </b-table>
            <infinite-loading
              @infinite="infiniteHandlerGroup"
              force-use-infinite-wrapper
            >
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </div>
        </div>
      </b-tab>
      <b-tab lazy title="Policies">
        <p-error
          v-if="errorStatusPolicies"
          header="List operation has error!"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
              <p-loading
                v-else-if="policiesLoading"
                class="my-5"
                message="Loading..."
              />
        <div v-else>
          <div v-if="policies.length === 0">
            <p-initial
              icon="plus-circle"
              header="You don't have any policies."
              message="Please create a policy."
            />
          </div>
          <div v-else>
            <b-table
              :fields="policyfields"
              :items="policies"
              :responsive="responsive"
              hover
              show-empty
            >
              <template v-slot:cell(name)="row">
                  <div
                    class="d-flex justify-content-start align-items-center text-primary"
                    :title="row.item.name"
                  >
                    <div
                      :class="[
                        'inventory-logo',
                        getServiceTypeNameByTypeId(row.item.servicetype),
                      ]"
                      :title="getServiceTypeNameByTypeId(row.item.servicetype)"
                      v-b-tooltip.bottom
                    ></div>
                    {{ row.item.name }}
                  </div>
              </template>
              <template v-slot:cell(policyRegexEntity)="row">
                  <div
                    :title="row.item.policyRegexEntity"
                  >
                    <span v-for="policy in row.item.policyRegexEntity" :key= "policy.regex">
                      {{policy.regex}}
                    </span>
                  </div>
              </template>
              <template v-slot:cell(idtype)="row">
                <div
                  class="text-primary"
                  :title="row.item.idtype"
                >
                  <b-badge v-if="row.item.idtype == 'service'" variant="success" pill>
                    {{row.item.idtype}}
                  </b-badge>
                  <b-badge v-else variant="info" style="color: white" pill>
                    {{row.item.idtype}}
                  </b-badge>
                  </div>
              </template>
            </b-table>
            <infinite-loading
              @infinite="infiniteHandlerPolicy"
              force-use-infinite-wrapper
            >
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </div>
        </div>
      </b-tab>
    </b-tabs>
    </template>
  </div>
</template>


<script>
import mappage from "@/views/h2h/components/mappage";
import InfiniteLoading from "vue-infinite-loading";
import fcart from "@/views/h2h/components/frappecharts";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Avatar from "vue-avatar";
import axios from "axios";

export default {
  name: "app",
  props: ["id"],
  components: {
    mappage,
    InfiniteLoading,
    fcart,
    VuePerfectScrollbar,
    Avatar,
  },
  data() {
    return {
      errorStatus: false,
      loading: true,
      userinfodiv: false,
      statisticgraph: false,

      errorResponse: "",
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
      perPage: 10,
      data1: {},
      data2: {},
      countLabel: "Level",
      start: new Date(2018, 1, 1),
      end: new Date(),
      currentPageAction: 0,
      currentPageSession: 0,
      currentPageAuth: 0,
      currentPageService: 0,
      currentPageGroup: 0,
      currentPagePolicy: 0,
      sessionsLoading: true,
      errorStatusSessions: false,
      actionsLoading: true,
      errorStatusActions: false,
      authLoading: true,
      errorStatusAuth: false,
      servicesLoading: true,
      errorStatusService: false,
      groupsLoading: true,
      errorStatusGroups: false,
      policiesLoading: true,
      errorStatusPolicies: false,
      userdata: {
        userId: "",
        username: "",
        first_name: "",
        last_name: "",
        phone: "",
        company: "",
        email: "",
        urole: "",
        created_at: "",
        updated_at: "",
        tenantid: "",
        external: false,
        tenantEntity: {
          companyName: "",
        },
      },
      usercontroldata: {
        userId: "",
        username: " ",
        first_name: "",
        last_name: "",
        phone: "",
        company: "",
        email: "",
        urole: "",
        created_at: "",
        updated_at: "",
        tenantid: "",
        external: false,
        tenantEntity: {
          companyName: "",
        },
      },
      authsessions: [],
      sessions: [],
      actions: [],
      services: [],
      groups: [],
      policies: [],
      sessionsuserfields: [
        { key: "ipAddress", label: "Ip" },
        { key: "userAgent", label: "User Agent" },
        { key: "attemptedAt", label: "Attempt Time" },
        { key: "service", label: "Service" },
        { key: "loginType", label: "Login Type" },
        { key: "reason", label: "Reason" },
        { key: "success", label: "Status" },
      ],
      actionfields: [
        { key: "servicename", label: "Service" },
        { key: "proxy_action", label: "Action" },
        { key: "actionTime", label: "" },
      ],
      sessionfields: [
        { key: "name", label: "Service" },
        { key: "ipAddress", label: "IP Address" },
        { key: "duration", label: "" },
        { key: "actions", label: "" },
      ],
      servicefields: [
        { key: "name", label: "Service Name" },
        { key: "description", label: "Description" },
        { key: "ipAddress", label: "Ip Adress" },
      ],
      groupfields: [
        { key: "groupname", label: "Group Name" },
        { key: "description", label: "Description" },
        { key: "grouptype", sortable: true, label: "Type" },
      ],
      policyfields: [
        { key: "name", label: "Policy Name" },
        { key: "policyRegexEntity", label: "Regex" },
        { key: "idtype", sortable: true, label: "Type" },
      ],
    };
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  methods: {
    details(item) {
      this.$http
        .get("/api/v1/session/actions/" + item.sessionId)
        .then((response) => {
          if (response.status == 200) {
            if (this.actions.length == 0) {
              this.$bvToast.toast(`There is no action on this session!`, {
                title: "There is no action on this session!",
                variant: "warning",
                autoHideDelay: 5000,
              });
            } else {
              this.$router.push({
                name: "Session Detail",
                params: {
                  id: item.sessionId,
                },
              });
            }
          }
        })
        .catch(function (error) {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    mailto(mail) {
      return "mailto:" + mail;
    },
    getServiceTypeNameByTypeId(id) {
      let variant;
      switch (id) {
        case "1":
          variant = "mysql";
          break;
        case "2":
          variant = "postgresql";
          break;
        case "3":
          variant = "msserver";
          break;
        case "4":
          variant = "oracle";
          break;
        case "5":
          variant = "ssh";
          break;
        case "6":
          variant = "telnet";
          break;
        case "7":
          variant = "rdp";
          break;
        case "8":
          variant = "vnc";
          break;
        default:
          variant = "ssh";
      }
      return variant;
    },
    getServiceBadgeColor(id) {
      switch (id) {
        case 1:
          return "success";
        case 2:
          return "dark";
        case 3:
          return "primary";
        case 4:
          return "secondary";
        case 5:
          return "warning";
        case 6:
          return "secondary";
        case 7:
          return "warning";
        case 8:
          return "secondary";
        default:
          return "";
      }
    },
    infiniteHandlerAction($state) {
      let data = {
        perPage: this.perPage,
        currentPage: this.currentPageAction,
      };

      this.$http
        .post("/api/v1/action/user/" + this.id, data)
        .then((response) => {
          if (response.data.length) {
            this.currentPageAction += 1;
            response.data.forEach((f) => {
              this.actions.push(f);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    infiniteHandlerSession($state) {
      let pagination = {
        perPage: this.perPage,
        currentPage: this.currentPageSession,
      };
      let userids = [this.id];

      let data = {
        pagination: pagination,
        userids: userids,
      };

      this.$http
        .post("/api/v1/session/filter", data)
        .then((response) => {
          if (response.data.sessionEntities.length) {
            this.currentPageSession += 1;
            response.data.sessionEntities.forEach((f) => {
              this.sessions.push(f);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          console.log(error);
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    infiniteHandlerAuth($state) {
      let pagination = {
      perPage: this.perPage,
      currentPage: this.currentPageAuth,
      sort: "createddesc"
    };
      this.$http
        .post("/api/v1/auths/user/" + this.id, pagination)
        .then((response) => {
          if (!response.data.empty) {
            this.currentPageAuth += 1;
            response.data.content.forEach((f) => {
              this.authsessions.push(f);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.status == 500) {
            this.$bvToast.toast(`Sessions cant get!`, {
              title: "Sessions cant get!",
              variant: "error",
              autoHideDelay: 5000,
            });
          }
        });
    },
    infiniteHandlerService($state) {
      let sort =
        this.$route.query.sort == null ? "name" : this.$route.query.sort;
      let o = {
        perPage: this.perPage,
        currentPage: this.currentPageService,
      };
      this.$http
        .post(`/api/v1/service/user/${this.userdata.id}/${sort}`, o)
        .then((response) => {
          if (response.data.length) {
            this.currentPageService += 1;
            response.data.forEach((f) => {
              this.services.push(f);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.status == 500) {
            this.$bvToast.toast(`Service cant get!`, {
              title: "Service cant get!",
              variant: "error",
              autoHideDelay: 5000,
            });
          }
        });
    },
    infiniteHandlerPolicy($state) {
      let dataPolicy = {
        perPage: this.perPage,
        currentPage: this.currentPagePolicy,
      };
      this.$http
        .post("/api/v1/policy/policyuser/" + this.id, dataPolicy)
        .then((response4) => {
          if (response4.data.length) {
            this.currentPagePolicy += 1;
            response4.data.forEach((f) => {
              this.policies.push(f);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.status == 500) {
            this.$bvToast.toast(`Policies cant get!`, {
              title: "Policies cant get!",
              variant: "error",
              autoHideDelay: 5000,
            });
          }
        });
    },
    infiniteHandlerGroup($state) {
      let groupsdata = {
        perPage: this.perPage,
        currentPage: this.currentPageGroup,
        sort: this.$route.query.sort == null ? "name" : this.$route.query.sort,
      };
      if (this.userdata.urole == "Admin") {
        this.$http
          .post("/api/v1/group", groupsdata)
          .then((response2) => {
            if (response2.data.length) {
              response2.data.forEach((f) => {
                this.groups.push(f);
              });
              this.currentPageGroup += 1;
              $state.loaded();
            } else {
              $state.complete();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.$http
          .post(`/api/v1/group/user/${this.id}`, groupsdata)
          .then((response) => {
            if (response.data.length) {
              response.data.forEach((f) => {
                this.groups.push(f);
              });

              this.currentPageGroup += 1;

              $state.loaded();
            } else {
              $state.complete();
            }
          })
          .catch((error) => {
            console.log(error);
            this.errorStatus = true;
            this.errorResponse = error;
          });
      }
    },
    getServices() {
      let sort =
        this.$route.query.sort == null ? "name" : this.$route.query.sort;
      let o = {
        perPage: this.perPage,
        currentPage: this.currentPageService,
        filter: this.filter,
      };
      this.$http
        .post(`/api/v1/service/user/${this.userdata.username}/${sort}`, o)
        .then((response) => {
          this.currentPageService += 1;
          response.data.forEach((f) => {
            this.services.push(f);
          });
          this.servicesLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.servicesLoading = false;
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    infoService(item) {
      this.$router.push({
        name: "Service Detail",
        params: {
          id: item.inventoryId,
        },
        query: { sort: "createddesc" },
      });
    },
    getGroups() {
      let groupsdata = {
        perPage: this.perPage,
        currentPage: this.currentPageGroup,
        sort: this.$route.query.sort == null ? "name" : this.$route.query.sort,
      };
      if (this.userdata.urole == "Admin") {
        this.$http
          .post("/api/v1/group", groupsdata)
          .then((response2) => {
            response2.data.forEach((f) => {
              this.groups.push(f);
            });
            this.currentPageGroup += 1;
            this.groupsLoading = false;
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.$http
          .post(`/api/v1/group/user/user/${this.id}`, groupsdata)
          .then((response) => {
            this.currentPageGroup += 1;
            response.data.forEach((f) => {
              this.groups.push(f);
            });
            this.groupsLoading = false;
          })
          .catch((error) => {
            console.log(error);
            this.groupsLoading = false;
            this.errorStatus = true;
            this.errorResponse = error;
          });
      }
    },
    infoGroup(item) {
      this.$router.push({
        name: "Group Detail",
        params: {
          id: item.groupid,
        },
      });
    },
  },
  created() {
    // get one year before
    let currentDate = new Date();
    this.start = new Date(
      currentDate.getFullYear() - 1,
      currentDate.getMonth(),
      currentDate.getDay()
    );
    let data = {
      perPage: this.perPage,
      currentPage: this.currentPageAction,
    };
    let pagination = {
      perPage: this.perPage,
      currentPage: this.currentPageSession,
      sort: "createddesc"
    };
    let userids = [this.id];

    let data2 = {
      pagination: pagination,
      userids: userids,
    };

    let dataPolicy = {
      perPage: this.perPage,
      currentPage: this.currentPagePolicy,
    };
    const r1 = this.$http.post("/api/v1/action/user/" + this.id, data);
    const r2 = this.$http.post("/api/v1/session/filter", data2);
    const r3 = this.$http.get("/api/v1/user/id/" + this.id);
    const r4 = this.$http.get("/api/v1/session/statistic/user/" + this.id);
    const r5 = this.$http.post("/api/v1/auths/user/" + this.id, pagination);
    const r6 = this.$http.get("/api/v1/user/who");
    const r7 = this.$http.post("/api/v1/policy/user/" + this.id, dataPolicy);

    axios
      .all([r1, r2, r3, r4, r5, r6, r7])
      .then(
        axios.spread((...results) => {
          this.currentPageAction += 1;
          results[0].data.forEach((f) => {
            this.actions.push(f);
          });
          this.actionsLoading = false;
          this.currentPageSession += 1;
          results[1].data.sessionEntities.forEach((f) => {
            this.sessions.push(f);
          });
          this.sessionsLoading = false;

          this.userdata = results[2].data;
          this.userinfodiv = true;
          this.getServices();
          this.getGroups();

          results[3].data.forEach((f) => {
            this.data1[f.sessions] = f.cnt;
          });
          this.statisticgraph = true;

          this.currentPageAuth += 1;
          results[4].data.content.forEach((f) => {
            this.authsessions.push(f);
          });
          this.authLoading = false;

          this.usercontroldata = results[5].data;

          results[6].data.forEach((f) => {
            this.policies.push(f);
          });
          this.currentPagePolicy += 1;
          this.policiesLoading = false;
          this.loading = false;
        })
      )
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.actionsLoading = false;
        this.sessionsLoading = false;
        this.errorStatusSessions = true;
        this.statisticgraph = true;
        this.userinfodiv = true;
        this.authLoading = false;
        this.errorStatusAuth = true;
        this.policiesLoading = false;
        this.errorStatusPolicies = true;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "User Profile Loading got an error";
      });
  },
};
</script>

<style>
.inventory-logo {
  width: 30px;
  height: 20px;
}

.scrollperfect {
  position: relative;
  margin: auto;
  height: auto;
}
</style>
