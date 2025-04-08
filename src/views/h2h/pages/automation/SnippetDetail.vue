<template>
  <div class="animated fadeIn">
    <p-card>
      <div class="text-center mb-4" style="margin-top: 5px">
        <b-button disabled variant="link" class="profile-button">
          <p-profile-avatar
            :profileUsername="snippetInfo.username"
            :username="snippetInfo.username"
            :size="80"
            :imageWidth="'50px'"
            :imageHeight="'auto'"
            :username-show="false"
          />
        </b-button>
        <br /><br />
        <div class="h2 mb-0">{{ snippetInfo.snippetEntity.title }}</div>
        <div class="d-flex justify-content-center">
          <div
            :class="['inventory-logo', numberToOS()]"
            :title="snippetInfo.snippetEntity.operatingSystemId"
            v-b-tooltip.bottom
          ></div>
          <div
            :class="['inventory-logo', numberToService()]"
            :title="snippetInfo.snippetEntity.serviceTypeId"
            v-b-tooltip.bottom
          ></div>
        </div>
        <div class="d-flex justify-content-center">
          <span>
            {{ snippetInfo.snippetEntity.description }}
            <br /><br /><br />
            {{ snippetInfo.snippetEntity.info }}
            <a v-show="snippetInfo.snippetEntity.createdAt != null">
              <span>&#183;</span> Created at
              {{ snippetInfo.snippetEntity.createdAt | moment("calendar") }}</a
            >
            <br /><br />
            <b-button @click.stop="deleteSnippet" variant="danger" class="mr-2"
              >Delete Snippet</b-button
            >
            <b-button @click.stop="editSnippet" variant="success"
              >Edit Snippet</b-button
            >
          </span>
        </div>
      </div>
    </p-card>
  </div>
</template>
<script>
export default {
  props: ["id"],
  components: {
  },
  data() {
    return {
      username: "",
      items: [],
      snippetInfo: {
        snippetEntity: {
          description: "",
          title: "",
          deletedAt: "",
          snippetId: "",
          userId: "",
          info: "",
        },
        username: "",
      },
    };
  },
  computed: {
    responsive() {
      return screen.width < 500;
    },
  },
  methods: {
    deleteSnippet() {
      this.$http
        .delete("/api/v1/snippet/" + this.id)
        .then((response) => {
          this.$router.push(
            this.$route.query.redirect || "/snippets/nav/yoursnippets"
          );
        })
        .catch((error) => {
          console.log("error ", error);
        });
    },
    editSnippet() {
      this.$router.push(
        this.$route.query.redirect || "/snippets/edit/" + this.id
      );
    },
    numberToOS() {
      let OSId = this.snippetInfo.snippetEntity.operatingSystemId;
      if (OSId == 0) return "ubuntu";
      else if (OSId == 1) return "redhat";
      else if (OSId == 2) return "debian";
      else if (OSId == 3) return "centos";
      else if (OSId == 4) return "windows";
      else if (OSId == 5) return "unix";
      else if (OSId == 6) return "linux";
      else if (OSId == 7) return "solaris";
      else if (OSId == 8) return "cisco";
    },
    numberToService() {
      let serviceId = this.snippetInfo.snippetEntity.serviceTypeId;
      if (serviceId == 0) return "mysql";
      else if (serviceId == 1) return "postgresql";
      else if (serviceId == 2) return "mssql";
      else if (serviceId == 3) return "oracle";
      else if (serviceId == 4) return "ssh";
      else if (serviceId == 5) return "telnet";
      else if (serviceId == 6) return "rdp";
      else if (serviceId == 7) return "vnc";
    },
  },
  created() {
    this.$http
      .get("/api/v1/snippet/info/" + this.id)
      .then((response) => {
        this.snippetInfo = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>
<style scoped>
.inventory-logo {
  width: 70px;
  height: 50px;
  margin-top: 15px;
}
</style>

