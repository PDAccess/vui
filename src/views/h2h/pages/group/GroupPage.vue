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
      <div v-else-if="groups.length === 0">
        <p-initial
          icon="folder-plus"
          header="You don't have any Private or Joined Group."
          message="Please create or join a group."
        />
      </div>
      <div v-else>
        <p-card>
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item d-flex flex-row align-items-center"
              v-for="item in groups"
              :key="item.name"
            >
              <div class="col-6">
                <div class="d-flex align-items-center mr-auto">
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
              </div>
              <div
                class="
                  d-flex
                  justify-content-between
                  align-items-center
                  col-2
                  mr-auto
                "
              >
                <template v-if="item.ownMembership == 'ADMIN'">
                  <div class="p2">
                    <b-link
                      @click.stop="
                        $router.push({
                          name: 'Group Credentials',
                          params: {
                            id: item.groupId,
                          },
                        })
                      "
                      class="font-weight-bold"
                      v-b-tooltip.html
                      title="Number of <strong>Credentials</strong>"
                    >
                      <i class="nav-icon fa fa-address-book"></i>
                      {{ item.groupCounter.credential }}
                    </b-link>
                  </div>
                  &nbsp;
                  <div class="p2">
                    <b-link
                      @click.stop="infoGroup(item)"
                      class="font-weight-bold"
                      v-b-tooltip.html
                      title="Number of <strong>Service</strong>"
                    >
                      <em class="icon-direction"></em>
                      {{ item.groupCounter.service }}
                    </b-link>
                  </div>
                  &nbsp;
                  <div class="p2">
                    <b-link
                      @click.stop="membersGroup(item)"
                      class="font-weight-bold"
                      v-b-tooltip.html
                      title="Number of <strong>Members</strong>"
                    >
                      <i class="nav-icon fa fa-users"></i>
                      {{ item.groupCounter.members }}
                    </b-link>
                  </div>

                  &nbsp;
                  <div class="p2">
                    <b-link
                      @click.stop="
                        $router.push({
                          name: 'Group Alarms',
                          params: {
                            id: item.groupId,
                          },
                        })
                      "
                      class="font-weight-bold"
                      v-b-tooltip.html
                      title="Number of <strong>Alarm</strong>"
                    >
                      <i class="nav-icon fa fa-bell"></i>
                      {{ item.groupCounter.alarm }}
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
                      {{ item.groupCounter.policy }}
                    </b-link>
                  </div>
                </template>
                <template v-else>
                  <div class="p2">
                    <b-link
                      @click.stop="
                        $router.push({
                          name: 'Group Credentials',
                          params: {
                            id: item.groupId,
                          },
                        })
                      "
                      class="font-weight-bold"
                      v-b-tooltip.html
                      title="Number of <strong>Credentials</strong>"
                    >
                      <i class="nav-icon fa fa-address-book"></i>
                      {{ item.groupCounter.credential }}
                    </b-link>
                  </div>
                  &nbsp;
                  <div class="p2">
                    <b-link
                      @click.stop="infoGroup(item)"
                      class="font-weight-bold"
                      v-b-tooltip.html
                      title="Number of <strong>Service</strong>"
                    >
                      <em class="icon-direction"></em>
                      {{ item.groupCounter.service }}
                    </b-link>
                  </div>
                  &nbsp;
                  <div class="p2">
                    <b-link
                      style="color: red"
                      class="font-weight-bold"
                      v-b-tooltip.html
                      title="Number of <strong>Members</strong>"
                    >
                      <i class="nav-icon fa fa-users"></i>
                      -
                    </b-link>
                  </div>

                  &nbsp;
                  <div class="p2">
                    <b-link
                      style="color: red"
                      class="font-weight-bold"
                      v-b-tooltip.html
                      title="Number of <strong>Alarm</strong>"
                    >
                      <i class="nav-icon fa fa-bell"></i>
                      -
                    </b-link>
                  </div>  
                  <div class="p2">
                    <b-link
                      style="color: red"
                      class="font-weight-bold"
                      v-b-tooltip.html
                      title="Number of <strong>Policy</strong>"
                    >
                      <i class="nav-icon icon-eye"></i>
                      -
                    </b-link>
                  </div>
                </template>
              </div>
              <div class="col-1">
                <p-timing :startDate="item.createTime" nowrap />
              </div>
            </li>
          </ul>
          <infinite-loading @infinite="infinityGet" force-use-infinite-wrapper>
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </infinite-loading>
        </p-card>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from "vue-avatar";
import InfiniteLoading from "vue-infinite-loading";
import { mapGetters } from "vuex";

export default {
  name: "GroupsPage",
  props: ["id"],
  components: {
    Avatar,
    InfiniteLoading,
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
    path() {
      return this.$route.path.substring(this.$route.path.lastIndexOf("/") + 1);
    },
  },
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      groups: [],
      loading: true,
      sort: this.$route.query.sort == null ? "name" : this.$route.query.sort,
      filter: this.$route.query.filter,
      currentPage: 0,
      perPage: 15,
    };
  },
  methods: {
    infoGroup(item) {
      this.$router.push({
        name: "Group Detail",
        params: {
          id: item.groupId,
        },
      });    },
    membersGroup(item) {
      this.$router.push({
        name: "Group Users",
        params: {
          id: item.groupId,
        },
      });
    },
    infinityGet($state) {
      let data = {
        perPage: this.perPage,
        currentPage: this.currentPage,
        sort: this.sort,
        filter: this.filter
      };

      this.$http
        .post("/api/v1/group/query/" + this.path, data)
        .then((response2) => {
          if (response2.data.length) {
            response2.data.forEach((element) => {
              this.groups.push(element);
            });
            this.sortList();
            this.currentPage++;
            $state.loaded();
          } else {
            $state.complete();
          }

          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    compareGroupName(a, b) {
      if (a.groupname.toLocaleLowerCase() < b.groupname.toLocaleLowerCase()) {
        return -1;
      }
      if (a.groupname.toLocaleLowerCase() > b.groupname.toLocaleLowerCase()) {
        return 1;
      }
      return 0;
    },
    compareGroupNameDesc(a, b) {
      if (a.groupname.toLocaleLowerCase() > b.groupname.toLocaleLowerCase()) {
        return -1;
      }
      if (a.groupname.toLocaleLowerCase() < b.groupname.toLocaleLowerCase()) {
        return 1;
      }
      return 0;
    },
    compareGroupCreate(a, b) {
      if (a.createdAt < b.createdAt) {
        return -1;
      }
      if (a.createdAt > b.createdAt) {
        return 1;
      }
      return 0;
    },
    compareGroupCreateDesc(a, b) {
      if (a.createdAt > b.createdAt) {
        return -1;
      }
      if (a.createdAt < b.createdAt) {
        return 1;
      }
      return 0;
    },
    sortList() {
      if (this.sort === "name") {
        this.groups.sort(this.compareGroupName);
      }

      if (this.sort === "name-desc") {
        this.groups.sort(this.compareGroupNameDesc);
      }

      if (this.sort === "create") {
        this.groups.sort(this.compareGroupCreate);
      }

      if (this.sort === "create-desc") {
        this.groups.sort(this.compareGroupCreateDesc);
      }
    },
  },
  created() {
    let data = {
      perPage: this.perPage,
      currentPage: this.currentPage,
      sort: this.sort,
      filter: this.filter
    };
    this.$http
      .post("/api/v1/group/query/" + this.path, data)
      .then((response2) => {
        response2.data.forEach((element) => {
          this.groups.push(element);
        });
        this.sortList();
        this.currentPage++;
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
  },
};
</script>

<style scoped>
.list-group-item {
  padding-top: 0.75rem;
  padding-right: 0.5rem;
  padding-bottom: 0.75rem;
  padding-left: 0.5rem;
}
</style>
