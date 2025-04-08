<template>
  <div class="animated fadeIn" style="background: white; height: 100%">
    <p-card>
      <div class="d-flex justify-content-between container-nav">
        <div class="module-nav">
          <b-button
            type="button"
            class="btn btn-ghost-primary"
            to="/reports/nav/vault/portalReports?sort=createddesc"
            :active="$route.fullPath.includes('/vault/')"
          >Vault Reports</b-button
          >
          <b-button
            type="button"
            class="btn btn-ghost-primary"
            style="margin-left: 5px"
            to="/reports/nav/access/serversAgentVersions?sort=createddesc"
            :active="$route.fullPath.includes('/access/')"
          >Access Reports</b-button
          >
        </div>
      </div>
    </p-card>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
export default {
  name: "ReportsNav",
}
</script>
