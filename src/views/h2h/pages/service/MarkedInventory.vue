<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <p-error
        v-if="errorStatus"
        header="List operation has error!"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <p-loading v-else-if="loading" class="my-5" message="Loading..." />
      <div v-else-if="items.length === 0">
        <p-initial
          icon="star"
          header="You don't have any marked service"
          message="Please mark a service."
        />
      </div>
      <div v-else>
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
              v-for="(item, index) in items"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex justify-content-center align-items-center">
                  <b-button variant="link" @click.stop="infoService(item)">
                    <avatar
                      :rounded="false"
                      :size="40"
                      :username="serviceNameAvatar(item.name)"
                    ></avatar>
                  </b-button>
                  <div
                    v-b-tooltip.bottom
                    :title="item.serviceNameLogo"
                    :class="['inventory-logo', 'mx-auto', item.serviceNameLogo]"
                  ></div>
                  <div
                    v-b-tooltip.bottom
                    :title="item.serviceTypeLogo"
                    :class="['inventory-logo', 'mx-auto', item.serviceTypeLogo]"
                  ></div>
                </div>
                <div style="margin-left: 15px">
                  <b-link @click.stop="infoService(item)">
                    <p class="mb-1">
                      <strong>{{ item.name }} </strong>
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
              <div class="d-flex align-items-center">
                <p>
                  <strong>{{ item.created_at | moment("calendar") }}</strong>
                </p>
              </div>
            </li>
            <infinite-loading @infinite="updateTable" force-use-infinite-wrapper>
              <div slot="no-more"></div>
              <div slot="no-results"></div>
            </infinite-loading>
          </ul>
        </p-card>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from "vue-avatar";
import { mapGetters } from "vuex";
import InfiniteLoading from "vue-infinite-loading";

export default {
  components: {
    Avatar,
    InfiniteLoading
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  data() {
    return {
      items: [],
      loading: true,
      errorStatus: false,
      errorResponse: "",
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
      sortBy: null,
      sessions: [],
      currentPage: 0,
      perPage: 15,
      filter: null,
      tempFilter: null,
    };
  },
  methods: {
    getServices() {
      this.loading = true;
      this.currentPage = 0;
      let sort =
        this.$route.query.sort == null ? "name" : this.$route.query.sort;
      let filter =
        this.$route.query.filter == null ? "" : this.$route.query.filter;
      let o = {
        perPage: this.perPage,
        currentPage: this.currentPage,
        filter: filter,
        category: "joined"
      };
      this.$http
        .post("/api/v1/service/sort/" + sort, o)
        .then((response) => {
          this.currentPage += 1;
          this.items = response.data;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
        });
    },
    updateTable($state) {
      let sort =
        this.$route.query.sort == null ? "name" : this.$route.query.sort;
      let filter =
        this.$route.query.filter == null ? "" : this.$route.query.filter;
      let o = {
        perPage: this.perPage,
        currentPage: this.currentPage,
        filter: filter,
        category: "joined"
      };
      this.$http
        .post("/api/v1/service/sort/" + sort, o)
        .then((response) => {
          if (response.data.length) {
            this.currentPage += 1;
            response.data.forEach((element) => {
              this.items.push(element);
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
    serviceNameAvatar(name) {
      let avatar = "";
      let text = name.split(/_/);
      text.forEach((f) => {
        avatar += f + " ";
      });
      return avatar;
    },
    infoService(item, index, button) {
      this.$router.push({
        name: "Service Detail",
        params: {
          id: item.inventory_id,
        },
      });
    },
    details(item, index, button) {
      if (item.sessions.length == 0) {
        this.$message({
          message: "There is no session on this inventory",
          type: "info",
        });
      } else {
        axios
          .post("/getinventorysessions", {
            id: item.inventory_id,
          })
          .then((response) => {
            if ((response.status = 200)) {
              this.sessions = response.data;
              this.$refs.myModalRef.show();
            }
          })
          .catch(function (error) {
            console.log(error);
            this.errorStatus = true;
            this.errorResponse = error;
          });
      }
    },
    connect(item) {
      let service_type;
      if (item.service_type_id < 4) {
        service_type = "D";
      } else {
        service_type = "T";
      }

      let port = "80";
      let uri = "/term/connect/";
      let width = 800;
      let height = 500;
      if (service_type === "D") {
        port = "80";
        uri = "/db/sql/";
        width = 992;
        height = 504;
      }
      let proxyWindow = window.open(
        "",
        "",
        "width=" +
          width +
          ",height=" +
          height +
          ",location=0,toolbar=0,menubar=no"
      );
      let styleEl = proxyWindow.document.createElement("style");
      proxyWindow.document.head.appendChild(styleEl);
      let styleSheet = styleEl.sheet;
      let rules = [
        ["html, body", ["height", "95%"]],
        [
          ".body",
          ["display", "flex"],
          ["align-items", "center"],
          ["justify-content", "center"],
          ["background-color", "rgba(0, 0, 0, 0.7)"],
        ],
        [
          ".spinner",
          ["margin", "100px auto 0"],
          ["width", "70px"],
          ["text-align", "center"],
        ],
        [
          ".spinner > div",
          ["width", "18px"],
          ["height", "18px"],
          ["background-color", "#1E90FF"],
          ["border-radius", "100%"],
          ["display", "inline-block"],
          [
            "-webkit-animation",
            "sk-bouncedelay 1.4s infinite ease-in-out both",
          ],
          ["animation", "sk-bouncedelay 1.4s infinite ease-in-out both"],
        ],
        [
          ".spinner .bounce1",
          ["-webkit-animation-delay", "-0.32s"],
          ["-animation-delay", "-0.32s"],
        ],
        [
          ".spinner .bounce2",
          ["-webkit-animation-delay", "-0.16s"],
          ["animation-delay", "-0.16s"],
        ],
      ];
      for (let i = 0, rl = rules.length; i < rl; i++) {
        let j = 1,
          rule = rules[i],
          selector = rules[i][0],
          propStr = "";
        for (let pl = rule.length; j < pl; j++) {
          let prop = rule[j];
          propStr +=
            prop[0] + ":" + prop[1] + (prop[2] ? " !important" : "") + ";\n";
        }
        styleSheet.insertRule(
          selector + "{" + propStr + "}",
          styleSheet.cssRules.length
        );
      }
      styleSheet.insertRule(
        "@-webkit-keyframes sk-bouncedelay {0%, 80%, 100% { -webkit-transform: scale(0) }40% { -webkit-transform: scale(1.0) }}",
        styleSheet.cssRules.length
      );
      styleSheet.insertRule(
        "@keyframes sk-bouncedelay {0%, 80%, 100% {-webkit-transform: scale(0);transform: scale(0);} 40% {-webkit-transform: scale(1.0);transform: scale(1.0);}}",
        styleSheet.cssRules.length
      );
      proxyWindow.document.body.className = "body";
      let spinner = proxyWindow.document.createElement("div");
      spinner.className = "spinner";
      let bounce1 = proxyWindow.document.createElement("div");
      bounce1.className = "bounce1";
      let bounce2 = proxyWindow.document.createElement("div");
      bounce2.className = "bounce2";
      let bounce3 = proxyWindow.document.createElement("div");
      bounce3.className = "bounce3";
      spinner.appendChild(bounce1);
      spinner.appendChild(bounce2);
      spinner.appendChild(bounce3);
      proxyWindow.document.body.appendChild(spinner);
      // TODO : axios globalization
      this.$http
        .post("/api/v1/session/credentials")
        .then((response) => {
          let client_token = response.data.client_token;
          let session_id = response.data.session_id;
          let connectionUrl =
            "http://pdaccess.com:" +
            port +
            uri +
            session_id +
            "/" +
            client_token +
            "/" +
            item.inventory_id;
          proxyWindow.location = connectionUrl;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  created() {
    this.getServices();
  },
};
</script>
<style scoped>
.list-group-item {
  padding-top: 0.75rem;
  padding-right: 0rem;
  padding-bottom: 0.75rem;
  padding-left: 0rem;
}
.inventory-logo {
  width: 30px;
  height: 20px;
}

.spoiler button {
  visibility: hidden;
}

.spoiler:hover button {
  visibility: visible;
}
</style>
