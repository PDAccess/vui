<template>
  <div class="animated fadeIn" style="background: white; height: 100%">
    <p-card>
      <div class="d-flex justify-content-between container-nav">
        <div class="module-nav">
          <b-button
            type="button"
            class="btn btn-ghost-primary"
            to="/reports/nav/access/serversAgentVersions?sort=createddesc"
            @click.stop="navclick"
          >Servers Agent Versions</b-button
          >
          <b-button
            type="button"
            class="btn btn-ghost-primary"
            style="margin-left: 5px"
            to="/reports/nav/access/serverUsersAuths?sort=createddesc"
            @click.stop="navclick"
          >Server Users Auths</b-button
          >
          <b-button
            type="button"
            class="btn btn-ghost-primary"
            style="margin-left: 5px"
            to="/reports/nav/access/userReports?sort=createddesc"
            @click.stop="navclick"
          >User Reports</b-button
          >
        </div>
        <div class="create-nav">
          <b-form-select
            @input="sortChange"
            style="margin-right: 10px"
            v-model="selected"
          >
            <optgroup label="Sort By">
              <option value="user">User</option>
              <option value="userdesc">User (DESC)</option>
              <option value="created">Created Time</option>
              <option value="createddesc">
                <strong>Created Time (DESC)</strong>
              </option>
            </optgroup>
          </b-form-select>
          <hr class="split-nav" />
        </div>
      </div>
    </p-card>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
export default {
  name: "AccessReportHome",
  data() {
    return {
      selected: "createddesc",
    };
  },
  methods: {
    navclick() {
      this.selected = "createddesc";
    },
    sortChange() {
      let page = this.$route.fullPath;
      this.$router.push({
        path: page,
        query: {
          sort: this.selected,
        },
      });
    },
  },
}
</script>
