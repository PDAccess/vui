<template>
  <div class="animated fadeIn">
    <p-card>
      <div class="d-flex justify-content-between container-nav">
        <div class="module-nav">
          <b-button
            class="btn btn-ghost-primary"
            to="/playbook/nav/playbooks"
            type="button"
            >Your Playbooks</b-button
          >
          <b-button
            class="btn btn-ghost-primary"
            style="margin-left: 5px"
            to="/playbook/nav/exploreplaybooks"
            type="button"
            >Explore Playbooks</b-button
          >
        </div>
        <div class="create-nav">
          <b-form inline>
            <b-form-select
              class="sort-input"
              @input="sortChange"
              style="margin-right: 10px"
              v-model="selected"
            >
              <optgroup label="Sort By">
                <option value="name">Name</option>
                <option value="namedesc">Name (Desc)</option>
                <option value="create">Created at</option>
                <option value="createdesc">Created at (Desc)</option>
              </optgroup>
            </b-form-select>
            <b-button
              class="create-snippet-btn"
              to="/playbook/createplaybook"
              v-if="user.role === 'Admin'"
              variant="success"
              >Create Playbooks</b-button
            >
          </b-form>
          <hr class="split-nav" />
        </div>
      </div>
    </p-card>
    <p-card>
      <router-view :key="$route.fullPath"></router-view>
    </p-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "PlaybookNav",
  data() {
    return {
      selected: "createdesc",
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  methods: {
    sortChange() {
      let page = this.$route.fullPath;
      this.$router.push({
        path: page,
        query: {
          sort: this.selected,
        },
      });
    },
  },
};
</script>
<style scoped>
@media only screen and (max-width: 400px) {
  .create-snippet-btn {
    font-size: 0.8rem !important;
  }
}
</style>
