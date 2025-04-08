<template>
  <div class="animated fadeIn">
    <p-card>
      <div class="d-flex justify-content-between container-nav">
        <div class="module-nav">
          <b-button
            class="btn btn-ghost-primary"
            to="/groups/nav/all"
            type="button"
          >
            <span class="d-md-down-none">All Groups&nbsp;</span>
            <b-badge variant="warning">{{ counters.all }} </b-badge></b-button
          >
          <b-button
            class="btn btn-ghost-primary"
            style="margin-left: 5px"
            to="/groups/nav/yours"
            type="button"
          >
            <span class="d-md-down-none">Your Groups&nbsp;</span>
            <b-badge variant="warning">{{ counters.yours }} </b-badge></b-button
          >
          <b-button
            class="btn btn-ghost-primary"
            style="margin-left: 5px"
            to="/groups/nav/joined"
            type="button"
          >
            <span class="d-md-down-none">Joined Groups&nbsp;</span>
            <b-badge variant="warning">
              {{ counters.joined }}
            </b-badge></b-button
          >
        </div>
        <div class="create-nav">
          <b-form inline>
            <b-form-input
              class="form-control search-input mr-2"
              size="md"
              placeholder="Enter Search  (Name, Description)"
              type="text"
              v-model="filter"
              @keydown.enter="searchFilter"
            ></b-form-input>
            <b-form-select
              class="sort-input"
              @input="sortChange"
              style="margin-right: 10px"
              v-model="selected"
            >
              <option value="name">Name</option>
              <option value="name-desc">Name (Desc)</option>
              <option value="create">Created</option>
              <option value="create-desc">Created (Desc)</option>
            </b-form-select>
            <b-button to="/groups/creategroup" variant="success">
              <span class="text-nowrap">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
                <span class="d-md-down-none">&nbsp;New Group</span>
              </span></b-button
            >
          </b-form>
          <hr class="split-nav" />
        </div>
      </div>
    </p-card>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "GroupsPage",
  data() {
    return {
      selected: "name",
      filter: "",
      counters: {
        all: 0,
        yours: 0,
        joined: 0,
      },
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
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
          sort: this.selected,
          filter: this.filter,
        },
      });
    },
  },
  created() {
    this.$http.post("/api/v1/group/counters").then((response2) => {
      this.counters = response2.data;
    });
  },
};
</script>
