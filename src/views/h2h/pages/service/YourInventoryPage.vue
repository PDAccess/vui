<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <p-card>
        <div class="input-group mb-3" v-if="false">
          <b-form-input
            class="form-control search-input"
            size="md"
            placeholder="Enter Search  (Name, Description or IP Address)"
            type="text"
            v-model="tempFilter"
            @keydown.enter="searchFilter"
          ></b-form-input>
        </div>
        <p-error
          v-if="errorStatus"
          header="List operation has error!"
          :errorResponse="errorResponse"
          @reload="getServices"
        />
        <p-loading v-else-if="loading" class="my-5" message="Loading..." />
        <div v-else-if="items.length === 0">
          <p-initial
            icon="folder-plus"
            header="You don't have any service"
            message="Please create a service or join a service or a group"
          />
        </div>
        <ul v-else class="list-group list-group-flush">
          <li
            class="list-group-item d-flex align-items-center"
            :key="index"
            v-for="(item, index) in items"
          >
            <b-row style="width: 100%">
              <b-col cols="6">
                <div class="d-flex align-items-center">
                  <div class="d-flex justify-content-start align-items-center">
                    <b-button variant="link" @click.stop="infoService(item)">
                      <avatar
                        :rounded="false"
                        :size="30"
                        :username="serviceNameAvatar(item.name)"
                      ></avatar>
                    </b-button>
                    <div
                      v-b-tooltip.bottom
                      :title="
                        item.serviceNameLogo !== 'unknown'
                          ? item.serviceNameLogo
                          : ''
                      "
                      :class="[
                        'inventory-logo',
                        'mx-auto',
                        item.serviceNameLogo,
                      ]"
                    ></div>
                    <div
                      v-b-tooltip.bottom
                      :title="
                        item.serviceTypeLogo !== 'unknown'
                          ? item.serviceTypeLogo
                          : ''
                      "
                      :class="[
                        'inventory-logo',
                        'mx-auto',
                        item.serviceTypeLogo,
                      ]"
                    ></div>
                  </div>
                  <div style="margin-left: 15px">
                    <b-link @click.stop="infoService(item)">
                      <p class="mb-1">
                        <strong>{{ item.name }}</strong>

                        <b-badge variant="primary">{{
                          item.sessioncount
                        }}</b-badge>
                      </p>
                    </b-link>

                    <div class="d-flex align-items-center">
                      <small>{{ item.description }}</small>
                      &nbsp;
                      <span>&#183;</span>
                      &nbsp;
                      <small
                        ><p-timing :start-date="item.createdAt"></p-timing
                      ></small>
                    </div>
                  </div>
                </div>
              </b-col>
              <b-col
                cols="4"
                class="d-flex justify-content-center align-items-center"
              >
                <div class="p2">
                  <b-link
                    @click.stop="
                      $router.push({
                        name: 'Local Accounts',
                        params: {
                          id: item.inventoryId,
                        },
                      })
                    "
                    class="font-weight-bold"
                    v-b-tooltip.html
                    title="Number of <strong>Local Accounts</strong>"
                  >
                    <i class="nav-icon fa fa-address-book"></i>
                    {{ item.serviceCounters.credential }}
                  </b-link>
                </div>
                &nbsp;
                <div class="p2">
                  <b-link
                    @click.stop="infoService(item)"
                    class="font-weight-bold"
                    v-b-tooltip.html
                    title="Number of <strong>Groups</strong>"
                  >
                    <em class="icon-directions"></em>
                    {{ item.serviceCounters.groups }}
                  </b-link>
                </div>
                &nbsp;
                <div class="p2">
                  <b-link
                    @click.stop="
                      $router.push({
                        name: 'Service Users',
                        params: {
                          id: item.inventoryId,
                        },
                      })
                    "
                    class="font-weight-bold"
                    v-b-tooltip.html
                    title="Number of <strong>Members</strong>"
                  >
                    <i class="nav-icon fa fa-users"></i>
                    {{ item.serviceCounters.members }}
                  </b-link>
                </div>

                &nbsp;
                <div class="p2">
                  <b-link
                    @click.stop="
                      $router.push({
                        name: 'Service Alarms',
                        params: {
                          id: item.inventoryId,
                        },
                      })
                    "
                    class="font-weight-bold"
                    v-b-tooltip.html
                    title="Number of <strong>Alarm</strong>"
                  >
                    <i class="nav-icon fa fa-bell"></i>
                    {{ item.serviceCounters.alarm }}
                  </b-link>
                </div>
                <div class="p2">
                  <b-link
                    @click.stop="
                      $router.push({
                        name: 'Group Sudo Policy',
                        params: {
                          id: item.groupId,
                        },
                      })
                    "
                    class="font-weight-bold"
                    v-b-tooltip.html
                    title="Number of <strong>Policy</strong>"
                  >
                    <i class="nav-icon icon-eye"></i>
                    {{ item.serviceCounters.policy }}
                  </b-link>
                </div>
              </b-col>
              <b-col
                cols="1"
                class="d-flex justify-content-end align-items-center"
              >
                <!-- <b-badge
                  title="Ip Address"
                  v-b-tooltip.bottom
                  variant="light"
                  class="mr-2"
                  v-if="item.ipAddress != null"
                > -->
                <!-- <strong> -->
                <span>{{ item.ipAddress }}</span>
                <p-copy :copyItem="item.ipAddress" />
                <!-- </strong> -->
                <!-- </b-badge> -->
              </b-col>
              <b-col
                cols="1"
                class="d-flex justify-content-end align-items-center"
              >
                <b-badge
                  title="Last Access Time"
                  v-b-tooltip.bottom
                  :variant="
                    $moment(item.lastAccessTime).isAfter(
                      $moment().subtract(5, 'minutes')
                    )
                      ? 'light'
                      : 'danger'
                  "
                  class="p-1 mr-2"
                  v-if="item.lastAccessTime != null"
                >
                  <strong>
                    <span>{{ item.lastAccessTime | moment("from") }}</span>
                  </strong>
                </b-badge>
              </b-col>
              <!-- <b-col
                cols="2"
                class="d-flex justify-content-end align-items-center"
              >
                <p-timing :start-date="item.createdAt"></p-timing>
              </b-col> -->
            </b-row>
          </li>
          <infinite-loading @infinite="updateTable" force-use-infinite-wrapper>
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </infinite-loading>
        </ul>
      </p-card>
    </div>
  </div>
</template>

<script>
import Avatar from "vue-avatar";
import InfiniteLoading from "vue-infinite-loading";
import { mapGetters } from "vuex";

export default {
  components: {
    Avatar,
    InfiniteLoading,
  },
  data() {
    return {
      errorStatus: false,
      errorResponse: "",
      items: [],
      loading: true,
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
        createdAt: {
          label: "Created",
          class: "text-center",
        },
        actions: {
          label: "",
          class: "text-center",
        },
      },
      currentPage: 0,
      perPage: 15,
      filter: null,
      tempFilter: null,
    };
  },
  computed: {
    ...mapGetters({ userToken: "auth/token" }),
  },
  watch: {
    tempFilter: function (val) {
      if (val.length >= 3 || val.length === 0) this.searchFilter();
    },
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
        category: "yours"
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
          id: item.inventoryId,
        },
        query: { sort: "createddesc" },
      });
    },
    searchFilter() {
      if (this.tempFilter == null) {
        this.clearFilter();
      } else if (
        this.filter == null ||
        this.tempFilter.toLowerCase() !== this.filter.toLowerCase()
      ) {
        this.filter = this.tempFilter.toLowerCase();
        this.getServices();
      }
    },
    clearFilter() {
      if (this.filter == null) {
        this.tempFilter = null;
      } else {
        this.tempFilter = null;
        this.filter = null;
        this.getServices();
      }
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
        category: "yours"
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
