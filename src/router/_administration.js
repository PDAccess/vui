export default {
  items: [
    {
      name: "Administration",
      url: "/admin/statistics",
      icon: "icon-graph",
    },
    {
      name: "Realms",
      url: "/admin/realms/list",
      icon: "icon-people",
      realmAdmin: true,
    },
    {
      name: "Authentications",
      icon: "icon-login",
      url: "/admin/ldapsettings",
      children: [
        {
          name: "Ldap Auth",
          url: "/admin/ldap",
          icon: "fa fa-sitemap",
        },
        {
          name: "Portal Config",
          url: "/admin/auth",
          icon: "icon-home",
        },

        {
          name: "Logins",
          url: "/admin/authlog",
          icon: "icon-login",
        },
        {
          name: "OAuth2",
          url: "/admin/oauth2",
          icon: "icon-key",
        },
      ],
    },
    {
      name: "Proxies",
      icon: "fa fa-cogs",
      url: "/admin/proxy",
      children: [
        {
          name: "Radius",
          url: "/admin/radiusproxy",
          icon: "fa fa-wifi",
        },
        {
          name: "Ssh",
          url: "/admin/sshproxy",
          icon: "fa fa-terminal",
        },
        {
          name: "Tacacs",
          url: "/admin/tacacsproxy",
          icon: "fa fa-tty",
        },
        {
          name: "Ldap",
          url: "/admin/ldapconfig",
          icon: "fa fa-code",
        },
      ],
    },

    {
      name: "Users",
      icon: "icon-user",
      url: "/admin/users/list",
    },
    {
      name: "Monitoring",
      url: "/admin/monitoring",
      icon: "icon-chart",
    },
    {
      name: "Vault Settings",
      url: "/admin/vault",
      icon: "cui-shield",
    },
    {
      name: "Imports",
      url: "/admin/imports",
      icon: "fa fa-tasks",
    },
    {
      name: "Jobs",
      url: "/admin/jobs/allJobs",
      icon: "fa fa-briefcase",
    },
    {
      name: "Look & Feel",
      url: "/admin/lookfeel",
      icon: "icon-emotsmile",
    },
    {
      name: "Messages",
      url: "/admin/messages",
      icon: "icon-paper-plane",
    },
    {
      name: "System Settings",
      url: "/admin/system_settings",
      icon: "icon-settings",
    },
  ],
};
