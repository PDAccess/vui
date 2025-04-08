<template>
  <DefaultSidebar>
    <SidebarNav :navItems="navItemList"></SidebarNav>
  </DefaultSidebar>
</template>
<script>
import DefaultSidebar from './DefaultSidebar'
import navautomation from '@/router/_navautomation'

import {
  SidebarNav
} from '@coreui/vue'

export default {
  name: 'AutomationSidebar',
  props:['id'],
  components: {
    DefaultSidebar,
    SidebarNav
  },
  computed:{
    navItemList(){
      let that = this;
      return navautomation.items.map(function(el){
        let o = {}

        o.url = el.url + "/" + that.id;
        o.name = el.name;
        o.icon = el.icon;
        return o;
      });
    }
  }
}
</script>
