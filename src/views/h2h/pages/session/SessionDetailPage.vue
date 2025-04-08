<template>
  <div class="animated fadeIn">
    <div>
      <p-card>
        <p-loading v-if="loading" class="my-5" message="Loading..." />
        <div v-else>
          <b-row>
            <b-col
              cols="6"
              v-if="
                session.sessionType !== 'D' &&
                session.serviceEntity.video_record
              "
            >
              <b-badge variant="info"
                >Video of Session can be watched here</b-badge
              >
              <br />
              <b-embed
                type="video"
                aspect="16by9"
                controls
                allowfullscreen
                poster="@/assets/img/pda2.png"
              >
                <source
                  :src="'/videos/' + id + '.mp4'"
                  type='video/mp4;codecs="avc1.42E01E, mp4a.40.2"'
                />
              </b-embed>
            </b-col>
            <b-col
              :cols="
                session.sessionType !== 'D' &&
                session.serviceEntity.video_record
                  ? '6'
                  : '12'
              "
            >
              <timeline>
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <b-button variant="link" @click="userDetailPage(session)" class="profile-button">
                      <p-profile-avatar
                        :profileUsername="session.username"
                        :username="
                          session.userEntity.first_name +
                          ' ' +
                          session.userEntity.last_name
                        "
                        :size="35"
                        :imageWidth="'35px'"
                        :imageHeight="'auto'"
                      />
                    </b-button>
                  </div>
                  <div>
                    <strong>
                      {{ session.serviceEntity.name }}
                      <em
                        v-if="session.session_type == 'T'"
                        class="fa fa-terminal fa-1x"
                      ></em>
                      <em
                        v-else-if="session.session_type == 'D'"
                        class="fa fa-database fa-1x"
                      ></em>
                      <em v-else-if="session.session_type == 'PDA'">
                        <b-badge variant="primary">PDA</b-badge>
                      </em>
                    </strong>
                  </div>
                </div>
                <b-form-select
                  style="margin: 3px"
                  v-show="session.session_type == 'D'"
                  @input="querySelect"
                  v-model="selectquery"
                  :options="options2"
                />
                <timeline-title> Actions </timeline-title>
                <VuePerfectScrollbar class="scrollperfect">
                  <timeline-item
                    :key="index"
                    v-for="(item, index) in actions"
                    bg-color="#9dd8e0"
                  >
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div class="text-danger mb-2">
                          <strong>
                            {{ item.proxy_action }}
                          </strong>
                        </div>
                      </div>
                      <div style="margin-left: 15px">
                        <p
                          class="text-info"
                          v-b-tooltip.bottom
                          :title="
                            [item.sessionEntity.start_time, item.id.action_time]
                              | moment('duration', false)
                          "
                        >
                          {{
                            [item.sessionEntity.start_time, item.id.action_time]
                              | moment("duration")
                          }}
                        </p>
                      </div>
                    </div>
                  </timeline-item>
                </VuePerfectScrollbar>
              </timeline>
            </b-col>
          </b-row>
        </div>
      </p-card>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";

import { Timeline, TimelineItem, TimelineTitle } from "vue-cute-timeline";

export default {
  name: "app",
  props: ["id"],
  components: {
    Timeline,
    TimelineItem,
    TimelineTitle,
    VuePerfectScrollbar,
  },
  data() {
    return {
      selectquery: null,
      options2: [
        {
          value: null,
          text: "Select Query",
        },
        {
          value: "SELECT",
          text: "SELECT",
        },
        {
          value: "INSERT",
          text: "INSERT",
        },
        {
          value: "DELETE",
          text: "DELETE",
        },
      ],
      loading: true,
      actions: [],
      session: {},
    };
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  methods: {
    querySelect() {
      if (this.selectquery != null) {
        this.$http
          .post("/api/databasesessionfilter/" + this.id, this.selectquery)
          .then((response) => {
            this.actions = [];
            this.actions = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    userDetailPage(item) {
      this.$router.push({
        name: "User Detail",
        params: {
          id: item.userEntity.userId,
        },
      });
    },
  },
  created() {
    let username = localStorage.getItem("username");
    let isAdmin = localStorage.getItem("isAdmin");
    this.$http
      .get("/api/v1/session/" + this.id)
      .then((response) => {
        if (response.status === 200) {
          if (
            username !== response.data.userEntity.username &&
            isAdmin === "false"
          ) {
            this.$router.push({ path: "/service/nav/list" });
          }
          this.session = response.data;
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    this.$http
      .get("/api/v1/session/actions/" + this.id)
      .then((response) => {
        if (response.status === 200) {
          this.actions = response.data;
          this.loading = false;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  },
};
</script>

<style scoped>
.scrollperfect {
  position: relative;
  margin: auto;
  height: 500px;
}

.card {
  height: -webkit-fill-available;
}
</style>
