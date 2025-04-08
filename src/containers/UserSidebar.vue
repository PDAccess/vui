<template>
  <DefaultSidebar>
    <SidebarNav :navItems="navuser"></SidebarNav>
  </DefaultSidebar>
</template>
<script>
import DefaultSidebar from './DefaultSidebar'
import navuser from '@/router/_navuser'

import {
  SidebarNav
} from '@coreui/vue'

export default {
  name: 'AdminSidebar',
  components: {
    DefaultSidebar,
    SidebarNav
  },
  data() {
    return {
      navuser: navuser.items,
    }
  }
}
</script>
