<template>
  <p-card>
    <div v-if="errorStatus">
      <p-error
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
    </div>
    <b-tabs v-else content-class="mt-2" pills>
      <b-tab lazy title="Break the Glass">
        <ServiceBreakTheGlassListComp
          :serviceid="id"
        ></ServiceBreakTheGlassListComp>
      </b-tab>
      <b-tab lazy title="Map" v-if="info.mapx !== 0 && info.mapy !== null">
        <b-row>
          <b-col md="10" offset-md="1">
            <div>
              <h6>X:{{ info.mapx }} Y:{{ info.mapy }}</h6>
            </div>
            <div class="card" style="height: 25rem">
              <mappage
                :draggable="false"
                :x="info.mapx"
                :y="info.mapy"
              ></mappage>
            </div>
          </b-col>
        </b-row>
      </b-tab>
      <b-tab @click="getCredantials" title="Credantials">
        <p-loading
          class="my-5"
          v-if="credantialHistoryLoading"
          message="Loading..."
        />
        <p-error
          v-else-if="errorStatusCredantial"
          :header="errorHeader"
          :errorResponse="errorResponse"
          @reload="$router.go()"
        />
        <p-initial
          v-else-if="credantialHistory.length === 0"
          icon="folder-plus"
          header="You don't have any service credentials."
          message="Please create a credentials"
        />
        <template v-else>
          <b-table
            :fields="credantialsFields"
            :items="credantialHistory"
            :responsive="responsive"
            hover
            show-empty
            small
          >
            <template v-slot:cell(result)="row">
              <b-badge :variant="row.item.result ? 'success' : 'danger'">{{
                row.item.result
              }}</b-badge>
            </template>

            <template v-slot:cell(endAt)="row">
              <p-timing
                :start-date="row.item.startAt"
                :end-date="row.item.endAt || new Date()"
              />
            </template>
          </b-table>
        </template>
      </b-tab>
    </b-tabs>
  </p-card>
</template>

<script>
import mappage from "@/views/h2h/components/mappage";
import InfiniteLoading from "vue-infinite-loading";
import ServiceBreakTheGlassListComp from "@/views/h2h/pages/service/ServiceBreakTheGlassListComp";
import { mapGetters } from "vuex";

export default {
  props: ["id"],
  components: {
    mappage,
    InfiniteLoading,
    ServiceBreakTheGlassListComp,
  },
  data() {
    return {
      errorStatus: false,
      errorStatusCredantial: false,
      errorHeader: "",
      errorResponse: "",
      credantialHistoryLoading: true,
      loading: true,
      credantialHistory: [],
      userid: "",
      start: new Date(2018, 1, 1),
      end: new Date(),
      perPage: 20,
      currentPageCredantials: 0,
      info: {
        name: "",
      },
      filter: this.$route.params.id,
      users: [],
      credantialsFields: [
        { key: "result", label: "Result" },
        { key: "endAt", sortable: true, label: "" },
        { key: "description", label: "Message" },
      ],
    };
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
    ...mapGetters({
      user: "auth/user",
    }),
  },
  methods: {
    getCredantials() {
      let serviceids = [this.id];
      this.$http
        .get("/api/v1/auto/credential/history/" + serviceids)
        .then((response) => {
          this.credantialHistory = response.data;
          this.credantialHistoryLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.credantialHistoryLoading = false;
          this.errorStatusCredantial = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
  },
  created() {
    this.$http
      .get("/api/v1/service/id/" + this.id)
      .then((response) => {
        this.info = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });
    this.$http
      .get("/api/v1/user")
      .then((response) => {
        this.users = response.data;
      })
      .catch((error) => {
        console.log(error);
        this.errorStatus = true;
        this.errorResponse = error;
        this.errorHeader = "Something went wrong!";
      });

    let currentDate = new Date();
    this.start = new Date(
      currentDate.getFullYear() - 1,
      currentDate.getMonth(),
      currentDate.getDay()
    );
  },
};
</script>

<style>
</style>