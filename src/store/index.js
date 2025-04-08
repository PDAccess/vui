import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth";
import util from "./modules/util";
import createLogger from "vuex/dist/logger";
import VuexPersistence from "vuex-persist";

Vue.use(Vuex);

const authPersist = new VuexPersistence({
    modules: ["auth"],
    key: "auth",
});
const utilPersist = new VuexPersistence({
    modules: ["util"],
    key: "util",
});

export default new Vuex.Store({
    modules: {
        auth,
        util
    },
    strict: true,
    plugins: [authPersist.plugin, utilPersist.plugin, createLogger()],
});
