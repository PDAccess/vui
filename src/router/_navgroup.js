export default {
  items: [
    {
      name: "Group Detail",
      url: "/groups/detail",
      icon: "icon-directions",
      role: "USER"
    },
    {
      name: "Activities",
      icon: "icon-layers",
      role: "ADMIN",
      children: [
        {
          name: "Proxy",
          url: "/groups/proxyactivities",
          icon: "cui-screen-desktop",
        },
        {
          name: "Agent",
          url: "/groups/agentactivities",
          icon: "fa fa-terminal",
        },
        {
          name: "Vault",
          url: "/groups/vaultactivities",
          icon: "fa fa-id-card",
        },
      ],
    },
    {
      name: "Policy",
      icon: "icon-eye",
      role: "ADMIN",
      children: [
        {
          name: "Session",
          url: "/groups/grouppolicy",
          icon: "icon-eye",
        },
        {
          name: "Agent",
          url: "/groups/agentpolicy",
          icon: "fa fa-eye",
        },
        {
          name: "Sudo",
          url: "/groups/sudopolicy",
          icon: "fa fa-eye",
        },
        {
          name: "Tacacs",
          url: "/groups/tacacspolicy",
          icon: "fa fa-server",
        }
      ],
    },
    {
      name: "Members",
      url: "/groups/users",
      icon: "fa fa-users",
      role: "ADMIN"
    },
    {
      name: "Credentials",
      url: "/groups/credentials/list",
      icon: "fa fa-address-book",
      role: "USER"
    },
    {
      name: "Alarms",
      url: "/groups/alarms",
      icon: "fa fa-bell",
      role: "ADMIN"
    },
    {
      name: "Maintenance",
      url: "/groups/maintenance",
      icon: "fa fa-wrench",
      role: "ADMIN"
    },
    {
      name: "Settings",
      url: "/groups/settings",
      icon: "fa fa-cog",
      role: "ADMIN"
    },
  ],
};
