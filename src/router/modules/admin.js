const DefaultContainer = () => import("@/containers/DefaultContainer");
const AdminSidebar = () => import("@/containers/AdminSidebar");

//pages - policy
const AdminPolicyPage = () =>
  import("@/views/h2h/pages/policy/AdminPolicyPage");

//pages -setting
const SystemSettings = () =>
  import("@/views/h2h/pages/setting/SystemSettingsPage");
//const DatabaseBackups = () => import('@/views/h2h/pages/setting/DatabaseBackups')
const MessageSettings = () => import("@/views/h2h/pages/setting/MessagePage");
const LookFeelSettings = () =>
  import("@/views/h2h/pages/setting/lookfeel/LookFeelPage");
const AuthSettings = () =>
  import("@/views/h2h/pages/setting/auth/AuthSettingsPage");
const AdminAuthLogs = () => import("@/views/h2h/pages/setting/auth/AuthLogs");
const LDAPSettings = () =>
  import("@/views/h2h/pages/setting/ldap/LDAPSettingsPage");
const LDAPConfig = () =>
  import("@/views/h2h/pages/setting/ldap/LDAPConfigurationPage");
const radiusProxy = () => import("@/views/h2h/pages/setting/RadiusProxy");
const sshProxy = () => import("@/views/h2h/pages/setting/SshProxy");
const tacacsProxy = () => import("@/views/h2h/pages/setting/TacacsProxy");
const Monitoring = () => import("@/views/h2h/pages/setting/Monitoring");
const VaultInfo = () => import("@/views/h2h/pages/setting/VaultInfo");
const AppSecret = () => import("@/views/h2h/pages/setting/AppSecret");

//OAUTH2
const AdminOauth2 = () => import("@/views/h2h/pages/oauth2/Oauth2");
const AdminCreateOauth2 = () => import("@/views/h2h/pages/oauth2/CreateOauth2");
const AdminOauth2Nav = () => import("@/views/h2h/pages/oauth2/AdminOauth2Nav");
const AdminOauth2Application = () =>
  import("@/views/h2h/pages/oauth2/ResultOauth2");
const AdminEditOauth2 = () => import("@/views/h2h/pages/oauth2/EditOauth2");

// pages - monitoring
const MonitoringPage = () =>
  import("@/views/h2h/pages/monitoring/MonitoringPage");
const MonitoringDetailPage = () =>
  import("@/views/h2h/pages/monitoring/MonitoringDetailPage");
const MonitoringChartPage = () =>
  import("@/views/h2h/pages/monitoring/MonitoringChartPage");

// pages - logs
const LogPage = () => import("@/views/h2h/pages/logs/LogPage");
const LogDetailPage = () => import("@/views/h2h/pages/logs/LogDetailPage");

const AdminAgentPolicyPage = () =>
  import("@/views/h2h/pages/setting/AdminAgentPolicyActivities");
const AdminSudoPolicyPage = () =>
  import("@/views/h2h/pages/setting/AdminSudoPolicyActivities");
const AdminSessionPolicyPage = () =>
  import("@/views/h2h/pages/setting/AdminSessionPolicyActivities");
const AdminAlarmPage = () => import("@/views/h2h/pages/setting/AdminAlarmPage");
const AdminMaintenancePage = () =>
  import("@/views/h2h/pages/setting/AdminMaintenance");
const AdminPermissionPage = () =>
  import("@/views/h2h/pages/setting/AdminPermission");

//pages - realm
const Realms = () => import("@/views/h2h/pages/realms/Realms");
const CreateRealmPage = () =>
  import("@/views/h2h/pages/realms/CreateRealmPage");
const RealmEditPage = () => import("@/views/h2h/pages/realms/RealmEditPage");
const AdminRealmNav = () => import("@/views/h2h/pages/realms/AdminRealmNav");

const UserNav = () => import("@/views/h2h/pages/setting/user/UserNav");

const BlockedUsersPage = () =>
  import("@/views/h2h/pages/user/BlockedUsersPage");
const DeletedUsersPage = () =>
  import("@/views/h2h/pages/user/DeletedUsersPage");
const ForgetPasswordUsersPage = () =>
  import("@/views/h2h/pages/user/ForgetPasswordUsersPage");
const UserListPage = () => import("@/views/h2h/pages/user/UserListPage");
const UserEditPage = () => import("@/views/h2h/pages/user/UserEditPage");
const UserCreatePage = () => import("@/views/h2h/pages/user/UserCreatePage");

//pages - ldap

const LdapHome = () => import("@/views/h2h/pages/ldap/LdapHome");
const ImportCreatePage = () =>
  import("@/views/h2h/pages/ldap/ImportCreatePage");
// vaultmenu - Jobs
const JobsNav = () => import("@/views/h2h/pages/vault/jobs/JobsNav");
const JobDetail = () => import("@/views/h2h/pages/vault/jobs/JobDetailPage");
const AllJobsPage = () => import("@/views/h2h/pages/vault/jobs/AllJobsPage");
const RunningJobsPage = () =>
  import("@/views/h2h/pages/vault/jobs/RunningJobsPage");
const PassedJobsPage = () =>
  import("@/views/h2h/pages/vault/jobs/PassedJobsPage");
const FailedJobsPage = () =>
  import("@/views/h2h/pages/vault/jobs/FailedJobsPage");
const FinishedJobsPage = () =>
  import("@/views/h2h/pages/vault/jobs/FinishedJobsPage");
const JobRunPage = () => import("@/views/h2h/pages/vault/jobs/JobRunPage");

import ifAuthenticated from "./auth";

export default [
  {
    path: "/admin",
    redirect: "/admin/statistics",
    name: "Administration",
    components: {
      default: DefaultContainer,
      sidebar: AdminSidebar,
    },
    children: [
      {
        path: "statistics",
        name: "Statistics",
        components: {
          default: Monitoring,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "monitoring",
        components: {
          default: MonitoringPage,
          sidebar: AdminSidebar,
        },
        name: "Monitoring",
        beforeEnter: ifAuthenticated,
      },
      {
        path: "logs",
        components: {
          default: LogPage,
          sidebar: AdminSidebar,
        },
        name: "Logs",
        beforeEnter: ifAuthenticated,
      },
      {
        path: "logs/detail/:tag/:file/:time",
        components: {
          default: LogDetailPage,
          sidebar: AdminSidebar,
        },
        name: "Log Details",
        beforeEnter: ifAuthenticated,
        props: {
          default: true,
          sidebar: true,
        },
      },
      {
        path: "monitoring/monitoringdetail",
        components: {
          default: MonitoringDetailPage,
          sidebar: AdminSidebar,
        },
        name: "Monitoring Detail",
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "monitoring/show/:type/:instance/:metric",
        components: {
          default: MonitoringChartPage,
          sidebar: AdminSidebar,
        },
        name: "Monitoring Show",
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "agentpolicy",
        name: "Agent Policy",
        components: {
          default: AdminAgentPolicyPage,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "sudopolicy",
        name: "Sudo Policy",
        components: {
          default: AdminSudoPolicyPage,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "sessionpolicy",
        name: "Session Policy",
        components: {
          default: AdminSessionPolicyPage,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "alarm",
        name: "Alarm",
        components: {
          default: AdminAlarmPage,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "maintenance",
        name: "Admin Maintenance",
        components: {
          default: AdminMaintenancePage,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "permission",
        name: "Permission",
        components: {
          default: AdminPermissionPage,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "oauth2",
        redirect: "oauth2/list",
        name: "Oauth2",
        components: {
          default: AdminOauth2Nav,
          sidebar: AdminSidebar,
        },
        children: [
          {
            path: "list",
            name: "Applications",
            components: {
              default: AdminOauth2,
              sidebar: AdminSidebar,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "edit/:id",
            name: "Application Edit Oauth2",
            components: {
              default: AdminEditOauth2,
              sidebar: AdminSidebar,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "create",
            name: "Create Oauth2",
            components: {
              default: AdminCreateOauth2,
              sidebar: AdminSidebar,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "application/:id",
            name: "Application Oauth2",
            components: {
              default: AdminOauth2Application,
              sidebar: AdminSidebar,
            },
            props: { default: true },
            beforeEnter: ifAuthenticated,
          },
        ],
      },
      {
        path: "policy",
        name: "Administration Policy",
        components: {
          default: AdminPolicyPage,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "auth",
        name: "Authentication",
        components: {
          default: AuthSettings,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },

      {
        path: "authlog",
        name: "Authentication Log",
        components: {
          default: AdminAuthLogs,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },

      {
        path: "ldap",
        name: "LDAP Authentication Settings",
        components: {
          default: LDAPSettings,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "ldapconfig",
        name: "LDAP Proxy Configuration",
        components: {
          default: LDAPConfig,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "radiusproxy",
        name: "Radius Proxy",
        components: {
          default: radiusProxy,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "sshproxy",
        name: "Ssh Proxy",
        components: {
          default: sshProxy,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "tacacsproxy",
        name: "Tacacs Proxy",
        components: {
          default: tacacsProxy,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "lookfeel",
        name: "Look & Feel",
        components: {
          default: LookFeelSettings,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "messages",
        name: "Messages",
        components: {
          default: MessageSettings,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "system_settings",
        name: "System Settings",
        components: {
          default: SystemSettings,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "realms",
        redirect: "realms/list",
        name: "Realm manage",
        components: {
          default: AdminRealmNav,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
        children: [
          {
            path: "list",
            name: "Realm list",
            components: {
              default: Realms,
              sidebar: AdminSidebar,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "create-realm",
            name: "Create Realm",
            components: {
              default: CreateRealmPage,
              sidebar: AdminSidebar,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "edit/:id",
            name: "Edit Realm",
            components: {
              default: RealmEditPage,
              sidebar: AdminSidebar,
            },
            props: { default: true },
            beforeEnter: ifAuthenticated,
          },
        ],
      },
      {
        path: "users",
        redirect: "users/list",
        name: "User manage",
        components: {
          default: UserNav,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
        children: [
          {
            path: "blockedusers",
            name: "Blocked Users List",
            components: {
              default: BlockedUsersPage,
              sidebar: AdminSidebar,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "deletedusers",
            name: "Deleted Users List",
            components: {
              default: DeletedUsersPage,
              sidebar: AdminSidebar,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "forgetpassword",
            name: "Forgot Users List",
            components: {
              default: ForgetPasswordUsersPage,
              sidebar: AdminSidebar,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "list",
            name: "User list",
            meta: {
              label: "Users",
            },
            components: {
              default: UserListPage,
              sidebar: AdminSidebar,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "createuser",
            name: "Create user",
            components: {
              default: UserCreatePage,
              sidebar: AdminSidebar,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "edit/:id",
            name: "User Edit",
            components: {
              default: UserEditPage,
              sidebar: AdminSidebar,
            },
            props: { default: true },
            beforeEnter: ifAuthenticated,
          },
        ],
      },
      {
        path: "vault",
        name: "Vault Info",
        meta: {
          label: "Vault Settings",
        },
        components: {
          default: VaultInfo,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "secrets",
        name: "App Secrets",
        meta: {
          label: "Secret Settings",
        },
        components: {
          default: AppSecret,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "imports",
        name: "Imports",
        components: {
          default: LdapHome,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "imports/createImport",
        name: "Create Import",
        components: {
          default: ImportCreatePage,
          sidebar: AdminSidebar,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "jobs",
        redirect: "jobs/allJobs",
        name: "Job List",
        meta: {
          label: "Jobs",
        },
        components: {
          default: JobsNav,
          sidebar: AdminSidebar,
        },
        children: [
          {
            path: "allJobs",
            name: "All Jobs",
            meta: {
              label: "All Jobs List",
            },
            components: {
              sidebar: AdminSidebar,
              default: AllJobsPage,
            },
          },
          {
            path: "runningJobs",
            name: "Running Jobs",
            meta: {
              label: "Running Jobs List",
            },
            components: {
              sidebar: AdminSidebar,
              default: RunningJobsPage,
            },
          },
          {
            path: "passedJobs",
            name: "Passed Jobs",
            meta: {
              label: "Passed Jobs List",
            },
            components: {
              sidebar: AdminSidebar,
              default: PassedJobsPage,
            },
          },
          {
            path: "failedJobs",
            name: "Failed Jobs",
            meta: {
              label: "Failed Jobs List",
            },
            components: {
              sidebar: AdminSidebar,
              default: FailedJobsPage,
            },
          },
          {
            path: "finishedJobs",
            name: "Finished Jobs",
            meta: {
              label: "Finished Jobs List",
            },
            components: {
              sidebar: AdminSidebar,
              default: FinishedJobsPage,
            },
          },
          {
            path: "jobDetail",
            name: "Job Detail",
            meta: {
              label: "Job Detail",
            },
            components: {
              sidebar: AdminSidebar,
              default: JobDetail,
            },
            props: true,
          },
          {
            path: "jobRun",
            name: "Job Run",
            meta: {
              label: "Job Run",
            },
            components: {
              sidebar: AdminSidebar,
              default: JobRunPage,
            },
          },
        ],
        beforeEnter: ifAuthenticated,
      },
      /*{
           path: 'database_backups',
           name: 'Database Backups',
           components: {
             default: DatabaseBackups,
             sidebar: AdminSidebar,
           },
           beforeEnter: ifAuthenticated
         }, */
    ],
  },
];
