<template>
  <b-dropdown variant="ghost-light" :toggle-class="isService ? 'active' : ''">
    <template slot="button-content">
      <template>
        <em class="font-weight-bold d-md-none icon-direction"></em>
        <span class="font-weight-bold d-sm-down-none"> Services</span>
      </template>
    </template>
    <b-dropdown-item :to="{ path: '/service/nav/list' }"
      >All Services</b-dropdown-item
    >
    <b-dropdown-item :to="{ path: '/service/nav/yours' }"
      >Your Services</b-dropdown-item
    >
    <b-dropdown-item :to="{ path: '/service/nav/agent/active' }"
      >Agent Services</b-dropdown-item
    >
    <b-dropdown-item :to="{ path: '/service/nav/marked' }"
      >Marked Services</b-dropdown-item
    >
    <b-dropdown-divider></b-dropdown-divider>

    <b-dropdown-item :to="{ path: '/service/createservice' }"
      >New Service</b-dropdown-item
    >
  </b-dropdown>
</template>

<script>
export default {
  name: "ServicesDropdown",
  computed: {
    responsive() {
      return screen.width < 500;
    },
    isService() {
      return this.$route.path.startsWith("/service");
    },
  },
};
</script>