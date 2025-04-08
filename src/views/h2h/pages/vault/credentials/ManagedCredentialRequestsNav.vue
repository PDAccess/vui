<template>
  <div class="animated fadeIn">
    <p-card>
      <div class="d-flex justify-content-between container-nav">
        <div class="module-nav">
          <b-button
            class="btn btn-ghost-primary"
            :to="'/vault/credentials/requests/' + id + '/wait'"
            type="button"
          >
            <span class="d-md-down-none">Waiting Requests&nbsp;</span>
            <b-badge variant="warning"> {{ counters.waited }}</b-badge>
          </b-button>
          <b-button
            class="btn btn-ghost-primary"
            style="margin-left: 5px"
            :to="'/vault/credentials/requests/' + id + '/approved'"
            type="button"
          >
            <span class="d-md-down-none">Approved Requests&nbsp;</span>
            <b-badge variant="warning"> {{ counters.approved }}</b-badge>
          </b-button>
          <b-button
            class="btn btn-ghost-primary"
            style="margin-left: 5px"
            :to="'/vault/credentials/requests/' + id + '/not-approved'"
            type="button"
          >
            <span class="d-md-down-none">Rejected Requests&nbsp;</span>
            <b-badge variant="warning"> {{ counters.notApproved }}</b-badge>
          </b-button>
        </div>
      </div>
    </p-card>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
export default {
  props: ["id"],
  data() {
    return {
      sortSelect: "create-desc",
      selected: "name",
      filter: "",
      searchFilter: "",
      user: {},
      counters: {
        waited: 0,
        approved: 0,
        notApproved: 0
      },
    };
  },
  watch: {
    filter: function (val) {
      if (val.length >= 3 || val.length === 0) this.sortChange();
    },
  },
  methods: {
    sortChange() {
      let page = this.$route.fullPath;
      this.$router.push({
        path: page,
        query: {
          sort: this.sortSelect,
          filter: this.filter,
        },
      });
    },
  },
  created() {
    this.$http.post("/api/v1/credentials/request/counters/" + this.id).then((response) => {
      this.counters = response.data;
    });
  },
};
</script>