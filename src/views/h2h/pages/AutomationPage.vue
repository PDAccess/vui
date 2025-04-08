<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <div v-if="loading" class="loadingImage">
        <p-loading message="Loading..." class="my-5" />
      </div>
      <div v-else-if="snippets.length === 0">
        <p-initial icon="file-plus" header="You don't have any Snippets" message="Please create a snippet." />
      </div>
      <div v-else>
        <p-card>
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item"
              :key="index"
              v-for="(item, index) in snippets"
            >
              <b-row class="d-flex justify-content-between align-items-center">
                <b-col lg="3">
                  <b-row>
                    <b-col md="2">
                      <b-button
                        @click="userDetailPage(item.snippetEntity.userId)"
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
                    <b-col md="10">
                      <div
                        class="
                          d-flex
                          justify-content-between
                          align-items-center
                        "
                      >
                        <div style="margin-left: 15px">
                          <p class="mb-1">
                            <strong>{{ item.snippetEntity.title }}</strong>
                          </p>
                          <small
                            ><strong>info: </strong
                            >{{ item.snippetEntity.info }}</small
                          >
                        </div>
                      </div>
                    </b-col>
                  </b-row>
                </b-col>
                <b-col lg="1">
                  <div
                    :class="['inventory-logo-', numberToOS(item)]"
                    style="width: 40px; height: 40px"
                    :title="numberToOS(item)"
                    v-b-tooltip.bottom
                  ></div>
                </b-col>
                <b-col lg="1">
                  <div
                    :class="['inventory-logo-', numberToService(item)]"
                    :title="numberToService(item)"
                    style="width: 40px; height: 40px"
                    v-b-tooltip.bottom
                  ></div>
                </b-col>
                <b-col lg="4">
                  <p>
                    <strong>Description: </strong>
                    <em v-if="!item.snippetEntity.description"
                      >Not Assigned!</em
                    >
                    <span v-else> {{ item.snippetEntity.description }}</span>
                  </p>
                </b-col>
                <b-col lg="2">
                  <p>
                    <strong>Created At: </strong>
                    <em v-if="!item.snippetEntity.createdAt">Not Assigned!</em>
                    <span v-else> {{ item.snippetEntity.createdAt }}</span>
                  </p>
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
                      @click.stop="editSnippet(item)"
                      variant="primary"
                      ><em class="mr-1 fa fa-pencil"></em>Edit</b-dropdown-item
                    >
                    <b-dropdown-item
                      @click.stop="deleteSnippet(item)"
                      variant="danger"
                      v-b-modal.modal
                      ><em class="mr-1 fa fa-trash"></em>Delete</b-dropdown-item
                    >
                  </b-dropdown>
                </b-col>
              </b-row>
            </li>
          </ul>
        </p-card>
      </div>
    </div>
  </div>
</template>
<script>
import Avatar from "vue-avatar";
import { mapGetters } from "vuex";

export default {
  name: "AdminSidebar",
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  components: {
    Avatar,
  },
  data() {
    return {
      dataObject: {},
      snippet: {
        title: "Snippet",
      },
      snippets: [],
      loading: true,
      selected: "",
    };
  },
  methods: {
    deleteSnippet(item) {
      this.$http
        .delete("/api/v1/snippet/" + item.snippetEntity.snippetId)
        .then((response) => {
          this.create();
        })
        .catch((error) => {
          console.log("error ", error);
        });
    },
    editSnippet(item) {
      this.$router.push(
        this.$route.query.redirect ||
          "/snippets/edit/" + item.snippetEntity.snippetId
      );
    },
    numberToOS(item) {
      let OSId = item.snippetEntity.operatingSystemId;
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
    numberToService(item) {
      let serviceId = item.snippetEntity.serviceTypeId;
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
    userDetailPage(item) {
      this.$router.push({
        name: "User Detail",
        params: {
          id: item,
        },
      });
    },
    sortByAsc(key, reverse) {
      const moveSmaller = reverse ? 1 : -1;
      const moveLarger = reverse ? -1 : 1;

      /**
       * @param  {*} a
       * @param  {*} b
       * @return {Number}
       */
      return (a, b) => {
        if (a[key] < b[key]) {
          return moveSmaller;
        }
        if (a[key] > b[key]) {
          return moveLarger;
        }
        return 0;
      };
    },
    sortByDesc(key, reverse) {
      const moveSmaller = reverse ? 1 : -1;
      const moveLarger = reverse ? -1 : 1;

      /**
       * @param  {*} a
       * @param  {*} b
       * @return {Number}
       */
      return (a, b) => {
        if (a[key] > b[key]) {
          return moveSmaller;
        }
        if (a[key] < b[key]) {
          return moveLarger;
        }
        return 0;
      };
    },
    create() {
      let sort = this.$route.query.sort;

      this.dataObject = {
        userid: this.user.userId,
        sort: sort,
      };

      this.$http
        .post("/api/v1/snippet/" + sort + "/" + this.dataObject.userid)
        .then((response) => {
          this.snippets = response.data;
          for (let i = 0; i < this.snippets.length; i++) {
            this.snippets[i].snippetEntity.createdAt = this.$moment(
              this.snippets[i].snippetEntity.createdAt
            ).format("DD/MM/YYYY");
          }
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
      this.$root.$on("selectedSort", (arg1) => {
        this.selected = arg1;
      });
    },
  },
  created() {
    this.create();
  },
  watch: {
    selected(next) {
      if (next == "name") {
        this.snippets = this.snippets.sort(this.sortByAsc("title"));
      } else if (next == "name-desc") {
        this.snippets = this.snippets.sort(this.sortByDesc("title"));
      } else if (next == "create") {
        this.snippets = this.snippets.sort(this.sortByAsc("createdAt"));
      } else if (next == "create-desc") {
        this.snippets = this.snippets.sort(this.sortByDesc("createdAt"));
      }
    },
    snippets(val) {
      val.forEach((element) => {
        element.createdAt = this.$moment(element.createdAt).format(
          "DD/MM/YYYY"
        );
      });
    },
  },
};
</script>
