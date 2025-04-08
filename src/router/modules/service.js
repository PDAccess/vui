const DefaultContainer = () => import("@/containers/DefaultContainer");
const ServiceSidebar = () => import("@/containers/ServiceSidebar");

const ServicePolicyPage = () =>
  import("@/views/h2h/pages/service/ServicePolicyPage");
const InventoryPage = () => import("@/views/h2h/pages/service/InventoryPage");
const YourInventoryPage = () => import("@/views/h2h/pages/service/YourInventoryPage");
const CreateServicePage = () =>
  import("@/views/h2h/pages/service/CreateServicePage");
const ServiceDetail = () =>
  import("@/views/h2h/pages/service/ServiceDetailPage");
const ServiceNav = () => import("@/views/h2h/pages/service/ServiceNav");
const ServiceDelete = () => import("@/views/h2h/pages/service/ServiceDelete");
const ServiceUser = () => import("@/views/h2h/pages/service/ServiceUser");
const MarkedInventory = () =>
  import("@/views/h2h/pages/service/MarkedInventory");
const AgentInventory = () => import("@/views/h2h/pages/service/AgentInventory");
const AgentActiveInventory = () =>
  import("@/views/h2h/pages/service/AgentActiveInventory");
const AgentInactiveInventory = () =>
  import("@/views/h2h/pages/service/AgentInactiveInventory");
//const ServiceCredentialManagement = () => import('@/views/h2h/pages/service/ServiceCredentialManagement');
const ServiceAccountsPage = () =>
  import("@/views/h2h/pages/service/ServiceAccountsPage");
const ServiceAccountNewCredentialPage = () =>
  import("@/views/h2h/pages/service/ServiceAccountNewCredentialPage");
const ServiceAccountCreatePage = () =>
  import("@/views/h2h/pages/service/ServiceAccountCreatePage");
const ServiceAccountEditPage = () =>
  import("@/views/h2h/pages/service/ServiceAccountEditPage");
const BreakTheGlass = () => import("@/views/h2h/pages/service/BreakTheGlass");
const ServiceHost = () => import("@/views/h2h/pages/service/ServiceHost");
const Maintenance = () => import("@/views/h2h/pages/service/Maintenance");
const ServiceActivityPage = () =>
  import("@/views/h2h/pages/service/ServiceActivityPage");
const ServiceProxyActivityPage = () =>
  import("@/views/h2h/pages/service/ServiceProxyActivities");
const ServiceAgentActivityNav = () =>
  import("@/views/h2h/pages/service/ServiceAgentActivityNav");
const ServiceAgentCommandActivityPage = () =>
  import("@/views/h2h/pages/service/ServiceAgentCommandActivityPage");
const ServiceAgentFileActivityPage = () =>
  import("@/views/h2h/pages/service/ServiceAgentFileActivityPage");
const ServiceAgentAuthenticationActivityPage = () =>
  import("@/views/h2h/pages/service/ServiceAgentAuthenticationActivityPage");
const ServiceAgentStatusActivityPage = () =>
  import("@/views/h2h/pages/service/ServiceAgentStatusActivityPage");
const ServiceTacacsActivities = () =>
  import("@/views/h2h/pages/service/ServiceTacacsActivityPage");
const ServiceVaultActivityPage = () =>
  import("@/views/h2h/pages/service/ServiceVaultActivities");
const ServiceAuthActivityPage = () =>
  import("@/views/h2h/pages/service/ServiceAuthActivityPage");
const ServicePolicyCreatePage = () =>
  import("@/views/h2h/pages/service/ServicePolicyCreatePage");
const ServicePolicyEditPage = () =>
  import("@/views/h2h/pages/service/ServicePolicyEditPage");
const ServiceAlarmsPage = () =>
  import("@/views/h2h/pages/service/ServiceAlarmsPage");
const CreateServiceAlarmPage = () =>
  import("@/views/h2h/pages/service/CreateServiceAlarmPage");
const EditServiceAlarmPage = () =>
  import("@/views/h2h/pages/service/EditServiceAlarmPage");
const ServiceEditPage = () =>
  import("@/views/h2h/pages/service/ServiceEditPage");
const ServiceSettingsPage = () =>
  import("@/views/h2h/pages/service/ServiceSettingsPage");
const ServiceAgentPolicyPage = () =>
  import("@/views/h2h/pages/service/ServiceAgentPolicy");
const ServiceAgentFilePolicyCreatePage = () =>
  import("@/views/h2h/pages/service/ServiceAgentFilePolicyCreate");
const ServiceAgentCommandPolicyCreatePage = () =>
  import("@/views/h2h/pages/service/ServiceAgentCommandPolicyCreate");
const ServiceAgentFilePolicyEditPage = () =>
  import("@/views/h2h/pages/service/ServiceAgentFilePolicyEdit");
const ServiceAgentCommandPolicyEditPage = () =>
  import("@/views/h2h/pages/service/ServiceAgentCommandPolicyEdit");
const ServiceAppCreatePage = () =>
  import("@/views/h2h/pages/service/ServiceAppCreatePage");
const ServiceScreen = () => import("@/views/h2h/pages/service/ServiceScreen");
const ServiceAgentSessionActivityDetailPage = () =>
  import("@/views/h2h/pages/service/ServiceAgentSessionActivityDetailPage");
const ServiceAgentSessionActivityPage = () =>
  import("@/views/h2h/pages/service/ServiceAgentSessionActivityPage");
const ServiceAgentShellSessionActivityDetailPage = () =>
  import("@/views/h2h/pages/service/ServiceAgentShellSessionActivityDetailPage");
const ServiceAgentShellSessionActivityDetailXtermPage = () =>
  import("@/views/h2h/pages/service/ServiceAgentShellSessionActivityDetailXtermPage");
const ServiceAgentShellSessionActivityPage = () =>
  import("@/views/h2h/pages/service/ServiceAgentShellSessionActivityPage");
const ServiceAgentShellSessionActivityDetailNav = () =>
  import("@/views/h2h/pages/service/ServiceAgentShellSessionActivityDetailNav");
const ServiceTacacsNav = () =>
  import("@/views/h2h/pages/service/ServiceTacacsNav");
const ServiceTacacsAuthenticationPage = () =>
  import("@/views/h2h/pages/service/ServiceTacacsAuthenticationPage");
const ServiceTacacsAuthorizationPage = () =>
  import("@/views/h2h/pages/service/ServiceTacacsAuthorizationPage");
const ServiceTacacsAccountingPage = () =>
  import("@/views/h2h/pages/service/ServiceTacacsAccountingPage");

import ifAuthenticated from "./auth";

export default [
  {
    path: "/service",
    redirect: "/service/nav/list",
    component: DefaultContainer,
    children: [
      {
        path: "nav",
        name: "Services",
        redirect: "/service/nav/list",
        component: ServiceNav,
        beforeEnter: ifAuthenticated,
        children: [
          {
            path: "list",
            name: "All Services",
            component: InventoryPage,
            beforeEnter: ifAuthenticated,
          },
          {
            path: "yours",
            name: "Your Services",
            component: InventoryPage,
            beforeEnter: ifAuthenticated,
          },
          {
            path: "agent",
            redirect: "/service/nav/agent/active",
            name: "Your Agent Services",
            component: AgentInventory,
            beforeEnter: ifAuthenticated,
            children: [
              {
                path: "active",
                name: "Your Active Agent Services",
                component: InventoryPage,
                beforeEnter: ifAuthenticated,
              },
              {
                path: "inactive",
                name: "Your Inactive Agent Services",
                component: InventoryPage,
                beforeEnter: ifAuthenticated,
              },
            ],
          },
          {
            path: "marked",
            name: "Marked Services",
            component: InventoryPage,
            beforeEnter: ifAuthenticated,
          },
        ],
      },
      {
        path: "createservice",
        name: "Create Service",
        component: CreateServicePage,
        beforeEnter: ifAuthenticated,
      },
      {
        path: "detail/:id",
        name: "Service Detail",
        components: {
          default: ServiceDetail,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "serviceactivity/:id",
        name: "Service Activity",
        components: {
          default: ServiceActivityPage,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "proxyActivities/:id",
        name: "Service Proxy Activity",
        components: {
          default: ServiceProxyActivityPage,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      // {
      //   path: "agentActivities/:id",
      //   name: "Service Agent Activity",
      //   components: {
      //     default: ServiceAgentActivityPage,
      //     sidebar: ServiceSidebar,
      //   },
      //   props: {
      //     default: true,
      //     sidebar: true,
      //   },
      //   beforeEnter: ifAuthenticated,
      // },
      {
        path: "vaultActivities/:id",
        name: "Service Vault Activity",
        components: {
          default: ServiceVaultActivityPage,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "authentications/:id",
        name: "Service Authentication Activity",
        components: {
          default: ServiceAuthActivityPage,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "accounts",
        components: {
          default: {
            render(c) {
              return c("router-view");
            }
          },
          sidebar: ServiceSidebar
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
        children: [
          {
            path: ":id",
            name: "Local Accounts",
            components: {
              default: ServiceAccountsPage,
            },
            props: {
              default: true,
              sidebar: true,
            },
          },
          {
            path: "new-credential/:id",
            name: "New Credential For Local Accounts",
            components: {
              default: ServiceAccountNewCredentialPage,
            },
            props: {
              default: true,
              sidebar: true,
            },
          }
        ]
      },
      {
        path: "create-account/:id",
        name: "Create Local Account",
        meta: {
          label: "Create Service Local Account",
        },
        components: {
          default: ServiceAccountCreatePage,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "account/:id/:accountId",
        name: "Edit Local Account",
        meta: {
          label: "Edit Service Local Account",
        },
        components: {
          default: ServiceAccountEditPage,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "servicepolicy/:id",
        name: "Service Policy",
        components: {
          default: ServicePolicyPage,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "servicedelete/:id",
        name: "Service Delete",
        components: {
          default: ServiceDelete,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "serviceuser/:id",
        name: "Service Users",
        meta: {
          label: "Service Members",
        },
        components: {
          default: ServiceUser,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "host/:id",
        name: "Service Host",
        components: {
          default: ServiceHost,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "breaktheglass/:id",
        name: "Break The Glass",
        components: {
          default: BreakTheGlass,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "maintenance/:id",
        name: "Service Maintenance",
        meta: {
          label: "Service Maintenance",
        },
        components: {
          default: Maintenance,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "createpolicy/:id/:behavior",
        name: "Create Service Policy",
        components: {
          default: ServicePolicyCreatePage,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: ":serviceid/editpolicy/:policyid",
        name: "Edit Service Policy",
        components: {
          default: ServicePolicyEditPage,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "alarms/:id",
        name: "Service Alarms",
        components: {
          default: ServiceAlarmsPage,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "createalarm/:id",
        name: "Create Service Alarm",
        components: {
          default: CreateServiceAlarmPage,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: ":id/editalarm/:alarmid",
        name: "Edit Service Alarm",
        components: {
          default: EditServiceAlarmPage,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "edit/:id",
        name: "Edit Service",
        components: {
          default: ServiceEditPage,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "settings/:id",
        name: "Service Settings",
        components: {
          default: ServiceSettingsPage,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "agentpolicy/:id",
        name: "Service Agent Policy",
        components: {
          default: ServiceAgentPolicyPage,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: ":id/command-agentpolicy/:policyid",
        name: "Edit Service Agent Command Policy",
        components: {
          default: ServiceAgentCommandPolicyEditPage,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: ":id/file-agentpolicy/:policyid",
        name: "Edit Service Agent File Policy",
        components: {
          default: ServiceAgentFilePolicyEditPage,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "create-file-agentpolicy/:id",
        name: "Create Service Agent File Policy",
        components: {
          default: ServiceAgentFilePolicyCreatePage,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "create-command-agentpolicy/:id",
        name: "Create Service Agent Command Policy",
        components: {
          default: ServiceAgentCommandPolicyCreatePage,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "create-application/:id",
        name: "Create RDP Service Application",
        components: {
          default: ServiceAppCreatePage,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "agentActivities",
        name: "Service Agent Activity Nav",
        components: {
          default: ServiceAgentActivityNav,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
        children: [
          {
            path: "session/:id/:sessionId",
            name: "Agent Sessions",
            components: {
              default: ServiceAgentSessionActivityDetailPage,
              sidebar: ServiceSidebar,
            },
            props: {
              default: true,
              sidebar: true,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "sessions/:id",
            name: "Agent Sessions Activities",
            components: {
              default: ServiceAgentSessionActivityPage,
              sidebar: ServiceSidebar,
            },
            props: {
              default: true,
              sidebar: true,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "command/:id",
            name: "Command Logs",
            components: {
              default: ServiceAgentCommandActivityPage,
              sidebar: ServiceSidebar,
            },
            props: {
              default: true,
              sidebar: true,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "authentication/:id",
            name: "Authentication Logs",
            components: {
              default: ServiceAgentAuthenticationActivityPage,
              sidebar: ServiceSidebar,
            },
            props: {
              default: true,
              sidebar: true,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "file/:id",
            name: "File Logs",
            components: {
              default: ServiceAgentFileActivityPage,
              sidebar: ServiceSidebar,
            },
            props: {
              default: true,
              sidebar: true,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "status/:id",
            name: "Agent Status",
            components: {
              default: ServiceAgentStatusActivityPage,
              sidebar: ServiceSidebar,
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
        path: "tacacs",
        name: "Service Tacacs Activity",
        components: {
          default: ServiceTacacsNav,
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
        children: [
          {
            path: "authentication/:id",
            name: "Tacacs Authentication Logs",
            components: {
              default: ServiceTacacsAuthenticationPage,
              sidebar: ServiceSidebar,
            },
            props: {
              default: true,
              sidebar: true,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "authorization/:id",
            name: "Tacacs Authorization Logs",
            components: {
              default: ServiceTacacsAuthorizationPage,
              sidebar: ServiceSidebar,
            },
            props: {
              default: true,
              sidebar: true,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "accounting/:id",
            name: "Tacacs Accounting Logs",
            components: {
              default: ServiceTacacsAccountingPage,
              sidebar: ServiceSidebar,
            },
            props: {
              default: true,
              sidebar: true,
            },
            beforeEnter: ifAuthenticated,
          },
        ]
      },
      {
        path: "agentShellActivities",
        name: "Service Agent Activity",
        components: {
          default: {
            render (c) { return c('router-view') }
          },
          sidebar: ServiceSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
        children: [
          {
            path: "session",
            components: {
              default: ServiceAgentShellSessionActivityDetailNav,
              sidebar: ServiceSidebar,
            },
            props: {
              default: true,
              sidebar: true,
            },
            beforeEnter: ifAuthenticated,
            children: [
              {
                path: ":id/:sessionId",
                name: "Service Agent Shell Sessions Activities",
                components: {
                  default: ServiceAgentShellSessionActivityDetailPage,
                  sidebar: ServiceSidebar,
                },
                props: {
                  default: true,
                  sidebar: true,
                },
                beforeEnter: ifAuthenticated,
              },
              {
                path: "xterm/:id/:sessionId",
                name: "Sessions Details With Xterm",
                components: {
                  default: ServiceAgentShellSessionActivityDetailXtermPage,
                  sidebar: ServiceSidebar,
                },
                props: {
                  default: true,
                  sidebar: true,
                },
                beforeEnter: ifAuthenticated,
              },
            ]
          },
          {
            path: "sessions/:id",
            name: "Service Agent Shell Sessions Activity",
            components: {
              default: ServiceAgentShellSessionActivityPage,
              sidebar: ServiceSidebar,
            },
            props: {
              default: true,
              sidebar: true,
            },
            beforeEnter: ifAuthenticated,
          },
        ],
      },
    ],
  },
  //   {
  //     path: "services/:id",
  //     name: "Service Detail",
  //     components: {
  //       default: ServiceDetail,
  //       sidebar: ServiceSidebar,
  //     },
  //     props: {
  //       default: true,
  //       sidebar: true,
  //     },
  //     beforeEnter: ifAuthenticated,
  //   },
  // {
  //   path: "serviceactivity/:id",
  //   name: "Service Activity",
  //   components: {
  //     default: ServiceActivityPage,
  //     sidebar: ServiceSidebar,
  //   },
  //   props: {
  //     default: true,
  //     sidebar: true,
  //   },
  //   beforeEnter: ifAuthenticated,
  // },
  // {
  //   path: "proxyActivities/:id",
  //   name: "Service Proxy Activity",
  //   components: {
  //     default: ServiceProxyActivityPage,
  //     sidebar: ServiceSidebar,
  //   },
  //   props: {
  //     default: true,
  //     sidebar: true,
  //   },
  //   beforeEnter: ifAuthenticated,
  // },

  // {
  //   path: "vaultActivities/:id",
  //   name: "Service Vault Activity",
  //   components: {
  //     default: ServiceVaultActivityPage,
  //     sidebar: ServiceSidebar,
  //   },
  //   props: {
  //     default: true,
  //     sidebar: true,
  //   },
  //   beforeEnter: ifAuthenticated,
  // },
  // {
  //   path: "accounts/:id",
  //   name: "Local Accounts",
  //   meta: {
  //     label: "Service Local Accounts",
  //   },
  // },
  {
    path: "/connectservice",
    name: "Connect Service",
    component: ServiceScreen,
  },
];
