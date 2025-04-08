<template>
  <DefaultSidebar>
    <SidebarNav :navItems="navItemList" v-if="user.role === 'Admin'"></SidebarNav>
  </DefaultSidebar>
</template>

<script>
import DefaultSidebar from "./DefaultSidebar";
import vault from "@/router/_navvault";
import { SidebarNav } from "@coreui/vue";
import { mapGetters } from "vuex";

export default {
  name: "VaultSidebar",
  props: ["id"],
  computed: {
    navItemList() {
      let that = this;
      return vault.items.map(function (el) {
        let o = {
          url: "",
          name: "",
          icon: "",
          children: null,
        };

        o.url = el.url + "/" + that.id;
        o.name = el.name;
        o.icon = el.icon;
        if (el.children) {
          o.children = [];
          for (let i in el.children) {
            let child = {...el.children[i]}
            child.url = child.url + "/" + that.id;
            o.children.push(child);
          }
          return o;
        } else {
          return o;
        }
      });
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
      vault: vault.items,
    };
  },
  created() {
    console.log("id", this.id)
  },
};
</script>
