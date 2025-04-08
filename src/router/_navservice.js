export default {
  items: [
    {
      name: "Service Detail",
      url: "/service/detail",
      icon: "icon-direction",
    },
    {
      name: "Activities",
      icon: "icon-layers",
      children: [
        {
          name: "Proxy",
          url: "/service/proxyActivities",
          icon: "cui-screen-desktop",
        },
        /*
        {
          name: "Agent",
          url: "/service/agentActivities/command",
          icon: "fa fa-terminal",
        },
        */
        {
          name: "Agent",
          url: "/service/agentShellActivities/sessions",
          icon: "fa fa-file-text",
        },
        {
          name: "Tacacs",
          url: "/service/tacacs/authentication",
          icon: "fa fa-server",
        },
        {
          name: "Status",
          url: "/service/agentActivities/status",
          icon: "fa fa-eye",
        },
        {
          name: "Vault",
          url: "/service/vaultActivities",
          icon: "fa fa-id-card",
        },
        {
          name: "Authentication",
          url: "/service/authentications",
          icon: "fa fa-sign-in",
        },
      ],
    },
    {
      name: "Local Accounts",
      url: "/service/accounts",
      icon: "fa fa-key",
    },
    {
      name: "Members",
      url: "/service/serviceuser",
      icon: "fa fa-users",
    },
    {
      name: "Alarms",
      url: "/service/alarms",
      icon: "fa fa-bell",
    },
    {
      name: "Settings",
      url: "/service/settings",
      icon: "fa fa-cog",
    },
  ],
};
