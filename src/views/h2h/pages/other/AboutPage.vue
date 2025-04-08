<template>
  <div class="animated fadeIn">
    <p-card :cardBody="false" class="text-left">
      <h2>Getting Start with PDAccess</h2>
      <h3>About menu</h3>
      <p>
        PDAccess is a cloud security system that helps to manage their cloud in
        a secure, agile and compliant way. PDAccess can be used by company
        employees, vendor companies and contractors. PDAccess is a human-centric
        firewall. It's like a layer between the user and the cloud. We manage
        the all-access coming from inside.
      </p>
      <h3>What is PDAccess?</h3>
      <p>
        PDAccess (Proxy Driven Access) is a cloud security system that empowers
        to companies fully check and control their security services department
        to access with using flexible protocols. Also, it helps to manage the
        store data on the cloud in a secure, agile and compliant way.
      </p>
      <h3>Structure</h3>
      <p>
        PDAcess has two main access system. First of all, the main Access for
        the users on a desktop client. Users can enter their systems by using
        PDAccess. The other Access is for the admin users. Admin users may
        control and check whole users who are already registered on their
        company system on the web console. Both are using HTTP/HTTPS connection
        through the Services.
      </p>
      <h3>Service</h3>
      <p>
        There are many services on PDAccess and services that demonstrate IT
        environment services. To exemplify, SSH is a terminal service. Also, RDP
        is a terminal service. Plus all databases are service. In PDAccess, the
        administration can control services with the system using by using all
        these instances.
      </p>
      <h3>Session</h3>
      <p>
        Sessions are held record and report for each service Access on the
        system. It can be useful for each service and each user.
      </p>
      <h3>Action</h3>
      <p>
        Actions are the system that represents operations that​ are done in a
        session by users. An Action can be a shell command or SQL query or HTTP
        request
      </p>
      <p>
        Copyright @ {{ currentYear }}
        <a href="https://www.pdaccess.com"
          ><img alt="h2hsecure logo" src="@/assets/img/h2h.png"
        /></a>
      </p>
      <p>Version: {{ gitData }}</p>
    </p-card>
    <div v-show="gitlog.length != 0">
        <h3>Change Logs</h3>
        <b-table striped small fixed hover :items="gitlog" :fields="fields">
          <template v-slot:cell(commiter)="data">
            {{ data.value.date }}
          </template>
          <template v-slot:cell(abbreviated_commit)="data">
            {{ data.value }}
          </template>
          <template v-slot:cell(sanitized_subject_line)="data">
            {{ data.value }}
          </template>
          <template v-slot:cell(subject)="data">
            {{ data.value }}
          </template>
        </b-table>
      </div>
  </div>
</template>
<script>
import Logs from "@/assets/gitlog.json";
import GitData from "@/assets/hash.json";

export default {
  data() {
    return {
      currentYear: new Date().getFullYear(),
      gitData: GitData,
      gitlog: Logs,
      fields: [
        "commiter",
        "abbreviated_commit",
        "sanitized_subject_line",
        "subject",
      ],
    };
  },
};
</script>
