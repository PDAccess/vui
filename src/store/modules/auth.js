import axios from "axios";

export default {
  namespaced: true,
  state: {
    token: null,
    refresh: null,
    user: null,
    loginMethod: "standart",
  },
  getters: {
    token: (state) => state.token,
    refresh: (state) => state.refresh,
    user: (state) => state.user,
    lastLogin: (state) => state.loginMethod,
  },
  mutations: {
    APP_LOAD: (state, o) => {
      state.user = o.user;
      state.token = o.token;
      state.refresh = o.refresh;
    },
  },
  actions: {
    logOut: ({ commit }) => {
      return new Promise((resolve, reject) => {
        commit("APP_LOAD", { user: null, token: null, refresh: null });
        resolve("success");
      });
    },
    loadData: ({ commit }, {token, refresh}) => {
      return new Promise((resolve, reject) => {
        axios
          .get("/api/v1/auth/user", {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((res) => {
            commit("APP_LOAD", { user: res.data, token: token, refresh: refresh });
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    ldapLogin: ({ state, dispatch }, user) => {
      return new Promise((resolve, reject) => {
        axios
          .post("/api/v1/login", user)
          .then(async (resp) => {
            if (resp.status === 200) {
            const token = resp.data.access_token;
            const refresh = resp.data.refresh_token;
            state.loginMethod = "LDAP";
            dispatch("loadData", token, refresh)
              .then(() => {
                if (state.user.blocked === null) {
                  resolve(false);
                } else {
                  dispatch("logOut");
                  reject("You are blocked!");
                }
              })
              .catch((err) => {
                reject(err);
              });
            } else if (resp.status === 202) {
              resolve(true);
            }
          })
          .catch((err) => {
            console.log(err);
            if (err.response.status === 400) {
              reject("Message:" + err.response.data.message);
            } else {
              reject("LDAP configuration error!");
            }
          });
      });
    },
    login: ({ state, dispatch }, user) => {
      return new Promise((resolve, reject) => {
        axios
          .post("/api/v1/login", user)
          .then(async (resp) => {
            if (resp.status === 200) {
              const token = resp.data.access_token;
              const refresh = resp.data.refresh_token;
              state.loginMethod = "standart";
              dispatch("loadData", token, refresh)
                .then(() => {
                  if (state.user.blocked === null) {
                    resolve(false);
                  } else {
                    dispatch("logOut");
                    reject("You are blocked!");
                  }
                })
                .catch((err) => {
                  reject(err);
                });
            } else if (resp.status === 202) {
              resolve(true);
            }
          })
          .catch((err) => {
              console.log(err);
              reject("Message:" + err.response.data.message);
          });
      });
    },
  },
};
