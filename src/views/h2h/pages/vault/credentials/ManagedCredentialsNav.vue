<template>
  <div class="animated fadeIn">
    <p-card>
      <div class="d-flex justify-content-between container-nav">
        <div class="module-nav">
          <b-button
            class="btn btn-ghost-primary"
            to="/vault/nav/list"
            type="button"
          >
            <span class="d-md-down-none">All Credentials&nbsp;</span>
            <b-badge variant="warning"> {{ counters.all }}</b-badge>
          </b-button>
          <b-button
            class="btn btn-ghost-primary"
            style="margin-left: 5px"
            to="/vault/nav/yours"
            type="button"
          >
            <span class="d-md-down-none">Your Credentials&nbsp;</span>
            <b-badge variant="warning"> {{ counters.your }}</b-badge>
          </b-button>
        </div>
        <div class="create-nav">
          <b-form inline>
            <b-form-input
                class="form-control sesarch-input mr-2"
                v-model="filter"
                @keydown.enter="searchFilter"
                placeholder="Search credential"
                type="text"
            ></b-form-input>
            <!--
              <b-form-select
                class="sort-input"
                @input="sortChange"
                v-model="sortSelect"
                style="margin-right: 10px"
            >
                <option value="name">Name</option>
                <option value="name-desc">Name (Desc)</option>
                <option value="create">Create</option>
                <option value="create-desc">Create (Desc)</option>
            </b-form-select>
            -->
            <b-button
            to="/vault/createcredential"
            variant="success"
            class="text-nowrap"
          >
            <i class="fa fa-plus-circle mr-2" aria-hidden="true"></i>New
            Credential
          </b-button>
          </b-form>
          <hr class="split-nav" />
        </div>
      </div>
    </p-card>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import {
  CredentialsApi,
} from "@/generated/cmanager/index.ts";

export default {
  data() {
    return {
      sortSelect: "create-desc",
      selected: "name",
      filter: "",
      searchFilter: "",
      user: {},
      counters: {
        all: 0,
        yours: 0
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
    new CredentialsApi(this.$cmanagerHttpConfig, undefined, this.$http).searchCountCredentials().then((response) => {
      this.counters = response.data;
    });
  },
};
</script>