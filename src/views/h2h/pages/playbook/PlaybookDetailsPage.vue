<template>
  <div>
    <p-card :cardBody="false">
      <b-link to="/playbook/nav/playbooks">Back to Playbooks</b-link>
      <hr />
      <p-loading v-if="playbookLoading | loading" class="my-5" message="Loading..." />
      <div v-else>
        <div class="d-flex justify-content-between container-nav">
          <div class="module-nav">
            <h4>{{ playbook.ansibleInstallerEntity.name }} Histories</h4>
            <h5 style="color: grey">
              {{ playbook.ansibleInstallerEntity.description }}
            </h5>
          </div>
          <div class="create-nav">
            <b-button variant="success" @click="runPlaybook">Run</b-button>
            <hr class="split-nav" />
          </div>
        </div>
        <div v-if="histories.length == 0">
          <p class="text-center">No records yet</p>
        </div>
        <b-table :items="histories" :fields="fields" v-else>
          <template v-slot:cell(id)="row">
            <span> #{{ row.item.id }}</span>
          </template>
          <template v-slot:cell(userEntity)="row">
            <b-button
              @click="userDetailPage(row.item.userEntity.userId)"
              variant="link"
              class="profile-button"
            >
              <p-profile-avatar
                :profileUsername="row.item.userEntity.username"
                :username="
                  row.item.userEntity.firstName +
                  ' ' +
                  row.item.userEntity.lastName
                "
                :size="30"
                :imageWidth="'30px'"
                :imageHeight="'auto'"
                :username-show="false"
              />
            </b-button>
          </template>
          <template v-slot:cell(createdAt)="row">
            <span>{{ row.item.createdAt | moment("calendar") }}</span>
          </template>
          <template v-slot:cell(success)="row">
            <span>{{ row.item.success ? "Successfull" : "Failure" }}</span>
          </template>
          <template v-slot:cell(finished)="row">
            <span>{{ !row.item.finished ? "Not" : "" }} Finished</span>
          </template>
        </b-table>
      </div>
    </p-card>
  </div>
</template>
<script>

export default {
  components: {
  },
  data() {
    return {
      loading: true,
      searchTerm: "",
      fields: [
        {
          label: "Playbook",
          key: "id",
          sortable: true,
        },
        {
          label: "Triggerer",
          key: "userEntity",
          sortable: true,
        },
        {
          label: "Is Success",
          key: "success",
          sortable: true,
        },
        {
          key: "finished",
          sortable: true,
        },
        {
          key: "createdAt",
          sortable: true,
        },
      ],
      conn: null,
      playbook: {
        ansibleInstallerEntity: {
          name: "",
          description: "",
        },
      },
      playbookStatus: null,
      histories: [],
      playbookLoading: true,
    };
  },
  methods: {
    runPlaybook(item) {
      this.$router.push(
        this.$route.query.redirect || "/playbook/result/" + this.$attrs.id
      );
    },
    userDetailPage(item) {
      this.$router.push({
        name: "User Detail",
        params: {
          id: item,
        },
      });
    },
  },
  watch: {
    searchTermFilter: function (val) {
      if (val.length >= 3) {
        this.searchFilter();
      }
    },
  },
  created() {
    let id = this.$attrs.id;

    this.$http
      .get("/api/v1/playbook/" + id)
      .then((response) => {
        this.playbook = response.data;
        this.playbookLoading = false;
      })
      .catch((error) => {
        this.$bvToast.toast(`Something went wrong!`, {
          title: "Ansible Notification",
          variant: "danger",
          autoHideDelay: 5000,
        });
        console.log(error);
      });
    this.$http
      .get("/api/v1/playbook/histories/" + id)
      .then((response) => {
        this.histories = response.data;
        this.loading = false;
      })
      .catch((error) => {
        this.$bvToast.toast(`Something went wrong!`, {
          title: "Ansible Notification",
          variant: "danger",
          autoHideDelay: 5000,
        });
        console.log(error);
      });
  },
};
</script>