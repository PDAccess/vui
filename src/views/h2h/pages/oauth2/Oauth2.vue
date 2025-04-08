<template>
  <div class="animated fadeIn">
    <p-card :cardBody="false">
      <h6>
        Applications list don't belong to any user and can only be managed by
        admins.
      </h6>
      <hr />
      <b-row>
        <b-col class="d-flex justify-content-end">
          <b-button
            @click="newApplication()"
            class="mb-2"
            size="md"
            variant="success"
            >New application</b-button
          >
        </b-col>
      </b-row>
      <p-loading class="my-5" v-if="loading" message="Loading..." />
      <p-error
        v-else-if="errorStatus"
        :header="errorHeader"
        :errorResponse="errorResponse"
        @reload="$router.go()"
      />
      <p-initial
        v-else-if="items.length === 0"
        icon="folder-plus"
        header="Not found any Application."
        message="Please create a new Application"
      />
      <b-table v-else :fields="fields" :items="items" fixed>
        <template v-slot:cell(name)="data">
          <b-button @click="serviceClick(data.item.id)" size="md" variant="link"
            >{{ data.item.name }}
          </b-button>
        </template>

        <template v-slot:cell(url)="data">
          {{ data.item.callback_url }}
        </template>

        <template v-slot:cell(clients)="data">
          {{ data.item.clients }}
        </template>

        <template v-slot:cell(trusted)="data">
          {{ data.item.trusted == 1 ? "Y" : "N" }}
        </template>

        <template v-slot:cell(actions)="data">
          <b-dropdown
            id="dropdown-1"
            text="Action"
            variant="primary"
            class="user-actions"
          >
            <template slot="button-content">
              <i class="mr-1 fa fa-cogs" aria-hidden="true"></i>
            </template>
            <b-dropdown-item @click.stop="edit(data.item.id)" variant="primary"
              ><em class="mr-1 fa fa-pencil"></em>Edit
            </b-dropdown-item>
            <b-dropdown-item
              @click.stop="destroy(data.item.id)"
              variant="danger"
              ><em class="mr-1 fa fa-trash"></em>Destroy
            </b-dropdown-item>
          </b-dropdown>
        </template>
      </b-table>
    </p-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      errorStatus: false,
      errorHeader: "",
      errorResponse: "",
      loading: true,
      fields: [
        { key: "name", label: "Name" },
        { key: "callback_url", label: "Callback URL" },
        { key: "clients", label: "Clients" },
        { key: "trusted", label: "Trusted" },
        { key: "actions", label: "Actions" },
      ],
      items: [],
    };
  },
  methods: {
    newApplication() {
      this.$router.push(this.$route.query.redirect || "/admin/oauth2/create");
    },
    destroy(id) {
      this.$http
        .delete("/api/v1/oauth2/" + id)
        .then((response) => {
          this.$bvToast.toast(`Deleted Oauth2 application!`, {
            title: "Oauth2 Notification",
            variant: "success",
            autoHideDelay: 5000,
          });
          this.updateTable();
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
    edit(data) {
      this.$router.push({
        name: "Application Edit Oauth2",
        params: { id: data },
      });
    },
    serviceClick(data) {
      this.$router.push({ name: "Application Oauth2", params: { id: data } });
    },
    updateTable() {
      this.$http
        .get("/api/v1/oauth2")
        .then((response) => {
          this.items = response.data;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.errorStatus = true;
          this.errorResponse = error;
          this.errorHeader = "Something went wrong!";
        });
    },
  },
  created() {
    this.updateTable();
  },
};
</script>
