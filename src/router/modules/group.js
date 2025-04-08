const DefaultContainer = () => import("@/containers/DefaultContainer");

const GroupSidebar = () => import("@/containers/GroupSidebar");

const CredentialCreatePage = () =>
  import("@/views/h2h/pages/group/credential/CredentialCreatePage");
//pages - group
const GroupPolicyPage = () => import("@/views/h2h/pages/group/GroupPolicyPage");
const GroupPage = () => import("@/views/h2h/pages/group/GroupPage");
//const PublicGroupPage = () => import("@/views/h2h/pages/group/PublicGroupPage");
const CreateGroup = () => import("@/views/h2h/pages/group/CreateGroup");
const GroupNav = () => import("@/views/h2h/pages/group/GroupNav");
const GroupDetail = () => import("@/views/h2h/pages/group/GroupDetail");
const GroupServices = () => import("@/views/h2h/pages/group/GroupServices");
const GroupUsers = () => import("@/views/h2h/pages/group/GroupUsers");
const GroupDelete = () => import("@/views/h2h/pages/group/GroupDelete");
const GroupPolicyCreatePage = () =>
  import("@/views/h2h/pages/group/GroupPolicyCreatePage");
const GroupPolicyEditPage = () =>
  import("@/views/h2h/pages/group/GroupPolicyEditPage");
const GroupAlarmsPage = () => import("@/views/h2h/pages/group/GroupAlarmsPage");
const CreateGroupAlarmPage = () =>
  import("@/views/h2h/pages/group/CreateGroupAlarmPage");
const EditGroupAlarmPage = () =>
  import("@/views/h2h/pages/group/EditGroupAlarmPage");
const GroupEditPage = () => import("@/views/h2h/pages/group/GroupEditPage");
const GroupSettingsPage = () =>
  import("@/views/h2h/pages/group/GroupSettingsPage");
const GroupActivitiesPage = () =>
  import("@/views/h2h/pages/group/GroupActivitiesPage");
const GroupProxyActivitiesPage = () =>
  import("@/views/h2h/pages/group/GroupProxyActivities");
const GroupVaultActivitiesPage = () =>
  import("@/views/h2h/pages/group/GroupVaultActivities");
const GroupAuthActivitiesPage = () =>
  import("@/views/h2h/pages/group/GroupAuthActivitiesPage");
const GroupAgentActivitiesPage = () =>
  import("@/views/h2h/pages/group/GroupAgentActivities");
const GroupAgentPolicyPage = () =>
  import("@/views/h2h/pages/group/GroupAgentPolicy");
const GroupSudoPolicyPage = () =>
  import("@/views/h2h/pages/group/GroupSudoPolicy");
const GroupTacacsPolicyPage = () =>
  import("@/views/h2h/pages/group/GroupTacacsPolicy");
const GroupAgentFilePolicyCreatePage = () =>
  import("@/views/h2h/pages/group/GroupAgentFilePolicyCreate");
const GroupAgentCommandPolicyCreatePage = () =>
  import("@/views/h2h/pages/group/GroupAgentCommandPolicyCreate");
const GroupAgentSudoPolicyCreatePage = () =>
  import("@/views/h2h/pages/group/GroupAgentSudoPolicyCreatePage");
const GroupTacacsPolicyCreatePage = () =>
  import("@/views/h2h/pages/group/GroupTacacsPolicyCreatePage");
const GroupTacacsPolicyEditPage = () =>
  import("@/views/h2h/pages/group/GroupTacacsPolicyEditPage");
const GroupTacacsPrivPolicyCreatePage = () =>
  import("@/views/h2h/pages/group/GroupTacacsPrivPolicyCreatePage");
const GroupTacacsPrivPolicyEditPage = () =>
  import("@/views/h2h/pages/group/GroupTacacsPrivPolicyEditPage");
const GroupAgentFilePolicyEditPage = () =>
  import("@/views/h2h/pages/group/GroupAgentFilePolicyEdit");
const GroupAgentCommandPolicyEditPage = () =>
  import("@/views/h2h/pages/group/GroupAgentCommandPolicyEdit");
const GroupAgentSudoPolicyEditPage = () =>
  import("@/views/h2h/pages/group/GroupAgentSudoPolicyEditPage");
const GroupMaintenancePage = () =>
  import("@/views/h2h/pages/group/GroupMaintenancePage");
const GroupMaintenanceCreatePage = () =>
  import("@/views/h2h/pages/group/GroupMaintenanceCreatePage");
const GroupMaintenanceEditPage = () =>
  import("@/views/h2h/pages/group/GroupMaintenanceEditPage");

const CredentialListPage = () =>
  import("@/views/h2h/pages/group/credential/CredentialListPage");
const CredentialPermissionsPage = () =>
  import("@/views/h2h/pages/group/credential/CredentialPermissionsPage");
const CredentialEditPermissionsPage = () =>
  import("@/views/h2h/pages/group/credential/CredentialEditPermissionsPage");
const CredentialNav = () =>
  import("@/views/h2h/pages/group/credential/CredentialNav");

import ifAuthenticated from "./auth";

export default [
  {
    path: "/groups",
    redirect: "/groups/nav/all",
    component: DefaultContainer,
    children: [
      {
        path: "nav",
        redirect: "/groups/nav/all",
        name: "Groups",
        component: GroupNav,
        beforeEnter: ifAuthenticated,
        children: [
          {
            path: "all",
            name: "All Groups",
            component: GroupPage,
            beforeEnter: ifAuthenticated,
          },
          {
            path: "yours",
            name: "Your Groups",
            component: GroupPage,
            beforeEnter: ifAuthenticated,
          },
          {
            path: "joined",
            name: "Joined Groups",
            component: GroupPage,
            beforeEnter: ifAuthenticated,
          },
        ],
      },
      {
        path: "grouppolicy/:id",
        name: "Group Policy",
        components: {
          default: GroupPolicyPage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "createpolicy/:id/:behavior",
        name: "Create Group Policy",
        components: {
          default: GroupPolicyCreatePage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: ":groupid/editpolicy/:policyid",
        name: "Edit Group Policy",
        components: {
          default: GroupPolicyEditPage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "creategroup",
        name: "Create Group",
        component: CreateGroup,
        beforeEnter: ifAuthenticated,
      },
      {
        path: "detail/:id",
        name: "Group Detail",
        components: {
          default: GroupDetail,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "services/:id",
        name: "Group Services",
        components: {
          default: GroupServices,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "users/:id",
        name: "Group Users",
        meta: {
          label: "Group Members",
        },
        components: {
          default: GroupUsers,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "groupdelete/:id",
        name: "Group Delete",

        components: {
          default: GroupDelete,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "alarms/:id",
        name: "Group Alarms",
        components: {
          default: GroupAlarmsPage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "createalarm/:id",
        name: "Create Group Alarm",
        components: {
          default: CreateGroupAlarmPage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: ":id/editalarm/:alarmid",
        name: "Edit Group Alarm",
        components: {
          default: EditGroupAlarmPage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "edit/:id",
        name: "Edit Group",
        components: {
          default: GroupEditPage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "maintenance/:id",
        components: {
          default: { 
            render(c) {
              return c("router-view");
            }
          },
          sidebar: GroupSidebar
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
        children: [
          {
            path: "/",
            name: "Group Maintenance",
            meta: {
              label: "Group Maintenance",
            },
            components: {
              default: GroupMaintenancePage,
            },
            props: {
              default: true,
              sidebar: true,
            },
          },
          {
            path: "create",
            name: "Create Group Maintenance",
            meta: {
              label: "Create Group Maintenance",
            },
            components: {
              default: GroupMaintenanceCreatePage,
            },
            props: {
              default: true,
              sidebar: true,
            },
          },
          {
            path: "edit/:maintenanceId",
            name: "Edit Group Maintenance",
            meta: {
              label: "Edit Group Maintenance",
            },
            components: {
              default: GroupMaintenanceEditPage,
            },
            props: {
              default: true,
              sidebar: true,
            },
          }
        ],
      },
      {
        path: "settings/:id",
        name: "Group Settings",
        components: {
          default: GroupSettingsPage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "credentials",
        //redirect: (to) => ({ path: `credentials/list/${to.params.id}` }),
        components: {
          default: CredentialNav,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
        children: [
          {
            path: "list/:id?",
            name: "Group Credentials",
            components: {
              default: CredentialListPage,
              sidebar: GroupSidebar,
            },
            props: {
              default: true,
              sidebar: true,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "permissions/:id?",
            name: "Credential Permissions",
            components: {
              default: CredentialPermissionsPage,
              sidebar: GroupSidebar,
            },
            beforeEnter: ifAuthenticated,
          },
          {
            path: "createcredential/:id",
            name: "Create Credential",
            components: {
              default: CredentialCreatePage,
              sidebar: GroupSidebar,
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
        path: "activities/:id",
        name: "Group Activities",
        components: {
          default: GroupActivitiesPage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "proxyactivities/:id",
        name: "Group Proxy Activities",
        components: {
          default: GroupProxyActivitiesPage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "agentactivities/:id",
        name: "Group Agent Activities",
        components: {
          default: GroupAgentActivitiesPage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "vaultactivities/:id",
        name: "Group Vault Activities",
        components: {
          default: GroupVaultActivitiesPage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "authentications/:id",
        name: "Group Auth Activities",
        components: {
          default: GroupAuthActivitiesPage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "agentpolicy/:id",
        name: "Group Agent Policy",
        components: {
          default: GroupAgentPolicyPage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "sudopolicy/:id",
        name: "Group Sudo Policy",
        components: {
          default: GroupSudoPolicyPage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "tacacspolicy/:id",
        name: "Group Tacacs Policy",
        components: {
          default: GroupTacacsPolicyPage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: ":id/file-agentpolicy/:policyid",
        name: "Edit Group Agent File Policy",
        components: {
          default: GroupAgentFilePolicyEditPage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: ":id/command-agentpolicy/:policyid",
        name: "Edit Group Agent Command Policy",
        components: {
          default: GroupAgentCommandPolicyEditPage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "create-file-agentpolicy/:id",
        name: "Create Group Agent File Policy",
        components: {
          default: GroupAgentFilePolicyCreatePage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "create-command-agentpolicy/:id",
        name: "Create Group Agent Command Policy",
        components: {
          default: GroupAgentCommandPolicyCreatePage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "create-sudo-agentpolicy/:id",
        name: "Create Group Agent Sudo Policy",
        components: {
          default: GroupAgentSudoPolicyCreatePage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "create-tacacspolicy/:type/:id",
        name: "Create Tacacs Policy",
        components: {
          default: GroupTacacsPolicyCreatePage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: "create-tacacsprivpolicy/:id",
        name: "Create Tacacs Privilege Policy",
        components: {
          default: GroupTacacsPrivPolicyCreatePage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: ":id/tacacsprivpolicy/:privId",
        name: "Edit Tacacs Privileged",
        components: {
          default: GroupTacacsPrivPolicyEditPage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: ":id/tacacspolicy/:policyid",
        name: "Edit Tacacs Policy",
        components: {
          default: GroupTacacsPolicyEditPage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: ":groupid/sudo-agentpolicy/:policyid",
        name: "Edit Group Sudo Agent Policy",
        components: {
          default: GroupAgentSudoPolicyEditPage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
      {
        path: ":id/credential/:credentialid/permissions",
        name: "Edit Credential Permissions",
        components: {
          default: CredentialEditPermissionsPage,
          sidebar: GroupSidebar,
        },
        props: {
          default: true,
          sidebar: true,
        },
        beforeEnter: ifAuthenticated,
      },
    ],
  },
];
