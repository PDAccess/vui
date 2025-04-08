<template>
  <div class="animated fadeIn">
    <p-card>
      <div class="d-flex justify-content-between container-nav">
        <div class="module-nav">
          <b-button
            class="btn btn-ghost-primary"
            to="/service/nav/list"
            type="button"
          >
            <span class="d-md-down-none">All Services&nbsp;</span>
            <b-badge variant="warning"> {{ counters.all }}</b-badge></b-button
          >
          <b-button
            class="btn btn-ghost-primary"
            style="margin-left: 5px"
            to="/service/nav/yours"
            type="button"
          >
            <span class="d-md-down-none">Your Services&nbsp;</span>
            <b-badge variant="warning"> {{ counters.yours }}</b-badge></b-button
          >
          <b-button
            class="btn btn-ghost-primary"
            style="margin-left: 5px"
            to="/service/nav/agent"
            type="button"
          >
            <span class="d-md-down-none">Agent Services&nbsp;</span>
            <b-badge variant="warning"> {{ counters.agent }}</b-badge></b-button
          >
          <b-button
            class="btn btn-ghost-primary"
            style="margin-left: 5px"
            to="/service/nav/marked"
            type="button"
          >
            <span class="d-md-down-none">Marked Services&nbsp;</span>
            <b-badge variant="warning">
              {{ counters.joined }}</b-badge
            ></b-button
          >
        </div>
        <div class="create-nav">
          <b-form inline>
            <b-form-input
              class="form-control search-input mr-2"
              size="md"
              placeholder="Enter Search  (Name, Description or IP Address)"
              type="text"
              v-model="filter"
              @keydown.enter="searchFilter"
            ></b-form-input>
            <b-form-select
              class="sort-input mr-2"
              @input="sortChange"
              v-model="selected"
            >
              <option value="name">Name</option>
              <option value="name-desc">Name (Desc)</option>
              <option value="create">Created</option>
              <option value="create-desc">Created (Desc)</option>
              <option value="os">OS</option>
              <option value="os-desc">OS (Desc)</option>
              <option value="opservice">
                <strong>OS + Type</strong>
              </option>
              <option value="opservice-desc">
                <strong>OS + Type (Desc)</strong>
              </option>
              <option value="last-access">
                <strong>Last Access</strong>
              </option>
              <option value="last-access-desc">
                <strong>Last Access (Desc)</strong>
              </option>
            </b-form-select>
            <b-button
                variant="outline-success"
                class="mr-2"
                @click="handleDownload"
              >
                <em class="fa fa-download"></em>
              </b-button>
            <b-button
              class="create-service-btn"
              to="/service/createservice"
              variant="success"
            >
              <span class="text-nowrap">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
                <span class="d-md-down-none">&nbsp;New Service</span>
              </span>
            </b-button>
          </b-form>
          <hr class="split-nav" />
        </div>
      </div>
    </p-card>
    <router-view :key="$route.fullPath" :download="downloadClicked"></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: "name",
      filter: "",
      user: {},
      counters: {
        yours: 0,
        agent: 0,
        joined: 0,
      },
      downloadClicked: false,
    };
  },
  watch: {
    filter: function (val) {
      if (val.length >= 3 || val.length === 0) this.sortChange();
    },
  },
  methods: {
    handleDownload() {
      this.downloadClicked = !this.downloadClicked;
    },
    sortChange() {
      let page = this.$route.fullPath;
      this.$router.push({
        path: page,
        query: {
          sort: this.selected,
          filter: this.filter,
        },
      });
    },
  },
  created() {
    this.$http.post("/api/v1/service/counters").then((response2) => {
      this.counters = response2.data;
    });
  },
};
</script>