<template>
<div class="animated fadeIn">
  <p-card>
    <div class="d-flex justify-content-end">


        <b-button variant="success" to="/admin/users/createuser">Create User</b-button>

    </div>
  </p-card>
  <router-view></router-view>
</div>
</template>