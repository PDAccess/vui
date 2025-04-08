<template>
  <div class="animated fadeIn">
    <p-card >
      <div class="d-flex justify-content-between container-nav">
        <div class="module-nav">
          <b-button class="btn btn-ghost-primary" to="/service/nav/agent/active" type="button">Active Services</b-button>
          <b-button class="btn btn-ghost-primary ml-1" to="/service/nav/agent/inactive" type="button">Inactive Services</b-button>
        </div>
      </div>
    </p-card>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
    export default {

    }
</script>