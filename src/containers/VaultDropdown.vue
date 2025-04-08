<template>
  <b-dropdown variant="ghost-light" :toggle-class="isVault ? 'active' : ''">
    <template slot="button-content">
      <!-- <b-icon icon="three-dots-vertical"></b-icon> -->
      <em class="fa fa-id-card d-md-none"></em>
      <span class="font-weight-bold d-sm-down-none">Vault</span>
    </template>
    <b-dropdown-item to="/vault/nav/list"> All Credentials </b-dropdown-item>
    <b-dropdown-item to="/vault/nav/yours"> Your Credentials </b-dropdown-item>
    <b-dropdown-item to="/vault/createcredential">
      New Credentail
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
export default {
  name: "VaultDropdown",
  computed: {
    responsive() {
      return screen.width < 500;
    },
    isVault() {
      return this.$route.path.startsWith("/vault");
    },
  },
};
</script>
