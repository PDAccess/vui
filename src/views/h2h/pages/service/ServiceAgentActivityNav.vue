<template>
  <div class="animated fadeIn">
    <p-card >
      <div class="d-flex justify-content-between container-nav">
        <div class="module-nav">
          <!--
          <b-button class="btn btn-ghost-primary" :to="'/service/agentActivities/sessions/' + id" type="button">Sessions</b-button>
          <b-button class="btn btn-ghost-primary" style="margin-left: 5px" :to="'/service/agentActivities/command/' + id" type="button">Command Logs</b-button>
          <b-button class="btn btn-ghost-primary" style="margin-left: 5px" :to="'/service/agentActivities/authentication/' + id" type="button">Authentication Logs</b-button>
          -->
          <b-button class="btn btn-ghost-primary" style="margin-left: 5px" :to="'/service/agentActivities/status/' + id" type="button">Agent Status</b-button>
          <b-button class="btn btn-ghost-primary" style="margin-left: 5px" :to="'/service/agentActivities/file/' + id" type="button">File Logs</b-button>
        </div>
      </div>
    </p-card>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
    export default {
        props: ["id"]
    }
</script>