<template>
  <b-dropdown variant="ghost-light">
    <template slot="button-content">
      <template v-if="responsive">
        <em class="icon-direction"></em><span class="font-weight-bold"></span>
      </template>
      <template v-else>
        <em class="icon-direction"></em
        ><span class="font-weight-bold"> act</span>
      </template>
    </template>
    <b-dropdown-item :to="{ path: '/snippets/dashboard' }"
      >Your Snippets</b-dropdown-item
    >
    <b-dropdown-item :to="{ path: '/snippets/explore' }"
      >Explore Snippets</b-dropdown-item
    >
  </b-dropdown>
</template>

<script>
export default {
  name: "AutomationDropdown",
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
};
</script>
