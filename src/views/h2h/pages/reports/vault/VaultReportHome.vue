<template>
  <div class="animated fadeIn" style="background: white; height: 100%">
    <p-card>
      <div class="d-flex justify-content-between container-nav">
        <div class="module-nav">
          <b-button
            type="button"
            class="btn btn-ghost-primary"
            to="/reports/nav/vault/portalReports?sort=createddesc"
            @click.stop="navclick"
          >Portal Reports</b-button
          >
          <b-button
            type="button"
            class="btn btn-ghost-primary"
            style="margin-left: 5px"
            to="/reports/nav/vault/changePasswordReports?sort=createddesc"
            @click.stop="navclick"
          >Change Password Reports</b-button
          >
          <b-button
            type="button"
            class="btn btn-ghost-primary"
            style="margin-left: 5px"
            to="/reports/nav/vault/serviceAccountUsersReports?sort=createddesc"
            @click.stop="navclick"
          >Service Account User Reports</b-button
          >
          <b-button
            type="button"
            class="btn btn-ghost-primary"
            style="margin-left: 5px"
            to="/reports/nav/vault/excludeSystemReports?sort=createddesc"
            @click.stop="navclick"
          ><span class="d-sm-down-none">Exclude System Reports</span></b-button
          >
          <b-button
            type="button"
            class="btn btn-ghost-primary"
            style="margin-left: 5px"
            to="/reports/nav/vault/allAccountReports?sort=createddesc"
            @click.stop="navclick"
          ><span class="d-sm-down-none">All Account Reports</span></b-button
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
  name: "VaultsReportHome",
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
