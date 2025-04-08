import Vue from "vue";
import Router from "vue-router";

import VueNativeNotification from "vue-native-notification";

// modules
import adminRoutes from "./modules/admin.js";
import userRoutes from "./modules/users.js";
import vaultRoutes from "./modules/vault.js";
import serviceRoutes from "./modules/service.js";
import groupRoutes from "./modules/group.js";

// Containers
const DefaultContainer = () => import("@/containers/DefaultContainer");

// Views - Pages
const Page404 = () => import("@/views/pages/Page404");
const Page500 = () => import("@/views/pages/Page500");
const Login = () => import("@/views/pages/Login");
const Auth = () => import("@/views/pages/Auth");
const Authcallback = () => import("@/views/pages/Authcallback");
const Register = () => import("@/views/pages/Register");
const Seal = () => import("@/views/pages/Seal");
const VaultInit = () => import("@/views/pages/VaultInit");
const VaultError = () => import("@/views/pages/VaultError");

// pages - automation
const AutomationPage = () => import("@/views/h2h/pages/AutomationPage");
const AutomationNav = () =>
  import("@/views/h2h/pages/automation/AutomationNav");
const PublicSnippetPage = () =>
  import("@/views/h2h/pages/automation/PublicSnippetPage");
const CreateSnippet = () =>
  import("@/views/h2h/pages/automation/CreateSnippet");
const SnippetDetail = () =>
  import("@/views/h2h/pages/automation/SnippetDetail");
const EditSnippet = () => import("@/views/h2h/pages/automation/EditSnippet");

//pages - activity
const ActivitiesPage = () => import("@/views/h2h/pages/activity/ActivitiesPage");
const LiveSessionsPage = () =>
  import("@/views/h2h/pages/activity/LiveSessionsPage");
const ExternalActionsPage = () =>
  import("@/views/h2h/pages/activity/ExternalActionsPage");
const ActionPage = () => import("@/views/h2h/pages/activity/ActionPage");
const AuthLogs = () => import("@/views/h2h/pages/activity/AuthLogs");
const BreakTheGlassList = () =>
  import("@/views/h2h/pages/setting/BreaktheglasstList");

//pages - playbook
const PlaybookDetailsPage = () =>
  import("@/views/h2h/pages/playbook/PlaybookDetailsPage");
const PlaybookEditPage = () =>
  import("@/views/h2h/pages/playbook/PlaybookEditPage");
const PlaybookNav = () => import("@/views/h2h/pages/playbook/PlaybookNav");
const PlaybookListPage = () =>
  import("@/views/h2h/pages/playbook/PlaybookListPage");
const ExplorePlaybookListPage = () =>
  import("@/views/h2h/pages/playbook/ExplorePlaybookListPage");

// pages - other
const HelpPage = () => import("@/views/h2h/pages/other/help/Index");
const AboutPage = () => import("@/views/h2h/pages/other/AboutPage");
const DownloadPage = () => import("@/views/h2h/pages/other/DownloadPage");

// pages -session
const SessionDetailPage = () =>
  import("@/views/h2h/pages/session/SessionDetailPage");
const SessionPage = () => import("@/views/h2h/pages/session/SessionsPage");

const QRRegistry = () => import("@/views/h2h/pages/setting/user/QRRegistry");
const QRMatch = () => import("@/views/h2h/pages/setting/user/QRMatch");

//pages - ldap
const LdapGroupPage = () => import("@/views/h2h/pages/ldap/LdapGroupPage");
const LdapServerPage = () => import("@/views/h2h/pages/ldap/LdapServerPage");
const LdapGroupNav = () => import("@/views/h2h/pages/ldap/LdapGroupNav");
const LdapServerNav = () => import("@/views/h2h/pages/ldap/LdapServerNav");
const LdapServerCreatePage = () =>
  import("@/views/h2h/pages/ldap/LdapServerCreatePage");
const LdapGroupCreatePage = () =>
  import("@/views/h2h/pages/ldap/LdapGroupCreatePage");
const LdapUserPage = () => import("@/views/h2h/pages/ldap/LdapUserPage");
const LdapLogPage = () => import("@/views/h2h/pages/ldap/LdapLogPage");
const LdapUserCreatePage = () =>
  import("@/views/h2h/pages/ldap/LdapUserCreatePage");
const LdapRolePage = () => import("@/views/h2h/pages/ldap/LdapRolePage");
const LdapRoleCreatePage = () =>
  import("@/views/h2h/pages/ldap/LdapRoleCreatePage");
const LdapSearchPage = () => import("@/views/h2h/pages/ldap/LdapSearchPage");
const LdapCreate = () => import("@/views/h2h/pages/ldap/LdapCreatePage");

// pages - Reports
const ReportsNav = () => import("@/views/h2h/pages/reports/ReportsNav");
const VaultReportHome = () =>
  import("@/views/h2h/pages/reports/vault/VaultReportHome");
const PortalReports = () =>
  import("@/views/h2h/pages/reports/vault/PortalReports");
const ChangePasswordReports = () =>
  import("@/views/h2h/pages/reports/vault/ChangePasswordReports");
const ServiceAccountUsersReports = () =>
  import("@/views/h2h/pages/reports/vault/ServiceAccountUsersReports");
const ExcludeSystemReports = () =>
  import("@/views/h2h/pages/reports/vault/ExcludeSystemReports");
const AllAccountReports = () =>
  import("@/views/h2h/pages/reports/vault/AllAccountReports");
const AccessReportHome = () =>
  import("@/views/h2h/pages/reports/access/AccessReportHome");
const ServersAgentVersions = () =>
  import("@/views/h2h/pages/reports/access/ServersAgentVersions");
const ServerUsersAuths = () =>
  import("@/views/h2h/pages/reports/access/ServerUsersAuths");
const UserReports = () =>
  import("@/views/h2h/pages/reports/access/UserReports");

const AlarmsPage = () =>
  import("@/views/h2h/pages/alarms/AlarmsPage");

import ifAuthenticated from "./modules/auth";

Vue.use(Router);

Vue.use(VueNativeNotification, {
  // Automatic permission request before
  // showing notification (default: true)
  requestOnNotify: true,
});

export default new Router({
  mode: "history",
  linkActiveClass: "open active",
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: [
    ...adminRoutes,
    ...groupRoutes,
    ...serviceRoutes,
    ...userRoutes,
    ...vaultRoutes,
    {
      path: "/",
      redirect: "/service/nav/list",
      name: "LoginPage",
      component: {
        render(c) {
          return c("router-view");
        },
      },
      children: [
        {
          path: "login",
          name: "Login",
          component: Auth,
        },
        {
          path: "authcallback",
          name: "authcallback",
          component: Authcallback,
        },
        {
          path: "seal",
          name: "Seal",
          component: Seal,
        },
        {
          path: "vaultinit",
          name: "Vault Init",
          component: VaultInit,
        },
        {
          path: "vaulterror",
          name: "Vault Error",
          component: VaultError,
        },
      ],
    },
    {
      path: "/alarms",
      component: DefaultContainer,
      children: [
        {
          path: "/",
          component: AlarmsPage,
          name: "Alarms",
          beforeEnter: ifAuthenticated,
        },
      ]
    },
    {
      path: "/",
      redirect: "/service/nav/list",
      name: "Home",
      component: DefaultContainer,
      children: [
        {
          path: "about",
          component: AboutPage,
          name: "About",
          beforeEnter: ifAuthenticated,
        },
        {
          path: "download",
          component: DownloadPage,
          name: "Download",
          beforeEnter: ifAuthenticated,
        },
        {
          path: "session/:id",
          name: "Session Detail",
          component: SessionDetailPage,
          props: true,
          beforeEnter: ifAuthenticated,
        },
      ],
    },
    {
      path: "/",
      redirect: "/help",
      name: "Help",
      component: DefaultContainer,
      children: [
        {
          path: "help/:title",
          component: HelpPage,
          name: "",
          beforeEnter: ifAuthenticated,
        },
      ],
    },
    {
      path: "/ldaps",
      component: DefaultContainer,
      children: [
        {
          path: "/",
          name: "LDAPS",
          component: LdapSearchPage,
        },
      ],
    },
    {
      path: "/reports",
      redirect: "/reports/nav/vault/portalReports",
      component: DefaultContainer,
      children: [
        {
          path: "nav",
          redirect: "/reports/nav/vault/portalReports",
          component: ReportsNav,
          beforeEnter: ifAuthenticated,
          children: [
            {
              path: "vault/",
              redirect: "/reports/nav/vault/portalReports",
              component: VaultReportHome,
              beforeEnter: ifAuthenticated,
              children: [
                {
                  path: "portalReports",
                  name: "Portal Reports",
                  component: PortalReports,
                  beforeEnter: ifAuthenticated,
                },
                {
                  path: "changePasswordReports",
                  name: "Change Password Reports",
                  component: ChangePasswordReports,
                  beforeEnter: ifAuthenticated,
                },
                {
                  path: "serviceAccountUsersReports",
                  name: "Service Account User Reports",
                  component: ServiceAccountUsersReports,
                  beforeEnter: ifAuthenticated,
                },
                {
                  path: "excludeSystemReports",
                  name: "Exclude System Reports",
                  component: ExcludeSystemReports,
                  beforeEnter: ifAuthenticated,
                },
                {
                  path: "allAccountReports",
                  name: "All Account Reports",
                  component: AllAccountReports,
                  beforeEnter: ifAuthenticated,
                },
              ],
            },
            {
              path: "access",
              redirect: "/reports/nav/access/serversAgentVersions",
              component: AccessReportHome,
              beforeEnter: ifAuthenticated,
              children: [
                {
                  path: "serversAgentVersions",
                  name: "Servers Agent Versions",
                  component: ServersAgentVersions,
                  beforeEnter: ifAuthenticated,
                },
                {
                  path: "serverUsersAuths",
                  name: "Server Users Auths",
                  component: ServerUsersAuths,
                  beforeEnter: ifAuthenticated,
                },
                {
                  path: "userReports",
                  name: "User Reports",
                  component: UserReports,
                  beforeEnter: ifAuthenticated,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/activities",
      redirect: "/activities/list",
      component: DefaultContainer,
      children: [
        {
          path: "list",
          name: "Activities",
          component: ActivitiesPage,
          beforeEnter: ifAuthenticated,
        },
      ]
    },
    {
      path: "/snippets",
      redirect: "/snippets/nav/yoursnippets",
      component: DefaultContainer,
      children: [
        {
          path: "nav",
          redirect: "/snippets/nav/yoursnippets",
          name: "Automations",
          component: AutomationNav,
          beforeEnter: ifAuthenticated,
          children: [
            {
              path: "yoursnippets",
              name: "Your Snippets",
              component: AutomationPage,
              beforeEnter: ifAuthenticated,
            },
            {
              path: "exploresnippets",
              name: "Explore Snippets",
              component: PublicSnippetPage,
              beforeEnter: ifAuthenticated,
            },
          ],
        },
        {
          path: "createsnippet",
          name: "Create Snippet",
          component: CreateSnippet,
          beforeEnter: ifAuthenticated,
        },
        {
          path: "snippet/:id",
          name: "Snippet Detail",
          components: {
            default: SnippetDetail,
          },
          props: {
            default: true,
            sidebar: true,
          },
          beforeEnter: ifAuthenticated,
        },
        {
          path: "edit/:id",
          name: "Edit Snippet",
          components: {
            default: EditSnippet,
          },
          props: {
            default: true,
            sidebar: true,
          },
          beforeEnter: ifAuthenticated,
        },
      ],
    },
    {
      path: "/playbook",
      redirect: "/playbook/nav/playbooks",
      component: DefaultContainer,
      children: [
        {
          path: "nav",
          redirect: "/playbook/nav/playbooks",
          name: "Playbooks",
          component: PlaybookNav,
          beforeEnter: ifAuthenticated,
          children: [
            {
              path: "playbooks",
              name: "Playbooks List",
              component: PlaybookListPage,
              beforeEnter: ifAuthenticated,
            },
            {
              path: "exploreplaybooks",
              name: "Playbooks Explore",
              component: ExplorePlaybookListPage,
              beforeEnter: ifAuthenticated,
            },
          ],
        },
        {
          path: "detail/:id",
          name: "Playbook Detail",
          components: {
            default: PlaybookDetailsPage,
          },
          props: {
            default: true,
          },
        },
        {
          path: "edit/:id",
          name: "Playbook Edit",
          components: {
            default: PlaybookEditPage,
          },
          props: {
            default: true,
          },
        },
        {
          path: "exploreplaybooks",
          name: "Explore Playbooks",
          components: {
            default: ExplorePlaybookListPage,
          },
          props: {
            default: true,
          },
        },
      ],
    },
    {
      path: "/pages",
      redirect: "/pages/p404",
      name: "Pages",
      component: {
        render(c) {
          return c("router-view");
        },
      },
      children: [
        {
          path: "404",
          name: "Page404",
          component: Page404,
        },
        {
          path: "500",
          name: "Page500",
          component: Page500,
        },
        {
          path: "register",
          name: "Register",
          component: Register,
        },
      ],
    },
    {
      path: "/adCredentials",
      name: "AD Credentials",
      redirect: "/adCredentials/create",
      component: DefaultContainer,
      children: [
        {
          path: "create",
          name: "LDAP Credentials Create",
          component: LdapCreate,
        },
      ],
    },
    {
      path: "/ldap",
      redirect: "/ldap/groups/list/group",
      name: "Ldap",
      component: DefaultContainer,
      children: [
        {
          path: "groups",
          redirect: "ldap/list/group",
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "list",
              redirect: "ldap/group/list",
              component: LdapGroupNav,
              children: [
                {
                  path: "group",
                  name: "Groups List",
                  component: LdapGroupPage,
                },
              ],
            },
            {
              path: "create",
              redirect: "ldap/groups/create/group",
              component: {
                render(c) {
                  return c("router-view");
                },
              },
              children: [
                {
                  path: "group",
                  name: "Create Ldap Group",
                  component: LdapGroupCreatePage,
                },
              ],
            },
          ],
        },
        {
          path: "servers/:id",
          redirect: "ldap/servers/list/server",
          props: true,
          component: {
            render(c) {
              return c("router-view");
            },
          },
          children: [
            {
              path: "list",
              redirect: "ldap/servers/list/server",
              component: LdapServerNav,
              props: true,
              children: [
                {
                  path: "server",
                  name: "Server List",
                  component: LdapServerPage,
                  props: true,
                },
                {
                  path: "user",
                  name: "User List",
                  component: LdapUserPage,
                  props: true,
                },
                {
                  path: "log/:ip",
                  name: "Log List",
                  component: LdapLogPage,
                  props: true,
                },
                {
                  path: "role",
                  name: "Role List",
                  component: LdapRolePage,
                  props: true,
                },
              ],
            },
            {
              path: "create",
              component: {
                render(c) {
                  return c("router-view");
                },
              },
              props: true,
              children: [
                {
                  path: "server",
                  name: "Create Server",
                  component: LdapServerCreatePage,
                  props: true,
                },
                {
                  path: "user",
                  name: "Create User",
                  component: LdapUserCreatePage,
                  props: true,
                },
                {
                  path: "role",
                  name: "Create Role",
                  component: LdapRoleCreatePage,
                  props: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "/qrregistry/:tokenUsername",
      name: "qrregistry",
      component: QRRegistry,
    },
    {
      path: "/qrmatch/:qrcode",
      name: "qrmatch",
      component: QRMatch,
    },
    {
      path: "*",
      component: Page404,
    },
  ],
});
