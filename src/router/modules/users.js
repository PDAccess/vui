const DefaultContainer = () => import("@/containers/DefaultContainer");
const UserSidebar = () => import("@/containers/UserSidebar");

const UserProfile = () => import("@/views/h2h/pages/user/UserProfile");
const UserSettingsProfile = () =>
  import("@/views/h2h/pages/setting/user/Profile");
const UserSettingsNotifications = () =>
  import("@/views/h2h/pages/setting/user/Notifications");
const UserSettingsPassword = () =>
  import("@/views/h2h/pages/setting/user/Password");
const UserSettingsPreferences = () =>
  import("@/views/h2h/pages/setting/user/Preferences");
const UserSettingsAuth = () =>
  import("@/views/h2h/pages/setting/user/Authenticationlog");
const UserSettingsActiveSessions = () =>
  import("@/views/h2h/pages/setting/user/ActiveSessions");
const UserSettingsDelete = () =>
  import("@/views/h2h/pages/setting/user/Delete");
const UserSettingsTwoFactorAuthentication = () =>
  import("@/views/h2h/pages/setting/user/TwoFactorAuthentication");
const AccessToken = () => import("@/views/h2h/pages/setting/user/Token");
const QR = () => import("@/views/h2h/pages/setting/user/QR");
const QRRegistry = () => import("@/views/h2h/pages/setting/user/QRRegistry");
const QRMatch = () => import("@/views/h2h/pages/setting/user/QRMatch");

import ifAuthenticated from "./auth";

export default [
  {
    path: "/user",
    name: "Users",
    //  redirect: '/service/all',
    component: DefaultContainer,
    children: [
      {
        path: "Settings",
        name: "User profile",
        meta: {
          label: "User Settings",
        },
        components: {
          default: UserSettingsProfile,
          sidebar: UserSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "notifications",
        name: "Notifications",
        components: {
          default: UserSettingsNotifications,
          sidebar: UserSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "delete",
        name: "Delete",
        components: {
          default: UserSettingsDelete,
          sidebar: UserSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "twofactorauthentication",
        name: "2FA",
        components: {
          default: UserSettingsTwoFactorAuthentication,
          sidebar: UserSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "preferences",
        name: "Preferences",
        components: {
          default: UserSettingsPreferences,
          sidebar: UserSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "password",
        name: "Password",
        components: {
          default: UserSettingsPassword,
          sidebar: UserSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "accesstokens",
        name: "Access Tokens",
        components: {
          default: AccessToken,
          sidebar: UserSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "activesessions",
        name: "Active sessions",
        components: {
          default: UserSettingsActiveSessions,
          sidebar: UserSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "authlogs",
        name: "Authentication logs",
        components: {
          default: UserSettingsAuth,
          sidebar: UserSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "userdetail/:id",
        name: "User Detail",
        component: UserProfile,
        props: true,
        beforeEnter: ifAuthenticated,
      },
      {
        path: "qr",
        name: "QR",
        components: {
          default: QR,
          sidebar: UserSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "qrregistry/:qrcode",
        name: "QRRegistry",
        components: {
          default: QRRegistry,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "qrmatch/:qrcode",
        name: "QRMatch",
        components: {
          default: QRMatch,
        },
        beforeEnter: ifAuthenticated,
      },
    ],
  },
];
