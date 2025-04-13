import PKCE from "js-pkce";

let baseUrl = window.location.protocol + "//" + window.location.host
let redirectUrl = baseUrl

if (process.env.VUE_APP_OAUTH_URL != "") {
  baseUrl = process.env.VUE_APP_OAUTH_URL;
}

const pkce = new PKCE({
  client_id: process.env.VUE_APP_PDAVUI_CLIENT_ID,
  redirect_uri: redirectUrl + "/authcallback",
  authorization_endpoint:
    baseUrl + "/oauth/realm/default/protocol/openid/authorize",
  token_endpoint: 
    baseUrl + "/oauth/realm/default/protocol/openid/token",
  requested_scopes: "*",
  storage: localStorage,
});

export default pkce;
