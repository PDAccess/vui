import store from "@/store";

export default (to, from, next) => {
  if (store.getters["auth/token"]) {
    next();
    return;
  }
  next("/login");
};
