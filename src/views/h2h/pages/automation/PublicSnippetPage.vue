<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <p-loading class="my-5" v-if="loading" message="Loading..." />
      <p-error
        v-else-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <div v-else-if="snippets.length === 0">
        <p-initial
          icon="file-plus"
          header="Not found any Public Snippets"
          message="Please wait for other users to create public snippet."
        />
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
                <b-col lg="3">
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
              </b-row>
            </li>
          </ul>
        </p-card>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "AdminSidebar",
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
      snippet: {
        title: "Snippet",
      },
      snippets: [],
      loading: true,
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
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    editSnippet(item) {
      this.$router.push(
        this.$route.query.redirect ||
          "/snippets/edit/" + item.snippetEntity.snippetId
      );
    },
    userDetailPage(item) {
      this.$router.push({
        name: "User Detail",
        params: {
          id: item,
        },
      });
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
    create() {
      this.$http
        .get("/api/v1/snippet/public/" + this.user.userId)
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
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
  },
  created() {
    this.create();
  },
  watch: {
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
