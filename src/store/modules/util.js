import axios from "axios";

export default {
  namespaced: true,
  state: {
    homePageUrl: "/activities",
    logOutUrl: "",
    dateRangeData: null,
    cacheNumber: Math.ceil(Math.random() * 100000000),
    selectedUsers: [],
    selectedServices: [],
    lang: "En",
    selectedCredentials: null,
    selectedUserPermission: null,
  },
  getters: {
    homePageUrl: (state) => state.homePageUrl,
    logOutUrl: (state) => state.logOutUrl,
    dateRangeData: (state) => state.dateRangeData,
    cacheNumber: (state) => state.cacheNumber,
    selectedServices: (state) => state.selectedServices,
    selectedUsers: (state) => state.selectedUsers,
    lang: (state) => state.lang,
    selectedCredentials: (state) => state.selectedCredentials,
    selectedUserPermission: (state) => state.selectedUserPermission,
  },
  mutations: {
    LOAD_HOME_PAGE_URL: (state, o) => {
      state.homePageUrl = o;
    },
    LOAD_LOG_OUT_URL: (state, o) => {
      state.logOutUrl = o;
    },
    SET_CACHE_NUMBER: (state, o) => {
      state.cacheNumber = o;
    },
    SET_SELECTED_USERS: (state, o) => {
      state.selectedUsers = o;
    },
    SET_SELECTED_SERVICES: (state, o) => {
      state.selectedServices = o;
    },
    SET_DATE_RANGE_DATA: (state, o) => {
      state.dateRangeData = o;
    },
    SET_LANG: (state, o) => {
      state.lang = o;
    },
    SET_SELECTED_CREDENTIALS: (state, o) => {
      state.selectedCredentials = o;
    },
    SET_SELECTED_USER_PERMISSION: (state, o) => {
      state.selectedUserPermission = o;
    },
  },
  actions: {
    getUrls: ({ commit }) => {
      return new Promise(() => {
        axios.get("/api/v1/tag/home-page-url").then((res) => {
          if (res.data !== null) {
            commit("LOAD_HOME_PAGE_URL", res.data);
          }
        });
        axios.get("/api/v1/tag/sign-out-path").then((res) => {
          if (res.data !== null) {
            commit("LOAD_LOG_OUT_URL", res.data);
          }
        });
      });
    },
    setCacheNumber({ commit }) {
      commit("SET_CACHE_NUMBER", Math.ceil(Math.random() * 100000000));
    },
    setSelectedServices({ commit }, services) {
      commit("SET_SELECTED_SERVICES", services);
    },
    setSelectedUsers({ commit }, users) {
      commit("SET_SELECTED_USERS", users);
    },
    setDateRangeData({ commit }, dateRangeData) {
      commit("SET_DATE_RANGE_DATA", dateRangeData);
    },
    setLang({ commit }, lang) {
      commit("SET_LANG", lang);
    },
    setSelectedCredentials({ commit }, credential) {
      commit("SET_SELECTED_CREDENTIALS", credential);
    },
    setSelectedUserPermission({ commit }, param) {
      commit("SET_SELECTED_USER_PERMISSION", param);
    },
  },
};
