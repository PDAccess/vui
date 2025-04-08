<template>
  <div class="animated fadeIn">
    <p-card>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">
          <p>
            This is a security log of important events involving your account.
          </p>
        </li>
        <p-initial
          v-if="authsessions.length === 0"
          icon="plus-circle"
          header="You don't have any authentication logs."
          message="Please start a session."
        />
        <li v-else class="list-group-item">
          <h5>History of authentications</h5>
          <b-table
            :fields="fields"
            :items="authsessions"
            :responsive="responsive"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            hover
            show-empty
            :small="responsive"
            :fixed="responsive"
          >
            <template v-slot:cell(created_at)="row">
              <span class="text-info">{{
                row.item.created_at | moment("calendar")
              }}</span>
            </template>
          </b-table>

          <infinite-loading
            v-if="loading"
            force-use-infinite-wrapper
            @infinite="infiniteHandlerSession"
          >
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </infinite-loading>
        </li>
      </ul>
    </p-card>
  </div>
</template>
<script>
import InfiniteLoading from "vue-infinite-loading";

export default {
  components: {
    InfiniteLoading,
  },
  data() {
    return {
      loading: false,
      id: "",
      authsessions: [],
      page: 0,
      fields: [
        { key: "user_agent", label: "User Agent" },
        { key: "created_at", label: "Created At", sortable: true },
      ],
    };
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  methods: {
    infiniteHandlerSession($state) {
      this.$http
        .get("/api/v1/auths/session/" + this.id + "/" + this.page)
        .then((response) => {
          if (response.data.length) {
            this.page += 1;
            response.data.forEach((f) => {
              this.authsessions.push(f);
            });
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch((error) => {
          console.log(error);
            this.$bvToast.toast(`Sessions cant get!`, {
              title: "Sessions cant get!",
              variant: "error",
              autoHideDelay: 5000,
            });
        });
    },
  },
  created() {
    this.$http
      .get("/api/v1/user/who")
      .then((response) => {
        this.user = response.data;
        this.id = this.user.userId;
        this.loading = true;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>
