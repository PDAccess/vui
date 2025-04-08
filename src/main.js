import "core-js/es6/promise";
import "core-js/es6/string";
import "core-js/es7/array";

import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store/";

//Import Bootstrap Vue
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

//Registry Vue clipboard component
import VueClipboard from "vue-clipboard2";
VueClipboard.config.autoSetContainer = true;
Vue.use(VueClipboard);

//Registry Phone Number input component
import VueTelInput from "vue-tel-input";
Vue.use(VueTelInput);

//Import HTTPPlugin
import HTTPPlugin from "./views/h2h/util/HTTPPlugin";
Vue.use(HTTPPlugin, router);

//Import HTTPPlugin
import ConfigPlugin from "./views/h2h/util/openapi";
Vue.use(ConfigPlugin);

//Import pdavui plugins
import pdaVui from "./views/h2h/util/pdavui";
Vue.use(pdaVui);

//Registry Global moment filter
import momentFilter from "./views/h2h/util/momentFilter";
Vue.filter("moment", momentFilter);

//Registry Global moment function
import momentPlugin from "./views/h2h/util/momentPlugin";
Vue.use(momentPlugin);

//Import FontAwesome library
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
library.add(faSpinner);

//Registry FontAwesomeIcon component
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
Vue.component("font-awesome-icon", FontAwesomeIcon);

//Import Vuelidate
import Vuelidate from "vuelidate";
Vue.use(Vuelidate);

//Import Vue Native Notification
import VueNativeNotification from "vue-native-notification";
Vue.use(VueNativeNotification, {
  // Automatic permission request before
  // showing notification (default: true)
  requestOnNotify: true,
});

//Registry VueFrappe Chart component

//Init local storage variable
localStorage.setItem("selectedUsers", JSON.stringify([]));
localStorage.setItem("selectedServices", JSON.stringify([]));

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: {
    App,
  },
});
