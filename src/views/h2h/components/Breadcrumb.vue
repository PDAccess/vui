<template>
  <ol v-if="currentRouteName" class="breadcrumb">
    <b-button @click="toggle(!isOpenSidebar())" class="toggle-mobile-nav">
      <i v-if="!isOpenSidebar()" class="fa fa-bars" aria-hidden="true"></i>
      <i v-else class="fa fa-angle-double-left" aria-hidden="true"></i>
    </b-button>
    <li
      class="breadcrumb-item"
      :key="index"
      v-for="(routeObject, index) in routeRecords"
    >
      <span class="active text-bold" v-if="isLast(index)">{{
        getName(routeObject)
      }}</span>
      <router-link :to="routeObject" v-else>{{
        getName(routeObject)
      }}</router-link>
      <em v-if="!isLast(index)" class="fa fa-chevron-right arrow-color"></em>
    </li>
  </ol>
</template>

<script>
import SidebarToggler from "@coreui/vue";
import {
  sidebarCssClasses,
  validBreakpoints,
  checkBreakpoint,
} from "@/shared/classes";
import toggleClasses from "@/shared/toggle-classes";

export default {
  components: {
    SidebarToggler,
  },
  props: {
    list: {
      type: Array,
      required: true,
      default: () => [],
    },
    display: {
      type: String,
      default: null,
    },
    mobile: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    getName(item) {
      return item.meta && item.meta.label ? item.meta.label : item.name || null;
    },
    isLast(index) {
      return index === this.list.length - 1;
    },
    // TODO: This method should be fixed to open sidebard
    toggle(force) {
      const [display, mobile] = [this.display, this.responsive];
      let cssClass = sidebarCssClasses[0];
      if (!mobile && display && checkBreakpoint(display, validBreakpoints)) {
        cssClass = `sidebar-${display}-show`;
      }
      toggleClasses(cssClass, sidebarCssClasses, force);
    },
    isOpenSidebar() {
      return document.body.classList.contains(sidebarCssClasses[0]);
    },
  },

  computed: {
    classList() {
      return ["navbar-toggler"];
    },
    routeRecords: function () {
      return this.list.filter((route) => route.name || route.meta.label);
    },
    currentRouteName() {
      if (this.$route.path.includes("/nav/")) {
        return false;
      } else if (this.$route.path.includes("/user/userdetail/")) {
        return false;
      } else if (this.$route.path.includes("/activities/list")) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>
<style scoped>
.breadcrumb {
  border: none;
  border-left: 0px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  font-weight: 400;
  font-size: 12px;
}
.text-bold {
  font-weight: 600;
}
.breadcrumb-item + .breadcrumb-item::before {
  display: inline-block;
  padding-right: 0rem;
  color: #919191;
  content: "";
}
.arrow-color {
  color: #919191;
  margin-left: 12px;
  font-size: 8px;
}
@media only screen and (max-width: 768px) {
  .toggle-mobile-nav {
    display: flex !important;
    align-items: center;
  }
}
.toggle-mobile-nav {
  display: none;
  background-color: transparent;
  border: 0;
  padding: 6px 16px;
  margin: 0 0 0 -15px;
  height: 15px;
}
</style>