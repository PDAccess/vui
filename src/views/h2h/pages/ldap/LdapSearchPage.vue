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
  components: {
    LdapSearchComponent,
  },
  data() {
    return {
    };
  },
  methods: {
  },
  created() {
  },
};
</script>
<style scoped>

.form-group {
  margin-bottom: 0!important;
}

.spoiler button {
  visibility: hidden;
}

.spoiler:hover button {
  visibility: visible;
}
</style>
