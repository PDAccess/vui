<template>
  <b-dropdown variant="ghost-light" :toggle-class="isGroups ? 'active' : ''">
    <template slot="button-content">
      <em class="icon-directions d-md-none"></em>
      <span class="font-weight-bold d-sm-down-none">Groups</span>
    </template>
    <b-dropdown-item :to="{ path: '/groups/nav/all' }"
      >All groups</b-dropdown-item
    >
    <b-dropdown-item :to="{ path: '/groups/nav/yours' }"
      >Your groups</b-dropdown-item
    >
    <b-dropdown-item :to="{ path: '/groups/nav/joined' }"
      >Joined groups</b-dropdown-item
    >
    <b-dropdown-divider></b-dropdown-divider>

    <b-dropdown-item :to="{ path: '/groups/creategroup' }"
      >New Group</b-dropdown-item
    >
  </b-dropdown>
</template>

<script>
export default {
  name: "GroupsDropdown",
  computed: {
    responsive() {
      return screen.width < 500;
    },
    isGroups() {
      return this.$route.path.startsWith("/groups");
    },
  },
};
</script>
<style scoped>
.customDropdown {
  border: 3px dashed cyan;
  background-color: purple;
}
</style>

