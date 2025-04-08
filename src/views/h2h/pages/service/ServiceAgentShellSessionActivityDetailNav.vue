<template>
  <div class="animated fadeIn">
    <p-card>
      <div class="d-flex justify-content-between container-nav">
        <div class="module-nav">
          <b-button
            class="btn btn-ghost-primary"
            :to="'/service/agentShellActivities/session/' + id + '/' + sessionId"
            type="button"
          >
            <span class="d-md-down-none">Table&nbsp;</span>
          </b-button>
          <b-button
            class="btn btn-ghost-primary"
            style="margin-left: 5px"
            :to="'/service/agentShellActivities/session/xterm/' + id + '/' + sessionId"
            type="button"
          >
            <span class="d-md-down-none">Terminal&nbsp;</span>
          </b-button>
        </div>
      </div>
    </p-card>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
    props: ["id", "sessionId"]
};
</script>