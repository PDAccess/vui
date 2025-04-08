<template>
  <b-dropdown variant="ghost-light">
    <template slot="button-content">
      <b-icon icon="three-dots-vertical" class="d-md-none"></b-icon>
      <span class="font-weight-bold d-sm-down-none">More</span>
    </template>
    <b-dropdown-item to="/activities">
      <span class="d-sm-down-none"> Activities</span>
    </b-dropdown-item>
    <b-dropdown-item to="/snippets"> Snippets </b-dropdown-item>
    <b-dropdown-item to="/playbook">
      Playbooks <b-badge variant="warning">beta</b-badge>
    </b-dropdown-item>
    <b-dropdown-item to="/ldaps"> LDAP Editor </b-dropdown-item>
    <b-dropdown-item to="/reports/nav/vault/portalReports?sort=createddesc">
      Reports
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
export default {
  name: "MoreDropdown",
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
};
</script>
