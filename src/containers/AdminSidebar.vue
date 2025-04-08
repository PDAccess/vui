<template>
  <DefaultSidebar>
    <SidebarNav :navItems="navItemList"></SidebarNav>
  </DefaultSidebar>
</template>
<script>
import DefaultSidebar from "./DefaultSidebar";
import administration from "@/router/_administration";
import { SidebarNav } from "@coreui/vue";
import { mapGetters } from "vuex";

export default {
  name: "AdminSidebar",
  computed: {
    navItemList() {
      let items = [];
      let that = this;
      administration.items.forEach(function (el) {
        if (el.realmAdmin && !that.user.realm == "default") {
          return
        }

        let o = {
          url: "",
          name: "",
          icon: "",
          children: null,
        };
        o.url = el.url;
        o.name = el.name;
        o.icon = el.icon;
        if (el.children) {
          o.children = [];
          for (let i in el.children) {
            o.children.push(el.children[i]);
          }
          items.push(o)
        } else {
          items.push(o)
        }
      });
      return items;
    },
    ...mapGetters({
      user: "auth/user",
    }),
  },
  components: {
    DefaultSidebar,
    SidebarNav,
  },
  data() {
    return {
      administration: administration.items,
    };
  },
  created() {
    if (this.user.role !== "Admin") {
      this.$router.push({ path: "/service/nav/list" });
    }
  },
};
</script>
