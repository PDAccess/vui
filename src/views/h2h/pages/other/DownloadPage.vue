<template>
  <b-tabs pills card>
    <b-tab title="Desktop Client">
      <b-card class="text-center" style="border: none">
        <img src="@/assets/img/pda2.png" width="250" alt="PDAccess Logo" />
        <p class="mt-2">
          You can download the PDAccess Client application links below that
          versions for Mac and Windows. With the PDAccess Client application,
          you can connect and modify the database and terminal proxy services.
          View of an ​interface is now so simple and convenient to connect your
          services are now agile and very easy.
        </p>
        <br />
        <hr />
        <br />
        <b-row>
          <b-col sm="6">
            <b-card class="shadow tab-card">
              <img
                style="width: 100%"
                src="@/assets/img/terminal.png"
                alt="PDAccess Logo"
              />
              <p style="margin-top: 20px; font-size: 20px">Client (Terminal)</p>
            </b-card>
          </b-col>
          <b-col sm="6">
            <b-card class="shadow tab-card">
              <img
                style="width: 100%"
                src="@/assets/img/database.png"
                alt="PDAccess Logo"
              />
              <p style="margin-top: 20px; font-size: 20px">Client (Database)</p>
            </b-card>
          </b-col>
        </b-row>
        <hr />
        <b-row style="margin-bottom: 50px; margin-top: 50px">
          <b-col class="d-flex justify-content-center">
            <h1>PDAccess Desktop Client</h1>
          </b-col>
        </b-row>
        <b-row style="margin-bottom: 50px" class="justify-content-center">
          <b-col sm="3" class="justify-content-center">
            <b-card class="shadow tab-card">
              <b-badge
                variant="primary"
                style="position: absolute; top: 5px; right: 5px"
              >
                <i class="fa fa-star mr-1" aria-hidden="true"></i>New Version
              </b-badge>
              <h5>Latest Version 1.4</h5>
              <br />
              <b-button
                variant="outline-primary"
                v-show="curOs == 'Windows'"
                :href="windowsLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Windows
              </b-button>
              <b-button
                variant="outline-primary"
                v-show="curOs == 'MacOS'"
                :href="macLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Mac
              </b-button>
              <b-button
                variant="outline-primary"
                v-show="curOs == 'Linux'"
                :href="linuxLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Linux
              </b-button>
              <b-button
                variant="outline-primary"
                v-show="curOs == 'UNIX'"
                :href="linuxLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Linux
              </b-button>
            </b-card>
          </b-col>
          <b-col sm="3" class="justify-content-center">
            <b-card class="shadow tab-card">
              <b-badge
                variant="primary"
                style="position: absolute; top: 5px; right: 5px"
              >
                <i class="fa fa-star mr-1" aria-hidden="true"></i>Beta Version
              </b-badge>
              <h5>Latest Beta Version 1.5</h5>
              <br />
              <b-button
                variant="outline-primary"
                v-show="curOs == 'Windows'"
                :href="windowsBetaLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Windows
              </b-button>
              <b-button
                variant="outline-primary"
                v-show="curOs == 'MacOS'"
                :href="macBetaLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Mac
              </b-button>
              <b-button
                variant="outline-primary"
                v-show="curOs == 'Linux'"
                :href="linuxBetaLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Linux
              </b-button>
              <b-button
                variant="outline-primary"
                v-show="curOs == 'UNIX'"
                :href="linuxBetaLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Linux
              </b-button>
            </b-card>
          </b-col>
          <b-col sm="3" class="justify-content-center">
            <b-card class="shadow tab-card">
              <h5>Version 1.0</h5>
              <br />
              <b-button
                variant="outline-primary"
                v-show="curOs == 'Windows'"
                :href="windowsLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Windows
              </b-button>
              <b-button
                variant="outline-primary"
                v-show="curOs == 'MacOS'"
                :href="macLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Mac
              </b-button>
              <b-button
                variant="outline-primary"
                v-show="curOs == 'Linux'"
                :href="linuxLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Linux
              </b-button>
              <b-button
                variant="outline-primary"
                v-show="curOs == 'UNIX'"
                :href="linuxLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Linux
              </b-button>
            </b-card>
          </b-col>
          <b-col sm="3" class="justify-content-center">
            <b-card class="shadow tab-card">
              <h5>Version 0.9</h5>
              <br />
              <b-button
                variant="outline-primary"
                v-show="curOs == 'Windows'"
                :href="windowsLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Windows
              </b-button>
              <b-button
                variant="outline-primary"
                v-show="curOs == 'MacOS'"
                :href="macLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Mac
              </b-button>
              <b-button
                variant="outline-primary"
                v-show="curOs == 'Linux'"
                :href="linuxLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Linux
              </b-button>
              <b-button
                variant="outline-primary"
                v-show="curOs == 'UNIX'"
                :href="linuxLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Linux
              </b-button>
            </b-card>
          </b-col>
        </b-row>
        <hr />
      </b-card>
    </b-tab>
    <b-tab title="Unix Agent">
      <b-card class="text-center" style="border: none">
        <img src="@/assets/img/pda2.png" width="250" alt="PDAccess Logo" />
        <p class="mt-2">
          You can download the PDAccess agent, you can easily and agile setup
          for specified operating systems.
        </p>
        <hr />
        <b-row style="margin-bottom: 50px; margin-top: 50px">
          <b-col class="d-flex justify-content-center">
            <h1>Unix/Linux Agent</h1>
          </b-col>
        </b-row>
        <b-row style="margin-bottom: 50px">
          <b-col sm="4" class="ustify-content-center">
            <b-card class="shadow tab-card">
              <img
                src="@/assets/img/ubuntu.png"
                height="100"
                width="100"
                alt="Ubuntu"
              />
              <h5>Ubuntu</h5>
              <br />
              <b-button variant="outline-primary" :href="nagentLink">
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download Agent
              </b-button>
            </b-card>
          </b-col>
          <b-col sm="4" class="justify-content-center">
            <b-card class="shadow tab-card">
              <img
                src="@/assets/img/centos.png"
                height="100"
                width="100"
                alt="CentOS"
              />
              <h5>CentOS 7</h5>
              <br />
              <b-button variant="outline-primary" :href="nagentCentOSLink">
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download Agent
              </b-button>
            </b-card>
          </b-col>
          <b-col sm="4" class="justify-content-center">
            <b-card class="shadow tab-card">
              <img
                src="@/assets/img/redhat.png"
                height="100"
                width="100"
                alt="RedHat"
              />
              <h5>RedHat 7</h5>
              <br />
              <b-button variant="outline-primary" :href="nagentRedHatLink">
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download Agent
              </b-button>
            </b-card>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="2"></b-col>
          <b-col sm="4" class="justify-content-center">
            <b-card class="shadow tab-card">
              <img
                src="@/assets/img/centos.png"
                height="100"
                width="100"
                alt="CentOS"
              />
              <h5>CentOS 5</h5>
              <br />
              <b-button variant="outline-primary" :href="nagentCentOS5Link">
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download Agent
              </b-button>
            </b-card>
          </b-col>
          <b-col sm="4" class="justify-content-center">
            <b-card class="shadow tab-card">
              <img
                src="@/assets/img/oracle-linux.png"
                height="100"
                width="100"
                alt="Oracle"
              />
              <h5>Oracle Linux</h5>
              <br />
              <b-button variant="outline-primary" :href="nagentOracleLink">
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download Agent
              </b-button>
            </b-card>
          </b-col>
          <b-col lg="2"></b-col>
        </b-row>
        <hr />
      </b-card>
    </b-tab>
    <b-tab title="CLI Client">
      <b-card class="text-center" style="border: none">
        <img src="@/assets/img/pda2.png" width="250" alt="PDAccess Logo" />
        <p class="mt-2">
          You can download the PDAccess CLI Client application links below that
          versions for Mac, Windows and Linux operating system. By using the
          PDAccess CLI Client, you can directly access the services in PDAccess
          through the applications you want and perform your operations
          directly. With the flexible structure of the PDAccess CLI Client, you
          can speed up your work on services.
        </p>
        <br />
        <hr />
        <br />
        <b-row>
          <b-col sm="6">
            <b-card class="shadow tab-card">
              <img
                style="width: 100%"
                src="@/assets/img/cli-connector.png"
                alt="PDAccess Logo"
              />
              <p style="margin-top: 20px; font-size: 20px">CLI Client</p>
            </b-card>
          </b-col>
          <b-col sm="6">
            <b-card class="shadow tab-card">
              <img
                style="width: 100%"
                src="@/assets/img/cli-connect.png"
                alt="PDAccess Logo"
              />
              <p style="margin-top: 20px; font-size: 20px">Client Connector</p>
            </b-card>
          </b-col>
        </b-row>
        <hr />
        <b-row style="margin-bottom: 50px; margin-top: 50px">
          <b-col class="d-flex justify-content-center">
            <h1>PDAccess CLI Client</h1>
          </b-col>
        </b-row>
        <b-row style="margin-bottom: 50px" class="justify-content-center">
          <b-col sm="4" class="justify-content-center">
            <b-card class="shadow tab-card">
              <b-badge
                variant="primary"
                style="position: absolute; top: 5px; right: 5px"
              >
                <i class="fa fa-star mr-1" aria-hidden="true"></i>New Version
              </b-badge>
              <h5>Latest Version 1.1</h5>
              <br />
              <b-button
                variant="outline-primary"
                v-show="curOs == 'Windows'"
                :href="windowsConnectorLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Windows
              </b-button>
              <b-button
                variant="outline-primary"
                v-show="curOs == 'MacOS'"
                :href="macConnectorLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Mac
              </b-button>
              <b-button
                variant="outline-primary"
                v-show="curOs == 'Linux'"
                :href="linuxConnectorLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Linux
              </b-button>
              <b-button
                variant="outline-primary"
                v-show="curOs == 'UNIX'"
                :href="linuxConnectorLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Linux
              </b-button>
            </b-card>
          </b-col>
          <b-col sm="4" class="justify-content-center">
            <b-card class="shadow tab-card">
              <h5>Version 1.0</h5>
              <br />
              <b-button
                variant="outline-primary"
                v-show="curOs == 'Windows'"
                :href="windowsConnectorLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Windows
              </b-button>
              <b-button
                variant="outline-primary"
                v-show="curOs == 'MacOS'"
                :href="macConnectorLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Mac
              </b-button>
              <b-button
                variant="outline-primary"
                v-show="curOs == 'Linux'"
                :href="linuxConnectorLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Linux
              </b-button>
              <b-button
                variant="outline-primary"
                v-show="curOs == 'UNIX'"
                :href="linuxConnectorLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Linux
              </b-button>
            </b-card>
          </b-col>
          <b-col sm="4" class="justify-content-center">
            <b-card class="shadow tab-card">
              <h5>Version 0.9</h5>
              <br />
              <b-button
                variant="outline-primary"
                v-show="curOs == 'Windows'"
                :href="windowsConnectorLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Windows
              </b-button>
              <b-button
                variant="outline-primary"
                v-show="curOs == 'MacOS'"
                :href="macConnectorLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Mac
              </b-button>
              <b-button
                variant="outline-primary"
                v-show="curOs == 'Linux'"
                :href="linuxConnectorLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Linux
              </b-button>
              <b-button
                variant="outline-primary"
                v-show="curOs == 'UNIX'"
                :href="linuxConnectorLink"
              >
                <i class="fa fa-cloud-download mr-2" aria-hidden="true"></i
                >Download for Linux
              </b-button>
            </b-card>
          </b-col>
        </b-row>
        <hr />
      </b-card>
    </b-tab>
  </b-tabs>
</template>
<script>
export default {
  data() {
    return {
      curOs: "",
      macLink: "/download/PDAccess-1.4.0-mac.zip",
      windowsLink: "/download/PDAccess 1.4.0.exe",
      linuxLink: "/download/PDAccess 1.4.0.AppImage",
      macBetaLink: "/download/PDAccess-1.5.0-mac.zip",
      windowsBetaLink: "/download/PDAccess 1.5.0.exe",
      linuxBetaLink: "/download/PDAccess 1.5.0.AppImage",
      macConnectorLink: "/client-connector/pdaccess-desktop-macos-amd64",
      windowsConnectorLink: "/client-connector/pdaccess-desktop-windows-amd64",
      linuxConnectorLink: "/client-connector/pdaccess-desktop-linux-amd64",
      nagentLink: "/download-linuxagent/pdagent-ubuntu18_04-amd64.run",
      nagentCentOSLink: "/download-linuxagent/pdagent-centos7-amd64.run",
      nagentRedHatLink: "/download-linuxagent/pdagent-redhat7-amd64.run",
      nagentOracleLink: "/download-linuxagent/pdagent-oracle7-amd64.run",
      nagentCentOS5Link: "/download-linuxagent/pdagent-centos5-amd64.run",
    };
  },
  created() {
    if (navigator.appVersion.indexOf("Win") != -1) this.curOs = "Windows";
    if (navigator.appVersion.indexOf("Mac") != -1) this.curOs = "MacOS";
    if (navigator.appVersion.indexOf("X11") != -1) this.curOs = "UNIX";
    if (navigator.appVersion.indexOf("Linux") != -1) this.curOs = "Linux";
  },
};
</script>
<style scoped>
.tab-card {
  cursor: pointer;
  -webkit-transition: box-shadow 0.6s ease-out !important;
  box-shadow: 0.8px 0.9px 3px grey !important;
}
.tab-card:hover {
  box-shadow: 1px 8px 20px grey !important;
  -webkit-transition: box-shadow 0.6s ease-in !important;
}
</style>
