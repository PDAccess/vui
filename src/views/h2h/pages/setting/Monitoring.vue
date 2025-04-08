<template>
  <div>
    <div v-if="errorStatus">
      <p-error
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="getActions"
      />
    </div>
    <div v-else>
      <div>
        <b-card-group>
          <p-card :cardBody="false">
            <h5>
              System Status:
              <b-badge :variant="systemStatus == 'OK' ? 'success' : 'error'">{{
                systemStatus
              }}</b-badge>
            </h5>
          </p-card>
          <p-card :cardBody="false">
            <h5 class="text-center">
              System Version
              <b-badge variant="warning">{{ systemVersion.version }}</b-badge>
            </h5>
          </p-card>
        </b-card-group>
        <b-card-group>
          <p-card :cardBody="false">
            <h2 class="text-center">Services</h2>
            <hr />
            <b-button
              block
              variant="primary"
              class="mb-2 mt-2"
              to="/service/create"
            >
              Create New Service
            </b-button>
          </p-card>
          <p-card :cardBody="false">
            <h2 class="text-center">Groups</h2>
            <hr />
            <b-button
              block
              variant="primary"
              class="mb-2 mt-2"
              to="/groups/create"
              >Create New Group</b-button
            >
          </p-card>
          <p-card :cardBody="false">
            <h2 class="text-center">Credentials</h2>
            <hr />
            <b-button
              block
              variant="primary"
              class="mb-2 mt-2"
              to="/credentials/create"
              >New Credential</b-button
            >
          </p-card>
        </b-card-group>
        <b-card-group>
          <p-card :cardBody="false">
            <div class="text-center" v-if="loadingShow">
              <b-spinner variant="primary" label="Spinning"></b-spinner>
            </div>
            <b-card-text v-else>
              <div class="float-left">
                <p>Total number of services</p>
              </div>
              <div class="float-right">
                <p class="text-right">{{ statistics.totalServices }}</p>
              </div>
              <div class="clearfix"></div>
              <div class="float-left">
                <p>Total number of terminal services</p>
              </div>
              <div class="float-right">
                <p class="text-right">{{ statistics.totalTerminalServices }}</p>
              </div>
              <div class="clearfix"></div>
              <div class="float-left">
                <p>Total number of database services</p>
              </div>
              <div class="float-right">
                <p class="text-right">{{ statistics.totalDatabaseServices }}</p>
              </div>
              <div class="clearfix"></div>
              <div class="float-left">
                <p>Online Sessions</p>
              </div>
              <div class="float-right">
                <p class="text-right">{{ statistics.totalOnlineSession }}</p>
              </div>
              <div class="clearfix"></div>
            </b-card-text>
          </p-card>
          <p-card :cardBody="false">
            <div class="text-center" v-if="loadingShow">
              <b-spinner variant="primary" label="Spinning"></b-spinner>
            </div>
            <b-card-text v-else>
              <div class="float-left">
                <p>Total number of groups</p>
              </div>
              <div class="float-right">
                <p class="text-right">{{ statistics.totalGroups }}</p>
              </div>
              <div class="clearfix"></div>
              <div class="float-left">
                <p>Total MySql Services</p>
              </div>
              <div class="float-right">
                <p class="text-right">{{ statistics.totalMysql }}</p>
              </div>
              <div class="clearfix"></div>
              <div class="float-left">
                <p>Total Postgresql Services</p>
              </div>
              <div class="float-right">
                <p class="text-right">{{ statistics.totalPostgresql }}</p>
              </div>
              <div class="clearfix"></div>
              <div class="float-left">
                <p>Total MsSql Services</p>
              </div>
              <div class="float-right">
                <p class="text-right">{{ statistics.totalMssql }}</p>
              </div>
              <div class="clearfix"></div>
              <div class="float-left">
                <p>Total Oracle Services</p>
              </div>
              <div class="float-right">
                <p class="text-right">{{ statistics.totalOracle }}</p>
              </div>
              <div class="clearfix"></div>
            </b-card-text>
          </p-card>
          <p-card :cardBody="false">
            <div class="text-center" v-if="loadingShow">
              <b-spinner variant="primary" label="Spinning"></b-spinner>
            </div>
            <b-card-text v-else>
              <div class="float-left">
                <p>Total Credentails</p>
              </div>
              <div class="float-right">
                <p class="text-right">{{ statistics.totalVault }}</p>
              </div>
              <div class="float-left">
                <p>Total number of actions</p>
              </div>
              <div class="float-right">
                <p class="text-right">{{ statistics.totalActions }}</p>
              </div>
              <div class="clearfix"></div>
              <div class="float-left">
                <p>Total SSH Services</p>
              </div>
              <div class="float-right">
                <p class="text-right">{{ statistics.totalSsh }}</p>
              </div>
              <div class="clearfix"></div>
              <div class="float-left">
                <p>Total Telnet Services</p>
              </div>
              <div class="float-right">
                <p class="text-right">{{ statistics.totalTelnet }}</p>
              </div>
              <div class="clearfix"></div>
              <div class="float-left">
                <p>Total RDP Services</p>
              </div>
              <div class="float-right">
                <p class="text-right">{{ statistics.totalRdp }}</p>
              </div>
              <div class="clearfix"></div>
              <div class="float-left">
                <p>Total VNC Services</p>
              </div>
              <div class="float-right">
                <p class="text-right">{{ statistics.totalVnc }}</p>
              </div>
              <div class="clearfix"></div>
            </b-card-text>
          </p-card>
        </b-card-group>
        <b-card-group>
          <p-card :cardBody="false">
            <h3>Latest Services</h3>
            <hr />
            <div class="text-center" v-if="loadingShow">
              <b-spinner variant="primary" label="Spinning"></b-spinner>
            </div>
            <b-card-text
              v-for="service in statistics.latestServices"
              v-bind:key="service.inventoryId"
              v-else
            >
              <div class="float-left">
                <router-link :to="'/service/detail/' + service.inventoryId">
                  <span
                    class="d-inline-block text-truncate"
                    style="max-width: 150px"
                    v-b-tooltip.hover-bottom
                    :title="service.name"
                    >{{ service.name }}</span
                  >
                </router-link>
              </div>
              <div class="float-right">
                <p class="text-right">
                  {{ getDate(service.createdAt) }}
                </p>
              </div>
              <div class="clearfix"></div>
            </b-card-text>
          </p-card>
          <p-card :cardBody="false">
            <h3>Latest Groups</h3>
            <hr />
            <div class="text-center" v-if="loadingShow">
              <b-spinner variant="primary" label="Spinning"></b-spinner>
            </div>
            <b-card-text
              v-for="group in statistics.latestGroups"
              v-bind:key="group.groupId"
              v-else
            >
              <div class="float-left">
                <router-link :to="'/groups/detail/' + group.groupId">
                  <p>{{ group.groupname }}</p>
                </router-link>
              </div>
              <div class="float-right">
                <p class="text-right">{{ getDate(group.createdAt) }}</p>
              </div>
              <div class="clearfix"></div>
            </b-card-text>
          </p-card>
          <p-card :cardBody="false">
            <h3>Most Active Services</h3>
            <hr />
            <div class="text-center" v-if="loadingShow">
              <b-spinner variant="primary" label="Spinning"></b-spinner>
            </div>
            <b-card-text
              v-for="service in statistics.mostActiveServices"
              v-bind:key="service.inventoryId"
              v-else
            >
              <div class="float-left">
                <router-link :to="'/service/detail/' + service.inventoryId">
                  <p>{{ service.name }}</p>
                </router-link>
              </div>
              <div class="float-right">
                <p class="text-right">{{ getDate(service.createdAt) }}</p>
              </div>
              <div class="clearfix"></div>
            </b-card-text>
          </p-card>
        </b-card-group>
      </div>
      <div>
        <b-card class="text-center">
          <p-loading
            v-if="sessionGraphLoading || actionGraphLoading"
            class="my-5"
            message="Loading..."
          />
          <template v-else>
            <h4>Session Activity</h4>

            <div class="d-flex justify-content-center">
              <VuePerfectScrollbar class="scrollperfect" v-once>
                <fcart
                  id="app2"
                  :labels="labels"
                  title=""
                  type="heatmap"
                  :height="200"
                  :colors="colors"
                  :dataPoints="data1"
                  :dataSets="avc"
                  :startDate="start"
                  :endDate="end"
                  :countLabel="countLabel"
                >
                </fcart>
              </VuePerfectScrollbar>
            </div>

            <br />
            <h4>Action Activity</h4>
            <div class="d-flex justify-content-center">
              <VuePerfectScrollbar class="scrollperfect" v-once>
                <fcart
                  id="app2"
                  :labels="labels"
                  title=""
                  type="heatmap"
                  :height="200"
                  :colors="colors"
                  :dataPoints="data2"
                  :dataSets="avc"
                  :startDate="start"
                  :endDate="end"
                  :countLabel="countLabel"
                >
                </fcart>
              </VuePerfectScrollbar>
            </div>
          </template>
        </b-card>
      </div>
    </div>
  </div>
</template>
<script>
import fcart from "@/views/h2h/components/frappecharts.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import axios from "axios";

export default {
  components: {
    fcart,
    VuePerfectScrollbar,
  },
  data() {
    return {
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
      sessionGraphLoading: true,
      actionGraphLoading: true,
      statistics: null,
      loadingShow: true,
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      systemStatus: "",
      systemVersion: "",
    };
  },
  methods: {
    getDate(date) {
      return this.$moment(date).fromNow();
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

    const r1 = this.$http.get("/api/v1/system/status");
    const r2 = this.$http.get("/api/v1/system/version");
    const r3 = this.$http.get("/api/v1/admin/statistics");
    const r4 = this.$http.get("/api/v1/session/statistic/admin");
    const r5 = this.$http.get("/api/v1/action/statistics");

    axios
      .all([r1, r2, r3, r4, r5])
      .then(
        axios.spread((...results) => {
          this.loadingShow = false;
          this.systemStatus = "OK";
          this.loadingShow = false;
          this.systemVersion = results[1].data;
          this.loadingShow = false;
          this.statistics = results[2].data;
          results[3].data.forEach((f) => {
            this.data1[f.sessions] = f.cnt;
          });
          this.sessionGraphLoading = false;
          results[4].data.forEach((f) => {
            this.data2[f.actions] = f.cnt;
          });
          this.actionGraphLoading = false;
        })
      )
      .catch((error) => {
        this.systemStatus = "ERROR";
        this.sessionGraphLoading = false;
        this.actionGraphLoading = false;
        this.loadingShow = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
  },
};
</script>

<style>
.scrollperfect {
  position: relative;
  margin: auto;
  height: auto;
}
</style>
