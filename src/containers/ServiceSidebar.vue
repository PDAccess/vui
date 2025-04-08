<template>
  <DefaultSidebar v-if="isAdminForService">
    <SidebarNav :navItems="navItemList"></SidebarNav>
  </DefaultSidebar>
</template>
<script>
import DefaultSidebar from "./DefaultSidebar";
import navservice from "@/router/_navservice";
import { mapGetters } from "vuex";

import { SidebarNav, SidebarNavDropdown } from "@coreui/vue";

export default {
  name: "ServiceSidebar",
  props: ["id"],
  components: {
    DefaultSidebar,
    SidebarNav,
    SidebarNavDropdown,
  },
  data() {
    return {
      isAdminForService: false,
    };
  },
  computed: {
    navItemList() {
      let that = this;
      return navservice.items.map(function (el) {
        let o = {
          url: "",
          name: "",
          icon: "",
          children: null,
        };

        o.url = el.url + "/" + that.id + "?sort=createddesc";
        o.name = el.name;
        o.icon = el.icon;
        if (el.children) {
          o.children = [];
          for (let i in el.children) {
            let child = {...el.children[i]}
            child.url = child.url + "/" + that.id + "?sort=createddesc";
            o.children.push(child);
          }
          return o;
        } else {
          return o;
        }
      });
    },
  },
  created() {
    this.$http.get("/api/v1/service/role/" + this.id)
    .then(response => {
      this.isAdminForService = response.data == "ADMIN";
    }).catch(error => {
      console.log(error);
    })
  },
};
</script>
