<template>
  <DefaultSidebar v-if="userRole === 'Admin'">
    <SidebarNav :navItems="navItemList"></SidebarNav>
  </DefaultSidebar>
</template>
<script>
import DefaultSidebar from "./DefaultSidebar";
import navgroup from "@/router/_navgroup";
import { mapGetters } from "vuex";

import { SidebarNav } from "@coreui/vue";

export default {
  name: "GroupSidebar",
  props: ["id"],
  components: {
    DefaultSidebar,
    SidebarNav,
  },
  data() {
    return {
      userRole: "",
      userGroupRole: "",
    };
  },
  computed: {
    navItemList() {
      let that = this;
      let items = navgroup.items.map(function (el) {
          if (!that.id) that.id = that.$route.params.id;
          let o = {
            url: "",
            name: "",
            icon: "",
            children: null,
          };
          o.url = el.url + "/" + that.id + "?sort=createddesc";
          o.name = el.name;
          o.icon = el.icon;
          o.role = el.role;
          if (el.children) {
            o.children = [];
            for (let i in el.children) {
              let child = { ...el.children[i] };
              child.url = child.url + "/" + that.id + "?sort=createddesc";
              o.children.push(child);
            }
            return o;
          } else {
            return o;
          }
      });
      return items.filter(function(el) {
        return that.userGroupRole == "ADMIN" || el.role == that.userGroupRole
      });
    },
    ...mapGetters({
      user: "auth/user",
    }),
  },
  created() {
    this.userRole = this.user.role;
    this.$http
      .get(`/api/v1/group/info/${this.id}`)
      .then((response) => {
        this.userGroupRole = response.data.ownMembership;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>
