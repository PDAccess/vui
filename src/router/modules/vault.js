const DefaultContainer = () => import("@/containers/DefaultContainer");
// pages - Credentials
// Vault
const VaultSidebar = () => import("@/containers/VaultSidebar");

const ManagedCredentials = () =>
  import("@/views/h2h/pages/vault/credentials/ManagedCredentials");
const ManagedYourCredentials = () =>
  import("@/views/h2h/pages/vault/credentials/ManagedYourCredentials");

const ManagedCredentialsNav = () =>
  import("@/views/h2h/pages/vault/credentials/ManagedCredentialsNav");
const ManagedCredentialsCreate = () =>
  import("@/views/h2h/pages/vault/credentials/ManagedCredentialsCreate");
const ManagedCredentialDetails = () =>
  import("@/views/h2h/pages/vault/credentials/ManagedCredentialsDetails");
const MaintenanceDetails = () =>
  import("@/views/h2h/pages/vault/credentials/MaintenanceDetail");
const ManagedCredentialLastUsages = () =>
  import("@/views/h2h/pages/vault/credentials/ManagedCredentialLastUsages");
const ManagedCredentialChangeHistory = () =>
  import("@/views/h2h/pages/vault/credentials/ManagedCredentialChangeHistory");
const ManagedCredentialUsersPermissions = () =>
  import(
    "@/views/h2h/pages/vault/credentials/ManagedCredentialUsersPermissions"
  );
const ManagedCredentialShareLinks = () =>
  import("@/views/h2h/pages/vault/credentials/ManagedCredentialShareLinks");
const ManagedCredentialOptions = () =>
  import("@/views/h2h/pages/vault/credentials/ManagedCredentialOptions");
const ManagedCredentialRequestsNav = () =>
  import("@/views/h2h/pages/vault/credentials/ManagedCredentialRequestsNav");
const ManagedCredentialRequestsWait = () =>
  import("@/views/h2h/pages/vault/credentials/ManagedCredentialRequestsWait");
const ManagedCredentialRequestsApproved = () =>
  import(
    "@/views/h2h/pages/vault/credentials/ManagedCredentialRequestsApproved"
  );
const ManagedCredentialRequestsNotApproved = () =>
  import(
    "@/views/h2h/pages/vault/credentials/ManagedCredentialRequestsNotApproved"
  );
const CredentialCreatePage = () =>
  import("@/views/h2h/pages/group/credential/CredentialCreatePage");

import ifAuthenticated from "./auth";

export default [
  {
    path: "/vault",
    redirect: "/vault/nav/list",
    components: {
      default: DefaultContainer,
      sidebar: VaultSidebar,
    },
    props: {
      default: true,
      sidebar: true,
    },
    children: [
      {
        path: "nav",
        name: "Credentials",
        redirect: "/vault/nav/list",
        components: {
          default: ManagedCredentialsNav,
        },
        beforeEnter: ifAuthenticated,
        children: [
          {
            path: "list",
            components: {
              default: ManagedCredentials,
              sidebar: VaultSidebar,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "yours",
            components: {
              default: ManagedYourCredentials,
              sidebar: VaultSidebar,
            },
            beforeEnter: ifAuthenticated,
          },
          // {
          //   path: "createcredential",
          //   name: "Credential Create",
          //   components: {
          //     default: ManagedCredentialsCreate,
          //     sidebar: VaultSidebar,
          //   },
          //   beforeEnter: ifAuthenticated,
          // },
          // {
          //   path: "maintenance",
          //   name: "Maintenance Detail",
          //   components: {
          //     default: MaintenanceDetails,
          //     sidebar: VaultSidebar,
          //   },
          //   beforeEnter: ifAuthenticated,
          // },
        ],
      },
      {
        path: "credential/:id",
        name: "Credential Detail 2",
        components: {
          default: ManagedCredentialDetails,
          sidebar: VaultSidebar,
        },
        props: {
          default: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "createcredential",
        name: "Credential Create",
        components: {
          default: CredentialCreatePage,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "credentials",
        components: {
          default: {
            render(c) {
              return c("router-view");
            },
          },
          sidebar: VaultSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
        children: [
          {
            path: "detail/:id",
            name: "Credential Detail",
            components: {
              default: ManagedCredentialDetails,
              sidebar: VaultSidebar,
            },
            props: {
              default: true,
              sidebar: true,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "usages/:id",
            name: "Credential Last Usages",
            components: {
              default: ManagedCredentialLastUsages,
              sidebar: VaultSidebar,
            },
            props: {
              default: true,
              sidebar: true,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "history/:id",
            name: "Credential Change History",
            components: {
              default: ManagedCredentialChangeHistory,
              sidebar: VaultSidebar,
            },
            props: {
              default: true,
              sidebar: true,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "permissions/:id",
            name: "Credential Users Permissions",
            components: {
              default: ManagedCredentialUsersPermissions,
              sidebar: VaultSidebar,
            },
            props: {
              default: true,
              sidebar: true,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "share/:id",
            name: "Credential Share Links",
            components: {
              default: ManagedCredentialShareLinks,
              sidebar: VaultSidebar,
            },
            props: {
              default: true,
              sidebar: true,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "options/:id",
            name: "Credential Options",
            components: {
              default: ManagedCredentialOptions,
              sidebar: VaultSidebar,
            },
            props: {
              default: true,
              sidebar: true,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "requests/:id",
            redirect: "requests/:id/wait",
            components: {
              default: ManagedCredentialRequestsNav,
              sidebar: VaultSidebar,
            },
            props: {
              default: true,
              sidebar: true,
            },
            beforeEnter: ifAuthenticated,
            children: [
              {
                path: "wait",
                components: {
                  default: ManagedCredentialRequestsWait,
                  sidebar: VaultSidebar,
                },
                props: {
                  default: true,
                  sidebar: true,
                },
                beforeEnter: ifAuthenticated,
              },
              {
                path: "approved",
                components: {
                  default: ManagedCredentialRequestsApproved,
                  sidebar: VaultSidebar,
                },
                props: {
                  default: true,
                  sidebar: true,
                },
                beforeEnter: ifAuthenticated,
              },
              {
                path: "not-approved",
                components: {
                  default: ManagedCredentialRequestsNotApproved,
                  sidebar: VaultSidebar,
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
            path: "maintenance",
            name: "Maintenance Detail",
            components: {
              default: MaintenanceDetails,
              sidebar: VaultSidebar,
            },
            beforeEnter: ifAuthenticated,
          },
        ],
      },
    ],
  },
  // {
  //   path: "/createcredential",
  //   name: "Credential Create",
  //   components: {
  //     default: CredentialCreatePage,
  //   },
  //   beforeEnter: ifAuthenticated,
  // },
  // {
  //   path: "/credentials",
  //   components: {
  //     default: ManagedCredentialsNav,
  //     sidebar: VaultSidebar,
  //   },
  //   props: {
  //     default: true,
  //     sidebar: true,
  //   },
  //   beforeEnter: ifAuthenticated,
  //   children: [
  //     {
  //       path: "detail/:id",
  //       name: "Credential Detail",
  //       components: {
  //         default: ManagedCredentialDetails,
  //         sidebar: VaultSidebar,
  //       },
  //       props: {
  //         default: true,
  //         sidebar: true,
  //       },
  //       beforeEnter: ifAuthenticated,
  //     },
  //     {
  //       path: "usages/:id",
  //       name: "Credential Last Usages",
  //       components: {
  //         default: ManagedCredentialLastUsages,
  //         sidebar: VaultSidebar,
  //       },
  //       props: {
  //         default: true,
  //         sidebar: true,
  //       },
  //       beforeEnter: ifAuthenticated,
  //     },
  //     {
  //       path: "history/:id",
  //       name: "Credential Change History",
  //       components: {
  //         default: ManagedCredentialChangeHistory,
  //         sidebar: VaultSidebar,
  //       },
  //       props: {
  //         default: true,
  //         sidebar: true,
  //       },
  //       beforeEnter: ifAuthenticated,
  //     },
  //     {
  //       path: "permissions/:id",
  //       name: "Credential Users Permissions",
  //       components: {
  //         default: ManagedCredentialUsersPermissions,
  //         sidebar: VaultSidebar,
  //       },
  //       props: {
  //         default: true,
  //         sidebar: true,
  //       },
  //       beforeEnter: ifAuthenticated,
  //     },
  //     {
  //       path: "share/:id",
  //       name: "Credential Share Links",
  //       components: {
  //         default: ManagedCredentialShareLinks,
  //         sidebar: VaultSidebar,
  //       },
  //       props: {
  //         default: true,
  //         sidebar: true,
  //       },
  //       beforeEnter: ifAuthenticated,
  //     },
  //     {
  //       path: "options/:id",
  //       name: "Credential Options",
  //       components: {
  //         default: ManagedCredentialOptions,
  //         sidebar: VaultSidebar,
  //       },
  //       props: {
  //         default: true,
  //         sidebar: true,
  //       },
  //       beforeEnter: ifAuthenticated,
  //     },
  //     {
  //       path: "maintenance",
  //       name: "Maintenance Detail",
  //       components: {
  //         default: MaintenanceDetails,
  //         sidebar: VaultSidebar,
  //       },
  //       beforeEnter: ifAuthenticated,
  //     },
  //   ],
  // },
];
