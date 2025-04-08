<template>
  <div class="animated fadeIn">
    <p-card>
      <div class="d-flex justify-content-between container-nav">
        <div class="module-nav">
          <b-button
            class="btn btn-ghost-primary"
            :to="'/service/tacacs/authentication/' + id"
            type="button"
          >
            <span class="d-md-down-none">Authentication&nbsp;</span></b-button
          >
          <b-button
            class="btn btn-ghost-primary"
            style="margin-left: 5px"
            :to="'/service/tacacs/authorization/' + id"
            type="button"
          >
            <span class="d-md-down-none">Authorization&nbsp;</span></b-button
          >
          <b-button
            class="btn btn-ghost-primary"
            style="margin-left: 5px"
            :to="'/service/tacacs/accounting/' + id"
            type="button"
          >
            <span class="d-md-down-none">Accounting&nbsp;</span></b-button
          >
        </div>
      </div>
    </p-card>
    <router-view
      :key="$route.fullPath"
    ></router-view>
  </div>
</template>

<script>
export default {
    name: "ServiceTacacsNav",
    props: ["id"]
};
</script>
