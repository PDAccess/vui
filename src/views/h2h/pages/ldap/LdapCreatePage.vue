<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <p-card>
        <ldap-search-component />
      </p-card>
    </div>
  </div>
</template>

<script>
import LdapSearchComponent from "../../components/LdapSearchComponent";

export default {
  name: "LdapCreatePage",
  components: {LdapSearchComponent}
}
</script>
