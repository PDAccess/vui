import axios from 'axios';

import 'nprogress/nprogress.css';
import NProgress from 'nprogress';
import store from '../../../store';
import pkce from '@/views/h2h/util/authz';

NProgress.configure({ showSpinner: false });

export const HTTP = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json'
  }
});

const HTTPPlugin = {
  install(Vue, options) {
    let router = options;
    HTTP.interceptors.request.use((config) => {
      let token = store.getters['auth/token'];

      if (token) {
        config.headers = {
          'Authorization': 'Bearer ' + token
        }
      }
      else {
        console.log("there is no token");
        router.push('/login');
        return Promise.reject(config);
      }

      NProgress.start();
      return config;
    }, (error) => {
      NProgress.done();
      return error;
    });

    HTTP.interceptors.response.use((response) => {
      if (response.status === 401) {
        let refresh = store.getters['auth/refresh'];
        pkce.refreshAccessToken(refresh).then((resp) => {
          const accessToken = resp.access_token;
          const refreshToken = resp.refresh_token;
          store.dispatch("loadData", accessToken, refreshToken)
          console.log("refresh token success")

          error.config.headers = {
            'Authorization': 'Bearer ' + accessToken
          }

          return axios.request(error.config);
        }).catch((error) => {
          console.log("refresh token got error:" + error)
          localStorage.clear();
          this.$router.push(this.$route.query.redirect || '/login');
          throw new axios.Cancel('token error');
        });
      }
      NProgress.done();
      return response;
    }, (error) => {
      NProgress.done();
      console.log('inspector error');
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        router.push('/login');
        console.log('redirected');
      }

      return Promise.reject(error.response);
    });

    Vue.prototype.$http = HTTP;
  }
}

export default HTTPPlugin;
