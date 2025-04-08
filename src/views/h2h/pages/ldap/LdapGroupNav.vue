<template>
  <div class="animated fadeIn">
    <p-card>
      <div class="d-flex justify-content-between">
        <div></div>
        <div>
          <b-form inline>
            <b-form-select
              @input="sortChange"
              style="margin-right: 10px; width: 190px"
              v-model="selected"
            >
              <optgroup label="Sort By">
                <option value="name">Name</option>
              </optgroup>
            </b-form-select>
            <b-button
              to="/ldap/groups/create/group"
              v-if="user.role === 'Admin'"
              variant="success"
              >Create Group</b-button
            >
          </b-form>
        </div>
      </div>
    </p-card>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "GroupsPage",
  data() {
    return {
      selected: "name",
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
