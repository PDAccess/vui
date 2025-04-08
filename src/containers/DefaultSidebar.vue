<template>
  <AppSidebar fixed>
    <SidebarHeader />
    <SidebarForm />
    <slot> </slot>
    <!-- <b-button @click="toggle(!isOpenSidebar())" class="toggle-side-btn d-sm-none">
      <i v-if="!isOpenSidebar()" class="fa fa-bars" aria-hidden="true"></i>
      <i v-else class="fa fa-angle-double-left" aria-hidden="true"></i>
    </b-button> -->
    <SidebarFooter />
    <SidebarMinimizer />
  </AppSidebar>
</template>
<script>
import {
  sidebarCssClasses,
  validBreakpoints,
  checkBreakpoint,
} from "@/shared/classes";
import toggleClasses from "@/shared/toggle-classes";

import {
  Sidebar as AppSidebar,
  SidebarFooter,
  SidebarForm,
  SidebarHeader,
  SidebarMinimizer,
  SidebarToggler,
  SidebarNav,
} from "@coreui/vue";

export default {
  name: "DefaultSidebar",
  props: {
    defaultOpen: {
      type: Boolean,
      default: true,
    },
    display: {
      type: String,
      default: "sm",
    },
    mobile: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    responsive() {
      return screen.width < 576;
    },
  },
  components: {
    AppSidebar,
    SidebarForm,
    SidebarFooter,
    SidebarToggler,
    SidebarHeader,
    SidebarNav,
    SidebarMinimizer,
  },
  mounted: function () {
    this.toggle(this.defaultOpen);
    this.$on("onmessage", (event) => {
      that.version = event.version;
    });
  },
  beforeDestroy() {
    this.toggle(false);
  },
  methods: {
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
};
</script>

<style scoped>
.toggle-side-btn {
  position: relative;
  bottom: 94.6%;
  left: 204px;
  z-index: 1000;
  width: 3px;
  padding-left: 10px;
  background-color: transparent;
  border: 0;
}

.toggle-side-btn:focus {
  box-shadow: none !important;
}

.sidebar {
  border-right: 1px solid #e5e5e5;
}
</style>
